import React from "react";
import { AccessibilityInfo } from "react-native";

import {
  LOCAL_MODEL_CATALOG,
  localModelSupportsLanguages,
  type LocalModelDefinition,
  type LocalModelId,
} from "../../constants/localModels";
import { SPEECH_LANGUAGE_OPTIONS } from "../../constants/speechLanguages";
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
import { getLocalCatalogInstallStatuses } from "../../services/localSpeechModelManager";
import { benchmarkKokoroModel } from "../../services/kokoroTts";
import type {
  Settings,
  SpeechLanguage,
  VoicePreviewRequest,
} from "../../types";

import {
  getLocalLanguageSettingsUpdate,
  getLocalModelRemovalSettingsUpdate,
} from "./onDevice";
import { useNativeVoiceOptions } from "./useNativeVoiceOptions";

export type LocalModelBusyAction = {
  action: "download" | "remove" | "test";
  modelId: LocalModelId;
};

export type LocalModelActionError = {
  action: LocalModelBusyAction["action"];
  message: string;
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
  kokoroModel,
  onPreviewVoice,
  onUpdate,
  settings,
}: {
  active: boolean;
  kokoroModel: KokoroModelController;
  onPreviewVoice: (request: VoicePreviewRequest) => Promise<void>;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  settings: Settings;
}) {
  const { t } = useLocalization();
  const [snapshot, setSnapshot] = React.useState<LocalDeviceSnapshot | null>(
    null,
  );
  const [probeError, setProbeError] = React.useState<string | null>(null);
  const [nativeSpeechCapabilities, setNativeSpeechCapabilities] =
    React.useState<NativeSpeechCapabilities | null>(null);
  const [probing, setProbing] = React.useState(true);
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
  const [errors, setErrors] = React.useState<
    Partial<Record<LocalModelId, LocalModelActionError>>
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
    const [nextInstalls, nextBenchmarks] = await Promise.all([
      getLocalCatalogInstallStatuses({
        phonemeLanguages: settings.localLanguages,
      }),
      getLocalModelBenchmarkResults(),
    ]);
    setInstalls(nextInstalls);
    setBenchmarks(nextBenchmarks);
  }, [settings.localLanguages]);

  const runDeviceProbe = React.useCallback(async () => {
    setProbing(true);
    setProbeError(null);
    try {
      const nextSnapshot = await probeLocalDeviceCapabilities();
      setSnapshot(nextSnapshot);
      try {
        setNativeSpeechCapabilities(
          await probeNativeSpeechCapabilities(
            settings.localLanguages[0] ?? "en",
          ),
        );
      } catch {
        // Native recognition eligibility is independent of downloadable model
        // eligibility. A missing recognizer must not hide local STT/TTS routes.
        setNativeSpeechCapabilities(null);
      }
    } catch (error) {
      setProbeError(error instanceof Error ? error.message : String(error));
      setSnapshot(null);
      setNativeSpeechCapabilities(null);
    } finally {
      setProbing(false);
    }
  }, [settings.localLanguages]);

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

  const toggleLanguage = React.useCallback(
    (language: SpeechLanguage) => {
      const nextSettings = getLocalLanguageSettingsUpdate(settings, language);
      if (!nextSettings) {
        return;
      }
      onUpdate(nextSettings);
    },
    [onUpdate, settings],
  );

  const downloadModel = React.useCallback(
    async (model: LocalModelDefinition) => {
      const abortController = new AbortController();
      downloadAbortRef.current = abortController;
      setErrors((current) => ({ ...current, [model.id]: undefined }));
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
          const message = error instanceof Error ? error.message : String(error);
          setErrors((current) => ({
            ...current,
            [model.id]: { action: "download", message },
          }));
          AccessibilityInfo.announceForAccessibility(
            `${model.name}: ${message}`,
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
      setErrors((current) => ({ ...current, [model.id]: undefined }));
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
        const message = error instanceof Error ? error.message : String(error);
        setErrors((current) => ({
          ...current,
          [model.id]: { action: "remove", message },
        }));
        AccessibilityInfo.announceForAccessibility(
          `${model.name}: ${message}`,
        );
      } finally {
        setBusy(null);
      }
    },
    [kokoroModel, onUpdate, refreshModelState, settings],
  );

  const testModel = React.useCallback(
    async (model: LocalModelDefinition) => {
      setErrors((current) => ({ ...current, [model.id]: undefined }));
      setBusy({ action: "test", modelId: model.id });
      try {
        let result: LocalModelBenchmarkResult;
        if (model.capability === "stt") {
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
        const message = error instanceof Error ? error.message : String(error);
        setErrors((current) => ({
          ...current,
          [model.id]: { action: "test", message },
        }));
        AccessibilityInfo.announceForAccessibility(
          `${model.name}: ${message}`,
        );
      } finally {
        setBusy(null);
      }
    },
    [onPreviewVoice, settings.kokoroVoices, settings.localLanguages, t],
  );

  const selectModel = React.useCallback(
    (model: LocalModelDefinition) => {
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
            ? {
                localTtsModelId: null,
                spokenRepliesEnabled: true,
                ttsMode: "kokoro",
              }
            : {
                localTtsModelId: model.id,
                spokenRepliesEnabled: true,
                ttsMode: "local",
              },
        );
      }
    },
    [onUpdate],
  );

  const isModelSelected = React.useCallback(
    (model: LocalModelDefinition) => {
      if (model.capability === "stt") {
        return (
          settings.sttMode === "local" && settings.localSttModelId === model.id
        );
      }
      return model.id === "kokoro-multilingual"
        ? settings.ttsMode === "kokoro"
        : settings.ttsMode === "local" && settings.localTtsModelId === model.id;
    },
    [settings],
  );

  const selectNativeRoute = React.useCallback(
    (capability: "stt" | "tts") => {
      if (capability === "stt") {
        onUpdate({
          sttMode: "native",
          nativeSttRequiresOnDevice: false,
          localSttModelId: null,
        });
        return;
      }
      onUpdate({
        ttsMode: "native",
        localTtsModelId: null,
        spokenRepliesEnabled: true,
      });
    },
    [onUpdate],
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
    errors,
    speechLanguageOptions: SPEECH_LANGUAGE_OPTIONS,
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
