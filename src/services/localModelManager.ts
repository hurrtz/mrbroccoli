import {
  LOCAL_MODEL_CATALOG_VERSION,
  getLocalModel,
  type LocalLlmModelDefinition,
  type LocalModelDefinition,
  type LocalModelId,
  type LocalTtsModelDefinition,
} from "../constants/localModels";
import { Platform } from "react-native";
import { arePhonemePacksInstalled, installPhonemePacks } from "./phonemePacks";

export type LocalModelDownloadProgress = {
  phase: "downloading" | "extracting" | "verifying";
  progress: number;
};

export type LocalModelInstallStatus = {
  installed: boolean;
  path: string | null;
  verified: boolean;
};

const LLM_DIRECTORY_NAME = "local-models/llm";

function getFsModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Jest and unsupported builds import-safe
  return require("@dr.pogodin/react-native-fs") as typeof import("@dr.pogodin/react-native-fs");
}

function getDownloadModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Jest and unsupported builds import-safe
  return require("react-native-sherpa-onnx/download") as typeof import("react-native-sherpa-onnx/download");
}

function getSherpaCategory(model: LocalModelDefinition) {
  const { ModelCategory } = getDownloadModule();
  return model.capability === "stt" ? ModelCategory.Stt : ModelCategory.Tts;
}

function needsPhonemePacks(
  model: LocalModelDefinition,
): model is LocalTtsModelDefinition {
  return model.capability === "tts" && model.sherpaModelType === "vits";
}

async function hasRequiredPhonemePacks(
  model: LocalTtsModelDefinition,
  modelPath: string,
) {
  const language = model.languages[0];
  if (!language) {
    return false;
  }
  return arePhonemePacksInstalled(`${modelPath}/espeak-ng-data`, language);
}

async function installRequiredPhonemePacks(
  model: LocalTtsModelDefinition,
  modelPath: string,
  abortSignal?: AbortSignal,
) {
  const language = model.languages[0];
  if (!language) {
    throw new Error(`${model.name} does not declare a speech language.`);
  }
  await installPhonemePacks(`${modelPath}/espeak-ng-data`, language, {
    abortSignal,
  });
}

function llmPaths(model: LocalLlmModelDefinition) {
  const { DocumentDirectoryPath } = getFsModule();
  const directory = `${DocumentDirectoryPath}/${LLM_DIRECTORY_NAME}`;
  const path = `${directory}/${model.fileName}`;
  return {
    directory,
    path,
    partialPath: `${path}.partial`,
    markerPath: `${path}.verified-${LOCAL_MODEL_CATALOG_VERSION}`,
  };
}

function normalizeProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

async function assertPinnedSherpaMetadata(
  model: LocalModelDefinition,
): Promise<{
  archiveExt: "tar.bz2" | "onnx";
  requiresPinnedInstall: boolean;
}> {
  if (model.runtime !== "sherpa-onnx") {
    throw new Error(`${model.name} is not a Sherpa model.`);
  }
  const { getModelByIdByCategory, refreshModelsByCategory } =
    getDownloadModule();
  const category = getSherpaCategory(model);
  await refreshModelsByCategory(category, { forceRefresh: true });
  const remote = await getModelByIdByCategory(category, model.runtimeModelId);

  if (!remote) {
    throw new Error(
      `${model.name} is not present in the pinned runtime catalogue.`,
    );
  }
  if (remote.bytes !== model.downloadBytes) {
    throw new Error(
      `${model.name} changed upstream. Mr Broccoli will not download an unreviewed artifact.`,
    );
  }

  // The registry is useful for availability and archive shape, but its
  // release-wide checksum file can lag an individual GitHub asset. The
  // catalogue's URL, size and SHA-256 remain the app's reviewable contract;
  // a conflicting registry checksum therefore takes the direct pinned path,
  // which hashes the downloaded bytes before extraction. If the actual asset
  // changed, that hash check still fails closed.
  return {
    archiveExt: remote.archiveExt,
    requiresPinnedInstall:
      remote.sha256?.toLowerCase() !== model.sha256.toLowerCase(),
  };
}

async function getVerifiedSherpaArtifactPath(
  model: Exclude<LocalModelDefinition, LocalLlmModelDefinition>,
) {
  const {
    getLocalModelPathByCategory,
    isModelDownloadedByCategory,
    listDownloadedModelsByCategory,
  } = getDownloadModule();
  const category = getSherpaCategory(model);
  const installed = await isModelDownloadedByCategory(
    category,
    model.runtimeModelId,
  );
  if (!installed) {
    return { installed: false, path: null, verified: false };
  }

  const downloaded = await listDownloadedModelsByCategory(category);
  const manifestModel = downloaded.find(
    (candidate) => candidate.id === model.runtimeModelId,
  );
  const verified =
    manifestModel?.bytes === model.downloadBytes &&
    manifestModel.sha256?.toLowerCase() === model.sha256.toLowerCase();
  const path = verified
    ? await getLocalModelPathByCategory(category, model.runtimeModelId)
    : null;

  return { installed: true, path, verified: path !== null };
}

async function downloadSherpaModelInForeground(
  model: Exclude<LocalModelDefinition, LocalLlmModelDefinition>,
  archiveExt: "tar.bz2" | "onnx",
  options?: {
    abortSignal?: AbortSignal;
    onProgress?: (progress: LocalModelDownloadProgress) => void;
  },
) {
  if (archiveExt !== "tar.bz2") {
    throw new Error(
      `${model.name} uses an unsupported local archive format: ${archiveExt}.`,
    );
  }

  const { deleteIncompleteDownload, getDownloadStorageBase, getLocalModelPathByCategory } =
    getDownloadModule();
  const {
    downloadFile,
    exists,
    hash,
    mkdir,
    stopDownload,
    unlink,
    writeFile,
  } = getFsModule();
  const category = getSherpaCategory(model);
  const storageRoot = await getDownloadStorageBase();
  const modelDirectory = `${storageRoot}/sherpa-onnx/models/${category}`;
  const archivePath = `${modelDirectory}/${model.runtimeModelId}.${archiveExt}`;
  const installDirectory = `${modelDirectory}/${model.runtimeModelId}`;

  await deleteIncompleteDownload(category, model.runtimeModelId);
  await mkdir(modelDirectory, { NSURLIsExcludedFromBackupKey: true });
  if (await exists(archivePath)) {
    await unlink(archivePath);
  }

  const task = downloadFile({
    // The Sherpa package uses a background NSURLSession. It can stop iOS
    // Piper downloads without delivering a useful failure to the app. The
    // foreground route is the same verified/extraction path used by Kokoro,
    // so a retry stays visible and can report the actual problem.
    fromUrl: model.downloadUrl,
    toFile: archivePath,
    background: false,
    discretionary: false,
    progressDivider: 1,
    progressInterval: 250,
    readTimeout: 120_000,
    progress: ({ bytesWritten, contentLength }) => {
      const totalBytes = contentLength > 0 ? contentLength : model.downloadBytes;
      options?.onProgress?.({
        phase: "downloading",
        progress:
          totalBytes > 0
            ? normalizeProgress(bytesWritten / totalBytes)
            : 0,
      });
    },
  });
  const abort = () => stopDownload(task.jobId);
  options?.abortSignal?.addEventListener("abort", abort, { once: true });

  try {
    const result = await task.promise;
    if (options?.abortSignal?.aborted) {
      const error = new Error("Download aborted");
      error.name = "AbortError";
      throw error;
    }
    if (result.statusCode < 200 || result.statusCode >= 300) {
      throw new Error(`${model.name} download failed with HTTP ${result.statusCode}.`);
    }
    const digest = (await hash(archivePath, "sha256")).toLowerCase();
    if (digest !== model.sha256.toLowerCase()) {
      throw new Error(`${model.name} failed its SHA-256 integrity check.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports -- keep the service import-safe in Jest and unsupported native builds
    const { extractArchive } = require("react-native-sherpa-onnx/extraction") as
      typeof import("react-native-sherpa-onnx/extraction");
    const extracted = await extractArchive(
      {
        modelId: model.runtimeModelId,
        archivePath,
        format: "tar.bz2",
      },
      installDirectory,
      {
        force: true,
        signal: options?.abortSignal,
        onProgress: (progress) =>
          options?.onProgress?.({
            phase: "extracting",
            progress: normalizeProgress(progress.percent / 100),
          }),
      },
    );
    if (!extracted.success) {
      throw new Error(
        `${model.name} extraction failed${extracted.reason ? `: ${extracted.reason}` : "."}`,
      );
    }
    if (
      extracted.sha256 &&
      extracted.sha256.toLowerCase() !== model.sha256.toLowerCase()
    ) {
      throw new Error(`${model.name} failed its SHA-256 integrity check.`);
    }

    const now = new Date().toISOString();
    const manifestModel = {
      archiveExt,
      bytes: model.downloadBytes,
      category,
      displayName: model.name,
      downloadUrl: model.downloadUrl,
      id: model.runtimeModelId,
      sha256: model.sha256,
    };
    await writeFile(`${installDirectory}/.ready`, "ready", "utf8");
    await writeFile(
      `${installDirectory}/manifest.json`,
      JSON.stringify({
        downloadedAt: now,
        lastUsed: now,
        model: manifestModel,
      }),
      "utf8",
    );
    return (
      (await getLocalModelPathByCategory(category, model.runtimeModelId)) ??
      installDirectory
    );
  } catch (error) {
    if (await exists(archivePath)) {
      await unlink(archivePath).catch(() => undefined);
    }
    throw error;
  } finally {
    options?.abortSignal?.removeEventListener("abort", abort);
  }
}

export async function getLocalModelInstallStatus(
  modelId: LocalModelId,
): Promise<LocalModelInstallStatus> {
  const model = getLocalModel(modelId);

  if (model.runtime === "llama-rn") {
    const { exists, readFile } = getFsModule();
    const paths = llmPaths(model);
    const installed = await exists(paths.path);
    const marker = (await exists(paths.markerPath))
      ? await readFile(paths.markerPath, "utf8").catch(() => "")
      : "";
    return {
      installed,
      path: installed ? paths.path : null,
      verified: installed && marker.trim() === model.sha256,
    };
  }

  const artifact = await getVerifiedSherpaArtifactPath(model);
  const artifactPath = artifact.path;
  const verified =
    artifact.verified &&
    artifactPath !== null &&
    (!needsPhonemePacks(model) ||
      (await hasRequiredPhonemePacks(model, artifactPath)));
  const path = verified ? artifactPath : null;

  return { installed: artifact.installed, path, verified };
}

async function downloadLlmModel(
  model: LocalLlmModelDefinition,
  options?: {
    abortSignal?: AbortSignal;
    onProgress?: (progress: LocalModelDownloadProgress) => void;
  },
) {
  const {
    downloadFile,
    exists,
    hash,
    mkdir,
    moveFile,
    stopDownload,
    unlink,
    writeFile,
  } = getFsModule();
  const paths = llmPaths(model);
  await mkdir(paths.directory, { NSURLIsExcludedFromBackupKey: true });
  for (const path of [paths.partialPath, paths.markerPath]) {
    if (await exists(path)) {
      await unlink(path);
    }
  }

  const task = downloadFile({
    fromUrl: model.downloadUrl,
    toFile: paths.partialPath,
    background: true,
    progressDivider: 1,
    progressInterval: 300,
    readTimeout: 120_000,
    progress: ({ bytesWritten, contentLength }) => {
      const total = contentLength > 0 ? contentLength : model.downloadBytes;
      options?.onProgress?.({
        phase: "downloading",
        progress: total > 0 ? normalizeProgress(bytesWritten / total) : 0,
      });
    },
  });
  const abort = () => stopDownload(task.jobId);
  options?.abortSignal?.addEventListener("abort", abort, { once: true });

  try {
    const response = await task.promise;
    if (options?.abortSignal?.aborted) {
      const error = new Error("Download aborted");
      error.name = "AbortError";
      throw error;
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(
        `${model.name} download failed with HTTP ${response.statusCode}.`,
      );
    }
    options?.onProgress?.({ phase: "verifying", progress: 0 });
    const digest = (await hash(paths.partialPath, "sha256")).toLowerCase();
    if (digest !== model.sha256.toLowerCase()) {
      throw new Error(`${model.name} failed its SHA-256 integrity check.`);
    }
    if (await exists(paths.path)) {
      await unlink(paths.path);
    }
    await moveFile(paths.partialPath, paths.path);
    await writeFile(paths.markerPath, model.sha256, "utf8");
    options?.onProgress?.({ phase: "verifying", progress: 1 });
    return paths.path;
  } catch (error) {
    if (await exists(paths.partialPath)) {
      await unlink(paths.partialPath).catch(() => undefined);
    }
    throw error;
  } finally {
    options?.abortSignal?.removeEventListener("abort", abort);
  }
}

export async function downloadLocalModel(
  modelId: LocalModelId,
  options?: {
    abortSignal?: AbortSignal;
    onProgress?: (progress: LocalModelDownloadProgress) => void;
  },
) {
  const model = getLocalModel(modelId);

  if (model.runtime === "llama-rn") {
    return downloadLlmModel(model, options);
  }

  const remote = await assertPinnedSherpaMetadata(model);
  let artifact = await getVerifiedSherpaArtifactPath(model);
  let modelPath = artifact.path;

  // Retrying a voice whose auxiliary pronunciation packs failed must repair
  // just those packs. Re-downloading a verified model archive wastes data and
  // can make an otherwise recoverable install look permanently broken.
  if (!artifact.verified || !modelPath) {
    const { downloadModelByCategory } = getDownloadModule();
    if (remote.requiresPinnedInstall) {
      modelPath = await downloadSherpaModelInForeground(
        model,
        remote.archiveExt,
        options,
      );
    } else {
      try {
        const result = await downloadModelByCategory(
          getSherpaCategory(model),
          model.runtimeModelId,
          {
            signal: options?.abortSignal,
            deleteArchiveAfterExtract: true,
            // Never fall back to the library's interactive keep-file prompt: a
            // checksum mismatch must always fail closed so an unverified artifact
            // can never be recorded as installed.
            onChecksumIssue: async () => false,
            onProgress: (progress) =>
              options?.onProgress?.({
                phase: progress.phase ?? "downloading",
                progress: normalizeProgress(progress.percent / 100),
              }),
          },
        );
        modelPath = result.localPath;
      } catch (error) {
        if (
          Platform.OS !== "ios" ||
          options?.abortSignal?.aborted ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          throw error;
        }
        modelPath = await downloadSherpaModelInForeground(
          model,
          remote.archiveExt,
          options,
        );
      }
    }
    artifact = await getVerifiedSherpaArtifactPath(model);
  }
  if (needsPhonemePacks(model)) {
    await installRequiredPhonemePacks(
      model,
      modelPath,
      options?.abortSignal,
    );
  }
  const status = await getLocalModelInstallStatus(model.id);
  if (!status.verified) {
    throw new Error(
      `${model.name} installed but did not match the pinned artifact.`,
    );
  }
  return modelPath;
}

export async function removeLocalModel(modelId: LocalModelId) {
  const model = getLocalModel(modelId);

  if (model.runtime === "llama-rn") {
    const { exists, unlink } = getFsModule();
    const paths = llmPaths(model);
    for (const path of [paths.path, paths.partialPath, paths.markerPath]) {
      if (await exists(path)) {
        await unlink(path);
      }
    }
    return;
  }

  const { deleteModelByCategory } = getDownloadModule();
  await deleteModelByCategory(getSherpaCategory(model), model.runtimeModelId);
}
