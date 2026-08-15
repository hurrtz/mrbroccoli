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
): PhosphorIconName {
  if (phase === "speaking") {
    return paused ? "play" : "pause";
  }

  switch (phase) {
    case "recording":
      return "stop";
    case "transcribing":
      return "file-text";
    case "thinking-briefly":
      return "thunderbolt";
    case "searching":
      return "global";
    case "thinking":
      return "brain";
    case "synthesizing":
      return "customer-service";
    default:
      return "mic";
  }
}

const BAND = 6;
const CORE_GAP = 3;
const TINT_ALPHA = 0.16;
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

/** The design's 16% colour-mix tint, as an rgba of the phase ink. */
function tintOf(hexColor: string): string {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16));

  if (!channels || channels.length < 3) {
    return hexColor;
  }

  return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${TINT_ALPHA})`;
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
}) {
  const circumference = 2 * Math.PI * radius;
  const progressClock = useRingClock(progress, progressTiming);
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
) {
  const clock = useSharedValue(clamp01(value));
  const durationMs = timing?.durationMs;
  const delayMs = timing?.delayMs;
  const target = clamp01(timing?.target ?? 1);

  React.useEffect(() => {
    cancelAnimation(clock);
    clock.value = clamp01(value);
    if (durationMs === undefined || clock.value >= target) {
      return () => cancelAnimation(clock);
    }

    const animation = withTiming(target, {
      duration: Math.max(0, Math.round(durationMs)),
      easing: Easing.linear,
    });
    clock.value = delayMs
      ? withDelay(Math.max(0, Math.round(delayMs)), animation)
      : animation;
    return () => cancelAnimation(clock);
  }, [clock, delayMs, durationMs, target, value]);

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
 * The workspace's one loud element. Two concentric rings carry two different
 * clocks: the outer one is the whole turn against its estimate, the inner one
 * is the current phase against itself. Past the estimate both rings fill with
 * red as they run, so a late turn is legible without reading anything.
 *
 * Whenever both bands would carry exactly the same information, the orb draws
 * one continuous double-width band. That avoids a raster seam between two
 * adjacent strokes while preserving the same outer and inner boundaries.
 */
export function VoiceOrb({
  paused = false,
  phase = "idle",
  phaseProgress = 0,
  phaseProgressTiming,
  turnProgress = 0,
  turnProgressTiming,
  overtime = 0,
  overtimeTiming,
  size = 196,
  label,
  coreLabel,
  coreLabelColor,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  style,
  testID,
}: {
  /** Speech is held rather than stopped, so the next tap resumes it. */
  paused?: boolean;
  /** Which pipeline phase the orb is showing. Defaults to idle. */
  phase?: VoiceVisualPhase;
  /** 0–1 through the current phase. Drives the inner ring. */
  phaseProgress?: number;
  /** UI-thread interpolation for the current phase ring. */
  phaseProgressTiming?: VoiceOrbRingTiming;
  /** 0–1 through the whole turn against its estimate. Drives the outer ring. */
  turnProgress?: number;
  /** UI-thread interpolation for the whole-turn ring. */
  turnProgressTiming?: VoiceOrbRingTiming;
  /** 0–1 past the estimate. Above 0 both rings fill with red as the turn runs. */
  overtime?: number;
  /** UI-thread interpolation for the late-turn tail. */
  overtimeTiming?: VoiceOrbRingTiming;
  /** Diameter in points. The screen measures its space and passes it down. */
  size?: number;
  /** Accessible name, translated by the caller. */
  label: string;
  /**
   * Replaces the glyph in the core — the Drive Session silence countdown.
   * Everything else shows the phase glyph.
   */
  coreLabel?: string;
  coreLabelColor?: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  const ink = getPhaseInk(phase, colors);
  const tint = tintOf(ink);
  const foreground = getAccessibleForeground(ink);
  const late = clamp01(overtime);
  // Recording and speaking read as one indicator; the middle phases keep two
  // clocks (whole turn against its estimate, current phase against itself).
  const combined = phase === "recording" || phase === "speaking";
  const quiet =
    phase === "idle" &&
    !clamp01(turnProgress) &&
    !clamp01(phaseProgress) &&
    !late;

  // The ring footprint keeps one screen-colour gap around the proportional
  // core. Distinct clocks split it into two flush bands; a shared clock uses
  // one double-width stroke over the exact same inner and outer boundaries.
  const inner = size - BAND * 2;
  const innerHole = inner - BAND * 2;
  const disc = Math.min(innerHole - CORE_GAP * 2, Math.floor(size * 0.79));
  const iconSide = Math.round(size * 0.3);
  const centre = size / 2;
  const turnRadius = (size - BAND) / 2;
  const phaseRadius = (inner - BAND) / 2;
  const combinedRadius = (turnRadius + phaseRadius) / 2;

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
            stroke={tint}
            strokeWidth={BAND * 2}
            fill="none"
          />
        ) : combined ? (
          // Recording and speaking have one thing to say — how much of the
          // window is used, how much of the response has been read — so both
          // rings carry the same arc rather than two competing clocks.
          <ProgressRing
            centre={centre}
            radius={combinedRadius}
            strokeWidth={BAND * 2}
            trackColor={tint}
            progressColor={ink}
            progress={phaseProgress}
            progressTiming={phaseProgressTiming}
            tailColor={late > 0 || overtimeTiming ? colors.danger : undefined}
            tail={late}
            tailTiming={overtimeTiming}
          />
        ) : (
          <>
            <ProgressRing
              centre={centre}
              radius={turnRadius}
              trackColor={colors.turnTrack}
              progressColor={colors.turnInk}
              progress={turnProgress}
              progressTiming={turnProgressTiming}
              tailColor={late > 0 || overtimeTiming ? colors.danger : undefined}
              tail={late}
              tailTiming={overtimeTiming}
            />
            <ProgressRing
              centre={centre}
              radius={phaseRadius}
              trackColor={tint}
              progressColor={ink}
              progress={phaseProgress}
              progressTiming={phaseProgressTiming}
              tailColor={late > 0 || overtimeTiming ? colors.danger : undefined}
              tail={late}
              tailTiming={overtimeTiming}
            />
          </>
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
              style={[
                styles.coreLabel,
                {
                  color: coreLabelColor ?? foreground,
                  fontSize: Math.max(20, Math.round(iconSide * 0.6)),
                },
              ]}
              testID="voice-orb-core-label"
            >
              {coreLabel}
            </Text>
          ) : (
            <PhosphorIcon
              color={foreground}
              name={getPhaseIcon(phase, paused)}
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
