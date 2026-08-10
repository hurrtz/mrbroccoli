import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { PhaseAwareVoiceAction } from "../../../src/screens/main/PhaseAwareVoiceAction";
import { TranslateFn } from "../../../src/screens/main/shared";
import { lightColors } from "../../../src/theme/colors";

const hiddenIconQuery = { includeHiddenElements: true } as const;

jest.mock("../../../src/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

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
    useAnimatedStyle: (factory: () => unknown) => factory(),
    useSharedValue: (value: unknown) => ({ value }),
    withDelay: jest.fn((_delay: number, animation: unknown) => animation),
    withTiming: jest.fn(
      (
        value: unknown,
        _configuration: unknown,
        callback?: (finished: boolean) => void,
      ) => {
        callback?.(true);
        return value;
      },
    ),
  };
});

const t = ((key: string) => {
  const copy: Record<string, string> = {
    pleaseWait: "Please wait",
    yourTurn: "Your turn",
    toggleToTalk: "Toggle to Talk",
    tapWhenDone: "Tap when done",
    thinking: "Thinking",
    speaking: "Speaking",
    tapToSpeak: "Tap to speak",
    paused: "Paused",
    stop: "Stop",
  };
  return copy[key] ?? key;
}) as TranslateFn;

function createProps() {
  return {
    colors: lightColors,
    inputMode: "toggle-to-talk" as const,
    layout: "portrait" as const,
    onPress: jest.fn(),
    onPressIn: jest.fn(),
    onPressOut: jest.fn(),
    onInterruptPlayback: jest.fn(),
    onStopPlayback: jest.fn(),
    recordingMaxMs: 150_000,
    statusLabel: "Tap to speak",
    t,
    visualPhase: "thinking" as const,
  };
}

/**
 * The docked bar survives the orb migration on purpose: it stays correct
 * anywhere the voice action sits in a bar rather than owning the screen.
 */
describe("PhaseAwareVoiceAction", () => {
  it("carries the phase colour and the robot thinking glyph", () => {
    const screen = render(<PhaseAwareVoiceAction {...createProps()} />);

    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-stage-action-surface").props.style,
      ).backgroundColor,
    ).toBe(lightColors.phaseThinking);
    // The bar deliberately keeps robot; brain belongs to the orb.
    expect(
      screen.getByTestId("phosphor-icon-robot", hiddenIconQuery),
    ).toBeTruthy();
    expect(screen.getByText("Please wait")).toBeTruthy();
    expect(screen.getByText("Thinking")).toBeTruthy();
  });

  it("keeps pause on the primary action with separate stop and barge-in", () => {
    const props = createProps();
    const screen = render(
      <PhaseAwareVoiceAction
        {...props}
        visualPhase="speaking"
      />,
    );

    expect(
      screen.getByTestId("phosphor-icon-pause", hiddenIconQuery),
    ).toBeTruthy();
    fireEvent.press(screen.getByTestId("voice-stage-primary-action"));
    expect(props.onPress).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByTestId("voice-stage-stop-playback"));
    expect(props.onStopPlayback).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByTestId("voice-stage-interrupt-playback"));
    expect(props.onInterruptPlayback).toHaveBeenCalledTimes(1);
  });

  it("shows the recording fill in the wash over the track surface", () => {
    const screen = render(
      <PhaseAwareVoiceAction
        {...createProps()}
        recordingStartedAtMs={Date.now()}
        visualPhase="recording"
      />,
    );

    expect(screen.getByTestId("voice-stage-recording-fill")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-stage-recording-fill").props.style,
      ).backgroundColor,
    ).toBe(lightColors.phaseRecording);
  });
});
