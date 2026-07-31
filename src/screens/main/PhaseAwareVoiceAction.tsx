import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../../design-system/PhosphorIcon";
import React from "react";
import {
  AccessibilityInfo,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Colors, getAccessibleForeground } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { InputMode, VoiceTimingProgress, VoiceVisualPhase } from "../../types";
import { getVoiceEta } from "../../utils/voiceEta";

import { TranslateFn } from "./shared";

interface PhaseAwareVoiceActionProps {
  colors: Colors;
  driveSilenceCountdownSeconds?: number | null;
  driveVoiceActive?: boolean;
  inputMode: InputMode;
  layout: "portrait" | "landscape";
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onStopPlayback: () => void;
  playbackPaused?: boolean;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  speechStartProgress?: VoiceTimingProgress | null;
  statusLabel: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}

function getPhaseIcon(
  visualPhase: VoiceVisualPhase,
  playbackPaused: boolean,
): PhosphorIconName {
  switch (visualPhase) {
    case "recording":
      return "stop";
    case "transcribing":
      return "file-text";
    case "thinking-briefly":
      return "thunderbolt";
    case "searching":
      return "global";
    case "thinking":
      return "robot";
    case "synthesizing":
      return "customer-service";
    case "speaking":
      return playbackPaused ? "play-circle" : "pause";
    default:
      return "audio";
  }
}

function getPhaseColor(visualPhase: VoiceVisualPhase, colors: Colors) {
  switch (visualPhase) {
    case "recording":
      return colors.phaseRecordingTrack;
    case "transcribing":
      return colors.phaseTranscribing;
    case "thinking-briefly":
      return colors.phaseThinkingBriefly;
    case "searching":
      return colors.phaseSearching;
    case "thinking":
      return colors.phaseThinking;
    case "synthesizing":
      return colors.phaseSynthesizing;
    case "speaking":
      return colors.phaseSpeaking;
    default:
      return colors.bubbleUser;
  }
}

function getPhaseCopy(
  visualPhase: VoiceVisualPhase,
  inputMode: InputMode,
  playbackPaused: boolean,
  t: TranslateFn,
) {
  if (visualPhase === "recording") {
    return {
      prompt: t("yourTurn"),
      title:
        inputMode === "push-to-talk"
          ? t("pushToTalk")
          : inputMode === "drive-session"
            ? t("driveSession")
            : t("toggleToTalk"),
      detail:
        inputMode === "push-to-talk"
          ? t("keepPressing")
          : inputMode === "drive-session"
            ? t("listening")
            : t("tapWhenDone"),
    };
  }

  const title =
    visualPhase === "transcribing"
      ? t("parsing")
      : visualPhase === "searching"
        ? t("searching")
        : visualPhase === "synthesizing"
          ? t("converting")
          : visualPhase === "speaking"
            ? playbackPaused
              ? t("paused")
              : t("speaking")
            : t("thinking");

  return {
    prompt: t("pleaseWait"),
    title,
    detail: null,
  };
}

const PHASE_ICON_SIZE = 42;
const TIMELINE_BORDER_WIDTH = 3;
const TIMELINE_BORDER_INSET = TIMELINE_BORDER_WIDTH / 2;
const AnimatedPath = Animated.createAnimatedComponent(Path);

function getRoundedRectPerimeter(
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));

  return 2 * (width + height - 4 * safeRadius) + 2 * Math.PI * safeRadius;
}

function getTopCenterRoundedRectHalfPaths(
  width: number,
  height: number,
  radius: number,
) {
  const left = TIMELINE_BORDER_INSET;
  const top = TIMELINE_BORDER_INSET;
  const right = width - TIMELINE_BORDER_INSET;
  const bottom = height - TIMELINE_BORDER_INSET;
  const safeRadius = Math.max(
    0,
    Math.min(radius, (right - left) / 2, (bottom - top) / 2),
  );
  const centerX = width / 2;

  return {
    clockwise: [
      `M ${centerX} ${top}`,
      `H ${right - safeRadius}`,
      `A ${safeRadius} ${safeRadius} 0 0 1 ${right} ${top + safeRadius}`,
      `V ${bottom - safeRadius}`,
      `A ${safeRadius} ${safeRadius} 0 0 1 ${right - safeRadius} ${bottom}`,
      `H ${centerX}`,
    ].join(" "),
    counterclockwise: [
      `M ${centerX} ${top}`,
      `H ${left + safeRadius}`,
      `A ${safeRadius} ${safeRadius} 0 0 0 ${left} ${top + safeRadius}`,
      `V ${bottom - safeRadius}`,
      `A ${safeRadius} ${safeRadius} 0 0 0 ${left + safeRadius} ${bottom}`,
      `H ${centerX}`,
    ].join(" "),
  };
}

function SpeechStartTimelineBorder({
  colors,
  height,
  phaseForeground,
  progress,
  width,
}: {
  colors: Colors;
  height: number;
  phaseForeground: string;
  progress: VoiceTimingProgress | null | undefined;
  width: number;
}) {
  const expectedProgress = useSharedValue(0);
  const overtimeProgress = useSharedValue(0);
  const rectWidth = Math.max(0, width - TIMELINE_BORDER_WIDTH);
  const rectHeight = Math.max(0, height - TIMELINE_BORDER_WIDTH);
  const radius = Math.max(0, 17 - TIMELINE_BORDER_INSET);
  const perimeter = getRoundedRectPerimeter(rectWidth, rectHeight, radius);
  const halfPerimeter = perimeter / 2;
  const paths = getTopCenterRoundedRectHalfPaths(width, height, radius);

  React.useEffect(() => {
    cancelAnimation(expectedProgress);
    cancelAnimation(overtimeProgress);
    expectedProgress.value = 0;
    overtimeProgress.value = 0;

    if (!progress) {
      return;
    }

    const estimatedMs = Math.max(1000, progress.estimatedMs);
    const elapsedMs = Math.max(0, Date.now() - progress.startedAt);
    const expectedElapsedMs = Math.min(elapsedMs, estimatedMs);
    const overtimeElapsedMs = Math.max(0, elapsedMs - estimatedMs);
    const expectedFraction = expectedElapsedMs / estimatedMs;
    const overtimeFraction = Math.min(1, overtimeElapsedMs / estimatedMs);
    const expectedRemainingMs = Math.max(0, estimatedMs - elapsedMs);
    const overtimeRemainingMs = Math.max(0, estimatedMs - overtimeElapsedMs);

    expectedProgress.value = expectedFraction;
    overtimeProgress.value = overtimeFraction;

    if (expectedFraction < 1) {
      expectedProgress.value = withTiming(1, {
        duration: expectedRemainingMs,
        easing: Easing.linear,
      });
      overtimeProgress.value = withDelay(
        expectedRemainingMs,
        withTiming(1, {
          duration: estimatedMs,
          easing: Easing.linear,
        }),
      );
    } else if (overtimeFraction < 1) {
      overtimeProgress.value = withTiming(1, {
        duration: overtimeRemainingMs,
        easing: Easing.linear,
      });
    }

    return () => {
      cancelAnimation(expectedProgress);
      cancelAnimation(overtimeProgress);
    };
  }, [
    expectedProgress,
    overtimeProgress,
    progress?.estimatedMs,
    progress?.startedAt,
  ]);

  const expectedAnimatedProps = useAnimatedProps(() => ({
    // Both halves cover half the perimeter over the full ETA, so the two
    // leading edges move symmetrically at half the former one-way speed.
    strokeDashoffset: halfPerimeter * expectedProgress.value,
  }));
  const overtimeAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: halfPerimeter * (1 - overtimeProgress.value),
  }));

  if (!progress || width <= 0 || height <= 0 || perimeter <= 0) {
    return null;
  }

  return (
    <Svg
      pointerEvents="none"
      style={styles.timelineOverlay}
      width={width}
      height={height}
    >
      <Path
        testID="voice-stage-speech-timeline-track"
        d={paths.clockwise}
        fill="none"
        opacity={0.32}
        stroke={phaseForeground}
        strokeWidth={TIMELINE_BORDER_WIDTH}
      />
      <Path
        testID="voice-stage-speech-timeline-track-counterclockwise"
        d={paths.counterclockwise}
        fill="none"
        opacity={0.32}
        stroke={phaseForeground}
        strokeWidth={TIMELINE_BORDER_WIDTH}
      />
      <AnimatedPath
        testID="voice-stage-speech-timeline"
        animatedProps={expectedAnimatedProps}
        d={paths.clockwise}
        fill="none"
        stroke={phaseForeground}
        strokeWidth={TIMELINE_BORDER_WIDTH}
        strokeDasharray={[halfPerimeter, halfPerimeter]}
        strokeLinecap="round"
      />
      <AnimatedPath
        testID="voice-stage-speech-timeline-counterclockwise"
        animatedProps={expectedAnimatedProps}
        d={paths.counterclockwise}
        fill="none"
        stroke={phaseForeground}
        strokeWidth={TIMELINE_BORDER_WIDTH}
        strokeDasharray={[halfPerimeter, halfPerimeter]}
        strokeLinecap="round"
      />
      <AnimatedPath
        testID="voice-stage-speech-overtime"
        animatedProps={overtimeAnimatedProps}
        d={paths.clockwise}
        fill="none"
        stroke={colors.danger}
        strokeWidth={TIMELINE_BORDER_WIDTH}
        strokeDasharray={[halfPerimeter, halfPerimeter]}
        strokeLinecap="round"
      />
      <AnimatedPath
        testID="voice-stage-speech-overtime-counterclockwise"
        animatedProps={overtimeAnimatedProps}
        d={paths.counterclockwise}
        fill="none"
        stroke={colors.danger}
        strokeWidth={TIMELINE_BORDER_WIDTH}
        strokeDasharray={[halfPerimeter, halfPerimeter]}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PhaseAwareVoiceAction({
  colors,
  driveSilenceCountdownSeconds = null,
  driveVoiceActive = false,
  inputMode,
  layout,
  onPress,
  onPressIn,
  onPressOut,
  onStopPlayback,
  playbackPaused = false,
  recordingMaxMs,
  recordingStartedAtMs = null,
  speechStartProgress = null,
  statusLabel,
  t,
  visualPhase,
}: PhaseAwareVoiceActionProps) {
  const reducedMotion = useReducedMotion();
  const [surfaceSize, setSurfaceSize] = React.useState({
    height: 0,
    width: 0,
  });
  const [etaNowMs, setEtaNowMs] = React.useState(Date.now);
  const recordingProgress = useSharedValue(0);
  const phaseColor = getPhaseColor(visualPhase, colors);
  const phaseForeground = getAccessibleForeground(phaseColor);
  const animatedPhaseColor = useSharedValue(phaseColor);
  const phaseCopy = getPhaseCopy(visualPhase, inputMode, playbackPaused, t);
  const isLandscape = layout === "landscape";
  const showSpeechEta =
    visualPhase !== "recording" &&
    visualPhase !== "speaking" &&
    Boolean(speechStartProgress);
  const speechEta = getVoiceEta(speechStartProgress, etaNowMs);
  const showDriveCountdown =
    inputMode === "drive-session" &&
    visualPhase === "recording" &&
    !driveVoiceActive &&
    driveSilenceCountdownSeconds !== null;
  const countdownUrgency = showDriveCountdown
    ? Math.max(0, 10 - driveSilenceCountdownSeconds)
    : 0;
  const countdownFontSize = 20 + countdownUrgency * 1.5;
  const countdownColor =
    driveSilenceCountdownSeconds !== null && driveSilenceCountdownSeconds <= 3
      ? colors.danger
      : phaseColor;
  const accessibilityLabelBase =
    showSpeechEta && speechEta
      ? `${phaseCopy.title}. ${phaseCopy.prompt}. ${speechEta.label}`
      : statusLabel;
  const accessibilityLabel = showDriveCountdown
    ? `${statusLabel}. ${driveSilenceCountdownSeconds}s`
    : accessibilityLabelBase;
  const phaseAnnouncement = `${phaseCopy.title}. ${phaseCopy.prompt}`;
  const previousVisualPhase = React.useRef(visualPhase);

  React.useEffect(() => {
    if (previousVisualPhase.current === visualPhase) {
      return;
    }

    previousVisualPhase.current = visualPhase;
    AccessibilityInfo.announceForAccessibility(phaseAnnouncement);
  }, [phaseAnnouncement, visualPhase]);

  React.useEffect(() => {
    cancelAnimation(animatedPhaseColor);
    animatedPhaseColor.value = reducedMotion
      ? phaseColor
      : withTiming(phaseColor, { duration: 280 });

    return () => cancelAnimation(animatedPhaseColor);
  }, [animatedPhaseColor, phaseColor, reducedMotion]);

  React.useEffect(() => {
    cancelAnimation(recordingProgress);
    recordingProgress.value = 0;

    if (visualPhase === "recording") {
      const safeRecordingMaxMs = Math.max(1000, recordingMaxMs);
      const startedAtMs = recordingStartedAtMs ?? Date.now();
      const elapsedMs = Math.max(0, Date.now() - startedAtMs);
      const elapsedFraction = Math.min(1, elapsedMs / safeRecordingMaxMs);
      recordingProgress.value = elapsedFraction;

      if (elapsedFraction < 1) {
        recordingProgress.value = withTiming(1, {
          duration: Math.max(0, safeRecordingMaxMs - elapsedMs),
          easing: Easing.linear,
        });
      }
    }

    return () => cancelAnimation(recordingProgress);
  }, [recordingMaxMs, recordingProgress, recordingStartedAtMs, visualPhase]);

  React.useEffect(() => {
    if (!showSpeechEta) {
      return;
    }

    setEtaNowMs(Date.now());
    const timer = setInterval(() => setEtaNowMs(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, [
    showSpeechEta,
    speechStartProgress?.estimatedMs,
    speechStartProgress?.startedAt,
  ]);

  const recordingFillStyle = useAnimatedStyle(() => ({
    width: `${recordingProgress.value * 100}%`,
  }));
  const surfaceColorStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedPhaseColor.value,
  }));
  const handleSurfaceLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setSurfaceSize((current) =>
      current.height === height && current.width === width
        ? current
        : { height, width },
    );
  }, []);

  return (
    <Animated.View
      testID="voice-stage-action-surface"
      onLayout={handleSurfaceLayout}
      style={[styles.surface, surfaceColorStyle]}
    >
      {visualPhase === "recording" ? (
        <Animated.View
          testID="voice-stage-recording-fill"
          style={[
            styles.recordingFill,
            { backgroundColor: colors.phaseRecording },
            recordingFillStyle,
          ]}
        />
      ) : null}

      <TouchableOpacity
        testID="voice-stage-primary-action"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        activeOpacity={0.84}
        onPress={inputMode === "push-to-talk" ? undefined : onPress}
        onPressIn={inputMode === "push-to-talk" ? onPressIn : undefined}
        onPressOut={inputMode === "push-to-talk" ? onPressOut : undefined}
        style={styles.primaryAction}
      >
        <Animated.View
          testID="voice-stage-phase-icon"
          style={[styles.phaseIcon, { backgroundColor: phaseForeground }]}
        >
          {showDriveCountdown ? (
            <Text
              testID="voice-stage-drive-countdown"
              style={[
                styles.driveCountdown,
                {
                  color: countdownColor,
                  fontSize: countdownFontSize,
                },
              ]}
            >
              {driveSilenceCountdownSeconds}
            </Text>
          ) : (
            <PhosphorIcon
              name={getPhaseIcon(visualPhase, playbackPaused)}
              size="control"
              color={phaseColor}
            />
          )}
        </Animated.View>
      </TouchableOpacity>

      <View pointerEvents="none" style={styles.phaseCopy}>
        <View testID="voice-stage-left-copy" style={styles.sideCopy}>
          {visualPhase === "speaking" ? null : showSpeechEta ? (
            <>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.72}
                numberOfLines={1}
                style={[
                  isLandscape ? styles.landscapePhaseTitle : styles.phaseTitle,
                  { color: phaseForeground },
                ]}
              >
                {phaseCopy.title}
              </Text>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                numberOfLines={1}
                style={[styles.phaseDetail, { color: phaseForeground }]}
              >
                {phaseCopy.prompt}
              </Text>
            </>
          ) : (
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.84}
              numberOfLines={1}
              style={[styles.phasePromptText, { color: phaseForeground }]}
            >
              {phaseCopy.prompt}
            </Text>
          )}
        </View>

        <View testID="voice-stage-phase-copy" style={styles.sideCopy}>
          {showSpeechEta && speechEta ? (
            <Text
              testID="voice-stage-speech-eta"
              adjustsFontSizeToFit
              minimumFontScale={0.72}
              numberOfLines={1}
              style={[
                styles.etaText,
                {
                  color: speechEta.overEstimate
                    ? colors.danger
                    : phaseForeground,
                },
              ]}
            >
              {speechEta.label}
            </Text>
          ) : (
            <>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.76}
                numberOfLines={1}
                style={[
                  isLandscape ? styles.landscapePhaseTitle : styles.phaseTitle,
                  { color: phaseForeground },
                ]}
              >
                {phaseCopy.title}
              </Text>
              {phaseCopy.detail ? (
                <Text
                  numberOfLines={1}
                  style={[styles.phaseDetail, { color: phaseForeground }]}
                >
                  {phaseCopy.detail}
                </Text>
              ) : null}
            </>
          )}
        </View>
      </View>

      {visualPhase === "speaking" ? (
        <TouchableOpacity
          testID="voice-stage-stop-playback"
          accessibilityLabel={t("stop")}
          accessibilityRole="button"
          activeOpacity={0.72}
          onPress={onStopPlayback}
          style={styles.stopPlaybackAction}
        >
          <PhosphorIcon name="stop" size="compact" color={phaseForeground} />
          <Text
            numberOfLines={1}
            style={[styles.stopPlaybackLabel, { color: phaseForeground }]}
          >
            {t("stop")}
          </Text>
        </TouchableOpacity>
      ) : null}

      {visualPhase !== "recording" && visualPhase !== "speaking" ? (
        <SpeechStartTimelineBorder
          colors={colors}
          height={surfaceSize.height}
          phaseForeground={phaseForeground}
          progress={speechStartProgress}
          width={surfaceSize.width}
        />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  surface: {
    width: "100%",
    minHeight: 68,
    borderRadius: 17,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  recordingFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  timelineOverlay: {
    ...StyleSheet.absoluteFill,
  },
  primaryAction: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseIcon: {
    width: PHASE_ICON_SIZE,
    height: PHASE_ICON_SIZE,
    borderRadius: PHASE_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  driveCountdown: {
    fontFamily: fonts.body,
    fontWeight: "700",
    lineHeight: 38,
    textAlign: "center",
  },
  phaseCopy: {
    ...StyleSheet.absoluteFill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sideCopy: {
    width: "34%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  stopPlaybackAction: {
    position: "absolute",
    left: 8,
    top: 12,
    bottom: 12,
    width: "30%",
    minHeight: 44,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 6,
  },
  stopPlaybackLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  phasePromptText: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: fonts.body,
    fontWeight: "400",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  phaseTitle: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: fonts.body,
    fontWeight: "600",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  landscapePhaseTitle: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: -0.1,
    textAlign: "center",
  },
  phaseDetail: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "400",
    letterSpacing: 0.1,
    textAlign: "center",
    opacity: 0.84,
  },
  etaText: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
    letterSpacing: 0.1,
    textAlign: "center",
  },
});
