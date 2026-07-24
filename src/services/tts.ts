import { translate } from "../i18n";
import {
  createSpeechRequestId,
  recordSpeechDiagnostic,
  SpeechDiagnosticsContext,
} from "./speech/diagnostics";
import {
  AppLanguage,
  Provider,
  TtsBackendMode,
  TtsListenLanguage,
} from "../types";
import {
  splitIntoSentences,
  splitTextForTts,
} from "./tts/chunking";
import { synthesizeProviderSpeech } from "./tts/providerRoute";
import {
  getProviderTtsTimeoutMs,
  getProviderTtsTargetChunkChars,
  getSelectedProviderModel,
  PROVIDER_TTS_MAX_INPUT_CHARS,
  PROVIDER_TTS_MAX_TIMEOUT_MS,
  PROVIDER_TTS_TIMEOUT_MS,
  PROVIDER_TTS_TIMEOUT_MS_PER_CHAR,
  PROVIDER_TTS_TARGET_CHUNK_CHARS,
  TTS_PROVIDER_CONFIGS,
  TtsRequestError,
  writeBytesAudioFile,
} from "./tts/shared";

export {
  getProviderTtsTimeoutMs,
  getProviderTtsTargetChunkChars,
  PROVIDER_TTS_MAX_INPUT_CHARS,
  PROVIDER_TTS_MAX_TIMEOUT_MS,
  PROVIDER_TTS_TIMEOUT_MS,
  PROVIDER_TTS_TIMEOUT_MS_PER_CHAR,
  PROVIDER_TTS_TARGET_CHUNK_CHARS,
  splitIntoSentences,
  splitTextForTts,
  TtsRequestError,
};

const LOCAL_ANDROID_DEV_API_KEY = "sk-test-android-local-dev";

function isLocalAndroidDevTtsEnabled(apiKey: string | undefined) {
  return (
    typeof __DEV__ !== "undefined" &&
    __DEV__ &&
    apiKey?.trim() === LOCAL_ANDROID_DEV_API_KEY
  );
}

function buildLocalAndroidDevWavBytes(text: string) {
  const sampleRate = 16_000;
  const durationMs = Math.min(900, Math.max(320, text.trim().length * 18));
  const sampleCount = Math.floor((sampleRate * durationMs) / 1000);
  const dataLength = sampleCount * 2;
  const bytes = new Uint8Array(44 + dataLength);
  const view = new DataView(bytes.buffer);

  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + dataLength, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, dataLength, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const progress = index / Math.max(1, sampleCount - 1);
    const envelope = Math.sin(Math.PI * progress);
    const sample = Math.sin((2 * Math.PI * 440 * index) / sampleRate);
    view.setInt16(44 + index * 2, Math.round(sample * envelope * 16_000), true);
  }

  return bytes;
}

function resolveProviderTtsModel(params: {
  provider?: Provider | null;
  providerModel?: string;
}) {
  if (!params.provider) {
    return null;
  }

  const config = TTS_PROVIDER_CONFIGS[params.provider];

  if (!config) {
    return params.providerModel?.trim() || null;
  }

  return getSelectedProviderModel({
    provider: params.provider,
    providerModel: params.providerModel,
    config,
  });
}

export async function synthesizeSpeech(params: {
  text: string;
  voice: string;
  mode: TtsBackendMode;
  provider?: Provider | null;
  providerModel?: string;
  apiKey?: string;
  instructions?: string;
  previousText?: string;
  nextText?: string;
  language: AppLanguage;
  listenLanguages?: TtsListenLanguage[];
  diagnostics?: SpeechDiagnosticsContext;
  abortSignal?: AbortSignal;
  onProviderFallback?: (error: Error) => void;
}): Promise<string> {
  const {
    text,
    voice,
    mode,
    provider,
    providerModel,
    apiKey,
    instructions,
    previousText,
    nextText,
    language,
    listenLanguages,
    diagnostics,
    abortSignal,
  } = params;
  const requestId = diagnostics?.requestId ?? createSpeechRequestId("tts");
  const resolvedProviderModel = resolveProviderTtsModel({
    provider,
    providerModel,
  });

  recordSpeechDiagnostic({
    requestId,
    source: diagnostics?.source ?? "unknown",
    stage: "tts-requested",
    requestedRoute: mode,
    mode,
    provider: provider ?? null,
    providerModel: resolvedProviderModel,
    voice: voice || null,
    language: listenLanguages?.[0] ?? "app",
    textLength: text.trim().length,
  });

  if (mode === "native") {
    throw new Error(
      translate(language, "nativeTtsDoesNotSynthesizeAudioFiles"),
    );
  }

  if (!provider) {
    throw new Error(
      translate(language, "chooseTextToSpeechProviderInSettings"),
    );
  }

  if (isLocalAndroidDevTtsEnabled(apiKey)) {
    const audioPath = await writeBytesAudioFile({
      bytes: buildLocalAndroidDevWavBytes(text),
      extension: "wav",
      language,
    });
    recordSpeechDiagnostic({
      requestId,
      source: diagnostics?.source ?? "unknown",
      stage: "tts-succeeded",
      requestedRoute: "provider",
      actualRoute: "provider",
      provider,
      providerModel: resolvedProviderModel,
      voice: voice || null,
      textLength: text.trim().length,
      message: "Generated local Android dev TTS audio.",
    });
    return audioPath;
  }

  try {
    const audioPath = await synthesizeProviderSpeech({
      text,
      voice,
      provider,
      providerModel,
      apiKey,
      instructions,
      previousText,
      nextText,
      language,
      abortSignal,
    });
    recordSpeechDiagnostic({
      requestId,
      source: diagnostics?.source ?? "unknown",
      stage: "tts-succeeded",
      requestedRoute: "provider",
      actualRoute: "provider",
      provider,
      providerModel: resolvedProviderModel,
      voice: voice || null,
      textLength: text.trim().length,
    });
    return audioPath;
  } catch (providerError) {
    const normalizedProviderError =
      providerError instanceof Error
        ? providerError
        : new Error(String(providerError));

    recordSpeechDiagnostic({
      requestId,
      source: diagnostics?.source ?? "unknown",
      stage: "tts-failed",
      requestedRoute: "provider",
      actualRoute: "provider",
      provider,
      providerModel: resolvedProviderModel,
      voice: voice || null,
      textLength: text.trim().length,
      message: normalizedProviderError.message,
    });

    throw normalizedProviderError;
  }
}

export async function synthesizeSpeechSequence(params: {
  text: string;
  voice: string;
  mode: TtsBackendMode;
  provider?: Provider | null;
  providerModel?: string;
  apiKey?: string;
  instructions?: string;
  previousText?: string;
  nextText?: string;
  language: AppLanguage;
  listenLanguages?: TtsListenLanguage[];
  diagnostics?: SpeechDiagnosticsContext;
  abortSignal?: AbortSignal;
}) {
  const segments = splitTextForTts(
    params.text,
    Math.min(
      PROVIDER_TTS_MAX_INPUT_CHARS,
      getProviderTtsTargetChunkChars(params.provider),
    ),
  );

  if (segments.length === 0) {
    return [];
  }

  const audioFiles: string[] = [];

  for (const [index, segment] of segments.entries()) {
    audioFiles.push(
      await synthesizeSpeech({
        ...params,
        text: segment,
        previousText:
          params.provider === "elevenlabs"
            ? segments[index - 1] ?? params.previousText
            : params.previousText,
        nextText:
          params.provider === "elevenlabs"
            ? segments[index + 1] ?? params.nextText
            : params.nextText,
      }),
    );
  }

  return audioFiles;
}
