import {
  cacheDirectory,
  deleteAsync,
  getInfoAsync,
} from "expo-file-system/legacy";

import {
  LOCAL_MODEL_CATALOG_VERSION,
  getLocalModel,
  type LocalSttModelDefinition,
  type LocalSttModelId,
  type LocalTtsModelDefinition,
  type LocalTtsModelId,
} from "../constants/localModels";
import { getSpeechLanguageDefinition } from "../constants/speechLanguages";
import type { SpeechLanguage, SttLanguage } from "../types";
import {
  probeLocalDeviceCapabilities,
  saveLocalModelBenchmarkResult,
  type LocalModelBenchmarkResult,
} from "./localDeviceCapabilities";
import { getLocalModelInstallStatus } from "./localModelManager";

function getSherpaModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Jest and unsupported builds import-safe
  return require("react-native-sherpa-onnx") as typeof import("react-native-sherpa-onnx");
}

function getSttModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Jest and unsupported builds import-safe
  return require("react-native-sherpa-onnx/stt") as typeof import("react-native-sherpa-onnx/stt");
}

function getTtsModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Jest and unsupported builds import-safe
  return require("react-native-sherpa-onnx/tts") as typeof import("react-native-sherpa-onnx/tts");
}

function abortError(message: string) {
  const error = new Error(message);
  error.name = "AbortError";
  return error;
}

async function requireInstalledPath(
  modelId: LocalSttModelId | LocalTtsModelId,
) {
  const model = getLocalModel(modelId);
  const status = await getLocalModelInstallStatus(modelId);
  if (!status.path || !status.verified) {
    throw new Error(`Download and verify ${model.name} before using it.`);
  }
  return status.path;
}

function whisperLanguage(language: SttLanguage) {
  return language === "auto"
    ? "auto"
    : getSpeechLanguageDefinition(language).providerCode;
}

export async function transcribeLocalAudio(params: {
  fileUri: string;
  modelId: LocalSttModelId;
  language: SttLanguage;
  abortSignal?: AbortSignal;
}) {
  if (params.abortSignal?.aborted) {
    throw abortError("Local transcription was cancelled.");
  }
  const model = getLocalModel(params.modelId) as LocalSttModelDefinition;
  const path = await requireInstalledPath(params.modelId);
  const { fileModelPath } = getSherpaModule();
  const { createSTT } = getSttModule();
  const engine = await createSTT({
    modelPath: fileModelPath(path),
    modelType: model.sherpaModelType,
    preferInt8: true,
    numThreads: 2,
    provider: "cpu",
    modelOptions: {
      whisper: {
        language: whisperLanguage(params.language),
        task: "transcribe",
      },
    },
  });

  try {
    if (params.abortSignal?.aborted) {
      throw abortError("Local transcription was cancelled.");
    }
    const result = await engine.transcribeFile(
      params.fileUri.replace(/^file:\/\//, ""),
    );
    if (params.abortSignal?.aborted) {
      throw abortError("Local transcription was cancelled.");
    }
    return result.text.trim() || null;
  } finally {
    await engine.destroy().catch(() => undefined);
  }
}

export async function synthesizeLocalSpeech(params: {
  text: string;
  modelId: LocalTtsModelId;
  speechLanguage: SpeechLanguage;
  abortSignal?: AbortSignal;
}) {
  const model = getLocalModel(params.modelId) as LocalTtsModelDefinition;
  if (!model.languages.includes(params.speechLanguage)) {
    throw new Error(`${model.name} does not support ${params.speechLanguage}.`);
  }
  if (params.abortSignal?.aborted) {
    throw abortError("Local speech generation was cancelled.");
  }
  const path = await requireInstalledPath(params.modelId);
  const { fileModelPath } = getSherpaModule();
  const { createTTS, saveAudioToFile } = getTtsModule();
  const loadStartedAt = Date.now();
  const engine = await createTTS({
    modelPath: fileModelPath(path),
    modelType: model.sherpaModelType,
    numThreads: 2,
    provider: "cpu",
    maxNumSentences: 1,
    silenceScale: 0.2,
  });
  const loadMs = Date.now() - loadStartedAt;
  let fileUri: string | null = null;

  try {
    const audio = await engine.generateSpeech(params.text.trim(), {
      sid: model.speakerId,
      speed: 1,
      silenceScale: 0.2,
    });
    if (params.abortSignal?.aborted) {
      throw abortError("Local speech generation was cancelled.");
    }
    if (!audio.samples.length || !audio.sampleRate) {
      throw new Error(`${model.name} produced no audio.`);
    }
    fileUri = `${cacheDirectory}local-tts-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.wav`;
    await saveAudioToFile(audio, fileUri.replace(/^file:\/\//, ""));
    return {
      fileUri,
      audioDurationSeconds: audio.samples.length / audio.sampleRate,
      loadMs,
    };
  } catch (error) {
    if (fileUri) {
      await deleteAsync(fileUri, { idempotent: true }).catch(() => undefined);
    }
    throw error;
  } finally {
    await engine.destroy().catch(() => undefined);
  }
}

export async function benchmarkLocalStt(
  modelId: LocalSttModelId,
  language: SttLanguage,
): Promise<LocalModelBenchmarkResult> {
  const model = getLocalModel(modelId) as LocalSttModelDefinition;
  const device = await probeLocalDeviceCapabilities();
  const overallStartedAt = Date.now();
  let loadMs = 0;

  try {
    const path = await requireInstalledPath(model.id);
    const { fileModelPath } = getSherpaModule();
    const { createSTT } = getSttModule();
    const loadStartedAt = Date.now();
    const engine = await createSTT({
      modelPath: fileModelPath(path),
      modelType: model.sherpaModelType,
      preferInt8: true,
      numThreads: 2,
      provider: "cpu",
      modelOptions: { whisper: { language: whisperLanguage(language) } },
    });
    loadMs = Date.now() - loadStartedAt;
    const audioSeconds = 2;
    const runStartedAt = Date.now();
    await engine.transcribeSamples(
      new Array(16_000 * audioSeconds).fill(0),
      16_000,
    );
    const durationMs = Date.now() - runStartedAt;
    await engine.destroy();
    const realtimeFactor = durationMs / 1000 / audioSeconds;
    const status =
      loadMs <= model.benchmark.maximumLoadMs &&
      realtimeFactor <= (model.benchmark.maximumRealtimeFactor ?? Infinity)
        ? "viable"
        : "below-target";
    const benchmark: LocalModelBenchmarkResult = {
      modelId,
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: new Date().toISOString(),
      status,
      loadMs,
      durationMs,
      realtimeFactor,
      device,
    };
    await saveLocalModelBenchmarkResult(benchmark);
    return benchmark;
  } catch (error) {
    const benchmark: LocalModelBenchmarkResult = {
      modelId,
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: new Date().toISOString(),
      status: "failed",
      loadMs,
      durationMs: Date.now() - overallStartedAt,
      detail: error instanceof Error ? error.message : String(error),
      device,
    };
    await saveLocalModelBenchmarkResult(benchmark);
    return benchmark;
  }
}

export async function benchmarkLocalTts(
  modelId: LocalTtsModelId,
  speechLanguage: SpeechLanguage,
): Promise<LocalModelBenchmarkResult> {
  const model = getLocalModel(modelId) as LocalTtsModelDefinition;
  const device = await probeLocalDeviceCapabilities();
  const startedAt = Date.now();
  let loadMs = 0;
  let generatedFileUri: string | null = null;

  try {
    const synthesisStartedAt = Date.now();
    const result = await synthesizeLocalSpeech({
      text: "Hello from Mr Broccoli.",
      modelId,
      speechLanguage,
    });
    loadMs = result.loadMs;
    generatedFileUri = result.fileUri;
    const durationMs = Date.now() - synthesisStartedAt;
    const info = await getInfoAsync(result.fileUri);
    if (!info.exists || !("size" in info) || (info.size ?? 0) <= 44) {
      throw new Error(`${model.name} produced an invalid preview.`);
    }
    const realtimeFactor = durationMs / 1000 / result.audioDurationSeconds;
    const status =
      loadMs <= model.benchmark.maximumLoadMs &&
      realtimeFactor <= (model.benchmark.maximumRealtimeFactor ?? Infinity)
        ? "viable"
        : "below-target";
    const benchmark: LocalModelBenchmarkResult = {
      modelId,
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: new Date().toISOString(),
      status,
      loadMs,
      durationMs,
      realtimeFactor,
      device,
    };
    await saveLocalModelBenchmarkResult(benchmark);
    return benchmark;
  } catch (error) {
    const benchmark: LocalModelBenchmarkResult = {
      modelId,
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: new Date().toISOString(),
      status: "failed",
      loadMs,
      durationMs: Date.now() - startedAt,
      detail: error instanceof Error ? error.message : String(error),
      device,
    };
    await saveLocalModelBenchmarkResult(benchmark);
    return benchmark;
  } finally {
    if (generatedFileUri) {
      await deleteAsync(generatedFileUri, { idempotent: true }).catch(
        () => undefined,
      );
    }
  }
}
