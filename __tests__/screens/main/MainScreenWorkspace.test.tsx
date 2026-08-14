import React from "react";
import { fireEvent, render, within } from "@testing-library/react-native";
import { StyleSheet, useWindowDimensions } from "react-native";

import { MainScreenWorkspace } from "../../../src/screens/main/MainScreenWorkspace";
import { ThemeProvider } from "../../../src/theme/ThemeContext";
import { lightColors } from "../../../src/theme/colors";
import {
  DEFAULT_SETTINGS,
  type Message,
  type ResponseMode,
} from "../../../src/types";

let mockRouteBylineRenderCount = 0;
let mockVoicePagerRenderCount = 0;

jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  const mockedUseWindowDimensions = jest.fn(() => ({
    fontScale: 1,
    height: 932,
    scale: 3,
    width: 430,
  }));

  return new Proxy(actual, {
    get(target, property, receiver) {
      return property === "useWindowDimensions"
        ? mockedUseWindowDimensions
        : Reflect.get(target, property, receiver);
    },
  });
});

const mockUseWindowDimensions = jest.mocked(useWindowDimensions);

jest.mock("../../../src/screens/main/MainScreenRouteByline", () => ({
  MainScreenRouteByline: () => {
    const React = require("react");
    const { Text } = require("react-native");
    mockRouteBylineRenderCount += 1;
    return React.createElement(Text, null, "route-byline");
  },
}));

jest.mock("../../../src/screens/main/VoiceTextInputPager", () => ({
  VoiceTextInputPager: ({
    compactPromptNotice = false,
    maxOrbSize,
  }: {
    compactPromptNotice?: boolean;
    maxOrbSize?: number;
  }) => {
    const React = require("react");
    const { Text } = require("react-native");
    mockVoicePagerRenderCount += 1;
    return React.createElement(
      Text,
      {
        accessibilityHint: String(maxOrbSize),
        accessibilityValue: {
          text: compactPromptNotice ? "compact" : "regular",
        },
        testID: "voice-text-input-pager",
      },
      "voice-text-input-pager",
    );
  },
}));

jest.mock("../../../src/screens/main/TranscriptPreviewCard", () => ({
  TranscriptPreviewCard: () => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, "transcript-preview");
  },
}));

function createWorkspaceProps(t: jest.Mock) {
  const activeResponseMode =
    DEFAULT_SETTINGS.activeResponseMode as ResponseMode;
  return {
    backgroundTask: null,
    colors: lightColors,
    introBanner: {
      onDismiss: jest.fn(),
      onOpen: jest.fn(),
      showDismiss: true,
      t: ((key: string) => key) as never,
      visible: false,
    },
    isLandscape: false,
    routeCard: {
      activeResponseMode,
      availableResponseModes: [activeResponseMode],
      onOpenRoutePicker: jest.fn(),
      responseModes: DEFAULT_SETTINGS.responseModes,
      t,
    },
    routePicker: {
      modes: DEFAULT_SETTINGS.responseModes,
      onClose: jest.fn(),
      onSelect: jest.fn(),
      readyModes: [activeResponseMode],
      selected: activeResponseMode,
      visible: false,
    },
    satellites: {
      councilActive: false,
      councilAvailable: true,
      disabled: false,
      imageAvailable: true,
      imageDisabled: false,
      driveRunning: true,
      driveSession: false,
      onAddImage: jest.fn(),
      onDriveResume: jest.fn(),
      onDriveStop: jest.fn(),
      onStopPlayback: jest.fn(),
      onToggleCouncil: jest.fn(),
      onToggleWeb: jest.fn(),
      t,
      webActive: true,
      webAvailable: true,
    },
    settingsSummary: {
      accessibilityLabel: "Conversation settings",
      onPress: jest.fn(),
      summary: "Balanced · Brief",
    },
    topBar: {
      brandName: "Mr Broccoli",
      drawerLabel: "Conversations",
      onOpenDrawer: jest.fn(),
      onOpenSettings: jest.fn(),
      settingsLabel: "Settings",
    },
    transcriptSheet: {
      countLabel: "1 message",
      emptyLabel: "No messages yet",
      hideLabel: "Hide transcript",
      meta: "GPT-5.4 · now",
      onClose: jest.fn(),
      onDismiss: jest.fn(),
      onOpen: jest.fn(),
      showLabel: "Show transcript",
      visible: false,
    },
    visualPhase: "thinking" as const,
    voiceStage: {
      inputMode: DEFAULT_SETTINGS.inputMode,
      isActive: true,
      onPress: jest.fn(),
      onPressIn: jest.fn(),
      onPressOut: jest.fn(),
      onStopPlayback: jest.fn(),
      onSubmitTextMessage: jest.fn(),
      recordingMaxMs: 60_000,
      statusTitle: "Thinking",
      t,
      visualPhase: "thinking" as const,
    },
  };
}

function renderWorkspace(ui: React.ReactElement) {
  const screen = render(<ThemeProvider mode="light">{ui}</ThemeProvider>);
  return {
    ...screen,
    rerender: (next: React.ReactElement) =>
      screen.rerender(<ThemeProvider mode="light">{next}</ThemeProvider>),
  };
}

describe("MainScreenWorkspace streaming isolation", () => {
  it("gives the satellite ring to the phase and to a drive session", () => {
    const t = jest.fn((key: string) => key);
    const base = createWorkspaceProps(t);
    const transcript = {
      activeConversationId: null,
      activeReplayMessageId: null,
      messages: [],
      onCopyMessage: jest.fn(async () => true),
      onRetryMessage: jest.fn(),
      replayPhase: "idle" as const,
      scrollEnabled: true,
      showUsageStats: false,
      showWhenEmpty: true,
      t,
    };

    // Idle composes.
    const idle = renderWorkspace(
      <MainScreenWorkspace {...base} transcript={transcript} visualPhase="idle" />,
    );
    expect(idle.getByTestId("satellite-council")).toBeTruthy();
    expect(idle.queryByTestId("satellite-stop")).toBeNull();
    idle.unmount();

    // A running turn hands the ring to transport; only Stop is live.
    const turn = renderWorkspace(
      <MainScreenWorkspace {...base} transcript={transcript} visualPhase="speaking" />,
    );
    expect(turn.queryByTestId("satellite-council")).toBeNull();
    expect(turn.getByTestId("satellite-stop")).toBeTruthy();
    expect(
      turn.getByTestId("satellite-restart").props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true }));
    turn.unmount();

    // A paused drive session shows transport at idle, ending in Resume.
    const onDriveResume = jest.fn();
    const drive = renderWorkspace(
      <MainScreenWorkspace
        {...base}
        satellites={{
          ...base.satellites,
          driveRunning: false,
          driveSession: true,
          onDriveResume,
        }}
        transcript={transcript}
        visualPhase="idle"
      />,
    );
    fireEvent.press(drive.getByTestId("satellite-resume"));
    expect(onDriveResume).toHaveBeenCalledTimes(1);
  });

  beforeEach(() => {
    mockRouteBylineRenderCount = 0;
    mockVoicePagerRenderCount = 0;
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 932,
      scale: 3,
      width: 430,
    });
  });

  it("compacts optional portrait chrome for accessibility-large text", () => {
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 2.35,
      height: 932,
      scale: 3,
      width: 430,
    });
    const t = jest.fn((key: string) => key);
    const workspaceProps = createWorkspaceProps(t);
    const screen = renderWorkspace(
      <MainScreenWorkspace
        {...workspaceProps}
        introBanner={{ ...workspaceProps.introBanner, visible: true }}
        transcript={{
          activeConversationId: null,
          activeReplayMessageId: null,
          messages: [],
          onCopyMessage: jest.fn(async () => true),
          onRetryMessage: jest.fn(),
          replayPhase: "idle",
          scrollEnabled: true,
          showUsageStats: false,
          showWhenEmpty: true,
          t,
        }}
        visualPhase="idle"
        voiceStage={{
          ...workspaceProps.voiceStage,
          isActive: false,
          promptBlockedActionEnabled: true,
          promptBlockedActionLabel: "Configure credentials",
          promptBlockedMessage:
            "Add credentials in Settings before starting a voice session.",
          statusTitle: "Tap to speak",
          visualPhase: "idle",
        }}
      />,
    );

    expect(screen.getByTestId("intro-banner")).toBeTruthy();
    expect(screen.queryByTestId("intro-banner-open")).toBeNull();
    expect(screen.queryByText("Balanced · Brief")).toBeNull();
    expect(
      screen.getByTestId("conversation-settings-summary-control").props
        .accessibilityLabel,
    ).toBe("Conversation settings");
    expect(
      within(screen.getByTestId("workspace-satellites")).queryByText(
        "workspaceImageLabel",
      ),
    ).toBeNull();
    // The status line is gone in both orientations; the orb carries the
    // phase and the transcript handle carries the conversation.
    expect(screen.queryByTestId("workspace-status-line")).toBeNull();
  });

  it("compacts the blocked-route notice in accessibility-large landscape", () => {
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 2.35,
      height: 440,
      scale: 3,
      width: 956,
    });
    const t = jest.fn((key: string) => key);
    const workspaceProps = createWorkspaceProps(t);
    const screen = renderWorkspace(
      <MainScreenWorkspace
        {...workspaceProps}
        isLandscape
        transcript={{
          activeConversationId: null,
          activeReplayMessageId: null,
          messages: [],
          onCopyMessage: jest.fn(async () => true),
          onRetryMessage: jest.fn(),
          replayPhase: "idle",
          scrollEnabled: true,
          showUsageStats: false,
          showWhenEmpty: true,
          t,
        }}
        visualPhase="idle"
        voiceStage={{
          ...workspaceProps.voiceStage,
          isActive: false,
          promptBlockedActionEnabled: true,
          promptBlockedActionLabel: "Configure credentials",
          promptBlockedMessage:
            "Add credentials in Settings before starting a voice session.",
          statusTitle: "Tap to speak",
          visualPhase: "idle",
        }}
      />,
    );

    expect(
      screen.getByTestId("voice-text-input-pager").props.accessibilityValue,
    ).toEqual({ text: "compact" });
    expect(screen.queryByTestId("workspace-status-line")).toBeNull();
    expect(screen.getByTestId("landscape-right-pane")).toBeTruthy();
  });

  it("steps the orb ceiling down while the intro banner is visible", () => {
    const t = jest.fn((key: string) => key);
    const workspaceProps = createWorkspaceProps(t);
    const transcript = {
      activeConversationId: null,
      activeReplayMessageId: null,
      messages: [],
      onCopyMessage: jest.fn(async () => true),
      onRetryMessage: jest.fn(),
      replayPhase: "idle" as const,
      scrollEnabled: true,
      showUsageStats: false,
      showWhenEmpty: true,
      t,
    };
    const screen = renderWorkspace(
      <MainScreenWorkspace
        {...workspaceProps}
        introBanner={{ ...workspaceProps.introBanner, visible: true }}
        transcript={transcript}
      />,
    );

    expect(
      screen.getByTestId("voice-text-input-pager").props.accessibilityHint,
    ).toBe("156");

    screen.rerender(
      <MainScreenWorkspace
        {...workspaceProps}
        introBanner={{ ...workspaceProps.introBanner, visible: false }}
        transcript={transcript}
      />,
    );
    expect(
      screen.getByTestId("voice-text-input-pager").props.accessibilityHint,
    ).toBe("196");
  });

  it("compacts the blocked-route notice in landscape at normal text size", () => {
    // The landscape left pane is height-constrained at any font scale; the
    // full notice paragraph overflows the stage area onto the status line.
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 440,
      scale: 3,
      width: 956,
    });
    const t = jest.fn((key: string) => key);
    const workspaceProps = createWorkspaceProps(t);
    const screen = renderWorkspace(
      <MainScreenWorkspace
        {...workspaceProps}
        isLandscape
        transcript={{
          activeConversationId: null,
          activeReplayMessageId: null,
          messages: [],
          onCopyMessage: jest.fn(async () => true),
          onRetryMessage: jest.fn(),
          replayPhase: "idle",
          scrollEnabled: true,
          showUsageStats: false,
          showWhenEmpty: true,
          t,
        }}
        visualPhase="idle"
        voiceStage={{
          ...workspaceProps.voiceStage,
          isActive: false,
          promptBlockedActionEnabled: true,
          promptBlockedActionLabel: "Start",
          promptBlockedMessage:
            "Choose your language while Mr Broccoli checks this phone.",
          statusTitle: "Tap to speak",
          visualPhase: "idle",
        }}
      />,
    );

    expect(
      screen.getByTestId("voice-text-input-pager").props.accessibilityValue,
    ).toEqual({ text: "compact" });
  });

  it("does not rerender static controls when only transcript messages change", () => {
    const t = jest.fn((key: string) => key);
    const workspaceProps = createWorkspaceProps(t);
    const storedMessage: Message = {
      id: "message-1",
      role: "user",
      content: "Hello",
      model: null,
      provider: null,
      timestamp: "2026-07-24T08:00:00.000Z",
    };
    const streamingMessage: Message = {
      id: "streaming",
      role: "assistant",
      content: "Hello there",
      model: "gpt-5.4",
      provider: "openai",
      timestamp: "2026-07-24T08:00:01.000Z",
    };
    const transcriptBase = {
      activeConversationId: "conversation-1",
      activeReplayMessageId: null,
      onCopyMessage: jest.fn(async () => true),
      onRetryMessage: jest.fn(),
      replayPhase: "idle" as const,
      scrollEnabled: true,
      showUsageStats: false,
      showWhenEmpty: true,
      t,
    };

    const screen = renderWorkspace(
      <MainScreenWorkspace
        {...workspaceProps}
        transcript={{
          ...transcriptBase,
          messages: [storedMessage],
        }}
      />,
    );

    expect(mockRouteBylineRenderCount).toBe(1);
    expect(mockVoicePagerRenderCount).toBe(1);
    // The satellites sit with the input they modify, under the orb.
    expect(
      within(screen.getByTestId("portrait-input-section")).getByTestId(
        "workspace-satellites",
      ),
    ).toBeTruthy();

    screen.rerender(
      <MainScreenWorkspace
        {...workspaceProps}
        transcript={{
          ...transcriptBase,
          messages: [storedMessage, streamingMessage],
        }}
      />,
    );

    expect(mockRouteBylineRenderCount).toBe(1);
    expect(mockVoicePagerRenderCount).toBe(1);
    // The handle keeps reading from the live message list.
    expect(screen.getByText("Hello there")).toBeTruthy();
    expect(screen.getByText("GPT-5.4 · now")).toBeTruthy();
  });

  it("top-aligns the complete Drive control stack in constrained landscape", () => {
    const t = jest.fn((key: string) => key);
    const workspaceProps = createWorkspaceProps(t);
    const screen = renderWorkspace(
      <MainScreenWorkspace
        {...workspaceProps}
        isLandscape
        transcript={{
          activeConversationId: null,
          activeReplayMessageId: null,
          messages: [],
          onCopyMessage: jest.fn(async () => true),
          onRetryMessage: jest.fn(),
          replayPhase: "idle",
          scrollEnabled: true,
          showUsageStats: false,
          showWhenEmpty: true,
          t,
        }}
        visualPhase="idle"
        voiceStage={{
          ...workspaceProps.voiceStage,
          inputMode: "drive-session",
          isActive: false,
          statusTitle: "Drive",
          visualPhase: "idle",
        }}
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("landscape-stage-area").props.style)
        .justifyContent,
    ).toBe("flex-start");
    expect(screen.queryByTestId("conversation-settings-summary")).toBeNull();
    expect(screen.queryByTestId("satellite-image")).toBeNull();
    expect(screen.getByTestId("satellite-council")).toBeTruthy();
    expect(screen.getByTestId("satellite-web")).toBeTruthy();
  });

  it("opens the portrait transcript as a grabber-only sheet", () => {
    const t = jest.fn((key: string) => key);
    const workspaceProps = createWorkspaceProps(t);
    const onClose = jest.fn();
    const screen = renderWorkspace(
      <MainScreenWorkspace
        {...workspaceProps}
        transcript={{
          activeConversationId: "conversation-1",
          activeReplayMessageId: null,
          messages: [],
          onCopyMessage: jest.fn(async () => true),
          onRetryMessage: jest.fn(),
          replayPhase: "idle",
          scrollEnabled: true,
          showUsageStats: false,
          showWhenEmpty: true,
          t,
        }}
        transcriptSheet={{
          ...workspaceProps.transcriptSheet,
          onClose,
          visible: true,
        }}
      />,
    );

    // The status line owns the conversation name; the sheet is the handle
    // pulled up — its only chrome is the grabber, which is the labeled
    // close action.
    expect(screen.queryByText("Streaming test")).toBeNull();
    const grabber = screen.getByTestId("transcript-sheet-close");
    expect(grabber.props.accessibilityRole).toBe("button");
    expect(
      StyleSheet.flatten(
        screen.getByTestId("native-dialog-card").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        backgroundColor: lightColors.background,
        gap: 0,
        paddingHorizontal: 18,
        paddingTop: 0,
      }),
    );
    expect(StyleSheet.flatten(grabber.props.style)).toEqual(
      expect.objectContaining({
        marginHorizontal: -18,
        marginTop: 0,
        minHeight: 44,
      }),
    );
    fireEvent.press(grabber);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
