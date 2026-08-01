import { Message } from "../types";
import { getMessageContentWithResponseProvenance } from "./llm/messageProvenance";

export const CONTEXT_SUMMARY_TRIGGER_TOKENS = 2400;
export const CONTEXT_RECENT_TOKEN_BUDGET = 1400;
export const CONTEXT_RECENT_MIN_MESSAGES = 6;
export const CONTEXT_RECENT_MAX_MESSAGES = 10;
export const CONTEXT_SUMMARY_PROVENANCE_MARKER =
  "[Conversation response provenance v1]";

export interface ConversationContextPlan {
  estimatedTokenCount: number;
  usesSummary: boolean;
  targetSummarizedCount: number;
  needsSummaryUpdate: boolean;
  messagesToSummarize: Message[];
  recentMessages: Message[];
  fallbackRecentMessages: Message[];
}

export function estimateTextTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export function estimateMessageTokens(
  message: Pick<Message, "role" | "content"> &
    Partial<Pick<Message, "model" | "provider" | "attachments">>,
) {
  return (
    estimateTextTokens(getMessageContentWithResponseProvenance(message)) +
    (message.attachments?.length ?? 0) * 1000 +
    10
  );
}

export function hasCurrentConversationSummaryProvenance(summary?: string) {
  return summary?.trim().startsWith(CONTEXT_SUMMARY_PROVENANCE_MARKER) ?? false;
}

export function getConversationSummaryBody(summary?: string) {
  const trimmedSummary = summary?.trim() ?? "";

  if (!hasCurrentConversationSummaryProvenance(trimmedSummary)) {
    return trimmedSummary;
  }

  return trimmedSummary.slice(CONTEXT_SUMMARY_PROVENANCE_MARKER.length).trim();
}

export function markConversationSummaryProvenance(summary: string) {
  const body = getConversationSummaryBody(summary);
  return body ? `${CONTEXT_SUMMARY_PROVENANCE_MARKER}\n${body}` : "";
}

export function estimateMessagesTokens(messages: Message[]) {
  return messages.reduce(
    (total, message) => total + estimateMessageTokens(message),
    0
  );
}

function selectRecentMessages(messages: Message[]) {
  if (messages.length <= CONTEXT_RECENT_MIN_MESSAGES) {
    return messages;
  }

  const selected: Message[] = [];
  let tokens = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    const nextCount = selected.length + 1;
    const nextTokens = tokens + estimateMessageTokens(message);
    const needsMinimum = selected.length < CONTEXT_RECENT_MIN_MESSAGES;

    if (
      !needsMinimum &&
      (nextCount > CONTEXT_RECENT_MAX_MESSAGES ||
        nextTokens > CONTEXT_RECENT_TOKEN_BUDGET)
    ) {
      break;
    }

    selected.unshift(message);
    tokens = nextTokens;
  }

  return selected;
}

export function buildConversationContextPlan(params: {
  messages: Message[];
  contextSummary?: string;
  summarizedMessageCount?: number;
}) {
  const estimatedTokenCount = estimateMessagesTokens(params.messages);
  const existingSummary = params.contextSummary?.trim() ?? "";
  const existingCoveredCount = Math.max(
    0,
    Math.min(params.summarizedMessageCount ?? 0, params.messages.length)
  );
  const hasSummary = existingSummary.length > 0 && existingCoveredCount > 0;
  const shouldCompact =
    hasSummary || estimatedTokenCount > CONTEXT_SUMMARY_TRIGGER_TOKENS;

  if (!shouldCompact) {
    return {
      estimatedTokenCount,
      usesSummary: false,
      targetSummarizedCount: 0,
      needsSummaryUpdate: false,
      messagesToSummarize: [],
      recentMessages: params.messages,
      fallbackRecentMessages: params.messages,
    } satisfies ConversationContextPlan;
  }

  const fallbackRecentMessages = selectRecentMessages(params.messages);
  const desiredCoveredCount = Math.max(
    0,
    params.messages.length - fallbackRecentMessages.length
  );
  const targetSummarizedCount = Math.max(
    existingCoveredCount,
    desiredCoveredCount
  );

  return {
    estimatedTokenCount,
    usesSummary: hasSummary || targetSummarizedCount > 0,
    targetSummarizedCount,
    needsSummaryUpdate: targetSummarizedCount > existingCoveredCount,
    messagesToSummarize: params.messages.slice(
      existingCoveredCount,
      targetSummarizedCount
    ),
    recentMessages: params.messages.slice(targetSummarizedCount),
    fallbackRecentMessages,
  } satisfies ConversationContextPlan;
}
