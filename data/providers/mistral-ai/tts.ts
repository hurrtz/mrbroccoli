import { providerContext } from "./provider";

export const tts = providerContext.defineTtsModels([
  providerContext.tts({
    modelId: "voxtral-mini-tts-3-0",
    publicName: "Voxtral TTS 3",
    status: "Public preview",
    limitsSummary: null,
    notes: "Accepts existing voice IDs and the audio/speech endpoint.",
    officialSources: [
      "https://docs.mistral.ai/models/voxtral-mini-tts-3-0",
      "https://docs.mistral.ai/studio/audio/migrate-from-voxtral-2",
      "https://docs.mistral.ai/studio/audio/specs-and-limits/languages",
    ],
    supportsRealtime: true,
    supportsBatch: null,
    priceMeasurements: [
      {
        amountUsd: 13,
        unit: "million_characters",
        sourceText: "USD 13 per million characters.",
      },
    ],
    constraints: [],
    languageSupport: {
      rawText: "35 languages, 50+ regional dialects.",
      isMultilingual: true,
      languageCount: 35,
      voiceCount: null,
      listedLanguages: [],
      notes: [],
    },
  }),
  providerContext.tts({
    modelId: "voxtral-mini-tts-2603",
    publicName: "Voxtral Mini TTS 26.03",
    aliases: [],
    status: "Documented active/current",
    catalogScope: "Dynamic/non-exhaustive",
    pricingSummary: "$16/M output characters.",
    limitsSummary:
      "Mistral recommends keeping each text prompt below 300 words. Supports saved preset/custom voice IDs or a one-off reference audio clip.",
    regionSummary:
      "Hosted through the Mistral API; workspace deployment and regional-inference policies apply.",
    languagesSummary:
      "9 languages: English, French, Spanish, Portuguese, Italian, Dutch, German, Hindi, and Arabic.",
    notes:
      "POST /v1/audio/speech returns base64 audio_data. Mr Broccoli uses saved preset/custom voice IDs and MP3 output.",
    officialSources: [
      "https://docs.mistral.ai/models/model-cards/voxtral-tts-26-03",
      "https://docs.mistral.ai/studio-api/audio/text_to_speech",
      "https://docs.mistral.ai/studio-api/audio/text_to_speech/speech",
      "https://docs.mistral.ai/api/endpoint/audio/speech",
    ],
    openAiCompatible: false,
    supportsRealtime: true,
    supportsBatch: false,
    priceMeasurements: [
      {
        amountUsd: 16,
        unit: "million_characters",
        sourceText: "Output $16/M Chars",
      },
    ],
    constraints: [
      {
        metric: "other",
        comparator: "<=",
        value: 300,
        unit: "other",
        scope: "recommended request",
        sourceText: "Keep prompts under 300 words for best results.",
      },
    ],
    languageSupport: {
      rawText:
        "English, French, Spanish, Portuguese, Italian, Dutch, German, Hindi, Arabic.",
      isMultilingual: true,
      languageCount: 9,
      voiceCount: null,
      listedLanguages: [
        "English",
        "French",
        "Spanish",
        "Portuguese",
        "Italian",
        "Dutch",
        "German",
        "Hindi",
        "Arabic",
      ],
      notes: ["preset and custom voices are discoverable per account"],
    },
  }),
]);
