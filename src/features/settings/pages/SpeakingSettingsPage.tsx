import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "../../../design-system/NativeControls";

import { providerTtsModelSupportsInstructions } from "../../../constants/models";
import { getLocalModel } from "../../../constants/localModels";
import { getTtsFallbackRoutes } from "../../../constants/ttsFallback";
import type { KokoroModelController } from "../../../hooks/useKokoroModel";
import { useLocalization } from "../../../i18n";
import { clearProviderTtsAudioCache } from "../../../services/providerTtsAudioCache";
import type { ProviderVoiceDirectories } from "../../../services/providerVoiceDirectory";
import { useTheme } from "../../../theme/ThemeContext";
import type {
  KokoroLanguage,
  Provider,
  ReplyPlayback,
  Settings,
  TtsBackendMode,
  TtsListenLanguage,
} from "../../../types";
import { isKokoroModelReady } from "../../../utils/kokoroModelReadiness";
import { buildProviderPickerOptions } from "../../settings-core/providerPickerOptions";
import type {
  PreviewButtonPhase,
  ProviderPreviewTexts,
  TextInputFocusHandler,
} from "../../settings-core/types";

import { AntKokoroVoiceSection } from "../AntKokoroVoiceSection";
import { AntListenLanguageSelector } from "../AntListenLanguageSelector";
import { AntProviderVoiceSection } from "../AntProviderVoiceSection";
import { AntSettingsInfoButton } from "../AntSettingsInfoButton";
import {
  AntNativeVoiceSection,
  AntTtsFallbackSection,
} from "../AntTtsSections";
import {
  AntButtonLabel,
  AntPickerRow,
  AntPickerSection,
  AntRadioSection,
  AntSectionIntro,
  AntSettingsCard,
  AntSwitchRow,
  AntTextArea,
} from "../AntSettingsPrimitives";
import { styles } from "../styles";

export function SpeakingSettingsPage({
  settings,
  selectableTtsProviders,
  ttsLanguageNote,
  selectedPreviewProvider,
  selectedPreviewProviderModelOptions,
  selectedPreviewProviderModel,
  providerPreviewTexts,
  activePreview,
  nativeVoiceOptions,
  selectedNativeVoice,
  nativePreviewText,
  kokoroModel,
  kokoroPreviewTexts,
  onUpdate,
  onUpdateProviderTtsModel,
  onUpdateProviderTtsVoice,
  providerVoiceDirectories,
  onStopPreviewVoice,
  onSetProviderPreviewText,
  onSetNativePreviewText,
  onSetKokoroPreviewText,
  onPreviewProviderVoice,
  onPreviewNativeVoice,
  onPreviewKokoroVoice,
  onSelectNativeVoice,
  onTextInputFocus,
  onToggleListenLanguage,
}: {
  settings: Settings;
  selectableTtsProviders: Provider[];
  ttsLanguageNote: string | null;
  selectedPreviewProvider: Provider | null;
  selectedPreviewProviderModelOptions: { id: string; name: string }[];
  selectedPreviewProviderModel: string;
  providerPreviewTexts: ProviderPreviewTexts;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  nativeVoiceOptions: { value: string; label: string }[];
  selectedNativeVoice: string;
  nativePreviewText: string;
  kokoroModel: KokoroModelController;
  kokoroPreviewTexts: Record<KokoroLanguage, string>;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateProviderTtsModel: (provider: Provider, model: string) => void;
  onUpdateProviderTtsVoice: (provider: Provider, voice: string) => void;
  providerVoiceDirectories: ProviderVoiceDirectories;
  onStopPreviewVoice: () => Promise<void>;
  onSetProviderPreviewText: (
    provider: Provider,
    language: TtsListenLanguage,
    text: string,
  ) => void;
  onSetNativePreviewText: (text: string) => void;
  onSetKokoroPreviewText: (language: KokoroLanguage, text: string) => void;
  onPreviewProviderVoice: (
    provider: Provider,
    previewLanguage: TtsListenLanguage,
  ) => Promise<void>;
  onPreviewNativeVoice: () => Promise<void>;
  onPreviewKokoroVoice: (language: KokoroLanguage) => Promise<void>;
  onSelectNativeVoice: (voiceId: string) => void;
  onTextInputFocus: TextInputFocusHandler;
  onToggleListenLanguage: (language: TtsListenLanguage) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [isClearingSpeechCache, setIsClearingSpeechCache] = useState(false);
  const ttsProviderOptions = buildProviderPickerOptions(
    selectableTtsProviders,
    settings.ttsProvider,
    t("providerNeedsAttention"),
  );
  const instructionsSupported =
    selectedPreviewProvider !== null &&
    providerTtsModelSupportsInstructions(
      selectedPreviewProvider,
      selectedPreviewProviderModel,
    );
  const fallbackRoutes = getTtsFallbackRoutes(
    settings.ttsFallbackPolicy,
    settings.ttsMode,
  );
  const providerRouteActive =
    settings.ttsMode === "provider" || fallbackRoutes.includes("provider");
  const nativeRouteActive =
    settings.ttsMode === "native" || fallbackRoutes.includes("native");
  const kokoroRouteActive =
    settings.ttsMode === "kokoro" || fallbackRoutes.includes("kokoro");
  const kokoroModelReady = isKokoroModelReady(kokoroModel);
  const showKokoroSection =
    kokoroRouteActive ||
    kokoroModel.busy === "downloading" ||
    kokoroModel.busy === "verifying" ||
    kokoroModel.error !== null;
  const handleTtsModeChange = (value: TtsBackendMode) => {
    if (value !== "kokoro" || kokoroModelReady) {
      onUpdate({ ttsMode: value });
      return;
    }

    Alert.alert("Kokoro", t("kokoroNotInstalled"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("download"),
        onPress: () => {
          onUpdate({ ttsMode: "kokoro" });
          void kokoroModel.download();
        },
      },
    ]);
  };
  const handleClearSpeechCache = async () => {
    if (isClearingSpeechCache) {
      return;
    }

    setIsClearingSpeechCache(true);
    try {
      await clearProviderTtsAudioCache();
      Alert.alert(t("speechReplayCache"), t("speechReplayCacheCleared"));
    } catch {
      Alert.alert(t("speechReplayCache"), t("speechReplayCacheClearFailed"));
    } finally {
      setIsClearingSpeechCache(false);
    }
  };

  return (
    <View style={styles.sectionPageStack}>
      <View style={styles.sectionGroup}>
        <AntSectionIntro
          title={t("voiceOutput")}
          extra={
            <AntSettingsInfoButton
              accessibilityLabel={t("aboutSetting", {
                setting: t("voiceOutput"),
              })}
              title={t("voiceOutput")}
            >
              {t("voiceOutputDescription")}
            </AntSettingsInfoButton>
          }
        />

        <AntSettingsCard>
          <AntSwitchRow
            label={t("spokenReplies")}
            value={settings.spokenRepliesEnabled}
            onChange={(value) => onUpdate({ spokenRepliesEnabled: value })}
          />
        </AntSettingsCard>

        <AntListenLanguageSelector
          selectedLanguages={settings.ttsListenLanguages}
          onToggleLanguage={onToggleListenLanguage}
        />

        <AntRadioSection<ReplyPlayback>
          label={t("replyPlayback")}
          options={[
            {
              value: "stream",
              label: t("sentencesArrive"),
              description: t("sentencesArriveDescription"),
            },
            {
              value: "wait",
              label: t("fullReplyFirst"),
              description: t("fullReplyFirstDescription"),
            },
          ]}
          value={settings.replyPlayback}
          onChange={(value) => onUpdate({ replyPlayback: value })}
        />

        <AntRadioSection<TtsBackendMode>
          label={t("textToSpeech")}
          options={[
            {
              value: "native",
              label: t("systemVoice"),
              description: t("nativeTtsDescription"),
            },
            {
              value: "kokoro",
              label: "Kokoro",
              description: t("kokoroTtsDescription"),
            },
            {
              value: "provider",
              label: t("provider"),
              description: t("providerTtsDescription"),
            },
            {
              value: "local",
              label: t("settingsOnDevice"),
              description: t("settingsOnDeviceSummary"),
              disabled: !settings.localTtsModelId,
            },
          ]}
          value={settings.ttsMode}
          onChange={handleTtsModeChange}
        />

        <AntTtsFallbackSection settings={settings} onUpdate={onUpdate} />
      </View>

      {settings.ttsMode === "local" && settings.localTtsModelId ? (
        <AntPickerSection title={t("onDeviceSpeakingModels")}>
          <AntPickerRow
            label={t("model")}
            value={settings.localTtsModelId}
            options={[
              {
                value: settings.localTtsModelId,
                label: getLocalModel(settings.localTtsModelId).name,
              },
            ]}
            onChange={() => undefined}
          />
        </AntPickerSection>
      ) : null}

      {providerRouteActive ? (
        <>
          <AntPickerSection
            title={t("ttsProvider")}
            description={
              <View style={styles.infoModalContent}>
                <Text
                  style={[styles.helperText, { color: colors.textSecondary }]}
                >
                  {t("ttsProviderEnabledHint")}
                </Text>
                {ttsLanguageNote ? (
                  <Text
                    style={[styles.helperText, { color: colors.textSecondary }]}
                  >
                    {t("languageCoverage", { note: ttsLanguageNote })}
                  </Text>
                ) : null}
              </View>
            }
          >
            <AntPickerRow
              testID="tts-provider-picker"
              label={
                ttsProviderOptions.length > 1 ? t("ttsProvider") : undefined
              }
              value={settings.ttsProvider ?? ""}
              options={ttsProviderOptions}
              disabled={ttsProviderOptions.length === 0}
              onChange={(value) => onUpdate({ ttsProvider: value as Provider })}
            />
            {selectedPreviewProvider &&
            selectedPreviewProviderModelOptions.length > 0 ? (
              <AntPickerRow
                label={t("model")}
                value={selectedPreviewProviderModel}
                options={selectedPreviewProviderModelOptions.map((model) => ({
                  value: model.id,
                  label: model.name,
                }))}
                onChange={(value) =>
                  onUpdateProviderTtsModel(selectedPreviewProvider, value)
                }
              />
            ) : null}
          </AntPickerSection>

          <AntSettingsCard
            title={t("ttsInstructions")}
            headerExtra={
              <AntSettingsInfoButton
                accessibilityLabel={t("aboutSetting", {
                  setting: t("ttsInstructions"),
                })}
                title={t("ttsInstructions")}
              >
                {t("ttsInstructionsDescription")}
              </AntSettingsInfoButton>
            }
          >
            {!instructionsSupported ? (
              <Text
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {t("ttsInstructionsUnsupported")}
              </Text>
            ) : null}
            <AntTextArea
              value={settings.ttsInstructions}
              placeholder={t("ttsInstructionsPlaceholder")}
              disabled={!instructionsSupported}
              onFocus={onTextInputFocus}
              onChange={(value) => onUpdate({ ttsInstructions: value })}
            />
          </AntSettingsCard>

          <AntProviderVoiceSection
            provider={selectedPreviewProvider}
            selectedLanguages={settings.ttsListenLanguages}
            settings={settings}
            previewTexts={providerPreviewTexts}
            activePreview={activePreview}
            onSetPreviewText={onSetProviderPreviewText}
            onPreviewProvider={onPreviewProviderVoice}
            onStopPreview={onStopPreviewVoice}
            onUpdateProviderTtsVoice={onUpdateProviderTtsVoice}
            providerVoiceDirectories={providerVoiceDirectories}
            onTextInputFocus={onTextInputFocus}
          />
        </>
      ) : null}

      {nativeRouteActive ? (
        <AntNativeVoiceSection
          voiceOptions={nativeVoiceOptions}
          selectedVoice={selectedNativeVoice}
          previewText={nativePreviewText}
          activePreview={activePreview}
          onSelectVoice={onSelectNativeVoice}
          onSetPreviewText={onSetNativePreviewText}
          onPreview={onPreviewNativeVoice}
          onStopPreview={onStopPreviewVoice}
          onTextInputFocus={onTextInputFocus}
        />
      ) : null}

      {showKokoroSection ? (
        <AntKokoroVoiceSection
          settings={settings}
          model={kokoroModel}
          previewTexts={kokoroPreviewTexts}
          activePreview={activePreview}
          onUpdateVoice={(previewLanguage, voice) =>
            onUpdate({
              kokoroVoices: {
                ...settings.kokoroVoices,
                [previewLanguage]: voice,
              },
            })
          }
          onSetPreviewText={onSetKokoroPreviewText}
          onPreview={onPreviewKokoroVoice}
          onStopPreview={onStopPreviewVoice}
          onTextInputFocus={onTextInputFocus}
        />
      ) : null}

      <AntSettingsCard title={t("speechReplayCache")}>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("speechReplayCacheDescription")}
        </Text>
        <Button
          testID="clear-speech-replay-cache"
          size="small"
          type="ghost"
          disabled={isClearingSpeechCache}
          style={StyleSheet.flatten([
            styles.compactButton,
            { alignSelf: "flex-start", borderColor: colors.border },
          ])}
          onPress={() => {
            void handleClearSpeechCache();
          }}
          accessibilityLabel={t("clearSpeechReplayCache")}
        >
          <AntButtonLabel
            color={colors.accent}
            icon="delete"
            label={t("clearSpeechReplayCache")}
          />
        </Button>
      </AntSettingsCard>
    </View>
  );
}
