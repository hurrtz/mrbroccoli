import React from "react";
import {
  AccessibilityInfo,
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "../../../design-system/NativeControls";
import { AutoSetupCard } from "../../../components/autoSetup/AutoSetupCard";
import type { AutoSetupJobState } from "../../../components/autoSetup/types";
import { LocalModelPerformanceSummary } from "../../../components/LocalModelPerformanceSummary";
import {
  LOCAL_MODEL_CATALOG,
  localModelSupportsLanguages,
  type LocalModelCapability,
  type LocalModelDefinition,
  type LocalModelId,
} from "../../../constants/localModels";
import { useKeepAwakeWhile } from "../../../hooks/useKeepAwakeWhile";
import { useModelDownloadService } from "../../../hooks/useModelDownloadService";
import { useLocalization } from "../../../i18n";
import type { KokoroModelController } from "../../../hooks/useKokoroModel";
import {
  evaluateLocalModelEligibility,
  getLocalModelBenchmarkResults,
  probeLocalDeviceCapabilities,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "../../../services/localDeviceCapabilities";
import {
  downloadLocalModel,
  removeLocalModel,
  type LocalModelDownloadProgress,
  type LocalModelInstallStatus,
} from "../../../services/localModelManager";
import { benchmarkLocalLlm } from "../../../services/localLlm";
import {
  benchmarkLocalStt,
  benchmarkLocalTts,
  getLocalTtsBenchmarkText,
} from "../../../services/localSpeechModels";
import { benchmarkKokoroModel } from "../../../services/kokoroTts";
import { getLocalCatalogInstallStatuses } from "../../../services/offlineProfileManager";
import { selectOfflineProfile } from "../../../services/offlineProfile";
import {
  probeNativeSpeechCapabilities,
  type NativeSpeechCapabilities,
} from "../../../services/nativeSpeechCapabilities";
import { useNativeVoiceOptions } from "../../settings-core/useNativeVoiceOptions";
import { getKokoroVoiceOptions } from "../../../constants/kokoro";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type {
  Settings,
  SpeechLanguage,
  VoicePreviewRequest,
} from "../../../types";
import { MAX_RESPONSE_MODES } from "../../../constants/providers/defaults";
import { FREE_SPEECH_LANGUAGE_OPTIONS } from "../../../constants/speechLanguages";
import {
  getLocalLanguageSettingsUpdate,
  getLocalModelRemovalSettingsUpdate,
} from "../../settings-core/onDevice";
import { getNextResponseModeId } from "../../../utils/responseModes";
import { AntListenLanguageSelector } from "../AntListenLanguageSelector";
import {
  AntPickerRow,
  AntDisclosureCard,
  AntSectionIntro,
  AntSettingsCard,
} from "../AntSettingsPrimitives";
import { styles } from "../styles";
import { formatBytes } from "../../../utils/formatBytes";
import { buildStorePromoLocalDeviceSnapshot } from "../../../services/storePromoPresentation";

type BusyAction = {
  action: "download" | "remove" | "test";
  modelId: LocalModelId;
};

const CAPABILITY_ORDER = ["llm", "stt", "tts"] as const;

type CapabilityDisclosureState = Record<LocalModelCapability, boolean>;

const INITIAL_CAPABILITY_DISCLOSURES: CapabilityDisclosureState = {
  llm: false,
  stt: false,
  tts: false,
};

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function testStatusKey(result?: LocalModelBenchmarkResult) {
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

function capabilityTitleKey(capability: LocalModelCapability) {
  switch (capability) {
    case "llm":
      return "onDeviceThinkingModels" as const;
    case "stt":
      return "onDeviceListeningModels" as const;
    case "tts":
      return "onDeviceSpeakingModels" as const;
  }
}

export function OnDeviceSettingsPage({
  autoSetup,
  settings,
  isPremium,
  kokoroModel,
  storePromoPreview = false,
  onUpdate,
  onPreviewVoice,
}: {
  autoSetup: AutoSetupJobState;
  settings: Settings;
  isPremium: boolean;
  kokoroModel: KokoroModelController;
  storePromoPreview?: boolean;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onPreviewVoice: (request: VoicePreviewRequest) => Promise<void>;
}) {
  const { colors } = useTheme();
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
  const [busy, setBusy] = React.useState<BusyAction | null>(null);
  const [expandedCapabilities, setExpandedCapabilities] =
    React.useState<CapabilityDisclosureState>(INITIAL_CAPABILITY_DISCLOSURES);
  // Downloading a multi-gigabyte model, and benchmarking it afterwards, both
  // run far longer than any default screen timeout, and a sleeping phone
  // aborts the transfer and leaves the whole download to start over. This page
  // is where that work happens now that the setup wizard is gone; the wake
  // lock that used to cover it moved with the wizard and stopped applying.
  // Held so the running transfer can be stopped from the control that started
  // it; a multi-gigabyte download with no way out is its own trap.
  const downloadAbortRef = React.useRef<AbortController | null>(null);
  useKeepAwakeWhile(
    busy?.action === "download" || busy?.action === "test",
    "mrbroccoli-on-device-models",
  );
  // The wake lock only answers a sleeping screen while the app is in front.
  // Leaving the app, or Doze under battery saver, cuts the transfer within
  // about a minute, so the download also runs under a foreground service.
  useModelDownloadService(busy?.action === "download", {
    body: t("onDeviceDownloadServiceBody"),
    title: t("onDeviceDownloadServiceTitle"),
  });
  const [progress, setProgress] = React.useState<
    Partial<Record<LocalModelId, LocalModelDownloadProgress>>
  >({});
  const [installs, setInstalls] = React.useState<
    Partial<Record<LocalModelId, LocalModelInstallStatus>>
  >({});
  const [benchmarks, setBenchmarks] = React.useState<
    Partial<Record<LocalModelId, LocalModelBenchmarkResult>>
  >({});
  const { nativeVoiceOptions, selectedNativeVoice, setSelectedNativeVoice } =
    useNativeVoiceOptions({
      visible: true,
      shouldLoad: true,
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
    void runDeviceProbe();
    void refreshModelState();
  }, [refreshModelState, runDeviceProbe]);

  React.useEffect(() => {
    if (!busy) {
      return;
    }
    const capability = LOCAL_MODEL_CATALOG.find(
      (model) => model.id === busy.modelId,
    )?.capability;
    if (!capability) {
      return;
    }
    setExpandedCapabilities((current) =>
      current[capability] ? current : { ...current, [capability]: true },
    );
  }, [busy]);

  const toggleLanguage = (language: SpeechLanguage) => {
    const nextSettings = getLocalLanguageSettingsUpdate(
      settings,
      language,
      !isPremium,
    );
    if (nextSettings) {
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
    }
  };

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

  const handleDownload = async (model: LocalModelDefinition) => {
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
      // Cancelling is an outcome the user chose, not a failure to report back
      // to them. The service already removed the partial file.
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
  };

  const handleCancelDownload = () => {
    downloadAbortRef.current?.abort();
    AccessibilityInfo.announceForAccessibility(t("onDeviceDownloadCancelled"));
  };

  const handleRemove = async (model: LocalModelDefinition) => {
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
  };

  const handleTest = async (model: LocalModelDefinition) => {
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
        const previewLanguage = settings.localLanguages[0];
        result = await benchmarkLocalTts(model.id, previewLanguage);
      }
      setBenchmarks((current) => ({ ...current, [model.id]: result }));
      AccessibilityInfo.announceForAccessibility(
        `${model.name}: ${t(testStatusKey(result))}`,
      );

      if (result.status !== "failed" && model.capability === "tts") {
        const previewLanguage = settings.localLanguages[0];
        if (model.id === "kokoro-multilingual") {
          await onPreviewVoice({
            mode: "kokoro",
            text: "Hello from Mr Broccoli.",
            language: previewLanguage === "zh-CN" ? "zh" : "en",
            voice:
              settings.kokoroVoices[previewLanguage === "zh-CN" ? "zh" : "en"],
          });
        } else {
          await onPreviewVoice({
            mode: "local",
            modelId: model.id,
            previewLanguage,
            // Piper voices are language-specific. The benchmark has already
            // proved this voice with the selected language; replay that same
            // sample rather than immediately asking a Russian/Italian/etc.
            // voice to synthesize English and turning a successful test into
            // a native generation error.
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
  };

  const handleUse = (model: LocalModelDefinition) => {
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
  };

  const isModelSelected = (model: LocalModelDefinition) => {
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
          id === settings.activeResponseMode && route.localModelId === model.id,
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
  };

  const renderModel = (model: LocalModelDefinition) => {
    const install = installs[model.id];
    const benchmark = benchmarks[model.id];
    const modelBusy = busy?.modelId === model.id;
    const downloadProgress = progress[model.id];
    const canUse = install?.verified && benchmark?.status === "viable";

    return (
      <AntSettingsCard key={model.id} title={model.name}>
        <Text style={[localStyles.meta, { color: colors.textMuted }]}>
          {model.catalogTier === "advanced"
            ? `${t("onboardingAdvancedOptions")} · `
            : ""}
          {formatBytes(model.downloadBytes)} · {model.license}
        </Text>
        {snapshot ? (
          <LocalModelPerformanceSummary
            model={model}
            snapshot={snapshot}
            benchmark={benchmark}
            benchmarks={benchmarks}
          />
        ) : null}
        {downloadProgress ? (
          <Text style={[localStyles.meta, { color: colors.accent }]}>
            {Math.round(downloadProgress.progress * 100)}%
          </Text>
        ) : null}
        <View style={localStyles.actions}>
          {!install?.verified ? (
            modelBusy && busy?.action === "download" ? (
              <Button
                size="small"
                onPress={handleCancelDownload}
                testID={`on-device-cancel-${model.id}`}
              >
                <Text style={{ color: colors.danger }}>{t("cancel")}</Text>
              </Button>
            ) : (
              <Button
                size="small"
                onPress={() => void handleDownload(model)}
                testID={`on-device-download-${model.id}`}
              >
                <Text style={{ color: colors.accent }}>{t("download")}</Text>
              </Button>
            )
          ) : (
            <>
              <Button
                size="small"
                loading={modelBusy && busy?.action === "test"}
                onPress={() => void handleTest(model)}
                testID={`on-device-test-${model.id}`}
              >
                <Text style={{ color: colors.accent }}>{t("test")}</Text>
              </Button>
              <Button
                size="small"
                type={isModelSelected(model) ? "ghost" : "primary"}
                disabled={!canUse || isModelSelected(model)}
                onPress={() => handleUse(model)}
                testID={`on-device-use-${model.id}`}
              >
                <Text
                  style={{
                    color: isModelSelected(model)
                      ? colors.textMuted
                      : colors.onActiveControl,
                  }}
                >
                  {t(isModelSelected(model) ? "onDeviceInUse" : "onDeviceUse")}
                </Text>
              </Button>
              <Button
                size="small"
                loading={modelBusy && busy?.action === "remove"}
                onPress={() => void handleRemove(model)}
                testID={`on-device-remove-${model.id}`}
              >
                <Text style={{ color: colors.danger }}>{t("remove")}</Text>
              </Button>
            </>
          )}
        </View>
        {benchmark?.detail ? (
          <Text
            accessibilityRole="alert"
            style={[localStyles.meta, { color: colors.danger }]}
          >
            {benchmark.detail}
          </Text>
        ) : null}
        {model.id === "kokoro-multilingual" && isModelSelected(model) ? (
          <AntPickerRow
            testID="on-device-kokoro-voice"
            label={t("ttsVoice")}
            value={settings.kokoroVoices.en}
            options={getKokoroVoiceOptions("en", settings.language)}
            onChange={(voice) =>
              onUpdate({
                kokoroVoices: { ...settings.kokoroVoices, en: voice },
              })
            }
          />
        ) : null}
        {model.id === "kokoro-multilingual" && kokoroModel.error ? (
          <Text
            accessibilityRole="alert"
            style={[localStyles.meta, { color: colors.danger }]}
          >
            {kokoroModel.error}
          </Text>
        ) : null}
      </AntSettingsCard>
    );
  };

  const renderNativeRoute = (capability: "stt" | "tts") => {
    const isStt = capability === "stt";
    const selected = isStt
      ? !isPremium
        ? selectedFreeProfile?.stt === null
        : settings.sttMode === "native"
      : !isPremium
        ? selectedFreeProfile?.tts === null
        : settings.ttsMode === "native";
    const disabled =
      isStt && nativeSpeechCapabilities?.nativeSttEligible !== true;
    const handleSelect = () => {
      if (isStt) {
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
    };

    return (
      <AntSettingsCard title={isStt ? t("appNative") : t("systemVoice")}>
        <Text style={[localStyles.meta, { color: colors.textMuted }]}>
          {isStt
            ? t(disabled ? "onboardingNotRecommended" : "onboardingLikely")
            : t("onboardingLikely")}
        </Text>
        <View style={localStyles.actions}>
          <Button
            size="small"
            type={selected ? "ghost" : "primary"}
            disabled={disabled || selected}
            onPress={handleSelect}
          >
            <Text
              style={{
                color: selected ? colors.textMuted : colors.onActiveControl,
              }}
            >
              {t(selected ? "onDeviceInUse" : "onDeviceUse")}
            </Text>
          </Button>
        </View>
        {!isStt && selected ? (
          <AntPickerRow
            testID="on-device-native-voice"
            label={t("ttsVoice")}
            value={selectedNativeVoice}
            options={nativeVoiceOptions}
            disabled={nativeVoiceOptions.length === 0}
            onChange={(voice) => {
              setSelectedNativeVoice(voice);
              onUpdate({ nativeTtsVoiceId: voice });
            }}
          />
        ) : null}
      </AntSettingsCard>
    );
  };

  return (
    <View testID="on-device-settings-page" style={styles.sectionPageStack}>
      {/* On-device AI leads with the automatic card: one tap that measures
          the device, proposes a set, and installs it. The manual catalogue
          below remains the expert route. */}
      <AutoSetupCard job={autoSetup} t={t} />

      <View style={styles.sectionGroup}>
        <AntSectionIntro title={t("settingsOnDevice")} />
        <AntSettingsCard>
          <Text style={[localStyles.body, { color: colors.textSecondary }]}>
            {t("onDeviceIntro")}
          </Text>
          <Button
            loading={probing}
            onPress={() => void runDeviceProbe()}
            type="ghost"
          >
            <Text style={{ color: colors.accent }}>
              {t(probing ? "onDeviceTestingDevice" : "onDeviceTestDevice")}
            </Text>
          </Button>
          {snapshot ? (
            <Text
              accessibilityLiveRegion="polite"
              style={[localStyles.meta, { color: colors.success }]}
            >
              {t("onDeviceDeviceReady")} ·{" "}
              {t("onDeviceDeviceSummary", {
                memory: formatBytes(snapshot.physicalMemoryBytes),
                storage: formatBytes(snapshot.freeStorageBytes),
              })}
            </Text>
          ) : null}
          <Text style={[localStyles.meta, { color: colors.textMuted }]}>
            {t("onDevicePerformanceCaution")}
          </Text>
          {probeError ? (
            <Text
              accessibilityRole="alert"
              style={[localStyles.meta, { color: colors.danger }]}
            >
              {probeError}
            </Text>
          ) : null}
        </AntSettingsCard>
      </View>

      <View style={styles.sectionGroup}>
        <AntSectionIntro title={t("onDeviceLanguages")} />
        <Text style={[localStyles.body, { color: colors.textSecondary }]}>
          {t("onDeviceLanguagesHint")}
        </Text>
        <AntListenLanguageSelector
          selectedLanguages={settings.localLanguages}
          onToggleLanguage={toggleLanguage}
          availableLanguages={
            isPremium ? undefined : FREE_SPEECH_LANGUAGE_OPTIONS
          }
          singleChoice={!isPremium}
        />
      </View>

      {snapshot && compatibleModels.length === 0 ? (
        <AntSettingsCard>
          <Text
            accessibilityRole="alert"
            style={[localStyles.body, { color: colors.textSecondary }]}
          >
            {t("onDeviceNoCompatibleModels")}
          </Text>
        </AntSettingsCard>
      ) : null}

      {CAPABILITY_ORDER.map((capability) => {
        const models = compatibleModels.filter(
          (model) => model.capability === capability,
        );
        if (models.length === 0) {
          return null;
        }
        const title = t(capabilityTitleKey(capability));
        const expanded = expandedCapabilities[capability];
        return (
          <AntDisclosureCard
            key={capability}
            expanded={expanded}
            header={
              <Text
                accessibilityRole="header"
                style={[styles.sectionTitle, { color: colors.text }]}
              >
                {title}
              </Text>
            }
            onToggle={() =>
              setExpandedCapabilities((current) => ({
                ...current,
                [capability]: !current[capability],
              }))
            }
            testID={`on-device-${capability}-disclosure`}
            toggleAccessibilityLabel={title}
          >
            {capability === "stt" || capability === "tts"
              ? renderNativeRoute(capability)
              : null}
            {models.map(renderModel)}
          </AntDisclosureCard>
        );
      })}
    </View>
  );
}

const localStyles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
});
