import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  LocalLlmModelId,
  LocalModelId,
  LocalSttModelId,
  LocalTtsCatalogModelId,
} from "../../constants/localModels";
import { DEFAULT_KOKORO_VOICES } from "../../constants/kokoro";
import {
  FREE_SPEECH_LANGUAGE_OPTIONS,
  getAppLanguageForFreeSpeechLanguage,
  normalizeFreeSpeechLanguage,
  resolveFreeSpeechLanguage,
  type FreeSpeechLanguage,
} from "../../constants/speechLanguages";
import { usePremiumEntitlement } from "../../context/PremiumEntitlementContext";
import { useNativeVoiceOptions } from "../../features/settings-core/useNativeVoiceOptions";
import { getFreeOnboardingLanguageFromStorefront } from "../../services/freeOnboardingLanguage";
import {
  getLocalModelBenchmarkResults,
  localModelBenchmarkMatchesDevice,
  probeLocalDeviceCapabilities,
  type LocalDeviceSnapshot,
} from "../../services/localDeviceCapabilities";
import {
  probeNativeSpeechCapabilities,
  type NativeSpeechCapabilities,
} from "../../services/nativeSpeechCapabilities";
import {
  applyOfflineProfileToSettings,
  applyUnavailableFreeSettings,
  getOfflineProfileModels,
  selectOfflineProfile,
  type OfflineProfile,
  type OfflineProfileOverrides,
  type OfflineProfileSelection,
} from "../../services/offlineProfile";
import {
  getLocalCatalogInstallStatuses,
  getOfflineProfileValidationModels,
  getOfflineProfileReadiness,
  prepareOfflineProfile,
  type OfflinePreparationProgress,
  type OfflineProfileReadiness,
} from "../../services/offlineProfileManager";
import { useKeepAwakeWhile } from "../../hooks/useKeepAwakeWhile";
import type { Settings } from "../../types";

const ASSUMED_SETUP_DOWNLOAD_BYTES_PER_SECOND = 1.5 * 1024 * 1024;
const INITIAL_RECOMMENDATION_PRESENTATION_MS = 2_000;

export function estimatePreparationSeconds(
  profile: OfflineProfile,
  installs: OfflineProfileReadiness["installs"] = {},
  benchmarks: OfflineProfileReadiness["benchmarks"] = {},
  snapshot?: LocalDeviceSnapshot | null,
) {
  const allModels = getOfflineProfileModels(profile);
  const missingModels = allModels.filter(
    (model) => !installs[model.id]?.verified,
  );
  const downloadSeconds =
    missingModels.reduce((total, model) => total + model.downloadBytes, 0) /
    ASSUMED_SETUP_DOWNLOAD_BYTES_PER_SECOND;
  const validationSeconds = getOfflineProfileValidationModels(profile)
    .filter((model) => {
      const benchmark = benchmarks[model.id];
      return (
        benchmark?.status !== "viable" ||
        !snapshot ||
        !localModelBenchmarkMatchesDevice(benchmark, snapshot)
      );
    })
    .reduce(
      (total, model) => total + model.benchmark.maximumLoadMs / 1_000 + 5,
      0,
    );
  return Math.max(15, Math.ceil(downloadSeconds + validationSeconds));
}

export interface FreeOfflineModeController {
  effectiveSettings: Settings;
  entitlement: ReturnType<typeof usePremiumEntitlement>;
  freeRuntimeReady: boolean;
  setupVisible: boolean;
  checking: boolean;
  evaluationStage: "device" | "models" | "plan" | null;
  preparing: boolean;
  preparationProgress: OfflinePreparationProgress | null;
  estimatedSetupSeconds: number | null;
  preparationEtaSeconds: number | null;
  snapshot: LocalDeviceSnapshot | null;
  nativeSpeechCapabilities: NativeSpeechCapabilities | null;
  recommendedSelection: OfflineProfileSelection | null;
  customSelection: OfflineProfileSelection | null;
  selection: OfflineProfileSelection | null;
  recommendedReadiness: OfflineProfileReadiness | null;
  customReadiness: OfflineProfileReadiness | null;
  readiness: OfflineProfileReadiness | null;
  installs: OfflineProfileReadiness["installs"];
  benchmarks: OfflineProfileReadiness["benchmarks"];
  overrides: OfflineProfileOverrides;
  error: string | null;
  selectedLanguage: FreeSpeechLanguage | null;
  selectLanguage: (language: FreeSpeechLanguage) => void;
  advancedOptionsEnabled: boolean;
  setAdvancedOptionsEnabled: (enabled: boolean) => void;
  hasCustomSelections: boolean;
  selectQuickLlm: (modelId: LocalLlmModelId) => void;
  selectThoroughLlm: (modelId: LocalLlmModelId | null) => void;
  selectStt: (modelId: LocalSttModelId | null) => void;
  selectTts: (modelId: LocalTtsCatalogModelId | null) => void;
  nativeVoiceOptions: { value: string; label: string }[];
  selectedNativeVoice: string;
  selectNativeVoice: (voiceId: string) => void;
  selectedKokoroVoice: string;
  selectKokoroVoice: (voiceId: string) => void;
  recommendedEstimatedSetupSeconds: number | null;
  customEstimatedSetupSeconds: number | null;
  start: () => void;
  prepare: () => Promise<void>;
  refresh: () => Promise<OfflineProfileReadiness | null>;
}

export function useFreeOfflineMode(params: {
  settings: Settings;
  settingsLoaded: boolean;
  suspended?: boolean;
  updateSettings: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
}): FreeOfflineModeController {
  const {
    settings,
    settingsLoaded,
    suspended = false,
    updateSettings,
  } = params;
  const entitlement = usePremiumEntitlement();
  const [checking, setChecking] = useState(false);
  const [evaluationStage, setEvaluationStage] = useState<
    "device" | "models" | "plan" | null
  >(null);
  const [preparing, setPreparing] = useState(false);
  // Downloading and benchmarking a complete on-device profile runs far longer
  // than any default screen timeout, and setup cannot finish in the
  // background: a sleeping phone aborted the download and left the user
  // restarting it. Hold the lock only while preparation is actually running,
  // and the effect releases it on completion, failure, or cancellation.
  useKeepAwakeWhile(preparing, "mrbroccoli-offline-setup");
  const [preparationProgress, setPreparationProgress] =
    useState<OfflinePreparationProgress | null>(null);
  const [preparationEtaSeconds, setPreparationEtaSeconds] = useState<
    number | null
  >(null);
  const [snapshot, setSnapshot] = useState<LocalDeviceSnapshot | null>(null);
  const [nativeSpeechCapabilities, setNativeSpeechCapabilities] =
    useState<NativeSpeechCapabilities | null>(null);
  const [recommendedSelection, setRecommendedSelection] =
    useState<OfflineProfileSelection | null>(null);
  const [customSelection, setCustomSelection] =
    useState<OfflineProfileSelection | null>(null);
  const [recommendedReadiness, setRecommendedReadiness] =
    useState<OfflineProfileReadiness | null>(null);
  const [customReadiness, setCustomReadiness] =
    useState<OfflineProfileReadiness | null>(null);
  const [advancedOptionsEnabled, setAdvancedOptionsEnabledState] =
    useState(false);
  const [selectedKokoroVoice, setSelectedKokoroVoice] = useState(
    settings.kokoroVoices.en,
  );
  const [installs, setInstalls] = useState<OfflineProfileReadiness["installs"]>(
    {},
  );
  const [benchmarks, setBenchmarks] = useState<
    OfflineProfileReadiness["benchmarks"]
  >({});
  const [error, setError] = useState<string | null>(null);
  const refreshOperationRef = useRef(0);
  const storefrontOperationRef = useRef(0);
  const preparationAbortRef = useRef<AbortController | null>(null);
  const useCustomProfileRef = useRef(false);
  const completedInitialEvaluationRef = useRef(false);
  const skipNextAutomaticRefreshRef = useRef(false);
  const deviceLocale = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().locale,
    [],
  );
  const storedLanguage = useMemo(
    () =>
      settings.localLanguages
        .map(normalizeFreeSpeechLanguage)
        .find((language): language is FreeSpeechLanguage =>
          Boolean(language),
        ) ?? FREE_SPEECH_LANGUAGE_OPTIONS[0],
    [settings.localLanguages],
  );
  const [selectedLanguage, setSelectedLanguage] = useState<
    FreeSpeechLanguage | null
  >(() => (settings.freeOfflineSetupCompleted ? storedLanguage : null));
  const previousStoredLanguageRef = useRef(storedLanguage);
  const resolvedLanguage = useMemo(() => {
    if (!selectedLanguage) {
      return null;
    }
    if (
      selectedLanguage === "pt" &&
      settings.localLanguages.includes("pt-BR")
    ) {
      return "pt-BR" as const;
    }
    const preferredLocale =
      settings.language === "pt-BR"
        ? "pt-BR"
        : settings.language === "pt"
          ? "pt-PT"
          : deviceLocale;
    return resolveFreeSpeechLanguage(selectedLanguage, preferredLocale);
  }, [
    deviceLocale,
    selectedLanguage,
    settings.language,
    settings.localLanguages,
  ]);
  const selectedAppLanguage = useMemo(
    () =>
      resolvedLanguage
        ? getAppLanguageForFreeSpeechLanguage(resolvedLanguage)
        : null,
    [resolvedLanguage],
  );
  // Setup no longer takes over the screen, so nothing is "visible" here any
  // more. The field is retained because it still shapes the Free runtime: it
  // gated the wizard's live voice preview, and the store promo controller reads
  // it to describe a prepared device. Preparation is now reached from the intro
  // sheet or from Settings.
  const setupVisible = false;
  const { nativeVoiceOptions, selectedNativeVoice, setSelectedNativeVoice } =
    useNativeVoiceOptions({
      visible: setupVisible,
      shouldLoad:
        setupVisible &&
        resolvedLanguage !== null &&
        advancedOptionsEnabled &&
        customSelection?.status === "ready" &&
        customSelection.profile.tts === null,
      listenLanguages: [resolvedLanguage ?? "en"],
      preferredVoiceId: settings.nativeTtsVoiceId,
    });
  const recommendedNativeVoice = nativeVoiceOptions[0]?.value ?? "";
  const useCustomProfile = !setupVisible || advancedOptionsEnabled;
  useCustomProfileRef.current = useCustomProfile;
  const selection = useCustomProfile
    ? customSelection
    : recommendedSelection;
  const readiness = useCustomProfile
    ? customReadiness
    : recommendedReadiness;

  const refresh = useCallback(async () => {
    if (suspended || entitlement.status !== "free" || !resolvedLanguage) {
      return null;
    }
    const operation = refreshOperationRef.current + 1;
    refreshOperationRef.current = operation;
    setChecking(true);
    setEvaluationStage("device");
    setError(null);
    const modelStageTimer = setTimeout(() => {
      if (refreshOperationRef.current === operation) {
        setEvaluationStage("models");
      }
    }, 900);
    const planStageTimer = setTimeout(() => {
      if (refreshOperationRef.current === operation) {
        setEvaluationStage("plan");
      }
    }, 2_200);
    const presentationDelayMs =
      completedInitialEvaluationRef.current ||
      settings.freeOfflineSetupCompleted
        ? 250
        : INITIAL_RECOMMENDATION_PRESENTATION_MS;

    try {
      const [nextSnapshot, nextInstalls, nextBenchmarks] = await Promise.all([
        probeLocalDeviceCapabilities(),
        getLocalCatalogInstallStatuses(),
        getLocalModelBenchmarkResults(),
      ]);
      const [nextNativeSpeechCapabilities] = await Promise.all([
        probeNativeSpeechCapabilities(resolvedLanguage),
        new Promise((resolve) => setTimeout(resolve, presentationDelayMs)),
      ]);
      const installedModelIds = new Set(
        Object.entries(nextInstalls)
          .filter(([, status]) => status?.verified)
          .map(([modelId]) => modelId as LocalModelId),
      );
      const selectionParams = {
        languages: [resolvedLanguage],
        snapshot: nextSnapshot,
        installedModelIds,
        benchmarks: nextBenchmarks,
        nativeSttEligible: nextNativeSpeechCapabilities.nativeSttEligible,
      } as const;
      const nextRecommendedSelection = selectOfflineProfile({
        ...selectionParams,
        overrides: {},
      });
      const nextCustomSelection = selectOfflineProfile({
        ...selectionParams,
        overrides: settings.freeOfflineProfileOverrides,
      });
      const profilesMatch =
        nextRecommendedSelection.status === "ready" &&
        nextCustomSelection.status === "ready" &&
        getOfflineProfileModels(nextRecommendedSelection.profile)
          .map((model) => model.id)
          .join(":") ===
          getOfflineProfileModels(nextCustomSelection.profile)
            .map((model) => model.id)
            .join(":");
      const recommendedReadinessPromise =
        nextRecommendedSelection.status === "ready"
          ? getOfflineProfileReadiness(
              nextRecommendedSelection.profile,
              nextSnapshot,
            )
          : null;
      const customReadinessPromise = profilesMatch
        ? recommendedReadinessPromise
        : nextCustomSelection.status === "ready"
          ? getOfflineProfileReadiness(
              nextCustomSelection.profile,
              nextSnapshot,
            )
          : null;
      const [nextRecommendedReadiness, nextCustomReadiness] =
        await Promise.all([
          recommendedReadinessPromise,
          customReadinessPromise,
        ]);

      if (refreshOperationRef.current !== operation) {
        return null;
      }
      setInstalls(nextInstalls);
      setBenchmarks(nextBenchmarks);
      setSnapshot(nextSnapshot);
      setNativeSpeechCapabilities(nextNativeSpeechCapabilities);
      setRecommendedSelection(nextRecommendedSelection);
      setCustomSelection(nextCustomSelection);
      setRecommendedReadiness(nextRecommendedReadiness);
      setCustomReadiness(nextCustomReadiness);
      completedInitialEvaluationRef.current = true;
      return useCustomProfileRef.current
        ? nextCustomReadiness
        : nextRecommendedReadiness;
    } catch (nextError) {
      if (refreshOperationRef.current === operation) {
        setError(
          nextError instanceof Error ? nextError.message : String(nextError),
        );
        setSnapshot(null);
        setNativeSpeechCapabilities(null);
        setRecommendedSelection(null);
        setCustomSelection(null);
        setRecommendedReadiness(null);
        setCustomReadiness(null);
      }
      return null;
    } finally {
      clearTimeout(modelStageTimer);
      clearTimeout(planStageTimer);
      if (refreshOperationRef.current === operation) {
        setChecking(false);
        setEvaluationStage(null);
      }
    }
  }, [
    entitlement.status,
    resolvedLanguage,
    settings.freeOfflineProfileOverrides,
    settings.freeOfflineSetupCompleted,
    suspended,
  ]);

  useEffect(() => {
    if (
      !settingsLoaded ||
      suspended ||
      entitlement.status !== "free" ||
      settings.freeOnboardingLanguageInitialized
    ) {
      return;
    }
    const operation = storefrontOperationRef.current + 1;
    storefrontOperationRef.current = operation;
    void getFreeOnboardingLanguageFromStorefront(deviceLocale).then(
      (storefrontLanguage) => {
        if (storefrontOperationRef.current !== operation) {
          return;
        }
        updateSettings({
          freeOnboardingLanguageInitialized: true,
          language: getAppLanguageForFreeSpeechLanguage(storefrontLanguage),
        });
      },
    );
    return () => {
      if (storefrontOperationRef.current === operation) {
        storefrontOperationRef.current += 1;
      }
    };
  }, [
    deviceLocale,
    entitlement.status,
    settings.freeOnboardingLanguageInitialized,
    settingsLoaded,
    suspended,
    updateSettings,
  ]);

  useEffect(() => {
    if (previousStoredLanguageRef.current === storedLanguage) {
      return;
    }
    previousStoredLanguageRef.current = storedLanguage;
    setSelectedLanguage(storedLanguage);
  }, [storedLanguage]);

  useEffect(() => {
    if (
      !settingsLoaded ||
      suspended ||
      entitlement.status !== "free" ||
      !settings.freeOnboardingLanguageInitialized ||
      !resolvedLanguage ||
      !selectedAppLanguage
    ) {
      return;
    }
    if (
      settings.localLanguages.length === 1 &&
      settings.localLanguages[0] === resolvedLanguage &&
      settings.ttsListenLanguages.length === 1 &&
      settings.ttsListenLanguages[0] === resolvedLanguage &&
      settings.sttLanguage === resolvedLanguage &&
      settings.language === selectedAppLanguage
    ) {
      return;
    }

    updateSettings({
      language: selectedAppLanguage,
      localLanguages: [resolvedLanguage],
      ttsListenLanguages: [resolvedLanguage],
      sttLanguage: resolvedLanguage,
    });
  }, [
    entitlement.status,
    resolvedLanguage,
    settings.freeOnboardingLanguageInitialized,
    settings.language,
    settings.localLanguages,
    settings.sttLanguage,
    settings.ttsListenLanguages,
    settingsLoaded,
    suspended,
    selectedAppLanguage,
    updateSettings,
  ]);

  useEffect(() => {
    if (!settingsLoaded || suspended || entitlement.status !== "free") {
      return;
    }
    if (!resolvedLanguage) {
      setChecking(false);
      setEvaluationStage(null);
      setRecommendedSelection(null);
      setCustomSelection(null);
      setRecommendedReadiness(null);
      setCustomReadiness(null);
      return;
    }
    if (skipNextAutomaticRefreshRef.current) {
      skipNextAutomaticRefreshRef.current = false;
      return;
    }
    void refresh();
  }, [
    entitlement.status,
    refresh,
    settings.freeOfflineSetupCompleted,
    settingsLoaded,
    resolvedLanguage,
    suspended,
  ]);

  useEffect(
    () => () => {
      refreshOperationRef.current += 1;
      preparationAbortRef.current?.abort();
    },
    [],
  );

  const selectLanguage = useCallback(
    (language: FreeSpeechLanguage) => {
      const preferredLocale =
        settings.language === "pt-BR"
          ? "pt-BR"
          : settings.language === "pt"
            ? "pt-PT"
            : deviceLocale;
      const nextLanguage = resolveFreeSpeechLanguage(language, preferredLocale);
      storefrontOperationRef.current += 1;
      completedInitialEvaluationRef.current = false;
      setRecommendedSelection(null);
      setCustomSelection(null);
      setRecommendedReadiness(null);
      setCustomReadiness(null);
      setError(null);
      setAdvancedOptionsEnabledState(false);
      setSelectedNativeVoice("");
      setSelectedKokoroVoice(DEFAULT_KOKORO_VOICES.en);
      setSelectedLanguage(language);
      updateSettings({
        freeOnboardingLanguageInitialized: true,
        freeOfflineSetupCompleted: false,
        freeOfflineProfileOverrides: {},
        language: getAppLanguageForFreeSpeechLanguage(nextLanguage),
        localLanguages: [nextLanguage],
        ttsListenLanguages: [nextLanguage],
        sttLanguage: nextLanguage,
      });
    },
    [deviceLocale, setSelectedNativeVoice, settings.language, updateSettings],
  );

  const updateOverrides = useCallback(
    (partial: OfflineProfileOverrides) => {
      updateSettings({
        freeOfflineSetupCompleted: false,
        freeOfflineProfileOverrides: {
          ...settings.freeOfflineProfileOverrides,
          ...partial,
        },
      });
    },
    [settings.freeOfflineProfileOverrides, updateSettings],
  );
  const selectQuickLlm = useCallback(
    (modelId: LocalLlmModelId) => updateOverrides({ quickLlmModelId: modelId }),
    [updateOverrides],
  );
  const selectThoroughLlm = useCallback(
    (modelId: LocalLlmModelId | null) =>
      updateOverrides({ thoroughLlmModelId: modelId }),
    [updateOverrides],
  );
  const selectStt = useCallback(
    (modelId: LocalSttModelId | null) =>
      updateOverrides({ sttModelId: modelId }),
    [updateOverrides],
  );
  const selectTts = useCallback(
    (modelId: LocalTtsCatalogModelId | null) =>
      updateOverrides({ ttsModelId: modelId }),
    [updateOverrides],
  );
  const setAdvancedOptionsEnabled = useCallback(
    (enabled: boolean) => {
      if (!preparing) {
        setAdvancedOptionsEnabledState(enabled);
      }
    },
    [preparing],
  );
  const selectNativeVoice = useCallback(
    (voiceId: string) => {
      setSelectedNativeVoice(voiceId);
    },
    [setSelectedNativeVoice],
  );
  const selectKokoroVoice = useCallback(
    (voiceId: string) => {
      setSelectedKokoroVoice(voiceId);
    },
    [],
  );
  const completeSetup = useCallback(
    (profile: OfflineProfile, withCustomSelections: boolean) => {
      const persistedProfileSettings = applyOfflineProfileToSettings(
        settings,
        profile,
      );
      // Free setup must stay reversible: persisted provider response modes
      // survive alongside the local Free routes. The Free runtime derivation
      // ignores them, and they return untouched when Premium is restored.
      const preservedProviderModes = settings.responseModes.filter(
        (mode) =>
          mode.route.runtime !== "local" &&
          mode.route.model.trim().length > 0 &&
          !persistedProfileSettings.responseModes.some(
            ({ id }) => id === mode.id,
          ),
      );
      updateSettings({
        activeResponseMode: persistedProfileSettings.activeResponseMode,
        responseModes: [
          ...persistedProfileSettings.responseModes,
          ...preservedProviderModes,
        ],
        language: persistedProfileSettings.language,
        freeOfflineSetupCompleted: true,
        freeOfflineProfileOverrides: withCustomSelections
          ? settings.freeOfflineProfileOverrides
          : {},
        sttMode: persistedProfileSettings.sttMode,
        nativeSttRequiresOnDevice:
          persistedProfileSettings.nativeSttRequiresOnDevice,
        localSttModelId: persistedProfileSettings.localSttModelId,
        sttLanguage: persistedProfileSettings.sttLanguage,
        localLanguages: persistedProfileSettings.localLanguages,
        ttsMode: persistedProfileSettings.ttsMode,
        localTtsModelId: persistedProfileSettings.localTtsModelId,
        ttsListenLanguages: persistedProfileSettings.ttsListenLanguages,
        nativeTtsVoiceId: withCustomSelections
          ? selectedNativeVoice
          : recommendedNativeVoice,
        kokoroVoices: {
          ...settings.kokoroVoices,
          en: withCustomSelections
            ? selectedKokoroVoice
            : DEFAULT_KOKORO_VOICES.en,
        },
      });
    },
    [
      recommendedNativeVoice,
      selectedKokoroVoice,
      selectedNativeVoice,
      settings,
      updateSettings,
    ],
  );

  const start = useCallback(() => {
    if (readiness?.ready !== true || selection?.status !== "ready") {
      return;
    }
    skipNextAutomaticRefreshRef.current = true;
    completeSetup(selection.profile, useCustomProfile);
  }, [completeSetup, readiness?.ready, selection, useCustomProfile]);

  const prepare = useCallback(async () => {
    if (selection?.status !== "ready" || preparing) {
      return;
    }
    const abortController = new AbortController();
    preparationAbortRef.current = abortController;
    setPreparing(true);
    setError(null);
    setPreparationProgress(null);
    const estimatedSeconds = estimatePreparationSeconds(
      selection.profile,
      installs,
      benchmarks,
      snapshot,
    );
    const preparingCustomSelection = useCustomProfileRef.current;
    const preparingProfile = selection.profile;
    setPreparationEtaSeconds(estimatedSeconds);
    try {
      await prepareOfflineProfile(selection.profile, {
        abortSignal: abortController.signal,
        onProgress: (nextProgress) => {
          setPreparationProgress(nextProgress);
          const completedSteps =
            nextProgress.stepIndex + (nextProgress.stepProgress ?? 0);
          const remainingFraction = Math.max(
            0,
            1 - completedSteps / Math.max(1, nextProgress.stepCount),
          );
          setPreparationEtaSeconds(
            remainingFraction === 0
              ? 0
              : Math.max(1, Math.ceil(estimatedSeconds * remainingFraction)),
          );
        },
      });
      const nextReadiness = await refresh();
      if (nextReadiness?.ready) {
        skipNextAutomaticRefreshRef.current = true;
        completeSetup(preparingProfile, preparingCustomSelection);
      }
    } catch (nextError) {
      if (!abortController.signal.aborted) {
        await refresh();
        setError(
          nextError instanceof Error ? nextError.message : String(nextError),
        );
      }
    } finally {
      if (preparationAbortRef.current === abortController) {
        preparationAbortRef.current = null;
      }
      setPreparing(false);
      setPreparationProgress(null);
      setPreparationEtaSeconds(null);
    }
  }, [benchmarks, completeSetup, installs, preparing, refresh, selection, snapshot]);

  const recommendedEstimatedSetupSeconds = useMemo(
    () =>
      recommendedSelection?.status === "ready"
        ? estimatePreparationSeconds(
            recommendedSelection.profile,
            installs,
            benchmarks,
            snapshot,
          )
        : null,
    [benchmarks, installs, recommendedSelection, snapshot],
  );
  const customEstimatedSetupSeconds = useMemo(
    () =>
      customSelection?.status === "ready"
        ? estimatePreparationSeconds(
            customSelection.profile,
            installs,
            benchmarks,
            snapshot,
          )
        : null,
    [benchmarks, customSelection, installs, snapshot],
  );
  const estimatedSetupSeconds = useCustomProfile
    ? customEstimatedSetupSeconds
    : recommendedEstimatedSetupSeconds;

  const hasCustomSelections = useMemo(() => {
    if (Object.keys(settings.freeOfflineProfileOverrides).length > 0) {
      return true;
    }
    if (customSelection?.status !== "ready") {
      return false;
    }
    if (customSelection.profile.tts === null) {
      return selectedNativeVoice !== recommendedNativeVoice;
    }
    if (customSelection.profile.tts.id === "kokoro-multilingual") {
      return selectedKokoroVoice !== DEFAULT_KOKORO_VOICES.en;
    }
    return false;
  }, [
    customSelection,
    recommendedNativeVoice,
    selectedKokoroVoice,
    selectedNativeVoice,
    settings.freeOfflineProfileOverrides,
  ]);

  const effectiveSettings = useMemo(() => {
    if (entitlement.status !== "premium") {
      const voiceSettings = setupVisible
        ? {
            ...settings,
            nativeTtsVoiceId: useCustomProfile
              ? selectedNativeVoice
              : recommendedNativeVoice,
            kokoroVoices: {
              ...settings.kokoroVoices,
              en: useCustomProfile
                ? selectedKokoroVoice
                : DEFAULT_KOKORO_VOICES.en,
            },
          }
        : settings;
      return selection?.status === "ready"
        ? applyOfflineProfileToSettings(voiceSettings, selection.profile)
        : applyUnavailableFreeSettings(voiceSettings);
    }
    return settings;
  }, [
    entitlement.status,
    recommendedNativeVoice,
    selectedKokoroVoice,
    selectedNativeVoice,
    selection,
    settings,
    setupVisible,
    useCustomProfile,
  ]);

  return {
    effectiveSettings,
    entitlement,
    freeRuntimeReady:
      entitlement.status === "premium" ||
      (entitlement.status === "free" && readiness?.ready === true),
    setupVisible,
    checking,
    evaluationStage,
    preparing,
    preparationProgress,
    estimatedSetupSeconds,
    preparationEtaSeconds,
    snapshot,
    nativeSpeechCapabilities,
    recommendedSelection,
    customSelection,
    selection,
    recommendedReadiness,
    customReadiness,
    readiness,
    installs,
    benchmarks,
    overrides: settings.freeOfflineProfileOverrides,
    error,
    selectedLanguage,
    selectLanguage,
    advancedOptionsEnabled,
    setAdvancedOptionsEnabled,
    hasCustomSelections,
    selectQuickLlm,
    selectThoroughLlm,
    selectStt,
    selectTts,
    nativeVoiceOptions,
    selectedNativeVoice,
    selectNativeVoice,
    selectedKokoroVoice,
    selectKokoroVoice,
    recommendedEstimatedSetupSeconds,
    customEstimatedSetupSeconds,
    start,
    prepare,
    refresh,
  };
}
