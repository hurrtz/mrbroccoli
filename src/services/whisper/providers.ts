import { File } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";

import { buildProviderHttpError, normalizeProviderTransportError } from "../providerErrors";
import type { AppLanguage, Provider, SttLanguage } from "../../types";
import { requireGoogleAiStudioCredentials } from "../google";
import {
  getFileAudioMimeType,
  getProviderSpeechLanguageCode,
} from "../../utils/speechLanguage";
import { getSpeechLanguageDefinition } from "../../constants/speechLanguages";
import { fetchWithTimeout } from "./abort";
import { getProviderSttTimeoutMs } from "./config";
import type {
  GoogleSpeechTranscriptionConfig,
  OpenAiAudioInputTranscriptionConfig,
  MultipartTranscriptionConfig,
  XaiRestSttTranscriptionConfig,
} from "./config";
import {
  createSttTimeoutError,
  extractTextFromOpenAiAudioInputResponse,
  requireProviderKey,
} from "./errors";

interface SharedProviderParams {
  abortSignal?: AbortSignal;
  apiKey?: string;
  fileUri: string;
  language: AppLanguage;
  speechLanguage: SttLanguage;
  provider: Provider;
  providerModel?: string;
}

function appendRecordedAudio(formData: FormData, fileUri: string) {
  formData.append("file", new File(fileUri));
}

function extractGeminiTranscription(data: any) {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part: any) =>
      part?.thought !== true && typeof part?.text === "string" ? part.text : "",
    )
    .join("")
    .trim();
}

export async function transcribeWithMultipartProvider(
  params: SharedProviderParams & {
    config: MultipartTranscriptionConfig;
  },
) {
  const {
    abortSignal,
    apiKey,
    config,
    fileUri,
    language,
    provider,
    providerModel,
    speechLanguage,
  } = params;
  const formData = new FormData();
  appendRecordedAudio(formData, fileUri);
  const resolvedModel = providerModel || config.defaultModel;
  formData.append(
    provider === "elevenlabs" ? "model_id" : "model",
    resolvedModel,
  );
  if (provider === "openai" && resolvedModel === "gpt-4o-transcribe-diarize") {
    formData.append("response_format", "diarized_json");
    formData.append("chunking_strategy", "auto");
  }
  if (speechLanguage !== "auto") {
    formData.append(
      provider === "elevenlabs" ? "language_code" : "language",
      getProviderSpeechLanguageCode(speechLanguage),
    );
  }

  let response: Awaited<ReturnType<typeof fetch>>;

  try {
    const resolvedApiKey = requireProviderKey(provider, apiKey, language);
    response = await fetchWithTimeout(
      config.endpoint,
      {
        method: "POST",
        headers:
          provider === "elevenlabs"
            ? { "xi-api-key": resolvedApiKey }
            : { Authorization: `Bearer ${resolvedApiKey}` },
        body: formData,
      },
      getProviderSttTimeoutMs(provider),
      () => createSttTimeoutError({ provider, language }),
      abortSignal,
    );
  } catch (error) {
    throw normalizeProviderTransportError({
      provider,
      language,
      error,
      action: "transcription",
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw buildProviderHttpError({
      provider,
      language,
      status: response.status,
      errorText,
      action: "transcription",
    });
  }

  const data = await response.json();
  const text = data.text?.trim();
  return text ? text : null;
}

export async function transcribeWithOpenAiAudioInputProvider(
  params: SharedProviderParams & {
    config: OpenAiAudioInputTranscriptionConfig;
  },
) {
  return transcribeWithOpenAiStyleAudioInputProvider({
    ...params,
    endpoint: params.config.endpoint,
    headers: {
      Authorization: `Bearer ${requireProviderKey(
        params.provider,
        params.apiKey,
        params.language,
      )}`,
    },
  });
}

async function transcribeWithOpenAiStyleAudioInputProvider(
  params: SharedProviderParams & {
    endpoint: string;
    headers: Record<string, string>;
    config: OpenAiAudioInputTranscriptionConfig;
  },
) {
  const {
    abortSignal,
    apiKey,
    config,
    fileUri,
    language,
    provider,
    providerModel,
    speechLanguage,
  } = params;
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: "base64",
  });
  const mimeType = getFileAudioMimeType(fileUri);
  const dataUri = `data:${mimeType};base64,${base64}`;

  let response: Awaited<ReturnType<typeof fetch>>;

  try {
    response = await fetchWithTimeout(
      params.endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...params.headers,
        },
        body: JSON.stringify({
          model: providerModel || config.defaultModel,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "input_audio",
                  input_audio: {
                    data: dataUri,
                  },
                },
              ],
            },
          ],
          ...(speechLanguage === "auto"
            ? {}
            : {
                asr_options: {
                  language: getProviderSpeechLanguageCode(speechLanguage),
                  enable_itn: false,
                },
              }),
          stream: false,
        }),
      },
      getProviderSttTimeoutMs(provider),
      () => createSttTimeoutError({ provider, language }),
      abortSignal,
    );
  } catch (error) {
    throw normalizeProviderTransportError({
      provider,
      language,
      error,
      action: "transcription",
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw buildProviderHttpError({
      provider,
      language,
      status: response.status,
      errorText,
      action: "transcription",
    });
  }

  const data = await response.json();
  const text = extractTextFromOpenAiAudioInputResponse(data);
  return text ? text : null;
}

export async function transcribeWithGoogleSpeechProvider(
  params: SharedProviderParams & {
    config: GoogleSpeechTranscriptionConfig;
  },
) {
  const {
    abortSignal,
    apiKey,
    config,
    fileUri,
    language,
    provider,
    providerModel,
    speechLanguage,
  } = params;
  const aiStudioCredentials = requireGoogleAiStudioCredentials(
    apiKey,
    language,
  );

  const selectedModel = providerModel || config.defaultModel;
  const audioData = await FileSystem.readAsStringAsync(fileUri, {
    encoding: "base64",
  });
  const mimeType = getFileAudioMimeType(fileUri);
  let response: Awaited<ReturnType<typeof fetch>>;

  try {
    response = await fetchWithTimeout(
      `${config.endpointBase.replace(/\/$/, "")}/${encodeURIComponent(
        selectedModel.replace(/^models\//, ""),
      )}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": aiStudioCredentials.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    speechLanguage === "auto"
                      ? "Transcribe the speech in this audio exactly. Return only the transcript in the spoken language and do not translate or add commentary."
                      : `Transcribe the speech in this audio exactly. The expected language is ${getSpeechLanguageDefinition(speechLanguage).nativeLocale}. Return only the transcript in that language and do not translate or add commentary.`,
                },
                {
                  inlineData: {
                    mimeType,
                    data: audioData,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
          },
        }),
      },
      getProviderSttTimeoutMs(provider),
      () => createSttTimeoutError({ provider, language }),
      abortSignal,
    );
  } catch (error) {
    throw normalizeProviderTransportError({
      provider,
      language,
      error,
      action: "transcription",
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw buildProviderHttpError({
      provider,
      language,
      status: response.status,
      errorText,
      action: "transcription",
    });
  }

  const text = extractGeminiTranscription(await response.json());
  return text || null;
}

export async function transcribeWithXaiRestSttProvider(
  params: SharedProviderParams & {
    config: XaiRestSttTranscriptionConfig;
  },
) {
  const {
    abortSignal,
    apiKey,
    config,
    fileUri,
    language,
    provider,
    speechLanguage,
  } = params;
  const formData = new FormData();
  if (speechLanguage !== "auto") {
    formData.append("format", "true");
    formData.append(
      "language",
      getProviderSpeechLanguageCode(speechLanguage),
    );
  }
  appendRecordedAudio(formData, fileUri);

  let response: Awaited<ReturnType<typeof fetch>>;

  try {
    response = await fetchWithTimeout(
      config.endpoint,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${requireProviderKey(provider, apiKey, language)}`,
        },
        body: formData,
      },
      getProviderSttTimeoutMs(provider),
      () => createSttTimeoutError({ provider, language }),
      abortSignal,
    );
  } catch (error) {
    throw normalizeProviderTransportError({
      provider,
      language,
      error,
      action: "transcription",
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw buildProviderHttpError({
      provider,
      language,
      status: response.status,
      errorText,
      action: "transcription",
    });
  }

  const data = await response.json();
  const text = typeof data?.text === "string" ? data.text.trim() : "";
  return text ? text : null;
}
