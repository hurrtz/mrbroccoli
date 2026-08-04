import React from "react";
import { Linking, StyleSheet } from "react-native";
import { act, fireEvent } from "@testing-library/react-native";

import { ChatBubble } from "../../src/components/ChatBubble";
import {
  darkColors,
  getAccessibleForeground,
  lightColors,
} from "../../src/theme/colors";
import { renderWithProviders } from "../test-utils/renderWithProviders";

const hiddenIconQuery = { includeHiddenElements: true } as const;

describe("ChatBubble", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("offers transcript correction for selectable user messages", () => {
    const onEdit = jest.fn();
    const message = {
      id: "user-transcript",
      role: "user" as const,
      content: "Misheard transcript",
      model: null,
      provider: null,
      timestamp: "2026-08-03T10:00:00.000Z",
    };
    const screen = renderWithProviders(
      <ChatBubble selectable message={message} onEdit={onEdit} />,
    );

    fireEvent.press(screen.getByLabelText("Correct transcript"));

    expect(onEdit).toHaveBeenCalledWith(message);
  });

  it("keeps sending out of the action row after a user transcript was edited", () => {
    const onBranch = jest.fn();
    const message = {
      id: "edited-user-transcript",
      role: "user" as const,
      content: "Corrected transcript",
      editedAt: "2026-08-04T09:00:00.000Z",
      model: null,
      provider: null,
      timestamp: "2026-08-04T08:59:00.000Z",
    };
    const screen = renderWithProviders(
      <ChatBubble selectable message={message} onBranch={onBranch} />,
    );

    expect(screen.queryByLabelText("Send message")).toBeNull();
    fireEvent.press(screen.getByLabelText("Branch from here"));

    expect(onBranch).toHaveBeenCalledWith(message);
    const uneditedScreen = renderWithProviders(
      <ChatBubble
        selectable
        message={{ ...message, editedAt: undefined }}
        onBranch={onBranch}
      />,
    );
    expect(uneditedScreen.getByLabelText("Branch from here")).toBeTruthy();
  });

  it("can branch from an assistant checkpoint", () => {
    const onBranch = jest.fn();
    const message = {
      id: "assistant-checkpoint",
      role: "assistant" as const,
      content: "A useful checkpoint",
      model: "gpt-5.4",
      provider: "openai" as const,
      timestamp: "2026-08-04T09:05:00.000Z",
    };
    const screen = renderWithProviders(
      <ChatBubble selectable message={message} onBranch={onBranch} />,
    );

    fireEvent.press(screen.getByLabelText("Branch from here"));

    expect(onBranch).toHaveBeenCalledWith(message);
  });

  it("shows the exact source and children at a branch checkpoint", () => {
    const onOpenBranches = jest.fn();
    const onOpenBranchSource = jest.fn();
    const message = {
      id: "branch-message",
      role: "assistant" as const,
      content: "A branch checkpoint",
      model: "gpt-5.4",
      provider: "openai" as const,
      timestamp: "2026-08-04T09:05:00.000Z",
    };
    const child = {
      id: "child-conversation",
      title: "Child branch",
      createdAt: "2026-08-04T09:06:00.000Z",
      updatedAt: "2026-08-04T09:06:00.000Z",
      messageCount: 2,
      providers: ["openai" as const],
      providerModels: { openai: ["gpt-5.4"] },
      lastModel: "gpt-5.4",
      lastProvider: "openai" as const,
      pinned: false,
    };
    const branchOrigin = {
      rootConversationId: "root-conversation",
      parentConversationId: "parent-conversation",
      parentMessageId: "parent-message",
      branchMessageId: message.id,
      kind: "continue-from-message" as const,
      createdAt: "2026-08-04T09:05:30.000Z",
      parentAvailable: true,
      parentTitle: "Parent conversation",
    };
    const screen = renderWithProviders(
      <ChatBubble
        selectable
        message={message}
        branchChildren={[child]}
        branchOrigin={branchOrigin}
        onOpenBranches={onOpenBranches}
        onOpenBranchSource={onOpenBranchSource}
      />,
    );

    fireEvent.press(
      screen.getByLabelText(
        "Context from “Parent conversation” is included up to this fork. Tap to return to the fork point.",
      ),
    );
    fireEvent.press(screen.getByLabelText("Back to fork point"));
    fireEvent.press(screen.getByLabelText("1 branch"));

    expect(onOpenBranchSource).toHaveBeenCalledTimes(2);
    expect(onOpenBranchSource).toHaveBeenLastCalledWith(
      "parent-conversation",
      "parent-message",
    );
    expect(onOpenBranches).toHaveBeenCalledWith([child]);
  });

  it("does not show an insight action for assistant messages", () => {
    const message = {
      id: "assistant-insight",
      role: "assistant" as const,
      content: "A useful decision",
      model: "gpt-5.4",
      provider: "openai" as const,
      timestamp: "2026-08-04T09:05:00.000Z",
    };
    const screen = renderWithProviders(
      <ChatBubble selectable message={message} />,
    );

    expect(
      screen.queryByTestId("message-save-insight-action-assistant-insight"),
    ).toBeNull();
    expect(
      screen.queryByTestId("message-more-actions-assistant-insight"),
    ).toBeNull();
    expect(screen.queryByText("Save as insight")).toBeNull();
  });

  it("keeps web-search details collapsed until requested and opens citation links", () => {
    const openUrlSpy = jest
      .spyOn(Linking, "openURL")
      .mockResolvedValueOnce(undefined);

    const { getByLabelText, getByTestId, getByText, queryByText } =
      renderWithProviders(
        <ChatBubble
          message={{
            id: "assistant-1",
            role: "assistant",
            content: "Here is the latest context.",
            model: "claude-opus-4-6",
            provider: "anthropic",
            timestamp: "2026-03-25T12:00:00.000Z",
            metadata: {
              webSearch: {
                provider: "openai",
                model: "gpt-5.4-mini",
                query: "What changed this week?",
                summary: "Several updates shipped this week.",
                sources: [
                  {
                    title: "Release notes",
                    url: "https://example.com/release-notes",
                  },
                ],
              },
            },
          }}
        />,
      );

    expect(getByText("Web Search")).toBeTruthy();
    expect(getByText("1 source")).toBeTruthy();
    expect(queryByText("Used web search")).toBeNull();
    expect(queryByText("What changed this week?")).toBeNull();
    expect(queryByText("Several updates shipped this week.")).toBeNull();
    expect(queryByText("Sources")).toBeNull();
    expect(queryByText("Release notes")).toBeNull();
    expect(queryByText("Anthropic")).toBeNull();
    expect(getByTestId("message-timestamp-assistant-1").props.children).toMatch(
      /\d{2}.*\d{2}:\d{2}/,
    );
    expect(
      StyleSheet.flatten(
        getByTestId("web-search-references-assistant-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        marginTop: 14,
        marginBottom: 4,
        paddingVertical: 0,
      }),
    );
    expect(
      StyleSheet.flatten(
        getByTestId("web-search-accordion-assistant-1").props.style,
      ),
    ).toEqual(expect.objectContaining({ minHeight: 44 }));

    fireEvent.press(getByLabelText("Show web search details"));

    expect(getByLabelText("Hide web search details")).toBeTruthy();
    expect(getByText("What changed this week?")).toBeTruthy();
    expect(getByText("Several updates shipped this week.")).toBeTruthy();
    expect(getByText("Sources")).toBeTruthy();
    expect(getByText("Release notes")).toBeTruthy();

    fireEvent.press(getByLabelText("Open source: Release notes"));

    expect(openUrlSpy).toHaveBeenCalledWith(
      "https://example.com/release-notes",
    );
  });

  it("does not show web-search UI for messages without search metadata", () => {
    const { queryByText } = renderWithProviders(
      <ChatBubble
        message={{
          id: "assistant-2",
          role: "assistant",
          content: "Just a normal answer.",
          model: "claude-opus-4-6",
          provider: "anthropic",
          timestamp: "2026-03-25T12:05:00.000Z",
        }}
      />,
    );

    expect(queryByText("Used web search")).toBeNull();
    expect(queryByText("Sources")).toBeNull();
  });

  it("shows which past conversations contributed to a reply", () => {
    const { getByLabelText, getByText, queryByText } = renderWithProviders(
      <ChatBubble
        message={{
          id: "assistant-memory",
          role: "assistant",
          content: "We chose a local index.",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-08-02T12:05:00.000Z",
          metadata: {
            conversationKnowledge: {
              contentPolicy: "user-authored-only",
              engine: "local-user-authored-v3",
              sources: [
                {
                  conversationId: "architecture",
                  match: "strong",
                  title: "Architecture notes",
                  updatedAt: "2026-08-01T08:00:00.000Z",
                },
              ],
            },
          },
        }}
      />,
    );

    expect(getByText("Past conversations")).toBeTruthy();
    expect(getByText("1 source")).toBeTruthy();
    expect(queryByText("Architecture notes")).toBeNull();

    fireEvent.press(getByLabelText("Show recalled conversation sources"));

    expect(getByText("Architecture notes")).toBeTruthy();
    expect(getByText("User messages only")).toBeTruthy();
    expect(getByText(/Strong match/)).toBeTruthy();
    expect(getByLabelText("Hide recalled conversation sources")).toBeTruthy();
  });

  it("keeps the execution receipt collapsed and reveals exact routes on demand", () => {
    const { getByLabelText, getByTestId, getByText, queryByText } =
      renderWithProviders(
        <ChatBubble
          message={{
            id: "assistant-receipt",
            role: "assistant",
            content: "A transparent answer.",
            model: "gpt-5.6",
            provider: "openai",
            timestamp: "2026-07-25T10:00:00.000Z",
            metadata: {
              turnReceipt: {
                version: 1,
                startedAt: "2026-07-25T09:59:55.000Z",
                input: {
                  source: "voice",
                  mode: "provider",
                  provider: "openai",
                  model: "gpt-4o-transcribe",
                },
                requestedRoute: {
                  provider: "openai",
                  model: "gpt-5.6",
                },
                actualRoute: {
                  provider: "openai",
                  model: "gpt-5.6",
                },
                effort: {
                  selected: "xhigh",
                  label: "Extra high",
                  transportParameter: "reasoning_effort",
                  transportValue: "xhigh",
                  semantics: "provider-native",
                },
                webSearch: {
                  mode: "on",
                  provider: "openai",
                  requested: true,
                  ready: true,
                  used: true,
                  fellBack: false,
                  decisionReason: "manual-on",
                  model: "gpt-5.6-sol",
                },
                speechOutput: {
                  enabled: true,
                  requestedMode: "provider",
                  actualMode: "native",
                  provider: "elevenlabs",
                  model: "eleven_multilingual_v2",
                  voice: "Rachel",
                  fellBack: true,
                  fallbackReason: "The provider voice timed out.",
                },
                context: {
                  existingSummaryReused: true,
                  summaryUpdateRequested: true,
                  summaryUpdated: true,
                  fallbackUsed: false,
                  messagesAvailable: 14,
                  messagesSent: 6,
                  messagesSummarized: 8,
                },
                timing: {
                  transcriptionMs: 800,
                  contextMs: 120,
                  webSearchMs: 900,
                  modelMs: 2_500,
                  firstSpeechMs: 4_500,
                  totalMs: 7_200,
                },
              },
            },
          }}
        />,
      );

    expect(getByText("Turn details")).toBeTruthy();
    expect(queryByText("Requested reply route")).toBeNull();
    expect(
      StyleSheet.flatten(
        getByTestId("turn-receipt-assistant-receipt").props.style,
      ),
    ).toEqual(expect.objectContaining({ gap: 0, paddingVertical: 0 }));
    expect(
      StyleSheet.flatten(
        getByTestId("turn-receipt-accordion-assistant-receipt").props.style,
      ),
    ).toEqual(expect.objectContaining({ minHeight: 44 }));

    fireEvent.press(getByLabelText("Show turn details"));

    expect(getByLabelText("Hide turn details")).toBeTruthy();
    expect(getByText("Requested reply route")).toBeTruthy();
    expect(getByText("Actual reply route")).toBeTruthy();
    expect(getByText(/reasoning_effort=xhigh/)).toBeTruthy();
    expect(getByText("The provider voice timed out.")).toBeTruthy();
    expect(
      getByText(
        "6/14 prior messages sent · 8 newly summarized · saved summary reused · summary updated",
      ),
    ).toBeTruthy();
    expect(getByText(/total 7.2 s/)).toBeTruthy();
  });

  it("renders user messages as full-width rows with a right-side role cue", () => {
    const { getByTestId, getByText } = renderWithProviders(
      <ChatBubble
        message={{
          id: "user-full-width",
          role: "user",
          content: "Keep both sides of the conversation readable.",
          model: null,
          provider: null,
          timestamp: "2026-07-22T10:00:00.000Z",
        }}
      />,
    );

    const rowStyle = StyleSheet.flatten(
      getByTestId("chat-message-row-user-full-width").props.style,
    );

    expect(rowStyle).toEqual(
      expect.objectContaining({
        width: "100%",
        marginBottom: 8,
        borderWidth: 1,
        borderRightWidth: 3,
      }),
    );
    expect(rowStyle.borderLeftWidth).toBeUndefined();
    expect(getByText("You")).toBeTruthy();
    expect(
      getByTestId("message-timestamp-user-full-width").props.children,
    ).toMatch(/\d{2}.*\d{2}:\d{2}/);
  });

  it("renders assistant messages as full-width rows with a left-side role cue", () => {
    const { getByTestId, getByText } = renderWithProviders(
      <ChatBubble
        message={{
          id: "assistant-full-width",
          role: "assistant",
          content: "The role remains clear without a chat bubble.",
          model: null,
          provider: null,
          timestamp: "2026-07-22T10:01:00.000Z",
        }}
      />,
    );

    const rowStyle = StyleSheet.flatten(
      getByTestId("chat-message-row-assistant-full-width").props.style,
    );

    expect(rowStyle).toEqual(
      expect.objectContaining({
        width: "100%",
        marginBottom: 8,
        borderWidth: 1,
        borderLeftWidth: 3,
      }),
    );
    expect(rowStyle.borderRightWidth).toBeUndefined();
    expect(getByText("Assistant")).toBeTruthy();
  });

  it("uses a read-only text input for direct message text selection", () => {
    const { getByTestId } = renderWithProviders(
      <ChatBubble
        selectable
        message={{
          id: "assistant-selectable",
          role: "assistant",
          content: "Select only the words you need.",
          model: "claude-opus-4-6",
          provider: "anthropic",
          timestamp: "2026-03-25T12:07:00.000Z",
        }}
      />,
    );

    expect(
      getByTestId("selectable-message-assistant-selectable").props,
    ).toEqual(
      expect.objectContaining({
        multiline: true,
        readOnly: true,
        scrollEnabled: false,
        value: "Select only the words you need.",
      }),
    );
  });

  it("shows copy, share, and speech actions only on assistant messages", () => {
    const onCopy = jest.fn();
    const onShare = jest.fn();
    const onRepeat = jest.fn();
    const assistantMessage = {
      id: "assistant-actions",
      role: "assistant" as const,
      content: "Every assistant reply keeps its actions nearby.",
      model: "grok-4.5",
      provider: "xai" as const,
      timestamp: "2026-07-22T10:02:00.000Z",
    };
    const assistant = renderWithProviders(
      <ChatBubble
        selectable
        message={assistantMessage}
        onCopy={onCopy}
        onShare={onShare}
        onRepeat={onRepeat}
      />,
    );

    fireEvent.press(assistant.getByLabelText("Copy"));
    fireEvent.press(assistant.getByLabelText("Share"));
    fireEvent.press(assistant.getByLabelText("Repeat Reply"));

    expect(onCopy).toHaveBeenCalledWith(assistantMessage);
    expect(onShare).toHaveBeenCalledWith(assistantMessage);
    expect(onRepeat).toHaveBeenCalledWith(assistantMessage);
    expect(
      StyleSheet.flatten(
        assistant.getByTestId("message-actions-assistant-actions").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        justifyContent: "flex-start",
        marginHorizontal: -12,
        marginBottom: -14,
        borderTopWidth: StyleSheet.hairlineWidth,
      }),
    );
    expect(
      StyleSheet.flatten(
        assistant.getByTestId("message-copy-action-assistant-actions").props
          .style,
      ),
    ).toEqual(expect.objectContaining({ height: 44, width: 44 }));
    for (const icon of ["copy", "share-alt", "sound"]) {
      const iconStyle = StyleSheet.flatten(
        assistant.getByTestId(`phosphor-icon-${icon}`, hiddenIconQuery).props
          .style,
      );
      expect(iconStyle.width).toBe(20);
      expect(iconStyle.height).toBe(20);
    }

    const user = renderWithProviders(
      <ChatBubble
        selectable
        message={{
          ...assistantMessage,
          id: "user-without-actions",
          role: "user",
          model: null,
          provider: null,
        }}
        onCopy={onCopy}
        onShare={onShare}
        onRepeat={onRepeat}
      />,
    );

    expect(user.queryByLabelText("Copy")).toBeNull();
    expect(user.queryByLabelText("Share")).toBeNull();
    expect(user.queryByLabelText("Repeat Reply")).toBeNull();
  });

  it("shows a green copy confirmation for exactly three seconds", async () => {
    jest.useFakeTimers();
    const onCopy = jest.fn(async () => true);
    const assistantMessage = {
      id: "assistant-copy-confirmation",
      role: "assistant" as const,
      content: "Copy this response.",
      model: "grok-4.5",
      provider: "xai" as const,
      timestamp: "2026-07-22T10:02:00.000Z",
    };
    const screen = renderWithProviders(
      <ChatBubble selectable message={assistantMessage} onCopy={onCopy} />,
    );

    try {
      expect(
        screen.getByTestId("phosphor-icon-copy", hiddenIconQuery),
      ).toBeTruthy();

      await act(async () => {
        fireEvent.press(screen.getByLabelText("Copy"));
        await Promise.resolve();
      });

      const confirmedButton = screen.getByTestId(
        "message-copy-action-assistant-copy-confirmation",
      );
      expect(
        screen.getByTestId("phosphor-icon-check", hiddenIconQuery),
      ).toBeTruthy();
      expect(
        StyleSheet.flatten(confirmedButton.props.style).backgroundColor,
      ).toBe(lightColors.success);
      expect(
        StyleSheet.flatten(
          screen.getByTestId("phosphor-icon-check", hiddenIconQuery).props
            .style,
        ).color,
      ).toBe(getAccessibleForeground(lightColors.success));

      act(() => {
        jest.advanceTimersByTime(2_999);
      });
      expect(
        screen.getByTestId("phosphor-icon-check", hiddenIconQuery),
      ).toBeTruthy();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(
        screen.getByTestId("phosphor-icon-copy", hiddenIconQuery),
      ).toBeTruthy();
    } finally {
      screen.unmount();
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    }
  });

  it("uses the positive phase color while repeated speech is active", () => {
    const assistantMessage = {
      id: "assistant-repeat-speaking",
      role: "assistant" as const,
      content: "Read this response aloud.",
      model: "grok-4.5",
      provider: "xai" as const,
      timestamp: "2026-07-22T10:02:00.000Z",
    };
    const screen = renderWithProviders(
      <ChatBubble
        selectable
        message={assistantMessage}
        onRepeat={jest.fn()}
        repeatState="speaking"
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("message-repeat-action-assistant-repeat-speaking")
          .props.style,
      ).backgroundColor,
    ).toBe(lightColors.success);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("phosphor-icon-stop", hiddenIconQuery).props.style,
      ).color,
    ).toBe(getAccessibleForeground(lightColors.success));
  });

  it.each([
    ["light", lightColors],
    ["dark", darkColors],
  ] as const)(
    "matches the %s CTA synthesis color while replay is preparing",
    (themeMode, colors) => {
      const messageId = `assistant-repeat-preparing-${themeMode}`;
      const screen = renderWithProviders(
        <ChatBubble
          selectable
          message={{
            id: messageId,
            role: "assistant",
            content: "Prepare this response for speech.",
            model: "grok-4.5",
            provider: "xai",
            timestamp: "2026-07-22T10:02:00.000Z",
          }}
          onRepeat={jest.fn()}
          repeatState="preparing"
        />,
        { themeMode },
      );

      expect(
        StyleSheet.flatten(
          screen.getByTestId(`message-repeat-action-${messageId}`).props.style,
        ).backgroundColor,
      ).toBe(colors.phaseSynthesizing);
      expect(
        StyleSheet.flatten(
          screen.getByTestId("phosphor-icon-loading", hiddenIconQuery).props
            .style,
        ).color,
      ).toBe(getAccessibleForeground(colors.phaseSynthesizing));
      screen.unmount();
    },
  );

  it("keeps copy neutral when the clipboard write fails", () => {
    const screen = renderWithProviders(
      <ChatBubble
        selectable
        message={{
          id: "assistant-copy-failed",
          role: "assistant",
          content: "This copy fails.",
          model: "grok-4.5",
          provider: "xai",
          timestamp: "2026-07-22T10:02:00.000Z",
        }}
        onCopy={async () => false}
      />,
    );

    fireEvent.press(screen.getByLabelText("Copy"));

    expect(
      screen.getByTestId("phosphor-icon-copy", hiddenIconQuery),
    ).toBeTruthy();
    expect(
      screen.queryByTestId("phosphor-icon-check", hiddenIconQuery),
    ).toBeNull();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("message-copy-action-assistant-copy-failed").props
          .style,
      ).backgroundColor,
    ).toBe(lightColors.surfaceAlt);
  });

  it("renders durable pipeline notices without requiring message content", () => {
    const { getByText, queryByText } = renderWithProviders(
      <ChatBubble
        message={{
          id: "assistant-3",
          role: "assistant",
          content: "",
          model: null,
          provider: null,
          timestamp: "2026-03-25T12:10:00.000Z",
          metadata: {
            notices: [
              {
                stage: "stt",
                level: "error",
                message: "OpenAI speech transcription took too long.",
                detail: "The request hit the provider timeout window.",
              },
            ],
          },
        }}
      />,
    );

    expect(getByText("Speech to Text")).toBeTruthy();
    expect(
      getByText("OpenAI speech transcription took too long."),
    ).toBeTruthy();
    expect(
      getByText("The request hit the provider timeout window."),
    ).toBeTruthy();
    expect(queryByText("Just a normal answer.")).toBeNull();
  });

  it("keeps a failed reply recoverable on the submitted user message", () => {
    const onRetry = jest.fn();
    const message = {
      id: "user-failed-reply",
      role: "user" as const,
      content: "Please keep this message.",
      model: null,
      provider: null,
      timestamp: "2026-07-21T12:10:00.000Z",
      metadata: {
        replyFailure: {
          message: "The provider rejected the credentials.",
        },
      },
    };
    const { getByLabelText, getByText } = renderWithProviders(
      <ChatBubble message={message} onRetry={onRetry} />,
    );

    expect(getByText("Reply failed")).toBeTruthy();
    expect(getByText("The provider rejected the credentials.")).toBeTruthy();
    fireEvent.press(getByLabelText("Retry reply"));

    expect(onRetry).toHaveBeenCalledWith(message);
  });

  it("keeps a failed spoken reply recoverable from the saved assistant message", () => {
    const onRepeat = jest.fn();
    const onOpenSpeakingSettings = jest.fn();
    const message = {
      id: "assistant-failed-speech",
      role: "assistant" as const,
      content: "The answer is still safely here.",
      model: "grok-4.3",
      provider: "xai" as const,
      timestamp: "2026-07-21T12:10:00.000Z",
      metadata: {
        notices: [
          {
            stage: "tts" as const,
            level: "error" as const,
            message: "The reply was saved, but it could not be spoken.",
            detail: "xAI speech output took too long.",
          },
        ],
      },
    };
    const { getByLabelText, getByText } = renderWithProviders(
      <ChatBubble
        message={message}
        onRepeat={onRepeat}
        onOpenSpeakingSettings={onOpenSpeakingSettings}
      />,
    );

    expect(getByText("The answer is still safely here.")).toBeTruthy();
    expect(
      getByText("The reply was saved, but it could not be spoken."),
    ).toBeTruthy();

    fireEvent.press(getByLabelText("Retry speech"));
    fireEvent.press(getByLabelText("Speaking settings"));

    expect(onRepeat).toHaveBeenCalledWith(message);
    expect(onOpenSpeakingSettings).toHaveBeenCalledTimes(1);
  });
});
