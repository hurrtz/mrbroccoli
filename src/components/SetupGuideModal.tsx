import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
import { useLocalization } from "../i18n";
import type { SetupGuideStep } from "../screens/main/setupGuideSupport";
import { useTheme } from "../theme/ThemeContext";
import { SetupGuideFooter } from "./setupGuide/SetupGuideFooter";
import { SetupGuideStepContent } from "./setupGuide/SetupGuideStepContent";
import { styles } from "./setupGuide/styles";
import type { SetupGuideModalProps } from "./setupGuide/types";

const STEP_ORDER: SetupGuideStep[] = [
  "intro",
  "provider",
  "kokoro",
  "voice-test",
  "summary",
];

export const SetupGuideModal = React.memo(function SetupGuideModal({
  visible,
  step,
  providerOptions,
  selectedProvider,
  selectedProviderApiKey,
  currentValidationState,
  resolvedRoutes,
  voiceTest,
  kokoroModel,
  useKokoro,
  onSelectProvider,
  onChangeProviderApiKey,
  onDismiss,
  onBack,
  onContinueFromIntro,
  onValidateProviderKey,
  onContinueFromProvider,
  onToggleKokoro,
  onDownloadKokoro,
  onContinueFromKokoro,
  onVoiceTestAction,
  onResetVoiceTest,
  onContinueFromVoiceTest,
  onFinish,
  onOpenSettings,
  showSettingsShortcutOption = false,
  settingsShortcutVisible = true,
  onChangeSettingsShortcutVisible,
}: SetupGuideModalProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const cardMaxWidth = isLandscape ? Math.min(width - 40, 760) : width;
  const landscapeTopPadding = Math.max(insets.top + 16, 24);
  const landscapeBottomPadding = Math.max(insets.bottom + 16, 24);
  const cardMaxHeight = isLandscape
    ? height - landscapeTopPadding - landscapeBottomPadding
    : undefined;
  const stepIndex = STEP_ORDER.indexOf(step);
  const title =
    step === "intro"
      ? t("setupGuideIntroTitle")
      : step === "provider"
        ? t("setupGuideProviderTitle")
        : step === "kokoro"
          ? t("setupGuideKokoroTitle")
          : step === "voice-test"
            ? t("setupGuideVoiceTestTitle")
            : t("setupGuideSummaryTitle");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      supportedOrientations={APP_MODAL_ORIENTATIONS}
    >
      <View
        accessibilityViewIsModal
        style={[
          styles.overlay,
          {
            paddingTop: isLandscape ? landscapeTopPadding : 0,
            paddingBottom: isLandscape ? landscapeBottomPadding : 0,
            paddingHorizontal: isLandscape ? 18 : 0,
          },
        ]}
      >
        {isLandscape ? (
          <TouchableOpacity
            style={[styles.backdrop, { backgroundColor: colors.overlay }]}
            activeOpacity={1}
            onPress={onDismiss}
            accessible={false}
          />
        ) : null}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoider}
        >
          <View
            testID="setup-guide-card"
            style={[
              styles.card,
              { maxWidth: cardMaxWidth, maxHeight: cardMaxHeight },
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.glow,
                borderRadius: isLandscape ? 18 : 0,
                borderWidth: isLandscape ? 1 : 0,
                paddingTop: isLandscape ? 22 : insets.top + 18,
                paddingBottom: isLandscape ? 22 : insets.bottom + 18,
              },
              !isLandscape ? styles.cardPortrait : null,
            ]}
          >
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text style={[styles.eyebrow, { color: colors.accent }]}>
                  {t("firstRun")}
                </Text>
                <Text style={[styles.title, { color: colors.text }]}>
                  {title}
                </Text>
              </View>
              <TouchableOpacity
                testID="setup-guide-close"
                onPress={onDismiss}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={t("dismiss")}
              >
                <Feather name="x" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.progressRow}>
              {STEP_ORDER.map((entry, index) => {
                const active = index === stepIndex;
                const complete = index < stepIndex;

                return (
                  <View
                    key={entry}
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor:
                          active || complete
                            ? colors.accent
                            : colors.surfaceElevated,
                        borderColor: active
                          ? colors.accent
                          : complete
                            ? colors.borderStrong
                            : colors.border,
                        opacity: active || complete ? 1 : 0.7,
                      },
                    ]}
                  />
                );
              })}
            </View>

            <ScrollView
              style={[
                styles.content,
                isLandscape ? styles.contentLandscape : styles.contentPortrait,
              ]}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <SetupGuideStepContent
                visible={visible}
                step={step}
                providerOptions={providerOptions}
                selectedProvider={selectedProvider}
                selectedProviderApiKey={selectedProviderApiKey}
                currentValidationState={currentValidationState}
                resolvedRoutes={resolvedRoutes}
                voiceTest={voiceTest}
                kokoroModel={kokoroModel}
                useKokoro={useKokoro}
                onSelectProvider={onSelectProvider}
                onChangeProviderApiKey={onChangeProviderApiKey}
                onToggleKokoro={onToggleKokoro}
                onDownloadKokoro={onDownloadKokoro}
                onResetVoiceTest={onResetVoiceTest}
                showSettingsShortcutOption={showSettingsShortcutOption}
                settingsShortcutVisible={settingsShortcutVisible}
                onChangeSettingsShortcutVisible={
                  onChangeSettingsShortcutVisible
                }
              />
            </ScrollView>

            <SetupGuideFooter
              step={step}
              selectedProvider={selectedProvider}
              selectedProviderApiKey={selectedProviderApiKey}
              currentValidationState={currentValidationState}
              resolvedRoutes={resolvedRoutes}
              voiceTest={voiceTest}
              kokoroModel={kokoroModel}
              useKokoro={useKokoro}
              onDismiss={onDismiss}
              onBack={onBack}
              onContinueFromIntro={onContinueFromIntro}
              onValidateProviderKey={onValidateProviderKey}
              onContinueFromProvider={onContinueFromProvider}
              onContinueFromKokoro={onContinueFromKokoro}
              onVoiceTestAction={onVoiceTestAction}
              onContinueFromVoiceTest={onContinueFromVoiceTest}
              onFinish={onFinish}
              onOpenSettings={onOpenSettings}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});
