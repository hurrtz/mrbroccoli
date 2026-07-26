import React from "react";
import { Text, View } from "react-native";

import { Button, Modal } from "@ant-design/react-native";

import { getTtsListenLanguageLabel } from "../../../constants/localTts";
import { antButtonTypography } from "../../../design-system/antTypography";
import { useLocalization } from "../../../i18n";
import {
  clearSpeechDiagnostics,
  type SpeechDiagnosticRoute,
  type SpeechDiagnosticRequestSummary,
} from "../../../services/speech/diagnostics";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type {
  AppLanguage,
  Settings,
  ThemeMode,
} from "../../../types";

import {
  AntPickerRow,
  AntPickerSection,
  AntRadioSection,
  AntSettingsCard,
} from "../AntSettingsPrimitives";
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
    <View style={styles.pageStack}>
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
      <AntPickerSection>
        <AntPickerRow
          label={t("language")}
          value={settings.language}
          options={[
            { value: "en", label: t("english") },
            { value: "de", label: t("german") },
          ]}
          onChange={(value) =>
            onUpdate({ language: value as AppLanguage })
          }
        />
      </AntPickerSection>
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

      <AntSettingsCard>
        <View style={styles.diagnosticHeader}>
          <View style={styles.setupCopy}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              {t("speechDiagnostics")}
            </Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {t("speechDiagnosticsHint")}
            </Text>
          </View>
          <Button
            size="small"
            type="warning"
            style={styles.compactButton}
            styles={antButtonTypography}
            onPress={handleClear}
          >
            {t("clear")}
          </Button>
        </View>

        {speechDiagnostics.length === 0 ? (
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("speechDiagnosticsEmpty")}
          </Text>
        ) : (
          speechDiagnostics.map((summary, index) => (
            <View
              key={summary.id}
              style={[
                styles.diagnosticCard,
                index === 0 ? styles.diagnosticCardFirst : null,
                { borderTopColor: colors.border },
              ]}
            >
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
              <Text style={[styles.helperText, { color: colors.textSecondary }]}>
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
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  {t("speechDiagnosticLanguageLine", {
                    languageLabel: getTtsListenLanguageLabel(
                      summary.language,
                      language,
                    ),
                  })}
                </Text>
              ) : null}
              {summary.provider ? (
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  {t("speechDiagnosticProviderLine", {
                    provider: summary.provider,
                  })}
                </Text>
              ) : null}
              {summary.providerModel ? (
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  {`${t("model")}: ${summary.providerModel}`}
                </Text>
              ) : null}
              {summary.voice ? (
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  {t("speechDiagnosticVoiceLine", { voice: summary.voice })}
                </Text>
              ) : null}
              {summary.fallbackReason || summary.message ? (
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  {summary.fallbackReason || summary.message}
                </Text>
              ) : null}
            </View>
          ))
        )}
      </AntSettingsCard>

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
            fontFamily: fonts.headline,
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
