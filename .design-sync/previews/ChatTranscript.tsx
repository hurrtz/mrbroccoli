import React from "react";
import { ChatTranscript, View, darkColors } from "mrbroccoli";

// ChatTranscript renders a FlatList of ChatBubble rows from Message objects
// (src/types.ts). Reused from the ChatBubble preview: the same realistic
// Message factory, since the assistant voice is spoken-style prose only —
// the app's assistant instructions forbid markdown, lists, and headings.

const message = (
  id: string,
  role: "user" | "assistant",
  content: string,
  extra: Record<string, unknown> = {},
) => ({
  id,
  role,
  content,
  model: role === "assistant" ? "claude-opus-5" : null,
  provider: role === "assistant" ? ("anthropic" as const) : null,
  timestamp: "2026-08-09T09:14:22.000Z",
  ...extra,
});

// ChatTranscript's root is a FlatList with `flex: 1`. In the real app an
// ancestor (TranscriptPreviewCard) supplies a bounded height; a headless
// preview cell has no such ancestor, so each cell gives it one directly —
// otherwise the list collapses to zero height and nothing is visible.
const Frame = ({
  children,
  height = 460,
}: {
  children: React.ReactNode;
  height?: number;
}) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 12,
      width: "100%",
      maxWidth: 520,
      height,
    }}
  >
    {children}
  </View>
);

const noop = () => {};

// Note: the selectable/TextInput path (see learnings) does not grow past
// roughly two lines of text in this render, so message copy here is kept
// deliberately short — realistic for a voice assistant's spoken replies
// anyway, and it keeps every bubble fully visible instead of clipped.
export const Conversation = () => (
  <Frame height={820}>
    <ChatTranscript
      conversationId="conv-airport-run"
      messageSelectionEnabled
      messages={[
        message(
          "t1",
          "user",
          "Can you check if there's a faster route to the airport tomorrow morning?",
        ),
        message(
          "t2",
          "assistant",
          "Leaving by six fifteen keeps you on the ring road and saves about twelve minutes.",
        ),
        message(
          "t3",
          "user",
          "Let's aim for six fifteen. Remind me twenty minutes before?",
        ),
        message("t4", "assistant", "Done, I'll remind you at five fifty five."),
      ]}
      onCopyMessage={async () => true}
      onEditMessage={noop}
      onShareMessage={noop}
      onReportMessage={noop}
      onRepeatMessage={noop}
      onRetryMessage={noop}
    />
  </Frame>
);

export const WithUsageStats = () => (
  <Frame height={420}>
    <ChatTranscript
      conversationId="conv-usage"
      showUsageStats
      messageSelectionEnabled
      messages={[
        message("u1", "user", "Summarize yesterday's planning call."),
        message(
          "u2",
          "assistant",
          "You agreed to ship the language fix first and keep release notes short.",
          {
            usage: {
              kind: "reply",
              source: "estimated",
              promptTokens: 2214,
              completionTokens: 118,
              totalTokens: 2332,
            },
          },
        ),
      ]}
      onCopyMessage={async () => true}
    />
  </Frame>
);

export const Speaking = () => (
  <Frame height={300}>
    <ChatTranscript
      conversationId="conv-speaking"
      messageSelectionEnabled
      activeRepeatMessageId="s2"
      repeatPlaybackStatus="speaking"
      messages={[
        message("s1", "user", "Read me today's headlines."),
        message(
          "s2",
          "assistant",
          "Council approved the new bike lane, and transit returns to normal next month.",
        ),
      ]}
      onCopyMessage={async () => true}
      onRepeatMessage={noop}
    />
  </Frame>
);

export const Empty = () => (
  <Frame height={280}>
    <ChatTranscript conversationId="conv-empty" messages={[]} />
  </Frame>
);
