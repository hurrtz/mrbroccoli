import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition(
  {
    "providerId": "deepseek",
    "providerName": "DeepSeek",
    "categoryName": "Foundation model API provider",
    "hq": "Hangzhou, China (inference from legal entity name; official privacy policy states only that the registered address is in China)",
    "verifiedSupport": {
      "llm": "native",
      "stt": "native",
      "tts": "native"
    },
    "officialSources": [
      "https://api-docs.deepseek.com/",
      "https://api-docs.deepseek.com/quick_start/pricing",
      "https://api-docs.deepseek.com/api/list-models",
      "https://api-docs.deepseek.com/api/create-chat-completion",
      "https://api-docs.deepseek.com/guides/thinking_mode",
      "https://api-docs.deepseek.com/guides/tool_calls",
      "https://api-docs.deepseek.com/quick_start/rate_limit",
      "https://api-docs.deepseek.com/faq",
      "https://api-docs.deepseek.com/guides/anthropic_api",
      "https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html",
      "https://api-docs.deepseek.com/updates/",
      "https://api-docs.deepseek.com/news/news261113/",
      "https://api-docs.deepseek.com/guides/asr/",
      "https://api-docs.deepseek.com/api/asr/",
      "https://api-docs.deepseek.com/guides/tts/",
      "https://api-docs.deepseek.com/api/tts/"
    ],
    "integration": {
      "catalogType": "Hosted chat models and standalone speech endpoints. Chat IDs can receive new model versions.",
      "coverage": "Mostly exhaustive",
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
      "regionSplitRecommended": false
    },
    "summaries": {
      "pricing": "Per million tokens at peak, Flash costs $0.006 for cached input, $0.30 for other input and $1.20 for output. Pro costs $0.044, $1.32 and $3.96 respectively. Off-peak chat rates are half these prices. ASR lists $0.116 per audio hour and TTS $0.45 per 10,000 billed characters. Limited-time speech rates are $0.058 and $0.225 respectively.",
      "limits": "Both chat models support a 1M-token context and up to 384K output tokens. Flash allows 2,500 concurrent requests and Pro allows 500. ASR accepts up to 8 MiB and 120 seconds per file. TTS accepts up to 10,000 billed characters per request or session.",
      "region": "Official privacy policy says personal data may be stored outside the user's country and that DeepSeek directly collects, processes, and stores personal data in the PRC. No public API region selector or data-residency option was found.",
      "sttLanguages": "ASR automatically detects 21 languages, including English, German, Chinese and Cantonese.",
      "ttsLanguages": "TTS automatically detects ten languages and offers the Stella and Tide voices.",
      "freeTier": "Unknown for API. Open Platform terms say DeepSeek may provide free quota during internal testing or other activities and that users may request more free quota, but no standing public free-tier schedule was found.",
      "integrationNotes": "Chat supports OpenAI-compatible Chat Completions, Responses, Anthropic Messages and streamed output. Standalone ASR accepts complete audio files. TTS accepts full text over HTTP or incremental text over WebSocket. The app exposes the DeepSeek chat models.",
      "activeModels": {
        "llm": "DeepSeek V4.1 Flash (October 17) [deepseek-flash]\nDeepSeek V4 Pro [deepseek-v4-pro]"
      }
    },
    "sources": [
      {
        "url": "https://api-docs.deepseek.com/",
        "title": "Your First API Call | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "integration",
          "protocols",
          "openai-compatibility"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/quick_start/pricing",
        "title": "Models & Pricing | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "pricing",
          "limits"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/api/list-models",
        "title": "Lists Models | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "catalog"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/api/create-chat-completion",
        "title": "Create Chat Completion | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "protocols",
          "tool-calling",
          "streaming"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/guides/thinking_mode",
        "title": "Thinking Mode | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "limits",
          "tool-calling"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/guides/tool_calls",
        "title": "Tool Calls | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "tool-calling",
          "limits"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/quick_start/rate_limit",
        "title": "Rate Limit | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "limits",
          "protocols",
          "rate-limits"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/faq",
        "title": "FAQ | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "rate-limits",
          "integration"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/guides/anthropic_api",
        "title": "Anthropic API | DeepSeek API Docs",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "integration",
          "protocols"
        ]
      },
      {
        "url": "https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html",
        "title": "DeepSeek Privacy Policy",
        "type": "official",
        "lastUpdated": "2026-02-10",
        "usedFor": [
          "regions",
          "privacy",
          "voice-input-handling"
        ]
      },
      {
        "url": "https://cdn.deepseek.com/policies/en-US/deepseek-open-platform-terms-of-service.html",
        "title": "DeepSeek Open Platform Terms of Service",
        "type": "official",
        "lastUpdated": "2025-01-20",
        "usedFor": [
          "free-tier",
          "developer-terms"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/updates/",
        "title": "DeepSeek API change log",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "models",
          "retirements"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/news/news261113/",
        "title": "DeepSeek application API release",
        "type": "official",
        "lastUpdated": "2026-11-13",
        "usedFor": [
          "integration",
          "speech",
          "web-search"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/guides/asr/",
        "title": "Speech to Text guide",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "languages",
          "limits"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/api/asr/",
        "title": "Speech to Text API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "protocols",
          "speech"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/guides/tts/",
        "title": "Text to Speech guide",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "pricing",
          "languages",
          "voices",
          "limits"
        ]
      },
      {
        "url": "https://api-docs.deepseek.com/api/tts/",
        "title": "Text to Speech API",
        "type": "official",
        "lastUpdated": null,
        "usedFor": [
          "protocols",
          "speech"
        ]
      }
    ]
  },
);

export const providerContext = createProviderContext(providerDefinition);
