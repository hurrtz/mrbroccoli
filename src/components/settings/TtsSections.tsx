import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { getTtsListenLanguageLabel } from "../../constants/localTts";
import {
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LABELS,
  getProviderTtsVoiceOptions,
  providerRequiresTtsVoice,
  providerUsesTtsVoiceDirectory,
} from "../../constants/models";
import { useLocalization } from "../../i18n";
import { Provider, Settings, TtsListenLanguage } from "../../types";
import { useTheme } from "../../theme/ThemeContext";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import { Picker } from "../Picker";

import { PreviewComposer } from "./shared";
import { styles } from "./styles";
import {
  PreviewButtonPhase,
  ProviderPreviewTexts,
  TextInputFocusHandler,
} from "./types";

export function ProviderVoicePreviewSection({
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
  const { t, language } = useLocalization();

  if (!provider) {
    return null;
  }

  const voiceDirectory = providerVoiceDirectories[provider];
  const hasVoiceDirectory = providerUsesTtsVoiceDirectory(provider);
  const voiceOptions =
    hasVoiceDirectory
      ? (
          voiceDirectory?.voices.length
            ? voiceDirectory.voices
            : getProviderTtsVoiceOptions(provider, language)
        ).map((voice) => ({
          value:
            "value" in voice && typeof voice.value === "string"
              ? voice.value
              : voice.id,
          label: voice.label,
        }))
      : getProviderTtsVoiceOptions(provider, language).map((voice) => ({
          value: voice.id,
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

  return (
    <View
      style={[
        styles.voicePreviewSection,
        { borderTopColor: colors.border },
      ]}
    >
      <View style={styles.voicePreviewHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.groupLabel, { color: colors.text }]}
        >
          {t("providerVoicePreviews")}
        </Text>
        <Text
          style={[
            styles.sectionHint,
            styles.voicePreviewHeaderHint,
            { color: colors.textMuted },
          ]}
        >
          {t("providerVoicePreviewsHint")}
        </Text>
      </View>

      <View>
        <Text
          accessibilityRole="header"
          style={[styles.voicePreviewProvider, { color: colors.text }]}
        >
          {PROVIDER_LABELS[provider]}
        </Text>
        {hasVoiceDirectory && voiceDirectory ? (
          <View style={styles.providerVoiceDirectoryHeader}>
            <View style={styles.providerVoiceDirectoryCopy}>
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                {t("providerVoiceDirectory", {
                  provider: PROVIDER_LABELS[provider],
                })}
              </Text>
              <Text style={[styles.previewHint, { color: colors.textMuted }]}>
                {voiceDirectory.status === "ready"
                  ? t("providerVoicesAvailable", {
                      count: voiceDirectory.voices.length,
                      provider: PROVIDER_LABELS[provider],
                    })
                  : voiceDirectory.status === "error" && voiceDirectory.error
                    ? t("providerVoicesLoadFailed")
                    : t("providerVoicesLoadingHint", {
                        provider: PROVIDER_LABELS[provider],
                      })}
              </Text>
            </View>
            <TouchableOpacity
              testID={`${provider}-voices-refresh`}
              accessibilityRole="button"
              accessibilityLabel={t("refreshProviderVoices", {
                provider: PROVIDER_LABELS[provider],
              })}
              disabled={voiceDirectoryBusy}
              onPress={() => {
                void voiceDirectory.refresh();
              }}
              style={[
                styles.providerVoiceRefreshButton,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  opacity: voiceDirectoryBusy ? 0.6 : 1,
                },
              ]}
            >
              {voiceDirectoryBusy ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Feather name="refresh-cw" size={15} color={colors.accent} />
              )}
              <Text
                style={[
                  styles.providerVoiceRefreshLabel,
                  { color: colors.accent },
                ]}
              >
                {t("refresh")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {voiceOptions.length > 0 ? (
          <Picker
            label={t("ttsVoice")}
            value={selectedVoice}
            options={voiceOptions}
            onChange={(value) => onUpdateProviderTtsVoice(provider, value)}
          />
        ) : hasVoiceDirectory && !voiceDirectoryBusy ? (
          <View style={styles.settingsSubsectionStack}>
            <Text
              style={[styles.previewLabel, { color: colors.textSecondary }]}
            >
              {t("providerVoiceId")}
            </Text>
            <TextInput
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
              style={[
                styles.apiKeyInput,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  color: colors.text,
                  paddingRight: 14,
                },
              ]}
            />
            <Text
              style={[
                styles.previewHint,
                { color: selectedVoice ? colors.textMuted : colors.danger },
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
        ) : hasVoiceDirectory ? null : (
          <Text
            style={[
              styles.previewHint,
              { color: colors.textMuted, marginTop: 0 },
            ]}
          >
            {t("providerDefaultVoiceHint")}
          </Text>
        )}

        {selectedLanguages.map((entry) => {
          const previewId = `provider:${provider}:${entry}`;

          return (
            <View
              key={`${provider}:${entry}`}
              style={[
                styles.previewLanguageBlock,
                { borderTopColor: colors.border },
              ]}
            >
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                {getTtsListenLanguageLabel(entry, language)}
              </Text>
              <PreviewComposer
                text={previewTexts[provider][entry]}
                setText={(text) => onSetPreviewText(provider, entry, text)}
                phase={
                  activePreview?.id === previewId ? activePreview.phase : "idle"
                }
                interactionDisabled={
                  (activePreview !== null &&
                    activePreview.id !== previewId) ||
                  (providerRequiresTtsVoice(provider) && !selectedVoice)
                }
                onPreview={() => onPreviewProvider(provider, entry)}
                onStop={onStopPreview}
                onTextInputFocus={onTextInputFocus}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function NativeVoicePreviewSection({
  voiceOptions,
  selectedVoice,
  previewText,
  activePreview,
  onSelectVoice,
  onSetPreviewText,
  onPreview,
  onStopPreview,
  onTextInputFocus,
}: {
  voiceOptions: { value: string; label: string }[];
  selectedVoice: string;
  previewText: string;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  onSelectVoice: (voiceId: string) => void;
  onSetPreviewText: (text: string) => void;
  onPreview: () => Promise<void>;
  onStopPreview: () => Promise<void>;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <View
      style={[
        styles.voicePreviewSection,
        { borderTopColor: colors.border },
      ]}
    >
      <View style={styles.voicePreviewHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.groupLabel, { color: colors.text }]}
        >
          {t("nativeVoicePreviewSection")}
        </Text>
        <Text
          style={[
            styles.sectionHint,
            styles.voicePreviewHeaderHint,
            { color: colors.textMuted },
          ]}
        >
          {t("nativeVoicePreviewSectionHint")}
        </Text>
      </View>

      <View>
        {voiceOptions.length > 0 ? (
          <>
            <Picker
              label={t("ttsVoice")}
              value={selectedVoice}
              options={voiceOptions}
              onChange={onSelectVoice}
            />
            <View
              style={[
                styles.previewLanguageBlock,
                { borderTopColor: colors.border },
              ]}
            >
              <PreviewComposer
                text={previewText}
                setText={onSetPreviewText}
                phase={
                  activePreview?.id === "native"
                    ? activePreview.phase
                    : "idle"
                }
                interactionDisabled={
                  activePreview !== null && activePreview.id !== "native"
                }
                onPreview={onPreview}
                onStop={onStopPreview}
                onTextInputFocus={onTextInputFocus}
              />
            </View>
          </>
        ) : (
          <Text
            style={[
              styles.previewHint,
              { color: colors.textMuted, marginTop: 0 },
            ]}
          >
            {t("nativeVoiceUnavailable")}
          </Text>
        )}
      </View>
    </View>
  );
}
