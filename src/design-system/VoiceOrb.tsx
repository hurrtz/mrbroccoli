import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import type { VoiceVisualPhase } from "../types";
import { getAccessibleForeground, type Colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeContext";
import { PhosphorIcon, type PhosphorIconName } from "./PhosphorIcon";

/** Phase to the colour that phase owns. Recording reads the track, not the wash. */
function getPhaseInk(phase: VoiceVisualPhase, colors: Colors): string {
  switch (phase) {
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
      return colors.accent;
  }
}

/**
 * The glyph says what tapping does, not what the machine is doing.
 *
 * Paused speech is the one phase where the pending action reverses: the turn
 * is still `speaking`, but the next tap resumes rather than pauses. The status
 * line already reflects this through its `resume` action label, so a pause
 * glyph here contradicts the caption sitting beside it.
 */
function getPhaseIcon(
  phase: VoiceVisualPhase,
  paused: boolean,
  rtl: boolean,
): PhosphorIconName {
  if (phase === "speaking") {
    return paused ? "play" : "pause";
  }

  switch (phase) {
    case "recording":
      return "stop";
    case "transcribing":
      return rtl ? "text-align-right" : "text-align-left";
    case "thinking-briefly":
      return "brain";
    case "searching":
      return "global";
    case "thinking":
      return "circuitry";
    case "synthesizing":
      return "user-sound";
    default:
      return "mic";
  }
}

const BAND = 6;
const CORE_GAP = 3;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** A UI-thread clock that continues between semantic pipeline updates. */
export interface VoiceOrbRingTiming {
  /** Remaining time before the ring reaches its next complete state. */
  durationMs: number;
  /** Optional delay before the clock starts, used for the overtime tail. */
  delayMs?: number;
  /** Defaults to a complete ring; speaking may target the current clip edge. */
  target?: number;
}

function clamp01(value: number | undefined): number {
  if (!value || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function ProgressRing({
  centre,
  radius,
  strokeWidth = BAND,
  trackColor,
  progressColor,
  progress,
  progressTiming,
  tailColor,
  tail,
  tailTiming,
  paused = false,
}: {
  centre: number;
  radius: number;
  strokeWidth?: number;
  trackColor: string;
  progressColor?: string;
  progress?: number;
  progressTiming?: VoiceOrbRingTiming;
  /** Overtime: a tail of this fraction fills backwards from 12 o'clock. */
  tailColor?: string;
  tail?: number;
  tailTiming?: VoiceOrbRingTiming;
  paused?: boolean;
}) {
  const circumference = 2 * Math.PI * radius;
  const progressClock = useRingClock(progress, progressTiming, paused);
  const tailClock = useRingClock(tail, tailTiming);
  const progressVisibility = useRingVisibility(
    Boolean(tailColor && (tail || tailTiming)),
    tailTiming?.delayMs,
  );
  const progressAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progressClock.value),
    strokeOpacity: progressVisibility.value,
  }));
  const tailAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - tailClock.value),
  }));

  return (
    <>
      <Circle
        cx={centre}
        cy={centre}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {progressColor && (progress || progressTiming) ? (
        <AnimatedCircle
          animatedProps={progressAnimatedProps}
          cx={centre}
          cy={centre}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={[circumference, circumference]}
          transform={`rotate(-90 ${centre} ${centre})`}
        />
      ) : null}
      {tailColor && (tail || tailTiming) ? (
        // A counter-clockwise circle makes the late tail advance backwards
        // from twelve o'clock while its value is animated off the JS thread.
        <AnimatedCircle
          animatedProps={tailAnimatedProps}
          cx={centre}
          cy={centre}
          r={radius}
          stroke={tailColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={[circumference, circumference]}
          transform={`rotate(90 ${centre} ${centre})`}
        />
      ) : null}
    </>
  );
}

function useRingClock(
  value: number | undefined,
  timing: VoiceOrbRingTiming | undefined,
  paused = false,
) {
  const clock = useSharedValue(clamp01(value));
  const wasPausedRef = React.useRef(paused);
  const durationMs = timing?.durationMs;
  const delayMs = timing?.delayMs;
  const target = clamp01(timing?.target ?? 1);

  React.useEffect(() => {
    cancelAnimation(clock);
    if (paused) {
      wasPausedRef.current = true;
      return () => cancelAnimation(clock);
    }

    const base = clamp01(value);
    const resumed = wasPausedRef.current;
    wasPausedRef.current = false;
    if (!resumed) {
      clock.value = base;
    }
    const current = clamp01(clock.value);
    if (durationMs === undefined || current >= target) {
      return () => cancelAnimation(clock);
    }

    const fullDistance = Math.max(0, target - base);
    const remainingDistance = Math.max(0, target - current);
    const remainingDurationMs =
      resumed && fullDistance > 0
        ? durationMs * (remainingDistance / fullDistance)
        : durationMs;

    const animation = withTiming(target, {
      duration: Math.max(0, Math.round(remainingDurationMs)),
      easing: Easing.linear,
    });
    clock.value = delayMs
      ? withDelay(Math.max(0, Math.round(delayMs)), animation)
      : animation;
    return () => cancelAnimation(clock);
  }, [clock, delayMs, durationMs, paused, target, value]);

  return clock;
}

/**
 * When an estimate expires the approved design swaps the completed ink for a
 * track plus a red tail. Schedule that discrete swap with the same UI-thread
 * deadline as the tail so JavaScript does not need to wake up at the boundary.
 */
function useRingVisibility(hidden: boolean, delayMs: number | undefined) {
  const initiallyHidden = hidden && !delayMs;
  const visibility = useSharedValue(initiallyHidden ? 0 : 1);

  React.useEffect(() => {
    cancelAnimation(visibility);
    visibility.value = 1;
    if (!hidden) {
      return () => cancelAnimation(visibility);
    }

    const hide = withTiming(0, { duration: 1, easing: Easing.linear });
    visibility.value = delayMs
      ? withDelay(Math.max(0, Math.round(delayMs)), hide)
      : hide;
    return () => cancelAnimation(visibility);
  }, [delayMs, hidden, visibility]);

  return visibility;
}

/**
 * The workspace's one loud element. One continuous double-width ring carries
 * the only progress estimate that matters: submission to first speech, then
 * how much of the spoken reply has been read. Past the estimate it fills with
 * red, so a late turn is legible without reading anything. A single stroke
 * also avoids a raster seam between adjacent bands.
 */
export function VoiceOrb({
  coreLabel,
  coreLabelColor,
  paused = false,
  phase = "idle",
  phaseProgress = 0,
  phaseProgressTiming,
  turnProgress = 0,
  overtime = 0,
  overtimeTiming,
  size = 196,
  rtl = false,
  label,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  style,
  testID,
}: {
  /** Temporary state rendered in the orb core instead of the phase glyph. */
  coreLabel?: string;
  /** Optional foreground for a temporary core label. */
  coreLabelColor?: string;
  /** Speech is held rather than stopped, so the next tap resumes it. */
  paused?: boolean;
  /** Which pipeline phase the orb is showing. Defaults to idle. */
  phase?: VoiceVisualPhase;
  /** 0–1 through the one active progress clock. */
  phaseProgress?: number;
  /** UI-thread interpolation for the one active progress clock. */
  phaseProgressTiming?: VoiceOrbRingTiming;
  /** Legacy whole-turn value retained while callers move to phaseProgress. */
  turnProgress?: number;
  /** Legacy timing retained for caller compatibility. */
  turnProgressTiming?: VoiceOrbRingTiming;
  /** 0–1 past the estimate. Above 0 the ring fills with red as the turn runs. */
  overtime?: number;
  /** UI-thread interpolation for the late-turn tail. */
  overtimeTiming?: VoiceOrbRingTiming;
  /** Diameter in points. The screen measures its space and passes it down. */
  size?: number;
  /** Mirrors the transcribing glyph for right-to-left interface locales. */
  rtl?: boolean;
  /** Accessible name, translated by the caller. */
  label: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  const ink = getPhaseInk(phase, colors);
  const foreground = getAccessibleForeground(ink);
  const late = clamp01(overtime);
  const quiet =
    phase === "idle" &&
    !clamp01(turnProgress) &&
    !clamp01(phaseProgress) &&
    !late;

  // The ring footprint keeps one screen-colour gap around the proportional
  // core. One double-width stroke covers the former inner and outer bounds
  // without a raster seam between adjacent circles.
  const inner = size - BAND * 2;
  const innerHole = inner - BAND * 2;
  const disc = Math.min(innerHole - CORE_GAP * 2, Math.floor(size * 0.86));
  const iconSide = Math.round(size * 0.3);
  const centre = size / 2;
  const outerRadius = (size - BAND) / 2;
  const innerRadius = (inner - BAND) / 2;
  const combinedRadius = (outerRadius + innerRadius) / 2;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.centre, { width: size, height: size }, style]}
      testID={testID ?? "voice-orb"}
    >
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
        testID="voice-orb-rings"
      >
        {quiet ? (
          // No clocks exist at rest, so one quiet band carries the full ring
          // footprint without a seam between adjacent SVG strokes.
          <Circle
            cx={centre}
            cy={centre}
            r={combinedRadius}
            stroke={colors.turnTrack}
            strokeWidth={BAND * 2}
            fill="none"
          />
        ) : (
          <ProgressRing
            centre={centre}
            radius={combinedRadius}
            strokeWidth={BAND * 2}
            trackColor={colors.turnTrack}
            progressColor={colors.turnInk}
            progress={phaseProgress}
            progressTiming={phaseProgressTiming}
            tailColor={late > 0 || overtimeTiming ? colors.danger : undefined}
            tail={late}
            tailTiming={overtimeTiming}
            paused={phase === "speaking" && paused}
          />
        )}
      </Svg>
      <View
        style={[
          styles.centre,
          {
            width: innerHole,
            height: innerHole,
            borderRadius: innerHole / 2,
            backgroundColor: colors.background,
          },
        ]}
        testID="voice-orb-core-gap"
      >
        <View
          style={[
            styles.centre,
            {
              width: disc,
              height: disc,
              borderRadius: disc / 2,
              backgroundColor: ink,
            },
          ]}
          testID="voice-orb-core"
        >
          {coreLabel ? (
            <Text
              allowFontScaling={false}
              style={[
                styles.coreLabel,
                {
                  color: coreLabelColor ?? foreground,
                  fontSize: Math.round(size * 0.17),
                  lineHeight: Math.round(size * 0.21),
                },
              ]}
              testID="voice-orb-core-label"
            >
              {coreLabel}
            </Text>
          ) : (
            <PhosphorIcon
              color={foreground}
              name={getPhaseIcon(phase, paused, rtl)}
              visualSize={iconSide}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centre: {
    alignItems: "center",
    justifyContent: "center",
  },
  coreLabel: {
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
    textAlign: "center",
  },
});
