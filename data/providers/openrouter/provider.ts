import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition({
  providerId: "openrouter",
  providerName: "OpenRouter",
  categoryName: "Multi-provider model gateway",
  hq: "United States",
  verifiedSupport: {
    llm: "routed",
    stt: "unsupported",
    tts: "unsupported",
  },
  officialSources: [
    "https://openrouter.ai/docs/quickstart",
    "https://openrouter.ai/docs/guides/overview/models",
    "https://openrouter.ai/docs/guides/overview/auth/oauth",
    "https://openrouter.ai/docs/guides/routing/provider-selection",
    "https://openrouter.ai/docs/guides/features/router-metadata",
    "https://openrouter.ai/docs/guides/privacy/data-collection",
  ],
  integration: {
    catalogType: "Dynamic routed model catalog",
    coverage: "Dynamic/non-exhaustive",
    hasDynamicCatalog: true,
    needsLiveDiscovery: true,
    supportsSpeech: false,
    lowConfidence: false,
    openAiCompatible: true,
    protocols: ["rest", "sse", "oauth-pkce"],
    regionSplitRecommended: false,
  },
  summaries: {
    pricing:
      "Pricing is model- and route-specific and is exposed by OpenRouter's live Models API.",
    limits:
      "Context, output, and rate limits vary by model, upstream provider, account tier, and API key limit.",
    region:
      "Requests pass through OpenRouter and then the selected upstream provider. Per-route region and data handling vary.",
    sttLanguages: "Unsupported: no general speech-to-text gateway is used.",
    ttsLanguages: "Unsupported: no general text-to-speech gateway is used.",
    freeTier:
      "Some routed models may have free variants with separate rate limits; availability is dynamic.",
    integrationNotes:
      "Use the live Models API for broad discovery. Mr Broccoli exposes a conservative snapshot-backed picker and keeps direct provider integrations available.",
  },
  sources: [
    {
      url: "https://openrouter.ai/docs/quickstart",
      title: "OpenRouter Quickstart",
      type: "official",
      lastUpdated: null,
      usedFor: ["models", "limits"],
    },
    {
      url: "https://openrouter.ai/docs/guides/overview/models",
      title: "OpenRouter Models",
      type: "official",
      lastUpdated: null,
      usedFor: ["models", "pricing", "limits"],
    },
    {
      url: "https://openrouter.ai/docs/guides/routing/provider-selection",
      title: "OpenRouter Provider Routing",
      type: "official",
      lastUpdated: null,
      usedFor: ["models", "limits", "regions"],
    },
    {
      url: "https://openrouter.ai/docs/guides/privacy/data-collection",
      title: "OpenRouter Data Collection",
      type: "official",
      lastUpdated: null,
      usedFor: ["regions"],
    },
  ],
});

export const providerContext = createProviderContext(providerDefinition);
