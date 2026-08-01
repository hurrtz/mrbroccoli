import type { AppLanguage, Message, Provider } from "../../types";
import { estimateChatUsage } from "../../utils/usageStats";
import {
  buildConversationContextPlan,
  getConversationSummaryBody,
} from "../conversationContext";
import {
  CONVERSATION_TITLE_PROMPT,
  CONTEXT_SUMMARIZER_PROMPT,
  addImageContentSafetyInstruction,
  formatMessagesForSummary,
} from "./prompts";
import {
  buildProviderEmptyReplyError,
  requestChatText,
  requestChatTextResolved,
} from "./requestRouter";

export async function generateInternalChat(params: {
  messages: Pick<Message, "role" | "content" | "attachments">[];
  model: string;
  modelEffort?: string;
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  abortSignal?: AbortSignal;
}) {
  const messages = params.messages.map(({ role, content, attachments }) => ({
    role,
    content,
    attachments,
  }));
  const systemPrompt = messages.some(
    (message) => (message.attachments?.length ?? 0) > 0,
  )
    ? addImageContentSafetyInstruction(params.systemPrompt)
    : params.systemPrompt;
  const resolved = await requestChatTextResolved({
    ...params,
    messages,
    systemPrompt,
  });
  const text = resolved.value.trim();

  if (!text) {
    throw buildProviderEmptyReplyError(params.provider, params.language);
  }

  return {
    text,
    model: resolved.actualModel,
    ...(resolved.actualModelEffort
      ? { modelEffort: resolved.actualModelEffort }
      : {}),
    usage: estimateChatUsage({
      provider: params.provider,
      model: resolved.actualModel,
      kind: "reply",
      systemPrompt,
      messages,
      completionText: text,
    }),
  };
}

export async function summarizeConversationContext(params: {
  existingSummary?: string;
  messages: Message[];
  model: string;
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  abortSignal?: AbortSignal;
}) {
  const existingSummary = params.existingSummary?.trim() ?? "";

  if (!existingSummary && params.messages.length === 0) {
    return {
      summary: "",
      usage: undefined,
    };
  }

  const promptSections: string[] = [];

  if (existingSummary) {
    promptSections.push(`Existing summary:\n${existingSummary}`);
  }

  if (params.messages.length > 0) {
    promptSections.push(
      `Conversation turns to absorb:\n${formatMessagesForSummary(params.messages)}`,
    );
  }

  const summaryRequestMessages = [
    {
      role: "user" as const,
      content: promptSections.join("\n\n"),
    },
  ];

  const summary = await requestChatText({
    provider: params.provider,
    model: params.model,
    apiKey: params.apiKey,
    language: params.language,
    systemPrompt: CONTEXT_SUMMARIZER_PROMPT,
    messages: summaryRequestMessages,
    abortSignal: params.abortSignal,
  });

  const trimmedSummary = summary.trim();

  return {
    summary: trimmedSummary,
    usage: estimateChatUsage({
      provider: params.provider,
      model: params.model,
      kind: "summary",
      systemPrompt: CONTEXT_SUMMARIZER_PROMPT,
      messages: summaryRequestMessages,
      completionText: trimmedSummary,
    }),
  };
}

function normalizeGeneratedConversationTitle(value: string) {
  const firstNonEmptyLine = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstNonEmptyLine) {
    return "";
  }

  return firstNonEmptyLine
    .replace(/^#{1,6}\s*/, "")
    .replace(/^(?:title|titel)\s*:\s*/i, "")
    .replace(/^[\s"'“”‘’`*_]+|[\s"'“”‘’`*_]+$/g, "")
    .replace(/[.!]+$/, "")
    .trim();
}

function selectConversationTitleMessages(params: {
  messages: Message[];
  contextSummary?: string;
  summarizedMessageCount?: number;
}) {
  const contextPlan = buildConversationContextPlan(params);

  if (!contextPlan.usesSummary) {
    return contextPlan.recentMessages;
  }

  const recentMessages = contextPlan.fallbackRecentMessages;
  const earliestMessages = params.messages.slice(0, 2);
  const selectedById = new Map(
    [...earliestMessages, ...recentMessages].map((message) => [
      message.id,
      message,
    ]),
  );

  return params.messages.filter((message) => selectedById.has(message.id));
}

export async function generateConversationTitle(params: {
  messages: Message[];
  contextSummary?: string;
  summarizedMessageCount?: number;
  model: string;
  modelEffort?: string;
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  abortSignal?: AbortSignal;
}) {
  const summary = getConversationSummaryBody(params.contextSummary);
  const titleMessages = selectConversationTitleMessages(params);

  if (!summary && titleMessages.length === 0) {
    return "";
  }

  const contextSections = [
    summary ? `Existing conversation summary:\n${summary}` : null,
    titleMessages.length > 0
      ? `Conversation excerpts:\n${formatMessagesForSummary(titleMessages)}`
      : null,
  ].filter(Boolean);
  const requestMessages = [
    {
      role: "user" as const,
      content: contextSections.join("\n\n"),
    },
  ];
  const rawTitle = await requestChatText({
    provider: params.provider,
    model: params.model,
    modelEffort: params.modelEffort,
    apiKey: params.apiKey,
    language: params.language,
    systemPrompt: CONVERSATION_TITLE_PROMPT,
    messages: requestMessages,
    abortSignal: params.abortSignal,
  });
  const title = normalizeGeneratedConversationTitle(rawTitle);

  if (!title) {
    throw buildProviderEmptyReplyError(params.provider, params.language);
  }

  return title;
}

export async function validateProviderConnection(params: {
  provider: Provider;
  model: string;
  apiKey: string;
  language: AppLanguage;
  abortSignal?: AbortSignal;
}) {
  await requestChatText({
    messages: [
      {
        role: "user",
        content: "Reply with OK only.",
      },
    ],
    model: params.model,
    provider: params.provider,
    apiKey: params.apiKey,
    language: params.language,
    systemPrompt:
      "You are validating a provider connection for a voice assistant app. Reply with exactly OK.",
    abortSignal: params.abortSignal,
  });
}
