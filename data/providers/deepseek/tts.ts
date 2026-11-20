import { providerContext } from "./provider";

const languages = [
  "Mandarin Chinese",
  "Cantonese",
  "English",
  "Japanese",
  "Korean",
  "Malay",
  "Arabic",
  "Indonesian",
  "Thai",
  "Vietnamese",
];

export const tts = providerContext.defineTtsModels([
  providerContext.tts({
    modelId: "/v1/tools/tts",
    publicName: "DeepSeek Text to Speech",
    status: "Documented active/current",
    pricingSummary:
      "USD 0.45 per 10,000 billed characters at list price, or USD 0.225 during the current promotion. Chinese characters count twice.",
    limitsSummary:
      "Up to 10,000 billed characters and 64 KiB of text per session, with a 30-minute limit. The full-text HTTP request body also has a 64 KiB cap.",
    notes:
      "This entry identifies the standalone endpoint. HTTP accepts complete text and streams WAV or PCM. WebSocket accepts incremental text and streams PCM or Opus. Both accept a voice ID with Stella as the default and Tide as the alternative. Neither takes a model field.",
    officialSources: [
      "https://api-docs.deepseek.com/guides/tts/",
      "https://api-docs.deepseek.com/api/tts/",
      "https://api-docs.deepseek.com/quick_start/pricing/",
    ],
    openAiCompatible: false,
    supportsRealtime: true,
    supportsBatch: true,
    priceMeasurements: [
      {
        amountUsd: 45,
        unit: "million_characters",
        sourceText: "List price of USD 0.45 per 10,000 billed characters.",
      },
      {
        amountUsd: 22.5,
        unit: "million_characters",
        sourceText:
          "Limited-time price of USD 0.225 per 10,000 billed characters.",
      },
    ],
    constraints: [
      {
        metric: "other",
        comparator: "<=",
        value: 10_000,
        unit: "count",
        scope: "billed characters per request or session",
        sourceText: "10,000 billed characters.",
      },
      {
        metric: "session_duration_seconds",
        comparator: "<=",
        value: 1800,
        unit: "seconds",
        scope: "websocket",
        sourceText: "30 minutes per WebSocket session.",
      },
      {
        metric: "concurrency",
        comparator: "<=",
        value: 50,
        unit: "count",
        scope: "account",
        sourceText: "50 concurrent TTS requests per account.",
      },
    ],
    languageSupport: {
      rawText: "DeepSeek detects the language of each input text.",
      isMultilingual: true,
      languageCount: languages.length,
      voiceCount: 2,
      listedLanguages: languages,
      notes: ["Voice IDs: stella and tide."],
    },
  }),
]);
