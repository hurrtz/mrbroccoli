import {
  LOCAL_MODEL_CATALOG,
  type LocalModelId,
  type LocalTtsModelId,
} from "../constants/localModels";
import type { SttLanguage } from "../types";
import {
  getLocalModelBenchmarkResults,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "./localDeviceCapabilities";
import {
  downloadKokoroModel,
  getKokoroInstallStatus,
  benchmarkKokoroModel,
} from "./kokoroTts";
import { benchmarkLocalLlm } from "./localLlm";
import {
  downloadLocalModel,
  getLocalModelInstallStatus,
  type LocalModelDownloadProgress,
  type LocalModelInstallStatus,
} from "./localModelManager";
import { benchmarkLocalStt, benchmarkLocalTts } from "./localSpeechModels";
import { getOfflineProfileModels, type OfflineProfile } from "./offlineProfile";

export interface OfflineProfileReadiness {
  ready: boolean;
  installed: boolean;
  failedModelId: LocalModelId | null;
  installs: Partial<Record<LocalModelId, LocalModelInstallStatus>>;
  benchmarks: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}

export interface OfflinePreparationProgress {
  modelId: LocalModelId;
  modelIndex: number;
  modelCount: number;
  action: "checking" | "downloading" | "benchmarking";
  download?: LocalModelDownloadProgress;
}

function benchmarkMatchesDevice(
  benchmark: LocalModelBenchmarkResult | undefined,
  snapshot: LocalDeviceSnapshot,
) {
  return (
    benchmark?.status === "viable" &&
    benchmark.device.platform === snapshot.platform &&
    benchmark.device.architecture === snapshot.architecture &&
    benchmark.device.osVersion === snapshot.osVersion &&
    benchmark.device.physicalMemoryBytes === snapshot.physicalMemoryBytes
  );
}

export function evaluateOfflineProfileReadiness(params: {
  profile: OfflineProfile;
  snapshot: LocalDeviceSnapshot;
  installs: Partial<Record<LocalModelId, LocalModelInstallStatus>>;
  benchmarks: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}): OfflineProfileReadiness {
  const models = getOfflineProfileModels(params.profile);
  const failedModel = models.find((model) => {
    const install = params.installs[model.id];
    return (
      !install?.installed ||
      !install.verified ||
      !benchmarkMatchesDevice(params.benchmarks[model.id], params.snapshot)
    );
  });

  return {
    ready: !failedModel,
    installed: models.every((model) => {
      const install = params.installs[model.id];
      return install?.installed === true && install.verified === true;
    }),
    failedModelId: failedModel?.id ?? null,
    installs: params.installs,
    benchmarks: params.benchmarks,
  };
}

async function getInstallStatus(modelId: LocalModelId) {
  if (modelId === "kokoro-multilingual") {
    const status = await getKokoroInstallStatus();
    return {
      installed: status.installed,
      path: status.rootPath,
      verified: status.installed && Boolean(status.rootPath),
    } satisfies LocalModelInstallStatus;
  }
  return getLocalModelInstallStatus(modelId);
}

export async function getLocalCatalogInstallStatuses() {
  return Object.fromEntries(
    await Promise.all(
      LOCAL_MODEL_CATALOG.map(
        async (model) => [model.id, await getInstallStatus(model.id)] as const,
      ),
    ),
  ) as Partial<Record<LocalModelId, LocalModelInstallStatus>>;
}

export async function getOfflineProfileReadiness(
  profile: OfflineProfile,
  snapshot: LocalDeviceSnapshot,
) {
  const [installEntries, benchmarks] = await Promise.all([
    Promise.all(
      getOfflineProfileModels(profile).map(
        async (model) => [model.id, await getInstallStatus(model.id)] as const,
      ),
    ),
    getLocalModelBenchmarkResults(),
  ]);
  return evaluateOfflineProfileReadiness({
    profile,
    snapshot,
    installs: Object.fromEntries(installEntries),
    benchmarks,
  });
}

async function downloadProfileModel(
  modelId: LocalModelId,
  options: {
    abortSignal?: AbortSignal;
    onProgress?: (progress: LocalModelDownloadProgress) => void;
  },
) {
  if (modelId === "kokoro-multilingual") {
    await downloadKokoroModel(options);
    return;
  }
  await downloadLocalModel(modelId, options);
}

async function benchmarkProfileModel(
  profile: OfflineProfile,
  modelId: LocalModelId,
) {
  if (modelId === profile.llm.id || modelId === profile.thoroughLlm?.id) {
    return benchmarkLocalLlm(modelId as typeof profile.llm.id);
  }
  if (modelId === profile.stt.id) {
    const language: SttLanguage =
      profile.languages.length === 1 ? profile.languages[0] : "auto";
    return benchmarkLocalStt(profile.stt.id, language);
  }
  if (modelId === "kokoro-multilingual") {
    return benchmarkKokoroModel(
      profile.languages.includes("zh-CN") ? "zh" : "en",
    );
  }
  return benchmarkLocalTts(modelId as LocalTtsModelId, profile.languages[0]);
}

export async function prepareOfflineProfile(
  profile: OfflineProfile,
  options?: {
    abortSignal?: AbortSignal;
    onProgress?: (progress: OfflinePreparationProgress) => void;
  },
) {
  const models = getOfflineProfileModels(profile);

  for (const [index, model] of models.entries()) {
    options?.onProgress?.({
      modelId: model.id,
      modelIndex: index,
      modelCount: models.length,
      action: "checking",
    });
    const status = await getInstallStatus(model.id);
    if (!status.verified) {
      await downloadProfileModel(model.id, {
        abortSignal: options?.abortSignal,
        onProgress: (download) =>
          options?.onProgress?.({
            modelId: model.id,
            modelIndex: index,
            modelCount: models.length,
            action: "downloading",
            download,
          }),
      });
    }
  }

  for (const [index, model] of models.entries()) {
    options?.onProgress?.({
      modelId: model.id,
      modelIndex: index,
      modelCount: models.length,
      action: "benchmarking",
    });
    const benchmark = await benchmarkProfileModel(profile, model.id);
    if (benchmark.status !== "viable") {
      throw new Error(
        benchmark.detail || `${model.name} is not fast enough on this device.`,
      );
    }
  }
}
