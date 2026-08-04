import {
  LOCAL_MODEL_CATALOG,
  type LocalModelId,
  type LocalTtsModelId,
} from "../constants/localModels";
import type { SttLanguage } from "../types";
import {
  getLocalModelBenchmarkResults,
  hasLocalDeviceRuntimePressure,
  localModelBenchmarkMatchesDevice,
  probeLocalDeviceCapabilities,
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
import { recordDebugLogEvent } from "./debugLogCapture";

const THERMAL_RECHECK_INTERVAL_MS = 5_000;
const BENCHMARK_COOLDOWN_MS = 5_000;
const DOWNLOAD_COOLDOWN_MS = 2_000;

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
  action: "downloading" | "benchmarking" | "cooling";
  stepProgress: number | null;
  download?: LocalModelDownloadProgress;
}

export interface OfflinePreparationStep {
  modelId: LocalModelId;
  action: Exclude<OfflinePreparationProgress["action"], "cooling">;
}

export function getOfflineProfileValidationModels(profile: OfflineProfile) {
  return [
    profile.llm,
    ...(profile.stt ? [profile.stt] : []),
    ...(profile.tts ? [profile.tts] : []),
  ];
}

export function getOfflinePreparationSteps(
  profile: OfflineProfile,
  installs: OfflineProfileReadiness["installs"],
  benchmarks: OfflineProfileReadiness["benchmarks"] = {},
  snapshot?: LocalDeviceSnapshot,
): OfflinePreparationStep[] {
  const models = getOfflineProfileModels(profile);
  const validationModels = getOfflineProfileValidationModels(profile);
  return [
    ...models
      .filter((model) => !installs[model.id]?.verified)
      .map((model) => ({
        modelId: model.id,
        action: "downloading" as const,
      })),
    ...validationModels
      .filter((model) => {
        const benchmark = benchmarks[model.id];
        return (
          benchmark?.status !== "viable" ||
          !snapshot ||
          !localModelBenchmarkMatchesDevice(benchmark, snapshot)
        );
      })
      .map((model) => ({
        modelId: model.id,
        action: "benchmarking" as const,
      })),
  ];
}

export function evaluateOfflineProfileReadiness(params: {
  profile: OfflineProfile;
  snapshot: LocalDeviceSnapshot;
  installs: Partial<Record<LocalModelId, LocalModelInstallStatus>>;
  benchmarks: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}): OfflineProfileReadiness {
  const models = getOfflineProfileModels(params.profile);
  const missingModel = models.find((model) => {
    const install = params.installs[model.id];
    return !install?.installed || !install.verified;
  });
  const failedValidationModel = getOfflineProfileValidationModels(
    params.profile,
  ).find((model) => {
    const benchmark = params.benchmarks[model.id];
    return (
      benchmark?.status !== "viable" ||
      !localModelBenchmarkMatchesDevice(benchmark, params.snapshot)
    );
  });
  const failedModel = missingModel ?? failedValidationModel;

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

function createAbortError() {
  const error = new Error("Setup was cancelled.");
  error.name = "AbortError";
  return error;
}

async function abortableDelay(durationMs: number, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw createAbortError();
  }
  if (durationMs <= 0) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      reject(createAbortError());
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, durationMs);
    signal?.addEventListener("abort", abort, { once: true });
  });
}

async function waitForThermalHeadroom(params: {
  abortSignal?: AbortSignal;
  onPressure: (snapshot: LocalDeviceSnapshot) => void;
  onResumed: (snapshot: LocalDeviceSnapshot) => void;
  pollIntervalMs: number;
}) {
  let paused = false;
  while (true) {
    if (params.abortSignal?.aborted) {
      throw createAbortError();
    }
    const snapshot = await probeLocalDeviceCapabilities();
    if (!hasLocalDeviceRuntimePressure(snapshot)) {
      if (paused) {
        params.onResumed(snapshot);
      }
      return snapshot;
    }
    paused = true;
    params.onPressure(snapshot);
    await abortableDelay(params.pollIntervalMs, params.abortSignal);
  }
}

export async function prepareOfflineProfile(
  profile: OfflineProfile,
  options?: {
    abortSignal?: AbortSignal;
    benchmarkCooldownMs?: number;
    downloadCooldownMs?: number;
    onProgress?: (progress: OfflinePreparationProgress) => void;
    thermalPollIntervalMs?: number;
  },
) {
  const models = getOfflineProfileModels(profile);
  const [installEntries, benchmarks, snapshot] = await Promise.all([
    Promise.all(
      models.map(
        async (model) => [model.id, await getInstallStatus(model.id)] as const,
      ),
    ),
    getLocalModelBenchmarkResults(),
    probeLocalDeviceCapabilities(),
  ]);
  const steps = getOfflinePreparationSteps(
    profile,
    Object.fromEntries(installEntries),
    benchmarks,
    snapshot,
  );

  recordDebugLogEvent({
    event: "offline-profile-preparation-started",
    payload: {
      modelIds: models.map((model) => model.id),
      stepCount: steps.length,
      thermalState: snapshot.thermalState,
    },
  });

  try {
    for (const [stepIndex, step] of steps.entries()) {
      if (options?.abortSignal?.aborted) {
        throw createAbortError();
      }
      const model = models.find((candidate) => candidate.id === step.modelId);
      if (!model) {
        throw new Error(`Unknown setup model: ${step.modelId}`);
      }
      const progress = (
        stepProgress: number | null,
        download?: LocalModelDownloadProgress,
        action: OfflinePreparationProgress["action"] = step.action,
      ): OfflinePreparationProgress => ({
        modelId: model.id,
        stepIndex,
        stepCount: steps.length,
        stepsRemaining:
          steps.length - stepIndex - (stepProgress === 1 ? 1 : 0),
        action,
        stepProgress,
        download,
      });

      await waitForThermalHeadroom({
        abortSignal: options?.abortSignal,
        pollIntervalMs:
          options?.thermalPollIntervalMs ?? THERMAL_RECHECK_INTERVAL_MS,
        onPressure: (pressureSnapshot) => {
          options?.onProgress?.(progress(null, undefined, "cooling"));
          recordDebugLogEvent({
            event: "offline-profile-preparation-paused",
            level: "warn",
            payload: {
              lowPowerMode: pressureSnapshot.lowPowerMode,
              memoryLow: pressureSnapshot.memoryLow,
              modelId: model.id,
              stepIndex,
              thermalState: pressureSnapshot.thermalState,
            },
          });
        },
        onResumed: (resumedSnapshot) => {
          recordDebugLogEvent({
            event: "offline-profile-preparation-resumed",
            payload: {
              modelId: model.id,
              stepIndex,
              thermalState: resumedSnapshot.thermalState,
            },
          });
        },
      });

      const stepStartedAt = Date.now();
      options?.onProgress?.(
        progress(step.action === "downloading" ? 0 : null),
      );
      recordDebugLogEvent({
        event: "offline-profile-preparation-step-started",
        payload: { action: step.action, modelId: model.id, stepIndex },
      });
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
      recordDebugLogEvent({
        event: "offline-profile-preparation-step-completed",
        payload: {
          action: step.action,
          durationMs: Date.now() - stepStartedAt,
          modelId: model.id,
          stepIndex,
        },
      });

      options?.onProgress?.(progress(1, undefined, "cooling"));
      await abortableDelay(
        step.action === "benchmarking"
          ? (options?.benchmarkCooldownMs ?? BENCHMARK_COOLDOWN_MS)
          : (options?.downloadCooldownMs ?? DOWNLOAD_COOLDOWN_MS),
        options?.abortSignal,
      );
      await waitForThermalHeadroom({
        abortSignal: options?.abortSignal,
        pollIntervalMs:
          options?.thermalPollIntervalMs ?? THERMAL_RECHECK_INTERVAL_MS,
        onPressure: (pressureSnapshot) => {
          options?.onProgress?.(progress(1, undefined, "cooling"));
          recordDebugLogEvent({
            event: "offline-profile-step-cooling",
            level: "warn",
            payload: {
              lowPowerMode: pressureSnapshot.lowPowerMode,
              memoryLow: pressureSnapshot.memoryLow,
              modelId: model.id,
              stepAction: step.action,
              thermalState: pressureSnapshot.thermalState,
            },
          });
        },
        onResumed: (resumedSnapshot) => {
          recordDebugLogEvent({
            event: "offline-profile-step-cooled",
            payload: {
              modelId: model.id,
              stepAction: step.action,
              thermalState: resumedSnapshot.thermalState,
            },
          });
        },
      });
    }
    recordDebugLogEvent({
      event: "offline-profile-preparation-completed",
      payload: { modelCount: models.length, stepCount: steps.length },
    });
  } catch (error) {
    recordDebugLogEvent({
      event: "offline-profile-preparation-failed",
      level:
        error instanceof Error && error.name === "AbortError"
          ? "info"
          : "error",
      payload: { error, stepCount: steps.length },
    });
    throw error;
  }
}
