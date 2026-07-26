import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Button,
  Card,
  Icon,
  List,
} from "@ant-design/react-native";
import type { IconNames } from "@ant-design/react-native/lib/icon";

import { antButtonTypography } from "../../design-system/antTypography";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type {
  SettingsReadiness,
  SettingsReadinessStatus,
} from "../settings-core/readiness";
import type { SettingsPage } from "../settings-core/types";

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
    | "settingsAppDiagnostics";
  summaryKey:
    | "settingsConnectionsSummary"
    | "settingsThinkingSummary"
    | "settingsListeningSummary"
    | "settingsSpeakingSummary"
    | "settingsSearchSummary"
    | "settingsAppDiagnosticsSummary";
  icon: IconNames;
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
    icon: "bulb",
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
    page: "search",
    titleKey: "settingsSearch",
    summaryKey: "settingsSearchSummary",
    icon: "search",
  },
  {
    page: "app",
    titleKey: "settingsAppDiagnostics",
    summaryKey: "settingsAppDiagnosticsSummary",
    icon: "control",
  },
];

function getReadinessMeta(
  status: SettingsReadinessStatus,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  switch (status.state) {
    case "ready":
      return {
        backgroundColor: `${colors.success}18`,
        borderColor: `${colors.success}88`,
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
        borderColor: `${colors.danger}66`,
        textColor: colors.danger,
      };
    case "off":
      return {
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.border,
        textColor: colors.textMuted,
      };
  }
}

function ReadinessButton({
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
  const meta = getReadinessMeta(status, colors);

  return (
    <Button
      size="small"
      type="ghost"
      style={StyleSheet.flatten([
        styles.readinessButton,
        {
          backgroundColor: meta.backgroundColor,
          borderColor: meta.borderColor,
        },
      ])}
      styles={{
        ...antButtonTypography,
        ghostRawText: {
          color: meta.textColor,
          fontFamily: fonts.bodyMedium,
          fontSize: 14,
          fontWeight: "600",
        },
      }}
      onPress={onPress}
      accessibilityLabel={`${label}: ${t(status.summaryKey)}`}
    >
      {label}
    </Button>
  );
}

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
  const { t } = useLocalization();

  return (
    <View style={styles.overview}>
      {onOpenSetupGuide ? (
        <Pressable
          onPress={onOpenSetupGuide}
          accessibilityRole="button"
          accessibilityLabel={t("settingsGuidedSetup")}
        >
          <Card
            style={[
              styles.setupCard,
              {
                backgroundColor: colors.accentSoft,
                borderColor: colors.borderStrong,
              },
            ]}
          >
            <View style={styles.setupCardBody}>
              <Icon name="compass" size={25} color={colors.accent} />
              <View style={styles.setupCopy}>
                <Text style={[styles.setupTitle, { color: colors.text }]}>
                  {t("settingsGuidedSetup")}
                </Text>
                <Text
                  style={[
                    styles.setupSummary,
                    { color: colors.textSecondary },
                  ]}
                >
                  {t("settingsGuidedSetupSummary")}
                </Text>
              </View>
              <Icon name="right" size={18} color={colors.textMuted} />
            </View>
          </Card>
        </Pressable>
      ) : null}

      <View style={styles.readinessGrid}>
        <ReadinessButton
          label={t("settingsReadinessThink")}
          status={readiness.think}
          onPress={() => onOpenPage("thinking")}
        />
        <ReadinessButton
          label={t("settingsReadinessListen")}
          status={readiness.listen}
          onPress={() => onOpenPage("listening")}
        />
        <ReadinessButton
          label={t("settingsReadinessSpeak")}
          status={readiness.speak}
          onPress={() => onOpenPage("speaking")}
        />
        <ReadinessButton
          label={t("settingsReadinessSearch")}
          status={readiness.search}
          onPress={() => onOpenPage("search")}
        />
      </View>

      <List
        style={[
          styles.sectionList,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
        ]}
      >
        {overviewRows.map((row) => (
          <List.Item
            key={row.page}
            arrow="horizontal"
            multipleLine
            wrap
            thumb={
              <View
                testID={`settings-overview-icon-${row.page}`}
                style={styles.sectionIcon}
              >
                <Icon name={row.icon} size={27} color={colors.text} />
              </View>
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
              Content: {
                color: colors.text,
                fontFamily: fonts.bodyMedium,
                fontSize: 16,
                fontWeight: "600",
              },
              Arrow: {
                color: colors.textMuted,
              },
            }}
          >
            {t(row.titleKey)}
            <List.Item.Brief
              wrap
              style={{
                color: colors.textSecondary,
                fontFamily: fonts.body,
                lineHeight: 20,
              }}
            >
              {t(row.summaryKey)}
            </List.Item.Brief>
          </List.Item>
        ))}
      </List>
    </View>
  );
}
