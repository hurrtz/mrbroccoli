import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { getAccessibleForeground } from "../theme/colors";
import { useTheme } from "../theme/ThemeContext";
import type { VoiceVisualPhase } from "../types";
import { PhosphorIcon } from "./PhosphorIcon";
import { getPhaseColor, getPhaseGlyph } from "./voicePhase";

/**
 * The width of a ring, and the space between the two of them.
 *
 * **Decision:** both are fixed rather than proportional. A ring that shrinks
 * with the orb stops reading as a ring long before the orb stops being useful,
 * and two rings shrinking at different rates eventually cross.
 */
const BAND = 6;
const GAP = 3;

/**
 * The core's share of the whole orb, and only ever an upper bound. The rings
 * shrink by fixed bands while a proportion shrinks linearly, so below about
 * 107pt the proportion overtakes the ring holding it and the orb goes oval.
 * `getOrbGeometry` clamps the core to its parent ring for exactly that reason.
 */
const CORE_RATIO = 0.72;

/** The tint behind the core, and the unfilled part of the phase ring. */
const TINT_ALPHA = 0.16;

/** The solid ring of tint around the core. */
const HALO_BAND = 8;

/**
 * Below roughly this diameter the rings stop being legible and
 * `PhaseAwareVoiceAction` is the right control instead. Above the maximum the
 * orb stops reading as a control and starts reading as a background.
 */
export const MIN_ORB_DIAMETER = 120;
export const MAX_ORB_DIAMETER = 196;

function clampUnit(value: number | undefined) {
  return Math.max(0, Math.min(1, value ?? 0));
}

/** `#RRGGBB` at a fraction of its opacity. */
function withAlpha(hexColor: string, alpha: number) {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16));

  if (!channels || channels.length !== 3) {
    return hexColor;
  }

  return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha})`;
}

/**
 * Every measurement the orb draws, derived from one diameter so the shape stays
 * circular at any size. Exported for the test that proves it.
 */
export function getOrbGeometry(diameter: number) {
  const ringHole = diameter - BAND * 2;
  const innerDiameter = ringHole - GAP * 2;
  const innerHole = innerDiameter - BAND * 2;
  const core = Math.min(innerHole, Math.floor(diameter * CORE_RATIO));

  return {
    core,
    diameter,
    halo: Math.min(innerHole, core + HALO_BAND * 2),
    innerDiameter,
    innerHole,
    phaseRadius: (innerDiameter - BAND) / 2,
    turnRadius: (diameter - BAND) / 2,
  };
}

/**
 * Clamps a container's measurement to the range the orb stays legible in. A
 * container narrower than the minimum should render `PhaseAwareVoiceAction`
 * instead of shrinking this control past the point the rings can be read.
 */
export function resolveOrbDiameter(available: number | null | undefined) {
  if (!available || !Number.isFinite(available)) {
    return MAX_ORB_DIAMETER;
  }

  return Math.max(
    MIN_ORB_DIAMETER,
    Math.min(MAX_ORB_DIAMETER, Math.floor(available)),
  );
}

/** An arc of a ring. `sweep` is 0–1 of a full lap; `startTurns` rotates it. */
function Arc({
  centre,
  colour,
  radius,
  startTurns = 0,
  sweep,
}: {
  centre: number;
  colour: string;
  radius: number;
  startTurns?: number;
  sweep: number;
}) {
  if (sweep <= 0) {
    return null;
  }

  const circumference = 2 * Math.PI * radius;

  return (
    <Circle
      cx={centre}
      cy={centre}
      fill="none"
      origin={`${centre}, ${centre}`}
      r={radius}
      rotation={-90 + startTurns * 360}
      stroke={colour}
      strokeDasharray={`${circumference * Math.min(1, sweep)} ${circumference}`}
      strokeWidth={BAND}
    />
  );
}

/**
 * The workspace's one loud element. Two concentric rings carry two different
 * clocks: the outer one is the whole turn against its estimate, drawn in a
 * neutral so it reads as time rather than as another phase; the inner one is
 * the current phase against itself, in that phase's own colour.
 *
 * **Decision:** the accessible name is a required prop rather than copy the
 * component owns. `src/design-system/` holds no strings, and requiring it means
 * the name and the status line beside it are necessarily the same value -- the
 * failure this replaces was a control that announced one phase while drawing
 * another.
 */
export function VoiceOrb({
  label,
  onPress,
  overtime = 0,
  phase = "idle",
  phaseProgress = 0,
  size,
  style,
  testID,
  turnProgress = 0,
}: {
  /** Accessible name. Says what tapping does, matching the visible status. */
  label: string;
  onPress?: () => void;
  /** 0–1 past the estimate. Above 0 both rings fill with red as the turn runs. */
  overtime?: number;
  phase?: VoiceVisualPhase;
  /** 0–1 through the current phase. Drives the inner ring. */
  phaseProgress?: number;
  /** Overrides the measured diameter. Specimens and tests only; in the
   * workspace the orb sizes itself to the space it is given. */
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** 0–1 through the whole turn against its estimate. Drives the outer ring. */
  turnProgress?: number;
}) {
  const { colors } = useTheme();
  const [available, setAvailable] = useState<number | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    // The content box, not a constant: the orb fits the space it is actually
    // given, and stays square by taking the smaller axis.
    setAvailable(Math.min(width, height));
  }, []);

  const geometry = useMemo(
    () => getOrbGeometry(size ?? resolveOrbDiameter(available)),
    [available, size],
  );

  const ink = getPhaseColor(phase, colors);
  const tint = withAlpha(ink, TINT_ALPHA);
  const late = clampUnit(overtime);
  const phaseSweep = clampUnit(phaseProgress);
  const turnSweep = clampUnit(turnProgress);

  /**
   * At rest there is no turn and no phase, so neither ring means anything. Two
   * empty tracks would say the opposite -- that something is running and has
   * got nowhere -- so the idle orb draws a plain halo instead.
   */
  const quiet = phase === "idle" && !turnSweep && !phaseSweep && !late;
  const centre = geometry.diameter / 2;

  return (
    <View onLayout={onLayout} style={[styles.measure, style]}>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => [
          styles.centre,
          {
            height: geometry.diameter,
            opacity: pressed ? 0.72 : 1,
            width: geometry.diameter,
          },
        ]}
        testID={testID ?? "voice-orb"}
      >
        {quiet ? (
          <View
            style={[
              styles.centre,
              styles.absolute,
              {
                backgroundColor: tint,
                borderRadius: geometry.innerDiameter / 2,
                height: geometry.innerDiameter,
                width: geometry.innerDiameter,
              },
            ]}
          />
        ) : (
          <Svg
            height={geometry.diameter}
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
            width={geometry.diameter}
          >
            <Arc
              centre={centre}
              colour={colors.turnTrack}
              radius={geometry.turnRadius}
              sweep={1}
            />
            <Arc
              centre={centre}
              colour={tint}
              radius={geometry.phaseRadius}
              sweep={1}
            />
            <Arc
              centre={centre}
              colour={colors.turnInk}
              radius={geometry.turnRadius}
              sweep={late > 0 ? 0 : turnSweep}
            />
            <Arc
              centre={centre}
              colour={ink}
              radius={geometry.phaseRadius}
              sweep={late > 0 ? 0 : phaseSweep}
            />
            {/* Past the estimate both rings fill with red as the turn runs,
                growing backwards from the end of the lap, so a full lap late is
                a fully red orb. */}
            <Arc
              centre={centre}
              colour={colors.danger}
              radius={geometry.turnRadius}
              startTurns={1 - late}
              sweep={late}
            />
            <Arc
              centre={centre}
              colour={colors.danger}
              radius={geometry.phaseRadius}
              startTurns={1 - late}
              sweep={late}
            />
          </Svg>
        )}
        <View
          style={[
            styles.centre,
            {
              backgroundColor: tint,
              borderRadius: geometry.halo / 2,
              height: geometry.halo,
              width: geometry.halo,
            },
          ]}
        >
          <View
            style={[
              styles.centre,
              {
                backgroundColor: ink,
                borderRadius: geometry.core / 2,
                height: geometry.core,
                width: geometry.core,
              },
            ]}
            testID="voice-orb-core"
          >
            <PhosphorIcon
              color={getAccessibleForeground(ink)}
              name={getPhaseGlyph(phase)}
              size="hero"
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: { position: "absolute" },
  centre: { alignItems: "center", justifyContent: "center" },
  measure: { alignItems: "center", justifyContent: "center" },
});
