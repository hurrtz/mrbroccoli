import React from "react";
import { ChatBubble, View, darkColors } from "mrbroccoli";

// ChatBubble takes a whole Message (src/types.ts) rather than loose props, so
// the realistic preview is a real message object. Content is voice-assistant
// prose — the app's assistant instructions forbid markdown, lists, and
// headings, so a bubble is always a plain spoken-style paragraph.

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

// Bubbles sit on the app canvas, not on the white preview page.
const Stack = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 12,
      gap: 4,
      width: "100%",
      maxWidth: 520,
    }}
  >
    {children}
  </View>
);

export const Conversation = () => (
  <Stack>
    <ChatBubble
      message={message(
        "m1",
        "user",
        "What is the weather like in Berlin this weekend?",
      )}
    />
    <ChatBubble
      message={message(
        "m2",
        "assistant",
        "Berlin looks mild this weekend. Saturday stays mostly cloudy around eighteen degrees with a light breeze from the west, and Sunday clears up a little and reaches about twenty one degrees. There is a small chance of showers late on Saturday evening, so an umbrella is worth having if you are out after dark.",
      )}
      onCopy={async () => true}
      onRepeat={() => {}}
    />
  </Stack>
);

export const UserMessage = () => (
  <Stack>
    <ChatBubble
      message={message(
        "m3",
        "user",
        "Remind me what we decided about the release notes yesterday.",
      )}
    />
  </Stack>
);

export const LongAssistantAnswer = () => (
  <Stack>
    <ChatBubble
      message={message(
        "m4",
        "assistant",
        "You decided to keep the release notes short and written for people rather than for changelog readers. Every entry describes what changed from the outside, so a fix to the language selector reads as the selector no longer switching on its own, not as a state reset in the setup flow. You also agreed to hold anything that only matters to developers out of the store notes entirely, and to write the same summary in every language rather than translating only the headline.",
      )}
      onCopy={async () => true}
      onRepeat={() => {}}
      onShare={() => {}}
    />
  </Stack>
);

export const WithUsageStats = () => (
  <Stack>
    <ChatBubble
      showUsageStats
      message={message(
        "m5",
        "assistant",
        "The download finished and the model is ready to use offline.",
        {
          usage: {
            kind: "reply",
            source: "estimated",
            promptTokens: 1840,
            completionTokens: 96,
            totalTokens: 1936,
          },
        },
      )}
      onCopy={async () => true}
    />
  </Stack>
);
