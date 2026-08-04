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
  tone = "recommended",
  visuallyDisabled = false,
}: {
  estimatedSetupSeconds: number | null;
  headerTestID?: string;
  profile: OfflineProfile;
  ready: boolean;
  testID: string;
  title: string;
  tone?: "recommended" | "custom";
  visuallyDisabled?: boolean;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const customTone = tone === "custom";
  const accentColor = customTone ? colors.phaseSearching : colors.success;
  const softBackground = customTone
    ? `${colors.phaseSearching}1A`
    : colors.accentSoft;
  const etaLabel =
    estimatedSetupSeconds === null
      ? null
      : formatVoiceEtaDuration(estimatedSetupSeconds);
  const modelRows = [
    {
      key: "reasoning",
      models: [
        {
          key: "quick",
          icon: "thunderbolt" as PhosphorIconName,
          label: t(
            customTone
              ? "onboardingQuickModel"
              : "onboardingBestSetupQuickModel",
          ),
          model: profile.llm.name,
        },
        ...(profile.thoroughLlm
          ? [
              {
                key: "thorough",
                icon: "cpu" as PhosphorIconName,
                label: t(
                  customTone
                    ? "onboardingThoroughModel"
                    : "onboardingBestSetupThoroughModel",
                ),
                model: profile.thoroughLlm.name,
              },
            ]
          : []),
      ],
    },
    {
      key: "speech",
      models: [
        {
          key: "tts",
          icon: "sound" as PhosphorIconName,
          label: t(
            customTone ? "textToSpeech" : "onboardingBestSetupRecordingModel",
          ),
          model: profile.tts?.name ?? t("systemVoice"),
        },
        {
          key: "stt",
          icon: "mic" as PhosphorIconName,
          label: t(
            customTone ? "speechToText" : "onboardingBestSetupSpeakingModel",
          ),
          model: profile.stt?.name ?? t("appNative"),
        },
      ],
    },
  ];

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        visuallyDisabled ? styles.visuallyDisabled : null,
        {
          backgroundColor: softBackground,
          borderColor: accentColor,
          shadowColor: accentColor,
        },
      ]}
    >
      <View testID={headerTestID} style={styles.header}>
        <View
          style={[styles.heroIcon, { backgroundColor: colors.surfaceElevated }]}
        >
          <PhosphorIcon
            name="safety-certificate"
            size="feature"
            color={accentColor}
          />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>

      <View testID={`${testID}-models`} style={styles.models}>
        {modelRows.map((row) => (
          <View
            key={row.key}
            testID={`${testID}-${row.key}-row`}
            style={styles.modelRow}
          >
            {row.models.map((item) => (
              <View
                key={item.key}
                testID={`${testID}-${item.key}`}
                style={[
                  styles.model,
                  !customTone ? styles.recommendedModel : null,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                {customTone ? (
                  <>
                    <View
                      style={[
                        styles.modelIcon,
                        { backgroundColor: softBackground },
                      ]}
                    >
                      <PhosphorIcon
                        name={item.icon}
                        size="compact"
                        color={accentColor}
                      />
                    </View>
                    <View style={styles.modelCopy}>
                      <Text
                        style={[styles.modelLabel, { color: colors.textMuted }]}
                      >
                        {item.label}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[styles.modelName, { color: colors.text }]}
                      >
                        {item.model}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.recommendedModelLabel,
                        { color: colors.text },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <PhosphorIcon
                      testID={`${testID}-${item.key}-ready`}
                      name="check"
                      size="hero"
                      color={colors.success}
                    />
                  </>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>

      <View
        testID={`${testID}-meta`}
        style={[styles.meta, !customTone ? styles.recommendedMeta : null]}
      >
        {customTone ? (
          <View
            style={[styles.pill, { backgroundColor: colors.surfaceElevated }]}
          >
            <PhosphorIcon name="download" size="inline" color={accentColor} />
            <Text style={[styles.pillText, { color: colors.textSecondary }]}>
              {t("freeOfflineDownloadSize", {
                size: formatBytes(profile.downloadBytes),
              })}
            </Text>
          </View>
        ) : (
          <Text
            testID={`${testID}-download`}
            style={[
              styles.recommendedMetaText,
              styles.recommendedMetaStart,
              { color: colors.textSecondary },
            ]}
          >
            {t("freeOfflineDownloadSize", {
              size: formatBytes(profile.downloadBytes),
            })}
          </Text>
        )}
        {etaLabel ? (
          customTone ? (
            <View
              style={[styles.pill, { backgroundColor: colors.surfaceElevated }]}
            >
              <PhosphorIcon
                name="thunderbolt"
                size="inline"
                color={accentColor}
              />
              <Text style={[styles.pillText, { color: colors.textSecondary }]}>
                {t("onboardingEstimatedTime", { eta: etaLabel })}
              </Text>
            </View>
          ) : (
            <Text
              testID={`${testID}-eta`}
              style={[
                styles.recommendedMetaText,
                styles.recommendedMetaEnd,
                { color: colors.textSecondary },
              ]}
            >
              {t("onboardingEstimatedTime", { eta: etaLabel })}
            </Text>
          )
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
    flexDirection: "row",
    flex: 1,
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
  modelRow: { flexDirection: "row", gap: 8 },
  models: { gap: 8 },
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
  recommendedMeta: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  recommendedMetaEnd: { textAlign: "right" },
  recommendedMetaStart: { textAlign: "left" },
  recommendedMetaText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
  },
  recommendedModel: { justifyContent: "space-between" },
  recommendedModelLabel: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17,
  },
  readyRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  status: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  visuallyDisabled: {
    elevation: 0,
    opacity: 0.42,
    shadowOpacity: 0,
  },
});
