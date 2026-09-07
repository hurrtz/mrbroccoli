import { providerContext } from "./provider";

export const stt = providerContext.defineSttModels([
  providerContext.stt({
    modelId: "gemini-3.5-transcribe",
    publicName: "Gemini 3.5 Transcribe",
    aliases: [],
    status: "Documented active/current",
    pricingSummary: "See current official transcription pricing; no estimate pinned here.",
    limitsSummary: "The app limits raw inline audio to 14 MB to keep base64 plus JSON below the 20 MB request ceiling.",
    notes: "AI Studio Interactions recorded transcription; verbatim mode and optional BCP-47 language hints. No Files API resource is created.",
    officialSources: ["https://ai.google.dev/gemini-api/docs/transcribe", "https://ai.google.dev/gemini-api/docs/audio", "https://ai.google.dev/api/interactions-api"],
    supportsRealtime: false,
    supportsBatch: false,
    priceMeasurements: [],
    constraints: [{ metric: "file_size_bytes", comparator: "<=", value: 14000000, unit: "bytes", scope: "file", sourceText: "App conservative raw-audio ceiling for Google's 20 MB total inline request limit including base64 and JSON." }],
    languageSupport: null,
  }),
  providerContext.stt(
    {
      "providerId": "google-vertex-ai-studio",
      "providerName": "Google Vertex AI Studio",
      "service": "stt",
      "modelId": "chirp_3",
      "publicName": "Chirp 3: Transcription",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "Uses Cloud STT minute-based pricing; standard recognition tier is $0.016/min up to 500k min/month, with lower volume tiers and $0.003/min dynamic batch for standard V2 models.",
      "limitsSummary": "General STT API limits apply: synchronous 10 MB or 1 minute; streaming 25 KB/request chunk and 5-minute streams; asynchronous up to 480 minutes.",
      "regionSummary": "Available region- and language-dependent in Cloud STT V2; data residency is documented for regionalized service including Belgium and Singapore.",
      "languagesSummary": "Google marketing describes Chirp 3 as supporting 85+ languages and variants; supported-languages table is region/language specific.",
      "notes": "Best stable multilingual STT picker entry. Not a Vertex LLM model; canonical API surface is Cloud Speech-to-Text.",
      "officialSources": [
        "https://docs.cloud.google.com/speech-to-text/docs/transcription-model",
        "https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages",
        "https://cloud.google.com/speech-to-text/pricing",
        "https://docs.cloud.google.com/speech-to-text/docs/quotas",
        "https://cloud.google.com/speech-to-text"
      ],
      "openAiCompatible": false,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.016,
          "unit": "minute",
          "sourceText": "Standard recognition: $0.016 / 1 minute up to 500,000 minutes"
        },
        {
          "amountUsd": 0.003,
          "unit": "minute",
          "sourceText": "Standard dynamic batch recognition: $0.003 / 1 minute"
        }
      ],
      "constraints": [
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 10485760,
          "unit": "bytes",
          "scope": "file",
          "sourceText": "Synchronous requests are limited to 10 MB"
        },
        {
          "metric": "duration_seconds",
          "comparator": "<=",
          "value": 60,
          "unit": "seconds",
          "scope": "audio",
          "sourceText": "Synchronous requests are limited to 1 minute"
        },
        {
          "metric": "stream_chunk_bytes",
          "comparator": "<=",
          "value": 25600,
          "unit": "bytes",
          "scope": "streaming",
          "sourceText": "Each request in the stream is limited to 25 KB of audio"
        },
        {
          "metric": "session_duration_seconds",
          "comparator": "<=",
          "value": 300,
          "unit": "seconds",
          "scope": "streaming",
          "sourceText": "A stream can remain open for up to 5 minutes"
        }
      ],
      "languageSupport": {
        "rawText": "Chirp 3 marketing states 85+ languages and variants; supported-languages table is extensive and region-specific.",
        "isMultilingual": true,
        "languageCount": 85,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "model-dependent",
          "region-dependent"
        ]
      }
    }
  ),
  providerContext.stt(
    {
      "providerId": "google-vertex-ai-studio",
      "providerName": "Google Vertex AI Studio",
      "service": "stt",
      "modelId": "chirp_2",
      "publicName": "Chirp 2: Transcription",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "Cloud STT minute-based pricing; no separate public price line captured for Chirp 2 versus standard model families in current pricing snippet.",
      "limitsSummary": "Cloud STT general synchronous/async/streaming limits apply.",
      "regionSummary": "Region- and language-dependent in Cloud STT V2.",
      "languagesSummary": "Multilingual transcription/translation model according to model comparison page.",
      "notes": "Documented and public, but older than Chirp 3 for general multilingual app usage.",
      "officialSources": [
        "https://docs.cloud.google.com/speech-to-text/docs/transcription-model",
        "https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages",
        "https://docs.cloud.google.com/speech-to-text/docs/quotas"
      ],
      "openAiCompatible": false,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [],
      "constraints": [
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 10485760,
          "unit": "bytes",
          "scope": "file",
          "sourceText": "Synchronous requests are limited to 10 MB"
        },
        {
          "metric": "duration_seconds",
          "comparator": "<=",
          "value": 60,
          "unit": "seconds",
          "scope": "audio",
          "sourceText": "Synchronous requests are limited to 1 minute"
        },
        {
          "metric": "stream_chunk_bytes",
          "comparator": "<=",
          "value": 25600,
          "unit": "bytes",
          "scope": "streaming",
          "sourceText": "Each request in the stream is limited to 25 KB of audio"
        },
        {
          "metric": "session_duration_seconds",
          "comparator": "<=",
          "value": 300,
          "unit": "seconds",
          "scope": "streaming",
          "sourceText": "A stream can remain open for up to 5 minutes"
        }
      ],
      "languageSupport": {
        "rawText": "Chirp 2 is documented as a multilingual USM-based transcription and translation model.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "older-than-chirp-3",
          "translation-capable"
        ]
      }
    }
  ),
  providerContext.stt(
    {
      "providerId": "google-vertex-ai-studio",
      "providerName": "Google Vertex AI Studio",
      "service": "stt",
      "modelId": "telephony",
      "publicName": "Telephony",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "Cloud STT minute-based pricing; exposed as a model class rather than a separate price row in the captured pricing snippet.",
      "limitsSummary": "Cloud STT general synchronous/async/streaming limits apply.",
      "regionSummary": "Cloud STT model selection, not a Vertex model catalog item.",
      "languagesSummary": "Telephony-specialized, 8 kHz phone-call audio use cases.",
      "notes": "Useful for call-center / PSTN audio, not a default voice-chat picker entry.",
      "officialSources": [
        "https://docs.cloud.google.com/speech-to-text/docs/transcription-model",
        "https://docs.cloud.google.com/speech-to-text/docs/quotas"
      ],
      "openAiCompatible": false,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [],
      "constraints": [
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 10485760,
          "unit": "bytes",
          "scope": "file",
          "sourceText": "Synchronous requests are limited to 10 MB"
        },
        {
          "metric": "duration_seconds",
          "comparator": "<=",
          "value": 60,
          "unit": "seconds",
          "scope": "audio",
          "sourceText": "Synchronous requests are limited to 1 minute"
        }
      ],
      "languageSupport": {
        "rawText": "Telephony model is tuned for phone-call audio rather than broad language marketing.",
        "isMultilingual": false,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "telephony-optimized",
          "8khz-oriented"
        ]
      }
    }
  ),
]);
