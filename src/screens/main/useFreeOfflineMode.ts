import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { usePremiumEntitlement } from "../../context/PremiumEntitlementContext";
import type { LocalModelId } from "../../constants/localModels";
import type { Settings, SpeechLanguage } from "../../types";
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
  toggleLanguage: (language: SpeechLanguage) => void;
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
        languages: settings.localLanguages,
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
  }, [entitlement.status, settings.localLanguages]);

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

  const toggleLanguage = useCallback(
    (language: SpeechLanguage) => {
      const selected = settings.localLanguages.includes(language);
      const nextLanguages = selected
        ? settings.localLanguages.filter((candidate) => candidate !== language)
        : [...settings.localLanguages, language];
      if (nextLanguages.length === 0) {
        return;
      }
      updateSettings({
        localLanguages: nextLanguages,
        ttsListenLanguages: nextLanguages,
        sttLanguage: nextLanguages.length === 1 ? nextLanguages[0] : "auto",
      });
    },
    [settings.localLanguages, updateSettings],
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
    toggleLanguage,
    prepare,
    refresh,
  };
}
