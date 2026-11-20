import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition(
  {
    "providerId": "alibaba-qwen-dashscope",
    "providerName": "Alibaba / Qwen (DashScope)",
    "categoryName": "Cloud AI model platform",
    "hq": "unknown",
    "verifiedSupport": {
      "llm": "native",
      "stt": "native",
      "tts": "native"
    },
    "officialSources": [
      "https://docs.modelstudio.console.alibabacloud.com/en/model-studio/qwen4-max",
      "https://www.alibabacloud.com/help/en/model-studio/text-generation-model",
      "https://www.alibabacloud.com/help/en/model-studio/models",
      "https://www.alibabacloud.com/help/en/model-studio/base-url",
      "https://www.alibabacloud.com/help/en/model-studio/regions/",
      "https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope",
      "https://www.alibabacloud.com/help/en/model-studio/qwen-speech-recognition",
      "https://www.alibabacloud.com/help/en/model-studio/qwen-real-time-speech-recognition",
      "https://www.alibabacloud.com/help/en/model-studio/qwen-tts",
      "https://www.alibabacloud.com/help/en/model-studio/qwen-tts-realtime",
      "https://www.alibabacloud.com/help/en/model-studio/realtime",
      "https://www.alibabacloud.com/help/en/model-studio/rate-limit",
      "https://www.alibabacloud.com/help/en/model-studio/model-pricing",
      "https://www.alibabacloud.com/help/en/model-studio/batch-inference",
      "https://www.alibabacloud.com/help/en/model-studio/batch-interfaces-compatible-with-openai/",
      "https://www.alibabacloud.com/help/en/model-studio/install-sdk",
      "https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference/"
    ],
    "integration": {
      "catalogType": "Curated fixed families inside a broader hosted Model Studio catalog",
      "coverage": "Mostly exhaustive",
      "hasDynamicCatalog": true,
      "needsLiveDiscovery": true,
      "supportsSpeech": true,
      "lowConfidence": false,
      "openAiCompatible": true,
      "protocols": [
        "rest",
        "websocket"
      ],
      "regionSplitRecommended": true
    },
    "summaries": {
      "pricing": "LLM pricing is mostly per-token and often tiered by request size; speech pricing is per second (ASR) or per 10K characters / tokens (TTS). Batch LLM pricing is documented at 50% of real-time cost.",
      "limits": "Qwen4-Max has a 1,000,000-token context and a maximum of 131,072 output tokens with thinking disabled or 262,144 with thinking enabled. Speech limits vary by model: short-file ASR <=10 MB and <=5 minutes; long-file ASR <=2 GB and <=12 hours; Qwen-Omni-Realtime sessions last up to 120 minutes; Qwen-TTS-Realtime has 8,192-token context with 512 max input / 7,680 max output.",
      "region": "The provider has region-specific endpoints, model availability, and storage/compute locality: Global/US, International/Singapore, EU/Frankfurt, Hong Kong, and Chinese Mainland/Beijing appear across the docs.",
      "sttLanguages": "Qwen3 ASR Realtime explicitly lists 29 languages including Chinese variants, English, Japanese, German, Korean, Russian, French, Portuguese, Arabic, Italian, Spanish, Hindi, Indonesian, Thai, Turkish, Ukrainian, Vietnamese, Czech, Danish, Filipino, Finnish, Icelandic, Malay, Norwegian, Polish, and Swedish. Paraformer/Fun-ASR have separate language coverage.",
      "ttsLanguages": "Main Qwen3 TTS models explicitly list Chinese (Mandarin), English, Spanish, Russian, Italian, French, Korean, Japanese, German, and Portuguese. qwen3-tts-flash additionally lists several Chinese dialect variants.",
      "freeTier": "Model Studio documents limited starter free quotas for some international/global models and some realtime speech/TTS entries, typically valid for 90 days after activation. Chinese Mainland pages commonly state no free quota.",
      "integrationNotes": "Mr Broccoli stores the selected Singapore, US, or Beijing region alongside the API key in SecureStore. Chat and web search use the matching regional DashScope host. Current Qwen-Audio recognition and synthesis services require different transports from the retired speech snapshots."
    },
    "sources": [
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/models",
        "title": "Alibaba Cloud Model Studio: Models",
        "type": "official",
        "lastUpdated": "2026-03-20",
        "usedFor": [
          "models",
          "pricing",
          "aliases",
          "limits",
          "regions",
          "languages"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope",
        "title": "How to call Qwen models using the OpenAI interface",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "regions",
          "openai_compatibility"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/qwen-speech-recognition",
        "title": "Audio file recognition - Qwen",
        "type": "official",
        "lastUpdated": "2026-03-15",
        "usedFor": [
          "stt",
          "limits",
          "languages"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/qwen-real-time-speech-recognition",
        "title": "Real-time speech recognition - Qwen",
        "type": "official",
        "lastUpdated": "2026-03-15",
        "usedFor": [
          "stt",
          "realtime",
          "limits",
          "transport"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/qwen-tts",
        "title": "Speech synthesis - Qwen",
        "type": "official",
        "lastUpdated": "2026-02-26",
        "usedFor": [
          "tts",
          "voices",
          "languages",
          "regions"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/qwen-tts-realtime",
        "title": "Real-time speech synthesis - Qwen",
        "type": "official",
        "lastUpdated": "2026-02-26",
        "usedFor": [
          "tts",
          "realtime",
          "transport",
          "languages"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/realtime",
        "title": "Qwen-Omni-Realtime",
        "type": "official",
        "lastUpdated": "2026-03-15",
        "usedFor": [
          "models",
          "realtime",
          "transport",
          "limits",
          "voices"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/rate-limit",
        "title": "Rate limits",
        "type": "official",
        "lastUpdated": "2026-03-23",
        "usedFor": [
          "limits",
          "rate_limits"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/model-pricing",
        "title": "Model invocation pricing",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "deprecations"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/batch-inference",
        "title": "Batch inference",
        "type": "official",
        "lastUpdated": "2026-03-15",
        "usedFor": [
          "batch",
          "pricing"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/batch-interfaces-compatible-with-openai/",
        "title": "OpenAI compatible - Batch",
        "type": "official",
        "lastUpdated": "2026-03-15",
        "usedFor": [
          "batch",
          "openai_compatibility"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/install-sdk",
        "title": "Install the Alibaba Cloud Model Studio SDK",
        "type": "official",
        "lastUpdated": "2026-03-15",
        "usedFor": [
          "sdk",
          "openai_compatibility"
        ]
      },
      {
        "url": "https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference/",
        "title": "Qwen API reference",
        "type": "official",
        "lastUpdated": "2026-02-12",
        "usedFor": [
          "openai_compatibility",
          "integration"
        ]
      }
    ]
  },
);

export const providerContext = createProviderContext(providerDefinition);
