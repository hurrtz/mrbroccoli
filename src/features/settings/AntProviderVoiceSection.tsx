import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button, Input } from "../../design-system/NativeControls";

import { getTtsListenLanguageLabel } from "../../constants/localTts";
import {
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LABELS,
  getProviderTtsVoiceOptions,
  providerRequiresTtsVoice,
  providerUsesTtsVoiceDirectory,
} from "../../constants/models";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { Provider, Settings, TtsListenLanguage } from "../../types";
import type {
  PreviewButtonPhase,
  ProviderPreviewTexts,
  TextInputFocusHandler,
} from "../settings-core/types";

import { AntPreviewComposer } from "./AntPreviewComposer";
import { AntSettingsInfoButton } from "./AntSettingsInfoButton";
import {
  AntButtonLabel,
  AntDisclosureCard,
  AntPickerRow,
  AntSectionIntro,
  AntSettingsCard,
} from "./AntSettingsPrimitives";
import { styles } from "./styles";

function isElevenLabsVoiceReadPermissionError(error: Error) {
  const normalizedMessage = error.message.toLowerCase();
  return (
    normalizedMessage.includes("voices_read") ||
    normalizedMessage.includes("voice read")
  );
}

export function AntProviderVoiceSection({
  provider,
  selectedLanguages,
  settings,
  previewTexts,
  activePreview,
  onSetPreviewText,
  onPreviewProvider,
  onStopPreview,
  onUpdateProviderTtsVoice,
  providerVoiceDirectories,
  onTextInputFocus,
}: {
  provider: Provider | null;
  selectedLanguages: TtsListenLanguage[];
  settings: Settings;
  previewTexts: ProviderPreviewTexts;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  onSetPreviewText: (
    provider: Provider,
    previewLanguage: TtsListenLanguage,
    text: string,
  ) => void;
  onPreviewProvider: (
    provider: Provider,
    previewLanguage: TtsListenLanguage,
  ) => Promise<void>;
  onStopPreview: () => Promise<void>;
  onUpdateProviderTtsVoice: (provider: Provider, voice: string) => void;
  providerVoiceDirectories: ProviderVoiceDirectories;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const [expandedLanguage, setExpandedLanguage] =
    React.useState<TtsListenLanguage | null>(null);

  if (!provider) {
    return null;
  }

  const voiceDirectory = providerVoiceDirectories[provider];
  const hasVoiceDirectory = providerUsesTtsVoiceDirectory(provider);
  const selectedModel =
    settings.providerTtsModels[provider] ||
    PROVIDER_DEFAULT_TTS_MODELS[provider] ||
    "";
  const fallbackVoiceOptions = getProviderTtsVoiceOptions(
    provider,
    language,
    selectedModel,
  );
  const voiceOptions = (
    hasVoiceDirectory
      ? voiceDirectory?.voices.length
        ? voiceDirectory.voices
        : fallbackVoiceOptions
      : fallbackVoiceOptions
  ).map((voice) => ({
    value:
      "value" in voice && typeof voice.value === "string"
        ? voice.value
        : voice.id,
    label: voice.label,
  }));
  const selectedVoice =
    settings.providerTtsVoices[provider] ||
    PROVIDER_DEFAULT_TTS_VOICES[provider] ||
    voiceOptions[0]?.value ||
    "";
  const voiceDirectoryBusy =
    voiceDirectory?.status === "loading" ||
    voiceDirectory?.status === "refreshing";
  const voiceDirectoryStatus =
    hasVoiceDirectory && voiceDirectory ? (
      <View style={styles.statusRow}>
        <View style={styles.statusCopy}>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("providerVoiceDirectory", {
              provider: PROVIDER_LABELS[provider],
            })}
          </Text>
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.helperText, { color: colors.textMuted }]}
          >
            {voiceDirectory.status === "ready"
              ? t("providerVoicesAvailable", {
                  count: voiceDirectory.voices.length,
                  provider: PROVIDER_LABELS[provider],
                })
              : voiceDirectory.status === "error"
                ? t(
                    fallbackVoiceOptions.length > 0
                      ? "providerVoicesLoadFailedWithFallback"
                      : "providerVoicesLoadFailed",
                  )
                : t("providerVoicesLoadingHint", {
                    provider: PROVIDER_LABELS[provider],
                  })}
          </Text>
          {voiceDirectory.status === "error" && voiceDirectory.error ? (
            <>
              <Text style={[styles.helperText, { color: colors.danger }]}>
                {t("providerVoicesErrorDetail", {
                  detail: voiceDirectory.error.message,
                })}
              </Text>
              {provider === "elevenlabs" &&
              isElevenLabsVoiceReadPermissionError(voiceDirectory.error) ? (
                <Text
                  style={[styles.helperText, { color: colors.textSecondary }]}
                >
                  {t("elevenLabsVoicesReadPermissionHint")}
                </Text>
              ) : null}
            </>
          ) : null}
        </View>
        <Button
          testID={`${provider}-voices-refresh`}
          size="small"
          type="ghost"
          loading={voiceDirectoryBusy}
          disabled={voiceDirectoryBusy}
          style={StyleSheet.flatten([
            styles.compactButton,
            { borderColor: colors.border },
          ])}
          onPress={() => {
            void voiceDirectory.refresh();
          }}
          accessibilityLabel={t("refreshProviderVoices", {
            provider: PROVIDER_LABELS[provider],
          })}
        >
          <AntButtonLabel
            color={colors.accent}
            icon="reload"
            label={t("refresh")}
          />
        </Button>
      </View>
    ) : null;

  return (
    <View style={styles.sectionGroup}>
      <AntSectionIntro
        title={t("providerVoicePreviews")}
        extra={
          <AntSettingsInfoButton
            accessibilityLabel={t("aboutSetting", {
              setting: t("providerVoicePreviews"),
            })}
            title={t("providerVoicePreviews")}
          >
            {t("providerVoicePreviewsHint")}
          </AntSettingsInfoButton>
        }
      />

      {voiceDirectoryStatus ? (
        <AntSettingsCard title={PROVIDER_LABELS[provider]}>
          {voiceDirectoryStatus}
        </AntSettingsCard>
      ) : null}

      {voiceOptions.length > 0 ? (
        <AntPickerRow
          testID={`provider-tts-voice-picker-${provider}`}
          standalone
          label={t("ttsVoice")}
          value={selectedVoice}
          options={voiceOptions}
          onChange={(value) => onUpdateProviderTtsVoice(provider, value)}
        />
      ) : hasVoiceDirectory && !voiceDirectoryBusy ? (
        <AntSettingsCard title={PROVIDER_LABELS[provider]}>
          <View style={{ gap: 8 }}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {t("providerVoiceId")}
            </Text>
            <Input
              value={selectedVoice}
              onChangeText={(value) =>
                onUpdateProviderTtsVoice(provider, value.trim())
              }
              onFocus={onTextInputFocus}
              placeholder={t("providerVoiceIdPlaceholder")}
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.accent}
              autoCapitalize="none"
              autoCorrect={false}
              allowClear={{
                clearIcon: (
                  <PhosphorIcon
                    name="close"
                    size="inline"
                    color={colors.onPrimary}
                  />
                ),
              }}
              inputStyle={{
                color: colors.text,
                fontFamily: fonts.body,
                fontSize: 15,
                lineHeight: 21,
                paddingHorizontal: 12,
              }}
              styles={{
                container: {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 10,
                  minHeight: 46,
                },
              }}
            />
            <Text
              style={[
                styles.helperText,
                { color: selectedVoice ? colors.textSecondary : colors.danger },
              ]}
            >
              {t(
                selectedVoice
                  ? "providerVoiceIdFallbackHint"
                  : "providerVoiceIdRequired",
                { provider: PROVIDER_LABELS[provider] },
              )}
            </Text>
          </View>
        </AntSettingsCard>
      ) : hasVoiceDirectory ? null : (
        <AntSettingsCard title={PROVIDER_LABELS[provider]}>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("providerDefaultVoiceHint")}
          </Text>
        </AntSettingsCard>
      )}

      <View style={styles.kokoroVoiceCards}>
        {selectedLanguages.map((previewLanguage) => {
          const languageLabel = getTtsListenLanguageLabel(
            previewLanguage,
            language,
          );
          const previewId = `provider:${provider}:${previewLanguage}`;
          const expanded = expandedLanguage === previewLanguage;

          return (
            <AntDisclosureCard
              key={`${provider}:${previewLanguage}`}
              testID={`provider-language-card-${provider}-${previewLanguage}`}
              expanded={expanded}
              onToggle={() =>
                setExpandedLanguage(expanded ? null : previewLanguage)
              }
              toggleAccessibilityLabel={t(
                expanded ? "collapseVoiceSettings" : "expandVoiceSettings",
                { language: languageLabel },
              )}
              header={
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  {languageLabel}
                </Text>
              }
              contentStyle={styles.fullBleedCardContent}
            >
              <View style={styles.disclosurePreview}>
                <AntPreviewComposer
                  text={previewTexts[provider][previewLanguage]}
                  setText={(text) =>
                    onSetPreviewText(provider, previewLanguage, text)
                  }
                  phase={
                    activePreview?.id === previewId
                      ? activePreview.phase
                      : "idle"
                  }
                  interactionDisabled={
                    (activePreview !== null &&
                      activePreview.id !== previewId) ||
                    (providerRequiresTtsVoice(provider) && !selectedVoice)
                  }
                  onPreview={() => onPreviewProvider(provider, previewLanguage)}
                  onStop={onStopPreview}
                  onTextInputFocus={onTextInputFocus}
                />
              </View>
            </AntDisclosureCard>
          );
        })}
      </View>
    </View>
  );
}
