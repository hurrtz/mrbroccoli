import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { usePremiumEntitlement } from "../../context/PremiumEntitlementContext";
import type {
  LocalLlmModelId,
  LocalModelId,
  LocalSttModelId,
  LocalTtsCatalogModelId,
} from "../../constants/localModels";
import {
  FREE_SPEECH_LANGUAGE_OPTIONS,
  normalizeFreeSpeechLanguage,
  resolveFreeSpeechLanguage,
  type FreeSpeechLanguage,
} from "../../constants/speechLanguages";
import type { Settings } from "../../types";
import {
  applyOfflineProfileToSettings,
  applyUnavailableFreeSettings,
  selectOfflineProfile,
  type OfflineProfileSelection,
  type OfflineProfileOverrides,
  type OfflineProfile,
  getOfflineProfileModels,
} from "../../services/offlineProfile";
import {
  getLocalCatalogInstallStatuses,
  getOfflineProfileReadiness,
  prepareOfflineProfile,
  type OfflinePreparationProgress,
  type OfflineProfileReadiness,
} from "../../services/offlineProfileManager";
import {
  getLocalModelBenchmarkResults,
  probeLocalDeviceCapabilities,
  type LocalDeviceSnapshot,
} from "../../services/localDeviceCapabilities";

const ASSUMED_SETUP_DOWNLOAD_BYTES_PER_SECOND = 1.5 * 1024 * 1024;

export function estimatePreparationSeconds(
  profile: OfflineProfile,
  installs: OfflineProfileReadiness["installs"] = {},
) {
  const models = getOfflineProfileModels(profile).filter(
    (model) => !installs[model.id]?.verified,
  );
  const downloadSeconds =
    models.reduce((total, model) => total + model.downloadBytes, 0) /
    ASSUMED_SETUP_DOWNLOAD_BYTES_PER_SECOND;
  const validationSeconds = models.reduce(
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
  evaluationStage: "device" | "models" | null;
  preparing: boolean;
  preparationProgress: OfflinePreparationProgress | null;
  estimatedSetupSeconds: number | null;
  preparationEtaSeconds: number | null;
  snapshot: LocalDeviceSnapshot | null;
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
  selectStt: (modelId: LocalSttModelId) => void;
  selectTts: (modelId: LocalTtsCatalogModelId | null) => void;
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
    "device" | "models" | null
  >(null);
  const [preparing, setPreparing] = useState(false);
  const [preparationProgress, setPreparationProgress] =
    useState<OfflinePreparationProgress | null>(null);
  const [preparationEtaSeconds, setPreparationEtaSeconds] = useState<
    number | null
  >(null);
  const [snapshot, setSnapshot] = useState<LocalDeviceSnapshot | null>(null);
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
  const [overrides, setOverrides] = useState<OfflineProfileOverrides>({});
  const [error, setError] = useState<string | null>(null);
  const refreshOperationRef = useRef(0);
  const preparationAbortRef = useRef<AbortController | null>(null);
  const openedForFreeRef = useRef(false);
  const completedInitialEvaluationRef = useRef(false);
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
    }, 500);
    const presentationDelayMs = completedInitialEvaluationRef.current
      ? 250
      : 1_400;
    try {
      const [[nextSnapshot, installs, benchmarks]] = await Promise.all([
        Promise.all([
          probeLocalDeviceCapabilities(),
          getLocalCatalogInstallStatuses(),
          getLocalModelBenchmarkResults(),
        ]),
        new Promise((resolve) => setTimeout(resolve, presentationDelayMs)),
      ]);
      const installedModelIds = new Set(
        Object.entries(installs)
          .filter(([, status]) => status?.verified)
          .map(([modelId]) => modelId as LocalModelId),
      );
      const nextSelection = selectOfflineProfile({
        languages: [resolvedLanguage],
        snapshot: nextSnapshot,
        installedModelIds,
        benchmarks,
        overrides,
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
      setInstalls(installs);
      setBenchmarks(benchmarks);
      setSnapshot(nextSnapshot);
      setSelection(nextSelection);
      setReadiness(nextReadiness);
      completedInitialEvaluationRef.current = true;
      return nextReadiness;
    } catch (nextError) {
      if (refreshOperationRef.current === operation) {
        setError(
          nextError instanceof Error ? nextError.message : String(nextError),
        );
        setSnapshot(null);
        setSelection(null);
        setReadiness(null);
      }
      return null;
    } finally {
      clearTimeout(modelStageTimer);
      if (refreshOperationRef.current === operation) {
        setChecking(false);
        setEvaluationStage(null);
      }
    }
  }, [entitlement.status, overrides, resolvedLanguage]);

  useEffect(() => {
    if (!settingsLoaded || entitlement.status !== "free") {
      return;
    }
    if (
      settings.localLanguages.length === 1 &&
      settings.localLanguages[0] === resolvedLanguage &&
      settings.ttsListenLanguages.length === 1 &&
      settings.ttsListenLanguages[0] === resolvedLanguage &&
      settings.sttLanguage === resolvedLanguage
    ) {
      return;
    }

    updateSettings({
      localLanguages: [resolvedLanguage],
      ttsListenLanguages: [resolvedLanguage],
      sttLanguage: resolvedLanguage,
    });
  }, [
    entitlement.status,
    resolvedLanguage,
    settings.localLanguages,
    settings.sttLanguage,
    settings.ttsListenLanguages,
    settingsLoaded,
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
      setModalVisible(true);
    }
    void refresh();
  }, [entitlement.status, refresh, settingsLoaded]);

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
      setOverrides({});
      updateSettings({
        localLanguages: [nextLanguage],
        ttsListenLanguages: [nextLanguage],
        sttLanguage: nextLanguage,
      });
    },
    [deviceLocale, settings.language, updateSettings],
  );

  const selectQuickLlm = useCallback((modelId: LocalLlmModelId) => {
    setOverrides((current) => ({ ...current, quickLlmModelId: modelId }));
  }, []);
  const selectThoroughLlm = useCallback((modelId: LocalLlmModelId | null) => {
    setOverrides((current) => ({ ...current, thoroughLlmModelId: modelId }));
  }, []);
  const selectStt = useCallback((modelId: LocalSttModelId) => {
    setOverrides((current) => ({ ...current, sttModelId: modelId }));
  }, []);
  const selectTts = useCallback((modelId: LocalTtsCatalogModelId | null) => {
    setOverrides((current) => ({ ...current, ttsModelId: modelId }));
  }, []);

  const prepare = useCallback(async () => {
    if (selection?.status !== "ready" || preparing) {
      return;
    }
    const abortController = new AbortController();
    preparationAbortRef.current = abortController;
    setPreparing(true);
    setError(null);
    setPreparationProgress(null);
    const profileModels = getOfflineProfileModels(selection.profile);
    const missingModels = profileModels.filter(
      (model) => !installs[model.id]?.verified,
    );
    const preparationStartedAt = Date.now();
    setPreparationEtaSeconds(
      estimatePreparationSeconds(selection.profile, installs),
    );
    try {
      await prepareOfflineProfile(selection.profile, {
        abortSignal: abortController.signal,
        onProgress: (nextProgress) => {
          setPreparationProgress(nextProgress);
          if (nextProgress.action === "downloading" && nextProgress.download) {
            const currentModel = profileModels[nextProgress.modelIndex];
            const currentMissingIndex = missingModels.findIndex(
              (model) => model.id === currentModel?.id,
            );
            const completedBytes = missingModels
              .slice(0, Math.max(0, currentMissingIndex))
              .reduce((total, model) => total + model.downloadBytes, 0);
            const currentBytes = currentModel
              ? currentModel.downloadBytes *
                (nextProgress.download.phase === "downloading"
                  ? nextProgress.download.progress
                  : 1)
              : 0;
            const transferredBytes = completedBytes + currentBytes;
            const elapsedSeconds = Math.max(
              0.25,
              (Date.now() - preparationStartedAt) / 1_000,
            );
            const bytesPerSecond = transferredBytes / elapsedSeconds;
            const remainingBytes = Math.max(
              0,
              missingModels.reduce(
                (total, model) => total + model.downloadBytes,
                0,
              ) - transferredBytes,
            );
            if (bytesPerSecond > 0 && transferredBytes > 256 * 1024) {
              setPreparationEtaSeconds(
                Math.max(1, Math.ceil(remainingBytes / bytesPerSecond)),
              );
            }
          } else if (nextProgress.action === "benchmarking") {
            setPreparationEtaSeconds(
              Math.max(
                1,
                Math.ceil(
                  profileModels
                    .slice(nextProgress.modelIndex)
                    .reduce(
                      (total, model) =>
                        total + model.benchmark.maximumLoadMs / 1_000 + 5,
                      0,
                    ),
                ),
              ),
            );
          }
        },
      });
      const nextReadiness = await refresh();
      if (nextReadiness?.ready) {
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
  }, [installs, preparing, refresh, selection]);

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
    selection,
    readiness,
    installs,
    benchmarks,
    overrides,
    error,
    selectedLanguage,
    selectLanguage,
    selectQuickLlm,
    selectThoroughLlm,
    selectStt,
    selectTts,
    prepare,
    refresh,
  };
}
