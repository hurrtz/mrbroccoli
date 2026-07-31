import React from "react";
import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { MainScreenWorkspace } from "../../../src/screens/main/MainScreenWorkspace";
import { lightColors } from "../../../src/theme/colors";
import {
  DEFAULT_SETTINGS,
  type Message,
  type ResponseMode,
} from "../../../src/types";

let mockRouteToggleRenderCount = 0;
let mockTranscriptRenderCount = 0;
let mockVoicePagerRenderCount = 0;

jest.mock("../../../src/components/ResponseModeToggle", () => ({
  ResponseModeToggle: () => {
    const React = require("react");
    const { Text } = require("react-native");
    mockRouteToggleRenderCount += 1;
    return React.createElement(Text, null, "response-mode-toggle");
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
    mockTranscriptRenderCount += 1;
    return React.createElement(Text, null, "transcript-preview");
  },
}));

describe("MainScreenWorkspace streaming isolation", () => {
  beforeEach(() => {
    mockRouteToggleRenderCount = 0;
    mockTranscriptRenderCount = 0;
    mockVoicePagerRenderCount = 0;
  });

  it("does not rerender static controls when only transcript messages change", () => {
    const activeResponseMode =
      DEFAULT_SETTINGS.activeResponseMode as ResponseMode;
    const onOpenDrawer = jest.fn();
    const onOpenSettings = jest.fn();
    const onOpenSetupGuide = jest.fn();
    const onSelectResponseMode = jest.fn();
    const onToggleWebSearchEnabled = jest.fn();
    const onPress = jest.fn();
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const onSubmitTextMessage = jest.fn();
    const onCopyMessage = jest.fn(async () => true);
    const onRetryMessage = jest.fn();
    const t = jest.fn((key: string) => key);
    const transcriptBase = {
      activeConversationId: "conversation-1",
      activeConversationTitle: "Streaming test",
      activeReplayMessageId: null,
      onCopyMessage,
      onRetryMessage,
      replayPhase: "idle" as const,
      scrollEnabled: true,
      showStyleControl: true,
      showUsageStats: false,
      showWhenEmpty: true,
      t,
    };
    const workspaceProps = {
      colors: lightColors,
      isLandscape: false,
      topBar: {
        brandName: "Mr Broccoli",
        drawerLabel: "Conversations",
        onOpenDrawer,
        onOpenSettings,
        settingsLabel: "Settings",
      },
      routeCard: {
        activeResponseMode,
        availableResponseModes: [activeResponseMode],
        onOpenSetupGuide,
        onSelectResponseMode,
        responseModes: DEFAULT_SETTINGS.responseModes,
        t,
      },
      routeControls: {
        onToggleWebSearchEnabled,
        t,
        webSearchEnabled: true,
        webSearchReady: true,
      },
      voiceStage: {
        inputMode: DEFAULT_SETTINGS.inputMode,
        isActive: true,
        onPress,
        onPressIn,
        onPressOut,
        onStopPlayback: jest.fn(),
        onSubmitTextMessage,
        recordingMaxMs: 60_000,
        statusTitle: "Thinking",
        t,
        visualPhase: "thinking" as const,
      },
    };
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

    const screen = render(
      <MainScreenWorkspace
        {...workspaceProps}
        transcript={{
          ...transcriptBase,
          messages: [storedMessage],
        }}
      />,
    );

    expect(mockRouteToggleRenderCount).toBe(1);
    expect(mockVoicePagerRenderCount).toBe(1);
    expect(mockTranscriptRenderCount).toBe(1);
    expect(t.mock.calls.filter(([key]) => key === "webSearch")).toHaveLength(2);

    screen.rerender(
      <MainScreenWorkspace
        {...workspaceProps}
        transcript={{
          ...transcriptBase,
          messages: [storedMessage, streamingMessage],
        }}
      />,
    );

    expect(mockRouteToggleRenderCount).toBe(1);
    expect(mockVoicePagerRenderCount).toBe(1);
    expect(mockTranscriptRenderCount).toBe(2);
    expect(t.mock.calls.filter(([key]) => key === "webSearch")).toHaveLength(2);
  });

  it("top-aligns the complete Drive control stack in constrained landscape", () => {
    const screen = render(
      <MainScreenWorkspace
        colors={lightColors}
        isLandscape
        topBar={{
          brandName: "Mr Broccoli",
          drawerLabel: "Conversations",
          onOpenDrawer: jest.fn(),
          onOpenSettings: jest.fn(),
          settingsLabel: "Settings",
        }}
        routeCard={{
          activeResponseMode: DEFAULT_SETTINGS.activeResponseMode,
          availableResponseModes: [],
          onOpenSetupGuide: jest.fn(),
          onSelectResponseMode: jest.fn(),
          responseModes: DEFAULT_SETTINGS.responseModes,
          t: jest.fn((key: string) => key),
        }}
        routeControls={{
          t: jest.fn((key: string) => key),
        }}
        voiceStage={{
          inputMode: "drive-session",
          isActive: false,
          onPress: jest.fn(),
          onPressIn: jest.fn(),
          onPressOut: jest.fn(),
          onStopPlayback: jest.fn(),
          onSubmitTextMessage: jest.fn(),
          recordingMaxMs: 60_000,
          statusTitle: "Drive",
          t: jest.fn((key: string) => key),
          visualPhase: "idle",
        }}
        transcript={{
          activeConversationId: null,
          activeConversationTitle: "Untitled",
          activeReplayMessageId: null,
          messages: [],
          onCopyMessage: jest.fn(),
          onRetryMessage: jest.fn(),
          replayPhase: "idle",
          scrollEnabled: true,
          showStyleControl: false,
          showUsageStats: false,
          showWhenEmpty: true,
          t: jest.fn((key: string) => key),
        }}
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("landscape-stage-area").props.style,
      ).justifyContent,
    ).toBe("flex-start");
  });
});
