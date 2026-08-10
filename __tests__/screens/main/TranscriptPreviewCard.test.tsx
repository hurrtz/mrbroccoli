import React from "react";

import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert, StyleSheet } from "react-native";

import { TranscriptPreviewCard } from "../../../src/screens/main/TranscriptPreviewCard";
import { lightColors } from "../../../src/theme/colors";

let mockTailStateChange: ((isAtTail: boolean) => void) | null = null;

jest.mock("../../../src/components/ChatTranscript", () => ({
  ChatTranscript: ({
    messages,
    onEditMessage,
    onBranchMessage,
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
    onBranchMessage?: (message: {
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
      React.createElement(
        Text,
        null,
        `messages:${messages.map(({ id }) => id).join(",")}`,
      ),
      onEditMessage && messages[0]
        ? React.createElement(
            Pressable,
            { onPress: () => onEditMessage(messages[0]) },
            React.createElement(Text, null, "Open correction"),
          )
        : null,
      onBranchMessage && messages[0]
        ? React.createElement(
            Pressable,
            { onPress: () => onBranchMessage(messages[0]) },
            React.createElement(Text, null, "Request branch"),
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

  afterEach(() => {
    jest.restoreAllMocks();
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

  it("applies a preferred height as the flex basis so the sheet cannot collapse it", () => {
    // Regression: the shell's flex: 1 sets flexBasis: 0, which beats a plain
    // height inside a flex parent. In the transcript sheet's auto-height
    // dialog body that resolved the card to zero height and the transcript
    // vanished behind the sheet title and footer.
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
        onRetryMessage={jest.fn()}
        preferredHeight={480}
        presentation="card"
        showUsageStats={false}
        showWhenEmpty
        t={(key) => key}
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("transcript-preview-card").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        flexBasis: 480,
        flexGrow: 0,
        flexShrink: 1,
      }),
    );
  });

  it("offers the image attachment control in the transcript header", () => {
    const onAddImage = jest.fn();
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        activeConversationTitle="Current conversation"
        colors={lightColors}
        messages={[]}
        onAddImage={onAddImage}
        onCopyMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        presentation="canvas"
        showUsageStats={false}
        showWhenEmpty
        t={(key) => ({ addImage: "Add image" })[key] ?? key}
      />,
    );

    const control = screen.getByTestId("attach-image-control");

    expect(control.props.accessibilityLabel).toBe("Add image");
    expect(StyleSheet.flatten(control.props.style)).toEqual(
      expect.objectContaining({ width: 44, height: 44 }),
    );

    fireEvent.press(control);

    expect(onAddImage).toHaveBeenCalledTimes(1);
  });

  it("disables the header image control while attachments are unavailable", () => {
    const onAddImage = jest.fn();
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        activeConversationTitle="Current conversation"
        colors={lightColors}
        imageAttachmentDisabled
        messages={[]}
        onAddImage={onAddImage}
        onCopyMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        presentation="canvas"
        showUsageStats={false}
        showWhenEmpty
        t={(key) => ({ addImage: "Add image" })[key] ?? key}
      />,
    );

    const control = screen.getByTestId("attach-image-control");

    expect(control.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );

    fireEvent.press(control);

    expect(onAddImage).not.toHaveBeenCalled();
  });

  it("hides the header image control when attachments are unsupported", () => {
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        activeConversationTitle="Current conversation"
        colors={lightColors}
        messages={[]}
        onCopyMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        presentation="canvas"
        showUsageStats={false}
        showWhenEmpty
        t={(key) => key}
      />,
    );

    expect(screen.queryByTestId("attach-image-control")).toBeNull();
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
    const onBranchMessage = jest.fn(async () => true);
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
        onBranchMessage={onBranchMessage}
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
            saveAndSend: "Save + send",
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
    expect(onBranchMessage).not.toHaveBeenCalled();
  });

  it("saves and sends an edited prompt from the correction dialog", async () => {
    const onEditMessage = jest.fn(async () => true);
    const onBranchMessage = jest.fn(async () => true);
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        colors={lightColors}
        messages={[
          {
            id: "message-1",
            role: "user",
            content: "Original prompt",
            model: null,
            provider: null,
            timestamp: "2026-08-03T10:00:00.000Z",
          },
        ]}
        onCopyMessage={jest.fn()}
        onEditMessage={onEditMessage}
        onBranchMessage={onBranchMessage}
        onRetryMessage={jest.fn()}
        showUsageStats={false}
        showWhenEmpty
        t={(key) =>
          ({
            cancel: "Cancel",
            correctTranscriptTitle: "Correct transcript",
            save: "Save",
            saveAndSend: "Save + send",
          })[key] ?? key
        }
      />,
    );

    fireEvent.press(screen.getByText("Open correction"));
    fireEvent.changeText(
      screen.getByTestId("transcript-correction-input"),
      "Corrected prompt",
    );
    fireEvent.press(screen.getByText("Save + send"));

    await waitFor(() => {
      expect(onEditMessage).toHaveBeenCalledWith(
        expect.objectContaining({ id: "message-1" }),
        "Corrected prompt",
      );
      expect(onBranchMessage).toHaveBeenCalledWith(
        expect.objectContaining({ id: "message-1" }),
      );
    });
  });

  it("confirms the standalone fork action before creating a branch", () => {
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined);
    const onBranchMessage = jest.fn(async () => true);
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="conversation-1"
        colors={lightColors}
        messages={[
          {
            id: "message-1",
            role: "assistant",
            content: "Checkpoint",
            model: "gpt-5.4",
            provider: "openai",
            timestamp: "2026-08-03T10:00:00.000Z",
          },
        ]}
        onBranchMessage={onBranchMessage}
        onCopyMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        showUsageStats={false}
        showWhenEmpty
        t={(key) =>
          ({
            cancel: "Cancel",
            createFork: "Create fork",
            createForkConfirmation:
              "Do you want to create a fork of this conversation?",
            createForkTitle: "Create a fork?",
          })[key] ?? key
        }
      />,
    );

    fireEvent.press(screen.getByText("Request branch"));
    expect(onBranchMessage).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      "Create a fork?",
      "Do you want to create a fork of this conversation?",
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel", style: "cancel" }),
        expect.objectContaining({ text: "Create fork" }),
      ]),
    );

    alertSpy.mock.calls[0]?.[2]
      ?.find(({ text }) => text === "Create fork")
      ?.onPress?.();
    expect(onBranchMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: "message-1" }),
    );
  });

  it("shows a branch from its checkpoint while keeping inherited context hidden", () => {
    const screen = render(
      <TranscriptPreviewCard
        activeConversationId="child-conversation"
        activeConversationBranch={{
          rootConversationId: "parent-conversation",
          parentConversationId: "parent-conversation",
          parentMessageId: "parent-checkpoint",
          branchMessageId: "child-checkpoint",
          kind: "continue-from-message",
          createdAt: "2026-08-04T10:01:00.000Z",
        }}
        colors={lightColors}
        messages={[
          {
            id: "inherited-message",
            role: "assistant",
            content: "Inherited context",
            model: "gpt-5.4",
            provider: "openai",
            timestamp: "2026-08-04T09:59:00.000Z",
          },
          {
            id: "child-checkpoint",
            role: "user",
            content: "Forked prompt",
            model: null,
            provider: null,
            timestamp: "2026-08-04T10:00:00.000Z",
          },
          {
            id: "child-reply",
            role: "assistant",
            content: "Forked reply",
            model: "gpt-5.4",
            provider: "openai",
            timestamp: "2026-08-04T10:01:00.000Z",
          },
        ]}
        onCopyMessage={jest.fn()}
        onRetryMessage={jest.fn()}
        showUsageStats={false}
        showWhenEmpty
        t={(key) => key}
      />,
    );

    expect(
      screen.getByText("messages:child-checkpoint,child-reply"),
    ).toBeTruthy();
    expect(
      screen.queryByText(
        "messages:inherited-message,child-checkpoint,child-reply",
      ),
    ).toBeNull();
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
    fireEvent.press(
      screen.getByTestId("message-branch-choice-child-conversation"),
    );

    expect(onSelectBranchConversation).toHaveBeenCalledWith(
      "child-conversation",
    );
  });

});
