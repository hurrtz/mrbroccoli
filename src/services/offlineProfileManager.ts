import {
  LOCAL_MODEL_CATALOG,
  type LocalModelId,
  type LocalTtsModelId,
} from "../constants/localModels";
import type { SpeechLanguage } from "../constants/speechLanguages";
import type { SttLanguage } from "../types";
import {
  getLocalModelBenchmarkResults,
  localModelBenchmarkMatchesDevice,
  probeLocalDeviceCapabilities,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "./localDeviceCapabilities";
import {
  downloadKokoroModel,
  getKokoroInstallReadiness,
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

async function getInstallStatus(
  modelId: LocalModelId,
  phonemeLanguages?: SpeechLanguage[],
) {
  if (modelId === "kokoro-multilingual") {
    const status = await getKokoroInstallReadiness({ phonemeLanguages });
    return {
      installed: status.installed,
      path: status.rootPath,
      verified: status.verified,
    } satisfies LocalModelInstallStatus;
  }
  return getLocalModelInstallStatus(modelId);
}

export async function getLocalCatalogInstallStatuses(options?: {
  phonemeLanguages?: SpeechLanguage[];
}) {
  return Object.fromEntries(
    await Promise.all(
      LOCAL_MODEL_CATALOG.map(
        async (model) =>
          [
            model.id,
            await getInstallStatus(model.id, options?.phonemeLanguages),
          ] as const,
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
        async (model) =>
          [model.id, await getInstallStatus(model.id, profile.languages)] as const,
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
    phonemeLanguages?: SpeechLanguage[];
  },
) {
  if (modelId === "kokoro-multilingual") {
    // The espeak-free runtime phonemizes through libphonemize, so the
    // profile's languages must bring their packs with the voice.
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

export async function prepareOfflineProfile(
  profile: OfflineProfile,
  options?: {
    abortSignal?: AbortSignal;
    onProgress?: (progress: OfflinePreparationProgress) => void;
  },
) {
  const models = getOfflineProfileModels(profile);
  const [installEntries, benchmarks, snapshot] = await Promise.all([
    Promise.all(
      models.map(
        async (model) =>
          [model.id, await getInstallStatus(model.id, profile.languages)] as const,
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
          phonemeLanguages: profile.languages,
        });
      } else {
        const benchmark = await benchmarkProfileModel(profile, model.id);
        if (benchmark.status !== "viable") {
          throw new Error(
            benchmark.measuredUnderPressure
              ? `${model.name} could not be validated because the phone was busy, throttled, or in battery saver. Try again.`
              : benchmark.detail ||
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
