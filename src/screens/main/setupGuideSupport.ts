import {
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LABELS,
  PROVIDER_LLM_SUPPORT,
  PROVIDER_ORDER,
  PROVIDER_STT_SUPPORT,
  PROVIDER_TTS_SUPPORT,
} from "../../constants/models";
import {
  WEB_SEARCH_PROVIDER_IDS,
  type WebSearchProvider,
} from "../../constants/webSearch";
import type {
  Provider,
  ResponseModeSelections,
  Settings,
} from "../../types";
import {
  deriveResponseModesForProvider,
  getDefaultModelForProvider,
} from "../../utils/responseModes";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";

export type SetupGuideStep =
  | "intro"
  | "provider"
  | "kokoro"
  | "voice-test"
  | "summary";

export type SetupGuideValidationState = {
  status: "idle" | "validating" | "success" | "error";
  provider?: Provider;
  apiKey?: string;
  model?: string;
  message?: string;
};

export interface SetupGuideProviderOption {
  label: string;
  value: Provider;
}

export interface SetupGuideResolvedRoutes {
  llm: {
    enabled: boolean;
    model: string;
    provider: Provider;
  };
  stt:
    | {
        enabled: true;
        kind: "system";
      }
    | {
        enabled: true;
        kind: "provider";
        provider: Provider;
        model: string;
      }
    | {
        enabled: false;
        kind: "disabled";
      };
  tts:
    | {
        enabled: true;
        kind: "kokoro";
        voice: string;
      }
    | {
        enabled: true;
        kind: "provider";
        provider: Provider;
        model: string;
        voice: string;
      }
    | {
        enabled: false;
        kind: "disabled";
      };
  webSearch: {
    available: boolean;
    provider: WebSearchProvider | null;
  };
}

function providerSupportsCapability(
  provider: Provider,
  capability: "llm" | "stt" | "tts" | "search",
) {
  switch (capability) {
    case "llm":
      return PROVIDER_LLM_SUPPORT[provider] === "provider";
    case "stt":
      return PROVIDER_STT_SUPPORT[provider] === "provider";
    case "tts":
      return PROVIDER_TTS_SUPPORT[provider] === "provider";
    case "search":
      return WEB_SEARCH_PROVIDER_IDS.includes(provider as never);
  }
}

export function getSetupGuideProviderOptions(): SetupGuideProviderOption[] {
  return PROVIDER_ORDER.filter((provider) =>
    providerSupportsCapability(provider, "llm"),
  ).map((provider) => ({
    label: PROVIDER_LABELS[provider],
    value: provider,
  }));
}

export function getSetupGuideInitialProvider(settings: Settings): Provider {
  const providerOptions = getSetupGuideProviderOptions();
  const optionValues = providerOptions.map((option) => option.value);

  if (optionValues.includes(settings.lastProvider)) {
    return settings.lastProvider;
  }

  return providerOptions[0]?.value ?? settings.lastProvider;
}

export function getSetupGuideValidationModel(provider: Provider) {
  // The first key update auto-derives response modes. Some providers put a
  // realtime model first in their picker, which is a poor connection-test
  // target and made fresh Gemini setups validate over Gemini Live. Keep the
  // wizard on the provider's stable default REST model; Settings can still
  // validate a user's explicitly selected route.
  return getDefaultModelForProvider(provider);
}

export function getCurrentSetupGuideValidationState(params: {
  provider: Provider;
  apiKey: string;
  model: string;
  validationState: SetupGuideValidationState;
}): SetupGuideValidationState {
  const { provider, apiKey, model, validationState } = params;

  if (
    validationState.provider !== provider ||
    validationState.apiKey !== apiKey.trim() ||
    validationState.model !== model
  ) {
    return { status: "idle" };
  }

  return validationState;
}

export function resolveSetupGuideRoutes(params: {
  provider: Provider;
  settings: Settings;
  systemSttAvailable: boolean;
  useKokoro?: boolean;
}): SetupGuideResolvedRoutes {
  const { provider, settings, systemSttAvailable, useKokoro = false } = params;
  const apiKey = settings.apiKeys[provider].trim();
  const llmModel = getSetupGuideValidationModel(provider);
  const providerSttModel = settings.providerSttModels[provider]?.trim() || "";
  const providerTtsModel =
    settings.providerTtsModels[provider]?.trim() ||
    PROVIDER_DEFAULT_TTS_MODELS[provider] ||
    "";
  const providerTtsVoice =
    settings.providerTtsVoices[provider]?.trim() ||
    PROVIDER_DEFAULT_TTS_VOICES[provider] ||
    "";

  const llmEnabled =
    providerSupportsCapability(provider, "llm") &&
    hasProviderCredentialForCapability(provider, apiKey, "llm");
  const providerSttEnabled =
    providerSupportsCapability(provider, "stt") &&
    hasProviderCredentialForCapability(provider, apiKey, "stt");
  const providerTtsEnabled =
    providerSupportsCapability(provider, "tts") &&
    hasProviderCredentialForCapability(provider, apiKey, "tts");
  const searchEnabled =
    providerSupportsCapability(provider, "search") &&
    hasProviderCredentialForCapability(provider, apiKey, "search");

  return {
    llm: {
      enabled: llmEnabled,
      provider,
      model: llmModel,
    },
    stt: providerSttEnabled
      ? {
          enabled: true,
          kind: "provider",
          provider,
          model: providerSttModel,
        }
      : systemSttAvailable
        ? {
            enabled: true,
            kind: "system",
          }
        : {
            enabled: false,
            kind: "disabled",
          },
    tts: useKokoro
      ? {
          enabled: true,
          kind: "kokoro",
          voice: settings.kokoroVoices.en,
        }
      : providerTtsEnabled
      ? {
          enabled: true,
          kind: "provider",
          provider,
          model: providerTtsModel,
          voice: providerTtsVoice,
        }
      : {
          enabled: false,
          kind: "disabled",
        },
    webSearch: {
      available: searchEnabled,
      provider: searchEnabled ? (provider as WebSearchProvider) : null,
    },
  };
}

export function buildSetupGuideResponseModes(
  provider: Provider,
): ResponseModeSelections {
  return deriveResponseModesForProvider(provider);
}
