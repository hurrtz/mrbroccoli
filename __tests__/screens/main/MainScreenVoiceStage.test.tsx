import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { AccessibilityInfo, Keyboard, StyleSheet } from "react-native";

import { Circle } from "react-native-svg";

import { MainScreenVoiceStage } from "../../../src/screens/main/MainScreenVoiceStage";
import { TranslateFn } from "../../../src/screens/main/shared";
import { ThemeProvider } from "../../../src/theme/ThemeContext";
import { darkColors, lightColors } from "../../../src/theme/colors";

const hiddenIconQuery = { includeHiddenElements: true } as const;

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
    textMessagePlaceholder: "Type a message",
    sendTextMessage: "Send message",
    showVoiceInput: "Show voice input",
    showTextInput: "Show text input",
    pleaseWait: "Please wait",
    yourTurn: "Your turn",
    keepPressing: "Keep pressing",
    tapWhenDone: "Tap when done",
    pushToTalk: "Push to Talk",
    toggleToTalk: "Toggle to Talk",
    driveSession: "Drive Session",
    parsing: "Transcribing",
    searching: "Searching",
    converting: "Converting",
    thinking: "Thinking",
    speaking: "Speaking",
    tapToSpeak: "Tap to speak",
    paused: "Paused",
    stop: "Stop",
    stopDriveSession: "Pause auto",
    repeatDriveReply: "Repeat last",
    continueDriveSession: "Resume auto",
    openSpeakingSettings: "Speaking settings",
    addImage: "Add image",
    attachedImageLabel: "Attached image 1 of 1",
    removeAttachedImage: "Remove attached image 1",
  };
  return copy[key] ?? key;
}) as TranslateFn;

function renderStage(ui: React.ReactElement) {
  const screen = render(<ThemeProvider mode="light">{ui}</ThemeProvider>);
  return {
    ...screen,
    rerender: (next: React.ReactElement) =>
      screen.rerender(<ThemeProvider mode="light">{next}</ThemeProvider>),
  };
}

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    colors: lightColors,
    inputMode: "toggle-to-talk" as const,
    isActive: false,
    maxOrbSize: 196,
    onPress: jest.fn(),
    onPressIn: jest.fn(),
    onPressOut: jest.fn(),
    onInterruptPlayback: jest.fn(),
    onStopPlayback: jest.fn(),
    onSubmitTextMessage: jest.fn(),
    recordingMaxMs: 150_000,
    statusTitle: "Tap to speak",
    t,
    visualPhase: "idle" as const,
    ...overrides,
  };
}

describe("MainScreenVoiceStage composer", () => {
  it("previews prompt images without owning the add control", () => {
    const onRemoveImage = jest.fn();
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          attachments: [
            {
              id: "image-1",
              kind: "image",
              uri: "file:///message-images/image-1.jpg",
              mimeType: "image/jpeg",
              width: 1200,
              height: 800,
              byteSize: 1000,
              sharedWithProviders: [],
            },
          ],
          onRemoveImage,
        })}
      />,
    );

    fireEvent.press(screen.getByLabelText("Remove attached image 1"));

    expect(onRemoveImage).toHaveBeenCalledWith("image-1");
    expect(screen.queryByLabelText("Add image")).toBeNull();
  });

  it("rests on the voice orb as the screen's one loud element", () => {
    const onPress = jest.fn();
    const screen = renderStage(
      <MainScreenVoiceStage {...createProps({ onPress })} />,
    );

    expect(screen.getByTestId("voice-input-surface")).toBeTruthy();
    const orb = screen.getByTestId("voice-orb-idle");
    expect(orb.props.accessibilityLabel).toBe("Tap to speak");
    expect(screen.queryByText("Tap to speak")).toBeNull();
    // The idle orb draws its plain halo, not the docked bar's waveform chip.
    expect(
      screen.getByTestId("phosphor-icon-mic", hiddenIconQuery),
    ).toBeTruthy();
    expect(screen.queryByTestId("voice-input-icon")).toBeNull();
    expect(
      StyleSheet.flatten(screen.getByTestId("voice-orb-core").props.style)
        .backgroundColor,
    ).toBe(lightColors.accent);
    expect(
      screen.getByLabelText("Show voice input").props.accessibilityState,
    ).toEqual({ disabled: false, selected: true });
    expect(
      StyleSheet.flatten(screen.getByLabelText("Show voice input").props.style),
    ).toEqual(expect.objectContaining({ height: 44, width: 44 }));
    expect(
      StyleSheet.flatten(screen.getByLabelText("Show text input").props.style),
    ).toEqual(expect.objectContaining({ height: 44, width: 44 }));
    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-input-indicator").props.style,
      ),
    ).toEqual(expect.objectContaining({ transform: [{ translateX: 12 }] }));
    expect(
      StyleSheet.flatten(
        screen.getByTestId("text-input-indicator").props.style,
      ),
    ).toEqual(expect.objectContaining({ transform: [{ translateX: -12 }] }));

    fireEvent.press(orb);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("blocks prompt CTAs when the selected voice route is unavailable", () => {
    const onPress = jest.fn();
    const onResolvePromptBlock = jest.fn();
    const onSubmitTextMessage = jest.fn();
    const promptBlockedMessage =
      "Download and verify the model before selecting or using Kokoro.";
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          onPress,
          onResolvePromptBlock,
          onSubmitTextMessage,
          promptBlockedMessage,
        })}
      />,
    );

    expect(
      screen.getByTestId("voice-input-surface").props.accessibilityState,
    ).toEqual({ disabled: true });
    expect(screen.getByText(promptBlockedMessage)).toBeTruthy();
    expect(screen.getByText("Speaking settings")).toBeTruthy();

    fireEvent.press(screen.getByTestId("voice-input-surface"));
    expect(onPress).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId("prompt-blocked-notice"));
    expect(onResolvePromptBlock).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText("Show text input"));
    const input = screen.getByPlaceholderText("Type a message");
    expect(input.props.editable).toBe(true);
    fireEvent.changeText(input, "Draft while blocked");
    expect(
      screen.getByLabelText("Send message").props.accessibilityState,
    ).toEqual({ disabled: true });

    fireEvent.press(screen.getByTestId("voice-text-primary-action"));
    expect(onSubmitTextMessage).not.toHaveBeenCalled();
  });

  it("retires the voice control when nothing can hear the user, but keeps typing live", () => {
    const onPress = jest.fn();
    const onSubmitTextMessage = jest.fn();
    const voiceInputUnavailableMessage =
      "No speech recognition is set up yet, so type your message instead.";
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          onPress,
          onSubmitTextMessage,
          voiceInputUnavailableMessage,
        })}
      />,
    );

    const surface = screen.getByTestId("voice-input-surface");
    expect(surface.props.accessibilityState).toEqual({ disabled: true });
    expect(surface.props.accessibilityLabel).toBe(voiceInputUnavailableMessage);
    expect(screen.getByTestId("voice-input-blocked-status").props.children).toBe(
      voiceInputUnavailableMessage,
    );

    fireEvent.press(surface);
    expect(onPress).not.toHaveBeenCalled();

    // The message tells the user to type, so the composer must still work --
    // this is what separates it from a prompt block, which stops both routes.
    fireEvent.press(screen.getByLabelText("Show text input"));
    const input = screen.getByPlaceholderText("Type a message");
    expect(input.props.editable).toBe(true);
    fireEvent.changeText(input, "Typed instead of spoken");
    expect(
      screen.getByLabelText("Send message").props.accessibilityState,
    ).toEqual({ disabled: false });

    fireEvent.press(screen.getByTestId("voice-text-primary-action"));
    expect(onSubmitTextMessage).toHaveBeenCalledWith("Typed instead of spoken");
  });

  it("keeps the composer outlined in the accent, not only when focused", () => {
    // The voice control it pages between is green whenever it can be used, and
    // the composer carries the workspace when voice cannot. A neutral outline
    // left it looking like the lesser half.
    const screen = renderStage(<MainScreenVoiceStage {...createProps({})} />);

    fireEvent.press(screen.getByLabelText("Show text input"));
    const surface = StyleSheet.flatten(
      screen.getByTestId("text-input-surface").props.style,
    );

    expect(surface.borderColor).toBe(lightColors.accent);
  });

  it("shows installation progress directly on both disabled prompt CTAs", () => {
    const onPress = jest.fn();
    const onSubmitTextMessage = jest.fn();
    const progressLabel = "Installing… 42%";
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          onPress,
          onSubmitTextMessage,
          promptBlockedActionLabel: progressLabel,
          promptBlockedMessage: progressLabel,
          promptBlockedProgress: 0.42,
        })}
      />,
    );

    expect(screen.queryByTestId("prompt-blocked-notice")).toBeNull();
    expect(screen.getByTestId("voice-input-blocked-status").props.children).toBe(
      progressLabel,
    );
    expect(
      screen.getByTestId("voice-input-surface").props.accessibilityValue,
    ).toEqual({ min: 0, max: 100, now: 42 });
    expect(
      screen.getByTestId("voice-input-surface").props.accessibilityLabel,
    ).toBe(progressLabel);
    expect(
      screen.queryByTestId("phosphor-icon-audio", hiddenIconQuery),
    ).toBeNull();

    fireEvent.press(screen.getByTestId("voice-input-surface"));
    expect(onPress).not.toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText("Show text input"));
    expect(screen.getByTestId("text-input-blocked-status").props.children).toBe(
      progressLabel,
    );
    expect(
      screen.getByTestId("voice-text-primary-action").props.accessibilityValue,
    ).toEqual({ min: 0, max: 100, now: 42 });
    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-text-primary-action").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        minWidth: 116,
        width: "auto",
      }),
    );

    fireEvent.press(screen.getByTestId("voice-text-primary-action"));
    expect(onSubmitTextMessage).not.toHaveBeenCalled();
  });

  it("turns a blocked Free prompt CTA into an on-device setup action", () => {
    const onPress = jest.fn();
    const onResolvePromptBlock = jest.fn();
    const onSubmitTextMessage = jest.fn();
    const actionLabel = "Download and test";
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          onPress,
          onResolvePromptBlock,
          onSubmitTextMessage,
          promptBlockedActionEnabled: true,
          promptBlockedActionLabel: actionLabel,
          promptBlockedMessage: "Set up local models to continue.",
        })}
      />,
    );

    expect(
      screen.getByTestId("voice-input-surface").props.accessibilityState,
    ).toEqual({ disabled: false });
    fireEvent.press(screen.getByTestId("voice-input-surface"));
    expect(onResolvePromptBlock).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText("Show text input"));
    fireEvent.changeText(
      screen.getByPlaceholderText("Type a message"),
      "Draft while setup is required",
    );
    expect(
      screen.getByTestId("voice-text-primary-action").props.accessibilityState,
    ).toEqual({ disabled: false });
    fireEvent.press(screen.getByTestId("voice-text-primary-action"));
    expect(onResolvePromptBlock).toHaveBeenCalledTimes(2);
    expect(onSubmitTextMessage).not.toHaveBeenCalled();
  });

  it("preserves the dark-mode voice control treatment", () => {
    const screen = render(
      <ThemeProvider mode="dark">
        <MainScreenVoiceStage {...createProps({ colors: darkColors })} />
      </ThemeProvider>,
    );

    // The orb resolves its inks through the theme: dark rests on the dark
    // accent, not the light set brightened.
    expect(
      StyleSheet.flatten(screen.getByTestId("voice-orb-core").props.style)
        .backgroundColor,
    ).toBe(darkColors.accent);
  });

  it("moves to a visually separate full-width text composer", () => {
    const screen = renderStage(<MainScreenVoiceStage {...createProps()} />);
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
    const screen = renderStage(<MainScreenVoiceStage {...createProps()} />);
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
    const screen = renderStage(
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
    expect(
      screen.getByTestId("phosphor-icon-arrow-up", hiddenIconQuery),
    ).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-text-primary-action").props.style,
      ).backgroundColor,
    ).toBe(lightColors.surfaceAlt);

    fireEvent.changeText(input, "  Hello Mr Broccoli  ");
    expect(screen.getByLabelText("Send message")).toBeTruthy();
    expect(
      screen.getByTestId("phosphor-icon-arrow-up", hiddenIconQuery),
    ).toBeTruthy();

    fireEvent.press(screen.getByTestId("voice-text-primary-action"));
    expect(onSubmitTextMessage).toHaveBeenCalledWith("Hello Mr Broccoli");
    expect(dismissKeyboard).toHaveBeenCalledTimes(1);
    expect(input.props.value).toBe("");
    dismissKeyboard.mockRestore();
  });

  it("preserves push-to-talk press boundaries on the voice surface", () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const screen = renderStage(
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

  it("uses Drive controls only for automatic continuation", () => {
    const onPress = jest.fn();
    const onDriveStop = jest.fn();
    const onDriveRepeat = jest.fn();
    const onDriveContinue = jest.fn();
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          driveAutoContinueEnabled: true,
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
    expect(onDriveContinue).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("drive-session-stop").props.accessibilityState,
    ).toEqual({ disabled: false });
    expect(
      screen.getByTestId("drive-session-continue").props.accessibilityState,
    ).toEqual({ disabled: true });
    expect(
      StyleSheet.flatten(screen.getByTestId("drive-session-stop").props.style),
    ).toEqual(expect.objectContaining({ minHeight: 48 }));

    screen.rerender(
      <MainScreenVoiceStage
        {...createProps({
          driveAutoContinueEnabled: false,
          driveSessionCanRepeat: true,
          inputMode: "drive-session",
          onDriveContinue,
          onDriveRepeat,
          onDriveStop,
          onPress,
        })}
      />,
    );
    fireEvent.press(screen.getByTestId("drive-session-continue"));
    expect(onDriveContinue).toHaveBeenCalledTimes(1);
    expect(
      screen.getByTestId("drive-session-stop").props.accessibilityState,
    ).toEqual({ disabled: true });
    expect(
      screen.getByTestId("drive-session-continue").props.accessibilityState,
    ).toEqual({ disabled: false });
  });

  it("reserves constrained landscape Drive mode for hands-free controls", () => {
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          inputMode: "drive-session",
          layout: "landscape",
        })}
      />,
    );

    expect(screen.getByTestId("drive-session-controls")).toBeTruthy();
    expect(screen.queryByTestId("show-voice-input")).toBeNull();
    expect(screen.queryByTestId("show-text-input")).toBeNull();
  });

  it("shows an increasingly urgent Drive silence countdown in the CTA", () => {
    const props = createProps({
      driveAutoContinueEnabled: true,
      driveSilenceCountdownSeconds: 3,
      driveVoiceActive: false,
      inputMode: "drive-session",
      isActive: true,
      visualPhase: "recording",
    });
    const screen = renderStage(<MainScreenVoiceStage {...props} />);
    const countdown = screen.getByTestId("voice-orb-core-label");

    expect(countdown.props.children).toBe("3");
    expect(StyleSheet.flatten(countdown.props.style).color).toBe(
      lightColors.danger,
    );
    expect(
      screen.queryByTestId("phosphor-icon-stop", hiddenIconQuery),
    ).toBeNull();

    screen.rerender(
      <MainScreenVoiceStage {...props} driveVoiceActive />,
    );

    expect(screen.queryByTestId("voice-orb-core-label")).toBeNull();
    expect(
      screen.getByTestId("phosphor-icon-stop", hiddenIconQuery),
    ).toBeTruthy();
  });

  it("preserves an unfinished text draft while the pipeline is active", () => {
    const props = createProps();
    const screen = renderStage(<MainScreenVoiceStage {...props} />);
    fireEvent.press(screen.getByLabelText("Show text input"));
    fireEvent.changeText(
      screen.getByPlaceholderText("Type a message"),
      "Keep this draft",
    );

    screen.rerender(
      <MainScreenVoiceStage
        {...props}
        isActive
        visualPhase="thinking"
      />,
    );
    expect(screen.getByTestId("voice-orb-active")).toBeTruthy();
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
    const firstScreen = renderStage(
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

    const secondScreen = renderStage(
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

  it("keeps the orb slot while active and shows recording on its rings", () => {
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          recordingStartedAtMs: Date.now(),
          visualPhase: "recording",
        })}
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("voice-text-input-viewport").props.style,
      ),
    ).toEqual(expect.objectContaining({ minHeight: 96 }));
    const orb = screen.getByTestId("voice-orb-active");
    expect(orb).toBeTruthy();
    // Recording reads the track colour, not the wash, and the glyph says what
    // tapping does.
    expect(
      screen.getByTestId("phosphor-icon-stop", hiddenIconQuery),
    ).toBeTruthy();
    expect(screen.queryByTestId("active-waveform")).toBeNull();
    expect(
      screen.getByLabelText("Show voice input").props.accessibilityState,
    ).toEqual({ disabled: true, selected: true });
  });

  it("announces voice pipeline phase changes without announcing every ETA tick", () => {
    const announce = jest
      .spyOn(AccessibilityInfo, "announceForAccessibility")
      .mockImplementation(() => undefined);
    // Distinct labels per phase so this test cannot confuse its own
    // announcements with passive effects deferred from an earlier render.
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          statusTitle: "Recording CTA",
          visualPhase: "recording",
        })}
      />,
    );

    expect(announce).not.toHaveBeenCalledWith("Recording CTA");

    screen.rerender(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          statusTitle: "Thinking CTA",
          visualPhase: "thinking",
        })}
      />,
    );

    expect(announce).toHaveBeenCalledWith("Thinking CTA");
    expect(
      announce.mock.calls.filter(([message]) => message === "Thinking CTA"),
    ).toHaveLength(1);
    expect(announce).not.toHaveBeenCalledWith("Recording CTA");
    announce.mockRestore();
  });

  it("continues the recording ring from the actual recording start", () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(20_000);

    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          recordingMaxMs: 10_000,
          recordingStartedAtMs: 15_000,
          visualPhase: "recording",
        })}
      />,
    );

    // 5s into a 10s cap: the inner ring's progress arc is present alongside
    // its track, drawn in the recording track colour.
    const strokes = screen
      .UNSAFE_getAllByType(Circle)
      .map((circle) => circle.props.stroke);
    expect(strokes).toContain(lightColors.phaseRecordingTrack);
    now.mockRestore();
  });

  it("draws the turn against its estimate and fills red past it", () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(15_000);
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
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

    // Half way through the estimate: the outer ring draws turn ink over the
    // turn track, and nothing is red yet.
    let strokes = screen
      .UNSAFE_getAllByType(Circle)
      .map((circle) => circle.props.stroke);
    expect(strokes).toContain(lightColors.turnInk);
    expect(strokes).toContain(lightColors.turnTrack);
    expect(strokes).not.toContain(lightColors.danger);

    // A full estimate past the deadline: both rings carry the red tail.
    now.mockReturnValue(30_000);
    screen.rerender(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          speechStartProgress: {
            elapsedMs: 20_000,
            estimatedMs: 10_000,
            learned: true,
            overEstimate: true,
            progress: 1,
            sampleCount: 4,
            startedAt: 10_000,
          },
          visualPhase: "thinking",
        })}
      />,
    );
    strokes = screen
      .UNSAFE_getAllByType(Circle)
      .map((circle) => circle.props.stroke);
    expect(
      strokes.filter((stroke) => stroke === lightColors.danger),
    ).toHaveLength(2);
    now.mockRestore();
  });

  it("changes phase color and icon without mounting a second status element", () => {
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          visualPhase: "thinking",
        })}
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("voice-orb-core").props.style)
        .backgroundColor,
    ).toBe(lightColors.phaseThinking);
    // The orb wears brain for thinking; robot stays on the retired bar.
    expect(
      screen.getByTestId("phosphor-icon-brain", hiddenIconQuery),
    ).toBeTruthy();
    expect(
      screen.queryByTestId("phosphor-icon-info-circle", hiddenIconQuery),
    ).toBeNull();
    expect(screen.queryByTestId("voice-stage-phase-time")).toBeNull();
    expect(screen.queryByTestId("voice-stage-status-details")).toBeNull();
    expect(screen.queryByTestId("voice-stage-stop-playback")).toBeNull();
    expect(screen.queryByTestId("main-screen-status-strip")).toBeNull();
  });

  it("gives brief request preparation its own color and icon", () => {
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          visualPhase: "thinking-briefly",
        })}
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("voice-orb-core").props.style)
        .backgroundColor,
    ).toBe(lightColors.phaseThinkingBriefly);
    expect(
      screen.getByTestId("phosphor-icon-thunderbolt", hiddenIconQuery),
    ).toBeTruthy();
  });

  it("keeps the orb composition in landscape", () => {
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          layout: "landscape",
          maxOrbSize: 150,
          visualPhase: "searching",
        })}
      />,
    );

    expect(screen.getByTestId("voice-orb-active")).toBeTruthy();
    expect(
      screen.getByTestId("phosphor-icon-global", hiddenIconQuery),
    ).toBeTruthy();
  });

  it("keeps pause and resume on the orb while speaking", () => {
    const onPress = jest.fn();
    const screen = renderStage(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          onPress,
          visualPhase: "speaking",
        })}
      />,
    );

    expect(
      screen.getByTestId("phosphor-icon-pause", hiddenIconQuery),
    ).toBeTruthy();
    fireEvent.press(screen.getByTestId("voice-orb-active"));
    expect(onPress).toHaveBeenCalledTimes(1);

    screen.rerender(
      <MainScreenVoiceStage
        {...createProps({
          isActive: true,
          onPress,
          playbackPaused: true,
          visualPhase: "speaking",
        })}
      />,
    );
    // The stop and barge-in actions moved to the satellites row, which the
    // workspace owns; the stage no longer mounts them.
    expect(screen.queryByTestId("voice-stage-stop-playback")).toBeNull();
    expect(screen.queryByTestId("voice-stage-interrupt-playback")).toBeNull();
  });
});
