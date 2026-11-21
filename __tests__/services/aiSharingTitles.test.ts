import { authorizeConversationTitle } from "../../src/services/aiSharing/titles";
import {
  getAiSharingSnapshot,
  loadAiSharingHistory,
  recordAiSharingMessages,
  resolveAiSharing,
  setAiSharingPermission,
  subscribeAiSharing,
} from "../../src/services/aiSharing";
import type { Conversation, Message } from "../../src/types";

const first: Message = {
  id: "first",
  role: "user",
  content: "Already sent",
  model: null,
  provider: null,
  timestamp: "",
};
const foreign: Message = {
  ...first,
  id: "foreign",
  content: "A different provider's private text",
};
const chat: Conversation = {
  id: "for-title",
  title: "",
  messages: [first, foreign],
  createdAt: "",
  updatedAt: "",
  contextSummary: "A sensitive summary",
  summarizedMessageCount: 2,
};
const signal = new AbortController().signal;

it("uses only the original provider's approved first prompt when naming without general history access", async () => {
  await setAiSharingPermission("openai", "titles", true);
  await loadAiSharingHistory(chat.id);
  await recordAiSharingMessages(chat.id, [first], ["openai"]);
  const result = await authorizeConversationTitle(
    chat,
    "openai",
    "gpt",
    signal,
  );
  expect(result?.messages).toEqual([first]);
  expect(result?.usesHistory).toBe(false);
});

it("requires an explicit earlier-text decision before generating a title for an unfamiliar chat", async () => {
  const named = authorizeConversationTitle(chat, "anthropic", "claude", signal);
  const pending = await new Promise<
    NonNullable<ReturnType<typeof getAiSharingSnapshot>["pending"]>
  >((resolve) => {
    const stop = subscribeAiSharing(() => {
      const sheet = getAiSharingSnapshot().pending;
      if (sheet) {
        stop();
        resolve(sheet);
      }
    });
  });
  expect(pending.request.shareEarlier).toBe(true);
  expect(pending.request.required).toEqual([
    { provider: "anthropic", purpose: "titles" },
    { provider: "anthropic", purpose: "history" },
  ]);
  await resolveAiSharing(pending.id, null);
  expect(await named).toBeNull();
});
