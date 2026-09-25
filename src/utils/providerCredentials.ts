import type { Provider, ProviderCapability } from "../types";
import { parseGoogleAiStudioCredentials } from "../services/google";
import { parseQwenApiCredential } from "./qwenRegion";

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
  // Every current credential unlocks all of its provider's capabilities; the
  // parameter keeps callers explicit for capability-specific key rules.
  _capability: ProviderCredentialCapability,
) {
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
