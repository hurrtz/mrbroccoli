import React from "react";
import { AccessibilityInfo, Alert, Platform } from "react-native";

import {
  LOCAL_MODEL_CATALOG,
  localModelSupportsLanguages,
  type LocalModelDefinition,
  type LocalModelId,
} from "../../constants/localModels";
import { MAX_RESPONSE_MODES } from "../../constants/providers/defaults";
import { FREE_SPEECH_LANGUAGE_OPTIONS } from "../../constants/speechLanguages";
import { useKeepAwakeWhile } from "../../hooks/useKeepAwakeWhile";
import type { KokoroModelController } from "../../hooks/useKokoroModel";
import { useModelDownloadService } from "../../hooks/useModelDownloadService";
import { useLocalization } from "../../i18n";
import {
  evaluateLocalModelEligibility,
  getLocalModelBenchmarkResults,
  probeLocalDeviceCapabilities,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "../../services/localDeviceCapabilities";
import { benchmarkLocalLlm } from "../../services/localLlm";
import {
  downloadLocalModel,
  removeLocalModel,
  type LocalModelDownloadProgress,
  type LocalModelInstallStatus,
} from "../../services/localModelManager";
import {
  benchmarkLocalStt,
  benchmarkLocalTts,
  getLocalTtsBenchmarkText,
} from "../../services/localSpeechModels";
import {
  probeNativeSpeechCapabilities,
  type NativeSpeechCapabilities,
} from "../../services/nativeSpeechCapabilities";
import { getLocalCatalogInstallStatuses } from "../../services/offlineProfileManager";
import { selectOfflineProfile } from "../../services/offlineProfile";
import { benchmarkKokoroModel } from "../../services/kokoroTts";
import { buildStorePromoLocalDeviceSnapshot } from "../../services/storePromoPresentation";
import type {
  Settings,
  SpeechLanguage,
  VoicePreviewRequest,
} from "../../types";
import { getNextResponseModeId } from "../../utils/responseModes";

import {
  getLocalLanguageSettingsUpdate,
  getLocalModelRemovalSettingsUpdate,
} from "./onDevice";
import { useNativeVoiceOptions } from "./useNativeVoiceOptions";

export type LocalModelBusyAction = {
  action: "download" | "remove" | "test";
  modelId: LocalModelId;
};

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function benchmarkStatusLabelKey(result?: LocalModelBenchmarkResult) {
  switch (result?.status) {
    case "viable":
      return "onDeviceViable" as const;
    case "below-target":
      return "onDeviceBelowTarget" as const;
    case "failed":
      return "onDeviceTestFailed" as const;
    default:
      return "onDeviceNotTested" as const;
  }
}

export function useLocalModelSettings({
  active,
  isPremium,
  kokoroModel,
  onPreviewVoice,
  onUpdate,
  settings,
  storePromoPreview = false,
}: {
  active: boolean;
  isPremium: boolean;
  kokoroModel: KokoroModelController;
  onPreviewVoice: (request: VoicePreviewRequest) => Promise<void>;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  settings: Settings;
  storePromoPreview?: boolean;
}) {
  const { t } = useLocalization();
  const storePromoSnapshot = React.useMemo(
    () =>
      storePromoPreview
        ? buildStorePromoLocalDeviceSnapshot(
            Platform.OS === "ios" ? "ios" : "android",
          )
        : null,
    [storePromoPreview],
  );
  const [snapshot, setSnapshot] = React.useState<LocalDeviceSnapshot | null>(
    storePromoSnapshot,
  );
  const [probeError, setProbeError] = React.useState<string | null>(null);
  const [nativeSpeechCapabilities, setNativeSpeechCapabilities] =
    React.useState<NativeSpeechCapabilities | null>(
      storePromoPreview
        ? {
            recognitionAvailable: true,
            onDeviceRecognitionAvailable: true,
            targetLocaleInstalled: true,
            nativeSttEligible: true,
          }
        : null,
    );
  const [probing, setProbing] = React.useState(!storePromoPreview);
  const [busy, setBusy] = React.useState<LocalModelBusyAction | null>(null);
  const [progress, setProgress] = React.useState<
    Partial<Record<LocalModelId, LocalModelDownloadProgress>>
  >({});
  const [installs, setInstalls] = React.useState<
    Partial<Record<LocalModelId, LocalModelInstallStatus>>
  >({});
  const [benchmarks, setBenchmarks] = React.useState<
    Partial<Record<LocalModelId, LocalModelBenchmarkResult>>
  >({});
  const downloadAbortRef = React.useRef<AbortController | null>(null);

  useKeepAwakeWhile(
    busy?.action === "download" || busy?.action === "test",
    "mrbroccoli-on-device-models",
  );
  useModelDownloadService(busy?.action === "download", {
    body: t("onDeviceDownloadServiceBody"),
    title: t("onDeviceDownloadServiceTitle"),
  });

  const { nativeVoiceOptions, selectedNativeVoice, setSelectedNativeVoice } =
    useNativeVoiceOptions({
      visible: active,
      shouldLoad: active,
      listenLanguages: settings.localLanguages,
      preferredVoiceId: settings.nativeTtsVoiceId,
    });

  const refreshModelState = React.useCallback(async () => {
    if (storePromoPreview) {
      setInstalls({});
      setBenchmarks({});
      return;
    }
    const [nextInstalls, nextBenchmarks] = await Promise.all([
      getLocalCatalogInstallStatuses({
        phonemeLanguages: settings.localLanguages,
      }),
      getLocalModelBenchmarkResults(),
    ]);
    setInstalls(nextInstalls);
    setBenchmarks(nextBenchmarks);
  }, [settings.localLanguages, storePromoPreview]);

  const runDeviceProbe = React.useCallback(async () => {
    if (storePromoSnapshot) {
      setSnapshot(storePromoSnapshot);
      setNativeSpeechCapabilities({
        recognitionAvailable: true,
        onDeviceRecognitionAvailable: true,
        targetLocaleInstalled: true,
        nativeSttEligible: true,
      });
      setProbeError(null);
      setProbing(false);
      return;
    }
    setProbing(true);
    setProbeError(null);
    try {
      const [nextSnapshot, nextNativeSpeechCapabilities] = await Promise.all([
        probeLocalDeviceCapabilities(),
        probeNativeSpeechCapabilities(settings.localLanguages[0] ?? "en"),
      ]);
      setSnapshot(nextSnapshot);
      setNativeSpeechCapabilities(nextNativeSpeechCapabilities);
    } catch (error) {
      setProbeError(error instanceof Error ? error.message : String(error));
      setSnapshot(null);
      setNativeSpeechCapabilities(null);
    } finally {
      setProbing(false);
    }
  }, [settings.localLanguages, storePromoSnapshot]);

  React.useEffect(() => {
    if (!active) {
      return;
    }
    void runDeviceProbe();
    void refreshModelState();
  }, [active, refreshModelState, runDeviceProbe]);

  const compatibleModels = React.useMemo(() => {
    if (!snapshot) {
      return [];
    }
    return LOCAL_MODEL_CATALOG.filter(
      (model) =>
        localModelSupportsLanguages(model, settings.localLanguages) &&
        evaluateLocalModelEligibility(model, snapshot).eligible,
    );
  }, [settings.localLanguages, snapshot]);

  const selectedFreeProfile = React.useMemo(() => {
    if (isPremium || !snapshot) {
      return null;
    }
    const result = selectOfflineProfile({
      languages: settings.localLanguages,
      snapshot,
      installedModelIds: new Set(
        Object.entries(installs)
          .filter(([, status]) => status?.verified)
          .map(([modelId]) => modelId as LocalModelId),
      ),
      benchmarks,
      overrides: settings.freeOfflineProfileOverrides,
      nativeSttEligible: nativeSpeechCapabilities?.nativeSttEligible,
    });
    return result.status === "ready" ? result.profile : null;
  }, [
    benchmarks,
    installs,
    isPremium,
    nativeSpeechCapabilities?.nativeSttEligible,
    settings.freeOfflineProfileOverrides,
    settings.localLanguages,
    snapshot,
  ]);

  const toggleLanguage = React.useCallback(
    (language: SpeechLanguage) => {
      const nextSettings = getLocalLanguageSettingsUpdate(
        settings,
        language,
        !isPremium,
      );
      if (!nextSettings) {
        return;
      }
      onUpdate(
        isPremium
          ? nextSettings
          : {
              ...nextSettings,
              freeOnboardingLanguageInitialized: true,
              freeOfflineSetupCompleted: false,
              freeOfflineProfileOverrides: {},
            },
      );
    },
    [isPremium, onUpdate, settings],
  );

  const downloadModel = React.useCallback(
    async (model: LocalModelDefinition) => {
      const abortController = new AbortController();
      downloadAbortRef.current = abortController;
      setBusy({ action: "download", modelId: model.id });
      AccessibilityInfo.announceForAccessibility(t("downloadingShort"));
      try {
        if (model.id === "kokoro-multilingual") {
          const completed = await kokoroModel.download({
            signal: abortController.signal,
            phonemeLanguages: settings.localLanguages,
          });
          if (!completed) {
            return;
          }
        } else {
          await downloadLocalModel(model.id, {
            abortSignal: abortController.signal,
            onProgress: (next) =>
              setProgress((current) => ({ ...current, [model.id]: next })),
          });
        }
        await refreshModelState();
        AccessibilityInfo.announceForAccessibility(
          `${model.name}: ${t("settingsReadinessReady")}`,
        );
      } catch (error) {
        if (!isAbortError(error) && !abortController.signal.aborted) {
          Alert.alert(
            model.name,
            error instanceof Error ? error.message : String(error),
          );
        }
        await refreshModelState();
      } finally {
        if (downloadAbortRef.current === abortController) {
          downloadAbortRef.current = null;
        }
        setBusy(null);
        setProgress((current) => ({ ...current, [model.id]: undefined }));
      }
    },
    [kokoroModel, refreshModelState, settings.localLanguages, t],
  );

  const cancelDownload = React.useCallback(() => {
    downloadAbortRef.current?.abort();
    AccessibilityInfo.announceForAccessibility(t("onDeviceDownloadCancelled"));
  }, [t]);

  const removeModel = React.useCallback(
    async (model: LocalModelDefinition) => {
      setBusy({ action: "remove", modelId: model.id });
      try {
        if (model.id === "kokoro-multilingual") {
          const completed = await kokoroModel.remove();
          if (!completed) {
            return;
          }
        } else {
          await removeLocalModel(model.id);
        }
        onUpdate(getLocalModelRemovalSettingsUpdate(settings, model));
        await refreshModelState();
      } catch (error) {
        Alert.alert(
          model.name,
          error instanceof Error ? error.message : String(error),
        );
      } finally {
        setBusy(null);
      }
    },
    [kokoroModel, onUpdate, refreshModelState, settings],
  );

  const testModel = React.useCallback(
    async (model: LocalModelDefinition) => {
      setBusy({ action: "test", modelId: model.id });
      try {
        let result: LocalModelBenchmarkResult;
        if (model.capability === "llm") {
          result = await benchmarkLocalLlm(model.id);
        } else if (model.capability === "stt") {
          result = await benchmarkLocalStt(
            model.id,
            settings.localLanguages.length === 1
              ? settings.localLanguages[0]
              : "auto",
          );
        } else if (model.id === "kokoro-multilingual") {
          result = await benchmarkKokoroModel(
            settings.localLanguages.includes("zh-CN") ? "zh" : "en",
          );
        } else {
          result = await benchmarkLocalTts(
            model.id,
            settings.localLanguages[0],
          );
        }
        setBenchmarks((current) => ({ ...current, [model.id]: result }));
        AccessibilityInfo.announceForAccessibility(
          `${model.name}: ${t(benchmarkStatusLabelKey(result))}`,
        );

        if (result.status !== "failed" && model.capability === "tts") {
          const previewLanguage = settings.localLanguages[0];
          if (model.id === "kokoro-multilingual") {
            await onPreviewVoice({
              mode: "kokoro",
              text: "Hello from Mr Broccoli.",
              language: previewLanguage === "zh-CN" ? "zh" : "en",
              voice:
                settings.kokoroVoices[
                  previewLanguage === "zh-CN" ? "zh" : "en"
                ],
            });
          } else {
            await onPreviewVoice({
              mode: "local",
              modelId: model.id,
              previewLanguage,
              text: getLocalTtsBenchmarkText(previewLanguage),
            });
          }
        }
      } catch (error) {
        Alert.alert(
          model.name,
          error instanceof Error ? error.message : String(error),
        );
      } finally {
        setBusy(null);
      }
    },
    [onPreviewVoice, settings.kokoroVoices, settings.localLanguages, t],
  );

  const selectModel = React.useCallback(
    (model: LocalModelDefinition) => {
      if (!isPremium) {
        const current = settings.freeOfflineProfileOverrides;
        if (model.capability === "llm") {
          onUpdate({
            freeOfflineProfileOverrides:
              model.responseProfile === "thorough"
                ? { ...current, thoroughLlmModelId: model.id }
                : { ...current, quickLlmModelId: model.id },
          });
          return;
        }
        if (model.capability === "stt") {
          onUpdate({
            sttMode: "local",
            nativeSttRequiresOnDevice: false,
            localSttModelId: model.id,
            freeOfflineProfileOverrides: { ...current, sttModelId: model.id },
          });
          return;
        }
        onUpdate({
          ...(model.id === "kokoro-multilingual"
            ? { localTtsModelId: null, ttsMode: "kokoro" as const }
            : { localTtsModelId: model.id, ttsMode: "local" as const }),
          freeOfflineProfileOverrides: { ...current, ttsModelId: model.id },
        });
        return;
      }

      if (model.capability === "stt") {
        onUpdate({
          localSttModelId: model.id,
          nativeSttRequiresOnDevice: false,
          sttMode: "local",
        });
        return;
      }
      if (model.capability === "tts") {
        onUpdate(
          model.id === "kokoro-multilingual"
            ? { localTtsModelId: null, ttsMode: "kokoro" }
            : { localTtsModelId: model.id, ttsMode: "local" },
        );
        return;
      }

      const existing = settings.responseModes.find(
        ({ route }) => route.localModelId === model.id,
      );
      if (existing) {
        onUpdate({ activeResponseMode: existing.id });
        return;
      }
      const route = {
        runtime: "local" as const,
        localModelId: model.id,
        provider: settings.lastProvider,
        model: model.name,
      };
      if (settings.responseModes.length >= MAX_RESPONSE_MODES) {
        onUpdate({
          responseModes: settings.responseModes.map((entry) =>
            entry.id === settings.activeResponseMode
              ? { ...entry, route }
              : entry,
          ),
        });
        return;
      }
      const id = getNextResponseModeId(settings.responseModes);
      onUpdate({
        activeResponseMode: id,
        responseModes: [...settings.responseModes, { id, route }],
      });
    },
    [isPremium, onUpdate, settings],
  );

  const isModelSelected = React.useCallback(
    (model: LocalModelDefinition) => {
      if (!isPremium && selectedFreeProfile) {
        if (model.capability === "llm") {
          return (
            selectedFreeProfile.llm.id === model.id ||
            selectedFreeProfile.thoroughLlm?.id === model.id
          );
        }
        if (model.capability === "stt") {
          return selectedFreeProfile.stt?.id === model.id;
        }
        return selectedFreeProfile.tts?.id === model.id;
      }
      if (model.capability === "llm") {
        return settings.responseModes.some(
          ({ id, route }) =>
            id === settings.activeResponseMode &&
            route.localModelId === model.id,
        );
      }
      if (model.capability === "stt") {
        return (
          settings.sttMode === "local" && settings.localSttModelId === model.id
        );
      }
      return model.id === "kokoro-multilingual"
        ? settings.ttsMode === "kokoro"
        : settings.ttsMode === "local" && settings.localTtsModelId === model.id;
    },
    [isPremium, selectedFreeProfile, settings],
  );

  const selectNativeRoute = React.useCallback(
    (capability: "stt" | "tts") => {
      if (capability === "stt") {
        onUpdate({
          sttMode: "native",
          nativeSttRequiresOnDevice: !isPremium,
          localSttModelId: null,
          ...(!isPremium
            ? {
                freeOfflineProfileOverrides: {
                  ...settings.freeOfflineProfileOverrides,
                  sttModelId: null,
                },
              }
            : {}),
        });
        return;
      }
      onUpdate({
        ttsMode: "native",
        localTtsModelId: null,
        ...(!isPremium
          ? {
              freeOfflineProfileOverrides: {
                ...settings.freeOfflineProfileOverrides,
                ttsModelId: null,
              },
            }
          : {}),
      });
    },
    [isPremium, onUpdate, settings.freeOfflineProfileOverrides],
  );

  const selectNativeVoice = React.useCallback(
    (voiceId: string) => {
      setSelectedNativeVoice(voiceId);
      onUpdate({ nativeTtsVoiceId: voiceId });
    },
    [onUpdate, setSelectedNativeVoice],
  );

  return {
    benchmarks,
    busy,
    cancelDownload,
    compatibleModels,
    downloadModel,
    freeLanguageOptions: FREE_SPEECH_LANGUAGE_OPTIONS,
    installs,
    isModelSelected,
    kokoroModel,
    nativeSpeechCapabilities,
    nativeVoiceOptions,
    probeError,
    probing,
    progress,
    refreshModelState,
    removeModel,
    runDeviceProbe,
    selectModel,
    selectNativeRoute,
    selectNativeVoice,
    selectedNativeVoice,
    snapshot,
    testModel,
    toggleLanguage,
  };
}

export type LocalModelSettingsController = ReturnType<
  typeof useLocalModelSettings
>;
