import { PROVIDER_LABELS } from "../../constants/models";
import { translate } from "../../i18n";
import type { Message, MessageMetadata } from "../../types";
import { estimateChatUsage } from "../../utils/usageStats";
import { getProviderModelCandidates } from "../providerModelCandidates";
import { executeProviderModelRequest } from "../providerResilience";
import {
  addResponseProvenanceToMessages,
  createResponseProvenanceStreamFilter,
  stripLeadingResponseProvenanceMarker,
} from "./messageProvenance";
import { buildSystemPrompt } from "./prompts";
import {
  buildProviderEmptyReplyError,
  buildProviderNotWiredUpError,
  getLlmProviderConfigOrThrow,
  LLM_STREAM_REQUESTERS,
} from "./requestRouter";
import type { StreamChatParams } from "./types";

const LLM_REPLY_INACTIVITY_TIMEOUT_MS = 5 * 60_000;
const LOCAL_ANDROID_DEV_API_KEY = "sk-test-android-local-dev";

function buildProviderReplyTimeoutError(
  provider: StreamChatParams["provider"],
  language: StreamChatParams["language"],
) {
  return new Error(
    translate(language, "providerTimeoutError", {
      provider: PROVIDER_LABELS[provider],
      action: translate(language, "replyGenerationAction"),
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
  pastConversationKnowledge,
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
      pastConversationKnowledge,
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
        modelEffort,
        provider,
        request: async (actualModel, actualModelEffort) => {
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
            pastConversationKnowledge,
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
            modelEffort: actualModelEffort,
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

    const {
      actualModel,
      actualModelEffort,
      attempts,
      requestedModel,
      requestedModelEffort,
      usedFallback,
      value,
    } = resolvedRequest;
    const { fullText, systemPrompt } = value;
    let { replyMetadata } = value;
    if (usedFallback || attempts > 1) {
      replyMetadata = {
        ...replyMetadata,
        modelFailover: {
          actualModel,
          actualModelEffort,
          attempts,
          requestedModel,
          requestedModelEffort,
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
