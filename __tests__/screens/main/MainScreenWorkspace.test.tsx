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
  }: {
    compactPromptNotice?: boolean;
  }) => {
    const React = require("react");
    const { Text } = require("react-native");
    mockVoicePagerRenderCount += 1;
    return React.createElement(
      Text,
      {
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
      onAddImage: jest.fn(),
      onInterruptPlayback: jest.fn(),
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
    statusLine: {
      detailActive: "Working through the answer",
      detailIdle: "Streaming test · 1 message",
      onInfo: jest.fn(),
      sessionDetailsLabel: "Session details",
      titleActive: "Thinking",
      titleIdleText: "Type and send",
      titleIdleVoice: "Tap to speak",
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
      title: "Streaming test",
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
    expect(screen.getByText("Tap to speak")).toBeTruthy();
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
    expect(screen.getByTestId("workspace-status-line")).toBeTruthy();
    expect(screen.getByTestId("landscape-right-pane")).toBeTruthy();
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

  it("opens the portrait transcript with one title and an icon close action", () => {
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

    expect(screen.getAllByText("Streaming test")).toHaveLength(1);
    expect(screen.queryByText("Hide transcript")).toBeNull();
    fireEvent.press(screen.getByTestId("transcript-sheet-close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
