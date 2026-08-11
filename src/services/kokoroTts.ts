import { AppState, Platform, type AppStateStatus } from "react-native";
import {
  cacheDirectory,
  deleteAsync,
  getInfoAsync,
} from "expo-file-system/legacy";

import {
  DEFAULT_KOKORO_VOICES,
  KOKORO_IDLE_RELEASE_MS,
  KOKORO_MODEL_DOWNLOAD_BYTES,
  KOKORO_MODEL_ID,
  KOKORO_MODEL_INSTALLED_BYTES,
  KOKORO_MODEL_SHA256,
  getKokoroVoiceConfig,
  resolveKokoroLanguage,
} from "../constants/kokoro";
import type {
  KokoroLanguage,
  KokoroVoiceSelections,
  TtsListenLanguage,
} from "../types";
import {
  LOCAL_MODEL_CATALOG_VERSION,
  getLocalModel,
} from "../constants/localModels";
import type { SpeechLanguage } from "../constants/speechLanguages";
import { getPhonemePacksForLanguage } from "../constants/phonemePacks";
import {
  arePhonemePacksInstalled,
  installPhonemePacks,
} from "./phonemePacks";
import {
  hasLocalDeviceRuntimePressure,
  probeLocalDeviceCapabilities,
  saveLocalModelBenchmarkResult,
  type LocalModelBenchmarkResult,
} from "./localDeviceCapabilities";

// Streaming rather than one-shot. The wrapper's generateTts runs the neural
// inference inline on the calling thread on both platforms — no dispatch on
// iOS (SherpaOnnx+TTS.mm) and no executor on Android (SherpaOnnxTtsHelper.kt,
// whose executor covers initialization only) — so a one-shot call froze the
// whole app for the duration of synthesis: dead buttons, a stuck CTA, and a
// debug capture that could not even be saved. generateSpeechStream is the
// same work behind dispatch_async / a dedicated Thread. Chunks are
// accumulated here and written as one file, so playback ordering and every
// caller downstream are unchanged.
type KokoroEngine = Awaited<
  ReturnType<
    (typeof import("react-native-sherpa-onnx/tts"))["createStreamingTTS"]
  >
>;

type KokoroSession = {
  engine: KokoroEngine;
  language: KokoroLanguage;
  rootPath: string;
};

export type KokoroInstallStatus = {
  installed: boolean;
  rootPath: string | null;
};

export type KokoroInstallReadiness = KokoroInstallStatus & {
  verified: boolean;
};

export type KokoroDownloadProgress = {
  phase: "downloading" | "extracting";
  progress: number;
};

// Historical name kept by the model archive and by sherpa's own detector; the
// shipped runtime is espeak-free and fills it with libphonemize packs.
const KOKORO_DATA_DIR_NAME = "espeak-ng-data";

// Minimum pack set for a speakable voice when the caller names no languages.
// Chinese needs no pack — it resolves through the model's own lexicon-zh.txt —
// so English alone keeps the data directory non-empty and the model loadable.
const KOKORO_FALLBACK_PHONEME_LANGUAGES: SpeechLanguage[] = ["en"];

let activeSession: KokoroSession | null = null;
let sessionTask = Promise.resolve();
let synthesisTask = Promise.resolve();
let idleReleaseTimer: ReturnType<typeof setTimeout> | null = null;
let appStateSubscription: { remove: () => void } | null = null;

function getDownloadModule() {
  return require("react-native-sherpa-onnx/download") as typeof import("react-native-sherpa-onnx/download");
}

function getTtsModule() {
  return require("react-native-sherpa-onnx/tts") as typeof import("react-native-sherpa-onnx/tts");
}

function getSherpaModule() {
  return require("react-native-sherpa-onnx") as typeof import("react-native-sherpa-onnx");
}

function getFsModule() {
  return require("@dr.pogodin/react-native-fs") as typeof import("@dr.pogodin/react-native-fs");
}

function normalizeText(text: string) {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/…/g, "...");
}

function createAbortError() {
  const error = new Error("Kokoro speech generation was cancelled.");
  error.name = "AbortError";
  return error;
}

function assertNotAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw createAbortError();
  }
}

function assertPinnedKokoroMetadata(model: { bytes: number; sha256?: string }) {
  if (
    model.bytes !== KOKORO_MODEL_DOWNLOAD_BYTES ||
    model.sha256?.toLowerCase() !== KOKORO_MODEL_SHA256
  ) {
    throw new Error(
      "Kokoro changed upstream. Mr Broccoli will not download an unreviewed artifact.",
    );
  }
}

function cancelIdleRelease() {
  if (idleReleaseTimer) {
    clearTimeout(idleReleaseTimer);
    idleReleaseTimer = null;
  }
}

function scheduleIdleRelease() {
  cancelIdleRelease();
  idleReleaseTimer = setTimeout(() => {
    void releaseKokoroResources();
  }, KOKORO_IDLE_RELEASE_MS);
}

async function directoryContainsRequiredModelFiles(path: string) {
  const { exists, readDir } = getFsModule();

  if (!(await exists(path))) {
    return false;
  }

  const entries = await readDir(path);
  const names = new Set(entries.map((entry) => entry.name));
  const hasModel = entries.some(
    (entry) =>
      !entry.isDirectory() &&
      entry.name.endsWith(".onnx") &&
      !entry.name.endsWith(".onnx.json"),
  );

  return (
    hasModel &&
    names.has("voices.bin") &&
    names.has("tokens.txt") &&
    names.has(KOKORO_DATA_DIR_NAME) &&
    names.has("lexicon-us-en.txt") &&
    names.has("lexicon-zh.txt")
  );
}

async function findModelRoot(path: string, depth = 0): Promise<string | null> {
  const { exists, readDir } = getFsModule();

  if (await directoryContainsRequiredModelFiles(path)) {
    return path;
  }

  if (depth >= 3 || !(await exists(path))) {
    return null;
  }

  const entries = await readDir(path);

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const nested = await findModelRoot(entry.path, depth + 1);

    if (nested) {
      return nested;
    }
  }

  return null;
}

export async function getKokoroInstallStatus(): Promise<KokoroInstallStatus> {
  const {
    getLocalModelPathByCategory,
    isModelDownloadedByCategory,
    ModelCategory,
  } = getDownloadModule();
  const installed = await isModelDownloadedByCategory(
    ModelCategory.Tts,
    KOKORO_MODEL_ID,
  );

  if (!installed) {
    return { installed: false, rootPath: null };
  }

  const modelPath = await getLocalModelPathByCategory(
    ModelCategory.Tts,
    KOKORO_MODEL_ID,
  );
  const rootPath = modelPath ? await findModelRoot(modelPath) : null;

  if (modelPath && rootPath) {
    const { mkdir } = getFsModule();
    await mkdir(modelPath, {
      NSURLIsExcludedFromBackupKey: true,
    }).catch(() => undefined);
  }

  return {
    installed: rootPath !== null,
    rootPath,
  };
}

function getRequiredKokoroPhonemeLanguages(
  phonemeLanguages?: SpeechLanguage[],
) {
  const languages =
    phonemeLanguages?.length
      ? phonemeLanguages
      : KOKORO_FALLBACK_PHONEME_LANGUAGES;
  return [...new Set(languages)].filter(
    (language) => getPhonemePacksForLanguage(language).length > 0,
  );
}

async function hasRequiredKokoroPhonemePacks(
  rootPath: string,
  phonemeLanguages?: SpeechLanguage[],
) {
  const languages = getRequiredKokoroPhonemeLanguages(phonemeLanguages);
  return Promise.all(
    languages.map((language) =>
      arePhonemePacksInstalled(
        `${rootPath}/${KOKORO_DATA_DIR_NAME}`,
        language,
      ),
    ),
  ).then((statuses) => statuses.every(Boolean));
}

/**
 * The archive alone is not a usable Kokoro installation. English speech also
 * needs its libphonemize packs, so callers that offer the model to a user
 * must ask for readiness rather than only its downloaded root.
 */
export async function getKokoroInstallReadiness(params?: {
  phonemeLanguages?: SpeechLanguage[];
}): Promise<KokoroInstallReadiness> {
  const status = await getKokoroInstallStatus();
  return {
    ...status,
    verified:
      status.installed &&
      Boolean(status.rootPath) &&
      (await hasRequiredKokoroPhonemePacks(
        status.rootPath ?? "",
        params?.phonemeLanguages,
      )),
  };
}

async function configureModelLexicon(
  rootPath: string,
  language: KokoroLanguage,
) {
  const { copyFile, exists, unlink } = getFsModule();
  const sourcePath =
    language === "zh"
      ? `${rootPath}/lexicon-zh.txt`
      : `${rootPath}/lexicon-us-en.txt`;
  const destinationPath = `${rootPath}/lexicon.txt`;

  if (!(await exists(sourcePath))) {
    throw new Error(`Kokoro's ${language} lexicon is missing.`);
  }

  if (await exists(destinationPath)) {
    await unlink(destinationPath);
  }

  await copyFile(sourcePath, destinationPath);
}

async function downloadKokoroModelInForeground(params?: {
  onProgress?: (progress: KokoroDownloadProgress) => void;
  abortSignal?: AbortSignal;
}) {
  const {
    deleteIncompleteDownload,
    extractModelByCategory,
    getDownloadStorageBase,
    getModelByIdByCategory,
    ModelCategory,
  } = getDownloadModule();
  const { downloadFile, exists, mkdir, stopDownload, unlink } = getFsModule();
  const model = await getModelByIdByCategory(
    ModelCategory.Tts,
    KOKORO_MODEL_ID,
  );

  if (!model) {
    throw new Error("The Kokoro model is not available for download.");
  }
  assertPinnedKokoroMetadata(model);

  await deleteIncompleteDownload(ModelCategory.Tts, KOKORO_MODEL_ID);
  const storageRoot = await getDownloadStorageBase();
  const modelDirectory = `${storageRoot}/sherpa-onnx/models/tts`;
  const archivePath = `${modelDirectory}/${KOKORO_MODEL_ID}.${model.archiveExt}`;
  await mkdir(modelDirectory, {
    NSURLIsExcludedFromBackupKey: true,
  });

  if (await exists(archivePath)) {
    await unlink(archivePath);
  }

  assertNotAborted(params?.abortSignal);
  const task = downloadFile({
    fromUrl: model.downloadUrl,
    toFile: archivePath,
    background: false,
    progressDivider: 1,
    progressInterval: 250,
    readTimeout: 60_000,
    progress: ({ bytesWritten, contentLength }) => {
      const totalBytes = contentLength > 0 ? contentLength : model.bytes;
      params?.onProgress?.({
        phase: "downloading",
        progress:
          totalBytes > 0
            ? Math.max(0, Math.min(1, bytesWritten / totalBytes))
            : 0,
      });
    },
  });
  const abortHandler = () => stopDownload(task.jobId);
  params?.abortSignal?.addEventListener("abort", abortHandler, { once: true });

  try {
    const result = await task.promise;
    assertNotAborted(params?.abortSignal);

    if (result.statusCode < 200 || result.statusCode >= 300) {
      throw new Error(`Kokoro download failed with HTTP ${result.statusCode}.`);
    }

    await extractModelByCategory(ModelCategory.Tts, KOKORO_MODEL_ID, {
      signal: params?.abortSignal,
      deleteArchiveAfterExtract: true,
      // Checksum issues must fail closed instead of reaching the library's
      // interactive keep-file prompt.
      onChecksumIssue: async () => false,
      onProgress: (progress) => {
        params?.onProgress?.({
          phase: "extracting",
          progress: Math.max(0, Math.min(1, progress.percent / 100)),
        });
      },
    });
  } catch (error) {
    if (await exists(archivePath)) {
      await unlink(archivePath).catch(() => undefined);
    }
    throw error;
  } finally {
    params?.abortSignal?.removeEventListener("abort", abortHandler);
  }
}

async function destroyActiveSession() {
  const session = activeSession;
  activeSession = null;

  if (session) {
    await session.engine.destroy().catch(() => undefined);
  }
}

async function getKokoroSession(language: KokoroLanguage) {
  const task = sessionTask.then(async () => {
    cancelIdleRelease();

    if (activeSession?.language === language) {
      return activeSession;
    }

    await destroyActiveSession();
    const status = await getKokoroInstallStatus();

    if (!status.rootPath) {
      throw new Error(
        "Download the Kokoro voice model before using on-device speech.",
      );
    }

    // sherpa locates the data directory by scanning file paths for
    // `/espeak-ng-data/`, so an empty one makes it reject the model with an
    // eSpeak-specific message this espeak-free runtime can never satisfy.
    // Report the real problem instead: the pronunciation packs are missing.
    if (
      language === "en" &&
      !(await arePhonemePacksInstalled(
        `${status.rootPath}/${KOKORO_DATA_DIR_NAME}`,
        "en",
      ))
    ) {
      throw new Error(
        "The Kokoro voice is missing its pronunciation packs. Download the voice again to restore them.",
      );
    }

    await configureModelLexicon(status.rootPath, language);
    const { createStreamingTTS } = getTtsModule();
    const { fileModelPath } = getSherpaModule();
    const engine = await createStreamingTTS({
      modelPath: fileModelPath(status.rootPath),
      modelType: "kokoro",
      numThreads: 2,
      debug: false,
      provider: "cpu",
      maxNumSentences: 1,
      silenceScale: 0.2,
    });

    activeSession = {
      engine,
      language,
      rootPath: status.rootPath,
    };
    return activeSession;
  });

  sessionTask = task.then(
    () => undefined,
    () => undefined,
  );
  const result = await task;

  if (!result) {
    throw new Error("Kokoro could not initialize its voice engine.");
  }

  return result;
}

export async function synthesizeKokoroSpeech(params: {
  text: string;
  listenLanguages?: TtsListenLanguage[];
  voices?: KokoroVoiceSelections;
  abortSignal?: AbortSignal;
}) {
  const language = resolveKokoroLanguage({
    text: params.text,
    listenLanguages: params.listenLanguages,
  });

  if (!language) {
    throw new Error(
      "Kokoro supports English and Simplified Chinese and cannot speak the selected reply languages.",
    );
  }

  const selectedVoice =
    params.voices?.[language] ?? DEFAULT_KOKORO_VOICES[language];
  const voice = getKokoroVoiceConfig(language, selectedVoice);
  const task = synthesisTask.then(async () => {
    let fileUri: string | null = null;

    try {
      assertNotAborted(params.abortSignal);
      const session = await getKokoroSession(language);
      assertNotAborted(params.abortSignal);
      const audio = await new Promise<{
        samples: number[];
        sampleRate: number;
      }>((resolve, reject) => {
        const samples: number[] = [];
        let sampleRate = 0;

        void session.engine
          .generateSpeechStream(
            normalizeText(params.text),
            {
              sid: voice.sid,
              speed: 1,
              silenceScale: 0.2,
            },
            {
              onChunk: (chunk) => {
                sampleRate = chunk.sampleRate || sampleRate;
                for (const sample of chunk.samples) {
                  samples.push(sample);
                }
              },
              onEnd: (event) => {
                if (event.cancelled) {
                  reject(new Error("Kokoro synthesis was cancelled."));
                  return;
                }

                resolve({ sampleRate, samples });
              },
              onError: (event) => {
                reject(
                  new Error(
                    `Kokoro synthesis failed: ${event.message ?? "unknown error"}`,
                  ),
                );
              },
            },
          )
          .catch(reject);
      });
      assertNotAborted(params.abortSignal);

      if (!audio.samples.length || !audio.sampleRate) {
        throw new Error("Kokoro did not return any audio.");
      }

      fileUri = `${cacheDirectory}kokoro-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.wav`;
      const filePath = fileUri.replace(/^file:\/\//, "");
      const { saveAudioToFile } = getTtsModule();
      await saveAudioToFile(audio, filePath);
      assertNotAborted(params.abortSignal);
      return {
        fileUri,
        language,
        voice: voice.id,
        audioDurationSeconds: audio.samples.length / audio.sampleRate,
      };
    } catch (error) {
      if (fileUri) {
        await deleteAsync(fileUri, {
          idempotent: true,
        }).catch(() => undefined);
      }

      throw error;
    }
  });

  synthesisTask = task.then(
    () => undefined,
    () => undefined,
  );

  try {
    return await task;
  } finally {
    scheduleIdleRelease();
  }
}

export async function verifyKokoroModel(params?: { language?: KokoroLanguage }) {
  const language = params?.language ?? "en";
  const result = await synthesizeKokoroSpeech({
    text: language === "zh" ? "你好，我是 Mr Broccoli。" : "Hello from Mr Broccoli.",
    listenLanguages: [language === "zh" ? "zh-CN" : "en"],
    voices: DEFAULT_KOKORO_VOICES,
  });
  const info = await getInfoAsync(result.fileUri);

  await deleteAsync(result.fileUri, {
    idempotent: true,
  }).catch(() => undefined);

  if (!info.exists || !("size" in info) || (info.size ?? 0) <= 44) {
    throw new Error("Kokoro installed, but its voice test produced no audio.");
  }
}

export async function benchmarkKokoroModel(
  language: KokoroLanguage,
): Promise<LocalModelBenchmarkResult> {
  const model = getLocalModel("kokoro-multilingual");
  const device = await probeLocalDeviceCapabilities();
  const startedAt = Date.now();
  let generatedFileUri: string | null = null;

  try {
    await releaseKokoroResources();
    const result = await synthesizeKokoroSpeech({
      text:
        language === "zh"
          ? "你好，我是 Mr Broccoli。"
          : "Hello from Mr Broccoli.",
      listenLanguages: [language === "zh" ? "zh-CN" : "en"],
      voices: DEFAULT_KOKORO_VOICES,
    });
    generatedFileUri = result.fileUri;
    const durationMs = Date.now() - startedAt;
    const realtimeFactor =
      durationMs / 1000 / Math.max(0.001, result.audioDurationSeconds);
    const status =
      durationMs <= model.benchmark.maximumLoadMs &&
      realtimeFactor <= (model.benchmark.maximumRealtimeFactor ?? Infinity)
        ? "viable"
        : "below-target";
    const benchmark: LocalModelBenchmarkResult = {
      modelId: model.id,
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: new Date().toISOString(),
      status,
      loadMs: durationMs,
      durationMs,
      realtimeFactor,
      measuredUnderPressure: hasLocalDeviceRuntimePressure(device),
      device,
    };
    await saveLocalModelBenchmarkResult(benchmark);
    return benchmark;
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const benchmark: LocalModelBenchmarkResult = {
      modelId: model.id,
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: new Date().toISOString(),
      status: "failed",
      loadMs: durationMs,
      durationMs,
      detail: error instanceof Error ? error.message : String(error),
      measuredUnderPressure: hasLocalDeviceRuntimePressure(device),
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
    await releaseKokoroResources().catch(() => undefined);
  }
}

export async function downloadKokoroModel(params?: {
  onProgress?: (progress: KokoroDownloadProgress) => void;
  abortSignal?: AbortSignal;
  /**
   * Conversation languages whose libphonemize packs should be installed
   * alongside the model. Omitting them installs the minimum English pack set
   * so an independently downloaded voice is immediately speakable.
   */
  phonemeLanguages?: SpeechLanguage[];
}) {
  const requiredLanguages = getRequiredKokoroPhonemeLanguages(
    params?.phonemeLanguages,
  );
  let status = await getKokoroInstallStatus();

  if (!status.installed) {
    const {
      downloadModelByCategory,
      getModelByIdByCategory,
      ModelCategory,
      refreshModelsByCategory,
    } = getDownloadModule();
    const { getFSInfo } = getFsModule();
    const storage = await getFSInfo().catch(() => null);
    const freeBytes = storage
      ? Number(storage.freeSpaceEx || storage.freeSpace)
      : Number.NaN;
    const requiredBytes = Math.ceil(
      (KOKORO_MODEL_DOWNLOAD_BYTES + KOKORO_MODEL_INSTALLED_BYTES) * 1.15,
    );

    if (Number.isFinite(freeBytes) && freeBytes < requiredBytes) {
      throw new Error(
        `Kokoro needs about ${Math.ceil(requiredBytes / 1024 / 1024)} MB of free space while it installs.`,
      );
    }

    await refreshModelsByCategory(ModelCategory.Tts);
    const model = await getModelByIdByCategory(
      ModelCategory.Tts,
      KOKORO_MODEL_ID,
    );
    if (!model) {
      throw new Error("The Kokoro model is not available for download.");
    }
    assertPinnedKokoroMetadata(model);
    try {
      await downloadModelByCategory(ModelCategory.Tts, KOKORO_MODEL_ID, {
        signal: params?.abortSignal,
        deleteArchiveAfterExtract: true,
        // Checksum issues must fail closed instead of reaching the library's
        // interactive keep-file prompt.
        onChecksumIssue: async () => false,
        onProgress: (progress) => {
          params?.onProgress?.({
            phase: progress.phase ?? "downloading",
            progress: Math.max(0, Math.min(1, progress.percent / 100)),
          });
        },
      });
    } catch (error) {
      if (
        Platform.OS !== "ios" ||
        params?.abortSignal?.aborted ||
        (error instanceof Error && error.name === "AbortError")
      ) {
        throw error;
      }

      await downloadKokoroModelInForeground(params);
    }

    status = await getKokoroInstallStatus();
  }

  if (!status.installed) {
    throw new Error(
      "The Kokoro download finished, but its model files could not be found.",
    );
  }

  if (status.rootPath) {
    const dataDir = `${status.rootPath}/${KOKORO_DATA_DIR_NAME}`;
    for (const language of requiredLanguages) {
      await installPhonemePacks(dataDir, language, {
        abortSignal: params?.abortSignal,
      });
    }

    if (
      !params?.abortSignal?.aborted &&
      !(await hasRequiredKokoroPhonemePacks(
        status.rootPath,
        params?.phonemeLanguages,
      ))
    ) {
      throw new Error(
        "The Kokoro download finished, but its required pronunciation packs could not be installed. The voice cannot speak without them.",
      );
    }
  }
}

export async function removeKokoroModel() {
  const { deleteModelByCategory, ModelCategory } = getDownloadModule();
  await releaseKokoroResources();
  await deleteModelByCategory(ModelCategory.Tts, KOKORO_MODEL_ID);
}

export async function releaseKokoroResources() {
  cancelIdleRelease();
  await synthesisTask.catch(() => undefined);
  cancelIdleRelease();
  const task = sessionTask.then(destroyActiveSession);
  sessionTask = task.then(
    () => undefined,
    () => undefined,
  );
  await task;
}

export function installKokoroLifecycleGuard() {
  if (appStateSubscription) {
    return () => undefined;
  }

  appStateSubscription = AppState.addEventListener(
    "change",
    (nextState: AppStateStatus) => {
      if (nextState === "background" || nextState === "inactive") {
        void releaseKokoroResources();
      }
    },
  );

  return () => {
    appStateSubscription?.remove();
    appStateSubscription = null;
  };
}
