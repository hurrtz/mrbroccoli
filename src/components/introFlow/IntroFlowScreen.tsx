import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type { AppLanguage } from "../../i18n/localeRegistry";
import type { TranslateFn } from "../../screens/main/shared";
import { fonts } from "../../theme/typography";
import { IntroStepper } from "./IntroStepper";
import {
  INTRO_STEP_CONTENT,
  INTRO_STEPS,
  type IntroStep,
} from "./introSteps";
import { introRadius, introTheme } from "./introTheme";

interface IntroFlowScreenProps {
  language: AppLanguage;
  onClose: () => void;
  onConnectProvider: () => void;
  onInstallLocal: () => void;
  onOpenPremium: () => void;
  onOpenSpeaking: () => void;
  t: TranslateFn;
  visible: boolean;
}

/**
 * The introduction, as a full screen rather than a sheet.
 *
 * Six steps: what the app is, what setup actually requires, the one thing that
 * is required, the two things that are not, and what Premium adds. It owns the
 * whole display because it is the only thing a first-time user should be
 * dealing with, and it carries its own dark palette so it reads as a place to
 * visit rather than a layer over the workspace.
 *
 * Navigation runs in both directions, from the buttons and from the stepper.
 * A one-way flow made the last step a dead end -- someone on step six could
 * neither check what they had skipped nor revisit a decision.
 */
export function IntroFlowScreen({
  language,
  onClose,
  onConnectProvider,
  onInstallLocal,
  onOpenPremium,
  onOpenSpeaking,
  t,
  visible,
}: IntroFlowScreenProps) {
  const [index, setIndex] = React.useState(0);
  const scrollRef = React.useRef<ScrollView>(null);

  // A fresh open starts at the beginning; a reopened introduction should not
  // resume wherever it was abandoned.
  React.useEffect(() => {
    if (visible) {
      setIndex(0);
    }
  }, [visible]);

  // Each step is a new page, so it starts at its own top.
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ animated: false, y: 0 });
  }, [index]);

  const step: IntroStep = INTRO_STEPS[index] ?? INTRO_STEPS[0];
  const StepContent = INTRO_STEP_CONTENT[step];
  const isFirst = index === 0;
  const isLast = index === INTRO_STEPS.length - 1;

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      visible={visible}
    >
      {/* The canvas is dark in both themes, so the status bar has to be
          light regardless of what the app is set to. */}
      <StatusBar style="light" />
      <View style={styles.root}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
          <View style={styles.header}>
            <IntroStepper
              count={INTRO_STEPS.length}
              index={index}
              onSelect={setIndex}
              t={t}
            />
            <Pressable
              accessibilityLabel={t("introBannerDismiss")}
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={styles.close}
              testID="intro-close"
            >
              <PhosphorIcon
                color={introTheme.textSecondary}
                name="close"
                size="control"
              />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.content,
              step === "welcome" ? styles.contentFill : null,
            ]}
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            testID="intro-flow-content"
          >
            <StepContent
              language={language}
              onConnectProvider={onConnectProvider}
              onInstallLocal={onInstallLocal}
              onOpenPremium={onOpenPremium}
              onOpenSpeaking={onOpenSpeaking}
              t={t}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityLabel={t("introBack")}
              accessibilityRole="button"
              accessibilityState={{ disabled: isFirst }}
              disabled={isFirst}
              onPress={() => setIndex((current) => Math.max(0, current - 1))}
              style={[styles.navButton, isFirst ? styles.navDisabled : null]}
              testID="intro-back"
            >
              <PhosphorIcon
                color={isFirst ? introTheme.textMuted : introTheme.text}
                name="left"
                size="control"
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={
                isLast
                  ? onClose
                  : () =>
                      setIndex((current) =>
                        Math.min(INTRO_STEPS.length - 1, current + 1),
                      )
              }
              style={({ pressed }) => [
                styles.primary,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              testID="intro-next"
            >
              <Text style={styles.primaryLabel}>
                {isLast ? t("introFinish") : t("introNext")}
              </Text>
              {isLast ? null : (
                <PhosphorIcon
                  color={introTheme.onAccent}
                  name="right"
                  size="control"
                />
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  close: {
    alignItems: "center",
    backgroundColor: introTheme.panel,
    borderColor: introTheme.border,
    borderRadius: introRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    top: 4,
    width: 40,
  },
  contentFill: {
    flexGrow: 1,
  },
  content: {
    gap: 16,
    paddingBottom: 28,
    paddingHorizontal: 22,
    paddingTop: 6,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingBottom: 8,
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  header: {
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 22,
  },
  navButton: {
    alignItems: "center",
    backgroundColor: introTheme.panel,
    borderColor: introTheme.border,
    borderRadius: introRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  navDisabled: {
    // Dimmed, but the border stays so it still reads as a control that is
    // currently unavailable rather than a half-drawn circle.
    backgroundColor: "transparent",
    opacity: 0.55,
  },
  primary: {
    alignItems: "center",
    backgroundColor: introTheme.accent,
    borderRadius: introRadius.pill,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 56,
  },
  primaryLabel: {
    color: introTheme.onAccent,
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
  },
  root: {
    backgroundColor: introTheme.canvas,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
