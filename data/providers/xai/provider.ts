import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition(
  {
    "providerId": "xai",
    "providerName": "xAI",
    "categoryName": "Foundation model API provider",
    "hq": "Palo Alto, California, USA",
    "verifiedSupport": {
      "llm": "native",
      "stt": "native",
      "tts": "native"
    },
    "officialSources": [
      "https://docs.x.ai/developers/models",
      "https://docs.x.ai/developers/models/grok-4.7",
      "https://docs.x.ai/developers/model-capabilities/audio/speech-to-text",
      "https://docs.x.ai/developers/pricing",
      "https://docs.x.ai/developers/models/grok-4.5",
      "https://docs.x.ai/developers/models/grok-4.3",
      "https://docs.x.ai/developers/rest-api-reference",
      "https://docs.x.ai/developers/rest-api-reference/inference/models",
      "https://docs.x.ai/developers/model-capabilities/text/generate-text",
      "https://docs.x.ai/developers/model-capabilities/text/streaming",
      "https://docs.x.ai/developers/model-capabilities/audio/voice",
      "https://docs.x.ai/developers/model-capabilities/audio/voice-agent",
      "https://docs.x.ai/developers/model-capabilities/audio/text-to-speech",
      "https://docs.x.ai/developers/rest-api-reference/inference/voice",
      "https://docs.x.ai/developers/advanced-api-usage/batch-api",
      "https://docs.x.ai/developers/release-notes",
      "https://docs.x.ai/developers/regions",
      "https://docs.x.ai/developers/faq/security",
      "https://docs.x.ai/developers/grpc-api-reference",
      "https://x.ai/api",
      "https://x.ai/api/voice",
      "https://x.ai/careers"
    ],
    "integration": {
      "catalogType": "Team-available language-model catalog plus fixed voice API surfaces",
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
        "grpc"
      ],
      "regionSplitRecommended": true
    },
    "summaries": {
      "pricing": "Grok 4.7 starts at USD 2 per million input tokens and USD 6 per million output tokens. Recorded REST transcription costs USD 0.10 per hour and streaming transcription costs USD 0.20 per hour. TTS costs USD 15 per million characters.",
      "limits": "Recorded transcription accepts files up to 500 MB. Standalone TTS accepts up to 60,000 characters per request and 50 concurrent bidirectional streaming sessions per team.",
      "region": "Global endpoint https://api.x.ai routes automatically; regional endpoints are available, with docs explicitly showing eu-west-1 and noting regional failures fail closed rather than falling back. Voice/TTS pricing pages currently list us-east-1 availability.",
      "sttLanguages": "Grok Voice Transcribe 2.0 transcribes at least 38 languages and can follow language changes within a recording.",
      "ttsLanguages": "Official TTS docs list 20 named languages/locale variants plus auto-detect.",
      "freeTier": "Unknown in developer docs. Quickstart says to create an account and load credits; the public API marketing pages say 'free to start' / 'no credit card required', but no durable developer free-tier quota is documented.",
      "integrationNotes": "Use the published model list or the Management API for team-specific discovery. Standalone recorded transcription uses multipart POST /v1/stt. Speech synthesis uses POST /v1/tts, with built-in voices listed at GET /v1/tts/voices."
    },
    "sources": [
      {
        "url": "https://docs.x.ai/developers/models",
        "title": "Models and Pricing | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "models",
          "limits"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/models/grok-4.3",
        "title": "Grok 4.3 | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "pricing",
          "limits",
          "aliases"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/rest-api-reference",
        "title": "Inference REST API Overview | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "integration",
          "protocols",
          "auth"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/rest-api-reference/inference/models",
        "title": "Models | Inference API - REST API Reference | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "aliases",
          "live-discovery"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/model-capabilities/text/generate-text",
        "title": "Generate Text | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "llm",
          "openai-compat",
          "gRPC",
          "retention"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/model-capabilities/text/streaming",
        "title": "Streaming | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "streaming",
          "protocols"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/model-capabilities/audio/voice",
        "title": "Voice APIs | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "speech",
          "tts",
          "compliance",
          "voices"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/model-capabilities/audio/voice-agent",
        "title": "Voice Agent API | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "voice",
          "realtime",
          "limits",
          "formats"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/model-capabilities/audio/text-to-speech",
        "title": "Text to Speech | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "pricing",
          "languages",
          "voices",
          "limits"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/rest-api-reference/inference/voice",
        "title": "Voice | Inference API - REST API Reference | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "voices",
          "limits",
          "websocket-auth"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/advanced-api-usage/batch-api",
        "title": "Batch API | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "batch",
          "pricing"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/release-notes",
        "title": "Release Notes | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "release-dates",
          "status"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/regions",
        "title": "Regional Endpoints | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "regions",
          "data-residency"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/faq/security",
        "title": "FAQ - xAI API Security",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "privacy",
          "retention",
          "training",
          "zdr",
          "compliance"
        ]
      },
      {
        "url": "https://docs.x.ai/developers/grpc-api-reference",
        "title": "gRPC API Reference | xAI Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "grpc",
          "protocols"
        ]
      },
      {
        "url": "https://x.ai/api",
        "title": "API: Frontier Models for Reasoning & Enterprise | xAI",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "pricing",
          "public-availability"
        ]
      },
      {
        "url": "https://x.ai/api/voice",
        "title": "Voice API: Build Voice Agents That Speak, Think, and Act | xAI",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "speech",
          "stt",
          "voice-marketing",
          "pricing"
        ]
      },
      {
        "url": "https://x.ai/careers",
        "title": "Careers: Build AI That Advances Humanity | xAI",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "hq"
        ]
      }
    ]
  },
);

export const providerContext = createProviderContext(providerDefinition);
