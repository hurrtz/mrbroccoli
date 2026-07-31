import {
  PROVIDER_LLM_SUPPORT,
  PROVIDER_ORDER,
  PROVIDER_STT_SUPPORT,
  PROVIDER_TTS_SUPPORT,
} from "../constants/models";
import { Settings } from "../types";
import { hasProviderCredentialForCapability } from "./providerCredentials";

export function getEnabledProviders(settings: Settings) {
  return PROVIDER_ORDER.filter(
    (provider) =>
      PROVIDER_LLM_SUPPORT[provider] === "provider" &&
      hasProviderCredentialForCapability(
        provider,
        settings.apiKeys[provider],
        "llm",
      ),
  );
}

export function getEnabledSttProviders(settings: Settings) {
  return PROVIDER_ORDER.filter(
    (provider) =>
      PROVIDER_STT_SUPPORT[provider] === "provider" &&
      hasProviderCredentialForCapability(
        provider,
        settings.apiKeys[provider],
        "stt",
      ),
  );
}

export function getEnabledTtsProviders(settings: Settings) {
  return PROVIDER_ORDER.filter(
    (provider) =>
      PROVIDER_TTS_SUPPORT[provider] === "provider" &&
      hasProviderCredentialForCapability(
        provider,
        settings.apiKeys[provider],
        "tts",
      ),
  );
}
