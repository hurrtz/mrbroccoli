import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { getTtsListenLanguageLabel } from "../../../constants/localTts";
import { PROVIDER_LABELS } from "../../../constants/models";
import { Modal } from "../../../design-system/NativeControls";
import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useRuntimeCapabilityOverrides } from "../../../hooks/useRuntimeCapabilityOverrides";
import { useLocalization } from "../../../i18n";
import { APP_LANGUAGE_OPTIONS } from "../../../i18n/localeRegistry";
import { clearRuntimeCapabilityOverrides } from "../../../services/runtimeCapabilityOverrides";
import {
  clearSpeechDiagnostics,
  type SpeechDiagnosticRoute,
  type SpeechDiagnosticRequestSummary,
} from "../../../services/speech/diagnostics";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type { AppLanguage, Settings, ThemeMode } from "../../../types";
import { styles } from "../styles";
import { SettingsChoiceRow } from "../settings-primitives/SettingsChoiceRow";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { SettingsRow } from "../settings-primitives/SettingsRow";
import { SettingsSheet } from "../settings-primitives/SettingsSheet";
import { Switch } from "../../../design-system/Switch";

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

function SpeechDiagnosticRow({
  last,
  summary,
}: {
  last: boolean;
  summary: SpeechDiagnosticRequestSummary;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const routeLine = t("speechDiagnosticRouteLine", {
    requested: getSpeechRouteLabel(summary.requestedRoute, t),
    actual: getSpeechRouteLabel(
      summary.actualRoute ?? summary.requestedRoute,
      t,
    ),
  });
  const details = [
    t("speechDiagnosticStageLine", { stage: summary.latestStage }),
    summary.language && summary.language !== "app"
      ? t("speechDiagnosticLanguageLine", {
          languageLabel: getTtsListenLanguageLabel(
            summary.language,
            language,
          ),
        })
      : null,
    summary.provider
      ? t("speechDiagnosticProviderLine", {
          provider:
            PROVIDER_LABELS[
              summary.provider as keyof typeof PROVIDER_LABELS
            ] ?? summary.provider,
        })
      : null,
    summary.providerModel ? `${t("model")}: ${summary.providerModel}` : null,
    summary.voice
      ? t("speechDiagnosticVoiceLine", { voice: summary.voice })
      : null,
    summary.fallbackReason || summary.message,
  ].filter(Boolean) as string[];

  return (
    <View
      accessible
      accessibilityLabel={[
        getSpeechSourceLabel(summary.source, t),
        formatSpeechDiagnosticTime(summary.createdAt),
        routeLine,
        ...details,
      ].join(". ")}
      style={[
        pageStyles.diagnosticRow,
        { borderBottomColor: colors.border },
        last ? pageStyles.lastRow : null,
      ]}
    >
      <View style={pageStyles.diagnosticHeader}>
        <View
          style={[
            pageStyles.diagnosticIcon,
            { backgroundColor: colors.accentSoft },
          ]}
        >
          <PhosphorIcon color={colors.accent} name="audio" size="compact" />
        </View>
        <Text style={[pageStyles.diagnosticTitle, { color: colors.text }]}>
          {getSpeechSourceLabel(summary.source, t)}
        </Text>
        <Text style={[pageStyles.diagnosticTime, { color: colors.textMuted }]}>
          {formatSpeechDiagnosticTime(summary.createdAt)}
        </Text>
      </View>
      <Text style={[pageStyles.diagnosticLine, { color: colors.textSecondary }]}>
        {routeLine}
      </Text>
      {details.map((detail) => (
        <Text
          key={detail}
          style={[pageStyles.diagnosticLine, { color: colors.textMuted }]}
        >
          {detail}
        </Text>
      ))}
    </View>
  );
}

export function AppSettingsPage({
  onUpdate,
  settings,
  speechDiagnostics,
}: {
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  settings: Settings;
  speechDiagnostics: SpeechDiagnosticRequestSummary[];
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const [speechSheetVisible, setSpeechSheetVisible] = React.useState(false);
  const [runtimeSheetVisible, setRuntimeSheetVisible] = React.useState(false);
  const [clearConfirmationVisible, setClearConfirmationVisible] =
    React.useState(false);
  const [clearRuntimeOverridesConfirmationVisible, setClearRuntimeOverridesConfirmationVisible] =
    React.useState(false);
  const runtimeOverrides = useRuntimeCapabilityOverrides();
  const themeOptions = [
    { value: "light", label: t("light") },
    { value: "dark", label: t("dark") },
    { value: "system", label: t("system") },
  ] as const;

  return (
    <View
      testID={`app-settings-page-${language}`}
      style={styles.sectionPageStack}
    >
      <SettingsGroup title={t("appearance")}>
        <SettingsChoiceRow<ThemeMode>
          testID="app-theme"
          icon="eye"
          label={t("theme")}
          options={themeOptions}
          value={settings.theme}
          onChange={(theme) => onUpdate({ theme })}
        />
        <SettingsChoiceRow<AppLanguage>
          testID="app-language-picker"
          icon="global"
          label={t("language")}
          last
          options={APP_LANGUAGE_OPTIONS}
          value={settings.language}
          onChange={(nextLanguage) => onUpdate({ language: nextLanguage })}
        />
      </SettingsGroup>

      <SettingsGroup title={t("homeScreen")}>
        <SettingsRow
          icon="line-chart"
          label={t("usageStatsInTranscripts")}
          last
          control={
            <Switch
              testID="settings-usage-stats"
              label={t("usageStatsInTranscripts")}
              value={settings.showUsageStats}
              onChange={(showUsageStats) => onUpdate({ showUsageStats })}
            />
          }
        />
      </SettingsGroup>

      <SettingsGroup title={t("diagnostics")}>
        <SettingsRow
          testID="speech-diagnostics-row"
          icon="audio"
          label={t("speechDiagnostics")}
          value={String(speechDiagnostics.length)}
          onPress={() => setSpeechSheetVisible(true)}
        />
        <SettingsRow
          icon="bug"
          label={t("debugLogButton")}
          control={
            <Switch
              testID="settings-debug-log-button"
              label={t("debugLogButton")}
              value={settings.showDebugLogButton}
              onChange={(showDebugLogButton) =>
                onUpdate({ showDebugLogButton })
              }
            />
          }
        />
        <SettingsRow
          testID="runtime-compatibility-overrides-section"
          icon="cpu"
          label={t("runtimeCompatibilityOverrides")}
          last
          value={
            runtimeOverrides.length === 0
              ? t("modelEffortNone")
              : String(runtimeOverrides.length)
          }
          onPress={() => setRuntimeSheetVisible(true)}
        />
      </SettingsGroup>

      <SettingsSheet
        testID="speech-diagnostics-sheet"
        onClose={() => setSpeechSheetVisible(false)}
        title={t("speechDiagnostics")}
        visible={speechSheetVisible}
      >
        <SettingsGroup footer={t("speechDiagnosticsHint")}>
          {speechDiagnostics.length === 0 ? (
            <SettingsRow
              icon="audio"
              label={t("speechDiagnosticsEmpty")}
              last
              control={null}
            />
          ) : (
            speechDiagnostics.map((summary, index) => (
              <SpeechDiagnosticRow
                key={summary.id}
                last={index === speechDiagnostics.length - 1}
                summary={summary}
              />
            ))
          )}
        </SettingsGroup>
        {speechDiagnostics.length > 0 ? (
          <SettingsGroup>
            <SettingsRow
              danger
              icon="delete"
              label={t("clearSpeechDiagnostics")}
              last
              onPress={() => setClearConfirmationVisible(true)}
            />
          </SettingsGroup>
        ) : null}
      </SettingsSheet>

      <SettingsSheet
        testID="runtime-overrides-sheet"
        onClose={() => setRuntimeSheetVisible(false)}
        title={t("runtimeCompatibilityOverrides")}
        visible={runtimeSheetVisible}
      >
        <SettingsGroup
          footer={t("runtimeCompatibilityOverridesDescription", {
            count: runtimeOverrides.length,
          })}
        >
          {runtimeOverrides.length === 0 ? (
            <SettingsRow
              icon="check-circle"
              label={t("modelEffortNone")}
              last
              control={null}
            />
          ) : (
            runtimeOverrides.map((override, index) => (
              <SettingsRow
                key={[
                  override.provider,
                  override.capability,
                  override.model,
                  override.effort ?? "",
                ].join(":")}
                label={PROVIDER_LABELS[override.provider]}
                supporting={[
                  override.capability.toUpperCase(),
                  override.model,
                  override.effort,
                ]
                  .filter(Boolean)
                  .join(" · ")}
                last={index === runtimeOverrides.length - 1}
                control={null}
              />
            ))
          )}
        </SettingsGroup>
        {runtimeOverrides.length > 0 ? (
          <SettingsGroup>
            <SettingsRow
              danger
              icon="delete"
              label={t("clearRuntimeCompatibilityOverrides")}
              last
              onPress={() =>
                setClearRuntimeOverridesConfirmationVisible(true)
              }
            />
          </SettingsGroup>
        ) : null}
      </SettingsSheet>

      <Modal
        visible={clearConfirmationVisible}
        transparent
        maskClosable={false}
        title={t("clearSpeechDiagnosticsConfirmationTitle")}
        onClose={() => setClearConfirmationVisible(false)}
        footer={[
          {
            text: t("cancel"),
            style: { color: colors.accent, fontFamily: fonts.bodyMedium },
            onPress: () => setClearConfirmationVisible(false),
          },
          {
            text: t("clear"),
            style: { color: colors.danger, fontFamily: fonts.bodyMedium },
            onPress: () => {
              clearSpeechDiagnostics();
              setClearConfirmationVisible(false);
            },
          },
        ]}
      >
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("clearSpeechDiagnosticsConfirmationMessage")}
        </Text>
      </Modal>

      <Modal
        visible={clearRuntimeOverridesConfirmationVisible}
        transparent
        maskClosable={false}
        title={t("clearRuntimeCompatibilityOverridesConfirmationTitle")}
        onClose={() => setClearRuntimeOverridesConfirmationVisible(false)}
        footer={[
          {
            text: t("cancel"),
            style: { color: colors.accent, fontFamily: fonts.bodyMedium },
            onPress: () =>
              setClearRuntimeOverridesConfirmationVisible(false),
          },
          {
            text: t("clear"),
            style: { color: colors.danger, fontFamily: fonts.bodyMedium },
            onPress: () => {
              void clearRuntimeCapabilityOverrides();
              setClearRuntimeOverridesConfirmationVisible(false);
            },
          },
        ]}
      >
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("clearRuntimeCompatibilityOverridesConfirmationMessage")}
        </Text>
      </Modal>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  diagnosticRow: {
    minHeight: 72,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 3,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  diagnosticHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  diagnosticIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  diagnosticTitle: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  diagnosticTime: {
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
  },
  diagnosticLine: {
    marginLeft: 34,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
});
