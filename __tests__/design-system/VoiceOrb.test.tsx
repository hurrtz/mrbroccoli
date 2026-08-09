import React from "react";
import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import {
  MAX_ORB_DIAMETER,
  MIN_ORB_DIAMETER,
  VoiceOrb,
  getOrbGeometry,
  resolveOrbDiameter,
} from "../../src/design-system/VoiceOrb";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { darkColors, lightColors } from "../../src/theme/colors";

function renderOrb(
  props: Partial<React.ComponentProps<typeof VoiceOrb>> = {},
  isDark = false,
) {
  return render(
    <ThemeProvider mode={isDark ? "dark" : "light"}>
      <VoiceOrb label="Tap to speak" size={MAX_ORB_DIAMETER} {...props} />
    </ThemeProvider>,
  );
}

describe("VoiceOrb geometry", () => {
  // The orb went oval below ~107pt: the core is a proportion of the whole orb
  // while the rings shrink by fixed bands, so the proportion overtook the ring
  // holding it. Every size has to stay circular.
  const sizes = [106, 107, 108, MIN_ORB_DIAMETER, 150, 156, MAX_ORB_DIAMETER];

  it.each(sizes)("keeps the core inside its parent ring at %ipt", (size) => {
    const geometry = getOrbGeometry(size);

    expect(geometry.core).toBeLessThanOrEqual(geometry.innerHole);
    expect(geometry.halo).toBeLessThanOrEqual(geometry.innerHole);
    expect(geometry.core).toBeGreaterThan(0);
  });

  it.each(sizes)("never shrinks a ring at %ipt", (size) => {
    const geometry = getOrbGeometry(size);
    // A band is fixed at 6, so the outer edge of the phase ring always sits a
    // fixed distance inside the outer edge of the turn ring.
    const turnBandOuter = geometry.diameter / 2;
    const phaseBandOuter = geometry.innerDiameter / 2;

    expect(turnBandOuter - geometry.turnRadius).toBeCloseTo(3);
    expect(phaseBandOuter - geometry.phaseRadius).toBeCloseTo(3);
    expect(geometry.turnRadius).toBeGreaterThan(geometry.phaseRadius);
  });

  it("clamps a measured container to the legible range", () => {
    expect(resolveOrbDiameter(40)).toBe(MIN_ORB_DIAMETER);
    expect(resolveOrbDiameter(600)).toBe(MAX_ORB_DIAMETER);
    expect(resolveOrbDiameter(150)).toBe(150);
    // No measurement yet: fall back to the largest rather than to zero, so the
    // first frame is not a collapsed orb.
    expect(resolveOrbDiameter(null)).toBe(MAX_ORB_DIAMETER);
  });

  it("derives the diameter from the space available, not from a constant", () => {
    // The bug this replaces was a size constant per layout. Two different
    // containers must produce two different orbs from the same component.
    expect(resolveOrbDiameter(196)).not.toBe(resolveOrbDiameter(150));
  });
});

describe("VoiceOrb", () => {
  it("draws a plain halo at rest rather than two empty tracks", () => {
    const screen = renderOrb({ phase: "idle" });

    // Nothing is running, so neither ring means anything and no arc is drawn.
    expect(screen.UNSAFE_queryAllByType("RNSVGCircle" as never)).toHaveLength(0);
  });

  it("draws both rings once a turn is running", () => {
    const screen = renderOrb({
      phase: "searching",
      phaseProgress: 0.66,
      turnProgress: 0.52,
    });

    expect(
      screen.UNSAFE_queryAllByType("RNSVGCircle" as never).length,
    ).toBeGreaterThan(0);
  });

  it.each([
    ["light", false, lightColors],
    ["dark", true, darkColors],
  ] as const)("takes the phase colour in %s", (_mode, isDark, colors) => {
    const screen = renderOrb({ phase: "thinking" }, isDark);
    const core = screen.getByTestId("voice-orb-core");

    expect(StyleSheet.flatten(core.props.style).backgroundColor).toBe(
      colors.phaseThinking,
    );
  });

  it("stays circular: the core's radius is always half its own width", () => {
    const screen = renderOrb({ size: MIN_ORB_DIAMETER });
    const core = StyleSheet.flatten(
      screen.getByTestId("voice-orb-core").props.style,
    );

    expect(core.width).toBe(core.height);
    expect(core.borderRadius).toBe(core.width / 2);
  });

  it("names itself with what tapping does", () => {
    const screen = renderOrb({ label: "Listening. Tap to stop." });

    expect(screen.getByLabelText("Listening. Tap to stop.")).toBeTruthy();
  });
});
