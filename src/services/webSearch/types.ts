import type {
  WebSearchProvider,
  WebSearchProviderSettings,
} from "../../constants/webSearch";
import type { AppLanguage, WebSearchSource } from "../../types";

export interface WebSearchResult {
  context: string;
  model: string;
  provider: WebSearchProvider;
  sources: WebSearchSource[];
  summary: string;
}

export interface WebSearchRequestParams {
  provider: WebSearchProvider;
  apiKey: string;
  language: AppLanguage;
  query: string;
  conversationSummary?: string;
  options?: WebSearchProviderSettings;
  maxOutputTokens?: number;
  model?: string;
  abortSignal?: AbortSignal;
}

export interface RawWebSearchResponse {
  data: unknown;
  model: string;
  provider: WebSearchProvider;
}
