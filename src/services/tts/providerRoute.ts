import {
  PROVIDER_LABELS,
  providerRequiresTtsVoice,
  providerTtsModelSupportsInstructions,
} from "../../constants/models";
import { RuntimeTtsBinaryRequestFormat } from "../../constants/providers/runtimeManifest";
import { translate } from "../../i18n";
import { AppLanguage, Provider } from "../../types";
import type { SpeechLanguage } from "../../types";
import { providerSupportsTtsLanguage } from "../../constants/providerSpeechLanguages";
import { getTtsListenLanguageLabel } from "../../constants/localTts";
import { getSpeechLanguageDefinition } from "../../constants/speechLanguages";
import { getDefaultTtsListenLanguageForLocale } from "../../i18n/localeRegistry";
import {
  parseQwenApiCredential,
  qwenRegionSupportsAppSpeech,
  resolveQwenApiEndpoint,
} from "../../utils/qwenRegion";

import {
  buildTtsRequestError,
  buildWavAudioFileFromPcm,
  createTtsTimeoutError,
  fetchWithTimeout,
  getGeminiAudioPart,
  getProviderTtsTimeoutMs,
  getSelectedProviderModel,
  getSelectedProviderVoice,
  requireProviderKey,
  TTS_PROVIDER_CONFIGS,
  TtsRequestError,
  TtsTimeoutError,
  writeBlobAudioFile,
  writeBase64AudioFile,
} from "./shared";

const TTS_RETRY_DELAYS_MS = [400, 1200];

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableTtsTransportError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  if (error.name === "AbortError") {
    return false;
  }

  if (error instanceof TtsTimeoutError) {
    return true;
  }

  if (error instanceof TtsRequestError) {
    return error.status === 429 || error.status >= 500;
  }

  const normalized = error.message.toLowerCase();

  return (
    normalized.includes("network request failed") ||
    normalized.includes("failed to fetch") ||
    normalized.includes("load failed")
  );
}

async function withTransientTtsRetries<T>(request: () => Promise<T>) {
  for (let attempt = 0; attempt <= TTS_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      const retryLimit =
        error instanceof TtsTimeoutError ? 1 : TTS_RETRY_DELAYS_MS.length;
      const shouldRetry =
        attempt < retryLimit && isRetryableTtsTransportError(error);

      if (!shouldRetry) {
        throw error;
      }

      await wait(TTS_RETRY_DELAYS_MS[attempt]);
    }
  }

  throw new Error("Speech synthesis retry loop ended unexpectedly.");
}

async function fetchTtsWithRetries(params: {
  abortSignal?: AbortSignal;
  init: RequestInit;
  input: RequestInfo | URL;
  language: AppLanguage;
  provider: Provider;
  timeoutMs: number;
}) {
  return withTransientTtsRetries(async () => {
    const response = await fetchWithTimeout(
      params.input,
      params.init,
      params.timeoutMs,
      () =>
        createTtsTimeoutError({
          provider: params.provider,
          language: params.language,
        }),
      params.abortSignal,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw buildTtsRequestError({
        provider: params.provider,
        status: response.status,
        errorText,
        language: params.language,
      });
    }

    return response;
  });
}

function buildBinaryTtsRequestBody(params: {
  instructions: string;
  requestFormat: RuntimeTtsBinaryRequestFormat;
  selectedModel: string;
  selectedVoice: string;
  text: string;
  previousText?: string;
  nextText?: string;
  speechLanguage: SpeechLanguage;
}) {
  switch (params.requestFormat) {
    case "elevenlabs-speech": {
      const supportsRequestStitching =
        params.selectedModel !== "eleven_v3";
      const supportsLanguageCode =
        params.selectedModel !== "eleven_multilingual_v2";
      return {
        text: params.text,
        model_id: params.selectedModel,
        ...(supportsLanguageCode
          ? {
              language_code:
                getSpeechLanguageDefinition(params.speechLanguage)
                  .providerCode,
            }
          : {}),
        ...(supportsRequestStitching && params.previousText?.trim()
          ? { previous_text: params.previousText.trim() }
          : {}),
        ...(supportsRequestStitching && params.nextText?.trim()
          ? { next_text: params.nextText.trim() }
          : {}),
      };
    }
    case "grok-speech":
      return {
        text: params.text,
        voice_id: params.selectedVoice,
        language:
          getSpeechLanguageDefinition(params.speechLanguage).xaiTtsLocale,
      };
    case "mistral-speech":
      return {
        model: params.selectedModel,
        input: params.text,
        ...(params.selectedVoice ? { voice_id: params.selectedVoice } : {}),
        response_format: "mp3",
      };
    case "openai-speech":
    default:
      return {
        model: params.selectedModel,
        voice: params.selectedVoice,
        input: params.text,
        ...(params.instructions
          ? { instructions: params.instructions }
          : {}),
        response_format: "mp3",
      };
  }
}

function buildGeminiTtsPrompt(
  text: string,
  instructions: string,
  speechLanguage: SpeechLanguage,
) {
  return [
    "Synthesize speech for the transcript below.",
    `Speech language: ${getSpeechLanguageDefinition(speechLanguage).nativeLocale}.`,
    instructions ? `Performance instructions:\n${instructions}` : "",
    "Read the transcript exactly as written without adding or removing words.",
    `Transcript:\n${text}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function getBinaryTtsFileExtension(
  _requestFormat: RuntimeTtsBinaryRequestFormat,
): "mp3" | "wav" {
  return "mp3";
}

function getBinaryTtsEndpoint(params: {
  endpoint: string;
  requestFormat: RuntimeTtsBinaryRequestFormat;
  selectedVoice: string;
}) {
  if (params.requestFormat !== "elevenlabs-speech") {
    return params.endpoint;
  }

  return `${params.endpoint}/${encodeURIComponent(
    params.selectedVoice,
  )}?output_format=mp3_44100_128`;
}

function getBinaryTtsHeaders(params: {
  apiKey: string;
  requestFormat: RuntimeTtsBinaryRequestFormat;
}): Record<string, string> {
  return params.requestFormat === "elevenlabs-speech"
    ? {
        "Content-Type": "application/json",
        "xi-api-key": params.apiKey,
      }
    : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.apiKey}`,
      };
}

function getDashScopeAudioUrl(data: any) {
  const url = data?.output?.audio?.url;
  return typeof url === "string"
    ? url.replace(/^http:\/\//i, "https://")
    : null;
}

function getBinaryTtsVoice(params: {
  requestFormat: RuntimeTtsBinaryRequestFormat;
  selectedModel: string;
  selectedVoice: string;
}) {
  return params.selectedVoice;
}

export async function synthesizeProviderSpeech(params: {
  text: string;
  voice: string;
  provider: Provider;
  providerModel?: string;
  apiKey?: string;
  language: AppLanguage;
  speechLanguage?: SpeechLanguage;
  instructions?: string;
  previousText?: string;
  nextText?: string;
  abortSignal?: AbortSignal;
}) {
  const {
    text,
    voice,
    provider,
    providerModel,
    apiKey,
    language,
    speechLanguage =
      getDefaultTtsListenLanguageForLocale(language),
    instructions,
    previousText,
    nextText,
    abortSignal,
  } = params;
  const config = TTS_PROVIDER_CONFIGS[provider];
  const timeoutMs = getProviderTtsTimeoutMs(text, provider);

  if (!config) {
    throw new Error(
      translate(language, "ttsNotSupportedYet", {
        provider: PROVIDER_LABELS[provider],
      }),
    );
  }

  if (!providerSupportsTtsLanguage(provider, speechLanguage)) {
    throw new Error(
      translate(language, "speechLanguageUnsupportedByProvider", {
        provider: PROVIDER_LABELS[provider],
        language: getTtsListenLanguageLabel(speechLanguage, language),
      }),
    );
  }

  if (
    provider === "alibaba-qwen-dashscope" &&
    !qwenRegionSupportsAppSpeech(parseQwenApiCredential(apiKey ?? "").region)
  ) {
    throw new Error(translate(language, "qwenSpeechUnavailableInUs"));
  }

  const selectedVoice = getSelectedProviderVoice({
    provider,
    requestedVoice: voice,
    config,
  });

  if (providerRequiresTtsVoice(provider) && !selectedVoice) {
    throw new Error(
      translate(language, "providerVoiceIdRequired", {
        provider: PROVIDER_LABELS[provider],
      }),
    );
  }

  const selectedModel = getSelectedProviderModel({
    provider,
    providerModel,
    config,
  });
  const selectedInstructions =
    instructions?.trim() &&
    providerTtsModelSupportsInstructions(provider, selectedModel)
      ? instructions.trim()
      : "";

  if (config.kind === "gemini") {
    const response = await fetchTtsWithRetries({
      input: `${config.endpointBase}/${selectedModel}:generateContent`,
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": requireProviderKey(provider, apiKey, language),
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildGeminiTtsPrompt(
                    text,
                    selectedInstructions,
                    speechLanguage,
                  ),
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: selectedVoice,
                },
              },
            },
          },
        }),
      },
      timeoutMs,
      provider,
      language,
      abortSignal,
    });

    const data = await response.json();
    const audioPart = getGeminiAudioPart(data);
    const pcmBase64 = audioPart?.data;

    if (!pcmBase64) {
      throw new Error(
        translate(language, "ttsDidNotReturnAudio", {
          provider: PROVIDER_LABELS[provider],
        }),
      );
    }

    const mimeType = audioPart?.mimeType as string | undefined;
    const sampleRate = Number(mimeType?.match(/rate=(\d+)/i)?.[1]) || 24000;
    return buildWavAudioFileFromPcm({
      pcmBase64,
      sampleRate,
      language,
    });
  }

  if (config.kind === "dashscope") {
    const response = await fetchTtsWithRetries({
      input:
        provider === "alibaba-qwen-dashscope"
          ? resolveQwenApiEndpoint(config.endpoint, apiKey ?? "")
          : config.endpoint,
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${requireProviderKey(provider, apiKey, language)}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          input: {
            text,
            voice: selectedVoice,
            ...(getSpeechLanguageDefinition(speechLanguage).qwenTtsLanguage
              ? {
                  language_type:
                    getSpeechLanguageDefinition(speechLanguage)
                      .qwenTtsLanguage,
                }
              : {}),
            ...(selectedInstructions
              ? { instructions: selectedInstructions }
              : {}),
          },
        }),
      },
      timeoutMs,
      provider,
      language,
      abortSignal,
    });

    const data = await response.json();
    const audioUrl = getDashScopeAudioUrl(data);

    if (!audioUrl) {
      throw new Error(
        translate(language, "ttsDidNotReturnAudio", {
          provider: PROVIDER_LABELS[provider],
        }),
      );
    }

    const audioResponse = await fetchTtsWithRetries({
      input: audioUrl,
      init: {
        method: "GET",
      },
      timeoutMs,
      provider,
      language,
      abortSignal,
    });

    return writeBlobAudioFile(await audioResponse.blob(), "wav");
  }

  const authorizationKey = requireProviderKey(provider, apiKey, language);
  const resolvedVoice = getBinaryTtsVoice({
    requestFormat: config.requestFormat,
    selectedModel,
    selectedVoice,
  });

  const requestBody = buildBinaryTtsRequestBody({
    instructions: selectedInstructions,
    requestFormat: config.requestFormat,
    selectedModel,
    selectedVoice: resolvedVoice,
    text,
    previousText,
    nextText,
    speechLanguage,
  });

  const response = await fetchTtsWithRetries({
    input: getBinaryTtsEndpoint({
      endpoint: config.endpoint,
      requestFormat: config.requestFormat,
      selectedVoice: resolvedVoice,
    }),
    init: {
      method: "POST",
      headers: getBinaryTtsHeaders({
        apiKey: authorizationKey,
        requestFormat: config.requestFormat,
      }),
      body: JSON.stringify(requestBody),
    },
    timeoutMs,
    provider,
    language,
    abortSignal,
  });

  if (config.requestFormat === "mistral-speech") {
    const data = await response.json();
    const audioData = data?.audio_data;

    if (typeof audioData !== "string" || !audioData) {
      throw new Error(
        translate(language, "ttsDidNotReturnAudio", {
          provider: PROVIDER_LABELS[provider],
        }),
      );
    }

    return writeBase64AudioFile(audioData, "mp3");
  }

  return writeBlobAudioFile(
    await response.blob(),
    getBinaryTtsFileExtension(config.requestFormat),
  );
}
