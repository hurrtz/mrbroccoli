import React from "react";
import { Alert, Text, View } from "react-native";

import { Button } from "@ant-design/react-native";

import {
  KOKORO_MODEL_DOWNLOAD_BYTES,
  KOKORO_MODEL_INSTALLED_BYTES,
  getKokoroVoiceOptions,
  getTtsListenLanguageForKokoro,
} from "../../constants/kokoro";
import { getTtsListenLanguageLabel } from "../../constants/localTts";
import { antButtonTypography } from "../../design-system/antTypography";
import { IconButton } from "../../design-system/IconButton";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type { KokoroModelController } from "../../hooks/useKokoroModel";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { KokoroLanguage, Settings } from "../../types";
import type {
  PreviewButtonPhase,
  TextInputFocusHandler,
} from "../settings-core/types";

import { AntPreviewComposer } from "./AntPreviewComposer";
import { AntSettingsInfoButton } from "./AntSettingsInfoButton";
import {
  AntButtonLabel,
  AntDisclosureCard,
  AntPickerRow,
  AntPickerRows,
  AntSectionIntro,
  AntSettingsCard,
} from "./AntSettingsPrimitives";
import { styles } from "./styles";

const KOKORO_LANGUAGES: KokoroLanguage[] = ["en", "zh"];

export function AntKokoroVoiceSection({
  settings,
  model,
  previewTexts,
  activePreview,
  onUpdateVoice,
  onSetPreviewText,
  onPreview,
  onStopPreview,
  onTextInputFocus,
}: {
  settings: Settings;
  model: KokoroModelController;
  previewTexts: Record<KokoroLanguage, string>;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  onUpdateVoice: (language: KokoroLanguage, voice: string) => void;
  onSetPreviewText: (language: KokoroLanguage, text: string) => void;
  onPreview: (language: KokoroLanguage) => Promise<void>;
  onStopPreview: () => Promise<void>;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { language: appLanguage, t } = useLocalization();
  const [expandedLanguage, setExpandedLanguage] =
    React.useState<KokoroLanguage | null>(null);
  const progressPercent = Math.round(model.progress * 100);
  const downloadSize = Math.round(KOKORO_MODEL_DOWNLOAD_BYTES / 1024 / 1024);
  const installedSize = Math.round(KOKORO_MODEL_INSTALLED_BYTES / 1024 / 1024);
  const selectedKokoroLanguages = KOKORO_LANGUAGES.filter((language) =>
    settings.ttsListenLanguages.includes(
      getTtsListenLanguageForKokoro(language),
    ),
  );
  const unsupportedLanguageLabels = settings.ttsListenLanguages
    .filter(
      (language) => !KOKORO_LANGUAGES.includes(language as KokoroLanguage),
    )
    .map((language) => getTtsListenLanguageLabel(language, appLanguage));
  const statusText = model.error
    ? model.error
    : model.busy === "downloading"
      ? t(
          model.phase === "extracting"
            ? "kokoroExtracting"
            : "kokoroDownloading",
          { progress: progressPercent },
        )
      : model.busy === "verifying"
        ? t("kokoroVerifying")
        : model.busy === "checking"
          ? t("kokoroChecking")
          : model.installed
            ? t("kokoroInstalled")
            : t("kokoroNotInstalled");

  const handleRemove = () => {
    Alert.alert(
      t("kokoroRemoveTitle"),
      t("kokoroRemoveBody", { installedSize }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("remove"),
          style: "destructive",
          onPress: () => {
            void model.remove();
          },
        },
      ],
    );
  };

  return (
    <View testID="kokoro-voice-section" style={styles.sectionGroup}>
      <AntSectionIntro
        title={t("kokoroVoices")}
        extra={
          <AntSettingsInfoButton
            accessibilityLabel={t("aboutSetting", {
              setting: t("kokoroVoices"),
            })}
            title={t("kokoroVoices")}
          >
            <View style={styles.infoModalContent}>
              <Text
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {t("kokoroVoicesHint", { size: downloadSize, installedSize })}
              </Text>
              <Text
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {t("kokoroLanguageFallback")}
              </Text>
            </View>
          </AntSettingsInfoButton>
        }
      />

      <AntSettingsCard
        title={t("kokoroModel")}
        headerExtra={
          model.installed ? (
            <IconButton
              accessibilityLabel={t("removeKokoroModel")}
              iconNode={
                <PhosphorIcon
                  name="delete"
                  size="control"
                  color={colors.danger}
                />
              }
              onPress={handleRemove}
            />
          ) : null
        }
      >
        <Text
          testID="kokoro-model-status"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          style={[
            styles.helperText,
            {
              color: model.error
                ? colors.danger
                : model.installed
                  ? colors.success
                  : colors.textSecondary,
            },
          ]}
        >
          {statusText}
        </Text>
        {!model.installed ? (
          <Button
            type="primary"
            loading={model.busy !== null}
            disabled={model.busy !== null}
            style={styles.kokoroDownloadButton}
            styles={antButtonTypography}
            accessibilityLabel={t("downloadKokoroModel")}
            accessibilityValue={
              model.busy === "downloading"
                ? {
                    min: 0,
                    max: 100,
                    now: progressPercent,
                  }
                : undefined
            }
            onPress={() => {
              void model.download();
            }}
          >
            <AntButtonLabel
              color={colors.onActiveControl}
              icon="download"
              label={t("download")}
            />
          </Button>
        ) : null}
      </AntSettingsCard>

      {unsupportedLanguageLabels.length > 0 ? (
        <View
          testID="kokoro-fallback-notice"
          style={[
            styles.kokoroFallbackNotice,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
        >
          <PhosphorIcon
            name="exclamation-circle"
            size="compact"
            color={colors.textSecondary}
          />
          <Text
            style={[
              styles.connectionImprintText,
              styles.kokoroFallbackCopy,
              { color: colors.textSecondary },
            ]}
          >
            {t("kokoroFallbackNeeded", {
              languages: unsupportedLanguageLabels.join(", "),
            })}
          </Text>
        </View>
      ) : null}

      {selectedKokoroLanguages.length > 0 ? (
        <View style={styles.kokoroVoiceCards}>
          {selectedKokoroLanguages.map((previewLanguage) => {
            const languageLabel = getTtsListenLanguageLabel(
              getTtsListenLanguageForKokoro(previewLanguage),
              appLanguage,
            );
            const voiceOptions = getKokoroVoiceOptions(
              previewLanguage,
              appLanguage,
            );
            const selectedVoice = settings.kokoroVoices[previewLanguage];
            const selectedVoiceLabel =
              voiceOptions.find((voice) => voice.value === selectedVoice)
                ?.label ?? selectedVoice;
            const previewId = `kokoro:${previewLanguage}`;
            const expanded = expandedLanguage === previewLanguage;

            return (
              <AntDisclosureCard
                key={previewLanguage}
                testID={`kokoro-language-card-${previewLanguage}`}
                expanded={expanded}
                onToggle={() =>
                  setExpandedLanguage(expanded ? null : previewLanguage)
                }
                toggleAccessibilityLabel={t(
                  expanded ? "collapseVoiceSettings" : "expandVoiceSettings",
                  { language: languageLabel },
                )}
                header={
                  <View style={styles.voiceDisclosureHeader}>
                    <Text style={[styles.fieldLabel, { color: colors.text }]}>
                      {languageLabel}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.connectionImprintText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {selectedVoiceLabel}
                    </Text>
                  </View>
                }
                contentStyle={styles.fullBleedCardContent}
              >
                <AntPickerRows>
                  <AntPickerRow
                    label={t("ttsVoice")}
                    value={selectedVoice}
                    options={voiceOptions}
                    onChange={(voice) => onUpdateVoice(previewLanguage, voice)}
                  />
                </AntPickerRows>
                <View style={styles.disclosurePreview}>
                  <AntPreviewComposer
                    text={previewTexts[previewLanguage]}
                    setText={(text) => onSetPreviewText(previewLanguage, text)}
                    phase={
                      activePreview?.id === previewId
                        ? activePreview.phase
                        : "idle"
                    }
                    interactionDisabled={
                      !model.installed ||
                      (activePreview !== null && activePreview.id !== previewId)
                    }
                    onPreview={() => onPreview(previewLanguage)}
                    onStop={onStopPreview}
                    onTextInputFocus={onTextInputFocus}
                  />
                </View>
              </AntDisclosureCard>
            );
          })}
        </View>
      ) : (
        <AntSettingsCard>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("kokoroNoSelectedLanguages")}
          </Text>
        </AntSettingsCard>
      )}
    </View>
  );
}
