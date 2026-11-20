import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition(
  {
    "providerId": "mistral-ai",
    "providerName": "Mistral AI",
    "categoryName": "Foundation model provider / AI API platform",
    "hq": "Paris, France",
    "verifiedSupport": {
      "llm": "native",
      "stt": "native",
      "tts": "native"
    },
    "officialSources": [
      "https://docs.mistral.ai/models/mistral-large-4-0",
      "https://docs.mistral.ai/models/voxtral-mini-tts-3-0",
      "https://docs.mistral.ai/models/voxtral-mini-transcribe-3-0",
      "https://docs.mistral.ai/models/voxtral-small-transcribe-3-0",
      "https://docs.mistral.ai/models/mistral-medium-3-5-26-04",
      "https://docs.mistral.ai/studio/audio/specs-and-limits/languages",
      "https://docs.mistral.ai/",
      "https://docs.mistral.ai/getting-started/models",
      "https://docs.mistral.ai/api/endpoint/models",
      "https://docs.mistral.ai/api/endpoint/chat",
      "https://docs.mistral.ai/capabilities/audio_transcription",
      "https://docs.mistral.ai/capabilities/audio_transcription/offline_transcription",
      "https://docs.mistral.ai/capabilities/audio_transcription/realtime_transcription",
      "https://docs.mistral.ai/studio-api/audio/text_to_speech",
      "https://docs.mistral.ai/api/endpoint/audio/speech",
      "https://docs.mistral.ai/deployment/ai-studio/tier",
      "https://docs.mistral.ai/capabilities/batch",
      "https://docs.mistral.ai/api/endpoint/batch",
      "https://docs.mistral.ai/api/endpoint/files",
      "https://docs.mistral.ai/getting-started/changelog",
      "https://mistral.ai/legal",
      "https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data",
      "https://docs.mistral.ai/deployment/self-deployment"
    ],
    "integration": {
      "catalogType": "Official docs + live API model listing",
      "coverage": "Dynamic/non-exhaustive",
      "hasDynamicCatalog": true,
      "needsLiveDiscovery": true,
      "supportsSpeech": true,
      "lowConfidence": false,
      "openAiCompatible": true,
      "protocols": [
        "rest",
        "sse",
        "websocket"
      ],
      "regionSplitRecommended": true
    },
    "summaries": {
      "pricing": "Mistral Large 4 costs USD 0.70 per million input and USD 2.10 per million output tokens. Voxtral 3 Mini and Small recorded transcription cost USD 0.0035 and USD 0.004 per minute respectively. Voxtral 3 TTS costs USD 13 per million characters. Earlier Voxtral generations have separate rates.",
      "limits": "Context windows are model-specific (32k to 1M tokens across model families, including 1M for Large 4). Offline transcription supports up to 3 hours per request. File uploads are documented up to 512 MB per individual file. Batch jobs default to 24 hours timeout. Inline batching is supported for <10k requests and file batching up to 1M requests.",
      "region": "Public help-center guidance says data is hosted in the EU by default, with an explicit US API endpoint available for US hosting. Enterprise/self-host/private-cloud deployment options are also marketed.",
      "sttLanguages": "Voxtral 3 transcription supports 53 languages. Voxtral 2 transcription lists 13 languages: English, Chinese, Hindi, Spanish, Arabic, French, Portuguese, Russian, German, Japanese, Korean, Italian, Dutch.",
      "ttsLanguages": "Voxtral 3 synthesis supports 35 languages. Voxtral 2 TTS supports English, French, Spanish, Portuguese, Italian, Dutch, German, Hindi, and Arabic.",
      "freeTier": "There is a documented free API tier, but the docs characterize it as restrictive and instruct users to check workspace limits for current rate/usage details.",
      "integrationNotes": "Use canonical dated IDs for stable picker entries, but keep aliases separately. Alias behavior is endpoint-scoped in at least one case (`voxtral-mini-latest`). Use `/v1/models` for live discovery. Treat rate limits as dynamic. Speech generation uses POST `/v1/audio/speech` and returns base64 `audio_data`; a saved preset/custom `voice_id` or reference audio is required."
    },
    "sources": [
      {
        "url": "https://mistral.ai/legal",
        "title": "Legal notice",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "regions"
        ]
      },
      {
        "url": "https://docs.mistral.ai/",
        "title": "Documentation home",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "stt",
          "tts"
        ]
      },
      {
        "url": "https://docs.mistral.ai/getting-started/models",
        "title": "Models",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "limits"
        ]
      },
      {
        "url": "https://docs.mistral.ai/api/endpoint/models",
        "title": "Models Endpoints",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "limits"
        ]
      },
      {
        "url": "https://docs.mistral.ai/api/endpoint/chat",
        "title": "Chat Endpoints",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "limits"
        ]
      },
      {
        "url": "https://docs.mistral.ai/capabilities/audio_transcription",
        "title": "Audio & Transcription",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "stt",
          "limits",
          "regions"
        ]
      },
      {
        "url": "https://docs.mistral.ai/capabilities/audio_transcription/offline_transcription",
        "title": "Offline Transcription",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "stt",
          "models",
          "limits"
        ]
      },
      {
        "url": "https://docs.mistral.ai/capabilities/audio_transcription/realtime_transcription",
        "title": "Realtime Transcription",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "stt",
          "limits"
        ]
      },
      {
        "url": "https://docs.mistral.ai/deployment/ai-studio/tier",
        "title": "Rate Limits & Usage tiers",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "pricing"
        ]
      },
      {
        "url": "https://docs.mistral.ai/capabilities/batch",
        "title": "Batch Inference",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits"
        ]
      },
      {
        "url": "https://docs.mistral.ai/api/endpoint/batch",
        "title": "Batch Endpoints",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits"
        ]
      },
      {
        "url": "https://docs.mistral.ai/api/endpoint/files",
        "title": "Files Endpoints",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits"
        ]
      },
      {
        "url": "https://docs.mistral.ai/getting-started/changelog",
        "title": "Changelog",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "stt",
          "limits"
        ]
      },
      {
        "url": "https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data",
        "title": "Where do you store my data or my Organization's data?",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "regions"
        ]
      },
      {
        "url": "https://docs.mistral.ai/deployment/self-deployment",
        "title": "Self-Deployment",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "regions"
        ]
      }
    ]
  },
);

export const providerContext = createProviderContext(providerDefinition);
