import {
  getWebSearchProviderModel,
  normalizeWebSearchProviderSettings,
  type WebSearchProvider,
  WEB_SEARCH_PROVIDER_MODEL_CANDIDATES,
  WEB_SEARCH_TIMEOUT_MS_BY_PROVIDER,
} from "../../constants/webSearch";
import { PROVIDER_LABELS } from "../../constants/models";
import { translate } from "../../i18n";
import type { AppLanguage } from "../../types";
import { getModelEffortConfig } from "../../utils/modelEffort";
import { resolveQwenApiEndpoint } from "../../utils/qwenRegion";
import { requireProviderKey } from "../llm/shared";
import { networkFetch } from "../networkFetch";
import {
  buildProviderHttpError,
  ProviderRequestError,
} from "../providerErrors";
import { executeProviderModelRequest } from "../providerResilience";
import {
  hasAnthropicWebSearchResult,
  hasGeminiGoogleSearchResult,
  hasSuccessfulWebSearchCall,
} from "./resultNormalizer";
import type {
  RawWebSearchResponse,
  WebSearchRequestParams,
} from "./types";

const ANTHROPIC_WEB_SEARCH_MIN_OUTPUT_TOKENS = 420;

function buildProviderNotWiredUpError(
  provider: WebSearchProvider,
  language: AppLanguage,
) {
  return new Error(
    translate(language, "providerNotWiredUpYet", {
      provider: PROVIDER_LABELS[provider],
    }),
  );
}

function buildWebSearchPrompt(params: {
  conversationSummary?: string;
  query: string;
}) {
  const summary = params.conversationSummary?.trim();
  const today = new Date().toISOString().slice(0, 10);

  return [
    "You are preparing a compact evidence brief for another assistant.",
    "Use web search to gather up-to-date information relevant to the latest user request.",
    "Write plain text only. No markdown, bullet points, or headings.",
    "Keep the brief concise, factual, and current. Mention uncertainty briefly if sources conflict.",
    "Write the brief in the same language as the latest user request.",
    `Today's date is ${today}.`,
    summary ? `Conversation context for disambiguation: ${summary}` : null,
    `Latest user request: ${params.query.trim()}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function getRequestWebSearchModel(params: WebSearchRequestParams) {
  return params.model?.trim() || getWebSearchProviderModel(params.provider);
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
  onTimeout: () => Error,
  abortSignal?: AbortSignal,
) {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let timedOut = false;
  const handleAbort = () => {
    controller.abort(abortSignal?.reason);
  };
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
      reject(onTimeout());
    }, timeoutMs);
  });

  if (abortSignal?.aborted) {
    throw abortSignal.reason instanceof Error
      ? abortSignal.reason
      : new Error(
          typeof abortSignal.reason === "string"
            ? abortSignal.reason
            : "Aborted",
        );
  }

  abortSignal?.addEventListener("abort", handleAbort, { once: true });

  const fetchPromise = networkFetch(input, {
    ...init,
    signal: controller.signal,
  }).catch((error) => {
    if (
      error instanceof Error &&
      (error.name === "AbortError" ||
        error.message.toLowerCase().includes("aborted"))
    ) {
      if (timedOut) {
        throw onTimeout();
      }

      if (abortSignal?.aborted) {
        throw abortSignal.reason instanceof Error
          ? abortSignal.reason
          : new Error(
              typeof abortSignal.reason === "string"
                ? abortSignal.reason
                : "Aborted",
            );
      }
    }

    throw error;
  });

  try {
    return await Promise.race([fetchPromise, timeoutPromise]);
  } finally {
    abortSignal?.removeEventListener("abort", handleAbort);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function buildWebSearchTimeoutError(
  provider: WebSearchProvider,
  language: AppLanguage,
) {
  return new ProviderRequestError({
    action: "web-search",
    failureKind: "timeout",
    provider,
    message: translate(language, "providerTemporaryError", {
      provider: PROVIDER_LABELS[provider],
      action: translate(language, "webSearchAction"),
    }),
  });
}

async function fetchJsonWebSearch(
  params: WebSearchRequestParams,
  request: {
    url: string;
    model: string;
    headers: Record<string, string>;
    body: unknown;
  },
) {
  const response = await fetchWithTimeout(
    request.url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...request.headers,
      },
      body: JSON.stringify(request.body),
    },
    WEB_SEARCH_TIMEOUT_MS_BY_PROVIDER[params.provider],
    () => buildWebSearchTimeoutError(params.provider, params.language),
    params.abortSignal,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw buildProviderHttpError({
      provider: params.provider,
      language: params.language,
      status: response.status,
      errorText,
      action: "web-search",
    });
  }

  return {
    data: await response.json(),
    model: request.model,
    provider: params.provider,
  } satisfies RawWebSearchResponse;
}

function buildPromptForProvider(params: WebSearchRequestParams) {
  return buildWebSearchPrompt({
    query: params.query,
    conversationSummary: params.conversationSummary,
  });
}

function buildBearerHeaders(params: WebSearchRequestParams) {
  return {
    Authorization: `Bearer ${requireProviderKey(
      params.provider,
      params.apiKey,
      params.language,
    )}`,
  };
}

function buildChatMessages(params: WebSearchRequestParams) {
  return [
    {
      role: "user",
      content: buildPromptForProvider(params),
    },
  ];
}

async function searchWithOpenAi(params: WebSearchRequestParams) {
  const model = getRequestWebSearchModel(params);
  const maxOutputTokens = params.maxOutputTokens ?? 420;
  const normalizedOptions = normalizeWebSearchProviderSettings(
    params.provider,
    params.options,
  );
  const searchContextSize =
    normalizedOptions.searchMode === "quick"
      ? "low"
      : normalizedOptions.searchMode === "deep"
        ? "high"
        : "medium";
  const response = await fetchWithTimeout(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireProviderKey(
          params.provider,
          params.apiKey,
          params.language,
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "user",
            content: buildPromptForProvider(params),
          },
        ],
        tools: [
          {
            type: "web_search",
            search_context_size: searchContextSize,
          },
        ],
        tool_choice: "required",
        include: ["web_search_call.action.sources"],
        max_output_tokens: maxOutputTokens,
      }),
    },
    WEB_SEARCH_TIMEOUT_MS_BY_PROVIDER[params.provider],
    () => buildWebSearchTimeoutError(params.provider, params.language),
    params.abortSignal,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw buildProviderHttpError({
      provider: params.provider,
      language: params.language,
      status: response.status,
      errorText,
      action: "web-search",
    });
  }

  const data = await response.json();

  if (!hasSuccessfulWebSearchCall(data)) {
    throw new Error(
      translate(params.language, "providerWebSearchNotRun", {
        provider: PROVIDER_LABELS[params.provider],
      }),
    );
  }

  return {
    data,
    model,
    provider: params.provider,
  } satisfies RawWebSearchResponse;
}

async function searchWithAnthropic(params: WebSearchRequestParams) {
  const model = getRequestWebSearchModel(params);
  const maxOutputTokens = Math.max(
    params.maxOutputTokens ?? ANTHROPIC_WEB_SEARCH_MIN_OUTPUT_TOKENS,
    ANTHROPIC_WEB_SEARCH_MIN_OUTPUT_TOKENS,
  );
  const lowEffortOption = getModelEffortConfig("anthropic", model)?.options.find(
    (option) => option.id === "low",
  );
  const lowEffort = lowEffortOption?.transportValue ?? lowEffortOption?.id;

  const response = await fetchJsonWebSearch(params, {
    url: "https://api.anthropic.com/v1/messages",
    model,
    headers: {
      "anthropic-version": "2023-06-01",
      "x-api-key": requireProviderKey(
        params.provider,
        params.apiKey,
        params.language,
      ),
    },
    body: {
      model,
      max_tokens: maxOutputTokens,
      ...(lowEffort
        ? {
            output_config: {
              effort: lowEffort,
            },
          }
        : {}),
      messages: buildChatMessages(params),
      tools: [
        {
          type: "web_search_20260318",
          name: "web_search",
          allowed_callers: ["direct"],
          max_uses: 5,
        },
      ],
      tool_choice: {
        type: "tool",
        name: "web_search",
      },
    },
  });

  if (!hasAnthropicWebSearchResult(response.data)) {
    throw new Error(
      translate(params.language, "providerWebSearchNotRun", {
        provider: PROVIDER_LABELS[params.provider],
      }),
    );
  }

  return response;
}

async function searchWithQwen(params: WebSearchRequestParams) {
  const model = getRequestWebSearchModel(params);
  const maxOutputTokens = params.maxOutputTokens ?? 420;

  const response = await fetchJsonWebSearch(params, {
    url: resolveQwenApiEndpoint(
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/responses",
      params.apiKey,
    ),
    model,
    headers: buildBearerHeaders(params),
    body: {
      model,
      input: buildPromptForProvider(params),
      tools: [{ type: "web_search" }],
      tool_choice: "required",
      enable_thinking: false,
      max_output_tokens: maxOutputTokens,
    },
  });

  if (!hasSuccessfulWebSearchCall(response.data)) {
    throw new Error(
      translate(params.language, "providerWebSearchNotRun", {
        provider: PROVIDER_LABELS[params.provider],
      }),
    );
  }

  return response;
}

async function searchWithGemini(params: WebSearchRequestParams) {
  const model = getRequestWebSearchModel(params);

  const response = await fetchJsonWebSearch(params, {
    url: "https://generativelanguage.googleapis.com/v1beta/interactions",
    model,
    headers: {
      "x-goog-api-key": requireProviderKey(
        params.provider,
        params.apiKey,
        params.language,
      ),
    },
    body: {
      model,
      input: buildPromptForProvider(params),
      tools: [{ type: "google_search" }],
    },
  });

  if (!hasGeminiGoogleSearchResult(response.data)) {
    throw new Error(
      translate(params.language, "providerWebSearchNotRun", {
        provider: PROVIDER_LABELS[params.provider],
      }),
    );
  }

  return response;
}

function getXaiMaxTurns(params: WebSearchRequestParams) {
  const normalizedOptions = normalizeWebSearchProviderSettings(
    params.provider,
    params.options,
  );

  if (normalizedOptions.searchMode === "quick") {
    return 2;
  }

  if (normalizedOptions.searchMode === "deep") {
    return 8;
  }

  return 4;
}

async function searchWithXai(params: WebSearchRequestParams) {
  const model = getRequestWebSearchModel(params);
  const maxOutputTokens = params.maxOutputTokens ?? 420;

  const response = await fetchJsonWebSearch(params, {
    url: "https://api.x.ai/v1/responses",
    model,
    headers: buildBearerHeaders(params),
    body: {
      model,
      input: [
        {
          role: "user",
          content: buildPromptForProvider(params),
        },
      ],
      tools: [{ type: "web_search" }],
      tool_choice: "required",
      max_output_tokens: maxOutputTokens,
      max_turns: getXaiMaxTurns(params),
    },
  });

  if (!hasSuccessfulWebSearchCall(response.data)) {
    throw new Error(
      translate(params.language, "providerWebSearchNotRun", {
        provider: PROVIDER_LABELS[params.provider],
      }),
    );
  }

  return response;
}

async function searchWithMistral(params: WebSearchRequestParams) {
  const model = getRequestWebSearchModel(params);

  return fetchJsonWebSearch(params, {
    url: "https://api.mistral.ai/v1/conversations",
    model,
    headers: buildBearerHeaders(params),
    body: {
      model,
      inputs: buildChatMessages(params),
      tools: [{ type: "web_search" }],
      store: false,
    },
  });
}

async function requestWebSearchOnce(params: WebSearchRequestParams) {
  switch (params.provider) {
    case "openai":
      return searchWithOpenAi(params);
    case "anthropic":
      return searchWithAnthropic(params);
    case "alibaba-qwen-dashscope":
      return searchWithQwen(params);
    case "gemini":
      return searchWithGemini(params);
    case "xai":
      return searchWithXai(params);
    case "mistral":
      return searchWithMistral(params);
    default:
      throw buildProviderNotWiredUpError(params.provider, params.language);
  }
}

export async function requestWebSearch(params: WebSearchRequestParams) {
  const result = await executeProviderModelRequest({
    abortSignal: params.abortSignal,
    candidateModels: WEB_SEARCH_PROVIDER_MODEL_CANDIDATES[params.provider],
    capability: "web-search",
    provider: params.provider,
    request: (model) =>
      requestWebSearchOnce({
        ...params,
        model,
      }),
  });

  return result.value;
}
