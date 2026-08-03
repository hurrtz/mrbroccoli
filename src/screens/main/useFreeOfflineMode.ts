import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { usePremiumEntitlement } from "../../context/PremiumEntitlementContext";
import type { LocalModelId } from "../../constants/localModels";
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

export interface FreeOfflineModeController {
  effectiveSettings: Settings;
  entitlement: ReturnType<typeof usePremiumEntitlement>;
  freeRuntimeReady: boolean;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  checking: boolean;
  preparing: boolean;
  preparationProgress: OfflinePreparationProgress | null;
  snapshot: LocalDeviceSnapshot | null;
  selection: OfflineProfileSelection | null;
  readiness: OfflineProfileReadiness | null;
  error: string | null;
  selectedLanguage: FreeSpeechLanguage;
  selectLanguage: (language: FreeSpeechLanguage) => void;
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
  const [preparing, setPreparing] = useState(false);
  const [preparationProgress, setPreparationProgress] =
    useState<OfflinePreparationProgress | null>(null);
  const [snapshot, setSnapshot] = useState<LocalDeviceSnapshot | null>(null);
  const [selection, setSelection] = useState<OfflineProfileSelection | null>(
    null,
  );
  const [readiness, setReadiness] = useState<OfflineProfileReadiness | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const refreshOperationRef = useRef(0);
  const preparationAbortRef = useRef<AbortController | null>(null);
  const openedForFreeRef = useRef(false);
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
    setError(null);
    try {
      const [nextSnapshot, installs, benchmarks] = await Promise.all([
        probeLocalDeviceCapabilities(),
        getLocalCatalogInstallStatuses(),
        getLocalModelBenchmarkResults(),
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
      setSnapshot(nextSnapshot);
      setSelection(nextSelection);
      setReadiness(nextReadiness);
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
      if (refreshOperationRef.current === operation) {
        setChecking(false);
      }
    }
  }, [entitlement.status, resolvedLanguage]);

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
      updateSettings({
        localLanguages: [nextLanguage],
        ttsListenLanguages: [nextLanguage],
        sttLanguage: nextLanguage,
      });
    },
    [deviceLocale, settings.language, updateSettings],
  );

  const prepare = useCallback(async () => {
    if (selection?.status !== "ready" || preparing) {
      return;
    }
    const abortController = new AbortController();
    preparationAbortRef.current = abortController;
    setPreparing(true);
    setError(null);
    setPreparationProgress(null);
    try {
      await prepareOfflineProfile(selection.profile, {
        abortSignal: abortController.signal,
        onProgress: setPreparationProgress,
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
    }
  }, [preparing, refresh, selection]);

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
    preparing,
    preparationProgress,
    snapshot,
    selection,
    readiness,
    error,
    selectedLanguage,
    selectLanguage,
    prepare,
    refresh,
  };
}
