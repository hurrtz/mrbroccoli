import {
  LOCAL_MODEL_CATALOG_VERSION,
  getLocalModel,
  type LocalLlmModelDefinition,
  type LocalModelDefinition,
  type LocalModelId,
} from "../constants/localModels";

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

async function assertPinnedSherpaMetadata(model: LocalModelDefinition) {
  if (model.runtime !== "sherpa-onnx") {
    return;
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
  if (
    remote.bytes !== model.downloadBytes ||
    remote.sha256?.toLowerCase() !== model.sha256.toLowerCase()
  ) {
    throw new Error(
      `${model.name} changed upstream. Mr Broccoli will not download an unreviewed artifact.`,
    );
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
  const downloaded = installed
    ? await listDownloadedModelsByCategory(category)
    : [];
  const manifestModel = downloaded.find(
    (candidate) => candidate.id === model.runtimeModelId,
  );
  const verified =
    installed &&
    manifestModel?.bytes === model.downloadBytes &&
    manifestModel.sha256?.toLowerCase() === model.sha256.toLowerCase();
  const path = verified
    ? await getLocalModelPathByCategory(category, model.runtimeModelId)
    : null;

  return { installed, path, verified };
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

  await assertPinnedSherpaMetadata(model);
  const { downloadModelByCategory } = getDownloadModule();
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
  const status = await getLocalModelInstallStatus(model.id);
  if (!status.verified) {
    throw new Error(
      `${model.name} installed but did not match the pinned artifact.`,
    );
  }
  return result.localPath;
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
