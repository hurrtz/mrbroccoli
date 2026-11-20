import { providerContext } from "./provider";

const languages = [
  "Chinese",
  "Cantonese",
  "English",
  "Japanese",
  "Korean",
  "German",
  "French",
  "Spanish",
  "Portuguese",
  "Italian",
  "Russian",
  "Arabic",
  "Hindi",
  "Indonesian",
  "Vietnamese",
  "Thai",
  "Turkish",
  "Malay",
  "Filipino",
  "Polish",
  "Hungarian",
];

export const stt = providerContext.defineSttModels([
  providerContext.stt({
    modelId: "/v1/tools/asr",
    publicName: "DeepSeek Speech to Text",
    status: "Documented active/current",
    pricingSummary:
      "USD 0.116 per audio hour at list price, or USD 0.058 during the current promotion. DeepSeek rounds each recording up to the next whole second.",
    limitsSummary:
      "Up to 120 seconds and 8 MiB per file. WAV with 16-bit PCM and Ogg Opus are supported. Stereo input uses the left channel. The upload deadline is ten minutes.",
    notes:
      "This entry identifies the standalone endpoint. It accepts one multipart file per POST and returns the complete transcript. The request has no model field.",
    officialSources: [
      "https://api-docs.deepseek.com/guides/asr/",
      "https://api-docs.deepseek.com/api/asr/",
      "https://api-docs.deepseek.com/quick_start/pricing/",
    ],
    openAiCompatible: false,
    supportsRealtime: false,
    supportsBatch: true,
    priceMeasurements: [
      {
        amountUsd: 0.116,
        unit: "hour",
        sourceText: "List price per hour of submitted audio.",
      },
      {
        amountUsd: 0.058,
        unit: "hour",
        sourceText: "Limited-time price per hour of submitted audio.",
      },
    ],
    constraints: [
      {
        metric: "file_size_bytes",
        comparator: "<=",
        value: 8 * 1024 * 1024,
        unit: "bytes",
        scope: "file",
        sourceText: "8 MiB upload limit.",
      },
      {
        metric: "duration_seconds",
        comparator: "<=",
        value: 120,
        unit: "seconds",
        scope: "file",
        sourceText: "120 seconds of audio per file.",
      },
      {
        metric: "concurrency",
        comparator: "<=",
        value: 50,
        unit: "count",
        scope: "account",
        sourceText: "50 concurrent ASR requests per account.",
      },
    ],
    languageSupport: {
      rawText: "The recognizer automatically detects the input language.",
      isMultilingual: true,
      languageCount: languages.length,
      voiceCount: null,
      listedLanguages: languages,
      notes: [],
    },
  }),
]);
