import React from "react";
import { AccessibilityInfo, Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "../../../design-system/NativeControls";
import {
  LOCAL_MODEL_CATALOG_VERSION,
  LOCAL_MODEL_CATALOG,
  getLocalModel,
  localModelSupportsLanguages,
  type LocalModelCapability,
  type LocalModelDefinition,
  type LocalModelId,
} from "../../../constants/localModels";
import { useLocalization } from "../../../i18n";
import type { KokoroModelController } from "../../../hooks/useKokoroModel";
import {
  evaluateLocalModelEligibility,
  getLocalModelBenchmarkResults,
  probeLocalDeviceCapabilities,
  saveLocalModelBenchmarkResult,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "../../../services/localDeviceCapabilities";
import {
  downloadLocalModel,
  getLocalModelInstallStatus,
  removeLocalModel,
  type LocalModelDownloadProgress,
  type LocalModelInstallStatus,
} from "../../../services/localModelManager";
import { benchmarkLocalLlm } from "../../../services/localLlm";
import {
  benchmarkLocalStt,
  benchmarkLocalTts,
} from "../../../services/localSpeechModels";
import { verifyKokoroModel } from "../../../services/kokoroTts";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type {
  Settings,
  SpeechLanguage,
  VoicePreviewRequest,
} from "../../../types";
import { MAX_RESPONSE_MODES } from "../../../constants/providers/defaults";
import { getLocalLanguageSettingsUpdate } from "../../settings-core/onDevice";
import {
  deriveResponseModesForProvider,
  getNextResponseModeId,
} from "../../../utils/responseModes";
import { AntListenLanguageSelector } from "../AntListenLanguageSelector";
import { AntSectionIntro, AntSettingsCard } from "../AntSettingsPrimitives";
import { styles } from "../styles";
import { formatBytes } from "../../../utils/formatBytes";

type BusyAction = {
  action: "download" | "remove" | "test";
  modelId: LocalModelId;
};

const CAPABILITY_ORDER = ["llm", "stt", "tts"] as const;

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
  settings,
  kokoroModel,
  onUpdate,
  onPreviewVoice,
}: {
  settings: Settings;
  kokoroModel: KokoroModelController;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onPreviewVoice: (request: VoicePreviewRequest) => Promise<void>;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [snapshot, setSnapshot] = React.useState<LocalDeviceSnapshot | null>(
    null,
  );
  const [probeError, setProbeError] = React.useState<string | null>(null);
  const [probing, setProbing] = React.useState(true);
  const [busy, setBusy] = React.useState<BusyAction | null>(null);
  const [progress, setProgress] = React.useState<
    Partial<Record<LocalModelId, LocalModelDownloadProgress>>
  >({});
  const [installs, setInstalls] = React.useState<
    Partial<Record<LocalModelId, LocalModelInstallStatus>>
  >({});
  const [benchmarks, setBenchmarks] = React.useState<
    Partial<Record<LocalModelId, LocalModelBenchmarkResult>>
  >({});

  const refreshModelState = React.useCallback(async () => {
    const [nextInstalls, nextBenchmarks] = await Promise.all([
      Promise.all(
        LOCAL_MODEL_CATALOG.map(
          async (model) =>
            [model.id, await getLocalModelInstallStatus(model.id)] as const,
        ),
      ),
      getLocalModelBenchmarkResults(),
    ]);
    setInstalls(Object.fromEntries(nextInstalls));
    setBenchmarks(nextBenchmarks);
  }, []);

  const runDeviceProbe = React.useCallback(async () => {
    setProbing(true);
    setProbeError(null);
    try {
      setSnapshot(await probeLocalDeviceCapabilities());
    } catch (error) {
      setProbeError(error instanceof Error ? error.message : String(error));
      setSnapshot(null);
    } finally {
      setProbing(false);
    }
  }, []);

  React.useEffect(() => {
    void runDeviceProbe();
    void refreshModelState();
  }, [refreshModelState, runDeviceProbe]);

  const toggleLanguage = (language: SpeechLanguage) => {
    const nextSettings = getLocalLanguageSettingsUpdate(settings, language);
    if (nextSettings) {
      onUpdate(nextSettings);
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

  const handleDownload = async (model: LocalModelDefinition) => {
    setBusy({ action: "download", modelId: model.id });
    AccessibilityInfo.announceForAccessibility(t("downloadingShort"));
    try {
      if (model.id === "kokoro-multilingual") {
        const completed = await kokoroModel.download();
        if (!completed) {
          return;
        }
      } else {
        await downloadLocalModel(model.id, {
          onProgress: (next) =>
            setProgress((current) => ({ ...current, [model.id]: next })),
        });
      }
      await refreshModelState();
      AccessibilityInfo.announceForAccessibility(
        `${model.name}: ${t("settingsReadinessReady")}`,
      );
    } catch (error) {
      Alert.alert(
        model.name,
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setBusy(null);
      setProgress((current) => ({ ...current, [model.id]: undefined }));
    }
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
      const nextSettings: Partial<
        Omit<Settings, "apiKeys" | "providerModels">
      > = {};
      if (settings.localSttModelId === model.id) {
        nextSettings.localSttModelId = null;
        nextSettings.sttMode = "native";
      }
      if (settings.localTtsModelId === model.id) {
        nextSettings.localTtsModelId = null;
        nextSettings.ttsMode = "native";
      }
      if (model.capability === "llm") {
        let responseModes = settings.responseModes.filter(
          ({ route }) => route.localModelId !== model.id,
        );
        if (responseModes.length === 0) {
          responseModes = deriveResponseModesForProvider(
            settings.lastProvider,
            1,
          );
        }
        nextSettings.responseModes = responseModes;
        if (
          !responseModes.some(({ id }) => id === settings.activeResponseMode)
        ) {
          nextSettings.activeResponseMode = responseModes[0].id;
        }
      }
      onUpdate(nextSettings);
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

  const benchmarkKokoro = async () => {
    const device = await probeLocalDeviceCapabilities();
    const startedAt = Date.now();
    try {
      await verifyKokoroModel();
      const durationMs = Date.now() - startedAt;
      const result: LocalModelBenchmarkResult = {
        modelId: "kokoro-multilingual",
        catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
        testedAt: new Date().toISOString(),
        status:
          durationMs <=
          getLocalModel("kokoro-multilingual").benchmark.maximumLoadMs
            ? "viable"
            : "below-target",
        loadMs: durationMs,
        durationMs,
        device,
      };
      await saveLocalModelBenchmarkResult(result);
      return result;
    } catch (error) {
      const result: LocalModelBenchmarkResult = {
        modelId: "kokoro-multilingual",
        catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
        testedAt: new Date().toISOString(),
        status: "failed",
        loadMs: 0,
        durationMs: Date.now() - startedAt,
        detail: error instanceof Error ? error.message : String(error),
        device,
      };
      await saveLocalModelBenchmarkResult(result);
      return result;
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
        result = await benchmarkKokoro();
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
            text: "Hello from Mr Broccoli.",
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
    if (model.capability === "stt") {
      onUpdate({ localSttModelId: model.id, sttMode: "local" });
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
    const canUse =
      install?.verified && benchmark && benchmark.status !== "failed";

    return (
      <AntSettingsCard key={model.id} title={model.name}>
        <Text style={[localStyles.meta, { color: colors.textMuted }]}>
          {formatBytes(model.downloadBytes)} · {model.license} ·{" "}
          {t(testStatusKey(benchmark))}
        </Text>
        {downloadProgress ? (
          <Text style={[localStyles.meta, { color: colors.accent }]}>
            {Math.round(downloadProgress.progress * 100)}%
          </Text>
        ) : null}
        <View style={localStyles.actions}>
          {!install?.verified ? (
            <Button
              size="small"
              loading={modelBusy && busy?.action === "download"}
              onPress={() => void handleDownload(model)}
            >
              <Text style={{ color: colors.accent }}>{t("download")}</Text>
            </Button>
          ) : (
            <>
              <Button
                size="small"
                loading={modelBusy && busy?.action === "test"}
                onPress={() => void handleTest(model)}
              >
                <Text style={{ color: colors.accent }}>{t("test")}</Text>
              </Button>
              <Button
                size="small"
                type={isModelSelected(model) ? "ghost" : "primary"}
                disabled={!canUse || isModelSelected(model)}
                onPress={() => handleUse(model)}
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
      </AntSettingsCard>
    );
  };

  return (
    <View testID="on-device-settings-page" style={styles.sectionPageStack}>
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
        return (
          <View key={capability} style={styles.sectionGroup}>
            <AntSectionIntro title={t(capabilityTitleKey(capability))} />
            {models.map(renderModel)}
          </View>
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
