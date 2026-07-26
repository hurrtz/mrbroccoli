import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  Checkbox,
} from "@ant-design/react-native";

import {
  getTtsListenLanguageLabel,
  TTS_LISTEN_LANGUAGE_OPTIONS,
} from "../../../constants/localTts";
import { providerTtsModelSupportsInstructions } from "../../../constants/models";
import { getTtsFallbackRoutes } from "../../../constants/ttsFallback";
import type { KokoroModelController } from "../../../hooks/useKokoroModel";
import { useLocalization } from "../../../i18n";
import type { ProviderVoiceDirectories } from "../../../services/providerVoiceDirectory";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type {
  KokoroLanguage,
  Provider,
  ReplyPlayback,
  Settings,
  TtsBackendMode,
  TtsListenLanguage,
} from "../../../types";
import { buildProviderPickerOptions } from "../../settings-core/providerPickerOptions";
import type {
  PreviewButtonPhase,
  ProviderPreviewTexts,
  TextInputFocusHandler,
} from "../../settings-core/types";

import {
  AntKokoroVoiceSection,
  AntNativeVoiceSection,
  AntProviderVoiceSection,
  AntTtsFallbackSection,
} from "../AntTtsSections";
import {
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
  onSetKokoroPreviewText: (
    language: KokoroLanguage,
    text: string,
  ) => void;
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
  const { language, t } = useLocalization();
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
    settings.ttsMode === "provider" ||
    fallbackRoutes.includes("provider");
  const nativeRouteActive =
    settings.ttsMode === "native" || fallbackRoutes.includes("native");
  const kokoroRouteActive =
    settings.ttsMode === "kokoro" || fallbackRoutes.includes("kokoro");

  return (
    <View style={styles.pageStack}>
      <AntSectionIntro
        title={t("voiceOutput")}
        description={t("voiceOutputDescription")}
      />

      <AntSettingsCard>
        <AntSwitchRow
          label={t("spokenReplies")}
          description={
            settings.spokenRepliesEnabled
              ? t("spokenRepliesEnabledDescription")
              : t("spokenRepliesDisabledDescription")
          }
          value={settings.spokenRepliesEnabled}
          onChange={(value) =>
            onUpdate({ spokenRepliesEnabled: value })
          }
        />
      </AntSettingsCard>

      <AntSettingsCard>
        <Text
          accessibilityRole="header"
          style={[styles.fieldLabel, { color: colors.text }]}
        >
          {t("listenLanguages")}
        </Text>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("listenLanguagesHint")}
        </Text>
        <View style={styles.languageList}>
          {TTS_LISTEN_LANGUAGE_OPTIONS.map((entry, index) => {
            const checked = settings.ttsListenLanguages.includes(entry);
            return (
              <Checkbox.CheckboxItem
                key={entry}
                checked={checked}
                right
                onPress={() => onToggleListenLanguage(entry)}
                styles={{
                  Item: {
                    backgroundColor: colors.surfaceElevated,
                    minHeight: 46,
                  },
                  Line: {
                    borderBottomWidth:
                      index === TTS_LISTEN_LANGUAGE_OPTIONS.length - 1
                        ? 0
                        : StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                  Content: {
                    color: colors.text,
                    fontFamily: fonts.body,
                    fontSize: 15,
                  },
                }}
              >
                {getTtsListenLanguageLabel(entry, language)}
              </Checkbox.CheckboxItem>
            );
          })}
        </View>
      </AntSettingsCard>

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
        ]}
        value={settings.ttsMode}
        onChange={(value) => onUpdate({ ttsMode: value })}
      />

      <AntTtsFallbackSection settings={settings} onUpdate={onUpdate} />

      {providerRouteActive ? (
        <>
          <AntPickerSection
            helperText={
              ttsLanguageNote
                ? t("languageCoverage", { note: ttsLanguageNote })
                : undefined
            }
          >
            <AntPickerRow
              label={t("ttsProvider")}
              value={settings.ttsProvider ?? ""}
              options={ttsProviderOptions}
              disabled={ttsProviderOptions.length === 0}
              onChange={(value) =>
                onUpdate({ ttsProvider: value as Provider })
              }
            />
            {selectedPreviewProvider &&
            selectedPreviewProviderModelOptions.length > 1 ? (
              <AntPickerRow
                label={t("model")}
                value={selectedPreviewProviderModel}
                options={selectedPreviewProviderModelOptions.map((model) => ({
                  value: model.id,
                  label: model.name,
                }))}
                onChange={(value) =>
                  onUpdateProviderTtsModel(
                    selectedPreviewProvider,
                    value,
                  )
                }
              />
            ) : null}
          </AntPickerSection>

          <AntSettingsCard>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              {t("ttsInstructions")}
            </Text>
            <Text
              style={[styles.helperText, { color: colors.textSecondary }]}
            >
              {t(
                instructionsSupported
                  ? "ttsInstructionsDescription"
                  : "ttsInstructionsUnsupported",
              )}
            </Text>
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

      {kokoroRouteActive ? (
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
    </View>
  );
}
