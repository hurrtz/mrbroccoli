import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  LocalLlmModelId,
  LocalModelId,
  LocalSttModelId,
  LocalTtsCatalogModelId,
} from "../../constants/localModels";
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
  getOfflineProfileReadiness,
  prepareOfflineProfile,
  type OfflinePreparationProgress,
  type OfflineProfileReadiness,
} from "../../services/offlineProfileManager";
import type { Settings } from "../../types";

const ASSUMED_SETUP_DOWNLOAD_BYTES_PER_SECOND = 1.5 * 1024 * 1024;
const INITIAL_RECOMMENDATION_PRESENTATION_MS = 3_400;

export function estimatePreparationSeconds(
  profile: OfflineProfile,
  installs: OfflineProfileReadiness["installs"] = {},
) {
  const allModels = getOfflineProfileModels(profile);
  const missingModels = allModels.filter(
    (model) => !installs[model.id]?.verified,
  );
  const downloadSeconds =
    missingModels.reduce((total, model) => total + model.downloadBytes, 0) /
    ASSUMED_SETUP_DOWNLOAD_BYTES_PER_SECOND;
  const validationSeconds = allModels.reduce(
    (total, model) => total + model.benchmark.maximumLoadMs / 1_000 + 5,
    0,
  );
  return Math.max(15, Math.ceil(downloadSeconds + validationSeconds));
}

export interface FreeOfflineModeController {
  effectiveSettings: Settings;
  entitlement: ReturnType<typeof usePremiumEntitlement>;
  freeRuntimeReady: boolean;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  checking: boolean;
  evaluationStage: "device" | "models" | "plan" | null;
  preparing: boolean;
  preparationProgress: OfflinePreparationProgress | null;
  estimatedSetupSeconds: number | null;
  preparationEtaSeconds: number | null;
  snapshot: LocalDeviceSnapshot | null;
  nativeSpeechCapabilities: NativeSpeechCapabilities | null;
  selection: OfflineProfileSelection | null;
  readiness: OfflineProfileReadiness | null;
  installs: OfflineProfileReadiness["installs"];
  benchmarks: OfflineProfileReadiness["benchmarks"];
  overrides: OfflineProfileOverrides;
  error: string | null;
  selectedLanguage: FreeSpeechLanguage;
  selectLanguage: (language: FreeSpeechLanguage) => void;
  selectQuickLlm: (modelId: LocalLlmModelId) => void;
  selectThoroughLlm: (modelId: LocalLlmModelId | null) => void;
  selectStt: (modelId: LocalSttModelId | null) => void;
  selectTts: (modelId: LocalTtsCatalogModelId | null) => void;
  nativeVoiceOptions: { value: string; label: string }[];
  selectedNativeVoice: string;
  selectNativeVoice: (voiceId: string) => void;
  selectKokoroVoice: (voiceId: string) => void;
  start: () => void;
  prepare: () => Promise<void>;
  refresh: () => Promise<OfflineProfileReadiness | null>;
}

export function useFreeOfflineMode(params: {
  settings: Settings;
  settingsLoaded: boolean;
  updateSettings: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
}): FreeOfflineModeController {
  const { settings, settingsLoaded, updateSettings } = params;
  const entitlement = usePremiumEntitlement();
  const [modalVisible, setModalVisible] = useState(false);
  const [checking, setChecking] = useState(false);
  const [evaluationStage, setEvaluationStage] = useState<
    "device" | "models" | "plan" | null
  >(null);
  const [preparing, setPreparing] = useState(false);
  const [preparationProgress, setPreparationProgress] =
    useState<OfflinePreparationProgress | null>(null);
  const [preparationEtaSeconds, setPreparationEtaSeconds] = useState<
    number | null
  >(null);
  const [snapshot, setSnapshot] = useState<LocalDeviceSnapshot | null>(null);
  const [nativeSpeechCapabilities, setNativeSpeechCapabilities] =
    useState<NativeSpeechCapabilities | null>(null);
  const [selection, setSelection] = useState<OfflineProfileSelection | null>(
    null,
  );
  const [readiness, setReadiness] = useState<OfflineProfileReadiness | null>(
    null,
  );
  const [installs, setInstalls] = useState<OfflineProfileReadiness["installs"]>(
    {},
  );
  const [benchmarks, setBenchmarks] = useState<
    OfflineProfileReadiness["benchmarks"]
  >({});
  const [error, setError] = useState<string | null>(null);
  const refreshOperationRef = useRef(0);
  const preparationAbortRef = useRef<AbortController | null>(null);
  const openedForFreeRef = useRef(false);
  const completedInitialEvaluationRef = useRef(false);
  const skipNextAutomaticRefreshRef = useRef(false);
  const deviceLocale = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().locale,
    [],
  );
  const selectedLanguage = useMemo(
    () =>
      settings.localLanguages
        .map(normalizeFreeSpeechLanguage)
        .find((language): language is FreeSpeechLanguage =>
          Boolean(language),
        ) ?? FREE_SPEECH_LANGUAGE_OPTIONS[0],
    [settings.localLanguages],
  );
  const resolvedLanguage = useMemo(() => {
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
    () => getAppLanguageForFreeSpeechLanguage(resolvedLanguage),
    [resolvedLanguage],
  );
  const { nativeVoiceOptions, selectedNativeVoice, setSelectedNativeVoice } =
    useNativeVoiceOptions({
      visible: modalVisible,
      shouldLoad: modalVisible,
      listenLanguages: [resolvedLanguage],
      preferredVoiceId: settings.nativeTtsVoiceId,
    });

  const refresh = useCallback(async () => {
    if (entitlement.status !== "free") {
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
      const languagePromise = settings.freeOnboardingLanguageInitialized
        ? Promise.resolve(resolvedLanguage)
        : getFreeOnboardingLanguageFromStorefront(deviceLocale);
      const [[nextSnapshot, nextInstalls, nextBenchmarks], nextLanguage] =
        await Promise.all([
          Promise.all([
            probeLocalDeviceCapabilities(),
            getLocalCatalogInstallStatuses(),
            getLocalModelBenchmarkResults(),
          ]),
          languagePromise,
        ]);
      const [nextNativeSpeechCapabilities] = await Promise.all([
        probeNativeSpeechCapabilities(nextLanguage),
        new Promise((resolve) => setTimeout(resolve, presentationDelayMs)),
      ]);
      const installedModelIds = new Set(
        Object.entries(nextInstalls)
          .filter(([, status]) => status?.verified)
          .map(([modelId]) => modelId as LocalModelId),
      );
      const nextSelection = selectOfflineProfile({
        languages: [nextLanguage],
        snapshot: nextSnapshot,
        installedModelIds,
        benchmarks: nextBenchmarks,
        overrides: settings.freeOfflineProfileOverrides,
        nativeSttEligible: nextNativeSpeechCapabilities.nativeSttEligible,
      });
      const nextReadiness =
        nextSelection.status === "ready"
          ? await getOfflineProfileReadiness(
              nextSelection.profile,
              nextSnapshot,
            )
          : null;

      if (refreshOperationRef.current !== operation) {
        return null;
      }
      setInstalls(nextInstalls);
      setBenchmarks(nextBenchmarks);
      setSnapshot(nextSnapshot);
      setNativeSpeechCapabilities(nextNativeSpeechCapabilities);
      setSelection(nextSelection);
      setReadiness(nextReadiness);
      completedInitialEvaluationRef.current = true;

      if (!settings.freeOnboardingLanguageInitialized) {
        const nextAppLanguage =
          getAppLanguageForFreeSpeechLanguage(nextLanguage);
        skipNextAutomaticRefreshRef.current = true;
        updateSettings({
          freeOnboardingLanguageInitialized: true,
          language: nextAppLanguage,
          localLanguages: [nextLanguage],
          ttsListenLanguages: [nextLanguage],
          sttLanguage: nextLanguage,
        });
      }
      return nextReadiness;
    } catch (nextError) {
      if (refreshOperationRef.current === operation) {
        setError(
          nextError instanceof Error ? nextError.message : String(nextError),
        );
        setSnapshot(null);
        setNativeSpeechCapabilities(null);
        setSelection(null);
        setReadiness(null);
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
    deviceLocale,
    entitlement.status,
    resolvedLanguage,
    settings.freeOfflineProfileOverrides,
    settings.freeOfflineSetupCompleted,
    settings.freeOnboardingLanguageInitialized,
    updateSettings,
  ]);

  useEffect(() => {
    if (
      !settingsLoaded ||
      entitlement.status !== "free" ||
      !settings.freeOnboardingLanguageInitialized
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
    selectedAppLanguage,
    updateSettings,
  ]);

  useEffect(() => {
    if (!settingsLoaded || entitlement.status !== "free") {
      if (entitlement.status === "premium") {
        setModalVisible(false);
      }
      return;
    }
    if (!openedForFreeRef.current) {
      openedForFreeRef.current = true;
      setModalVisible(!settings.freeOfflineSetupCompleted);
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
    [deviceLocale, settings.language, updateSettings],
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
  const selectNativeVoice = useCallback(
    (voiceId: string) => {
      setSelectedNativeVoice(voiceId);
      updateSettings({ nativeTtsVoiceId: voiceId });
    },
    [setSelectedNativeVoice, updateSettings],
  );
  const selectKokoroVoice = useCallback(
    (voiceId: string) => {
      updateSettings({
        kokoroVoices: { ...settings.kokoroVoices, en: voiceId },
      });
    },
    [settings.kokoroVoices, updateSettings],
  );
  const start = useCallback(() => {
    skipNextAutomaticRefreshRef.current = true;
    updateSettings({ freeOfflineSetupCompleted: true });
    setModalVisible(false);
  }, [updateSettings]);

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
    );
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
        updateSettings({ freeOfflineSetupCompleted: true });
        setModalVisible(false);
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
  }, [installs, preparing, refresh, selection, updateSettings]);

  const estimatedSetupSeconds = useMemo(
    () =>
      selection?.status === "ready"
        ? estimatePreparationSeconds(selection.profile, installs)
        : null,
    [installs, selection],
  );

  const effectiveSettings = useMemo(() => {
    if (entitlement.status !== "premium") {
      return selection?.status === "ready"
        ? applyOfflineProfileToSettings(settings, selection.profile)
        : applyUnavailableFreeSettings(settings);
    }
    return settings;
  }, [entitlement.status, selection, settings]);

  return {
    effectiveSettings,
    entitlement,
    freeRuntimeReady:
      entitlement.status === "premium" ||
      (entitlement.status === "free" && readiness?.ready === true),
    modalVisible,
    setModalVisible,
    checking,
    evaluationStage,
    preparing,
    preparationProgress,
    estimatedSetupSeconds,
    preparationEtaSeconds,
    snapshot,
    nativeSpeechCapabilities,
    selection,
    readiness,
    installs,
    benchmarks,
    overrides: settings.freeOfflineProfileOverrides,
    error,
    selectedLanguage,
    selectLanguage,
    selectQuickLlm,
    selectThoroughLlm,
    selectStt,
    selectTts,
    nativeVoiceOptions,
    selectedNativeVoice,
    selectNativeVoice,
    selectKokoroVoice,
    start,
    prepare,
    refresh,
  };
}
