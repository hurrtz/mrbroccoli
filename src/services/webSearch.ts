import {
  getWebSearchProviderModel,
  normalizeWebSearchProviderSettings,
  type WebSearchProvider,
  type WebSearchProviderSettings,
} from "../constants/webSearch";
import { PROVIDER_LABELS } from "../constants/models";
import { translate } from "../i18n";
import { getDefaultContentLanguageForLocale } from "../i18n/localeRegistry";
import type { AppLanguage } from "../types";
import { recordDebugLogEvent } from "./debugLogCapture";
import { normalizeProviderTransportError } from "./providerErrors";
import { requestWebSearch } from "./webSearch/request";
import { normalizeWebSearchResult } from "./webSearch/resultNormalizer";
import type {
  RawWebSearchResponse,
  WebSearchRequestParams,
  WebSearchResult,
} from "./webSearch/types";

export type { WebSearchResult } from "./webSearch/types";

function getValidationQuery(language: AppLanguage) {
  return getDefaultContentLanguageForLocale(language) === "de"
    ? "Wie spät ist es aktuell in UTC? Nutze eine verlässliche Webseite und antworte in einem kurzen Satz."
    : "What is the current UTC time? Use a reliable website and reply in one short sentence.";
}

export async function validateWebSearchConnection(params: {
  provider: WebSearchProvider;
  apiKey: string;
  language: AppLanguage;
  options?: WebSearchProviderSettings;
  abortSignal?: AbortSignal;
}) {
  await requestWebSearch({
    provider: params.provider,
    apiKey: params.apiKey,
    language: params.language,
    query: getValidationQuery(params.language),
    options: params.options,
    maxOutputTokens: 120,
    abortSignal: params.abortSignal,
  });
}

export async function searchWeb(
  params: WebSearchRequestParams,
): Promise<WebSearchResult | null> {
  const query = params.query.trim();

  if (!query) {
    return null;
  }

  recordDebugLogEvent({
    event: "web-search-requested",
    payload: {
      model: getWebSearchProviderModel(params.provider),
      options: normalizeWebSearchProviderSettings(
        params.provider,
        params.options,
      ),
      provider: params.provider,
      queryLength: query.length,
    },
  });

  let response: RawWebSearchResponse;

  try {
    response = await requestWebSearch({
      ...params,
      query,
    });
  } catch (error) {
    const normalizedError = normalizeProviderTransportError({
      provider: params.provider,
      language: params.language,
      error,
      action: "web-search",
    });

    recordDebugLogEvent({
      event: "web-search-failed",
      level: "warn",
      payload: { error: normalizedError, provider: params.provider },
    });
    throw normalizedError;
  }

  const result = normalizeWebSearchResult({
    provider: response.provider,
    model: response.model,
    query,
    data: response.data,
    options: params.options,
  });

  if (!result) {
    recordDebugLogEvent({
      event: "web-search-empty",
      level: "warn",
      payload: {
        model: response.model,
        provider: params.provider,
      },
    });
    throw new Error(
      translate(params.language, "providerWebSearchNotRun", {
        provider: PROVIDER_LABELS[params.provider],
      }),
    );
  }

  recordDebugLogEvent({
    event: "web-search-complete",
    payload: {
      model: result.model,
      options: normalizeWebSearchProviderSettings(
        params.provider,
        params.options,
      ),
      provider: result.provider,
      sourceCount: result.sources.length,
      summaryLength: result.summary.length,
    },
  });

  return result;
}
