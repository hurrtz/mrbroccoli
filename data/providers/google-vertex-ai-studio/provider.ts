import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition(
  {
    "providerId": "google-vertex-ai-studio",
    "providerName": "Google Vertex AI Studio",
    "categoryName": "Cloud AI platform / multimodal model studio",
    "hq": "Unknown",
    "verifiedSupport": {
      "llm": "native",
      "stt": "partial",
      "tts": "native"
    },
    "officialSources": [
      "https://aistudio.google.com/docs/models",
      "https://aistudio.google.com/docs/pricing",
      "https://aistudio.google.com/docs/deprecations",
      "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models",
      "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versions",
      "https://cloud.google.com/vertex-ai/generative-ai/pricing",
      "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api",
      "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/multimodal-live",
      "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api/start-manage-session",
      "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/openai",
      "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/locations",
      "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency",
      "https://cloud.google.com/speech-to-text/pricing",
      "https://docs.cloud.google.com/speech-to-text/docs/transcription-model",
      "https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages",
      "https://docs.cloud.google.com/speech-to-text/docs/quotas",
      "https://cloud.google.com/text-to-speech/pricing",
      "https://docs.cloud.google.com/text-to-speech/docs/gemini-tts",
      "https://docs.cloud.google.com/text-to-speech/docs/endpoints",
      "https://docs.cloud.google.com/text-to-speech/quotas",
      "https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types"
    ],
    "integration": {
      "catalogType": "Curated first-party Google model catalog inside a broader dynamic Vertex marketplace",
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
      "pricing": "Gemini Developer API and Vertex AI publish separate token rates. Carbon and Argon have introductory Gemini API pricing through November 30, 2026; Cloud STT is minute-priced; Gemini-TTS is token-priced; classic Cloud TTS is character-priced. Batch/flex discounts are public for several Gemini LLMs, and Cloud STT V2 dynamic batch is discounted.",
      "limits": "Gemini 4 shares 1,048,576 tokens across input and output, with a default synchronous output cap of 65,536. Gemini 2.5 text models generally expose 1,048,576 input-token context and 65,535 default output tokens. Gemini Live has 128k context, 15-minute default audio-only sessions, and 1,000 concurrent sessions/project on PayGo. Cloud STT has 10 MB / 1 minute synchronous limits and 25 KB per streaming chunk with 5-minute streaming sessions. Gemini-TTS text+prompt total is 8,000 bytes with ~655 seconds output cap; classic Cloud TTS has 5,000 bytes/request.",
      "region": "Use regional endpoints when residency matters. Vertex global endpoints improve availability but do not guarantee in-region ML processing. Cloud TTS and Gemini-TTS support global, US, EU, and several APAC/regional endpoints. Cloud STT V2 documents data residency support including Belgium and Singapore.",
      "sttLanguages": "Cloud STT is broadly multilingual; marketing says 125+ languages, while Chirp 3 product text highlights 85+ languages/variants.",
      "ttsLanguages": "Classic Cloud TTS advertises 380+ voices across 75+ languages/variants. Gemini Live native audio documents 24 languages and 30 voices. Gemini-TTS release notes state 30 speakers across 80+ locales.",
      "freeTier": "Google Cloud offers $300 trial credit for new customers. Cloud STT v1 and classic Cloud TTS have documented free usage tiers; Gemini-TTS pricing page shows no free usage for listed Gemini-TTS entries in the captured pricing section.",
      "integrationNotes": "Mr Broccoli uses the Gemini Developer API for chat, search and recorded-audio transcription. Gemini 3.5 Transcribe and both Gemini 3.8 speech synthesis models use Interactions. Other recorded-audio models and Gemini 3.1 TTS Preview use GenerateContent."
    },
    "sources": [
      {
        "url": "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models",
        "title": "Google models | Generative AI on Vertex AI",
        "type": "official",
        "lastUpdated": "2026-03-16",
        "usedFor": [
          "models"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versions",
        "title": "Model versions and lifecycle | Generative AI on Vertex AI",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "deprecations",
          "aliases"
        ]
      },
      {
        "url": "https://cloud.google.com/vertex-ai/generative-ai/pricing",
        "title": "Vertex AI Pricing",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "batch"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/multimodal-live",
        "title": "Gemini Live API reference",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "realtime",
          "protocols",
          "limits"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api/start-manage-session",
        "title": "Start and manage live sessions",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "sessions",
          "realtime"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/openai",
        "title": "OpenAI compatibility | Generative AI on Vertex AI",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "openai_compatibility",
          "auth"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/locations",
        "title": "Deployments and endpoints",
        "type": "official",
        "lastUpdated": "2026-03-16",
        "usedFor": [
          "regions",
          "residency",
          "models"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency",
        "title": "Data residency | Generative AI on Vertex AI",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "regions"
        ]
      },
      {
        "url": "https://cloud.google.com/speech-to-text/pricing",
        "title": "Speech-to-Text API Pricing",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "stt",
          "batch"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/speech-to-text/docs/transcription-model",
        "title": "Compare transcription models | Cloud Speech-to-Text",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "stt",
          "models"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages",
        "title": "Cloud Speech-to-Text V2 supported languages",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "stt",
          "languages",
          "regions"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/speech-to-text/docs/quotas",
        "title": "Quotas and limits | Cloud Speech-to-Text",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "stt",
          "limits"
        ]
      },
      {
        "url": "https://cloud.google.com/text-to-speech/pricing",
        "title": "Review pricing for Text-to-Speech",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "pricing"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/text-to-speech/docs/gemini-tts",
        "title": "Gemini-TTS",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "models",
          "languages",
          "limits",
          "voice"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/text-to-speech/docs/endpoints",
        "title": "Specify a regional endpoint | Cloud Text-to-Speech",
        "type": "official",
        "lastUpdated": "2026-03-16",
        "usedFor": [
          "tts",
          "regions"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/text-to-speech/quotas",
        "title": "Quotas & limits | Cloud Text-to-Speech",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "limits"
        ]
      },
      {
        "url": "https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types",
        "title": "Supported voices and languages | Cloud Text-to-Speech",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tts",
          "languages",
          "voice"
        ]
      }
    ]
  },
);

export const providerContext = createProviderContext(providerDefinition);
