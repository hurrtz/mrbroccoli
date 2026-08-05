import { networkFetch } from "../../networkFetch";
import {
  buildProviderHttpError,
  normalizeProviderTransportError,
} from "../../providerErrors";
import { AppLanguage } from "../../../types";
import {
  getDefaultModelEffort,
  getModelEffortRequestBody,
} from "../../../utils/modelEffort";
import { translate } from "../../../i18n";

import { readEventStream } from "../eventStream";
import { ChatMessage, requireProviderKey, toAPIMessages } from "../shared";

const ANTHROPIC_MAX_OUTPUT_TOKENS = 16_384;
const ANTHROPIC_LONG_OUTPUT_TOKENS = 65_536;
const ANTHROPIC_MAX_CONTINUATIONS = 2;
const ANTHROPIC_CONTINUATION_PROMPT =
  "Continue exactly where the previous response stopped. Do not repeat any prior text or add a preamble. Finish the answer.";

function buildIncompleteReplyError(language: AppLanguage) {
  return new Error(
    translate(language, "providerIncompleteReplyError", {
      provider: "Anthropic",
    }),
  );
}

function getAnthropicMaxOutputTokens(model: string, effort?: string) {
  const resolvedEffort = effort ?? getDefaultModelEffort("anthropic", model);

  if (
    resolvedEffort === "max" ||
    resolvedEffort === "xhigh" ||
    (model === "claude-fable-5" && resolvedEffort === "high")
  ) {
    return ANTHROPIC_LONG_OUTPUT_TOKENS;
  }

  return ANTHROPIC_MAX_OUTPUT_TOKENS;
}

export async function requestAnthropicChat(params: {
  model: string;
  modelEffort?: string;
  messages: ChatMessage[];
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  abortSignal?: AbortSignal;
}) {
  const { model, modelEffort, messages, apiKey, systemPrompt, abortSignal } =
    params;
  let response: Awaited<ReturnType<typeof networkFetch>>;

  try {
    response = await networkFetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": requireProviderKey("anthropic", apiKey, params.language),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: getAnthropicMaxOutputTokens(model, modelEffort),
        ...getModelEffortRequestBody("anthropic", model, modelEffort),
        system: systemPrompt,
        messages: toAPIMessages(messages),
      }),
      signal: abortSignal,
    });
  } catch (error) {
    throw normalizeProviderTransportError({
      provider: "anthropic",
      language: params.language,
      error,
      action: "reply",
    });
  }

  if (!response.ok) {
    const errText = await response.text();
    throw buildProviderHttpError({
      provider: "anthropic",
      language: params.language,
      status: response.status,
      errorText: errText,
      action: "reply",
    });
  }

  const data = await response.json();
  if (data.stop_reason === "max_tokens") {
    throw buildIncompleteReplyError(params.language);
  }

  return (
    data.content?.map((part: { text?: string }) => part.text || "").join("") ||
    ""
  );
}

const ANTHROPIC_STREAM_ERROR_STATUSES: Record<string, number> = {
  invalid_request_error: 400,
  authentication_error: 401,
  billing_error: 402,
  permission_error: 403,
  not_found_error: 404,
  request_too_large: 413,
  rate_limit_error: 429,
  api_error: 500,
  overloaded_error: 529,
};

function anthropicStreamErrorStatus(errorType: unknown) {
  return (
    (typeof errorType === "string" &&
      ANTHROPIC_STREAM_ERROR_STATUSES[errorType]) ||
    400
  );
}

async function requestAnthropicChatStreamOnce(params: {
  model: string;
  modelEffort?: string;
  messages: ChatMessage[];
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  onChunk: (text: string) => void;
  onStreamActivity?: () => void;
  abortSignal?: AbortSignal;
}) {
  const {
    model,
    modelEffort,
    messages,
    apiKey,
    systemPrompt,
    onChunk,
    onStreamActivity,
    abortSignal,
  } = params;
  let response: Awaited<ReturnType<typeof networkFetch>>;

  try {
    response = await networkFetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": requireProviderKey("anthropic", apiKey, params.language),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: getAnthropicMaxOutputTokens(model, modelEffort),
        ...getModelEffortRequestBody("anthropic", model, modelEffort),
        system: systemPrompt,
        stream: true,
        messages: toAPIMessages(messages),
      }),
      signal: abortSignal,
    });
  } catch (error) {
    throw normalizeProviderTransportError({
      provider: "anthropic",
      language: params.language,
      error,
      action: "reply",
    });
  }

  if (!response.ok) {
    const errText = await response.text();
    throw buildProviderHttpError({
      provider: "anthropic",
      language: params.language,
      status: response.status,
      errorText: errText,
      action: "reply",
    });
  }

  if (!response.body) {
    const fullText = await requestAnthropicChat({
      model,
      modelEffort,
      messages,
      apiKey,
      language: params.language,
      systemPrompt,
      abortSignal,
    });

    if (fullText) {
      onChunk(fullText);
    }

    return {
      fullText,
      sawMessageStop: true,
      stopReason: null,
    };
  }

  let fullText = "";
  let sawMessageStop = false;
  let stopReason: string | null = null;

  await readEventStream(response.body, async ({ type, data }) => {
    if (!data) {
      return;
    }

    const payload = JSON.parse(data);

    if (type === "error") {
      // Classify stream errors like their HTTP equivalents so retry and
      // failover treat an overloaded_error the same as a 5xx response
      // instead of a terminal unlocalized failure.
      throw buildProviderHttpError({
        provider: "anthropic",
        language: params.language,
        status: anthropicStreamErrorStatus(payload?.error?.type),
        errorText: JSON.stringify(payload),
        action: "reply",
      });
    }

    onStreamActivity?.();

    if (type === "message_delta") {
      stopReason =
        typeof payload?.delta?.stop_reason === "string"
          ? payload.delta.stop_reason
          : stopReason;
      return;
    }

    if (type === "message_stop") {
      sawMessageStop = true;
      return;
    }

    if (type !== "content_block_delta") {
      return;
    }

    const delta =
      payload?.type === "content_block_delta" &&
      payload?.delta?.type === "text_delta" &&
      typeof payload.delta.text === "string"
        ? payload.delta.text
        : "";

    if (!delta) {
      return;
    }

    fullText += delta;
    onChunk(delta);
  });

  if (!sawMessageStop) {
    throw buildIncompleteReplyError(params.language);
  }

  return {
    fullText,
    sawMessageStop,
    stopReason,
  };
}

export async function requestAnthropicChatStream(params: {
  model: string;
  modelEffort?: string;
  messages: ChatMessage[];
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  onChunk: (text: string) => void;
  onStreamActivity?: () => void;
  abortSignal?: AbortSignal;
}) {
  let fullText = "";
  let requestMessages = params.messages;

  for (
    let attempt = 0;
    attempt <= ANTHROPIC_MAX_CONTINUATIONS;
    attempt += 1
  ) {
    const result = await requestAnthropicChatStreamOnce({
      ...params,
      messages: requestMessages,
    });
    fullText += result.fullText;

    const needsContinuation = result.stopReason === "max_tokens";

    if (!needsContinuation) {
      return fullText;
    }

    if (attempt >= ANTHROPIC_MAX_CONTINUATIONS) {
      throw buildIncompleteReplyError(params.language);
    }

    requestMessages = fullText.trim()
      ? [
          ...params.messages,
          {
            role: "assistant",
            content: fullText,
          },
          {
            role: "user",
            content: ANTHROPIC_CONTINUATION_PROMPT,
          },
        ]
      : params.messages;
  }

  throw buildIncompleteReplyError(params.language);
}
