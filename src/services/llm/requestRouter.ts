import { PROVIDER_LABELS } from "../../constants/models";
import { translate } from "../../i18n";
import type {
  AppLanguage,
  GeminiAssistantContentPart,
  MessageRouterMetadata,
  MistralAssistantContentChunk,
  Provider,
} from "../../types";
import { resolveQwenApiEndpoint } from "../../utils/qwenRegion";
import { modelSupportsImageInput } from "../../utils/imageInputCapabilities";
import { prepareMessageImagesForRequest } from "../imageAttachmentFiles";
import { getProviderModelCandidates } from "../providerModelCandidates";
import {
  executeProviderModelRequest,
  type ProviderModelRequestResult,
} from "../providerResilience";
import { requestAnthropicChat, requestAnthropicChatStream } from "./providers/anthropic";
import {
  requestGeminiGenerateContentChat,
  requestGeminiGenerateContentChatStream,
} from "./providers/geminiGenerateContent";
import {
  requestOpenAICompatibleChat,
  requestOpenAICompatibleChatStream,
} from "./providers/openaiCompatible";
import {
  requestOpenAiRealtimeChat,
  requestOpenAiRealtimeChatStream,
} from "./providers/openaiRealtime";
import {
  type ChatMessage,
  getProviderLlmConfig,
  type ProviderLlmConfig,
} from "./shared";

export interface LlmRequestParams {
  messages: ChatMessage[];
  model: string;
  modelEffort?: string;
  provider: Provider;
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  abortSignal?: AbortSignal;
}

export interface StreamingLlmRequestParams extends LlmRequestParams {
  onChunk: (text: string) => void;
  onStreamActivity?: () => void;
  onGeminiAssistantContent?: (content: GeminiAssistantContentPart[]) => void;
  onMistralAssistantContent?: (content: MistralAssistantContentChunk[]) => void;
  onOpenRouterMetadata?: (metadata: MessageRouterMetadata) => void;
}

export function buildProviderNotWiredUpError(
  provider: Provider,
  language: AppLanguage,
) {
  return new Error(
    translate(language, "providerNotWiredUpYet", {
      provider: PROVIDER_LABELS[provider],
    }),
  );
}

export function buildProviderEmptyReplyError(
  provider: Provider,
  language: AppLanguage,
) {
  return new Error(
    translate(language, "providerEmptyReplyError", {
      provider: PROVIDER_LABELS[provider],
    }),
  );
}

export function getLlmProviderConfigOrThrow(
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

export const LLM_STREAM_REQUESTERS = {
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
      onStreamActivity: params.onStreamActivity,
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
      onStreamActivity: params.onStreamActivity,
      abortSignal: params.abortSignal,
    }),
} as const;

export async function requestChatTextResolved(
  params: LlmRequestParams,
): Promise<ProviderModelRequestResult<string>> {
  const hasImages = params.messages.some(
    (message) => (message.attachments?.length ?? 0) > 0,
  );
  if (hasImages && !modelSupportsImageInput(params.provider, params.model)) {
    throw new Error(
      translate(params.language, "imageInputUnsupported", {
        provider: PROVIDER_LABELS[params.provider],
        model: params.model,
      }),
    );
  }
  const messages = hasImages
    ? await prepareMessageImagesForRequest(params.messages)
    : params.messages;

  return executeProviderModelRequest({
    abortSignal: params.abortSignal,
    candidateModels: getProviderModelCandidates({
      capability: "llm",
      provider: params.provider,
      requestedModel: params.model,
      isCompatible: hasImages
        ? (candidate) => modelSupportsImageInput(params.provider, candidate)
        : undefined,
    }),
    capability: "llm",
    modelEffort: params.modelEffort,
    provider: params.provider,
    request: async (model, modelEffort) => {
      const requestParams = {
        ...params,
        messages,
        model,
        modelEffort,
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

export async function requestChatText(params: LlmRequestParams) {
  return (await requestChatTextResolved(params)).value;
}
