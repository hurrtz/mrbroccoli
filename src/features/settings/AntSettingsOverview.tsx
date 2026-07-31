import React from "react";
import { Pressable, Text, View } from "react-native";

import { List } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";

import appConfig from "../../../app.json";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { SettingsReadiness } from "../settings-core/readiness";
import type { SettingsPage } from "../settings-core/types";

import { AntSettingsCard } from "./AntSettingsPrimitives";
import { styles } from "./styles";

type DrillInSettingsPage = Exclude<SettingsPage, "overview">;

type OverviewRow = {
  page: DrillInSettingsPage;
  titleKey:
    | "settingsConnections"
    | "settingsThinking"
    | "settingsListening"
    | "settingsSpeaking"
    | "settingsSearch"
    | "settingsDataPrivacy"
    | "settingsAppDiagnostics";
  summaryKey:
    | "settingsConnectionsSummary"
    | "settingsThinkingSummary"
    | "settingsListeningSummary"
    | "settingsSpeakingSummary"
    | "settingsSearchSummary"
    | "settingsDataPrivacySummary"
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
    page: "data",
    titleKey: "settingsDataPrivacy",
    summaryKey: "settingsDataPrivacySummary",
    icon: "shield",
  },
  {
    page: "app",
    titleKey: "settingsAppDiagnostics",
    summaryKey: "settingsAppDiagnosticsSummary",
    icon: "sliders",
  },
];

export function AntSettingsOverview({
  readiness,
  onOpenPage,
  onOpenSetupGuide,
}: {
  readiness: SettingsReadiness;
  onOpenPage: (page: DrillInSettingsPage) => void;
  onOpenSetupGuide?: () => void;
}) {
  const { colors } = useTheme();
  const { isRtl, t } = useLocalization();
  const drillInIcon = isRtl ? "chevron-left" : "chevron-right";
  const readinessItems = [
    {
      key: "thinking",
      label: t("settingsReadinessThink"),
      status: readiness.think,
      onPress: () => onOpenPage("thinking"),
    },
    {
      key: "listening",
      label: t("settingsReadinessListen"),
      status: readiness.listen,
      onPress: () => onOpenPage("listening"),
    },
    {
      key: "speaking",
      label: t("settingsReadinessSpeak"),
      status: readiness.speak,
      onPress: () => onOpenPage("speaking"),
    },
    {
      key: "search",
      label: t("settingsReadinessSearch"),
      status: readiness.search,
      onPress: () => onOpenPage("search"),
    },
  ] as const;

  return (
    <View testID="settings-page-overview" style={styles.overview}>
      {onOpenSetupGuide ? (
        <Pressable
          testID="settings-guided-setup"
          onPress={onOpenSetupGuide}
          accessibilityRole="button"
          accessibilityLabel={t("settingsGuidedSetup")}
          style={({ pressed }) => (pressed ? styles.pressedControl : undefined)}
        >
          <AntSettingsCard
            style={[
              styles.setupCard,
              {
                backgroundColor: colors.accentSoft,
                borderColor: colors.borderStrong,
              },
            ]}
          >
            <View style={styles.setupCardBody}>
              <View style={styles.setupCopy}>
                <Text style={[styles.setupTitle, { color: colors.text }]}>
                  {t("settingsGuidedSetup")}
                </Text>
                <Text
                  style={[styles.setupSummary, { color: colors.textSecondary }]}
                >
                  {t("settingsGuidedSetupSummary")}
                </Text>
              </View>
              <Feather name={drillInIcon} size={20} color={colors.textMuted} />
            </View>
          </AntSettingsCard>
        </Pressable>
      ) : null}

      <View style={styles.readinessGrid}>
        {readinessItems.map((item, index) => {
          const previousReady =
            index > 0 && readinessItems[index - 1].status.state === "ready";
          const nextReady =
            index < readinessItems.length - 1 &&
            readinessItems[index + 1].status.state === "ready";
          const ready = item.status.state === "ready";
          const broken = item.status.state === "broken";
          const statusColor = broken
            ? colors.danger
            : ready
              ? colors.success
              : colors.borderStrong;

          return (
            <Pressable
              key={item.key}
              testID={`settings-readiness-${item.key}`}
              style={({ pressed }) => [
                styles.readinessStep,
                pressed ? styles.pressedControl : null,
              ]}
              onPress={item.onPress}
              accessibilityRole="button"
              accessibilityLabel={`${item.label}: ${t(item.status.summaryKey)}`}
            >
              <View style={styles.readinessStepTrack}>
                <View
                  style={[
                    styles.readinessStepLine,
                    {
                      backgroundColor:
                        previousReady && ready ? colors.success : colors.border,
                      opacity: index === 0 ? 0 : 1,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.readinessStepCircle,
                    {
                      backgroundColor: colors.surface,
                      borderColor: statusColor,
                    },
                  ]}
                >
                  {ready ? (
                    <Feather name="check" size={13} color={colors.success} />
                  ) : broken ? (
                    <Feather
                      name="alert-circle"
                      size={12}
                      color={colors.danger}
                    />
                  ) : null}
                </View>
                <View
                  style={[
                    styles.readinessStepLine,
                    {
                      backgroundColor:
                        ready && nextReady ? colors.success : colors.border,
                      opacity: index === readinessItems.length - 1 ? 0 : 1,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.readinessStepLabel,
                  {
                    color: broken
                      ? colors.danger
                      : ready
                        ? colors.success
                        : colors.textSecondary,
                  },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionCards}>
        {overviewRows.map((row) => (
          <AntSettingsCard
            key={row.page}
            contentStyle={styles.fullBleedCardContent}
          >
            <List.Item
              testID={`settings-overview-row-${row.page}`}
              multipleLine
              wrap
              thumb={
                <View
                  testID={`settings-overview-icon-${row.page}`}
                  style={styles.sectionIcon}
                >
                  <Feather name={row.icon} size={27} color={colors.text} />
                </View>
              }
              extra={
                <Feather
                  name={drillInIcon}
                  size={20}
                  color={colors.textMuted}
                />
              }
              onPress={() => onOpenPage(row.page)}
              accessibilityRole="button"
              accessibilityLabel={t("settingsOpenSection", {
                section: t(row.titleKey),
              })}
              styles={{
                Item: {
                  backgroundColor: colors.surfaceElevated,
                },
                Line: {
                  borderBottomWidth: 0,
                  paddingVertical: 12,
                },
                Content: {
                  color: colors.text,
                  fontFamily: fonts.bodyMedium,
                  fontSize: 16,
                  fontWeight: "600",
                },
                Extra: {
                  paddingStart: 10,
                },
              }}
            >
              {t(row.titleKey)}
              <List.Item.Brief
                wrap
                style={{
                  color: colors.textSecondary,
                  fontFamily: fonts.body,
                  fontSize: 13,
                  lineHeight: 19,
                }}
              >
                {t(row.summaryKey)}
              </List.Item.Brief>
            </List.Item>
          </AntSettingsCard>
        ))}
      </View>

      <Text
        testID="settings-release-version"
        style={[styles.releaseVersion, { color: colors.textMuted }]}
      >
        {t("settingsReleaseVersion", {
          version: appConfig.expo.version,
        })}
      </Text>
    </View>
  );
}
