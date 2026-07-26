import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";

import type { SettingsReadiness, SettingsReadinessStatus } from "./readiness";
import { styles } from "./styles";
import type { SettingsPage } from "./types";

type DrillInSettingsPage = Exclude<SettingsPage, "overview">;

type OverviewRow = {
  page: DrillInSettingsPage;
  titleKey:
    | "settingsConnections"
    | "settingsThinking"
    | "settingsListening"
    | "settingsSpeaking"
    | "settingsSearch"
    | "settingsAppDiagnostics";
  summaryKey:
    | "settingsConnectionsSummary"
    | "settingsThinkingSummary"
    | "settingsListeningSummary"
    | "settingsSpeakingSummary"
    | "settingsSearchSummary"
    | "settingsAppDiagnosticsSummary";
  icon: React.ComponentProps<typeof Feather>["name"];
};

const overviewRows: OverviewRow[] = [
  {
    page: "connections",
    titleKey: "settingsConnections",
    summaryKey: "settingsConnectionsSummary",
    icon: "key",
  },
  {
    page: "thinking",
    titleKey: "settingsThinking",
    summaryKey: "settingsThinkingSummary",
    icon: "cpu",
  },
  {
    page: "listening",
    titleKey: "settingsListening",
    summaryKey: "settingsListeningSummary",
    icon: "mic",
  },
  {
    page: "speaking",
    titleKey: "settingsSpeaking",
    summaryKey: "settingsSpeakingSummary",
    icon: "volume-2",
  },
  {
    page: "search",
    titleKey: "settingsSearch",
    summaryKey: "settingsSearchSummary",
    icon: "search",
  },
  {
    page: "app",
    titleKey: "settingsAppDiagnostics",
    summaryKey: "settingsAppDiagnosticsSummary",
    icon: "sliders",
  },
];

function getReadinessColor(
  status: SettingsReadinessStatus,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  switch (status.state) {
    case "ready":
      return {
        backgroundColor: `${colors.success}22`,
        borderColor: `${colors.success}99`,
        textColor: colors.success,
      };
    case "attention":
      return {
        backgroundColor: colors.accentSoft,
        borderColor: colors.accent,
        textColor: colors.accent,
      };
    case "broken":
      return {
        backgroundColor: `${colors.danger}12`,
        borderColor: `${colors.danger}55`,
        textColor: colors.danger,
      };
    case "off":
      return {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textColor: colors.textMuted,
      };
  }
}

function ReadinessPill({
  label,
  status,
  onPress,
}: {
  label: string;
  status: SettingsReadinessStatus;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const meta = getReadinessColor(status, colors);
  const summary = t(status.summaryKey);

  return (
    <TouchableOpacity
      style={[
        styles.readinessPill,
        {
          backgroundColor: meta.backgroundColor,
          borderColor: meta.borderColor,
        },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${summary}`}
    >
      <Text
        style={[styles.readinessPillTitle, { color: meta.textColor }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function SettingsOverview({
  readiness,
  onOpenPage,
  onOpenSetupGuide,
}: {
  readiness: SettingsReadiness;
  onOpenPage: (page: DrillInSettingsPage) => void;
  onOpenSetupGuide?: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <View style={styles.tabPane}>
      {onOpenSetupGuide ? (
        <TouchableOpacity
          style={[
            styles.setupGuideRow,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.borderStrong,
            },
          ]}
          activeOpacity={0.85}
          onPress={onOpenSetupGuide}
          accessibilityRole="button"
          accessibilityLabel={t("settingsGuidedSetup")}
        >
          <Feather name="compass" size={18} color={colors.accent} />
          <View style={styles.overviewRowCopy}>
            <Text style={[styles.overviewRowTitle, { color: colors.text }]}>
              {t("settingsGuidedSetup")}
            </Text>
            <Text
              style={[
                styles.overviewRowSummary,
                { color: colors.textSecondary },
              ]}
            >
              {t("settingsGuidedSetupSummary")}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}
      <View style={styles.readinessGrid}>
        <ReadinessPill
          label={t("settingsReadinessThink")}
          status={readiness.think}
          onPress={() => onOpenPage("thinking")}
        />
        <ReadinessPill
          label={t("settingsReadinessListen")}
          status={readiness.listen}
          onPress={() => onOpenPage("listening")}
        />
        <ReadinessPill
          label={t("settingsReadinessSpeak")}
          status={readiness.speak}
          onPress={() => onOpenPage("speaking")}
        />
        <ReadinessPill
          label={t("settingsReadinessSearch")}
          status={readiness.search}
          onPress={() => onOpenPage("search")}
        />
      </View>

      <View style={styles.overviewRowList}>
        {overviewRows.map((row) => (
          <TouchableOpacity
            key={row.page}
            style={[
              styles.overviewRow,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => onOpenPage(row.page)}
            accessibilityRole="button"
            accessibilityLabel={t("settingsOpenSection", {
              section: t(row.titleKey),
            })}
          >
            <View
              testID={`settings-overview-icon-${row.page}`}
              style={styles.overviewRowIcon}
            >
              <Feather name={row.icon} size={24} color={colors.text} />
            </View>
            <View style={styles.overviewRowCopy}>
              <Text style={[styles.overviewRowTitle, { color: colors.text }]}>
                {t(row.titleKey)}
              </Text>
              <Text
                style={[styles.overviewRowSummary, { color: colors.textMuted }]}
              >
                {t(row.summaryKey)}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
