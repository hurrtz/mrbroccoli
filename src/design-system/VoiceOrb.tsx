import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

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

/** The glyph says what tapping does, not what the machine is doing. */
function getPhaseIcon(phase: VoiceVisualPhase): PhosphorIconName {
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
    case "speaking":
      return "pause";
    default:
      return "mic";
  }
}

const BAND = 6;
const GAP = 3;
const TINT_ALPHA = 0.16;
const HALO_RING = 8;

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
  trackColor,
  progressColor,
  progress,
  tailColor,
  tail,
}: {
  centre: number;
  radius: number;
  trackColor: string;
  progressColor?: string;
  progress?: number;
  /** Overtime: a tail of this fraction fills backwards from 12 o'clock. */
  tailColor?: string;
  tail?: number;
}) {
  const circumference = 2 * Math.PI * radius;
  const rings: React.ReactNode[] = [
    <Circle
      key="track"
      cx={centre}
      cy={centre}
      r={radius}
      stroke={trackColor}
      strokeWidth={BAND}
      fill="none"
    />,
  ];

  if (tailColor && tail) {
    // The red tail ends at 12 o'clock and grows backwards as the turn runs
    // late: conic(track 0..remaining, danger remaining..360).
    const tailLength = clamp01(tail) * circumference;
    const startDeg = (1 - clamp01(tail)) * 360 - 90;
    rings.push(
      <Circle
        key="tail"
        cx={centre}
        cy={centre}
        r={radius}
        stroke={tailColor}
        strokeWidth={BAND}
        fill="none"
        strokeDasharray={[tailLength, circumference]}
        transform={`rotate(${startDeg} ${centre} ${centre})`}
      />,
    );
  } else if (progressColor && progress) {
    rings.push(
      <Circle
        key="progress"
        cx={centre}
        cy={centre}
        r={radius}
        stroke={progressColor}
        strokeWidth={BAND}
        fill="none"
        strokeDasharray={[clamp01(progress) * circumference, circumference]}
        transform={`rotate(-90 ${centre} ${centre})`}
      />,
    );
  }

  return <>{rings}</>;
}

/**
 * The workspace's one loud element. Two concentric rings carry two different
 * clocks: the outer one is the whole turn against its estimate, the inner one
 * is the current phase against itself. Past the estimate both rings fill with
 * red as they run, so a late turn is legible without reading anything.
 *
 * At rest there is no turn and no phase, so neither ring means anything —
 * the idle orb draws a plain halo rather than two empty tracks.
 */
export function VoiceOrb({
  phase = "idle",
  phaseProgress = 0,
  turnProgress = 0,
  overtime = 0,
  size = 196,
  label,
  onPress,
  style,
  testID,
}: {
  /** Which pipeline phase the orb is showing. Defaults to idle. */
  phase?: VoiceVisualPhase;
  /** 0–1 through the current phase. Drives the inner ring. */
  phaseProgress?: number;
  /** 0–1 through the whole turn against its estimate. Drives the outer ring. */
  turnProgress?: number;
  /** 0–1 past the estimate. Above 0 both rings fill with red as the turn runs. */
  overtime?: number;
  /** Diameter in points. The screen measures its space and passes it down. */
  size?: number;
  /** Accessible name, translated by the caller. */
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  const ink = getPhaseInk(phase, colors);
  const tint = tintOf(ink);
  const foreground = getAccessibleForeground(ink);
  const late = clamp01(overtime);
  const quiet =
    phase === "idle" && !clamp01(turnProgress) && !clamp01(phaseProgress) && !late;

  // The rings shrink by fixed bands while the core shrinks by proportion, so
  // below ~107pt the proportion would overtake the ring holding it. The core
  // is clamped to its parent ring and no ring ever shrinks.
  const hole = size - BAND * 2;
  const inner = hole - GAP * 2;
  const innerHole = inner - BAND * 2;
  const disc = Math.min(innerHole, Math.floor(size * 0.72));
  const iconSide = Math.round(size * 0.3);
  const centre = size / 2;
  const turnRadius = (size - BAND) / 2;
  const phaseRadius = (inner - BAND) / 2;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
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
          // The plain halo: a uniform tint ring where the phase ring runs.
          <Circle
            cx={centre}
            cy={centre}
            r={phaseRadius}
            stroke={tint}
            strokeWidth={BAND}
            fill="none"
          />
        ) : (
          <>
            <ProgressRing
              centre={centre}
              radius={turnRadius}
              trackColor={colors.turnTrack}
              progressColor={colors.turnInk}
              progress={turnProgress}
              tailColor={late > 0 ? colors.danger : undefined}
              tail={late}
            />
            <ProgressRing
              centre={centre}
              radius={phaseRadius}
              trackColor={tint}
              progressColor={ink}
              progress={phaseProgress}
              tailColor={late > 0 ? colors.danger : undefined}
              tail={late}
            />
          </>
        )}
      </Svg>
      {quiet ? (
        // At rest the halo fills solid down to the core.
        <View
          style={[
            styles.centre,
            styles.quietFill,
            {
              width: innerHole,
              height: innerHole,
              borderRadius: innerHole / 2,
              backgroundColor: tint,
            },
          ]}
        />
      ) : null}
      <View
        style={[
          styles.centre,
          {
            width: disc + HALO_RING * 2,
            height: disc + HALO_RING * 2,
            borderRadius: (disc + HALO_RING * 2) / 2,
            backgroundColor: tint,
          },
        ]}
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
          <PhosphorIcon
            color={foreground}
            name={getPhaseIcon(phase)}
            visualSize={iconSide}
          />
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
  quietFill: {
    position: "absolute",
  },
});
