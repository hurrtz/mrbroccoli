import React from "react";
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getTtsListenLanguageLabel } from "../constants/localTts";
import { FREE_SPEECH_LANGUAGE_OPTIONS } from "../constants/speechLanguages";
import { Modal } from "../design-system/NativeControls";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { useLocalization } from "../i18n";
import type { FreeOfflineModeController } from "../screens/main/useFreeOfflineMode";
import { getOfflineProfileModels } from "../services/offlineProfile";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import { formatBytes } from "../utils/formatBytes";
import { formatVoiceEtaDuration } from "../utils/voiceEta";
import { FreeOfflineAdvancedOptions } from "./FreeOfflineAdvancedOptions";

export function FreeOfflineSetupModal({
  controller,
  onOpenPremium,
}: {
  controller: FreeOfflineModeController;
  onOpenPremium: () => void;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const { selection, preparationProgress } = controller;
  const profile = selection?.status === "ready" ? selection.profile : null;
  const ready = controller.readiness?.ready === true;

  const progressAnnouncement = React.useMemo(() => {
    if (!preparationProgress) {
      return null;
    }
    const model = profile
      ? getOfflineProfileModels(profile).find(
          (candidate) => candidate.id === preparationProgress.modelId,
        )
      : null;
    return t("freeOfflinePreparing", {
      model: model?.name ?? preparationProgress.modelId,
      index: preparationProgress.modelIndex + 1,
      count: preparationProgress.modelCount,
    });
  }, [preparationProgress, profile, t]);

  React.useEffect(() => {
    if (progressAnnouncement) {
      AccessibilityInfo.announceForAccessibility(progressAnnouncement);
    }
  }, [progressAnnouncement]);

  const unavailableText =
    selection?.status !== "unavailable"
      ? null
      : selection.reason === "language"
        ? t("freeOfflineUnavailableLanguage")
        : selection.reason === "device"
          ? t("freeOfflineUnavailableDevice")
          : selection.reason === "storage"
            ? t("freeOfflineUnavailableStorage")
            : t("freeOfflineUnavailableTemporary");
  const progressModel =
    profile && preparationProgress
      ? getOfflineProfileModels(profile).find(
          (candidate) => candidate.id === preparationProgress.modelId,
        )
      : null;
  const progressText = preparationProgress
    ? t("freeOfflinePreparing", {
        model: progressModel?.name ?? preparationProgress.modelId,
        index: preparationProgress.modelIndex + 1,
        count: preparationProgress.modelCount,
      })
    : null;
  const missingProfileModels = profile
    ? getOfflineProfileModels(profile).filter(
        (model) => !controller.installs[model.id]?.verified,
      )
    : [];
  const currentDownloadIndex = preparationProgress
    ? missingProfileModels.findIndex(
        (model) => model.id === preparationProgress.modelId,
      )
    : -1;
  const downloadTotalBytes = missingProfileModels.reduce(
    (total, model) => total + model.downloadBytes,
    0,
  );
  const downloadedBeforeCurrent = missingProfileModels
    .slice(0, Math.max(0, currentDownloadIndex))
    .reduce((total, model) => total + model.downloadBytes, 0);
  const currentDownloadProgress = preparationProgress?.download
    ? preparationProgress.download.phase === "downloading"
      ? preparationProgress.download.progress
      : 1
    : null;
  const downloadPercent =
    currentDownloadProgress !== null &&
    currentDownloadIndex >= 0 &&
    downloadTotalBytes > 0
      ? Math.round(
          ((downloadedBeforeCurrent +
            missingProfileModels[currentDownloadIndex].downloadBytes *
              currentDownloadProgress) /
            downloadTotalBytes) *
            100,
        )
      : null;
  const etaSeconds = controller.preparing
    ? controller.preparationEtaSeconds
    : controller.estimatedSetupSeconds;
  const etaLabel =
    etaSeconds === null ? null : formatVoiceEtaDuration(etaSeconds);

  return (
    <Modal
      visible={controller.modalVisible}
      onClose={() => controller.setModalVisible(false)}
      maskClosable={!controller.preparing}
      title={t("freeOfflineTitle")}
      footer={[
        {
          text: t("upgradeToPremium"),
          disabled: controller.preparing,
          onPress: onOpenPremium,
        },
        ...(profile && !ready
          ? [
              {
                text: t("freeOfflineDownloadAndTest"),
                tone: "success" as const,
                loading: controller.preparing,
                disabled: controller.checking || controller.preparing,
                onPress: () => void controller.prepare(),
              },
            ]
          : []),
        ...(ready
          ? [
              {
                text: t("freeOfflineStart"),
                tone: "success" as const,
                disabled: controller.preparing,
                onPress: () => controller.setModalVisible(false),
              },
            ]
          : !profile
            ? [
                {
                  text: t("done"),
                  disabled: controller.preparing,
                  onPress: () => controller.setModalVisible(false),
                },
              ]
            : []),
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          {t("freeOfflineIntro")}
        </Text>
        <Text style={[styles.stepTitle, { color: colors.text }]}>
          {t("freeOfflineLanguagesStep")}
        </Text>
        <View style={styles.languages}>
          {FREE_SPEECH_LANGUAGE_OPTIONS.map((entry) => {
            const selected = controller.selectedLanguage === entry;
            return (
              <Pressable
                key={entry}
                testID={`free-language-${entry}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected, selected }}
                disabled={controller.preparing}
                onPress={() => controller.selectLanguage(entry)}
                style={({ pressed }) => [
                  styles.language,
                  {
                    backgroundColor: selected
                      ? colors.accentSoft
                      : colors.surface,
                    borderColor: selected ? colors.accent : colors.border,
                  },
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={[styles.languageText, { color: colors.text }]}>
                  {getTtsListenLanguageLabel(entry, language)}
                </Text>
                <PhosphorIcon
                  name={selected ? "radio-selected" : "radio-unselected"}
                  size="compact"
                  color={selected ? colors.accent : colors.textMuted}
                />
              </Pressable>
            );
          })}
        </View>

        {profile ? (
          <View style={styles.stepSection}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              {t("freeOfflineModelsStep")}
            </Text>
            <View
              style={[
                styles.profile,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.profileTitle, { color: colors.text }]}>
                {t("freeOfflineProfile")}
              </Text>
              <Text style={[styles.body, { color: colors.textSecondary }]}>
                {profile.stt.name} · {profile.llm.name}
                {profile.thoroughLlm
                  ? ` + ${profile.thoroughLlm.name}`
                  : ""} · {profile.tts?.name ?? t("systemVoice")}
              </Text>
              {!profile.tts ? (
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                  {t("freeOfflineSystemVoiceNote")}
                </Text>
              ) : null}
              <Text style={[styles.hint, { color: colors.textMuted }]}>
                {t("freeOfflineDownloadSize", {
                  size: formatBytes(profile.downloadBytes),
                })}
              </Text>
              {etaLabel ? (
                <Text style={[styles.hint, { color: colors.textMuted }]}>
                  {t("onboardingEstimatedTime", { eta: etaLabel })}
                </Text>
              ) : null}
            </View>
            <FreeOfflineAdvancedOptions
              controller={controller}
              profile={profile}
            />
          </View>
        ) : null}

        {controller.checking ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.status, { color: colors.textSecondary }]}
          >
            {t(
              controller.evaluationStage === "models"
                ? "onboardingMatchingModels"
                : "onDeviceTestingDevice",
            )}
          </Text>
        ) : unavailableText ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.status, { color: colors.danger }]}
          >
            {unavailableText}
          </Text>
        ) : null}
        {progressText ? (
          <View style={styles.progressSection}>
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.status, { color: colors.accent }]}
            >
              {progressText}
            </Text>
            {downloadPercent !== null ? (
              <>
                <View
                  testID="onboarding-download-progress"
                  accessibilityRole="progressbar"
                  accessibilityValue={{
                    min: 0,
                    max: 100,
                    now: downloadPercent,
                  }}
                  style={[
                    styles.progressTrack,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.success,
                        width: `${downloadPercent}%`,
                      },
                    ]}
                  />
                </View>
                {etaLabel ? (
                  <Text style={[styles.hint, { color: colors.textSecondary }]}>
                    {t("onboardingProgress", {
                      percent: downloadPercent,
                      eta: etaLabel,
                    })}
                  </Text>
                ) : null}
              </>
            ) : null}
          </View>
        ) : null}
        {controller.error ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.status, { color: colors.danger }]}
          >
            {controller.error}
          </Text>
        ) : null}
        {ready ? (
          <View style={styles.stepSection}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              {t("freeOfflineStartStep")}
            </Text>
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.status, { color: colors.success }]}
            >
              {t("freeOfflineReady")}
            </Text>
          </View>
        ) : null}
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {t("freeOfflineInternetDisclosure")}
        </Text>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: { maxHeight: 520 },
  content: { gap: 14, paddingBottom: 4 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  stepSection: { gap: 8 },
  stepTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  languages: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  language: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  languageText: { fontFamily: fonts.body, fontSize: 14 },
  pressed: { opacity: 0.72 },
  progressFill: { borderRadius: 4, height: 8 },
  progressSection: { gap: 6 },
  progressTrack: { borderRadius: 4, height: 8, overflow: "hidden" },
  profile: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 5,
    padding: 14,
  },
  profileTitle: { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 21 },
  status: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
});
