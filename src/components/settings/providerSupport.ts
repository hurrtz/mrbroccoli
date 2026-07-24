import {
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LLM_SUPPORT,
  PROVIDER_ORDER,
  PROVIDER_STT_SUPPORT,
  PROVIDER_TTS_SUPPORT,
} from "../../constants/models";
import {
  WEB_SEARCH_PROVIDER_IDS,
  getWebSearchProviderModel,
  type WebSearchProvider,
} from "../../constants/webSearch";
import type { Provider, Settings } from "../../types";
import {
  hasAnyProviderCredential,
  hasProviderCredentialForCapability,
} from "../../utils/providerCredentials";
import { getProviderValidationModel } from "../../utils/responseModes";

import type { ProviderHealthState, ProviderValidationState } from "./types";

export type ProviderCapability = "llm" | "tts" | "stt" | "search";

export const PROVIDER_CAPABILITY_ORDER: ProviderCapability[] = [
  "llm",
  "tts",
  "stt",
  "search",
];

function hasApiKey(settings: Settings, provider: Provider) {
  return hasAnyProviderCredential(provider, settings.apiKeys[provider]);
}

export function isWebSearchCapableProvider(
  provider: Provider,
): provider is WebSearchProvider {
  return WEB_SEARCH_PROVIDER_IDS.includes(provider as WebSearchProvider);
}

export function providerSupportsCapability(
  provider: Provider,
  capability: ProviderCapability,
) {
  switch (capability) {
    case "llm":
      return PROVIDER_LLM_SUPPORT[provider] === "provider";
    case "tts":
      return PROVIDER_TTS_SUPPORT[provider] === "provider";
    case "stt":
      return PROVIDER_STT_SUPPORT[provider] === "provider";
    case "search":
      return isWebSearchCapableProvider(provider);
  }
}

export function getProviderCapabilities(provider: Provider) {
  return PROVIDER_CAPABILITY_ORDER.filter((capability) =>
    providerSupportsCapability(provider, capability),
  );
}

export function getProviderValidationTarget(settings: Settings, provider: Provider) {
  const apiKey = settings.apiKeys[provider];

  if (
    providerSupportsCapability(provider, "llm") &&
    hasProviderCredentialForCapability(provider, apiKey, "llm")
  ) {
    return {
      kind: "llm" as const,
      model: getProviderValidationModel(settings, provider),
      configKey: undefined,
    };
  }

  if (
    providerSupportsCapability(provider, "search") &&
    hasProviderCredentialForCapability(provider, apiKey, "search")
  ) {
    const webSearchProvider = provider as WebSearchProvider;

    return {
      kind: "search" as const,
      model: getWebSearchProviderModel(webSearchProvider),
      configKey: JSON.stringify(
        settings.webSearchProviderSettings[webSearchProvider],
      ),
    };
  }

  if (
    providerSupportsCapability(provider, "tts") &&
    hasProviderCredentialForCapability(provider, apiKey, "tts")
  ) {
    const model =
      settings.providerTtsModels[provider] ||
      PROVIDER_DEFAULT_TTS_MODELS[provider] ||
      "";
    const voice =
      settings.providerTtsVoices[provider] ||
      PROVIDER_DEFAULT_TTS_VOICES[provider] ||
      "";

    return {
      kind: "tts" as const,
      model,
      configKey: JSON.stringify({ voice }),
    };
  }

  return {
    kind: null,
    model: "",
    configKey: undefined,
  };
}

export function getProviderHealthState(params: {
  provider: Provider;
  settings: Settings;
  validationStateByProvider: Partial<Record<Provider, ProviderValidationState>>;
}): ProviderHealthState {
  const { provider, settings, validationStateByProvider } = params;

  if (!hasApiKey(settings, provider)) {
    return "unconfigured";
  }

  const validationState = validationStateByProvider[provider];

  if (!validationState) {
    return "configured";
  }

  const target = getProviderValidationTarget(settings, provider);

  if (!target.kind) {
    return "configured";
  }

  const stateMatchesCurrentConfig =
    (!validationState.apiKey ||
      validationState.apiKey === settings.apiKeys[provider].trim()) &&
    validationState.model === target.model &&
    validationState.configKey === target.configKey;

  if (!stateMatchesCurrentConfig) {
    return "configured";
  }

  if (validationState.status === "error") {
    return "failing";
  }

  if (validationState.status === "validating") {
    return "validating";
  }

  if (validationState.status === "success") {
    return "healthy";
  }

  return "configured";
}

export function isProviderSelectableForConfiguredFlow(
  healthState: ProviderHealthState,
) {
  return healthState !== "unconfigured" && healthState !== "failing";
}

export function getConfiguredProvidersForCapability(params: {
  capability: ProviderCapability;
  settings: Settings;
  validationStateByProvider: Partial<Record<Provider, ProviderValidationState>>;
}) {
  const { capability, settings, validationStateByProvider } = params;

  return PROVIDER_ORDER.filter((provider) => {
    if (!providerSupportsCapability(provider, capability)) {
      return false;
    }

    if (
      !hasProviderCredentialForCapability(
        provider,
        settings.apiKeys[provider],
        capability,
      )
    ) {
      return false;
    }

    const healthState = getProviderHealthState({
      provider,
      settings,
      validationStateByProvider,
    });

    if (healthState !== "failing") {
      return isProviderSelectableForConfiguredFlow(healthState);
    }

    // A provider-level connection check targets one concrete capability. A
    // failed LLM model must not disable independently usable STT/TTS routes
    // that share the same credential, and vice versa.
    return getProviderValidationTarget(settings, provider).kind !== capability;
  });
}
