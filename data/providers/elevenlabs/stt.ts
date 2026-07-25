import { providerContext } from "./provider";

export const stt = providerContext.defineSttModels([
  providerContext.stt({
    modelId: "scribe_v2",
    publicName: "Scribe v2",
    aliases: [],
    status: "Documented active/current",
    limitsSummary:
      "Recorded audio and video files up to 3 GB and 10 hours are supported.",
    notes:
      "Current batch transcription model used by Mr Broccoli for recorded speech-to-text. Language detection is automatic.",
    officialSources: [
      "https://elevenlabs.io/docs/overview/models",
      "https://elevenlabs.io/docs/overview/capabilities/speech-to-text",
      "https://elevenlabs.io/docs/api-reference/speech-to-text/convert",
    ],
    supportsRealtime: false,
    supportsBatch: false,
    priceMeasurements: [],
    constraints: [
      {
        metric: "file_size_bytes",
        comparator: "<=",
        value: 3_000_000_000,
        unit: "bytes",
        scope: "file",
        sourceText: "Files up to 3 GB in size are supported.",
      },
      {
        metric: "duration_seconds",
        comparator: "<=",
        value: 36_000,
        unit: "seconds",
        scope: "recording",
        sourceText: "Standard transcription supports recordings up to 10 hours.",
      },
    ],
    languageSupport: {
      rawText:
        "Scribe v2 supports accurate transcription with automatic language detection across more than 90 languages.",
      isMultilingual: true,
      languageCount: 90,
      voiceCount: 0,
      listedLanguages: [],
      notes: [
        "90+ languages",
        "automatic language detection",
        "word-level timestamps",
      ],
    },
  }),
]);
