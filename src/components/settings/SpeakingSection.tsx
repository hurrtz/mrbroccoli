import {
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { providerTtsModelSupportsInstructions } from "../../constants/models";
import { useLocalization } from "../../i18n";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import type {
  KokoroLanguage,
  Provider,
  ReplyPlayback,
  Settings,
  TtsBackendMode,
  TtsListenLanguage,
} from "../../types";
import type { KokoroModelController } from "../../hooks/useKokoroModel";
import { useTheme } from "../../theme/ThemeContext";
import { Picker } from "../Picker";

import { buildProviderPickerOptions } from "./providerPickerOptions";
import {
  ListenLanguageSelector,
  PickerSection,
  RadioGroup,
} from "./shared";
import { styles } from "./styles";
import {
  KokoroVoiceSection,
  NativeVoicePreviewSection,
  ProviderVoicePreviewSection,
} from "./TtsSections";
import type {
  PreviewButtonPhase,
  ProviderPreviewTexts,
  TextInputFocusHandler,
} from "./types";

export function SpeakingSection({
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
  const { t } = useLocalization();
  const ttsProviderOptions = buildProviderPickerOptions(
    selectableTtsProviders,
    settings.ttsProvider,
    t("providerNeedsAttention"),
  );
  const ttsInstructionsSupported =
    selectedPreviewProvider !== null &&
    providerTtsModelSupportsInstructions(
      selectedPreviewProvider,
      selectedPreviewProviderModel,
    );

  return (
    <View style={styles.tabPane}>
      <View style={styles.settingsSubsectionIntro}>
        <Text
          accessibilityRole="header"
          style={[styles.settingsSectionTitle, { color: colors.text }]}
        >
          {t("voiceOutput")}
        </Text>
        <Text
          style={[
            styles.settingsSectionDescription,
            { color: colors.textSecondary },
          ]}
        >
          {t("voiceOutputDescription")}
        </Text>
      </View>

      <View style={styles.settingsSubsectionStack}>
        <View style={styles.inlineSwitchRow}>
          <View style={styles.inlineSwitchCopy}>
            <Text
              accessibilityRole="header"
              style={[styles.groupLabel, { color: colors.text }]}
            >
              {t("spokenReplies")}
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              {settings.spokenRepliesEnabled
                ? t("spokenRepliesEnabledDescription")
                : t("spokenRepliesDisabledDescription")}
            </Text>
          </View>
          <Switch
            value={settings.spokenRepliesEnabled}
            onValueChange={(value) => onUpdate({ spokenRepliesEnabled: value })}
            trackColor={{
              false: colors.border,
              true: colors.accent,
            }}
            thumbColor={colors.surface}
          />
        </View>

        <ListenLanguageSelector
          selectedLanguages={settings.ttsListenLanguages}
          onToggleLanguage={onToggleListenLanguage}
        />

        <RadioGroup<ReplyPlayback>
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

        <RadioGroup<TtsBackendMode>
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

        {settings.ttsMode === "provider" ? (
          <>
            <PickerSection>
              <Picker
                label={t("ttsProvider")}
                value={settings.ttsProvider ?? ""}
                options={ttsProviderOptions}
                disabled={ttsProviderOptions.length === 0}
                onChange={(value) => onUpdate({ ttsProvider: value as Provider })}
              />
              {selectedPreviewProvider &&
              selectedPreviewProviderModelOptions.length > 1 ? (
                <Picker
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
              {ttsLanguageNote ? (
                <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                  {t("languageCoverage", { note: ttsLanguageNote })}
                </Text>
              ) : null}
            </PickerSection>

            <View style={styles.settingsSubsectionStack}>
              <Text style={[styles.groupLabel, { color: colors.text }]}>
                {t("ttsInstructions")}
              </Text>
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {t(
                  ttsInstructionsSupported
                    ? "ttsInstructionsDescription"
                    : "ttsInstructionsUnsupported",
                )}
              </Text>
              <TextInput
                value={settings.ttsInstructions}
                onChangeText={(value) => onUpdate({ ttsInstructions: value })}
                editable={ttsInstructionsSupported}
                multiline
                placeholder={t("ttsInstructionsPlaceholder")}
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.accent}
                textAlignVertical="top"
                onFocus={onTextInputFocus}
                style={[
                  styles.promptInput,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    color: colors.text,
                    opacity: ttsInstructionsSupported ? 1 : 0.55,
                  },
                ]}
              />
            </View>

            <ProviderVoicePreviewSection
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

        {settings.ttsMode === "native" ? (
          <NativeVoicePreviewSection
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

        {settings.ttsMode === "kokoro" ? (
          <KokoroVoiceSection
            settings={settings}
            model={kokoroModel}
            previewTexts={kokoroPreviewTexts}
            activePreview={activePreview}
            onUpdateVoice={(language, voice) =>
              onUpdate({
                kokoroVoices: {
                  ...settings.kokoroVoices,
                  [language]: voice,
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
    </View>
  );
}
