import React from "react";
import { Pressable, Text, View } from "react-native";

import { List } from "../../design-system/NativeControls";

import appConfig from "../../../app.json";
import { useLocalization } from "../../i18n";
import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../../design-system/PhosphorIcon";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import {
  isPremiumSettingsPage,
  type SettingsPage,
} from "../settings-core/types";

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
    | "settingsOnDevice"
    | "settingsSearch"
    | "settingsDataPrivacy"
    | "settingsAppDiagnostics";
  summaryKey:
    | "settingsConnectionsSummary"
    | "settingsThinkingSummary"
    | "settingsListeningSummary"
    | "settingsSpeakingSummary"
    | "settingsOnDeviceSummary"
    | "settingsSearchSummary"
    | "settingsDataPrivacySummary"
    | "settingsAppDiagnosticsSummary";
  icon: PhosphorIconName;
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
    icon: "robot",
  },
  {
    page: "listening",
    titleKey: "settingsListening",
    summaryKey: "settingsListeningSummary",
    icon: "audio",
  },
  {
    page: "speaking",
    titleKey: "settingsSpeaking",
    summaryKey: "settingsSpeakingSummary",
    icon: "sound",
  },
  {
    page: "local",
    titleKey: "settingsOnDevice",
    summaryKey: "settingsOnDeviceSummary",
    icon: "cpu",
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
    icon: "safety-certificate",
  },
  {
    page: "app",
    titleKey: "settingsAppDiagnostics",
    summaryKey: "settingsAppDiagnosticsSummary",
    icon: "sliders",
  },
];

const overviewGroups = [
  {
    titleKey: "settingsGroupConversation" as const,
    pages: ["connections", "thinking", "search"] as const,
  },
  {
    titleKey: "settingsGroupVoiceModels" as const,
    pages: ["listening", "speaking", "local"] as const,
  },
  {
    titleKey: "settingsGroupPrivacyApp" as const,
    pages: ["data", "app"] as const,
  },
];

export function AntSettingsOverview({
  isPremium,
  onOpenPage,
  onOpenPremium,
}: {
  isPremium: boolean;
  onOpenPage: (page: DrillInSettingsPage) => void;
  onOpenPremium: () => void;
}) {
  const { colors } = useTheme();
  const { isRtl, t } = useLocalization();
  const drillInIcon = isRtl ? "left" : "right";
  const visibleOverviewRows = isPremium
    ? overviewRows
    : overviewRows.filter((row) => !isPremiumSettingsPage(row.page));
  const visibleGroups = overviewGroups
    .map((group) => ({
      ...group,
      rows: group.pages
        .map((page) => visibleOverviewRows.find((row) => row.page === page))
        .filter((row): row is OverviewRow => Boolean(row)),
    }))
    .filter((group) => group.rows.length > 0);

  return (
    <View testID="settings-page-overview" style={styles.overview}>
      {isPremium ? (
        <AntSettingsCard
          testID="settings-edition-card"
          style={{
            backgroundColor: colors.accentSoft,
            borderColor: colors.borderStrong,
          }}
        >
          <View style={styles.setupCardBody}>
            <PhosphorIcon
              name="check-circle"
              size="prominent"
              color={colors.success}
            />
            <View style={styles.setupCopy}>
              <Text style={[styles.setupTitle, { color: colors.text }]}>
                {t("premiumUnlocked")}
              </Text>
              <Text
                style={[styles.setupSummary, { color: colors.textSecondary }]}
              >
                {t("premiumDescription")}
              </Text>
            </View>
          </View>
        </AntSettingsCard>
      ) : null}

      {visibleGroups.map((group) => (
        <View key={group.titleKey} style={styles.overviewGroup}>
          <Text
            style={[styles.overviewGroupTitle, { color: colors.textMuted }]}
          >
            {t(group.titleKey)}
          </Text>
          <View style={styles.sectionCards}>
            {group.rows.map((row) => (
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
                      <PhosphorIcon
                        name={row.icon}
                        size="prominent"
                        color={
                          !isPremium && row.page === "local"
                            ? colors.accent
                            : colors.text
                        }
                      />
                    </View>
                  }
                  extra={
                    <PhosphorIcon
                      name={drillInIcon}
                      size="control"
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
                      backgroundColor:
                        !isPremium && row.page === "local"
                          ? colors.accentSoft
                          : colors.surfaceElevated,
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
        </View>
      ))}

      {!isPremium ? (
        <Pressable
          testID="settings-premium-upgrade"
          onPress={onOpenPremium}
          accessibilityRole="button"
          accessibilityLabel={t("upgradeToPremium")}
          style={({ pressed }) => (pressed ? styles.pressedControl : undefined)}
        >
          <AntSettingsCard
            style={{
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            }}
          >
            <View style={styles.setupCardBody}>
              <View style={styles.setupCopy}>
                <Text style={[styles.setupTitle, { color: colors.text }]}>
                  {t("upgradeToPremium")}
                </Text>
                <Text
                  style={[styles.setupSummary, { color: colors.textSecondary }]}
                >
                  {t("premiumDescription")}
                </Text>
              </View>
              <PhosphorIcon name="lock" size="control" color={colors.accent} />
            </View>
          </AntSettingsCard>
        </Pressable>
      ) : null}

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
