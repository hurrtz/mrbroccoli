import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Keyboard, StyleSheet } from "react-native";

import { MainScreenVoiceStage } from "../../../src/screens/main/MainScreenVoiceStage";
import { TranslateFn } from "../../../src/screens/main/shared";
import { lightColors } from "../../../src/theme/colors";

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, `icon:${name}`);
  },
}));

jest.mock("../../../src/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const { View } = require("react-native");
  const createGesture = (kind: "native" | "pan") => {
    const gesture = {
      kind,
      activeOffsetX: () => gesture,
      disallowInterruption: () => gesture,
      failOffsetY: () => gesture,
      onEnd: () => gesture,
      onFinalize: () => gesture,
      onStart: () => gesture,
      onUpdate: () => gesture,
      simultaneousWithExternalGesture: () => gesture,
    };
    return gesture;
  };
  return {
    Gesture: {
      Native: () => createGesture("native"),
      Pan: () => createGesture("pan"),
    },
    GestureDetector: ({
      children,
      gesture,
    }: {
      children: React.ReactNode;
      gesture: { kind: "native" | "pan" };
    }) =>
      React.createElement(
        View,
        { testID: `${gesture.kind}-gesture-detector` },
        children,
      ),
    TouchableOpacity: require("react-native").TouchableOpacity,
  };
});

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: { View },
    cancelAnimation: jest.fn(),
    Easing: { linear: jest.fn() },
    runOnJS: (callback: (...args: unknown[]) => unknown) => callback,
    useAnimatedStyle: (factory: () => unknown) => factory(),
    useSharedValue: (value: unknown) => ({ value }),
    withSpring: (
      value: unknown,
      _configuration: unknown,
      callback?: (finished: boolean) => void,
    ) => {
      callback?.(true);
      return value;
    },
    withTiming: (
      value: unknown,
      _configuration: unknown,
      callback?: (finished: boolean) => void,
    ) => {
      callback?.(true);
      return value;
    },
  };
});

const t = ((key: string) => {
  const copy: Record<string, string> = {
    textMessagePlaceholder: "Type a message",
    sendTextMessage: "Send message",
    showVoiceInput: "Show voice input",
    showTextInput: "Show text input",
    statusDetails: "Status details",
    phaseTimeRemaining: "Phase",
    totalTimeRemaining: "Total",
    speechEtaCountdown: "About",
    speechEtaOvertime: "Still working",
    stopDriveSession: "Stop",
    repeatDriveReply: "Repeat",
    continueDriveSession: "Continue",
  };
  return copy[key] ?? key;
}) as TranslateFn;

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    colors: lightColors,
    inputMode: "toggle-to-talk" as const,
    isActive: false,
    onOpenStatusDetails: jest.fn(),
    onPress: jest.fn(),
    onPressIn: jest.fn(),
    onPressOut: jest.fn(),
    onSubmitTextMessage: jest.fn(),
    phaseLabel: "Idle",
    recordingMaxMs: 150_000,
    statusTitle: "Tap to speak",
    t,
    visualPhase: "idle" as const,
    ...overrides,
  };
}

describe("MainScreenVoiceStage composer", () => {
  it("starts with a prominent full-width voice surface", () => {
    const onPress = jest.fn();
    const screen = render(
      <MainScreenVoiceStage {...createProps({ onPress })} />,
    );

    expect(screen.getByTestId("voice-input-surface")).toBeTruthy();
    expect(screen.getByLabelText("Tap to speak")).toBeTruthy();
    expect(screen.queryByText("Tap to speak")).toBeNull();
    expect(screen.getByText("icon:mic")).toBeTruthy();
    expect(
      StyleSheet.flatten(screen.getByTestId("voice-input-surface").props.style),
    ).toEqual(
      expect.objectContaining({
        backgroundColor: lightColors.bubbleUser,
        minHeight: 68,
        width: "100%",
      }),
    );
    expect(
      screen.getByLabelText("Show voice input").props.accessibilityState,
    ).toEqual({ disabled: false, selected: true });

    fireEvent.press(screen.getByTestId("voice-input-surface"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("moves to a visually separate full-width text composer", () => {
    const screen = render(<MainScreenVoiceStage {...createProps()} />);
    fireEvent(screen.getByTestId("voice-text-input-viewport"), "layout", {
      nativeEvent: { layout: { width: 320 } },
    });

    fireEvent.press(screen.getByLabelText("Show text input"));

    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-text-input-pager").props.style,
      ),
    ).toEqual(expect.objectContaining({ gap: 32, width: 672 }));

    expect(
      screen.getByLabelText("Show text input").props.accessibilityState,
    ).toEqual({ disabled: false, selected: true });
    expect(
      StyleSheet.flatten(screen.getByTestId("text-input-surface").props.style),
    ).toEqual(
      expect.objectContaining({
        minHeight: 68,
        width: "100%",
      }),
    );
  });

  it("attaches the native gesture directly to the text input", () => {
    const screen = render(<MainScreenVoiceStage {...createProps()} />);
    const textInput = screen.getByTestId("voice-text-input", {
      includeHiddenElements: true,
    });

    expect(textInput.parent?.parent?.props.testID).toBe(
      "native-gesture-detector",
    );
  });

  it("submits text without turning the text composer into a voice control", () => {
    const dismissKeyboard = jest
      .spyOn(Keyboard, "dismiss")
      .mockImplementation(() => undefined);
    const onSubmitTextMessage = jest.fn();
    const screen = render(
      <MainScreenVoiceStage
        {...createProps({ onSubmitTextMessage })}
      />,
    );

    fireEvent.press(screen.getByLabelText("Show text input"));
    const input = screen.getByPlaceholderText("Type a message");
    expect(StyleSheet.flatten(input.props.style)).toEqual(
      expect.objectContaining({
        minHeight: 24,
        paddingVertical: 0,
        textAlignVertical: "center",
      }),
    );
    expect(
      screen.getByLabelText("Send message").props.accessibilityState,
    ).toEqual({ disabled: true });
    expect(screen.getByText("icon:arrow-up")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-text-primary-action").props.style,
      ).backgroundColor,
    ).toBe(lightColors.surfaceAlt);

    fireEvent.changeText(input, "  Hello Mr Broccoli  ");
    expect(screen.getByLabelText("Send message")).toBeTruthy();
    expect(screen.getByText("icon:arrow-up")).toBeTruthy();

    fireEvent.press(screen.getByTestId("voice-text-primary-action"));
    expect(onSubmitTextMessage).toHaveBeenCalledWith("Hello Mr Broccoli");
    expect(dismissKeyboard).toHaveBeenCalledTimes(1);
    expect(input.props.value).toBe("");
    dismissKeyboard.mockRestore();
  });

  it("preserves push-to-talk press boundaries on the voice surface", () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const screen = render(
      <MainScreenVoiceStage
        {...createProps({
          inputMode: "push-to-talk",
          onPressIn,
          onPressOut,
        })}
      />,
    );

    const action = screen.getByTestId("voice-input-surface");
    fireEvent(action, "pressIn");
    fireEvent(action, "pressOut");
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it("shows large Drive Session controls and wires the primary action", () => {
    const onPress = jest.fn();
    const onDriveStop = jest.fn();
    const onDriveRepeat = jest.fn();
    const onDriveContinue = jest.fn();
    const screen = render(
      <MainScreenVoiceStage
        {...createProps({
          driveSessionActive: true,
          driveSessionCanContinue: true,
          driveSessionCanRepeat: true,
          inputMode: "drive-session",
          onDriveContinue,
          onDriveRepeat,
          onDriveStop,
          onPress,
        })}
      />,
    );

    fireEvent.press(screen.getByTestId("voice-input-surface"));
    fireEvent.press(screen.getByTestId("drive-session-stop"));
    fireEvent.press(screen.getByTestId("drive-session-repeat"));
    fireEvent.press(screen.getByTestId("drive-session-continue"));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onDriveStop).toHaveBeenCalledTimes(1);
    expect(onDriveRepeat).toHaveBeenCalledTimes(1);
    expect(onDriveContinue).toHaveBeenCalledTimes(1);
    expect(
      StyleSheet.flatten(screen.getByTestId("drive-session-stop").props.style),
    ).toEqual(expect.objectContaining({ minHeight: 48 }));
  });

  it("preserves an unfinished text draft while the pipeline is active", () => {
    const props = createProps();
    const screen = render(<MainScreenVoiceStage {...props} />);
    fireEvent.press(screen.getByLabelText("Show text input"));
    fireEvent.changeText(
      screen.getByPlaceholderText("Type a message"),
      "Keep this draft",
    );

    screen.rerender(
      <MainScreenVoiceStage
        {...props}
        isActive
        phaseLabel="Thinking"
        visualPhase="thinking"
      />,
    );
    expect(screen.getByTestId("voice-stage-action-surface")).toBeTruthy();
    expect(
      screen.getByTestId("voice-text-input", {
        includeHiddenElements: true,
      }).props.value,
    ).toBe("Keep this draft");

    screen.rerender(<MainScreenVoiceStage {...props} isActive={false} />);
    expect(screen.getByPlaceholderText("Type a message").props.value).toBe(
      "Keep this draft",
    );
    expect(
      screen.getByLabelText("Show text input").props.accessibilityState,
    ).toEqual({ disabled: false, selected: true });
  });

  it("restores the selected surface and draft after a layout remount", () => {
    let rememberedSurface: "voice" | "text" = "voice";
    let rememberedDraft = "";
    const firstScreen = render(
      <MainScreenVoiceStage
        {...createProps({
          onInputSurfaceChange: (surface: "voice" | "text") => {
            rememberedSurface = surface;
          },
          onTextMessageChange: (text: string) => {
            rememberedDraft = text;
          },
        })}
      />,
    );
    fireEvent.press(firstScreen.getByLabelText("Show text input"));
    fireEvent.changeText(
      firstScreen.getByPlaceholderText("Type a message"),
      "Survive rotation",
    );
    firstScreen.unmount();

    const secondScreen = render(
      <MainScreenVoiceStage
        {...createProps({
          initialInputSurface: rememberedSurface,
          initialTextMessage: rememberedDraft,
        })}
      />,
    );

    expect(
      secondScreen.getByLabelText("Show text input").props.accessibilityState,
    ).toEqual({ disabled: false, selected: true });
    expect(
      secondScreen.getByPlaceholderText("Type a message").props.value,
    ).toBe("Survive rotation");
  });

  it("keeps the same composer footprint and drops the waveform while active", () => {
    const screen = render(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          phaseLabel: "Listening",
          visualPhase: "recording",
        })}
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-text-input-viewport").props.style,
      ),
    ).toEqual(expect.objectContaining({ minHeight: 68 }));
    expect(screen.getByTestId("voice-stage-action-surface")).toBeTruthy();
    expect(screen.getByTestId("voice-stage-recording-fill")).toBeTruthy();
    expect(screen.getByText("icon:square")).toBeTruthy();
    expect(screen.queryByTestId("active-waveform")).toBeNull();
    expect(
      screen.getByLabelText("Show voice input").props.accessibilityState,
    ).toEqual({ disabled: true, selected: true });
  });

  it("changes phase color and icon without mounting a second status element", () => {
    const screen = render(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          phaseLabel: "Thinking",
          visualPhase: "thinking",
        })}
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-stage-action-surface").props.style,
      ).backgroundColor,
    ).toBe(lightColors.phaseThinking);
    expect(screen.getByText("icon:cpu")).toBeTruthy();
    expect(screen.queryByText("icon:info")).toBeNull();
    expect(screen.getByText("Thinking")).toBeTruthy();
    expect(screen.getByTestId("voice-stage-phase-time")).toBeTruthy();
    expect(screen.getByText("Phase")).toBeTruthy();
    expect(screen.getByText("Total")).toBeTruthy();
    expect(screen.queryByTestId("main-screen-status-strip")).toBeNull();
  });

  it("gives brief request preparation its own color and icon", () => {
    const screen = render(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          phaseLabel: "Thinking",
          visualPhase: "thinking-briefly",
        })}
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-stage-action-surface").props.style,
      ).backgroundColor,
    ).toBe(lightColors.phaseThinkingBriefly);
    expect(screen.getByText("icon:zap")).toBeTruthy();
  });

  it("shows separate countdowns for the current phase and the whole turn", () => {
    const now = Date.now();
    const screen = render(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          phaseLabel: "Thinking",
          phaseProgress: {
            phase: "thinking",
            progress: 0.4,
            elapsedMs: 5_000,
            startedAt: now - 5_000,
            estimatedMs: 12_000,
            sampleCount: 3,
            learned: true,
            overEstimate: false,
            overall: {
              progress: 0.3,
              elapsedMs: 8_000,
              startedAt: now - 8_000,
              estimatedMs: 24_000,
              sampleCount: 5,
              learned: true,
              overEstimate: false,
            },
          },
          visualPhase: "thinking",
        })}
      />,
    );

    expect(screen.getByTestId("voice-stage-current-time")).toHaveTextContent(
      "0:07",
    );
    expect(screen.getByTestId("voice-stage-total-time")).toHaveTextContent(
      "0:16",
    );
  });

  it("keeps playback controls inside the stable speaking CTA", () => {
    const onStopPlayback = jest.fn();
    const screen = render(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          onStopPlayback,
          phaseLabel: "Speaking",
          playbackActive: true,
          visualPhase: "speaking",
        })}
      />,
    );

    expect(screen.getByText("icon:pause")).toBeTruthy();
    fireEvent.press(screen.getByTestId("voice-stage-stop-playback"));
    expect(onStopPlayback).toHaveBeenCalledTimes(1);
  });
});
