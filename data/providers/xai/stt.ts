import { providerContext } from "./provider";

export const stt = providerContext.defineSttModels([
  providerContext.stt(
    {
      "providerId": "xai",
      "providerName": "xAI",
      "service": "stt",
      "modelId": "voice-agent-api",
      "publicName": "Voice Agent API (speech input inside realtime agent)",
      "aliases": [
        "realtime-api"
      ],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "Grok Voice 3.0 charges USD 0.08 per minute of speech-to-speech audio. Text input and server-side tools are billed separately.",
      "limitsSummary": "100 concurrent sessions/team, max session duration 30 minutes. Supports bidirectional audio and text over WebSocket. Audio chunks are base64-encoded.",
      "regionSummary": "Dedicated page lists cluster us-east-1.",
      "languagesSummary": "Live conversational model with multilingual speech input.",
      "notes": "Speech-to-speech sessions use the realtime API. Recorded transcription has a separate REST model.",
      "officialSources": [
        "https://docs.x.ai/developers/pricing",
        "https://docs.x.ai/developers/models/voice-agent-api",
        "https://docs.x.ai/developers/model-capabilities/audio/voice-agent",
        "https://docs.x.ai/developers/rest-api-reference/inference/voice",
        "https://x.ai/api/voice"
      ],
      "openAiCompatible": false,
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.08,
          "unit": "minute",
          "sourceText": "USD 0.08 per minute of speech-to-speech audio"
        }
      ],
      "constraints": [
        {
          "metric": "concurrency",
          "comparator": "=",
          "value": 100,
          "unit": "sessions",
          "scope": "account",
          "sourceText": "Concurrent sessions 100 per team"
        },
        {
          "metric": "session_duration_seconds",
          "comparator": "<=",
          "value": 1800,
          "unit": "seconds",
          "scope": "session",
          "sourceText": "Max session duration 30 minutes"
        }
      ],
      "languageSupport": {
        "rawText": "Multilingual conversational speech input.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 5,
        "listedLanguages": [],
        "notes": [
          "partial STT only",
          "voice-agent mode",
          "not a standalone transcriptions API"
        ]
      }
    }
  ),
  providerContext.stt({
    modelId: "grok-voice-transcribe-2.0",
    publicName: "Grok Voice Transcribe 2.0",
    aliases: ["grok-stt", "grok-voice-transcribe-1.0"],
    status: "Current. The 1.0 model retired October 2, 2026 and requests redirect to 2.0.",
    pricingSummary: "USD 0.10 per hour of recorded audio and USD 0.20 per hour of streaming audio.",
    limitsSummary: "Recorded files can contain up to 500 MB. The file must be the final multipart field.",
    regionSummary: "Hosted at https://api.x.ai.",
    languagesSummary: "At least 38 languages with automatic language detection.",
    notes: "POST /v1/stt accepts a model, an optional language and a file. Streaming uses the separate WebSocket endpoint.",
    officialSources: [
      "https://docs.x.ai/developers/model-capabilities/audio/speech-to-text",
      "https://docs.x.ai/developers/release-notes",
      "https://docs.x.ai/developers/pricing",
    ],
    openAiCompatible: false,
    supportsRealtime: true,
    supportsBatch: true,
    priceMeasurements: [
      { amountUsd: 0.10, unit: "hour", sourceText: "Recorded REST transcription costs USD 0.10 per hour." },
      { amountUsd: 0.20, unit: "hour", sourceText: "Streaming transcription costs USD 0.20 per hour." },
    ],
    constraints: [{
      metric: "file_size_bytes",
      comparator: "<=",
      value: 500_000_000,
      unit: "bytes",
      scope: "recorded file",
      sourceText: "The REST endpoint accepts files up to 500 MB.",
    }],
    languageSupport: {
      rawText: "The published list covers at least 38 languages and supports language changes within a recording.",
      isMultilingual: true,
      languageCount: 38,
      voiceCount: null,
      listedLanguages: [
        "Arabic", "Bosnian", "Bulgarian", "Cantonese", "Catalan", "Chinese (Mandarin)",
        "Croatian", "Czech", "Danish", "Dutch", "English", "Filipino", "Finnish", "French",
        "German", "Greek", "Hindi", "Hungarian", "Indonesian", "Italian", "Japanese", "Korean",
        "Macedonian", "Malay", "Norwegian (Bokmål)", "Persian", "Polish", "Portuguese",
        "Romanian", "Russian", "Slovak", "Spanish", "Swedish", "Thai", "Turkish",
        "Ukrainian", "Urdu", "Vietnamese",
      ],
      notes: ["Speaker diarization", "Word timestamps", "Multichannel input"],
    },
  }),
]);
