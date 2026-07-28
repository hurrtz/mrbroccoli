import Feather from "@expo/vector-icons/Feather";
import React from "react";
import {
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
import {
  Colors,
  getAccessibleForeground,
} from "../../theme/colors";
import { fonts } from "../../theme/typography";
import {
  InputMode,
  VoiceTimingProgress,
  VoiceVisualPhase,
} from "../../types";

import { TranslateFn } from "./shared";

interface PhaseAwareVoiceActionProps {
  colors: Colors;
  inputMode: InputMode;
  layout: "portrait" | "landscape";
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
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
): React.ComponentProps<typeof Feather>["name"] {
  switch (visualPhase) {
    case "recording":
      return "square";
    case "transcribing":
      return "file-text";
    case "thinking-briefly":
      return "zap";
    case "searching":
      return "globe";
    case "thinking":
      return "cpu";
    case "synthesizing":
      return "headphones";
    case "speaking":
      return playbackPaused ? "play" : "pause";
    default:
      return "mic";
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
const LANDSCAPE_ICON_RIGHT = 12;
const TIMELINE_BORDER_WIDTH = 3;
const TIMELINE_BORDER_INSET = TIMELINE_BORDER_WIDTH / 2;
const AnimatedPath = Animated.createAnimatedComponent(Path);

function getRoundedRectPerimeter(
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.max(
    0,
    Math.min(radius, width / 2, height / 2),
  );

  return (
    2 * (width + height - 4 * safeRadius) +
    2 * Math.PI * safeRadius
  );
}

function getTopCenterRoundedRectPath(
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

  return [
    `M ${centerX} ${top}`,
    `H ${right - safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${right} ${top + safeRadius}`,
    `V ${bottom - safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${right - safeRadius} ${bottom}`,
    `H ${left + safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${left} ${bottom - safeRadius}`,
    `V ${top + safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${left + safeRadius} ${top}`,
    `H ${centerX}`,
  ].join(" ");
}

function getLandscapeIconOffset(surfaceWidth: number) {
  if (surfaceWidth <= 0) {
    return 0;
  }

  return (
    surfaceWidth / 2 -
    PHASE_ICON_SIZE / 2 -
    LANDSCAPE_ICON_RIGHT
  );
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
  const perimeter = getRoundedRectPerimeter(
    rectWidth,
    rectHeight,
    radius,
  );
  const path = getTopCenterRoundedRectPath(width, height, radius);

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
    const overtimeFraction = Math.min(
      1,
      overtimeElapsedMs / estimatedMs,
    );
    const expectedRemainingMs = Math.max(0, estimatedMs - elapsedMs);
    const overtimeRemainingMs = Math.max(
      0,
      estimatedMs - overtimeElapsedMs,
    );

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
    strokeDashoffset:
      perimeter * (1 - expectedProgress.value),
  }));
  const overtimeAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      perimeter * (1 - overtimeProgress.value),
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
      <AnimatedPath
        testID="voice-stage-speech-timeline"
        animatedProps={expectedAnimatedProps}
        d={path}
        fill="none"
        stroke={phaseForeground}
        strokeWidth={TIMELINE_BORDER_WIDTH}
        strokeDasharray={[perimeter, perimeter]}
        strokeLinecap="round"
      />
      <AnimatedPath
        testID="voice-stage-speech-overtime"
        animatedProps={overtimeAnimatedProps}
        d={path}
        fill="none"
        stroke={colors.danger}
        strokeWidth={TIMELINE_BORDER_WIDTH}
        strokeDasharray={[perimeter, perimeter]}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PhaseAwareVoiceAction({
  colors,
  inputMode,
  layout,
  onPress,
  onPressIn,
  onPressOut,
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
  const recordingProgress = useSharedValue(0);
  const phaseColor = getPhaseColor(visualPhase, colors);
  const phaseForeground = getAccessibleForeground(phaseColor);
  const animatedPhaseColor = useSharedValue(phaseColor);
  const iconOffset = useSharedValue(0);
  const phaseCopy = getPhaseCopy(
    visualPhase,
    inputMode,
    playbackPaused,
    t,
  );
  const isLandscape = layout === "landscape";

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
      const elapsedFraction = Math.min(
        1,
        elapsedMs / safeRecordingMaxMs,
      );
      recordingProgress.value = elapsedFraction;

      if (elapsedFraction < 1) {
        recordingProgress.value = withTiming(1, {
          duration: Math.max(0, safeRecordingMaxMs - elapsedMs),
          easing: Easing.linear,
        });
      }
    }

    return () => cancelAnimation(recordingProgress);
  }, [
    recordingMaxMs,
    recordingProgress,
    recordingStartedAtMs,
    visualPhase,
  ]);

  React.useEffect(() => {
    const nextOffset = isLandscape
      ? getLandscapeIconOffset(surfaceSize.width)
      : 0;
    cancelAnimation(iconOffset);
    iconOffset.value = reducedMotion
      ? nextOffset
      : withTiming(nextOffset, { duration: 240 });

    return () => cancelAnimation(iconOffset);
  }, [
    iconOffset,
    isLandscape,
    reducedMotion,
    surfaceSize.width,
  ]);

  const recordingFillStyle = useAnimatedStyle(() => ({
    width: `${recordingProgress.value * 100}%`,
  }));
  const surfaceColorStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedPhaseColor.value,
    borderColor: animatedPhaseColor.value,
  }));
  const iconPositionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: iconOffset.value }],
  }));
  const handleSurfaceLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      setSurfaceSize((current) =>
        current.height === height && current.width === width
          ? current
          : { height, width },
      );
    },
    [],
  );

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
        accessibilityLabel={statusLabel}
        accessibilityRole="button"
        activeOpacity={0.84}
        onPress={inputMode === "push-to-talk" ? undefined : onPress}
        onPressIn={inputMode === "push-to-talk" ? onPressIn : undefined}
        onPressOut={inputMode === "push-to-talk" ? onPressOut : undefined}
        style={styles.primaryAction}
      >
        <Animated.View
          testID="voice-stage-phase-icon"
          style={[
            styles.phaseIcon,
            { backgroundColor: phaseForeground },
            iconPositionStyle,
          ]}
        >
          <Feather
            name={getPhaseIcon(visualPhase, playbackPaused)}
            size={21}
            color={phaseColor}
          />
        </Animated.View>
      </TouchableOpacity>

      <View
        pointerEvents="none"
        style={
          isLandscape
            ? styles.landscapePhaseCopy
            : styles.portraitPhaseCopy
        }
      >
        {!isLandscape ? (
          <View style={styles.phasePrompt}>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.84}
              numberOfLines={1}
              style={[styles.phasePromptText, { color: phaseForeground }]}
            >
              {phaseCopy.prompt}
            </Text>
          </View>
        ) : null}

        <View
          testID="voice-stage-phase-copy"
          style={
            isLandscape
              ? styles.landscapePhaseMessage
              : styles.portraitPhaseMessage
          }
        >
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.76}
            numberOfLines={1}
            style={[
              isLandscape
                ? styles.landscapePhaseTitle
                : styles.phaseTitle,
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
        </View>
      </View>

      {visualPhase !== "recording" &&
      visualPhase !== "speaking" ? (
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
    borderWidth: TIMELINE_BORDER_WIDTH,
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
    ...StyleSheet.absoluteFillObject,
  },
  primaryAction: {
    ...StyleSheet.absoluteFillObject,
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
  portraitPhaseCopy: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
  },
  landscapePhaseCopy: {
    ...StyleSheet.absoluteFillObject,
    right: PHASE_ICON_SIZE + LANDSCAPE_ICON_RIGHT + 12,
    justifyContent: "center",
    paddingLeft: 16,
  },
  phasePrompt: {
    width: "34%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  phasePromptText: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: fonts.body,
    fontWeight: "400",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  portraitPhaseMessage: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    width: "34%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  landscapePhaseMessage: {
    alignItems: "flex-start",
    justifyContent: "center",
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
    textAlign: "left",
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
});
