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
    // Below the crossover the 79% proportion overtakes the inner ring's hole
    // (size - 30); an unclamped core would go oval against it.
    const screen = renderOrb({ size: 100 });
    const core = flatten(screen.getByTestId("voice-orb-core").props.style);

    expect(core.width).toBe(100 - 30);
  });

  it("keeps the approved 79% core proportion above the crossover", () => {
    const screen = renderOrb({ size: 196 });
    const core = flatten(screen.getByTestId("voice-orb-core").props.style);

    expect(core.width).toBe(Math.floor(196 * 0.79));
  });

  it("keeps only the screen-colour gap between the core and flush rings", () => {
    const screen = renderOrb({ phase: "thinking", size: 196 });
    const gap = flatten(screen.getByTestId("voice-orb-core-gap").props.style);
    const core = flatten(screen.getByTestId("voice-orb-core").props.style);
    const circles = screen.UNSAFE_getAllByType(Circle);

    expect(gap.backgroundColor).toBe(lightColors.background);
    expect(gap.width).toBe(196 - 6 * 4);
    expect(core.width).toBe(Math.floor(196 * 0.79));
    expect(circles[0].props.r - circles[1].props.r).toBe(6);
  });

  it("draws one continuous double-width ring at rest", () => {
    const screen = renderOrb();
    const circles = screen.UNSAFE_getAllByType(Circle);

    expect(circles).toHaveLength(1);
    expect(circles[0].props.stroke).toBe("rgba(68, 160, 85, 0.16)");
    expect(circles[0].props.strokeWidth).toBe(12);
  });

  it("uses one continuous double-width indicator while recording and speaking", () => {
    // Recording says how much of the window is used, speaking how much of the
    // response has been read — one thing each, not two competing clocks.
    for (const phase of ["recording", "speaking"] as const) {
      const screen = renderOrb({
        phase,
        phaseProgress: 0.4,
        turnProgress: 0.9,
      });
      const strokes = screen
        .UNSAFE_getAllByType(Circle)
        .map((circle) => circle.props.stroke);

      expect(strokes).not.toContain(lightColors.turnInk);
      for (const circle of screen.UNSAFE_getAllByType(Circle)) {
        expect(circle.props.strokeWidth).toBe(12);
      }
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

  it("offers resume rather than pause while speech is paused", () => {
    // The glyph states the next action. Paused speech resumes on the next tap,
    // so a pause glyph there tells the user the opposite of what happens --
    // and contradicts the action label, which already says "resume".
    const screen = renderOrb({ paused: true, phase: "speaking" });

    expect(
      screen.getByTestId("phosphor-icon-play", {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
    expect(
      screen.queryByTestId("phosphor-icon-pause", {
        includeHiddenElements: true,
      }),
    ).toBeNull();
  });

  it("ignores paused outside the speaking phase", () => {
    // Only speech pauses. A stale flag must not turn recording's stop glyph
    // into a play glyph.
    const screen = renderOrb({ paused: true, phase: "recording" });

    expect(
      screen.getByTestId("phosphor-icon-stop", {
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
