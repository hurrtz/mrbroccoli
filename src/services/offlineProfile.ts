import {
  getLocalModelsForLanguages,
  type LocalLlmModelDefinition,
  type LocalLlmModelId,
  type LocalModelDefinition,
  type LocalModelId,
  type LocalSttModelDefinition,
  type LocalSttModelId,
  type LocalTtsCatalogModelId,
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
export const FREE_OFFLINE_THOROUGH_RESPONSE_MODE_ID = "free-offline-thorough";

export interface OfflineProfile {
  languages: SpeechLanguage[];
  llm: LocalLlmModelDefinition;
  thoroughLlm: LocalLlmModelDefinition | null;
  stt: LocalSttModelDefinition;
  /** Null means the phone's language-aware system voice is used. */
  tts: LocalTtsModelDefinition | null;
  downloadBytes: number;
  installedBytes: number;
  minimumFreeStorageBytes: number;
  retryLater: boolean;
}

export interface OfflineProfileOverrides {
  quickLlmModelId?: LocalLlmModelId;
  thoroughLlmModelId?: LocalLlmModelId | null;
  sttModelId?: LocalSttModelId;
  ttsModelId?: LocalTtsCatalogModelId | null;
}

export function getOfflineProfileModels(profile: OfflineProfile) {
  return [
    profile.llm,
    ...(profile.thoroughLlm ? [profile.thoroughLlm] : []),
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

function hasCurrentBenchmarkFailure(params: {
  model: LocalModelDefinition;
  snapshot: LocalDeviceSnapshot;
  benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}) {
  const benchmark = params.benchmarks?.[params.model.id];
  return (
    benchmarkMatchesDevice(benchmark, params.snapshot) &&
    (benchmark?.status === "below-target" || benchmark?.status === "failed")
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
  overrides?: OfflineProfileOverrides;
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
  const viableQuickLlms = viableLlms.filter(
    (model) => model.responseProfile === "quick",
  );
  const viableThoroughLlms = viableLlms.filter(
    (model) =>
      model.responseProfile === "thorough" &&
      !hasCurrentBenchmarkFailure({
        model,
        snapshot: params.snapshot,
        benchmarks: params.benchmarks,
      }),
  );
  const viableStt = sttModels.filter(
    (model) => isPermanentlyEligible(model, params.snapshot).eligible,
  );
  const viableTts = ttsModels.filter(
    (model) => isPermanentlyEligible(model, params.snapshot).eligible,
  );

  if (!viableQuickLlms.length || !viableStt.length) {
    return { status: "unavailable", reason: "device" };
  }

  const candidateOptions = {
    snapshot: params.snapshot,
    installedModelIds: params.installedModelIds,
    benchmarks: params.benchmarks,
  };
  const sortedQuickLlms = sortCandidates({
    ...candidateOptions,
    models: viableQuickLlms,
  });
  const llm =
    sortedQuickLlms.find(
      (model) => model.id === params.overrides?.quickLlmModelId,
    ) ?? sortedQuickLlms[0];
  const sortedThoroughLlms = viableThoroughLlms.length
    ? sortCandidates({
        ...candidateOptions,
        models: viableThoroughLlms,
      })
    : [];
  const thoroughCandidate =
    params.overrides?.thoroughLlmModelId === null
      ? null
      : (sortedThoroughLlms.find(
          (model) => model.id === params.overrides?.thoroughLlmModelId,
        ) ??
        sortedThoroughLlms[0] ??
        null);
  const sortedStt = sortCandidates({
    ...candidateOptions,
    models: viableStt,
  });
  const stt =
    sortedStt.find((model) => model.id === params.overrides?.sttModelId) ??
    sortedStt[0];
  const sortedTts = viableTts.length
    ? sortCandidates({
        ...candidateOptions,
        models: viableTts,
        tieBreaker: (model) => ttsPreference(model),
      })
    : [];
  const tts =
    params.overrides?.ttsModelId === null
      ? null
      : (sortedTts.find((model) => model.id === params.overrides?.ttsModelId) ??
        sortedTts[0] ??
        null);
  const baseModels: LocalModelDefinition[] = [llm, stt, ...(tts ? [tts] : [])];
  const footprint = (models: LocalModelDefinition[]) => {
    const missingModels = models.filter(
      (model) => !params.installedModelIds?.has(model.id),
    );
    const installedBytes = missingModels.reduce(
      (total, model) => total + model.installedBytes,
      0,
    );
    return {
      missingModels,
      installedBytes,
      minimumFreeStorageBytes:
        installedBytes + Math.max(...models.map(modelSafetyReserve)),
    };
  };
  const thoroughModels = thoroughCandidate
    ? [llm, thoroughCandidate, stt, ...(tts ? [tts] : [])]
    : baseModels;
  const thoroughFootprint = footprint(thoroughModels);
  const includesThorough =
    Boolean(thoroughCandidate) &&
    params.snapshot.freeStorageBytes >=
      thoroughFootprint.minimumFreeStorageBytes;
  const models = includesThorough ? thoroughModels : baseModels;
  const { missingModels, installedBytes, minimumFreeStorageBytes } =
    includesThorough ? thoroughFootprint : footprint(baseModels);

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
      thoroughLlm: includesThorough ? thoroughCandidate : null,
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
  const responseModes = [
    {
      id: FREE_OFFLINE_RESPONSE_MODE_ID,
      route: {
        provider: settings.lastProvider,
        model: profile.llm.name,
        runtime: "local" as const,
        localModelId: profile.llm.id,
      },
    },
    ...(profile.thoroughLlm
      ? [
          {
            id: FREE_OFFLINE_THOROUGH_RESPONSE_MODE_ID,
            route: {
              provider: settings.lastProvider,
              model: profile.thoroughLlm.name,
              runtime: "local" as const,
              localModelId: profile.thoroughLlm.id,
            },
          },
        ]
      : []),
  ];
  const activeResponseMode = responseModes.some(
    ({ id }) => id === settings.activeResponseMode,
  )
    ? settings.activeResponseMode
    : FREE_OFFLINE_RESPONSE_MODE_ID;

  return {
    ...applyFreeRuntimeBoundaries(settings),
    activeResponseMode,
    responseModes,
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
  const llm = getLocalModelsForLanguages("llm", settings.localLanguages).find(
    (model) => model.responseProfile === "quick",
  );
  const fallbackLlm =
    llm ??
    getLocalModelsForLanguages("llm", ["en"]).find(
      (model) => model.responseProfile === "quick",
    );
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
