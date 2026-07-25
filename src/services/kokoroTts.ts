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
  getKokoroVoiceConfig,
  resolveKokoroLanguage,
} from "../constants/kokoro";
import type {
  KokoroLanguage,
  KokoroVoiceSelections,
  TtsListenLanguage,
} from "../types";

type KokoroEngine = Awaited<
  ReturnType<typeof import("react-native-sherpa-onnx/tts")["createTTS"]>
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

export type KokoroDownloadProgress = {
  phase: "downloading" | "extracting";
  progress: number;
};

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
    names.has("espeak-ng-data") &&
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
  const {
    downloadFile,
    exists,
    mkdir,
    stopDownload,
    unlink,
  } = getFsModule();
  const model = await getModelByIdByCategory(ModelCategory.Tts, KOKORO_MODEL_ID);

  if (!model) {
    throw new Error("The Kokoro model is not available for download.");
  }

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

    await configureModelLexicon(status.rootPath, language);
    const { createTTS } = getTtsModule();
    const { fileModelPath } = getSherpaModule();
    const engine = await createTTS({
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
      const audio = await session.engine.generateSpeech(
        normalizeText(params.text),
        {
          sid: voice.sid,
          speed: 1,
          silenceScale: 0.2,
        },
      );
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

export async function verifyKokoroModel() {
  const result = await synthesizeKokoroSpeech({
    text: "Hello from Mr Broccoli.",
    listenLanguages: ["en"],
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

export async function downloadKokoroModel(params?: {
  onProgress?: (progress: KokoroDownloadProgress) => void;
  abortSignal?: AbortSignal;
}) {
  const {
    downloadModelByCategory,
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
  try {
    await downloadModelByCategory(ModelCategory.Tts, KOKORO_MODEL_ID, {
      signal: params?.abortSignal,
      deleteArchiveAfterExtract: true,
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

  const status = await getKokoroInstallStatus();

  if (!status.installed) {
    throw new Error(
      "The Kokoro download finished, but its model files could not be found.",
    );
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
