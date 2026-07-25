import { createProviderContext, defineProviderDefinition } from "../definitions";

export const providerDefinition = defineProviderDefinition({
  providerId: "elevenlabs",
  providerName: "ElevenLabs",
  categoryName: "Voice AI platform",
  hq: null,
  verifiedSupport: {
    llm: "unsupported",
    stt: "native",
    tts: "native",
  },
  officialSources: [
    "https://elevenlabs.io/docs/overview/models",
    "https://elevenlabs.io/docs/api-reference/authentication",
    "https://elevenlabs.io/docs/api-reference/text-to-speech/convert",
    "https://elevenlabs.io/docs/api-reference/speech-to-text/convert",
    "https://elevenlabs.io/docs/api-reference/voices/search",
    "https://elevenlabs.io/docs/api-reference/models/list",
  ],
  integration: {
    catalogType: "Official docs plus live account voice discovery",
    coverage: "Current flagship TTS models",
    hasDynamicCatalog: true,
    needsLiveDiscovery: true,
    supportsSpeech: true,
    lowConfidence: false,
    openAiCompatible: false,
    protocols: ["rest", "websocket"],
    regionSplitRecommended: false,
  },
  summaries: {
    pricing:
      "Text-to-speech usage is credit based and varies by model and account plan; Mr Broccoli does not estimate provider billing.",
    limits:
      "Current documented per-request limits are 5,000 characters for Eleven v3, 10,000 for Multilingual v2, and 40,000 for Flash v2.5.",
    region:
      "Mr Broccoli uses the standard ElevenLabs API endpoint. Account-specific data residency and zero-retention features depend on the ElevenLabs plan.",
    sttLanguages:
      "Scribe v2 supports automatic transcription across more than 90 languages.",
    ttsLanguages:
      "Eleven v3 supports more than 70 languages; Flash v2.5 supports 32; Multilingual v2 supports 29.",
    freeTier:
      "Plan availability and quotas are account-specific and should be checked in ElevenLabs.",
    integrationNotes:
      "Authenticate with xi-api-key. Transcribe recorded audio through POST /v1/speech-to-text, discover account voices through paginated GET /v2/voices, and synthesize MP3 through POST /v1/text-to-speech/{voice_id}.",
  },
  sources: [
    {
      url: "https://elevenlabs.io/docs/overview/models",
      title: "Models",
      type: "official",
      lastUpdated: null,
      usedFor: ["models", "limits", "languages"],
    },
    {
      url: "https://elevenlabs.io/docs/api-reference/authentication",
      title: "API Authentication",
      type: "official",
      lastUpdated: null,
      usedFor: ["authentication", "integration"],
    },
    {
      url: "https://elevenlabs.io/docs/api-reference/text-to-speech/convert",
      title: "Create speech",
      type: "official",
      lastUpdated: null,
      usedFor: ["tts", "integration"],
    },
    {
      url: "https://elevenlabs.io/docs/api-reference/speech-to-text/convert",
      title: "Create transcript",
      type: "official",
      lastUpdated: null,
      usedFor: ["stt", "limits", "languages", "integration"],
    },
    {
      url: "https://elevenlabs.io/docs/api-reference/voices/search",
      title: "List voices",
      type: "official",
      lastUpdated: null,
      usedFor: ["voices", "pagination", "integration"],
    },
    {
      url: "https://elevenlabs.io/docs/api-reference/models/list",
      title: "List models",
      type: "official",
      lastUpdated: null,
      usedFor: ["models", "catalog"],
    },
  ],
});

export const providerContext = createProviderContext(providerDefinition);
