import * as FileSystem from "expo-file-system/legacy";

import type { AppLanguage, Provider } from "../types";

import { STT_VALIDATION_AUDIO_BASE64 } from "./sttValidationAudio";
import { synthesizeProviderSpeech } from "./tts/providerRoute";
import { transcribeAudio } from "./whisper";

export async function validateTtsProviderConnection(params: {
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  model?: string;
  voice?: string;
  abortSignal?: AbortSignal;
}) {
  const audioPath = await synthesizeProviderSpeech({
    text: "OK",
    voice: params.voice ?? "",
    provider: params.provider,
    providerModel: params.model,
    apiKey: params.apiKey,
    language: params.language,
    abortSignal: params.abortSignal,
  });

  await FileSystem.deleteAsync(audioPath, {
    idempotent: true,
  });
}

export async function validateSttProviderConnection(params: {
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  model: string;
  abortSignal?: AbortSignal;
}) {
  const cacheDirectory = FileSystem.cacheDirectory;

  if (!cacheDirectory) {
    throw new Error("Speech validation storage is unavailable.");
  }

  const audioPath = `${cacheDirectory}provider-stt-validation-${Date.now()}.wav`;

  try {
    await FileSystem.writeAsStringAsync(
      audioPath,
      STT_VALIDATION_AUDIO_BASE64,
      {
        encoding: FileSystem.EncodingType.Base64,
      },
    );
    await transcribeAudio({
      fileUri: audioPath,
      mode: "provider",
      provider: params.provider,
      providerModel: params.model,
      apiKey: params.apiKey,
      language: params.language,
      abortSignal: params.abortSignal,
    });
  } finally {
    await FileSystem.deleteAsync(audioPath, {
      idempotent: true,
    });
  }
}
