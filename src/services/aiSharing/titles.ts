import type { Conversation, Provider } from "../../types";
import {
  getAiSharingFirstPrompt,
  getAiSharingHistory,
  loadAiSharingHistory,
  recordAiSharingMessages,
  aiSharingTextMessage,
} from "./history";
import { requestAiSharing } from "./requests";

/** A manual title uses only text already available to this recipient. A legacy
 * or switched chat with no eligible text needs an explicit history import. */
export async function authorizeConversationTitle(
  conversation: Conversation,
  provider: Provider,
  model: string,
  signal: AbortSignal,
) {
  await loadAiSharingHistory(conversation.id);
  const history = getAiSharingHistory(
    conversation.id,
    conversation.messages,
    [provider],
    model,
  );
  const first = getAiSharingFirstPrompt(
    conversation.id,
    conversation.messages,
    provider,
    model,
  );
  const shareEarlier = !history.length && !first;
  const authorization = await requestAiSharing(
    {
      required: [
        { provider, purpose: "titles" },
        ...(shareEarlier ? [{ provider, purpose: "history" as const }] : []),
      ],
      shareEarlier,
      openRouterModels: provider === "openrouter" ? [model] : undefined,
    },
    signal,
  );
  if (!authorization?.allows(provider, "titles")) return null;
  if (shareEarlier) {
    if (!authorization.allows(provider, "history")) return null;
    await recordAiSharingMessages(
      conversation.id,
      conversation.messages,
      [provider],
      model,
    );
  }
  const eligible = getAiSharingHistory(
    conversation.id,
    conversation.messages,
    [provider],
    model,
  );
  const messages = eligible.length ? eligible : first ? [first] : [];
  if (!messages.length || signal.aborted) return null;
  return {
    messages: messages.map(aiSharingTextMessage),
    usesHistory: !!eligible.length,
    authorization,
  };
}
