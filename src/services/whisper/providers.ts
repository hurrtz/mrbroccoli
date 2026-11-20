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
import { fetchWithDeadline } from "../networkFetch";
import { getProviderSttTimeoutMs } from "./config";
import type {
  GoogleSpeechTranscriptionConfig,
  MultipartTranscriptionConfig,
  XaiRestSttTranscriptionConfig,
} from "./config";
import {
  createSttTimeoutError,
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

async function fetchTranscription(
  params: SharedProviderParams,
  input: string,
  init: RequestInit,
) {
  const { provider, language } = params;
  try {
    return await fetchWithDeadline(
      input,
      init,
      getProviderSttTimeoutMs(provider),
      () => createSttTimeoutError({ provider, language }),
      async (response) => {
        if (!response.ok) {
          throw buildProviderHttpError({
            provider,
            language,
            status: response.status,
            errorText: await response.text(),
            action: "transcription",
          });
        }
        return response.json();
      },
      params.abortSignal,
    );
  } catch (error) {
    throw normalizeProviderTransportError({
      provider,
      language,
      error,
      action: "transcription",
    });
  }
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

function extractGeminiInteractionTranscription(data: any): string {
  if (data?.status !== "completed" || !Array.isArray(data?.steps)) return "";
  return data.steps
    .filter((step: any) => step?.type === "model_output" && Array.isArray(step.content))
    .flatMap((step: any) => step.content)
    .filter((part: any) => part?.type === "text" && typeof part.text === "string")
    .map((part: any) => part.text)
    .join("")
    .trim();
}

export async function transcribeWithMultipartProvider(
  params: SharedProviderParams & {
    config: MultipartTranscriptionConfig;
  },
) {
  const {
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
      provider === "elevenlabs" ? "language_code" : provider === "openai" && resolvedModel === "gpt-transcribe" ? "languages[]" : "language",
      getProviderSpeechLanguageCode(speechLanguage),
    );
  }

  const resolvedApiKey = requireProviderKey(provider, apiKey, language);
  const data = await fetchTranscription(params, config.endpoint, {
    method: "POST",
    headers:
      provider === "elevenlabs"
        ? { "xi-api-key": resolvedApiKey }
        : { Authorization: `Bearer ${resolvedApiKey}` },
    body: formData,
  });
  const text = data.text?.trim();
  return text ? text : null;
}

export async function transcribeWithGoogleSpeechProvider(
  params: SharedProviderParams & {
    config: GoogleSpeechTranscriptionConfig;
  },
) {
  const {
    apiKey,
    config,
    fileUri,
    language,
    providerModel,
    speechLanguage,
  } = params;
  const aiStudioCredentials = requireGoogleAiStudioCredentials(
    apiKey,
    language,
  );

  const selectedModel = providerModel || config.defaultModel;
  const usesInteractions = selectedModel === "gemini-3.5-transcribe";
  const audioData = await FileSystem.readAsStringAsync(fileUri, {
    encoding: "base64",
  });
  const mimeType = getFileAudioMimeType(fileUri);
  const data = await fetchTranscription(
    params,
    usesInteractions && config.interactionsEndpoint
      ? config.interactionsEndpoint
      : `${config.endpointBase.replace(/\/$/, "")}/${encodeURIComponent(
          selectedModel.replace(/^models\//, ""),
        )}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": aiStudioCredentials.apiKey,
      },
      body: JSON.stringify(
        usesInteractions
          ? {
              model: selectedModel,
              store: false,
              input: [{ type: "audio", data: audioData, mime_type: mimeType }],
              generation_config: {
                transcription_config: {
                  mode: { type: "verbatim" },
                  ...(speechLanguage === "auto"
                    ? {}
                    : {
                        language_codes: [
                          getSpeechLanguageDefinition(speechLanguage)
                            .nativeLocale,
                        ],
                      }),
                },
              },
            }
          : {
              store: false,
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
            },
      ),
    },
  );
  const text = usesInteractions
    ? extractGeminiInteractionTranscription(data)
    : extractGeminiTranscription(data);
  return text || null;
}

export async function transcribeWithXaiRestSttProvider(
  params: SharedProviderParams & {
    config: XaiRestSttTranscriptionConfig;
  },
) {
  const {
    apiKey,
    config,
    fileUri,
    language,
    provider,
    providerModel,
    speechLanguage,
  } = params;
  const formData = new FormData();
  formData.append("model", providerModel || config.defaultModel);
  if (speechLanguage !== "auto") {
    formData.append("format", "true");
    formData.append(
      "language",
      getProviderSpeechLanguageCode(speechLanguage),
    );
  }
  appendRecordedAudio(formData, fileUri);

  const data = await fetchTranscription(params, config.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireProviderKey(provider, apiKey, language)}`,
    },
    body: formData,
  });
  const text = typeof data?.text === "string" ? data.text.trim() : "";
  return text ? text : null;
}
