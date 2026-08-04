import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../design-system/PhosphorIcon";
import { useLocalization } from "../i18n";
import type { OfflineProfile } from "../services/offlineProfile";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import { formatBytes } from "../utils/formatBytes";
import { formatVoiceEtaDuration } from "../utils/voiceEta";

export function FreeOfflineProfileCard({
  estimatedSetupSeconds,
  headerTestID,
  profile,
  ready,
  testID,
  title,
}: {
  estimatedSetupSeconds: number | null;
  headerTestID?: string;
  profile: OfflineProfile;
  ready: boolean;
  testID: string;
  title: string;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const etaLabel =
    estimatedSetupSeconds === null
      ? null
      : formatVoiceEtaDuration(estimatedSetupSeconds);
  const models = [
    {
      key: "stt",
      icon: "mic" as PhosphorIconName,
      label: t("speechToText"),
      model: profile.stt?.name ?? t("appNative"),
    },
    {
      key: "quick",
      icon: "thunderbolt" as PhosphorIconName,
      label: t("onboardingQuickModel"),
      model: profile.llm.name,
    },
    ...(profile.thoroughLlm
      ? [
          {
            key: "thorough",
            icon: "cpu" as PhosphorIconName,
            label: t("onboardingThoroughModel"),
            model: profile.thoroughLlm.name,
          },
        ]
      : []),
    {
      key: "tts",
      icon: "sound" as PhosphorIconName,
      label: t("textToSpeech"),
      model: profile.tts?.name ?? t("systemVoice"),
    },
  ];

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: colors.accentSoft,
          borderColor: colors.success,
          shadowColor: colors.success,
        },
      ]}
    >
      <View testID={headerTestID} style={styles.header}>
        <View
          style={[
            styles.heroIcon,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          <PhosphorIcon
            name="safety-certificate"
            size="feature"
            color={colors.success}
          />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>

      <View style={styles.models}>
        {models.map((item) => (
          <View
            key={item.key}
            style={[
              styles.model,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.modelIcon,
                { backgroundColor: colors.accentSoft },
              ]}
            >
              <PhosphorIcon
                name={item.icon}
                size="compact"
                color={colors.success}
              />
            </View>
            <View style={styles.modelCopy}>
              <Text style={[styles.modelLabel, { color: colors.textMuted }]}>
                {item.label}
              </Text>
              <Text
                numberOfLines={2}
                style={[styles.modelName, { color: colors.text }]}
              >
                {item.model}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.meta}>
        <View
          style={[
            styles.pill,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          <PhosphorIcon name="download" size="inline" color={colors.success} />
          <Text style={[styles.pillText, { color: colors.textSecondary }]}>
            {t("freeOfflineDownloadSize", {
              size: formatBytes(profile.downloadBytes),
            })}
          </Text>
        </View>
        {etaLabel ? (
          <View
            style={[
              styles.pill,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <PhosphorIcon
              name="thunderbolt"
              size="inline"
              color={colors.success}
            />
            <Text style={[styles.pillText, { color: colors.textSecondary }]}>
              {t("onboardingEstimatedTime", { eta: etaLabel })}
            </Text>
          </View>
        ) : null}
      </View>

      {!profile.tts ? (
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {t("freeOfflineSystemVoiceNote")}
        </Text>
      ) : null}
      {ready ? (
        <View style={styles.readyRow}>
          <PhosphorIcon
            name="check-circle"
            size="compact"
            color={colors.success}
          />
          <Text style={[styles.status, { color: colors.success }]}>
            {t("freeOfflineReady")}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    gap: 14,
    padding: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  header: { alignItems: "center", flexDirection: "row", gap: 12 },
  heroIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  model: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: "47%",
    flexDirection: "row",
    flexGrow: 1,
    gap: 8,
    minHeight: 68,
    padding: 10,
  },
  modelCopy: { flex: 1, gap: 2, minWidth: 0 },
  modelIcon: {
    alignItems: "center",
    borderRadius: 9,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  modelLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.5,
    lineHeight: 13,
    textTransform: "uppercase",
  },
  modelName: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 17 },
  models: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: { fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 15 },
  readyRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  status: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
});
