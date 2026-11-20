import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition({
  providerId: "openrouter",
  providerName: "OpenRouter",
  categoryName: "Multi-provider model gateway",
  hq: "United States",
  verifiedSupport: {
    llm: "routed",
    stt: "routed",
    tts: "routed",
  },
  officialSources: [
    "https://openrouter.ai/api/v1/models",
    "https://openrouter.ai/blog/announcements/announcing-audio-apis/",
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
    supportsSpeech: true,
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
    sttLanguages: "The routed transcription endpoint accepts languages supported by its upstream model.",
    ttsLanguages: "The routed speech endpoint exposes model-specific language and voice coverage.",
    freeTier:
      "Some routed models may have free variants with separate rate limits; availability is dynamic.",
    integrationNotes:
      "The app selects researched chat snapshots and uses OpenRouter base rates and limits for those offers. The wider directory changes with its upstream providers. OpenRouter also publishes dedicated routed audio endpoints.",
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
