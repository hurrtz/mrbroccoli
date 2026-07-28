import * as FileSystem from "expo-file-system/legacy";

import { buildProviderHttpError, normalizeProviderTransportError } from "../providerErrors";
import type { AppLanguage, Provider, SttLanguage } from "../../types";
import {
  createBytedanceRequestId,
  requireBytedanceSpeechCredentials,
} from "../bytedance";
import {
  buildGoogleCloudSpeechRecognizeEndpoint,
  parseGoogleAiStudioCredentials,
  requireGoogleCloudSpeechCredentials,
} from "../google";
import {
  getFileAudioMimeType,
  getGoogleCloudSpeechLanguageCode,
  getProviderSpeechLanguageCode,
} from "../../utils/speechLanguage";
import { getSpeechLanguageDefinition } from "../../constants/speechLanguages";
import { fetchWithTimeout } from "./abort";
import { getProviderSttTimeoutMs } from "./config";
import type {
  BytedanceBigmodelFlashTranscriptionConfig,
  GoogleCloudSpeechV2TranscriptionConfig,
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
  formData.append(
    "file",
    {
      uri: fileUri,
      type: getFileAudioMimeType(fileUri),
      name: fileUri.split("/").pop() || "recording.m4a",
    } as any,
  );
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

export async function transcribeWithBytedanceBigmodelFlashProvider(
  params: SharedProviderParams & {
    config: BytedanceBigmodelFlashTranscriptionConfig;
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
  const selectedModel = providerModel || config.defaultModel;
  const credentials = requireBytedanceSpeechCredentials(apiKey, language);
  const audioData = await FileSystem.readAsStringAsync(fileUri, {
    encoding: "base64",
  });

  let response: Awaited<ReturnType<typeof fetch>>;

  try {
    response = await fetchWithTimeout(
      config.endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-App-Key": credentials.appKey,
          "X-Api-Access-Key": credentials.accessKey,
          "X-Api-Resource-Id": credentials.resourceId,
          "X-Api-Request-Id": createBytedanceRequestId(),
          "X-Api-Sequence": "-1",
        },
        body: JSON.stringify({
          user: {
            uid: credentials.appKey,
          },
          audio: {
            data: audioData,
          },
          request: {
            model_name: selectedModel,
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

  const responseText = await response.text();

  if (!response.ok) {
    throw buildProviderHttpError({
      provider,
      language,
      status: response.status,
      errorText: responseText,
      action: "transcription",
    });
  }

  const apiStatusCode = response.headers.get("X-Api-Status-Code");
  const apiMessage = response.headers.get("X-Api-Message");

  if (apiStatusCode && apiStatusCode !== "20000000") {
    throw buildProviderHttpError({
      provider,
      language,
      status: 400,
      errorText: apiMessage || responseText || "Unknown ByteDance STT error.",
      action: "transcription",
    });
  }

  let data: any;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {};
  }

  const text =
    typeof data?.result?.text === "string"
      ? data.result.text.trim()
      : Array.isArray(data?.result)
        ? data.result
            .map((entry: any) =>
              typeof entry?.text === "string" ? entry.text : "",
            )
            .join(" ")
            .trim()
        : "";

  return text ? text : null;
}

export async function transcribeWithGoogleCloudSpeechV2Provider(
  params: SharedProviderParams & {
    config: GoogleCloudSpeechV2TranscriptionConfig;
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
  const selectedModel = providerModel || config.defaultModel;
  const credentials = requireGoogleCloudSpeechCredentials(apiKey, language);
  const audioData = await FileSystem.readAsStringAsync(fileUri, {
    encoding: "base64",
  });

  let response: Awaited<ReturnType<typeof fetch>>;

  try {
    response = await fetchWithTimeout(
      buildGoogleCloudSpeechRecognizeEndpoint({
        projectId: credentials.projectId,
        location: credentials.location,
      }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.accessToken}`,
          "x-goog-user-project": credentials.projectId,
        },
        body: JSON.stringify({
          config: {
            autoDecodingConfig: {},
            languageCodes: [
              getGoogleCloudSpeechLanguageCode(speechLanguage),
            ],
            model: selectedModel,
          },
          content: audioData,
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
  const text = Array.isArray(data?.results)
    ? data.results
        .map((result: any) =>
          Array.isArray(result?.alternatives)
            ? result.alternatives
                .map((alternative: any) =>
                  typeof alternative?.transcript === "string"
                    ? alternative.transcript
                    : "",
                )
                .join(" ")
            : "",
        )
        .join(" ")
        .trim()
    : "";

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
  const aiStudioCredentials = parseGoogleAiStudioCredentials(apiKey);

  if (!aiStudioCredentials) {
    return transcribeWithGoogleCloudSpeechV2Provider({
      ...params,
      config: {
        kind: "google-cloud-speech-v2",
        defaultModel: config.cloudDefaultModel,
      },
      providerModel: config.cloudDefaultModel,
    });
  }

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
  formData.append(
    "file",
    {
      uri: fileUri,
      type: getFileAudioMimeType(fileUri),
      name: fileUri.split("/").pop() || "recording.m4a",
    } as any,
  );

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
