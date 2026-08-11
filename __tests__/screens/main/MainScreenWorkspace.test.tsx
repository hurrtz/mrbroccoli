import React from "react";
import { render, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

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

jest.mock("../../../src/screens/main/MainScreenRouteByline", () => ({
  MainScreenRouteByline: () => {
    const React = require("react");
    const { Text } = require("react-native");
    mockRouteBylineRenderCount += 1;
    return React.createElement(Text, null, "route-byline");
  },
}));

jest.mock("../../../src/screens/main/VoiceTextInputPager", () => ({
  VoiceTextInputPager: () => {
    const React = require("react");
    const { Text } = require("react-native");
    mockVoicePagerRenderCount += 1;
    return React.createElement(Text, null, "voice-text-input-pager");
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
      isPremium: true,
      offlineReady: false,
      onOpenRoutePicker: jest.fn(),
      onOpenSetupGuide: jest.fn(),
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
      onClose: jest.fn(),
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
      activeConversationTitle: "Streaming test",
      activeReplayMessageId: null,
      onCopyMessage: jest.fn(async () => true),
      onRetryMessage: jest.fn(),
      replayPhase: "idle" as const,
      scrollEnabled: true,
      showStyleControl: true,
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
          activeConversationTitle: "Untitled",
          activeReplayMessageId: null,
          messages: [],
          onCopyMessage: jest.fn(async () => true),
          onRetryMessage: jest.fn(),
          replayPhase: "idle",
          scrollEnabled: true,
          showStyleControl: false,
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
  });

  it("keeps the idle status aligned when settled routes move to the composer", () => {
    const t = jest.fn((key: string) => key);
    const workspaceProps = createWorkspaceProps(t);
    const onInputSurfaceChange = jest.fn();
    const transcript = {
      activeConversationId: null,
      activeConversationTitle: "Untitled",
      activeReplayMessageId: null,
      messages: [],
      onCopyMessage: jest.fn(async () => true),
      onRetryMessage: jest.fn(),
      replayPhase: "idle" as const,
      scrollEnabled: true,
      showStyleControl: false,
      showUsageStats: false,
      showWhenEmpty: true,
      t,
    };
    const screen = renderWorkspace(
      <MainScreenWorkspace
        {...workspaceProps}
        transcript={transcript}
        visualPhase="idle"
        voiceStage={{
          ...workspaceProps.voiceStage,
          isActive: false,
          onInputSurfaceChange,
          visualPhase: "idle",
          voiceSurfaceUnusable: false,
        }}
      />,
    );

    expect(screen.getByText("Tap to speak")).toBeTruthy();

    screen.rerender(
      <MainScreenWorkspace
        {...workspaceProps}
        transcript={transcript}
        visualPhase="idle"
        voiceStage={{
          ...workspaceProps.voiceStage,
          initialInputSurface: "text",
          isActive: false,
          onInputSurfaceChange,
          visualPhase: "idle",
          voiceSurfaceUnusable: true,
        }}
      />,
    );

    expect(screen.getByText("Type and send")).toBeTruthy();
    expect(screen.queryByText("Tap to speak")).toBeNull();
    expect(onInputSurfaceChange).not.toHaveBeenCalled();
  });
});
