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
import { providerHasVoiceDirectory } from "../../services/providerVoiceDirectory";
import type { Provider, ProviderCapability, Settings } from "../../types";
import {
  hasAnyProviderCredential,
  hasProviderCredentialForCapability,
} from "../../utils/providerCredentials";
import { getProviderValidationModel } from "../../utils/responseModes";

import type {
  ProviderHealthState,
  ProviderValidationState,
  ProviderValidationStates,
} from "./types";

export type { ProviderCapability } from "../../types";

export const PROVIDER_CAPABILITY_ORDER: ProviderCapability[] = [
  "llm",
  "stt",
  "tts",
  "search",
  "voices",
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
    case "voices":
      return providerHasVoiceDirectory(provider);
  }
}

export function getProviderCapabilities(provider: Provider) {
  return PROVIDER_CAPABILITY_ORDER.filter((capability) =>
    providerSupportsCapability(provider, capability),
  );
}

function hasCapabilityCredential(
  settings: Settings,
  provider: Provider,
  capability: ProviderCapability,
) {
  const apiKey = settings.apiKeys[provider];

  return capability === "voices"
    ? hasAnyProviderCredential(provider, apiKey)
    : hasProviderCredentialForCapability(provider, apiKey, capability);
}

export function getProviderValidationTarget(
  settings: Settings,
  provider: Provider,
  capability: ProviderCapability,
) {
  if (
    !providerSupportsCapability(provider, capability) ||
    !hasCapabilityCredential(settings, provider, capability)
  ) {
    return {
      kind: null,
      model: "",
      configKey: undefined,
    };
  }

  switch (capability) {
    case "llm":
      return {
        kind: "llm" as const,
        model: getProviderValidationModel(settings, provider),
        configKey: undefined,
      };
    case "stt":
      return {
        kind: "stt" as const,
        model: settings.providerSttModels[provider] ?? "",
        configKey: undefined,
      };
    case "search": {
      const webSearchProvider = provider as WebSearchProvider;

      return {
        kind: "search" as const,
        model: getWebSearchProviderModel(webSearchProvider),
        configKey: JSON.stringify(
          settings.webSearchProviderSettings[webSearchProvider],
        ),
      };
    }
    case "tts": {
      const model =
        (provider === "gemini"
          ? PROVIDER_DEFAULT_TTS_MODELS[provider]
          : settings.providerTtsModels[provider]) ||
        PROVIDER_DEFAULT_TTS_MODELS[provider] ||
        "";
      const voice =
        (provider === "gemini"
          ? PROVIDER_DEFAULT_TTS_VOICES[provider]
          : settings.providerTtsVoices[provider]) ||
        PROVIDER_DEFAULT_TTS_VOICES[provider] ||
        "";

      return {
        kind: "tts" as const,
        model,
        configKey: JSON.stringify({ voice }),
      };
    }
    case "voices":
      return {
        kind: "voices" as const,
        model: "",
        configKey: undefined,
      };
  }
}

function validationMatchesTarget(params: {
  capability: ProviderCapability;
  state: ProviderValidationState;
  target: ReturnType<typeof getProviderValidationTarget>;
  apiKey: string;
}) {
  const modelMatches =
    params.state.model === params.target.model ||
    (params.capability === "llm" && params.state.status === "success");

  return (
    (!params.state.apiKey || params.state.apiKey === params.apiKey.trim()) &&
    modelMatches &&
    params.state.configKey === params.target.configKey
  );
}

export function getProviderCapabilityHealthState(params: {
  capability: ProviderCapability;
  provider: Provider;
  settings: Settings;
  validationStateByProvider: ProviderValidationStates;
}): ProviderHealthState {
  const { capability, provider, settings, validationStateByProvider } = params;

  if (
    !providerSupportsCapability(provider, capability) ||
    !hasCapabilityCredential(settings, provider, capability)
  ) {
    return "unconfigured";
  }

  const validationState = validationStateByProvider[provider]?.[capability];

  if (!validationState) {
    return "configured";
  }

  const target = getProviderValidationTarget(settings, provider, capability);

  if (!target.kind) {
    return "configured";
  }

  if (
    !validationMatchesTarget({
      capability,
      state: validationState,
      target,
      apiKey: settings.apiKeys[provider],
    })
  ) {
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

export function getProviderHealthState(params: {
  provider: Provider;
  settings: Settings;
  validationStateByProvider: ProviderValidationStates;
}): ProviderHealthState {
  const { provider, settings, validationStateByProvider } = params;

  if (!hasApiKey(settings, provider)) {
    return "unconfigured";
  }

  const operationalCapabilities = getProviderCapabilities(provider).filter(
    (capability) => capability !== "voices",
  );
  const states = operationalCapabilities.map((capability) =>
    getProviderCapabilityHealthState({
      capability,
      provider,
      settings,
      validationStateByProvider,
    }),
  );

  if (states.includes("validating")) {
    return "validating";
  }

  if (states.length > 0 && states.every((state) => state === "healthy")) {
    return "healthy";
  }

  if (states.includes("failing") && !states.includes("healthy")) {
    return "failing";
  }

  return "configured";
}

function isProviderSelectableForConfiguredFlow(
  healthState: ProviderHealthState,
) {
  return healthState !== "unconfigured" && healthState !== "failing";
}

export function getConfiguredProvidersForCapability(params: {
  capability: Exclude<ProviderCapability, "voices">;
  settings: Settings;
  validationStateByProvider: ProviderValidationStates;
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

    const healthState = getProviderCapabilityHealthState({
      capability,
      provider,
      settings,
      validationStateByProvider,
    });

    if (healthState !== "failing") {
      return isProviderSelectableForConfiguredFlow(healthState);
    }

    return false;
  });
}
