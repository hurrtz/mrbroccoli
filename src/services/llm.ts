import { PROVIDER_LABELS } from "../constants/models";
import { translate } from "../i18n";
import {
  AppLanguage,
  AssistantResponseLength,
  AssistantResponseTone,
  GeminiAssistantContentPart,
  Message,
  MessageMetadata,
  MessageRouterMetadata,
  MistralAssistantContentChunk,
  Provider,
  UsageEstimate,
} from "../types";
import { estimateChatUsage } from "../utils/usageStats";
import { resolveQwenApiEndpoint } from "../utils/qwenRegion";

import {
  buildSystemPrompt,
  CONVERSATION_TITLE_PROMPT,
  CONTEXT_SUMMARIZER_PROMPT,
  formatMessagesForSummary,
} from "./llm/prompts";
import {
  buildConversationContextPlan,
  getConversationSummaryBody,
} from "./conversationContext";
import {
  requestAnthropicChat,
  requestAnthropicChatStream,
} from "./llm/providers/anthropic";
import {
  requestOpenAICompatibleChat,
  requestOpenAICompatibleChatStream,
} from "./llm/providers/openaiCompatible";
import {
  requestGeminiGenerateContentChat,
  requestGeminiGenerateContentChatStream,
} from "./llm/providers/geminiGenerateContent";
import {
  requestOpenAiRealtimeChat,
  requestOpenAiRealtimeChatStream,
} from "./llm/providers/openaiRealtime";
import {
  ChatMessage,
  getProviderLlmConfig,
  ProviderLlmConfig,
} from "./llm/shared";
import {
  addResponseProvenanceToMessages,
  createResponseProvenanceStreamFilter,
  stripLeadingResponseProvenanceMarker,
} from "./llm/messageProvenance";
import { getProviderModelCandidates } from "./providerModelCandidates";
import {
  executeProviderModelRequest,
  type ProviderModelRequestResult,
} from "./providerResilience";

export { buildSystemPrompt } from "./llm/prompts";

const LLM_REPLY_INACTIVITY_TIMEOUT_MS = 5 * 60_000;
const LOCAL_ANDROID_DEV_API_KEY = "sk-test-android-local-dev";

interface StreamChatParams {
  messages: Message[];
  model: string;
  modelEffort?: string;
  provider: Provider;
  apiKey: string;
  assistantInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  language: AppLanguage;
  conversationSummary?: string;
  spokenParagraphStreaming?: boolean;
  synthesisContext?: string;
  webSearchContext?: string;
  onChunk: (text: string) => void;
  onDone: (
    fullText: string,
    usage?: UsageEstimate,
    metadata?: MessageMetadata,
  ) => void | Promise<void>;
  onError: (error: Error) => void | Promise<void>;
  abortSignal?: AbortSignal;
}

interface LlmRequestParams {
  messages: ChatMessage[];
  model: string;
  modelEffort?: string;
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  abortSignal?: AbortSignal;
}

interface StreamingLlmRequestParams extends LlmRequestParams {
  onChunk: (text: string) => void;
  onStreamActivity?: () => void;
  onGeminiAssistantContent?: (content: GeminiAssistantContentPart[]) => void;
  onMistralAssistantContent?: (content: MistralAssistantContentChunk[]) => void;
  onOpenRouterMetadata?: (metadata: MessageRouterMetadata) => void;
}

function buildProviderNotWiredUpError(
  provider: Provider,
  language: AppLanguage,
) {
  return new Error(
    translate(language, "providerNotWiredUpYet", {
      provider: PROVIDER_LABELS[provider],
    }),
  );
}

function buildProviderReplyTimeoutError(
  provider: Provider,
  language: AppLanguage,
) {
  return new Error(
    translate(language, "providerTimeoutError", {
      provider: PROVIDER_LABELS[provider],
      action: translate(language, "replyGenerationAction"),
    }),
  );
}

function buildProviderEmptyReplyError(
  provider: Provider,
  language: AppLanguage,
) {
  return new Error(
    translate(language, "providerEmptyReplyError", {
      provider: PROVIDER_LABELS[provider],
    }),
  );
}

function isLocalAndroidDevReplyEnabled(apiKey: string) {
  return (
    typeof __DEV__ !== "undefined" &&
    __DEV__ &&
    apiKey.trim() === LOCAL_ANDROID_DEV_API_KEY
  );
}

function buildLocalAndroidDevReply(messages: Message[]) {
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");
  const prompt = lastUserMessage?.content.trim();

  return prompt
    ? `local Android development reply: I received "${prompt}". This confirms the text chat pipeline is working without contacting a provider.`
    : "local Android development reply: this confirms the text chat pipeline is working without contacting a provider.";
}

function getLlmProviderConfigOrThrow(
  provider: Provider,
  model: string,
  language: AppLanguage,
): ProviderLlmConfig {
  const config = getProviderLlmConfig(provider, model);

  if (!config) {
    throw buildProviderNotWiredUpError(provider, language);
  }

  return config;
}

const LLM_TEXT_REQUESTERS = {
  "openai-compatible": async (
    params: LlmRequestParams,
    config: Extract<ProviderLlmConfig, { transport: "openai-compatible" }>,
  ) =>
    requestOpenAICompatibleChat({
      endpoint:
        params.provider === "alibaba-qwen-dashscope"
          ? resolveQwenApiEndpoint(config.endpoint, params.apiKey)
          : config.endpoint,
      provider: params.provider,
      model: params.model,
      modelEffort: params.modelEffort,
      messages: params.messages,
      apiKey: params.apiKey,
      language: params.language,
      systemPrompt: params.systemPrompt,
      abortSignal: params.abortSignal,
    }),
  "gemini-generate-content": async (
    params: LlmRequestParams,
    config: Extract<
      ProviderLlmConfig,
      { transport: "gemini-generate-content" }
    >,
  ) =>
    requestGeminiGenerateContentChat({
      endpoint: config.endpoint,
      provider: params.provider,
      model: params.model,
      modelEffort: params.modelEffort,
      messages: params.messages,
      apiKey: params.apiKey,
      language: params.language,
      systemPrompt: params.systemPrompt,
      abortSignal: params.abortSignal,
    }),
  "openai-realtime": async (params: LlmRequestParams) =>
    requestOpenAiRealtimeChat({
      provider: params.provider,
      model: params.model,
      messages: params.messages,
      apiKey: params.apiKey,
      language: params.language,
      systemPrompt: params.systemPrompt,
      abortSignal: params.abortSignal,
    }),
  anthropic: async (params: LlmRequestParams) =>
    requestAnthropicChat({
      model: params.model,
      modelEffort: params.modelEffort,
      messages: params.messages,
      apiKey: params.apiKey,
      language: params.language,
      systemPrompt: params.systemPrompt,
      abortSignal: params.abortSignal,
    }),
} as const;

const LLM_STREAM_REQUESTERS = {
  "openai-compatible": async (
    params: StreamingLlmRequestParams,
    config: Extract<ProviderLlmConfig, { transport: "openai-compatible" }>,
  ) =>
    requestOpenAICompatibleChatStream({
      endpoint:
        params.provider === "alibaba-qwen-dashscope"
          ? resolveQwenApiEndpoint(config.endpoint, params.apiKey)
          : config.endpoint,
      provider: params.provider,
      model: params.model,
      modelEffort: params.modelEffort,
      messages: params.messages,
      apiKey: params.apiKey,
      language: params.language,
      systemPrompt: params.systemPrompt,
      onChunk: params.onChunk,
      onStreamActivity: params.onStreamActivity,
      onMistralAssistantContent: params.onMistralAssistantContent,
      onOpenRouterMetadata: params.onOpenRouterMetadata,
      abortSignal: params.abortSignal,
    }),
  "gemini-generate-content": async (
    params: StreamingLlmRequestParams,
    config: Extract<
      ProviderLlmConfig,
      { transport: "gemini-generate-content" }
    >,
  ) =>
    requestGeminiGenerateContentChatStream({
      endpoint: config.endpoint,
      provider: params.provider,
      model: params.model,
      modelEffort: params.modelEffort,
      messages: params.messages,
      apiKey: params.apiKey,
      language: params.language,
      systemPrompt: params.systemPrompt,
      onChunk: params.onChunk,
      onAssistantContent: params.onGeminiAssistantContent,
      abortSignal: params.abortSignal,
    }),
  "openai-realtime": async (params: StreamingLlmRequestParams) =>
    requestOpenAiRealtimeChatStream({
      provider: params.provider,
      model: params.model,
      messages: params.messages,
      apiKey: params.apiKey,
      language: params.language,
      systemPrompt: params.systemPrompt,
      onChunk: params.onChunk,
      abortSignal: params.abortSignal,
    }),
  anthropic: async (params: StreamingLlmRequestParams) =>
    requestAnthropicChatStream({
      model: params.model,
      modelEffort: params.modelEffort,
      messages: params.messages,
      apiKey: params.apiKey,
      language: params.language,
      systemPrompt: params.systemPrompt,
      onChunk: params.onChunk,
      abortSignal: params.abortSignal,
    }),
} as const;

async function requestChatTextResolved(params: {
  messages: ChatMessage[];
  model: string;
  modelEffort?: string;
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  abortSignal?: AbortSignal;
}): Promise<ProviderModelRequestResult<string>> {
  return executeProviderModelRequest({
    abortSignal: params.abortSignal,
    candidateModels: getProviderModelCandidates({
      capability: "llm",
      provider: params.provider,
      requestedModel: params.model,
    }),
    capability: "llm",
    provider: params.provider,
    request: async (model) => {
      const requestParams = {
        ...params,
        model,
      };
      const config = getLlmProviderConfigOrThrow(
        params.provider,
        model,
        params.language,
      );

      switch (config.transport) {
        case "openai-compatible":
          return LLM_TEXT_REQUESTERS["openai-compatible"](
            requestParams,
            config,
          );
        case "gemini-generate-content":
          return LLM_TEXT_REQUESTERS["gemini-generate-content"](
            requestParams,
            config,
          );
        case "openai-realtime":
          return LLM_TEXT_REQUESTERS["openai-realtime"](requestParams);
        case "anthropic":
          return LLM_TEXT_REQUESTERS.anthropic(requestParams);
        default:
          throw buildProviderNotWiredUpError(
            params.provider,
            params.language,
          );
      }
    },
  });
}

async function requestChatText(
  params: Parameters<typeof requestChatTextResolved>[0],
) {
  return (await requestChatTextResolved(params)).value;
}

export async function generateInternalChat(params: {
  messages: Pick<Message, "role" | "content">[];
  model: string;
  modelEffort?: string;
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  abortSignal?: AbortSignal;
}) {
  const messages = params.messages.map(({ role, content }) => ({
    role,
    content,
  }));
  const resolved = await requestChatTextResolved({
    ...params,
    messages,
  });
  const text = resolved.value.trim();

  if (!text) {
    throw buildProviderEmptyReplyError(params.provider, params.language);
  }

  return {
    text,
    model: resolved.actualModel,
    usage: estimateChatUsage({
      provider: params.provider,
      model: resolved.actualModel,
      kind: "reply",
      systemPrompt: params.systemPrompt,
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

export async function streamChat({
  messages,
  model,
  modelEffort,
  provider,
  apiKey,
  assistantInstructions,
  responseLength,
  responseTone,
  language,
  conversationSummary,
  spokenParagraphStreaming,
  synthesisContext,
  webSearchContext,
  onChunk,
  onDone,
  onError,
  abortSignal,
}: StreamChatParams): Promise<void> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let timedOut = false;
  let releaseAbortSignal: (() => void) | null = null;

  try {
    const requestMessages = addResponseProvenanceToMessages(messages);
    const requestedSystemPrompt = buildSystemPrompt({
      assistantInstructions,
      responseLength,
      responseTone,
      language,
      currentModel: model,
      currentProvider: provider,
      conversationSummary,
      spokenParagraphStreaming,
      synthesisContext,
      webSearchContext,
    });

    if (isLocalAndroidDevReplyEnabled(apiKey)) {
      const fullText = buildLocalAndroidDevReply(messages);

      onChunk(fullText);
      await onDone(
        fullText,
        estimateChatUsage({
          provider,
          model,
          kind: "reply",
          systemPrompt: requestedSystemPrompt,
          messages,
          completionText: fullText,
        }),
      );
      return;
    }

    const timeoutError = buildProviderReplyTimeoutError(provider, language);
    const requestAbortController = new AbortController();
    const provenanceStreamFilter =
      createResponseProvenanceStreamFilter(onChunk);

    if (abortSignal?.aborted) {
      requestAbortController.abort();
    } else if (abortSignal) {
      const handleAbort = () => requestAbortController.abort();
      abortSignal.addEventListener("abort", handleAbort, { once: true });
      releaseAbortSignal = () => {
        abortSignal.removeEventListener("abort", handleAbort);
      };
    }

    let rejectTimeout: ((reason?: unknown) => void) | null = null;
    let receivedStreamData = false;
    const armTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        timedOut = true;
        rejectTimeout?.(timeoutError);
        requestAbortController.abort();
      }, LLM_REPLY_INACTIVITY_TIMEOUT_MS);
    };
    const onStreamActivity = () => {
      if (timedOut) {
        return;
      }

      receivedStreamData = true;
      armTimeout();
    };
    const onChunkWithTimeout = (text: string) => {
      if (timedOut) {
        return;
      }

      onStreamActivity();
      provenanceStreamFilter.push(text);
    };
    const requestPromise = (async () => {
      return executeProviderModelRequest({
        abortSignal: requestAbortController.signal,
        canRetry: () => !receivedStreamData,
        candidateModels: getProviderModelCandidates({
          capability: "llm",
          provider,
          requestedModel: model,
        }),
        capability: "llm",
        provider,
        request: async (actualModel) => {
          let fullText = "";
          let replyMetadata: MessageMetadata | undefined;
          const systemPrompt = buildSystemPrompt({
            assistantInstructions,
            responseLength,
            responseTone,
            language,
            currentModel: actualModel,
            currentProvider: provider,
            conversationSummary,
            spokenParagraphStreaming,
            synthesisContext,
            webSearchContext,
          });
          const config = getLlmProviderConfigOrThrow(
            provider,
            actualModel,
            language,
          );
          const requestParams = {
            messages: requestMessages,
            model: actualModel,
            modelEffort,
            provider,
            apiKey,
            language,
            systemPrompt,
            onChunk: onChunkWithTimeout,
            abortSignal: requestAbortController.signal,
          };

          switch (config.transport) {
            case "openai-compatible":
              fullText = await LLM_STREAM_REQUESTERS["openai-compatible"](
                {
                  ...requestParams,
                  onStreamActivity,
                  onMistralAssistantContent: (content) => {
                    replyMetadata = {
                      ...replyMetadata,
                      providerState: {
                        ...replyMetadata?.providerState,
                        mistralAssistantContent: content,
                      },
                    };
                  },
                  onOpenRouterMetadata: (metadata) => {
                    replyMetadata = {
                      ...replyMetadata,
                      router: metadata,
                    };
                  },
                },
                config,
              );
              break;
            case "gemini-generate-content":
              fullText = await LLM_STREAM_REQUESTERS[
                "gemini-generate-content"
              ](
                {
                  ...requestParams,
                  onGeminiAssistantContent: (content) => {
                    replyMetadata = {
                      ...replyMetadata,
                      providerState: {
                        ...replyMetadata?.providerState,
                        geminiAssistantContent: content,
                      },
                    };
                  },
                },
                config,
              );
              break;
            case "openai-realtime":
              fullText =
                await LLM_STREAM_REQUESTERS["openai-realtime"](requestParams);
              break;
            case "anthropic":
              fullText = await LLM_STREAM_REQUESTERS.anthropic(requestParams);
              break;
            default:
              throw buildProviderNotWiredUpError(provider, language);
          }

          return {
            fullText,
            replyMetadata,
            systemPrompt,
          };
        },
      });
    })().catch((error) => {
      if (timedOut) {
        return null;
      }

      throw error;
    });
    const timeoutPromise = new Promise<never>((_, reject) => {
      rejectTimeout = reject;
    });

    armTimeout();
    const resolvedRequest = await Promise.race([
      requestPromise,
      timeoutPromise,
    ]);

    if (timedOut || !resolvedRequest) {
      return;
    }

    const { actualModel, attempts, requestedModel, value } = resolvedRequest;
    const { fullText, systemPrompt } = value;
    let { replyMetadata } = value;
    if (actualModel !== requestedModel || attempts > 1) {
      replyMetadata = {
        ...replyMetadata,
        modelFailover: {
          actualModel,
          attempts,
          requestedModel,
        },
      };
    }
    const filteredFullText = stripLeadingResponseProvenanceMarker(fullText);
    provenanceStreamFilter.flush();

    if (!filteredFullText.trim()) {
      throw buildProviderEmptyReplyError(provider, language);
    }

    const usage = estimateChatUsage({
      provider,
      model: actualModel,
      kind: "reply",
      systemPrompt,
      messages: requestMessages,
      completionText: filteredFullText,
    });

    if (replyMetadata) {
      await onDone(filteredFullText, usage, replyMetadata);
    } else {
      await onDone(filteredFullText, usage);
    }
  } catch (error) {
    if (abortSignal?.aborted) {
      return;
    }

    await onError(error instanceof Error ? error : new Error(String(error)));
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    releaseAbortSignal?.();
  }
}
