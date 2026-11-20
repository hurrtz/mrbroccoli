import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition(
  {
    "providerId": "openai",
    "providerName": "OpenAI",
    "categoryName": "Multimodal AI API provider",
    "hq": "Unknown",
    "verifiedSupport": {
      "llm": "native",
      "stt": "native",
      "tts": "native"
    },
    "officialSources": [
      "https://developers.openai.com/api/docs/models/gpt-6.2-astra",
      "https://developers.openai.com/api/docs/models/gpt-6.2-sol",
      "https://developers.openai.com/api/docs/models",
      "https://developers.openai.com/api/docs/models/all",
      "https://developers.openai.com/api/reference/resources/models/methods/list/",
      "https://developers.openai.com/api/docs/pricing/",
      "https://openai.com/api/pricing/",
      "https://developers.openai.com/api/docs/guides/speech-to-text/",
      "https://developers.openai.com/api/docs/guides/text-to-speech/",
      "https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create/",
      "https://developers.openai.com/api/reference/resources/audio/subresources/voices/methods/create/",
      "https://developers.openai.com/api/docs/guides/audio/",
      "https://developers.openai.com/api/docs/guides/realtime-conversations/",
      "https://developers.openai.com/api/docs/guides/realtime/",
      "https://developers.openai.com/api/docs/guides/realtime-sip/",
      "https://developers.openai.com/api/reference/overview/",
      "https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create/",
      "https://developers.openai.com/api/docs/guides/your-data/",
      "https://openai.com/business-data/",
      "https://developers.openai.com/api/docs/changelog/",
      "https://developers.openai.com/api/docs/deprecations/"
    ],
    "integration": {
      "catalogType": "Live /v1/models discovery plus per-model docs and changelog-managed aliases",
      "coverage": "Dynamic/non-exhaustive",
      "hasDynamicCatalog": true,
      "needsLiveDiscovery": true,
      "supportsSpeech": true,
      "lowConfidence": false,
      "openAiCompatible": true,
      "protocols": [
        "rest",
        "sse",
        "websocket",
        "webrtc",
        "sip"
      ],
      "regionSplitRecommended": true
    },
    "summaries": {
      "pricing": "GPT-6.2 Astra costs USD 8 per million text input tokens and USD 40 per million output tokens. GPT-6.2 Sol costs USD 2 and USD 10 respectively. Each model card lists its own rates and supported service tiers. Audio models use separate pricing.",
      "limits": "Speech-to-text uploads are limited to 25 MB. Realtime sessions are capped at 60 minutes. Speech generation input is capped at 4,096 characters. gpt-4o-mini-tts has a 2,000-token input cap. Custom voices are limited to 20 per organization; sample audio must be 30 seconds or less and uploads are capped at 10 MiB.",
      "region": "Data residency is configured per project. US and Europe support regional storage + processing; Australia, Canada, India, Japan, Singapore, South Korea, UAE, and UK are storage-only in the opened docs. Region-specific domains are documented (for example, eu.api.openai.com and us.api.openai.com), and feature caveats apply by region.",
      "sttLanguages": "Official speech-to-text docs list 57 supported languages for current STT models, while also noting the underlying model family was trained on 98 languages. Whisper translation is documented only into English.",
      "ttsLanguages": "The TTS guide says current TTS generally follows Whisper language coverage and lists the same 57 languages, but voices are currently optimized for English. The same guide has an internal voice-count conflict: one section says 11 built-in voices while another says 13.",
      "freeTier": "No provider-wide API free tier is cleanly documented in the opened pages. Many current model pages show 'Free: not supported', while some older speech models still show small free-tier RPM/RPD allowances. Treat free access as account-plan-dependent rather than globally available.",
      "integrationNotes": "Use /v1/models for live discovery and layer a curated stable picker on top. Prefer stable canonical slugs over dated snapshots and ChatGPT-targeted aliases. For mobile clients, do not ship long-lived API keys; for Realtime use short-lived client secrets. Realtime voice is over WebRTC/WebSocket/SIP, while turn-based audio and TTS/STT are primarily REST-based."
    },
    "sources": [
      {
        "url": "https://developers.openai.com/api/docs/models",
        "title": "Models | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "llm"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/models/all",
        "title": "All models | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "catalog"
        ]
      },
      {
        "url": "https://developers.openai.com/api/reference/resources/models/methods/list/",
        "title": "List models | OpenAI API Reference",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "catalog",
          "live-discovery"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/pricing/",
        "title": "Pricing | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "batch",
          "stt",
          "llm"
        ]
      },
      {
        "url": "https://openai.com/api/pricing/",
        "title": "API Pricing | OpenAI",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "batch"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/guides/speech-to-text/",
        "title": "Speech to text | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "stt",
          "limits",
          "languages"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/guides/realtime-transcription/",
        "title": "Realtime transcription | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "stt",
          "realtime",
          "protocols"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/guides/text-to-speech/",
        "title": "Text to speech | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "voices",
          "languages",
          "limits"
        ]
      },
      {
        "url": "https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create/",
        "title": "Create speech | OpenAI API Reference",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "limits",
          "streaming"
        ]
      },
      {
        "url": "https://developers.openai.com/api/reference/resources/audio/subresources/voices/methods/create/",
        "title": "Create custom voice | OpenAI API Reference",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "voices",
          "limits"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/guides/realtime-conversations/",
        "title": "Realtime conversations | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "realtime",
          "limits",
          "protocols"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/guides/realtime-sip/",
        "title": "Realtime SIP | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "realtime",
          "protocols"
        ]
      },
      {
        "url": "https://developers.openai.com/api/reference/overview/",
        "title": "API overview | OpenAI API Reference",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "auth",
          "protocols",
          "headers"
        ]
      },
      {
        "url": "https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create/",
        "title": "Create client secret | OpenAI API Reference",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "auth",
          "realtime",
          "mobile"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/guides/your-data/",
        "title": "Data controls in the OpenAI platform | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "regions",
          "privacy",
          "residency"
        ]
      },
      {
        "url": "https://openai.com/business-data/",
        "title": "Business data privacy, security, and compliance | OpenAI",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "privacy",
          "compliance"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/changelog/",
        "title": "Changelog | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "aliases",
          "recommendations",
          "models"
        ]
      },
      {
        "url": "https://developers.openai.com/api/docs/deprecations/",
        "title": "Deprecations | OpenAI API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "deprecations",
          "preview-models"
        ]
      }
    ]
  },
);

export const providerContext = createProviderContext(providerDefinition);
