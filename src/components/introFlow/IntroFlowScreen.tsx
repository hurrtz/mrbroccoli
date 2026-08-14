import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
import { getAppLocale, type AppLanguage } from "../../i18n/localeRegistry";
import type { TranslateFn } from "../../screens/main/shared";
import { fonts } from "../../theme/typography";
import { IntroStepper } from "./IntroStepper";
import type { AutoSetupJobState } from "../autoSetup/types";
import {
  INTRO_STEP_CONTENT,
  INTRO_STEPS,
  type IntroTestTurnState,
} from "./introSteps";
import { introRadius, useIntroTheme } from "./introTheme";

interface IntroFlowScreenProps {
  autoSetup: AutoSetupJobState;
  /** True until the introduction has been completed once on this install. */
  firstRun: boolean;
  language: AppLanguage;
  /** Prevent native model inspection in the isolated store-promo fixture. */
  modelStateReadsSuspended?: boolean;
  onClose: () => void;
  /** Done on the last step: closes the flow and records completion. */
  onComplete: () => void;
  onConnectProvider: () => void;
  onInstallLocal: () => void;
  /** Native Modal teardown boundary for actions that open another modal. */
  onDismiss: () => void;
  onOpenStt: () => void;
  onOpenTts: () => void;
  /** Changes only when the banner starts a genuinely new walkthrough visit. */
  sessionId: number;
  t: TranslateFn;
  testTurn: IntroTestTurnState;
  /** Whether a reasoning model is actually running — step two's gate. */
  thinkingReady: boolean;
  visible: boolean;
}

/**
 * The introduction, as a full screen rather than a sheet.
 *
 * Three steps: a welcome that demonstrates instead of describing, one setup
 * screen with a single green path, and a live test where the user judges the
 * result. It owns the whole display because it is the only thing a first-time
 * user should be dealing with, and follows the active app appearance so it
 * remains part of the same product.
 *
 * First-run integrity: on a first run there is no close control -- the three
 * steps are the way in. Step three stays unreachable until a reasoning model
 * is actually running, then ends in a Done that stays disabled until one
 * successful test turn. A re-entry restores the close control on steps one
 * and two and unlocks both gates; step three never shows close -- Done is the
 * exit.
 */
export function IntroFlowScreen({
  autoSetup,
  firstRun,
  language,
  modelStateReadsSuspended = false,
  onClose,
  onComplete,
  onConnectProvider,
  onInstallLocal,
  onDismiss,
  onOpenStt,
  onOpenTts,
  sessionId,
  t,
  testTurn,
  thinkingReady,
  visible,
}: IntroFlowScreenProps) {
  const theme = useIntroTheme();
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const direction = getAppLocale(language).direction;
  const isRtl = direction === "rtl";
  const [index, setIndex] = React.useState(0);
  // Remounts the steps on each open so per-step state -- the manual switch,
  // the played flag, the preview language -- resets with the flow.
  const [openNonce, setOpenNonce] = React.useState(0);
  const pagerRef = React.useRef<ScrollView>(null);
  const alignedPagerLayoutRef = React.useRef<string | null>(null);
  const lastSessionIdRef = React.useRef<number | null>(null);
  const finalIndex = INTRO_STEPS.length - 1;
  const maxReachableIndex = firstRun && !thinkingReady ? 1 : finalIndex;

  const getPagerOffset = React.useCallback(
    (logicalIndex: number) =>
      (isRtl ? maxReachableIndex - logicalIndex : logicalIndex) * width,
    [isRtl, maxReachableIndex, width],
  );
  const pagerLayoutKey = `${visible ? "open" : "closed"}:${direction}:${maxReachableIndex}:${width}`;

  // A fresh open starts at the beginning; a reopened introduction should not
  // resume wherever it was abandoned. A serialized Settings or purchase
  // handoff keeps the same session ID and therefore preserves its Setup step.
  React.useLayoutEffect(() => {
    const opening = visible && lastSessionIdRef.current !== sessionId;

    if (opening) {
      lastSessionIdRef.current = sessionId;
      setIndex(0);
      setOpenNonce((nonce) => nonce + 1);
      pagerRef.current?.scrollTo({ animated: false, x: getPagerOffset(0) });
      alignedPagerLayoutRef.current = pagerLayoutKey;
    } else if (!visible) {
      alignedPagerLayoutRef.current = null;
    }
  }, [getPagerOffset, pagerLayoutKey, sessionId, visible]);

  const clampToReachableIndex = React.useCallback(
    (next: number) => Math.max(0, Math.min(maxReachableIndex, next)),
    [maxReachableIndex],
  );

  const goTo = React.useCallback(
    (next: number) => {
      const clamped = clampToReachableIndex(next);
      setIndex(clamped);
      pagerRef.current?.scrollTo({
        animated: true,
        x: getPagerOffset(clamped),
      });
    },
    [clampToReachableIndex, getPagerOffset],
  );

  // Readiness can add or remove a page while the flow is open. RTL renders the
  // physical pages in reverse order, so the same logical step has a different
  // native offset when that boundary changes. Realign once per layout shape.
  React.useLayoutEffect(() => {
    if (!visible || alignedPagerLayoutRef.current === pagerLayoutKey) {
      return;
    }

    alignedPagerLayoutRef.current = pagerLayoutKey;
    const reachableIndex = clampToReachableIndex(index);
    setIndex(reachableIndex);
    pagerRef.current?.scrollTo({
      animated: false,
      x: getPagerOffset(reachableIndex),
    });
  }, [clampToReachableIndex, getPagerOffset, index, pagerLayoutKey, visible]);

  const isFirst = index === 0;
  const isLast = index === finalIndex;
  const showClose = !firstRun && !isLast;
  const forwardDisabled = index === 1 && firstRun && !thinkingReady;
  const doneDisabled =
    firstRun && (!thinkingReady || testTurn.turn?.successful !== true);

  return (
    <Modal
      animationType="slide"
      onDismiss={onDismiss}
      onRequestClose={firstRun ? undefined : onClose}
      presentationStyle="fullScreen"
      testID="intro-flow-modal"
      visible={visible}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {/* A fullScreen modal is its own view controller on iOS, outside the
          provider Expo Router mounts, so insets resolved to zero there: the
          header sat under the Dynamic Island and the footer under the home
          indicator. The flow carries its own provider so it measures the
          window it is actually presented in. */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <View
          style={[styles.root, { backgroundColor: theme.canvas, direction }]}
          testID="intro-flow-root"
        >
          <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
            <View style={styles.header}>
              <Pressable
                accessibilityLabel={t("introBack")}
                accessibilityRole="button"
                accessibilityState={{ disabled: isFirst }}
                disabled={isFirst}
                onPress={() => goTo(index - 1)}
                style={[
                  styles.headerButton,
                  isFirst ? styles.headerHidden : null,
                ]}
                testID="intro-back"
              >
                {/* Bare glyph on the 44pt target: the intro's nav controls
                    carry no filled faces, and back is a full arrow. */}
                <PhosphorIcon
                  color={theme.textSecondary}
                  name={isRtl ? "arrow-right" : "arrow-left"}
                  size="navigation"
                />
              </Pressable>

              <IntroStepper
                count={INTRO_STEPS.length}
                index={index}
                maxReachableIndex={maxReachableIndex}
                onSelect={goTo}
                t={t}
              />

              {showClose ? (
                <Pressable
                  accessibilityLabel={t("introBannerDismiss")}
                  accessibilityRole="button"
                  onPress={onClose}
                  style={styles.headerButton}
                  testID="intro-close"
                >
                  <PhosphorIcon
                    color={theme.textSecondary}
                    name="close"
                    size="navigation"
                  />
                </Pressable>
              ) : (
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                  style={styles.headerButton}
                />
              )}
            </View>

            <ScrollView
              contentOffset={{ x: getPagerOffset(0), y: 0 }}
              contentContainerStyle={styles.pagerContent}
              horizontal
              onMomentumScrollEnd={(event) => {
                const physicalIndex = Math.round(
                  event.nativeEvent.contentOffset.x / Math.max(1, width),
                );
                const requestedIndex = isRtl
                  ? maxReachableIndex - physicalIndex
                  : physicalIndex;
                const reachableIndex = clampToReachableIndex(requestedIndex);
                setIndex(reachableIndex);
                if (reachableIndex !== requestedIndex) {
                  pagerRef.current?.scrollTo({
                    animated: true,
                    x: getPagerOffset(reachableIndex),
                  });
                }
              }}
              pagingEnabled
              ref={pagerRef}
              showsHorizontalScrollIndicator={false}
              style={styles.pager}
              testID="intro-flow-content"
            >
              {(isRtl
                ? [...INTRO_STEPS.slice(0, maxReachableIndex + 1)].reverse()
                : INTRO_STEPS.slice(0, maxReachableIndex + 1)
              ).map((step) => {
                const StepContent = INTRO_STEP_CONTENT[step];
                return (
                  <ScrollView
                    contentContainerStyle={[
                      styles.page,
                      step === "welcome" || step === "try"
                        ? styles.pageFill
                        : null,
                    ]}
                    key={`${step}-${openNonce}`}
                    showsVerticalScrollIndicator={false}
                    style={{ direction, width }}
                    testID={`intro-page-${step}`}
                  >
                    <StepContent
                      autoSetup={autoSetup}
                      language={language}
                      modelStateReadsSuspended={modelStateReadsSuspended}
                      onConnectProvider={onConnectProvider}
                      onInstallLocal={onInstallLocal}
                      onOpenStt={onOpenStt}
                      onOpenTts={onOpenTts}
                      t={t}
                      testTurn={testTurn}
                      thinkingReady={thinkingReady}
                    />
                  </ScrollView>
                );
              })}
            </ScrollView>

            {isLast ? (
              <View style={styles.doneFooter}>
                <Pressable
                  accessibilityLabel={t("done")}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: doneDisabled }}
                  disabled={doneDisabled}
                  onPress={onComplete}
                  style={({ pressed }) => [
                    styles.done,
                    {
                      backgroundColor: theme.accent,
                      opacity: doneDisabled ? 0.4 : pressed ? 0.85 : 1,
                    },
                  ]}
                  testID="intro-done"
                >
                  <Text style={[styles.doneLabel, { color: theme.onAccent }]}>
                    {t("done")}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.footer}>
                <Pressable
                  accessibilityLabel={t("introNext")}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: forwardDisabled }}
                  disabled={forwardDisabled}
                  onPress={() => goTo(index + 1)}
                  style={({ pressed }) => [
                    styles.primary,
                    {
                      backgroundColor: theme.accent,
                      opacity: forwardDisabled ? 0.4 : pressed ? 0.85 : 1,
                    },
                  ]}
                  testID="intro-next"
                >
                  <PhosphorIcon
                    color={theme.onAccent}
                    name={isRtl ? "left" : "right"}
                    size="navigation"
                  />
                </Pressable>
              </View>
            )}
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  done: {
    alignItems: "center",
    borderRadius: introRadius.control,
    justifyContent: "center",
    minHeight: 48,
    width: "100%",
  },
  doneFooter: {
    paddingBottom: 14,
    paddingHorizontal: 22,
    paddingTop: 6,
  },
  doneLabel: {
    fontFamily: fonts.display,
    fontSize: 15,
  },
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
    height: 44,
    justifyContent: "center",
    margin: -2,
    width: 44,
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
  pager: {
    direction: "ltr",
  },
  pagerContent: {
    direction: "ltr",
  },
  primary: {
    alignItems: "center",
    borderRadius: introRadius.iconButton,
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
