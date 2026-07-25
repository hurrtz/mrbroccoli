import type { Provider, ProviderCapability } from "../types";
import {
  parseBytedanceArkCredentials,
  parseBytedanceSpeechCredentials,
} from "../services/bytedance";
import {
  parseGoogleAiStudioCredentials,
  parseGoogleCloudSpeechCredentials,
} from "../services/google";
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
    return (
      parseGoogleAiStudioCredentials(trimmedApiKey) !== null ||
      parseGoogleCloudSpeechCredentials(trimmedApiKey) !== null
    );
  }

  if (provider === "alibaba-qwen-dashscope") {
    return Boolean(parseQwenApiCredential(trimmedApiKey).apiKey);
  }

  if (provider !== "bytedance-doubao-seed") {
    return true;
  }

  return (
    parseBytedanceArkCredentials(trimmedApiKey) !== null ||
    parseBytedanceSpeechCredentials(trimmedApiKey) !== null
  );
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
    switch (capability) {
      case "llm":
      case "tts":
      case "search":
        return parseGoogleAiStudioCredentials(trimmedApiKey) !== null;
      case "stt":
        return (
          parseGoogleAiStudioCredentials(trimmedApiKey) !== null ||
          parseGoogleCloudSpeechCredentials(trimmedApiKey) !== null
        );
    }
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

  if (provider !== "bytedance-doubao-seed") {
    return true;
  }

  switch (capability) {
    case "llm":
    case "search":
      return parseBytedanceArkCredentials(trimmedApiKey) !== null;
    case "stt":
      return parseBytedanceSpeechCredentials(trimmedApiKey) !== null;
    case "tts":
      return false;
  }
}
