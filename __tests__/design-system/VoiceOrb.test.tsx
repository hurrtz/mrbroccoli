import React from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { render } from "@testing-library/react-native";
import { Circle } from "react-native-svg";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    cancelAnimation: jest.fn(),
    Easing: { linear: jest.fn() },
    useAnimatedProps: (factory: () => unknown) => factory(),
    useSharedValue: (value: unknown) => ({ value }),
    withDelay: jest.fn(() => 0),
    withTiming: jest.fn((value: unknown) => value),
  };
});

import { VoiceOrb } from "../../src/design-system/VoiceOrb";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { darkColors, lightColors } from "../../src/theme/colors";

function renderOrb(
  props: Partial<React.ComponentProps<typeof VoiceOrb>> = {},
  mode: "light" | "dark" = "light",
) {
  return render(
    <ThemeProvider mode={mode}>
      <VoiceOrb label="Tap to speak" {...props} />
    </ThemeProvider>,
  );
}

function flatten(style: unknown): ViewStyle {
  return StyleSheet.flatten(style as StyleProp<ViewStyle>);
}

describe("VoiceOrb", () => {
  it.each([120, 196, 220])("stays measurably circular at %dpt", (size) => {
    const screen = renderOrb({ size });
    const orb = flatten(screen.getByTestId("voice-orb").props.style);
    const core = flatten(screen.getByTestId("voice-orb-core").props.style);

    expect(orb.width).toBe(size);
    expect(orb.height).toBe(size);
    expect(core.width).toBe(core.height);
    expect(core.borderRadius).toBe((core.width as number) / 2);
  });

  it("clamps the core to the ring holding it below the crossover", () => {
    // Below ~107pt the 72% proportion overtakes the inner ring's hole
    // (size - 30); an unclamped core would go oval against it.
    const screen = renderOrb({ size: 100 });
    const core = flatten(screen.getByTestId("voice-orb-core").props.style);

    expect(core.width).toBe(100 - 30);
  });

  it("keeps the 72% proportion above the crossover", () => {
    const screen = renderOrb({ size: 196 });
    const core = flatten(screen.getByTestId("voice-orb-core").props.style);

    expect(core.width).toBe(Math.floor(196 * 0.72));
  });

  it("fades both rings at rest instead of drawing two empty tracks", () => {
    const screen = renderOrb();
    const circles = screen.UNSAFE_getAllByType(Circle);

    // Both rings in faded phase colour; no turn track, no progress arcs.
    expect(circles).toHaveLength(2);
    for (const circle of circles) {
      expect(circle.props.stroke).toBe("rgba(68, 160, 85, 0.16)");
    }
  });

  it("combines both rings into one indicator while recording and speaking", () => {
    // Recording says how much of the window is used, speaking how much of the
    // response has been read — one thing each, not two competing clocks.
    for (const phase of ["recording", "speaking"] as const) {
      const screen = renderOrb({ phase, phaseProgress: 0.4, turnProgress: 0.9 });
      const strokes = screen
        .UNSAFE_getAllByType(Circle)
        .map((circle) => circle.props.stroke);

      expect(strokes).not.toContain(lightColors.turnInk);
      screen.unmount();
    }
  });

  it("draws both clocks during a turn", () => {
    const screen = renderOrb({
      phase: "searching",
      phaseProgress: 0.66,
      turnProgress: 0.52,
    });
    const circles = screen.UNSAFE_getAllByType(Circle);
    const strokes = circles.map((circle) => circle.props.stroke);

    expect(strokes).toContain(lightColors.turnTrack);
    expect(strokes).toContain(lightColors.turnInk);
    expect(strokes).toContain(lightColors.phaseSearching);
  });

  it("fills both rings with red as the turn runs late", () => {
    const screen = renderOrb({
      phase: "thinking",
      turnProgress: 1,
      overtime: 0.5,
    });
    const dangerArcs = screen
      .UNSAFE_getAllByType(Circle)
      .filter((circle) => circle.props.stroke === lightColors.danger);

    expect(dangerArcs).toHaveLength(2);
  });

  it.each([
    ["idle", "mic"],
    ["recording", "stop"],
    ["thinking", "brain"],
    ["speaking", "pause"],
  ] as const)("shows what tapping does in the %s phase", (phase, icon) => {
    const screen = renderOrb({ phase, phaseProgress: 0.2 });

    expect(
      screen.getByTestId(`phosphor-icon-${icon}`, {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
  });

  it("scales the glyph with the orb", () => {
    const screen = renderOrb({ size: 196 });
    const icon = flatten(
      screen.getByTestId("phosphor-icon-mic", {
        includeHiddenElements: true,
      }).props.style,
    );

    expect(icon.width).toBe(Math.round(196 * 0.3));
  });

  it("exposes the translated accessible name on a button role", () => {
    const screen = renderOrb({ label: "Antippen zum Sprechen" });
    const orb = screen.getByTestId("voice-orb");

    expect(orb.props.accessibilityRole).toBe("button");
    expect(orb.props.accessibilityLabel).toBe("Antippen zum Sprechen");
  });

  it("colours the recording phase from the track, not the wash", () => {
    const screen = renderOrb(
      { phase: "recording", phaseProgress: 0.4 },
      "dark",
    );
    const strokes = screen
      .UNSAFE_getAllByType(Circle)
      .map((circle) => circle.props.stroke);

    expect(strokes).toContain(darkColors.phaseRecordingTrack);
    expect(strokes).not.toContain(darkColors.phaseRecording);
  });
});
