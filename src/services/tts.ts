import { translate } from "../i18n";
import {
  createSpeechRequestId,
  recordSpeechDiagnostic,
  SpeechDiagnosticsContext,
} from "./speech/diagnostics";
import {
  AppLanguage,
  KokoroVoiceSelections,
  Provider,
  TtsBackendMode,
  TtsListenLanguage,
  SpeechLanguage,
} from "../types";
import {
  DEFAULT_KOKORO_VOICES,
  KOKORO_TTS_TARGET_CHUNK_CHARS,
  getTtsListenLanguageForKokoro,
  resolveKokoroLanguage,
} from "../constants/kokoro";
import { synthesizeKokoroSpeech } from "./kokoroTts";
import {
  splitIntoSentences,
  splitTextForTts,
} from "./tts/chunking";
import { synthesizeProviderSpeech } from "./tts/providerRoute";
import { resolveTtsListenLanguage } from "../utils/ttsRouting";
import {
  getProviderTtsAudioCacheEntry,
  resetProviderTtsAudioCacheForTests,
  setProviderTtsAudioCacheEntry,
} from "./providerTtsAudioCache";
import { recordDebugLogEvent } from "./debugLogCapture";
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
function hashTtsCacheValue(value: string) {
  let first = 2166136261;
  let second = 5381;

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first ^= code;
    first = Math.imul(first, 16777619);
    second = Math.imul(second, 33) ^ code;
  }

  return `${value.length}:${(first >>> 0).toString(36)}:${(
    second >>> 0
  ).toString(36)}`;
}

function getProviderTtsAudioCacheKey(params: {
  apiKey?: string;
  instructions?: string;
  nextText?: string;
  previousText?: string;
  provider: Provider;
  providerModel: string | null;
  speechLanguage: SpeechLanguage;
  text: string;
  voice: string;
}) {
  return hashTtsCacheValue(
    JSON.stringify({
      apiKeyIdentity: hashTtsCacheValue(params.apiKey?.trim() ?? ""),
      instructions: params.instructions?.trim() ?? "",
      nextText: params.nextText?.trim() ?? "",
      previousText: params.previousText?.trim() ?? "",
      provider: params.provider,
      providerModel: params.providerModel,
      speechLanguage: params.speechLanguage,
      text: params.text.trim(),
      voice: params.voice,
    }),
  );
}

async function getCachedProviderTtsAudio(cacheKey: string) {
  try {
    return await getProviderTtsAudioCacheEntry(cacheKey);
  } catch (error) {
    recordDebugLogEvent({
      event: "provider-tts-cache-read-failed",
      level: "warn",
      payload: {
        message: error instanceof Error ? error.message : String(error),
      },
    });
    return null;
  }
}

async function cacheProviderTtsAudio(
  cacheKey: string,
  entry: {
    audioPath: string;
    providerModel: string | null;
  },
) {
  try {
    await setProviderTtsAudioCacheEntry(cacheKey, entry);
  } catch (error) {
    recordDebugLogEvent({
      event: "provider-tts-cache-write-failed",
      level: "warn",
      payload: {
        message: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export function clearProviderTtsAudioCacheForTests() {
  resetProviderTtsAudioCacheForTests();
}

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
  speechLanguage?: SpeechLanguage;
  kokoroVoices?: KokoroVoiceSelections;
  diagnostics?: SpeechDiagnosticsContext;
  abortSignal?: AbortSignal;
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
    speechLanguage,
    diagnostics,
    abortSignal,
  } = params;
  const requestId = diagnostics?.requestId ?? createSpeechRequestId("tts");
  const resolvedSpeechLanguage =
    speechLanguage ??
    resolveTtsListenLanguage({
      text,
      preferredLanguages: listenLanguages,
      appLanguage: language,
    });
  const resolvedProviderModel = resolveProviderTtsModel({
    provider,
    providerModel,
  });
  let actualProviderModel = resolvedProviderModel;

  recordSpeechDiagnostic({
    requestId,
    source: diagnostics?.source ?? "unknown",
    stage: "tts-requested",
    requestedRoute: mode,
    mode,
    provider: provider ?? null,
    providerModel: resolvedProviderModel,
    voice: voice || null,
    language: resolvedSpeechLanguage,
    textLength: text.trim().length,
  });

  if (mode === "native") {
    throw new Error(
      translate(language, "nativeTtsDoesNotSynthesizeAudioFiles"),
    );
  }

  if (mode === "kokoro") {
    try {
      const kokoroLanguage = resolveKokoroLanguage({
        text,
        listenLanguages: [resolvedSpeechLanguage],
      });
      const kokoroVoices = params.kokoroVoices
        ? params.kokoroVoices
        : kokoroLanguage
          ? {
              ...DEFAULT_KOKORO_VOICES,
              [kokoroLanguage]: voice || DEFAULT_KOKORO_VOICES[kokoroLanguage],
            }
          : DEFAULT_KOKORO_VOICES;
      const result = await synthesizeKokoroSpeech({
        text,
        listenLanguages: [resolvedSpeechLanguage],
        voices: kokoroVoices,
        abortSignal,
      });

      recordSpeechDiagnostic({
        requestId,
        source: diagnostics?.source ?? "unknown",
        stage: "tts-succeeded",
        requestedRoute: "kokoro",
        actualRoute: "kokoro",
        provider: null,
        providerModel: null,
        voice: result.voice,
        language: getTtsListenLanguageForKokoro(result.language),
        textLength: text.trim().length,
      });
      return result.fileUri;
    } catch (kokoroError) {
      const normalizedKokoroError =
        kokoroError instanceof Error
          ? kokoroError
          : new Error(String(kokoroError));

      recordSpeechDiagnostic({
        requestId,
        source: diagnostics?.source ?? "unknown",
        stage: "tts-failed",
        requestedRoute: "kokoro",
        actualRoute: "kokoro",
        provider: null,
        providerModel: null,
        voice: voice || null,
        textLength: text.trim().length,
        message: normalizedKokoroError.message,
      });
      throw normalizedKokoroError;
    }
  }

  if (!provider) {
    throw new Error(
      translate(language, "chooseTextToSpeechProviderInSettings"),
    );
  }

  if (abortSignal?.aborted) {
    const abortError = new Error("Speech generation was cancelled.");
    abortError.name = "AbortError";
    throw abortError;
  }

  const providerAudioCacheKey = getProviderTtsAudioCacheKey({
    apiKey,
    instructions,
    nextText,
    previousText,
    provider,
    providerModel: resolvedProviderModel,
    speechLanguage: resolvedSpeechLanguage,
    text,
    voice,
  });

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

  const cachedAudio = await getCachedProviderTtsAudio(
    providerAudioCacheKey,
  );
  if (cachedAudio) {
    actualProviderModel = cachedAudio.providerModel;
    if (diagnostics) {
      diagnostics.providerModel = cachedAudio.providerModel;
    }
    recordSpeechDiagnostic({
      requestId,
      source: diagnostics?.source ?? "unknown",
      stage: "tts-succeeded",
      requestedRoute: "provider",
      actualRoute: "provider",
      provider,
      providerModel: cachedAudio.providerModel,
      voice: voice || null,
      language: resolvedSpeechLanguage,
      textLength: text.trim().length,
      message: "Reused cached speech audio.",
    });
    return cachedAudio.audioPath;
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
      speechLanguage: resolvedSpeechLanguage,
      abortSignal,
      onModelResolved: (model) => {
        actualProviderModel = model;
        if (diagnostics) {
          diagnostics.providerModel = model;
        }
      },
    });
    recordSpeechDiagnostic({
      requestId,
      source: diagnostics?.source ?? "unknown",
      stage: "tts-succeeded",
      requestedRoute: "provider",
      actualRoute: "provider",
      provider,
      providerModel: actualProviderModel,
      voice: voice || null,
      textLength: text.trim().length,
    });
    await cacheProviderTtsAudio(providerAudioCacheKey, {
      audioPath,
      providerModel: actualProviderModel,
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
  kokoroVoices?: KokoroVoiceSelections;
  diagnostics?: SpeechDiagnosticsContext;
  abortSignal?: AbortSignal;
}) {
  const segments = splitTextForTts(
    params.text,
    params.mode === "kokoro"
      ? KOKORO_TTS_TARGET_CHUNK_CHARS
      : Math.min(
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
