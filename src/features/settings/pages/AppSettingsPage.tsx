import React from "react";
import { Text, View } from "react-native";

import { Modal } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";

import { getTtsListenLanguageLabel } from "../../../constants/localTts";
import { AntIconButton } from "../../../design-system/AntIconButton";
import { useLocalization } from "../../../i18n";
import {
  clearSpeechDiagnostics,
  type SpeechDiagnosticRoute,
  type SpeechDiagnosticRequestSummary,
} from "../../../services/speech/diagnostics";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type { AppLanguage, Settings, ThemeMode } from "../../../types";

import {
  AntPickerRow,
  AntRadioSection,
  AntSectionIntro,
  AntSettingsCard,
} from "../AntSettingsPrimitives";
import { AntSettingsInfoButton } from "../AntSettingsInfoButton";
import { styles } from "../styles";

function getSpeechRouteLabel(
  route: SpeechDiagnosticRoute | null,
  t: ReturnType<typeof useLocalization>["t"],
) {
  if (route === "local" || route === "kokoro") {
    return t("localTts");
  }
  if (route === "provider") {
    return t("provider");
  }
  if (route === "native") {
    return t("appNative");
  }
  return "—";
}

function getSpeechSourceLabel(
  source: SpeechDiagnosticRequestSummary["source"],
  t: ReturnType<typeof useLocalization>["t"],
) {
  switch (source) {
    case "conversation":
      return t("speechDiagnosticSourceConversation");
    case "repeat":
      return t("speechDiagnosticSourceRepeat");
    case "preview":
      return t("speechDiagnosticSourcePreview");
    default:
      return t("speechDiagnosticSourceUnknown");
  }
}

function formatSpeechDiagnosticTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AppSettingsPage({
  settings,
  speechDiagnostics,
  onUpdate,
}: {
  settings: Settings;
  speechDiagnostics: SpeechDiagnosticRequestSummary[];
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const [clearConfirmationVisible, setClearConfirmationVisible] =
    React.useState(false);
  const handleClear = React.useCallback(() => {
    setClearConfirmationVisible(true);
  }, []);

  return (
    <View style={styles.sectionPageStack}>
      <View style={styles.sectionGroup}>
        <AntRadioSection<ThemeMode>
          label={t("theme")}
          options={[
            { value: "light", label: t("light") },
            { value: "dark", label: t("dark") },
            { value: "system", label: t("system") },
          ]}
          value={settings.theme}
          onChange={(value) => onUpdate({ theme: value })}
        />
        <AntPickerRow
          testID="app-language-picker"
          standalone
          label={t("language")}
          value={settings.language}
          options={[
            { value: "en", label: t("english") },
            { value: "de", label: t("german") },
            { value: "uk", label: t("ukrainian") },
            { value: "hi", label: t("hindi") },
            { value: "es", label: t("spanish") },
            { value: "fr", label: t("french") },
            { value: "it", label: t("italian") },
            { value: "pt", label: t("portuguese") },
            { value: "pt-BR", label: t("portugueseBrazil") },
            { value: "ru", label: t("russian") },
            { value: "zh-CN", label: t("simplifiedChinese") },
          ]}
          onChange={(value) => onUpdate({ language: value as AppLanguage })}
        />
        <AntRadioSection<"show" | "hide">
          label={t("usageStats")}
          options={[
            {
              value: "hide",
              label: t("hide"),
              description: t("usageStatsHiddenDescription"),
            },
            {
              value: "show",
              label: t("show"),
              description: t("usageStatsVisibleDescription"),
            },
          ]}
          value={settings.showUsageStats ? "show" : "hide"}
          onChange={(value) => onUpdate({ showUsageStats: value === "show" })}
        />
        <AntRadioSection<"show" | "hide">
          label={t("debugLogButton")}
          options={[
            {
              value: "hide",
              label: t("hide"),
              description: t("debugLogButtonHiddenDescription"),
            },
            {
              value: "show",
              label: t("show"),
              description: t("debugLogButtonVisibleDescription"),
            },
          ]}
          value={settings.showDebugLogButton ? "show" : "hide"}
          onChange={(value) =>
            onUpdate({ showDebugLogButton: value === "show" })
          }
          helperText={t("debugLogButtonUsageDescription")}
        />
      </View>

      <View testID="speech-diagnostics-section" style={styles.sectionGroup}>
        <AntSectionIntro
          title={t("speechDiagnostics")}
          extra={
            <View style={styles.sectionIntroActions}>
              <AntSettingsInfoButton
                accessibilityLabel={t("aboutSetting", {
                  setting: t("speechDiagnostics"),
                })}
                title={t("speechDiagnostics")}
              >
                {t("speechDiagnosticsHint")}
              </AntSettingsInfoButton>
              {speechDiagnostics.length > 0 ? (
                <AntIconButton
                  accessibilityLabel={t("clearSpeechDiagnostics")}
                  iconNode={
                    <Feather name="trash-2" size={18} color={colors.danger} />
                  }
                  onPress={handleClear}
                />
              ) : null}
            </View>
          }
        />
        {speechDiagnostics.length === 0 ? (
          <AntSettingsCard>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {t("speechDiagnosticsEmpty")}
            </Text>
          </AntSettingsCard>
        ) : (
          speechDiagnostics.map((summary) => (
            <AntSettingsCard key={summary.id}>
              <View style={styles.diagnosticCard}>
                <View style={styles.diagnosticMetaRow}>
                  <Text
                    style={[styles.helperText, { color: colors.textSecondary }]}
                  >
                    {getSpeechSourceLabel(summary.source, t)}
                  </Text>
                  <Text
                    style={[styles.helperText, { color: colors.textMuted }]}
                  >
                    {formatSpeechDiagnosticTime(summary.createdAt)}
                  </Text>
                </View>
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  {t("speechDiagnosticRouteLine", {
                    requested: getSpeechRouteLabel(summary.requestedRoute, t),
                    actual: getSpeechRouteLabel(
                      summary.actualRoute ?? summary.requestedRoute,
                      t,
                    ),
                  })}
                </Text>
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  {t("speechDiagnosticStageLine", {
                    stage: summary.latestStage,
                  })}
                </Text>
                {summary.language && summary.language !== "app" ? (
                  <Text
                    style={[styles.helperText, { color: colors.textMuted }]}
                  >
                    {t("speechDiagnosticLanguageLine", {
                      languageLabel: getTtsListenLanguageLabel(
                        summary.language,
                        language,
                      ),
                    })}
                  </Text>
                ) : null}
                {summary.provider ? (
                  <Text
                    style={[styles.helperText, { color: colors.textMuted }]}
                  >
                    {t("speechDiagnosticProviderLine", {
                      provider: summary.provider,
                    })}
                  </Text>
                ) : null}
                {summary.providerModel ? (
                  <Text
                    style={[styles.helperText, { color: colors.textMuted }]}
                  >
                    {`${t("model")}: ${summary.providerModel}`}
                  </Text>
                ) : null}
                {summary.voice ? (
                  <Text
                    style={[styles.helperText, { color: colors.textMuted }]}
                  >
                    {t("speechDiagnosticVoiceLine", { voice: summary.voice })}
                  </Text>
                ) : null}
                {summary.fallbackReason || summary.message ? (
                  <Text
                    style={[styles.helperText, { color: colors.textMuted }]}
                  >
                    {summary.fallbackReason || summary.message}
                  </Text>
                ) : null}
              </View>
            </AntSettingsCard>
          ))
        )}
      </View>

      <Modal
        visible={clearConfirmationVisible}
        transparent
        maskClosable={false}
        title={t("clearSpeechDiagnosticsConfirmationTitle")}
        onClose={() => setClearConfirmationVisible(false)}
        footer={[
          {
            text: t("cancel"),
            style: {
              color: colors.accent,
              fontFamily: fonts.bodyMedium,
            },
            onPress: () => setClearConfirmationVisible(false),
          },
          {
            text: t("clear"),
            style: {
              color: colors.danger,
              fontFamily: fonts.bodyMedium,
            },
            onPress: () => {
              clearSpeechDiagnostics();
              setClearConfirmationVisible(false);
            },
          },
        ]}
        styles={{
          header: {
            color: colors.text,
            fontFamily: fonts.bodyMedium,
          },
          buttonText: {
            fontFamily: fonts.bodyMedium,
          },
        }}
      >
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("clearSpeechDiagnosticsConfirmationMessage")}
        </Text>
      </Modal>
    </View>
  );
}
