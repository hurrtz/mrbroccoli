import React from "react";

import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { TranscriptPreviewCard } from "../../../src/screens/main/TranscriptPreviewCard";
import { lightColors } from "../../../src/theme/colors";

let mockTailStateChange: ((isAtTail: boolean) => void) | null = null;

jest.mock("../../../src/components/ChatTranscript", () => ({
  ChatTranscript: ({
    messages,
    onEditMessage,
    onSaveInsightMessage,
    messageSelectionEnabled,
    onRepeatMessage,
    onShareMessage,
    onTailStateChange,
    scrollToLatestRequest,
    branchChildrenByMessageId,
    onOpenBranches,
  }: {
    messages: {
      id: string;
      role: "user" | "assistant";
      content: string;
      model: string | null;
      provider: string | null;
      timestamp: string;
    }[];
    onEditMessage?: (message: {
      id: string;
      role: "user" | "assistant";
      content: string;
      model: string | null;
      provider: string | null;
      timestamp: string;
    }) => void;
    onSaveInsightMessage?: (message: {
      id: string;
      role: "user" | "assistant";
      content: string;
      model: string | null;
      provider: string | null;
      timestamp: string;
    }) => void;
    messageSelectionEnabled?: boolean;
    onRepeatMessage?: () => void;
    onShareMessage?: () => void;
    onTailStateChange?: (isAtTail: boolean) => void;
    scrollToLatestRequest?: number;
    branchChildrenByMessageId?: ReadonlyMap<string, unknown[]>;
    onOpenBranches?: (branches: unknown[]) => void;
  }) => {
    const React = require("react");
    const { Pressable, Text, View } = require("react-native");
    mockTailStateChange = onTailStateChange ?? null;
    return React.createElement(
      View,
      null,
      React.createElement(
        Text,
        null,
        `actions:${Boolean(onRepeatMessage)}:${Boolean(onShareMessage)}:selection:${Boolean(messageSelectionEnabled)}:latest:${scrollToLatestRequest ?? 0}`,
      ),
      onEditMessage && messages[0]
        ? React.createElement(
            Pressable,
            { onPress: () => onEditMessage(messages[0]) },
            React.createElement(Text, null, "Open correction"),
          )
        : null,
      onSaveInsightMessage && messages[0]
        ? React.createElement(
            Pressable,
            { onPress: () => onSaveInsightMessage(messages[0]) },
            React.createElement(Text, null, "Open saved insight"),
          )
        : null,
      onOpenBranches && messages[0]
        ? React.createElement(
            Pressable,
            {
              onPress: () =>
                onOpenBranches(
                  branchChildrenByMessageId?.get(messages[0].id) ?? [],
                ),
            },
            React.createElement(Text, null, "Open branches"),
          )
        : null,
    );
  },
}));

describe("TranscriptPreviewCard", () => {
  beforeEach(() => {
    mockTailStateChange = null;
  });

  it("keeps message actions on the home transcript without an expand control", () => {
    const onOpenStyleSheet = jest.fn();
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        activeConversationTitle="Current conversation"
        colors={lightColors}
        messages={[
          {
            id: "message-1",
            role: "assistant",
            content: "Reply",
            model: "gpt-5.4",
            provider: "openai",
            timestamp: "2026-07-21T12:00:00.000Z",
          },
        ]}
        onCopyMessage={jest.fn()}
        onRepeatMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        onOpenStyleSheet={onOpenStyleSheet}
        onShareMessage={jest.fn()}
        presentation="canvas"
        showStyleControl
        showUsageStats={false}
        showWhenEmpty
        t={(key) =>
          ({
            conversation: "Conversation",
            openStyleSheet: "Open conversation settings",
          })[key] ?? key
        }
      />,
    );

    expect(screen.getByText("Current conversation")).toBeTruthy();
    expect(screen.queryByText("Conversation")).toBeNull();
    expect(
      screen.getByText("actions:true:true:selection:true:latest:0"),
    ).toBeTruthy();
    expect(screen.queryByLabelText("showTranscript")).toBeNull();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("transcript-preview-card").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        backgroundColor: "transparent",
        borderRadius: 0,
        borderWidth: 0,
        overflow: "visible",
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("transcript-preview-header").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        marginHorizontal: -16,
        borderTopWidth: 1,
        borderTopColor: lightColors.border,
      }),
    );
    fireEvent.press(screen.getByTestId("conversation-style-control"));

    expect(onOpenStyleSheet).toHaveBeenCalledTimes(1);
  });

  it("uses the full header width and offers a jump to the latest message", () => {
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        activeConversationTitle="A deliberately long conversation title that should use the available header width"
        colors={lightColors}
        messages={[
          {
            id: "message-1",
            role: "assistant",
            content: "Reply",
            model: "gpt-5.4",
            provider: "openai",
            timestamp: "2026-07-21T12:00:00.000Z",
          },
        ]}
        onCopyMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        onOpenStyleSheet={jest.fn()}
        presentation="canvas"
        scrollEnabled
        showStyleControl
        showUsageStats={false}
        showWhenEmpty
        t={(key) =>
          ({
            openStyleSheet: "Open conversation settings",
            scrollToLatest: "Scroll to latest message",
          })[key] ?? key
        }
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("transcript-header-copy").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 0,
      }),
    );
    expect(
      StyleSheet.flatten(screen.getByTestId("transcript-title").props.style)
        .width,
    ).toBe("100%");

    act(() => {
      mockTailStateChange?.(false);
    });

    const jumpControl = screen.getByLabelText("Scroll to latest message");
    expect(jumpControl).toBeTruthy();
    fireEvent.press(jumpControl);

    expect(
      screen.getByText("actions:false:false:selection:true:latest:1"),
    ).toBeTruthy();
    expect(screen.queryByLabelText("Scroll to latest message")).toBeNull();
  });

  it("keeps the landscape transcript header within its pane", () => {
    const screen = render(
      <TranscriptPreviewCard
        activeConversationTitle="Current conversation"
        colors={lightColors}
        layout="landscape"
        messages={[]}
        onCopyMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        showUsageStats={false}
        showWhenEmpty
        t={(key) => key}
      />,
    );

    const headerStyle = StyleSheet.flatten(
      screen.getByTestId("transcript-preview-header").props.style,
    );

    expect(headerStyle.marginHorizontal).toBeUndefined();
    expect(headerStyle.borderTopWidth).toBeUndefined();
  });

  it("edits a user transcript with an explicit future-context warning", async () => {
    const onEditMessage = jest.fn(async () => true);
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        colors={lightColors}
        messages={[
          {
            id: "message-1",
            role: "user",
            content: "All in on end design",
            model: null,
            provider: null,
            timestamp: "2026-08-03T10:00:00.000Z",
          },
        ]}
        onCopyMessage={jest.fn()}
        onEditMessage={onEditMessage}
        onRetryMessage={jest.fn()}
        showUsageStats={false}
        showWhenEmpty
        t={(key) =>
          ({
            cancel: "Cancel",
            correctTranscriptHint:
              "Existing replies are not changed; future context is updated.",
            correctTranscriptTitle: "Correct transcript",
            save: "Save",
          })[key] ?? key
        }
      />,
    );

    fireEvent.press(screen.getByText("Open correction"));
    expect(
      screen.getByText(
        "Existing replies are not changed; future context is updated.",
      ),
    ).toBeTruthy();
    fireEvent.changeText(
      screen.getByTestId("transcript-correction-input"),
      "All in on Ant Design",
    );
    fireEvent.press(screen.getByText("Save"));

    await waitFor(() =>
      expect(onEditMessage).toHaveBeenCalledWith(
        expect.objectContaining({ id: "message-1" }),
        "All in on Ant Design",
      ),
    );
  });

  it("opens a branch from the checkpoint marker", async () => {
    const onSelectBranchConversation = jest.fn(async () => undefined);
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="root-conversation"
        colors={lightColors}
        conversationBranches={[
          {
            id: "child-conversation",
            title: "Child branch",
            createdAt: "2026-08-04T10:01:00.000Z",
            updatedAt: "2026-08-04T10:01:00.000Z",
            messageCount: 1,
            providers: [],
            providerModels: {},
            lastModel: null,
            lastProvider: null,
            pinned: false,
            branch: {
              rootConversationId: "root-conversation",
              parentConversationId: "root-conversation",
              parentMessageId: "message-1",
              branchMessageId: "child-message-1",
              kind: "continue-from-message",
              createdAt: "2026-08-04T10:01:00.000Z",
            },
          },
        ]}
        messages={[
          {
            id: "message-1",
            role: "assistant",
            content: "Checkpoint",
            model: "gpt-5.4",
            provider: "openai",
            timestamp: "2026-08-04T10:00:00.000Z",
          },
        ]}
        onCopyMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        onSelectBranchConversation={onSelectBranchConversation}
        showUsageStats={false}
        showWhenEmpty
        t={(key) =>
          ({
            branchesFromMessage: "Branches from this message",
            done: "Done",
          })[key] ?? key
        }
      />,
    );

    fireEvent.press(screen.getByText("Open branches"));
    expect(screen.getByText("Branches from this message")).toBeTruthy();
    fireEvent.press(screen.getByTestId("message-branch-choice-child-conversation"));

    expect(onSelectBranchConversation).toHaveBeenCalledWith(
      "child-conversation",
    );
  });

  it("requires the user to classify and confirm a saved insight", async () => {
    const onSaveInsight = jest.fn(async () => true);
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        colors={lightColors}
        messages={[
          {
            id: "message-1",
            role: "assistant",
            content: "Ship a quick local route first.",
            model: "gpt-5.4",
            provider: "openai",
            timestamp: "2026-08-03T10:00:00.000Z",
          },
        ]}
        onCopyMessage={jest.fn()}
        onSaveInsight={onSaveInsight}
        onRetryMessage={jest.fn()}
        showUsageStats={false}
        showWhenEmpty
        t={(key) =>
          ({
            artifactAction: "Next action",
            artifactAssumption: "Assumption",
            artifactCounterargument: "Counterargument",
            artifactDecision: "Decision",
            artifactHypothesis: "Hypothesis",
            artifactIdea: "Idea",
            artifactQuestion: "Open question",
            artifactType: "Insight type",
            cancel: "Cancel",
            save: "Save",
            saveInsightHint: "Confirm meaning and exact text.",
            saveInsightTitle: "Save insight",
          })[key] ?? key
        }
      />,
    );

    fireEvent.press(screen.getByText("Open saved insight"));
    fireEvent.press(screen.getByText("Next action"));
    fireEvent.changeText(
      screen.getByTestId("insight-text-input"),
      "Ship the Quick route first.",
    );
    fireEvent.press(screen.getByText("Save"));

    await waitFor(() =>
      expect(onSaveInsight).toHaveBeenCalledWith(
        expect.objectContaining({ id: "message-1" }),
        "action",
        "Ship the Quick route first.",
      ),
    );
  });
});
