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
  stepIndex: number;
  stepCount: number;
  stepsRemaining: number;
  action: "downloading" | "benchmarking";
  stepProgress: number | null;
  download?: LocalModelDownloadProgress;
}

export interface OfflinePreparationStep {
  modelId: LocalModelId;
  action: OfflinePreparationProgress["action"];
}

export function getOfflinePreparationSteps(
  profile: OfflineProfile,
  installs: OfflineProfileReadiness["installs"],
): OfflinePreparationStep[] {
  const models = getOfflineProfileModels(profile);
  return [
    ...models
      .filter((model) => !installs[model.id]?.verified)
      .map((model) => ({
        modelId: model.id,
        action: "downloading" as const,
      })),
    ...models.map((model) => ({
      modelId: model.id,
      action: "benchmarking" as const,
    })),
  ];
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
  if (modelId === profile.stt?.id) {
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
  const installEntries = await Promise.all(
    models.map(
      async (model) => [model.id, await getInstallStatus(model.id)] as const,
    ),
  );
  const steps = getOfflinePreparationSteps(
    profile,
    Object.fromEntries(installEntries),
  );

  for (const [stepIndex, step] of steps.entries()) {
    if (options?.abortSignal?.aborted) {
      const abortError = new Error("Setup was cancelled.");
      abortError.name = "AbortError";
      throw abortError;
    }
    const model = models.find((candidate) => candidate.id === step.modelId);
    if (!model) {
      throw new Error(`Unknown setup model: ${step.modelId}`);
    }
    const progress = (
      stepProgress: number | null,
      download?: LocalModelDownloadProgress,
    ): OfflinePreparationProgress => ({
      modelId: model.id,
      stepIndex,
      stepCount: steps.length,
      stepsRemaining: steps.length - stepIndex - (stepProgress === 1 ? 1 : 0),
      action: step.action,
      stepProgress,
      download,
    });

    options?.onProgress?.(progress(step.action === "downloading" ? 0 : null));
    if (step.action === "downloading") {
      await downloadProfileModel(model.id, {
        abortSignal: options?.abortSignal,
        onProgress: (download) =>
          options?.onProgress?.(progress(download.progress, download)),
      });
    } else {
      const benchmark = await benchmarkProfileModel(profile, model.id);
      if (benchmark.status !== "viable") {
        throw new Error(
          benchmark.detail ||
            `${model.name} is not fast enough on this device.`,
        );
      }
    }
    options?.onProgress?.(progress(1));
  }
}
