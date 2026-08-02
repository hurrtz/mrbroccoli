import { summarizeConversationContext } from "../llm";
import {
  buildConversationContextPlan,
  getConversationSummaryBody,
  hasCurrentConversationSummaryProvenance,
  markConversationSummaryProvenance,
} from "../conversationContext";
import type { Message } from "../../types";
import type { RunVoicePipelineParams } from "./types";

interface ResolveContextualMessagesParams {
  abortSignal?: AbortSignal;
  callbacks: RunVoicePipelineParams["callbacks"];
  contextSummary?: string;
  language: RunVoicePipelineParams["language"];
  messages: Message[];
  model: string;
  provider: RunVoicePipelineParams["provider"];
  providerApiKey: string;
  skipSummaryUpdate?: boolean;
  summarizedMessageCount?: number;
}

export async function resolveContextualMessages({
  abortSignal,
  callbacks,
  contextSummary,
  language,
  messages,
  model,
  provider,
  providerApiKey,
  skipSummaryUpdate = false,
  summarizedMessageCount,
}: ResolveContextualMessagesParams) {
  const canReuseExistingSummary =
    hasCurrentConversationSummaryProvenance(contextSummary);
  const existingSummaryBody = canReuseExistingSummary
    ? getConversationSummaryBody(contextSummary)
    : "";
  const contextPlan = buildConversationContextPlan({
    messages,
    contextSummary: existingSummaryBody,
    summarizedMessageCount: canReuseExistingSummary
      ? summarizedMessageCount
      : 0,
  });
  let effectiveSummary = canReuseExistingSummary
    ? markConversationSummaryProvenance(existingSummaryBody)
    : "";
  let contextualMessages = contextPlan.recentMessages;
  let summaryUpdated = false;
  let fallbackUsed = false;

  if (contextPlan.needsSummaryUpdate && !skipSummaryUpdate) {
    try {
      const { summary: updatedSummary, usage } =
        await summarizeConversationContext({
          existingSummary: existingSummaryBody,
          messages: contextPlan.messagesToSummarize,
          model,
          provider,
          apiKey: providerApiKey,
          language,
          abortSignal,
        });

      if (abortSignal?.aborted) {
        return {
          aborted: true,
          contextualMessages,
          effectiveSummary,
          receipt: {
            existingSummaryReused: Boolean(existingSummaryBody),
            summaryUpdateRequested: contextPlan.needsSummaryUpdate,
            summaryUpdated,
            fallbackUsed,
            messagesAvailable: messages.length,
            messagesSent: contextualMessages.length,
            messagesSummarized: contextPlan.messagesToSummarize.length,
          },
        } as const;
      }

      if (updatedSummary) {
        effectiveSummary = markConversationSummaryProvenance(updatedSummary);
        summaryUpdated = true;
        callbacks.onContextSummary?.(
          effectiveSummary,
          contextPlan.targetSummarizedCount,
          usage,
        );
      } else if (!effectiveSummary) {
        contextualMessages = contextPlan.fallbackRecentMessages;
        fallbackUsed = true;
      }
    } catch {
      if (abortSignal?.aborted) {
        return {
          aborted: true,
          contextualMessages,
          effectiveSummary,
          receipt: {
            existingSummaryReused: Boolean(existingSummaryBody),
            summaryUpdateRequested: contextPlan.needsSummaryUpdate,
            summaryUpdated,
            fallbackUsed,
            messagesAvailable: messages.length,
            messagesSent: contextualMessages.length,
            messagesSummarized: contextPlan.messagesToSummarize.length,
          },
        } as const;
      }

      contextualMessages = contextPlan.fallbackRecentMessages;
      fallbackUsed = true;
    }
  }

  return {
    aborted: false,
    contextualMessages,
    effectiveSummary,
    receipt: {
      existingSummaryReused: Boolean(existingSummaryBody),
      summaryUpdateRequested:
        contextPlan.needsSummaryUpdate && !skipSummaryUpdate,
      summaryUpdated,
      fallbackUsed,
      messagesAvailable: messages.length,
      messagesSent: contextualMessages.length,
      messagesSummarized: contextPlan.messagesToSummarize.length,
    },
  } as const;
}
