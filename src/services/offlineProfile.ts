import {
  getLocalModelsForLanguages,
  type LocalLlmModelDefinition,
  type LocalModelDefinition,
  type LocalModelId,
  type LocalSttModelDefinition,
  type LocalTtsModelDefinition,
} from "../constants/localModels";
import {
  getAppLanguageForFreeSpeechLanguage,
  type SpeechLanguage,
} from "../constants/speechLanguages";
import { createRuntimeProviderStringRecord } from "../constants/providers/runtimeState";
import {
  getDefaultAssistantInstructions,
  type FreeOfflineProfileOverrides,
  type Settings,
} from "../types";
import {
  evaluateLocalModelEligibility,
  localModelBenchmarkMatchesDevice,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "./localDeviceCapabilities";

export const FREE_OFFLINE_RESPONSE_MODE_ID = "free-offline";
export const FREE_OFFLINE_THOROUGH_RESPONSE_MODE_ID = "free-offline-thorough";

export interface OfflineProfile {
  languages: SpeechLanguage[];
  llm: LocalLlmModelDefinition;
  thoroughLlm: LocalLlmModelDefinition | null;
  /** Null means the phone's on-device speech recognizer is used. */
  stt: LocalSttModelDefinition | null;
  /** Null means the phone's language-aware system voice is used. */
  tts: LocalTtsModelDefinition | null;
  downloadBytes: number;
  installedBytes: number;
  minimumFreeStorageBytes: number;
}

export type OfflineProfileOverrides = FreeOfflineProfileOverrides;

export function getOfflineProfileModels(profile: OfflineProfile) {
  return [
    profile.llm,
    ...(profile.thoroughLlm ? [profile.thoroughLlm] : []),
    ...(profile.stt ? [profile.stt] : []),
    ...(profile.tts ? [profile.tts] : []),
  ] satisfies LocalModelDefinition[];
}

export type OfflineProfileSelection =
  | { status: "ready"; profile: OfflineProfile }
  | {
      status: "unavailable";
      reason: "language" | "device" | "storage";
    };

function isPermanentlyEligible(
  model: LocalModelDefinition,
  snapshot: LocalDeviceSnapshot,
) {
  const result = evaluateLocalModelEligibility(model, {
    ...snapshot,
    freeStorageBytes: Number.MAX_SAFE_INTEGER,
  });
  return { eligible: result.eligible };
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

/**
 * Whether a model has been shown not to work on this phone.
 *
 * A result recorded while the phone was throttled, low on memory, or in
 * battery saver says nothing about the phone: it describes the moment. Those
 * results are persisted like any other, so counting them as evidence let a
 * single run under battery saver disqualify a model permanently -- and once
 * every candidate had one, the app told the user their phone could not run a
 * local setup at all, and kept saying so across restarts.
 */
function hasCurrentBenchmarkFailure(params: {
  model: LocalModelDefinition;
  snapshot: LocalDeviceSnapshot;
  benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}) {
  const benchmark = params.benchmarks?.[params.model.id];
  if (benchmark?.measuredUnderPressure) {
    return false;
  }
  return (
    localModelBenchmarkMatchesDevice(benchmark, params.snapshot) &&
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
  const currentBenchmark = localModelBenchmarkMatchesDevice(
    benchmark,
    params.snapshot,
  )
    ? benchmark
    : undefined;
  const knownFailure =
    !currentBenchmark?.measuredUnderPressure &&
    (currentBenchmark?.status === "below-target" ||
      currentBenchmark?.status === "failed");
  const installed = params.installedModelIds?.has(params.model.id) === true;

  return (
    (knownFailure ? 10_000 : 0) -
    (params.model.automaticPriority ?? 0) * 100 +
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

function preferredAutomaticCandidates<T extends LocalModelDefinition>(
  models: T[],
  params: {
    snapshot: LocalDeviceSnapshot;
    benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
  },
) {
  return models.filter(
    (model) =>
      model.automaticPriority !== undefined &&
      !hasCurrentBenchmarkFailure({ model, ...params }),
  );
}

function preferredAutomaticTtsCandidates(
  models: LocalTtsModelDefinition[],
  params: {
    snapshot: LocalDeviceSnapshot;
    benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
  },
) {
  const platformCandidates =
    params.snapshot.platform === "android"
      ? models.filter((model) => model.sherpaModelType !== "kokoro")
      : models;
  return preferredAutomaticCandidates(platformCandidates, params);
}

export function selectOfflineProfile(params: {
  languages: readonly SpeechLanguage[];
  snapshot: LocalDeviceSnapshot;
  installedModelIds?: ReadonlySet<LocalModelId>;
  benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
  overrides?: OfflineProfileOverrides;
  nativeSttEligible?: boolean;
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

  const nativeSttSelected =
    params.overrides?.sttModelId === null && params.nativeSttEligible === true;
  if (!llms.length || (!sttModels.length && !nativeSttSelected)) {
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
  const automaticCandidateOptions = {
    snapshot: params.snapshot,
    benchmarks: params.benchmarks,
  };
  const automaticQuickLlms = preferredAutomaticCandidates(
    viableQuickLlms,
    automaticCandidateOptions,
  );
  const automaticThoroughLlms = preferredAutomaticCandidates(
    viableThoroughLlms,
    automaticCandidateOptions,
  );
  const automaticStt = preferredAutomaticCandidates(
    viableStt,
    automaticCandidateOptions,
  );
  const automaticTts = preferredAutomaticTtsCandidates(
    viableTts,
    automaticCandidateOptions,
  );
  const hasQuickOverride = viableQuickLlms.some(
    (model) => model.id === params.overrides?.quickLlmModelId,
  );
  const hasSttOverride = viableStt.some(
    (model) => model.id === params.overrides?.sttModelId,
  );

  if (
    (!automaticQuickLlms.length && !hasQuickOverride) ||
    (!automaticStt.length && !hasSttOverride && !nativeSttSelected)
  ) {
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
  const sortedAutomaticQuickLlms = sortCandidates({
    ...candidateOptions,
    models: automaticQuickLlms,
  });
  const llm =
    sortedQuickLlms.find(
      (model) => model.id === params.overrides?.quickLlmModelId,
    ) ?? sortedAutomaticQuickLlms[0];
  const sortedThoroughLlms = viableThoroughLlms.length
    ? sortCandidates({
        ...candidateOptions,
        models: viableThoroughLlms,
      })
    : [];
  const sortedAutomaticThoroughLlms = viableThoroughLlms.length
    ? sortCandidates({
        ...candidateOptions,
        models: automaticThoroughLlms,
      })
    : [];
  const thoroughCandidate =
    params.overrides?.thoroughLlmModelId === null
      ? null
      : (sortedThoroughLlms.find(
          (model) => model.id === params.overrides?.thoroughLlmModelId,
        ) ??
        sortedAutomaticThoroughLlms[0] ??
        null);
  const sortedStt = sortCandidates({
    ...candidateOptions,
    models: viableStt,
  });
  const stt = nativeSttSelected
    ? null
    : (sortedStt.find((model) => model.id === params.overrides?.sttModelId) ??
      sortCandidates({
        ...candidateOptions,
        models: automaticStt,
      })[0]);
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
        (viableTts.length
          ? sortCandidates({
              ...candidateOptions,
              models: automaticTts,
              tieBreaker: (model) => ttsPreference(model),
            })[0]
          : undefined) ??
        null);
  const baseModels: LocalModelDefinition[] = [
    llm,
    ...(stt ? [stt] : []),
    ...(tts ? [tts] : []),
  ];
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
  const thoroughModels: LocalModelDefinition[] = thoroughCandidate
    ? [llm, thoroughCandidate, ...(stt ? [stt] : []), ...(tts ? [tts] : [])]
    : baseModels;
  const thoroughFootprint = footprint(thoroughModels);
  const includesThorough =
    Boolean(thoroughCandidate) &&
    params.snapshot.freeStorageBytes >=
      thoroughFootprint.minimumFreeStorageBytes;
  const { missingModels, installedBytes, minimumFreeStorageBytes } =
    includesThorough ? thoroughFootprint : footprint(baseModels);

  if (params.snapshot.freeStorageBytes < minimumFreeStorageBytes) {
    return { status: "unavailable", reason: "storage" };
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
  const targetLanguage =
    profile.languages.length === 1
      ? getAppLanguageForFreeSpeechLanguage(profile.languages[0])
      : settings.language;
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
    ...applyFreeRuntimeBoundaries({ ...settings, language: targetLanguage }),
    activeResponseMode,
    responseModes,
    sttMode: profile.stt ? "local" : "native",
    nativeSttRequiresOnDevice: profile.stt === null,
    localSttModelId: profile.stt?.id ?? null,
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
  const persistedResponseModes = settings.freeOfflineSetupCompleted
    ? settings.responseModes.filter(
        ({ route }) =>
          route.runtime === "local" && Boolean(route.localModelId),
      )
    : [];
  if (persistedResponseModes.length > 0) {
    return {
      ...applyFreeRuntimeBoundaries(settings),
      activeResponseMode: persistedResponseModes.some(
        ({ id }) => id === settings.activeResponseMode,
      )
        ? settings.activeResponseMode
        : persistedResponseModes[0].id,
      responseModes: persistedResponseModes,
    };
  }

  const llm = getLocalModelsForLanguages("llm", settings.localLanguages).find(
    (model) =>
      model.responseProfile === "quick" && model.catalogTier === "recommended",
  );
  const fallbackLlm =
    llm ??
    getLocalModelsForLanguages("llm", ["en"]).find(
      (model) =>
        model.responseProfile === "quick" &&
        model.catalogTier === "recommended",
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
    nativeSttRequiresOnDevice: false,
    localSttModelId: null,
    ttsMode: "native",
    localTtsModelId: null,
  };
}
