import type { Provider, ProviderCapability } from "../types";
import { parseGoogleAiStudioCredentials } from "../services/google";
import {
  parseQwenApiCredential,
  qwenRegionSupportsAppSpeech,
} from "./qwenRegion";

export type ProviderCredentialCapability = Exclude<
  ProviderCapability,
  "voices"
>;

export function hasAnyProviderCredential(provider: Provider, apiKey: string) {
  const trimmedApiKey = apiKey.trim();

  if (!trimmedApiKey) {
    return false;
  }

  if (provider === "gemini") {
    return parseGoogleAiStudioCredentials(trimmedApiKey) !== null;
  }

  if (provider === "alibaba-qwen-dashscope") {
    return Boolean(parseQwenApiCredential(trimmedApiKey).apiKey);
  }

  return true;
}

export function hasProviderCredentialForCapability(
  provider: Provider,
  apiKey: string,
  capability: ProviderCredentialCapability,
) {
  const trimmedApiKey = apiKey.trim();

  if (!trimmedApiKey) {
    return false;
  }

  if (provider === "gemini") {
    return parseGoogleAiStudioCredentials(trimmedApiKey) !== null;
  }

  if (provider === "alibaba-qwen-dashscope") {
    const credentials = parseQwenApiCredential(trimmedApiKey);

    if (!credentials.apiKey) {
      return false;
    }

    return (
      capability === "llm" ||
      capability === "search" ||
      qwenRegionSupportsAppSpeech(credentials.region)
    );
  }

  return true;
}
