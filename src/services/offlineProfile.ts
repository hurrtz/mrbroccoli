import {
  getLocalModelsForLanguages,
  type LocalLlmModelDefinition,
  type LocalModelDefinition,
  type LocalModelId,
  type LocalSttModelDefinition,
  type LocalTtsModelDefinition,
} from "../constants/localModels";
import type { SpeechLanguage } from "../constants/speechLanguages";
import { createRuntimeProviderStringRecord } from "../constants/providers/runtimeState";
import { getDefaultAssistantInstructions, type Settings } from "../types";
import {
  evaluateLocalModelEligibility,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "./localDeviceCapabilities";

export const FREE_OFFLINE_RESPONSE_MODE_ID = "free-offline";

export interface OfflineProfile {
  languages: SpeechLanguage[];
  llm: LocalLlmModelDefinition;
  stt: LocalSttModelDefinition;
  /** Null means the phone's language-aware system voice is used. */
  tts: LocalTtsModelDefinition | null;
  downloadBytes: number;
  installedBytes: number;
  minimumFreeStorageBytes: number;
  retryLater: boolean;
}

export function getOfflineProfileModels(profile: OfflineProfile) {
  return [
    profile.llm,
    profile.stt,
    ...(profile.tts ? [profile.tts] : []),
  ] satisfies LocalModelDefinition[];
}

export type OfflineProfileSelection =
  | { status: "ready"; profile: OfflineProfile }
  | {
      status: "unavailable";
      reason: "language" | "device" | "storage" | "temporary-device-state";
    };

function isPermanentlyEligible(
  model: LocalModelDefinition,
  snapshot: LocalDeviceSnapshot,
) {
  const result = evaluateLocalModelEligibility(model, {
    ...snapshot,
    freeStorageBytes: Number.MAX_SAFE_INTEGER,
  });
  return {
    eligible: result.eligible,
    retryLater: result.retryLater,
  };
}

function ttsPreference(model: LocalTtsModelDefinition) {
  return model.sherpaModelType === "kokoro" ? 0 : 1;
}

function modelSafetyReserve(model: LocalModelDefinition) {
  return Math.max(
    0,
    model.requirements.minimumFreeStorageBytes - model.installedBytes,
  );
}

function benchmarkMatchesDevice(
  benchmark: LocalModelBenchmarkResult | undefined,
  snapshot: LocalDeviceSnapshot,
) {
  return (
    benchmark?.device.platform === snapshot.platform &&
    benchmark.device.architecture === snapshot.architecture &&
    benchmark.device.osVersion === snapshot.osVersion &&
    benchmark.device.physicalMemoryBytes === snapshot.physicalMemoryBytes
  );
}

function modelPreference(params: {
  model: LocalModelDefinition;
  snapshot: LocalDeviceSnapshot;
  installedModelIds?: ReadonlySet<LocalModelId>;
  benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}) {
  const benchmark = params.benchmarks?.[params.model.id];
  const currentBenchmark = benchmarkMatchesDevice(benchmark, params.snapshot)
    ? benchmark
    : undefined;
  const knownFailure =
    currentBenchmark?.status === "below-target" ||
    currentBenchmark?.status === "failed";
  const installed = params.installedModelIds?.has(params.model.id) === true;

  return (
    (knownFailure ? 100 : 0) +
    (installed ? 0 : 10) +
    (currentBenchmark?.status === "viable" ? 0 : 1)
  );
}

function sortCandidates<T extends LocalModelDefinition>(params: {
  models: T[];
  snapshot: LocalDeviceSnapshot;
  installedModelIds?: ReadonlySet<LocalModelId>;
  benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
  tieBreaker?: (model: T) => number;
}) {
  return [...params.models].sort(
    (left, right) =>
      modelPreference({ ...params, model: left }) -
        modelPreference({ ...params, model: right }) ||
      (params.tieBreaker?.(left) ?? left.installedBytes) -
        (params.tieBreaker?.(right) ?? right.installedBytes) ||
      left.installedBytes - right.installedBytes,
  );
}

export function selectOfflineProfile(params: {
  languages: readonly SpeechLanguage[];
  snapshot: LocalDeviceSnapshot;
  installedModelIds?: ReadonlySet<LocalModelId>;
  benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}): OfflineProfileSelection {
  const languages = Array.from(new Set(params.languages));
  if (languages.length === 0) {
    return { status: "unavailable", reason: "language" };
  }

  const llms = getLocalModelsForLanguages("llm", languages);
  const sttModels = getLocalModelsForLanguages("stt", languages);
  const ttsModels = getLocalModelsForLanguages("tts", languages).sort(
    (left, right) =>
      ttsPreference(left) - ttsPreference(right) ||
      left.installedBytes - right.installedBytes,
  );

  if (!llms.length || !sttModels.length) {
    return { status: "unavailable", reason: "language" };
  }

  const viableLlms = llms.filter(
    (model) => isPermanentlyEligible(model, params.snapshot).eligible,
  );
  const viableStt = sttModels.filter(
    (model) => isPermanentlyEligible(model, params.snapshot).eligible,
  );
  const viableTts = ttsModels.filter(
    (model) => isPermanentlyEligible(model, params.snapshot).eligible,
  );

  if (!viableLlms.length || !viableStt.length) {
    return { status: "unavailable", reason: "device" };
  }

  const candidateOptions = {
    snapshot: params.snapshot,
    installedModelIds: params.installedModelIds,
    benchmarks: params.benchmarks,
  };
  const llm = sortCandidates({
    ...candidateOptions,
    models: viableLlms,
  })[0];
  const stt = sortCandidates({
    ...candidateOptions,
    models: viableStt,
  })[0];
  const tts = viableTts.length
    ? sortCandidates({
        ...candidateOptions,
        models: viableTts,
        tieBreaker: (model) => ttsPreference(model),
      })[0]
    : null;
  const models: LocalModelDefinition[] = [llm, stt, ...(tts ? [tts] : [])];
  const missingModels = models.filter(
    (model) => !params.installedModelIds?.has(model.id),
  );
  const installedBytes = missingModels.reduce(
    (total, model) => total + model.installedBytes,
    0,
  );
  const minimumFreeStorageBytes =
    installedBytes + Math.max(...models.map(modelSafetyReserve));

  if (params.snapshot.freeStorageBytes < minimumFreeStorageBytes) {
    return { status: "unavailable", reason: "storage" };
  }

  const retryLater = models.some(
    (model) => isPermanentlyEligible(model, params.snapshot).retryLater,
  );
  if (retryLater) {
    return { status: "unavailable", reason: "temporary-device-state" };
  }

  return {
    status: "ready",
    profile: {
      languages,
      llm,
      stt,
      tts,
      downloadBytes: missingModels.reduce(
        (total, model) => total + model.downloadBytes,
        0,
      ),
      installedBytes,
      minimumFreeStorageBytes,
      retryLater: false,
    },
  };
}

function applyFreeRuntimeBoundaries(settings: Settings): Settings {
  return {
    ...settings,
    inputMode: "toggle-to-talk",
    replyPlayback: "stream",
    sttProvider: null,
    ttsProvider: null,
    ttsFallbackPolicy: { provider: [], kokoro: [], local: [] },
    assistantInstructions: getDefaultAssistantInstructions(settings.language),
    ttsInstructions: "",
    responseLength: "normal",
    responseTone: "professional",
    showUsageStats: false,
    setupGuideDismissed: true,
    showSetupGuideShortcut: false,
    pastConversationKnowledgeEnabled: false,
    ulraModeEnabled: false,
    ulraModeActive: false,
    webSearchMode: "off",
    webSearchProvider: null,
    apiKeys: createRuntimeProviderStringRecord(),
    providerValidationResults: {},
  };
}

export function applyOfflineProfileToSettings(
  settings: Settings,
  profile: OfflineProfile,
): Settings {
  const ttsIsKokoro = profile.tts?.id === "kokoro-multilingual";

  return {
    ...applyFreeRuntimeBoundaries(settings),
    activeResponseMode: FREE_OFFLINE_RESPONSE_MODE_ID,
    responseModes: [
      {
        id: FREE_OFFLINE_RESPONSE_MODE_ID,
        route: {
          provider: settings.lastProvider,
          model: profile.llm.name,
          runtime: "local",
          localModelId: profile.llm.id,
        },
      },
    ],
    sttMode: "local",
    localSttModelId: profile.stt.id,
    sttLanguage: profile.languages.length === 1 ? profile.languages[0] : "auto",
    localLanguages: profile.languages,
    ttsMode: profile.tts ? (ttsIsKokoro ? "kokoro" : "local") : "native",
    localTtsModelId:
      !profile.tts || profile.tts.id === "kokoro-multilingual"
        ? null
        : profile.tts.id,
    ttsListenLanguages: profile.languages,
  };
}

export function applyUnavailableFreeSettings(settings: Settings): Settings {
  const llm = getLocalModelsForLanguages("llm", settings.localLanguages)[0];
  const fallbackLlm = llm ?? getLocalModelsForLanguages("llm", ["en"])[0];
  if (!fallbackLlm) {
    throw new Error("The local model catalogue has no Free LLM fallback.");
  }

  return {
    ...applyFreeRuntimeBoundaries(settings),
    activeResponseMode: FREE_OFFLINE_RESPONSE_MODE_ID,
    responseModes: [
      {
        id: FREE_OFFLINE_RESPONSE_MODE_ID,
        route: {
          provider: settings.lastProvider,
          model: fallbackLlm.name,
          runtime: "local",
          localModelId: fallbackLlm.id,
        },
      },
    ],
    sttMode: "local",
    localSttModelId: null,
    ttsMode: "native",
    localTtsModelId: null,
  };
}
