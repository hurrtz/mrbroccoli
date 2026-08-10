import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { PhaseAwareVoiceAction } from "../../../src/screens/main/PhaseAwareVoiceAction";
import type { TranslateFn } from "../../../src/screens/main/shared";
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
    runOnJS: (callback: (...args: unknown[]) => unknown) => callback,
    useAnimatedProps: (factory: () => unknown) => factory(),
    useAnimatedStyle: (factory: () => unknown) => factory(),
    useSharedValue: (value: unknown) => ({ value }),
    withDelay: jest.fn(
      (_delay: number, animation: unknown) => animation,
    ),
    withSpring: (
      value: unknown,
      _configuration: unknown,
      callback?: (finished: boolean) => void,
    ) => {
      callback?.(true);
      return value;
    },
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
    converting: "Converting",
    driveSession: "Drive Session",
    keepPressing: "Keep pressing",
    listening: "Listening",
    parsing: "Transcribing",
    paused: "Paused",
    pleaseWait: "Please wait",
    pushToTalk: "Push to Talk",
    searching: "Searching",
    speaking: "Speaking",
    stop: "Stop",
    tapToSpeak: "Tap to speak",
    tapWhenDone: "Tap when done",
    thinking: "Thinking",
    toggleToTalk: "Toggle to Talk",
    yourTurn: "Your turn",
  };
  return copy[key] ?? key;
}) as TranslateFn;

function createProps(
  overrides: Partial<React.ComponentProps<typeof PhaseAwareVoiceAction>> = {},
) {
  return {
    colors: lightColors,
    inputMode: "toggle-to-talk" as const,
    onInterruptPlayback: jest.fn(),
    onPress: jest.fn(),
    onPressIn: jest.fn(),
    onPressOut: jest.fn(),
    onStopPlayback: jest.fn(),
    recordingMaxMs: 60_000,
    statusLabel: "Listening",
    t,
    visualPhase: "recording" as const,
    ...overrides,
  };
}

/**
 * `PhaseAwareVoiceAction` is deliberately retained. The home screen now uses the
 * orb composition, but the bar is still the right control anywhere the voice
 * action has to sit in a bar rather than own the screen, so it keeps its own
 * coverage rather than inheriting it from a screen that no longer renders it.
 */
describe("PhaseAwareVoiceAction", () => {
  it("fills the bar with the phase colour and shows the phase glyph", () => {
    const screen = render(
      <PhaseAwareVoiceAction {...createProps({ visualPhase: "thinking" })} />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-stage-action-surface").props.style,
      ).backgroundColor,
    ).toBe(lightColors.phaseThinking);
    expect(
      screen.getByTestId("phosphor-icon-robot", hiddenIconQuery),
    ).toBeTruthy();
    expect(screen.getByText("Thinking")).toBeTruthy();
    expect(screen.getByText("Please wait")).toBeTruthy();
  });

  it("gives brief request preparation its own colour and glyph", () => {
    const screen = render(
      <PhaseAwareVoiceAction
        {...createProps({ visualPhase: "thinking-briefly" })}
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-stage-action-surface").props.style,
      ).backgroundColor,
    ).toBe(lightColors.phaseThinkingBriefly);
    expect(
      screen.getByTestId("phosphor-icon-thunderbolt", hiddenIconQuery),
    ).toBeTruthy();
  });

  it("continues the recording-capacity fill from the actual recording start", () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(20_000);
    const { withTiming } = require("react-native-reanimated") as {
      withTiming: jest.Mock;
    };
    withTiming.mockClear();

    render(
      <PhaseAwareVoiceAction
        {...createProps({
          recordingMaxMs: 10_000,
          recordingStartedAtMs: 15_000,
          visualPhase: "recording",
        })}
      />,
    );

    // Half the cap has already gone, so the fill has half of it left to run.
    expect(withTiming).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ duration: 5_000 }),
    );
    now.mockRestore();
  });

  it("shows an increasingly urgent Drive silence countdown", () => {
    const props = createProps({
      driveSilenceCountdownSeconds: 3,
      driveVoiceActive: false,
      inputMode: "drive-session",
      visualPhase: "recording",
    });
    const screen = render(<PhaseAwareVoiceAction {...props} />);
    const countdown = screen.getByTestId("voice-stage-drive-countdown");

    expect(countdown.props.children).toBe(3);
    expect(StyleSheet.flatten(countdown.props.style)).toEqual(
      expect.objectContaining({ color: lightColors.danger, fontSize: 30.5 }),
    );

    screen.rerender(<PhaseAwareVoiceAction {...props} driveVoiceActive />);

    expect(screen.queryByTestId("voice-stage-drive-countdown")).toBeNull();
  });

  it("keeps pause and resume on the primary action with a separate Stop", () => {
    const onStopPlayback = jest.fn();
    const onInterruptPlayback = jest.fn();
    const props = createProps({
      onInterruptPlayback,
      onStopPlayback,
      visualPhase: "speaking",
    });
    const screen = render(<PhaseAwareVoiceAction {...props} />);

    expect(
      screen.getByTestId("phosphor-icon-pause", hiddenIconQuery),
    ).toBeTruthy();
    fireEvent.press(screen.getByTestId("voice-stage-stop-playback"));
    expect(onStopPlayback).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByTestId("voice-stage-interrupt-playback"));
    expect(onInterruptPlayback).toHaveBeenCalledTimes(1);

    screen.rerender(<PhaseAwareVoiceAction {...props} playbackPaused />);

    expect(
      screen.getByTestId("phosphor-icon-play-circle", hiddenIconQuery),
    ).toBeTruthy();
    expect(screen.getByText("Paused")).toBeTruthy();
    // A paused reply has nothing to interrupt.
    expect(screen.queryByTestId("voice-stage-interrupt-playback")).toBeNull();
  });

  it("draws the adaptive speech timeline while waiting for speech", () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(15_000);
    const screen = render(
      <PhaseAwareVoiceAction
        {...createProps({
          speechStartProgress: {
            elapsedMs: 5_000,
            estimatedMs: 10_000,
            learned: true,
            overEstimate: false,
            progress: 0.5,
            sampleCount: 4,
            startedAt: 10_000,
          },
          visualPhase: "thinking",
        })}
      />,
    );

    fireEvent(screen.getByTestId("voice-stage-action-surface"), "layout", {
      nativeEvent: { layout: { height: 68, width: 320 } },
    });

    expect(screen.getByTestId("voice-stage-speech-timeline")).toBeTruthy();
    expect(screen.getByTestId("voice-stage-speech-eta").props.children).toBe(
      "~ 5 s",
    );
    now.mockRestore();
  });

  it("holds the control in push-to-talk rather than tapping it", () => {
    const onPress = jest.fn();
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const screen = render(
      <PhaseAwareVoiceAction
        {...createProps({
          inputMode: "push-to-talk",
          onPress,
          onPressIn,
          onPressOut,
        })}
      />,
    );
    const action = screen.getByTestId("voice-stage-primary-action");

    fireEvent(action, "pressIn");
    fireEvent(action, "pressOut");

    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });
});
