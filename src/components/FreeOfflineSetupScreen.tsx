import React from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getTtsListenLanguageLabel } from "../constants/localTts";
import {
  FREE_SPEECH_LANGUAGE_OPTIONS,
  type FreeSpeechLanguage,
} from "../constants/speechLanguages";
import { useLocalization } from "../i18n";
import type { FreeOfflineModeController } from "../screens/main/useFreeOfflineMode";
import { getOfflineProfileModels } from "../services/offlineProfile";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import type { VoicePreviewRequest } from "../types";
import { formatVoiceEtaDuration } from "../utils/voiceEta";
import {
  APP_HEADER_MIN_HEIGHT,
  APP_HEADER_PADDING_BOTTOM,
  APP_HEADER_PADDING_TOP,
  AppWordmark,
} from "./AppWordmark";
import { FreeOfflineAdvancedOptions } from "./FreeOfflineAdvancedOptions";
import { FreeOfflineProfileCard } from "./FreeOfflineProfileCard";
import { Picker } from "./Picker";

export function FreeOfflineSetupScreen({
  controller,
  onOpenPremium,
  onPreviewVoice,
  onStopPreviewVoice,
}: {
  controller: FreeOfflineModeController;
  onOpenPremium?: () => void;
  onPreviewVoice: (request: VoicePreviewRequest) => Promise<void>;
  onStopPreviewVoice: () => Promise<void>;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { language, t } = useLocalization();
  const { selection, preparationProgress } = controller;
  const languageSelected = controller.selectedLanguage !== null;
  const activeProfile =
    languageSelected && selection?.status === "ready"
      ? selection.profile
      : null;
  const recommendedProfile =
    languageSelected && controller.recommendedSelection?.status === "ready"
      ? controller.recommendedSelection.profile
      : null;
  const customProfile =
    languageSelected && controller.customSelection?.status === "ready"
      ? controller.customSelection.profile
      : null;
  const languageOptions = React.useMemo(
    () =>
      FREE_SPEECH_LANGUAGE_OPTIONS.map((value) => ({
        value,
        label: getTtsListenLanguageLabel(value, language),
      })),
    [language],
  );

  const progressAnnouncement = React.useMemo(() => {
    if (!preparationProgress) {
      return null;
    }
    if (preparationProgress.action === "cooling") {
      return t("freeOfflineCooling");
    }
    const model = activeProfile
      ? getOfflineProfileModels(activeProfile).find(
          (candidate) => candidate.id === preparationProgress.modelId,
        )
      : null;
    return t("freeOfflinePreparing", {
      model: model?.name ?? preparationProgress.modelId,
      index: preparationProgress.stepIndex + 1,
      count: preparationProgress.stepCount,
    });
  }, [activeProfile, preparationProgress, t]);

  React.useEffect(() => {
    if (progressAnnouncement) {
      AccessibilityInfo.announceForAccessibility(progressAnnouncement);
    }
  }, [progressAnnouncement]);

  if (!controller.setupVisible) {
    return null;
  }

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
    activeProfile && preparationProgress
      ? getOfflineProfileModels(activeProfile).find(
          (candidate) => candidate.id === preparationProgress.modelId,
        )
      : null;
  const progressText = preparationProgress
    ? preparationProgress.action === "cooling"
      ? t("freeOfflineCooling")
      : t("freeOfflinePreparing", {
          model: progressModel?.name ?? preparationProgress.modelId,
          index: preparationProgress.stepIndex + 1,
          count: preparationProgress.stepCount,
        })
    : null;
  const currentDownloadProgress =
    preparationProgress?.action === "downloading"
      ? preparationProgress.stepProgress
      : null;
  const downloadPercent =
    currentDownloadProgress !== null
      ? Math.round(currentDownloadProgress * 100)
      : null;
  const etaSeconds = controller.preparing
    ? controller.preparationEtaSeconds
    : controller.estimatedSetupSeconds;
  const etaLabel =
    etaSeconds === null ? null : formatVoiceEtaDuration(etaSeconds);
  const primaryAction = activeProfile
    ? controller.readiness?.ready === true
      ? {
          disabled: false,
          label: t("freeOfflineStart"),
          loading: false,
          onPress: controller.start,
        }
      : {
          disabled: controller.preparing,
          label: t("freeOfflineStart"),
          loading: controller.preparing,
          onPress: () => void controller.prepare(),
        }
    : selection?.status === "unavailable" && !controller.checking
      ? {
          disabled: false,
          label: t("retry"),
          loading: false,
          onPress: () => void controller.refresh(),
        }
      : {
          disabled: true,
          label: t("freeOfflineStart"),
          loading: false,
          onPress: () => undefined,
        };

  return (
    <View testID="free-offline-setup-screen" style={styles.screen}>
      <View testID="free-offline-header" style={styles.header}>
        <AppWordmark
          color={colors.text}
          name={t("appName")}
          testID="free-offline-wordmark"
        />
      </View>

      <ScrollView
        testID="free-offline-content"
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          {t("freeOfflineIntro")}
        </Text>
        <Picker
          testID="free-language-picker"
          label={t("freeOfflineLanguagesStep")}
          value={controller.selectedLanguage ?? ""}
          options={languageOptions}
          onChange={(value) =>
            controller.selectLanguage(value as FreeSpeechLanguage)
          }
          disabled={controller.preparing}
          hideDropdownLabel
          hideLabel
          placeholder={t("freeOfflineLanguagesStep")}
          containerStyle={styles.languagePicker}
        />

        {languageSelected && controller.checking && !recommendedProfile ? (
          <View
            testID="onboarding-recommendation-spinner"
            style={styles.matching}
          >
            <ActivityIndicator size="small" color={colors.success} />
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.status, { color: colors.textSecondary }]}
            >
              {t(
                controller.evaluationStage === "models" ||
                  controller.evaluationStage === "plan"
                  ? "onboardingMatchingModels"
                  : "onDeviceTestingDevice",
              )}
            </Text>
          </View>
        ) : null}

        {recommendedProfile ? (
          <View
            testID="onboarding-recommendation-section"
            style={styles.stepSection}
          >
            <FreeOfflineProfileCard
              estimatedSetupSeconds={
                controller.recommendedEstimatedSetupSeconds
              }
              headerTestID="onboarding-recommendation-header"
              profile={recommendedProfile}
              ready={controller.recommendedReadiness?.ready === true}
              testID="onboarding-recommendation-card"
              title={t("freeOfflineModelsStep")}
              visuallyDisabled={controller.advancedOptionsEnabled}
            />
            {customProfile ? (
              <FreeOfflineAdvancedOptions
                controller={controller}
                onPreviewVoice={onPreviewVoice}
                onStopPreviewVoice={onStopPreviewVoice}
                profile={customProfile}
              />
            ) : null}
          </View>
        ) : null}

        {unavailableText ? (
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
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              {t("onboardingStepsRemaining", {
                remaining: preparationProgress?.stepsRemaining ?? 0,
                count: preparationProgress?.stepCount ?? 0,
              })}
            </Text>
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
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {t("freeOfflineInternetDisclosure")}
        </Text>
      </ScrollView>

      <View
        testID="free-offline-footer"
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            paddingBottom: Math.max(10, insets.bottom),
          },
        ]}
      >
        <Pressable
          testID="free-offline-primary-action"
          accessibilityRole="button"
          accessibilityState={{
            busy: primaryAction.loading,
            disabled: primaryAction.disabled,
          }}
          disabled={primaryAction.disabled}
          onPress={primaryAction.onPress}
          style={({ pressed }) => [
            styles.primaryAction,
            {
              backgroundColor: activeProfile
                ? colors.success
                : colors.surface,
              borderColor: activeProfile ? colors.success : colors.border,
            },
            pressed ? styles.pressed : null,
            primaryAction.disabled ? styles.disabled : null,
          ]}
        >
          {primaryAction.loading ? (
            <ActivityIndicator
              testID="free-offline-primary-action-loading"
              size="small"
              color={colors.onActiveControl}
            />
          ) : null}
          <Text
            style={[
              styles.primaryActionText,
              {
                color: activeProfile
                  ? colors.onActiveControl
                  : colors.accent,
              },
            ]}
          >
            {primaryAction.label}
          </Text>
        </Pressable>
        {onOpenPremium ? (
          // Escape hatch: unsupported hardware, storage failures, or users
          // who already own provider keys must never be trapped behind the
          // local setup with no route to the Premium purchase.
          <Pressable
            testID="free-offline-premium-link"
            accessibilityRole="button"
            onPress={onOpenPremium}
            style={({ pressed }) => [
              styles.premiumLink,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={[styles.premiumLinkText, { color: colors.accent }]}>
              {t("freeOfflinePremiumEscape")}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0 },
  header: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: APP_HEADER_MIN_HEIGHT,
    paddingBottom: APP_HEADER_PADDING_BOTTOM,
    paddingTop: APP_HEADER_PADDING_TOP,
  },
  scroll: { flex: 1, minHeight: 0 },
  content: { gap: 20, paddingBottom: 20 },
  intro: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  stepSection: { gap: 8, marginTop: 8 },
  stepTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  languagePicker: { marginBottom: 0 },
  matching: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 52,
    paddingVertical: 8,
  },
  pressed: { opacity: 0.72 },
  disabled: { opacity: 0.5 },
  progressFill: { borderRadius: 4, height: 8 },
  progressSection: { gap: 6 },
  progressTrack: { borderRadius: 4, height: 8, overflow: "hidden" },
  status: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  primaryAction: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "100%",
  },
  primaryActionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  premiumLink: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    minHeight: 44,
  },
  premiumLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
});
