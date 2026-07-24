import { providerContext } from "./provider";

const MODEL_SOURCES = [
  "https://elevenlabs.io/docs/overview/models",
  "https://elevenlabs.io/docs/api-reference/text-to-speech/convert",
];

function ttsModel(params: {
  id: string;
  name: string;
  characterLimit: number;
  languageCount: number;
  languageSummary: string;
  notes: string;
}) {
  return providerContext.tts({
    modelId: params.id,
    publicName: params.name,
    aliases: [],
    status: "Documented active/current",
    limitsSummary: `${params.characterLimit.toLocaleString("en-US")} characters per text-to-speech request.`,
    notes: params.notes,
    officialSources: MODEL_SOURCES,
    supportsRealtime: true,
    supportsBatch: false,
    priceMeasurements: [],
    constraints: [
      {
        metric: "other",
        comparator: "<=",
        value: params.characterLimit,
        unit: "other",
        scope: "text-to-speech request",
        sourceText: `${params.name}: ${params.characterLimit.toLocaleString(
          "en-US",
        )} character limit.`,
      },
    ],
    languageSupport: {
      rawText: params.languageSummary,
      isMultilingual: true,
      languageCount: params.languageCount,
      voiceCount: null,
      listedLanguages: [],
      notes: ["Account voices are discovered dynamically through /v2/voices."],
    },
  });
}

export const tts = providerContext.defineTtsModels([
  ttsModel({
    id: "eleven_flash_v2_5",
    name: "Eleven Flash v2.5",
    characterLimit: 40_000,
    languageCount: 32,
    languageSummary: "32 languages.",
    notes:
      "Ultra-low-latency model recommended for interactive applications and voice agents.",
  }),
  ttsModel({
    id: "eleven_multilingual_v2",
    name: "Eleven Multilingual v2",
    characterLimit: 10_000,
    languageCount: 29,
    languageSummary: "29 languages.",
    notes:
      "Stable, high-fidelity multilingual model suited to long-form generations.",
  }),
  ttsModel({
    id: "eleven_v3",
    name: "Eleven v3",
    characterLimit: 5_000,
    languageCount: 70,
    languageSummary: "More than 70 languages.",
    notes:
      "Most expressive model; higher latency and variability make it less suitable for real-time conversation.",
  }),
]);
