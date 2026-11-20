import { providerContext } from "./provider";

export const stt = providerContext.defineSttModels([
  ...[
    {
      modelId: "voxtral-mini-transcribe-3-0",
      publicName: "Voxtral Mini Transcribe 3",
      perMinute: 0.0035,
    },
    {
      modelId: "voxtral-small-transcribe-3-0",
      publicName: "Voxtral Small Transcribe 3",
      perMinute: 0.004,
    },
  ].map(({ modelId, publicName, perMinute }) =>
    providerContext.stt({
      modelId,
      publicName,
      status: "Public preview",
      limitsSummary:
        "Audio transcription accepts files up to 500 MB and 60 minutes.",
      notes:
        "Recorded-file transcription using the multipart audio/transcriptions API.",
      officialSources: [
        `https://docs.mistral.ai/models/${modelId}`,
        "https://docs.mistral.ai/studio/audio/speech-to-text/transcribe-files",
        "https://docs.mistral.ai/resources/known-limitations",
        "https://docs.mistral.ai/studio/audio/specs-and-limits/languages",
      ],
      supportsRealtime: false,
      supportsBatch: null,
      priceMeasurements: [
        {
          amountUsd: perMinute,
          unit: "minute",
          sourceText: `USD ${perMinute} per minute of recorded audio.`,
        },
      ],
      constraints: [
        {
          metric: "file_size_bytes",
          comparator: "<=",
          value: 500_000_000,
          unit: "bytes",
          scope: "audio transcription",
          sourceText: "Maximum audio file size 500 MB.",
        },
        {
          metric: "duration_seconds",
          comparator: "<=",
          value: 3600,
          unit: "seconds",
          scope: "audio transcription",
          sourceText: "Maximum audio duration 60 minutes.",
        },
      ],
      languageSupport: {
        rawText: "53 languages.",
        isMultilingual: true,
        languageCount: 53,
        voiceCount: null,
        listedLanguages: [],
        notes: [],
      },
    }),
  ),
  providerContext.stt(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "stt",
      "modelId": "voxtral-mini-2602",
      "publicName": "Voxtral Mini Transcribe 2",
      "aliases": [
        "voxtral-mini-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.003/min.",
      "limitsSummary": "Official audio overview says up to 3 hours in a single request. Endpoint-specific file-size limit not explicitly documented; general file uploads are capped at 512 MB.",
      "regionSummary": "Cloud API with GDPR/HIPAA-compliant private/on-prem deployment options marketed for the transcription services.",
      "languagesSummary": "13 languages documented.",
      "notes": "Alias is endpoint-scoped: `voxtral-mini-latest` means the chat model on chat endpoints, but the transcription model on `/audio/transcriptions`.",
      "officialSources": [
        "https://docs.mistral.ai/models/voxtral-mini-transcribe-26-02",
        "https://docs.mistral.ai/capabilities/audio_transcription",
        "https://docs.mistral.ai/capabilities/audio_transcription/offline_transcription",
        "https://docs.mistral.ai/getting-started/changelog",
        "https://docs.mistral.ai/api/endpoint/files"
      ],
      "openAiCompatible": false,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.003,
          "unit": "minute",
          "sourceText": "$0.003 /Min"
        }
      ],
      "constraints": [
        {
          "metric": "duration_seconds",
          "comparator": "<=",
          "value": 10800,
          "unit": "seconds",
          "scope": "audio",
          "sourceText": "Processes recordings up to 3 hours in a single request"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 536870912,
          "unit": "bytes",
          "scope": "file",
          "sourceText": "The size of individual files can be a maximum of 512 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Supports transcription in 13 languages, including English, Chinese, Hindi, Spanish, Arabic, French, Portuguese, Russian, German, Japanese, Korean, Italian, and Dutch.",
        "isMultilingual": true,
        "languageCount": 13,
        "voiceCount": 0,
        "listedLanguages": [
          "English",
          "Chinese",
          "Hindi",
          "Spanish",
          "Arabic",
          "French",
          "Portuguese",
          "Russian",
          "German",
          "Japanese",
          "Korean",
          "Italian",
          "Dutch"
        ],
        "notes": [
          "context biasing optimized for English",
          "timestamps",
          "diarization"
        ]
      }
    }
  ),
  providerContext.stt(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "stt",
      "modelId": "voxtral-mini-transcribe-realtime-2602",
      "publicName": "Voxtral Mini Transcribe Realtime",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.006/min.",
      "limitsSummary": "Realtime WebSocket examples use `wss://api.mistral.ai`. Official examples show 10 ms chunk duration and sample-rate choices 8k/16k/22.05k/44.1k/48k, but those appear as SDK example parameters rather than formal universal hard limits. No official session-duration cap found.",
      "regionSummary": "Cloud API with marketed private/on-prem deployment options for transcription services.",
      "languagesSummary": "13 languages documented.",
      "notes": "Use for live STT only. No public TTS/realtime speech synthesis counterpart found.",
      "officialSources": [
        "https://docs.mistral.ai/models/voxtral-mini-transcribe-realtime-26-02",
        "https://docs.mistral.ai/capabilities/audio_transcription",
        "https://docs.mistral.ai/capabilities/audio_transcription/realtime_transcription",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": false,
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.006,
          "unit": "minute",
          "sourceText": "$0.006 /Min"
        }
      ],
      "constraints": [
        {
          "metric": "stream_chunk_bytes",
          "comparator": "~",
          "value": 10,
          "unit": "other",
          "scope": "streaming",
          "sourceText": "Example CLI uses chunk duration 10 ms"
        },
        {
          "metric": "session_duration_seconds",
          "comparator": "~",
          "value": 0,
          "unit": "seconds",
          "scope": "session",
          "sourceText": "Unknown; no official session cap found"
        }
      ],
      "languageSupport": {
        "rawText": "Strong performance in 13 languages.",
        "isMultilingual": true,
        "languageCount": 13,
        "voiceCount": 0,
        "listedLanguages": [
          "English",
          "Chinese",
          "Hindi",
          "Spanish",
          "Arabic",
          "French",
          "Portuguese",
          "Russian",
          "German",
          "Japanese",
          "Korean",
          "Italian",
          "Dutch"
        ],
        "notes": [
          "sub-200ms configurable latency",
          "WebSocket-style realtime flow",
          "sample-rate choices appear in official examples"
        ]
      }
    }
  ),
]);
