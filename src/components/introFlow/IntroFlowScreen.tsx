import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "../../theme/ThemeContext";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type { AppLanguage } from "../../i18n/localeRegistry";
import type { TranslateFn } from "../../screens/main/shared";
import { IntroStepper } from "./IntroStepper";
import type { AutoSetupJobState } from "../autoSetup/types";
import { INTRO_STEP_CONTENT, INTRO_STEPS } from "./introSteps";
import { introRadius, useIntroTheme } from "./introTheme";

interface IntroFlowScreenProps {
  autoSetup: AutoSetupJobState;
  language: AppLanguage;
  onClose: () => void;
  onConnectProvider: () => void;
  onInstallLocal: () => void;
  onOpenPremium: () => void;
  onOpenStt: () => void;
  onOpenTts: () => void;
  t: TranslateFn;
  visible: boolean;
}

/**
 * The introduction, as a full screen rather than a sheet.
 *
 * Seven steps: what the app is, what setup actually requires, the automatic
 * setup offer, the one thing that is required, the two things that are not,
 * and what Premium adds. It owns the whole display because it is the only
 * thing a first-time user should be dealing with, and follows the active app
 * appearance so it remains part of the same product.
 *
 * Steps live in a horizontally paged scroll view, so they can be swiped as well
 * as driven from the header arrow and the stepper. Every route through the flow
 * runs in both directions -- a one-way path made the last step a dead end.
 */
export function IntroFlowScreen({
  autoSetup,
  language,
  onClose,
  onConnectProvider,
  onInstallLocal,
  onOpenPremium,
  onOpenStt,
  onOpenTts,
  t,
  visible,
}: IntroFlowScreenProps) {
  const theme = useIntroTheme();
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const pagerRef = React.useRef<ScrollView>(null);

  // A fresh open starts at the beginning; a reopened introduction should not
  // resume wherever it was abandoned.
  React.useEffect(() => {
    if (visible) {
      setIndex(0);
      pagerRef.current?.scrollTo({ animated: false, x: 0 });
    }
  }, [visible]);

  const goTo = React.useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(INTRO_STEPS.length - 1, next));
      setIndex(clamped);
      pagerRef.current?.scrollTo({ animated: true, x: clamped * width });
    },
    [width],
  );

  const isFirst = index === 0;
  const isLast = index === INTRO_STEPS.length - 1;

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      visible={visible}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {/* A fullScreen modal is its own view controller on iOS, outside the
          provider Expo Router mounts, so insets resolved to zero there: the
          header sat under the Dynamic Island and the footer under the home
          indicator. The flow carries its own provider so it measures the
          window it is actually presented in. */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <View style={[styles.root, { backgroundColor: theme.canvas }]}>
          <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
            <View style={styles.header}>
              <Pressable
                accessibilityLabel={t("introBack")}
                accessibilityRole="button"
                accessibilityState={{ disabled: isFirst }}
                disabled={isFirst}
                hitSlop={8}
                onPress={() => goTo(index - 1)}
                style={[
                  styles.headerButton,
                  { backgroundColor: theme.panel, borderColor: theme.border },
                  isFirst ? styles.headerHidden : null,
                ]}
                testID="intro-back"
              >
                <PhosphorIcon
                  color={theme.textSecondary}
                  name="left"
                  size="control"
                />
              </Pressable>

              <IntroStepper
                count={INTRO_STEPS.length}
                index={index}
                onSelect={goTo}
                t={t}
              />

              <Pressable
                accessibilityLabel={t("introBannerDismiss")}
                accessibilityRole="button"
                hitSlop={8}
                onPress={onClose}
                style={[
                  styles.headerButton,
                  { backgroundColor: theme.panel, borderColor: theme.border },
                ]}
                testID="intro-close"
              >
                <PhosphorIcon
                  color={theme.textSecondary}
                  name="close"
                  size="control"
                />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              onMomentumScrollEnd={(event) => {
                setIndex(
                  Math.round(
                    event.nativeEvent.contentOffset.x / Math.max(1, width),
                  ),
                );
              }}
              pagingEnabled
              ref={pagerRef}
              showsHorizontalScrollIndicator={false}
              testID="intro-flow-content"
            >
              {INTRO_STEPS.map((step) => {
                const StepContent = INTRO_STEP_CONTENT[step];
                return (
                  <ScrollView
                    contentContainerStyle={[
                      styles.page,
                      step === "welcome" ? styles.pageFill : null,
                    ]}
                    key={step}
                    showsVerticalScrollIndicator={false}
                    style={{ width }}
                  >
                    <StepContent
                      autoSetup={autoSetup}
                      language={language}
                      onConnectProvider={onConnectProvider}
                      onInstallLocal={onInstallLocal}
                      onOpenPremium={onOpenPremium}
                      onOpenStt={onOpenStt}
                      onOpenTts={onOpenTts}
                      t={t}
                    />
                  </ScrollView>
                );
              })}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                accessibilityLabel={isLast ? t("done") : t("introNext")}
                accessibilityRole="button"
                onPress={isLast ? onClose : () => goTo(index + 1)}
                style={({ pressed }) => [
                  styles.primary,
                  {
                    backgroundColor: theme.accent,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                testID={isLast ? "intro-done" : "intro-next"}
              >
                <PhosphorIcon
                  color={theme.onAccent}
                  name={isLast ? "check" : "right"}
                  size="navigation"
                />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 18,
  },
  headerButton: {
    alignItems: "center",
    borderRadius: introRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  headerHidden: {
    opacity: 0,
  },
  page: {
    gap: 16,
    paddingBottom: 24,
    paddingHorizontal: 22,
    paddingTop: 6,
  },
  pageFill: {
    flexGrow: 1,
  },
  primary: {
    alignItems: "center",
    borderRadius: introRadius.pill,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
