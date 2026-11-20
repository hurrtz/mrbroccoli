import { providerContext } from "./provider";

export const tts = providerContext.defineTtsModels([
  providerContext.tts({
    modelId: "text-to-speech",
    publicName: "Text to Speech API",
    aliases: [],
    status: "Documented active/current",
    catalogScope: "Mostly exhaustive",
    pricingSummary: "$15.00 / 1M characters.",
    limitsSummary:
      "Unary requests accept up to 60,000 characters. The WebSocket endpoint has no total text limit, caps each text.delta at 60,000 characters, and allows 50 concurrent sessions per team.",
    regionSummary: "Hosted at https://api.x.ai.",
    languagesSummary:
      "20 listed languages or locale variants plus automatic detection. Built-in and user-owned voices are discoverable through the API.",
    notes:
      "POST /v1/tts uses text, voice_id, and language without a model field. Use /v1/tts/voices for live voice discovery.",
    officialSources: [
      "https://docs.x.ai/developers/model-capabilities/audio/text-to-speech",
      "https://docs.x.ai/developers/model-capabilities/audio/voice",
      "https://docs.x.ai/developers/pricing",
    ],
    openAiCompatible: false,
    supportsRealtime: true,
    supportsBatch: true,
    priceMeasurements: [
      {
        amountUsd: 15,
        unit: "million_characters",
        sourceText: "Text to Speech $15.00 / 1M chars.",
      },
    ],
    constraints: [
      {
        metric: "other",
        comparator: "<=",
        value: 60_000,
        unit: "other",
        scope: "unary request",
        sourceText: "Max text length 60,000 characters per request.",
      },
      {
        metric: "concurrency",
        comparator: "=",
        value: 50,
        unit: "sessions",
        scope: "streaming",
        sourceText:
          "The streaming WebSocket endpoint allows 50 concurrent sessions per team.",
      },
    ],
    languageSupport: {
      rawText:
        "Auto-detect, English, Arabic (Egypt), Arabic (Saudi Arabia), Arabic (United Arab Emirates), Bengali, Chinese (Simplified), French, German, Hindi, Indonesian, Italian, Japanese, Korean, Portuguese (Brazil), Portuguese (Portugal), Russian, Spanish (Mexico), Spanish (Spain), Turkish, Vietnamese.",
      isMultilingual: true,
      languageCount: 20,
      voiceCount: null,
      listedLanguages: [
        "en",
        "ar-EG",
        "ar-SA",
        "ar-AE",
        "bn",
        "zh",
        "fr",
        "de",
        "hi",
        "id",
        "it",
        "ja",
        "ko",
        "pt-BR",
        "pt-PT",
        "ru",
        "es-MX",
        "es-ES",
        "tr",
        "vi",
      ],
      notes: [
        "auto-detect supported",
        "live provider-owned voice directory",
        "inline expressive tags supported",
      ],
    },
  }),
]);
