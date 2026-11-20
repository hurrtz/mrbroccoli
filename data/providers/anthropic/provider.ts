import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition(
  {
    "providerId": "anthropic",
    "providerName": "Anthropic",
    "categoryName": "LLM API provider",
    "hq": "Unknown",
    "verifiedSupport": {
      "llm": "native",
      "stt": "unsupported",
      "tts": "unsupported"
    },
    "officialSources": [
      "https://platform.claude.com/docs/en/models/overview",
      "https://platform.claude.com/docs/en/about-claude/models/overview",
      "https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8",
      "https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7",
      "https://platform.claude.com/docs/en/about-claude/pricing",
      "https://platform.claude.com/docs/en/api/overview",
      "https://platform.claude.com/docs/en/build-with-claude/streaming",
      "https://platform.claude.com/docs/en/api/messages/batches/create",
      "https://platform.claude.com/docs/en/build-with-claude/files",
      "https://platform.claude.com/docs/en/build-with-claude/pdf-support",
      "https://platform.claude.com/docs/en/build-with-claude/vision",
      "https://platform.claude.com/docs/en/api/rate-limits",
      "https://platform.claude.com/docs/en/api/service-tiers",
      "https://platform.claude.com/docs/en/api/openai-sdk",
      "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      "https://platform.claude.com/docs/en/release-notes/overview",
      "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
      "https://platform.claude.com/docs/en/api/supported-regions",
      "https://platform.claude.com/docs/en/docs/about-claude/security-compliance"
    ],
    "integration": {
      "catalogType": "First-party Claude family with live-discoverable current model list via GET /v1/models",
      "coverage": "Mostly exhaustive",
      "hasDynamicCatalog": true,
      "needsLiveDiscovery": true,
      "supportsSpeech": false,
      "lowConfidence": false,
      "openAiCompatible": true,
      "protocols": [
        "rest",
        "sse"
      ],
      "regionSplitRecommended": false
    },
    "summaries": {
      "pricing": "Standard short text requests per million input and output tokens cost USD 8 and 40 on Fable 5.2, USD 4 and 20 on Opus 5.5, USD 2 and 10 on Sonnet 5.5, and USD 0.10 and 0.50 on Haiku 5.5. Prompt caching, batch, routing and longer requests have separate terms.",
      "limits": "Standard request body limit 32 MB; Message Batches 256 MB; Files API 500 MB per file and 500 GB total organization storage. PDFs up to 600 pages per request, or 100 pages on 200k-context models. Images up to 600 per request, or 100 on 200k-context models. Batch jobs can take up to 24 hours. Exact RPM/ITPM/OTPM values should be treated as live policy.",
      "region": "Anthropic publishes a supported-country list for API access. The direct API supports inference_geo controls with global default behavior and US-only inference controls. Files API beta is first-party only and is not supported on Amazon Bedrock or Google Vertex AI.",
      "sttLanguages": "Unsupported on first-party public API.",
      "ttsLanguages": "Unsupported on first-party public API.",
      "freeTier": "Unknown; no public first-party API free-tier or trial-credit document was verified in the sources used here.",
      "integrationNotes": "Use the native Claude API for production integration. Anthropic's OpenAI-compatible layer is explicitly framed as a compatibility path for testing/comparison, not the preferred full-feature production path. It ignores audio/modalities, does not support prompt caching, and enforces n=1. Treat consumer voice features in Claude apps as out of scope for API support."
    },
    "sources": [
      {
        "url": "https://platform.claude.com/docs/en/about-claude/models/overview",
        "title": "Models overview",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "limits",
          "languages"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8",
        "title": "What's new in Claude Opus 4.8",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "limits",
          "features"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7",
        "title": "What's new in Claude Opus 4.7",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "limits",
          "vision"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/about-claude/pricing",
        "title": "Pricing",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "limits",
          "batch"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/api/overview",
        "title": "API overview",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "protocols",
          "auth",
          "limits",
          "regions"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/build-with-claude/streaming",
        "title": "Streaming messages",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "realtime",
          "protocols"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/api/messages/batches/create",
        "title": "Create a Message Batch",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "batch",
          "limits"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/build-with-claude/files",
        "title": "Files API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "files",
          "regions"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/build-with-claude/pdf-support",
        "title": "PDF support",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "files"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/build-with-claude/vision",
        "title": "Vision",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "models"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/api/rate-limits",
        "title": "Rate limits",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "rate_limits"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/api/service-tiers",
        "title": "Service tiers",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "pricing"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/api/openai-sdk",
        "title": "OpenAI SDK compatibility",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "openai_compat",
          "limits"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "title": "Model deprecations",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "deprecations"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/release-notes/overview",
        "title": "Release notes overview",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "limits",
          "regions",
          "batch"
        ]
      },
      {
        "url": "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
        "title": "Context windows",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "models"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/api/supported-regions",
        "title": "Supported regions",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "regions"
        ]
      },
      {
        "url": "https://platform.claude.com/docs/en/docs/about-claude/security-compliance",
        "title": "Security & compliance",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "regions",
          "compliance"
        ]
      }
    ]
  },
);

export const providerContext = createProviderContext(providerDefinition);
