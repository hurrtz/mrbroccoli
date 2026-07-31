import type {
  MessageMetadata,
  MessageTurnReceipt,
} from "../../types";
import { recordDebugLogEvent } from "../debugLogCapture";
import { searchWeb } from "../webSearch";
import { getWebSearchDecision } from "../webSearchHeuristics";
import type { RunVoicePipelineParams } from "./types";

interface ResolvePipelineWebSearchParams {
  turnId: string;
  abortSignal?: AbortSignal;
  callbacks: RunVoicePipelineParams["callbacks"];
  conversationSummary?: string;
  language: RunVoicePipelineParams["language"];
  messages: RunVoicePipelineParams["messages"];
  mode: NonNullable<RunVoicePipelineParams["webSearchMode"]>;
  provider?: RunVoicePipelineParams["webSearchProvider"];
  apiKey?: string;
  options?: RunVoicePipelineParams["webSearchOptions"];
  transcription: string;
  turnReceipt: MessageTurnReceipt;
}

export async function resolvePipelineWebSearch({
  turnId,
  abortSignal,
  callbacks,
  conversationSummary,
  language,
  messages,
  mode,
  provider,
  apiKey,
  options,
  transcription,
  turnReceipt,
}: ResolvePipelineWebSearchParams): Promise<{
  aborted: boolean;
  context?: string;
  responseMetadata: MessageMetadata;
}> {
  const normalizedApiKey = apiKey?.trim();
  const ready = Boolean(provider && normalizedApiKey);
  const decision = getWebSearchDecision({
    enabled: mode !== "off",
    mode,
    ready,
    language,
    query: transcription,
    messages,
  });
  const responseMetadata: MessageMetadata = {
    turnReceipt,
  };

  turnReceipt.webSearch = {
    mode,
    provider,
    requested: decision.shouldSearch,
    ready,
    used: false,
    fellBack: false,
    decisionReason: decision.reason,
  };

  recordDebugLogEvent({
    event: "web-search-decision",
    payload: {
      mode,
      provider: provider ?? null,
      ready,
      reason: decision.reason,
      shouldSearch: decision.shouldSearch,
      signals: decision.matchedSignals,
      turnId,
    },
  });

  if (!decision.shouldSearch || !provider || !normalizedApiKey) {
    return {
      aborted: false,
      responseMetadata,
    };
  }

  callbacks.onWebSearchStart?.();
  const startedAtMs = Date.now();

  try {
    const result = await searchWeb({
      provider,
      apiKey: normalizedApiKey,
      language,
      query: transcription,
      conversationSummary,
      options,
      abortSignal,
    });

    if (abortSignal?.aborted) {
      return {
        aborted: true,
        responseMetadata,
      };
    }

    if (!result) {
      return {
        aborted: false,
        responseMetadata,
      };
    }

    turnReceipt.webSearch.used = Boolean(result.context);
    turnReceipt.webSearch.provider = result.provider;
    turnReceipt.webSearch.model = result.model;

    return {
      aborted: false,
      context: result.context,
      responseMetadata: {
        ...responseMetadata,
        webSearch: {
          provider: result.provider,
          model: result.model,
          query: transcription,
          summary: result.summary,
          sources: result.sources,
        },
      },
    };
  } catch (error) {
    if (abortSignal?.aborted) {
      return {
        aborted: true,
        responseMetadata,
      };
    }

    if (error instanceof Error) {
      turnReceipt.webSearch.fellBack = true;
      callbacks.onWebSearchFallback?.(error);
    }

    return {
      aborted: false,
      responseMetadata,
    };
  } finally {
    turnReceipt.timing.webSearchMs = Date.now() - startedAtMs;
    callbacks.onWebSearchComplete?.();
  }
}
