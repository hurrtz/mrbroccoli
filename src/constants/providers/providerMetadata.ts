import {
  APP_PROVIDER_CATALOG_IDS,
  getCatalogModelForAppProvider,
  getCatalogProviderForAppProvider,
  getCatalogVerifiedServiceStateForAppProvider,
} from "../../catalog/appProviders";
import type { Provider } from "../../types";
import type { ModelInfo } from "./types";
import { PROVIDER_CONFIGS, PROVIDER_ORDER } from "./catalogData";
import { RETIRED_PROVIDER_LABELS } from "./retiredProviders";
import { isRuntimeProviderId } from "./runtimeState";

export const PROVIDER_LABELS: Record<Provider, string> = Object.fromEntries(
  PROVIDER_ORDER.map((provider) => [provider, PROVIDER_CONFIGS[provider].label]),
) as Record<Provider, string>;

export const PROVIDER_SHORT_LABELS: Record<Provider, string> = Object.fromEntries(
  PROVIDER_ORDER.map((provider) => [provider, PROVIDER_CONFIGS[provider].shortLabel]),
) as Record<Provider, string>;

export const PROVIDER_MODELS: Record<Provider, ModelInfo[]> = Object.fromEntries(
  PROVIDER_ORDER.map((provider) => [provider, PROVIDER_CONFIGS[provider].models]),
) as Record<Provider, ModelInfo[]>;

export function getProviderLabel(provider: Provider | string) {
  if (isRuntimeProviderId(provider)) {
    return PROVIDER_LABELS[provider];
  }

  return (
    (RETIRED_PROVIDER_LABELS as Readonly<Record<string, string>>)[provider] ??
    provider
  );
}

export function getProviderModelName(
  provider: Provider | string,
  modelId: string,
) {
  if (!isRuntimeProviderId(provider)) {
    return modelId;
  }

  const catalogMatch = getCatalogModelForAppProvider(provider, modelId, "llm");

  if (catalogMatch) {
    return catalogMatch.publicName;
  }

  const match = PROVIDER_MODELS[provider].find((model) => model.id === modelId);
  return match?.name ?? modelId;
}

export const PROVIDER_API_KEY_HINTS: Record<Provider, string> = Object.fromEntries(
  PROVIDER_ORDER.map((provider) => [
    provider,
    "Paste credentials for an external service you already use. Keys stay on this device and are used only for requests you start in the app.",
  ]),
) as Record<Provider, string>;

export const PROVIDER_API_KEY_PLACEHOLDERS: Record<Provider, string> =
  Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>;

export const PROVIDER_API_KEY_URLS: Record<Provider, string> = Object.fromEntries(
  PROVIDER_ORDER.map((provider) => [provider, PROVIDER_CONFIGS[provider].apiKeyUrl]),
) as Record<Provider, string>;

export const PROVIDER_CATALOG_IDS: Record<Provider, string> = APP_PROVIDER_CATALOG_IDS;

export const PROVIDER_CATALOG_VERIFIED_SUPPORT: Record<
  Provider,
  {
    llm: ReturnType<typeof getCatalogVerifiedServiceStateForAppProvider>;
    stt: ReturnType<typeof getCatalogVerifiedServiceStateForAppProvider>;
    tts: ReturnType<typeof getCatalogVerifiedServiceStateForAppProvider>;
  }
> = Object.fromEntries(
  PROVIDER_ORDER.map((provider) => [
    provider,
    {
      llm: getCatalogVerifiedServiceStateForAppProvider(provider, "llm"),
      stt: getCatalogVerifiedServiceStateForAppProvider(provider, "stt"),
      tts: getCatalogVerifiedServiceStateForAppProvider(provider, "tts"),
    },
  ]),
) as Record<
  Provider,
  {
    llm: ReturnType<typeof getCatalogVerifiedServiceStateForAppProvider>;
    stt: ReturnType<typeof getCatalogVerifiedServiceStateForAppProvider>;
    tts: ReturnType<typeof getCatalogVerifiedServiceStateForAppProvider>;
  }
>;

export const PROVIDER_NEEDS_LIVE_MODEL_DISCOVERY: Record<Provider, boolean> =
  Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      getCatalogProviderForAppProvider(provider)?.integration.needsLiveDiscovery ??
        false,
    ]),
  ) as Record<Provider, boolean>;

export const PROVIDER_STT_SUPPORT: Record<Provider, "none" | "provider"> =
  Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [provider, PROVIDER_CONFIGS[provider].sttSupport]),
  ) as Record<Provider, "none" | "provider">;

export const PROVIDER_LLM_SUPPORT: Record<Provider, "none" | "provider"> =
  Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      PROVIDER_MODELS[provider].length > 0 ? "provider" : "none",
    ]),
  ) as Record<Provider, "none" | "provider">;

export const PROVIDER_TTS_SUPPORT: Record<Provider, "none" | "provider"> =
  Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [provider, PROVIDER_CONFIGS[provider].ttsSupport]),
  ) as Record<Provider, "none" | "provider">;

export const PROVIDER_STT_LANGUAGE_NOTES: Partial<Record<Provider, string>> =
  Object.fromEntries(
    PROVIDER_ORDER.flatMap((provider) =>
      PROVIDER_CONFIGS[provider].sttLanguageNote
        ? [[provider, PROVIDER_CONFIGS[provider].sttLanguageNote]]
        : [],
    ),
  ) as Partial<Record<Provider, string>>;

export const PROVIDER_TTS_LANGUAGE_NOTES: Partial<Record<Provider, string>> =
  Object.fromEntries(
    PROVIDER_ORDER.flatMap((provider) =>
      PROVIDER_CONFIGS[provider].ttsLanguageNote
        ? [[provider, PROVIDER_CONFIGS[provider].ttsLanguageNote]]
        : [],
    ),
  ) as Partial<Record<Provider, string>>;
