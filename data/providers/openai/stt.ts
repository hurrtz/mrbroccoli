import { providerContext } from "./provider";

export const stt = providerContext.defineSttModels([
  providerContext.stt({
    modelId: "gpt-transcribe",
    publicName: "GPT Transcribe",
    aliases: [],
    status: "Documented active/current",
    pricingSummary: "See current official transcription pricing; no estimate pinned here.",
    limitsSummary: "Recorded file uploads are limited to 25 MB.",
    notes: "Recorded transcription uses multipart languages[] hints, not language. Auto-detection omits hints.",
    officialSources: ["https://developers.openai.com/api/docs/guides/speech-to-text", "https://developers.openai.com/api/docs/deprecations"],
    supportsRealtime: false,
    supportsBatch: false,
    priceMeasurements: [],
    constraints: [{ metric: "file_size_bytes", comparator: "<=", value: 25000000, unit: "bytes", scope: "file", sourceText: "Recorded uploads are limited to 25 MB." }],
    languageSupport: null,
  }),
  providerContext.stt(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "stt",
      "modelId": "gpt-4o-mini-transcribe",
      "publicName": "GPT-4o mini Transcribe",
      "aliases": [
        "gpt-4o-mini-transcribe-2025-12-15",
        "gpt-4o-mini-transcribe-2025-03-20"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Estimated transcription cost is $0.003 / minute on the pricing page. The pricing table also shows $1.25 input and $5.00 output token rates.",
      "limitsSummary": "16,000 context tokens; 2,000 max output tokens; audio uploads are limited to 25 MB; supports realtime transcription.",
      "regionSummary": "Project-level data residency applies; verify audio endpoint/model combination in the provider data controls table.",
      "languagesSummary": "Official speech-to-text docs list 57 supported languages for current STT models.",
      "notes": "Recommended default STT picker entry. The 2026-01-13 changelog explicitly recommends gpt-4o-mini-transcribe over gpt-4o-transcribe.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-4o-mini-transcribe",
        "https://developers.openai.com/api/docs/guides/speech-to-text/",
        "https://developers.openai.com/api/docs/pricing/",
        "https://developers.openai.com/api/docs/guides/realtime-transcription/",
        "https://developers.openai.com/api/docs/guides/audio/",
        "https://developers.openai.com/api/docs/changelog/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.003,
          "unit": "minute",
          "sourceText": "Estimated cost $0.003 / minute."
        },
        {
          "amountUsd": 1.25,
          "unit": "million_input_tokens",
          "sourceText": "Input $1.25 / 1M tokens."
        },
        {
          "amountUsd": 5.0,
          "unit": "million_output_tokens",
          "sourceText": "Output $5.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 16000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "16,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 2000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "2,000 max output tokens."
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 25000000,
          "unit": "bytes",
          "scope": "file",
          "sourceText": "File uploads are currently limited to 25 MB."
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 500,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 RPM 500."
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 50000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 TPM 50,000."
        }
      ],
      "languageSupport": {
        "rawText": "Official speech-to-text docs list 57 supported languages for current STT and note the underlying model family was trained on 98 languages.",
        "isMultilingual": true,
        "languageCount": 57,
        "voiceCount": 0,
        "listedLanguages": [
          "Afrikaans",
          "Arabic",
          "Armenian",
          "Azerbaijani",
          "Belarusian",
          "Bosnian",
          "Bulgarian",
          "Catalan",
          "Chinese",
          "Croatian",
          "Czech",
          "Danish",
          "Dutch",
          "English",
          "Estonian",
          "Finnish",
          "French",
          "Galician",
          "German",
          "Greek",
          "Hebrew",
          "Hindi",
          "Hungarian",
          "Icelandic",
          "Indonesian",
          "Italian",
          "Japanese",
          "Kannada",
          "Kazakh",
          "Korean",
          "Latvian",
          "Lithuanian",
          "Macedonian",
          "Malay",
          "Marathi",
          "Maori",
          "Nepali",
          "Norwegian",
          "Persian",
          "Polish",
          "Portuguese",
          "Romanian",
          "Russian",
          "Serbian",
          "Slovak",
          "Slovenian",
          "Spanish",
          "Swahili",
          "Swedish",
          "Tagalog",
          "Tamil",
          "Thai",
          "Turkish",
          "Ukrainian",
          "Urdu",
          "Vietnamese",
          "Welsh"
        ],
        "notes": [
          "multilingual",
          "57-language documented support",
          "recommended over gpt-4o-transcribe"
        ]
      }
    }
  ),
  providerContext.stt(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "stt",
      "modelId": "gpt-4o-transcribe",
      "publicName": "GPT-4o Transcribe",
      "aliases": [
        "gpt-4o-transcribe-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Estimated transcription cost is $0.006 / minute on the pricing page. The model page also shows $2.50 text input, $10.00 text output, and $6.00 audio input token pricing.",
      "limitsSummary": "16,000 context tokens; 2,000 max output tokens; audio uploads are limited to 25 MB; supports realtime transcription.",
      "regionSummary": "Project-level data residency applies; verify audio endpoint/model combination in the provider data controls table.",
      "languagesSummary": "Official speech-to-text docs list 57 supported languages for current STT models.",
      "notes": "Advanced STT alternative. OpenAI's January 13, 2026 changelog recommends gpt-4o-mini-transcribe instead for best results.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-4o-transcribe",
        "https://developers.openai.com/api/docs/guides/speech-to-text/",
        "https://developers.openai.com/api/docs/pricing/",
        "https://developers.openai.com/api/docs/guides/realtime-transcription/",
        "https://developers.openai.com/api/docs/guides/audio/",
        "https://developers.openai.com/api/docs/changelog/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.006,
          "unit": "minute",
          "sourceText": "Estimated cost $0.006 / minute."
        },
        {
          "amountUsd": 2.5,
          "unit": "million_input_tokens",
          "sourceText": "Text input $2.50 / 1M tokens."
        },
        {
          "amountUsd": 10.0,
          "unit": "million_output_tokens",
          "sourceText": "Text output $10.00 / 1M tokens."
        },
        {
          "amountUsd": 6.0,
          "unit": "other",
          "sourceText": "Audio input $6.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 16000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "16,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 2000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "2,000 max output tokens."
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 25000000,
          "unit": "bytes",
          "scope": "file",
          "sourceText": "File uploads are currently limited to 25 MB."
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 500,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 RPM 500."
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 10000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 TPM 10,000."
        }
      ],
      "languageSupport": {
        "rawText": "Official speech-to-text docs list 57 supported languages for current STT and note the underlying model family was trained on 98 languages.",
        "isMultilingual": true,
        "languageCount": 57,
        "voiceCount": 0,
        "listedLanguages": [
          "Afrikaans",
          "Arabic",
          "Armenian",
          "Azerbaijani",
          "Belarusian",
          "Bosnian",
          "Bulgarian",
          "Catalan",
          "Chinese",
          "Croatian",
          "Czech",
          "Danish",
          "Dutch",
          "English",
          "Estonian",
          "Finnish",
          "French",
          "Galician",
          "German",
          "Greek",
          "Hebrew",
          "Hindi",
          "Hungarian",
          "Icelandic",
          "Indonesian",
          "Italian",
          "Japanese",
          "Kannada",
          "Kazakh",
          "Korean",
          "Latvian",
          "Lithuanian",
          "Macedonian",
          "Malay",
          "Marathi",
          "Maori",
          "Nepali",
          "Norwegian",
          "Persian",
          "Polish",
          "Portuguese",
          "Romanian",
          "Russian",
          "Serbian",
          "Slovak",
          "Slovenian",
          "Spanish",
          "Swahili",
          "Swedish",
          "Tagalog",
          "Tamil",
          "Thai",
          "Turkish",
          "Ukrainian",
          "Urdu",
          "Vietnamese",
          "Welsh"
        ],
        "notes": [
          "multilingual",
          "57-language documented support"
        ]
      }
    }
  ),
  providerContext.stt(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "stt",
      "modelId": "gpt-4o-transcribe-diarize",
      "publicName": "GPT-4o Transcribe Diarize",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "The model page shows $2.50 text input, $10.00 text output, and $6.00 audio input token pricing. A separate public estimated per-minute price was not surfaced in the opened pages.",
      "limitsSummary": "16,000 context tokens; 2,000 max output tokens; audio uploads are limited to 25 MB. For files longer than 30 seconds, chunking_strategy is required. Up to four speaker references of 2\u201310 seconds each are documented.",
      "regionSummary": "Project-level data residency applies; verify audio endpoint/model combination in the provider data controls table.",
      "languagesSummary": "Official speech-to-text docs list 57 supported languages for current STT models.",
      "notes": "Expose only behind meeting/interview or multi-speaker workflows. The speech-to-text guide says diarization is not yet supported in the Realtime API.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-4o-transcribe-diarize",
        "https://developers.openai.com/api/docs/guides/speech-to-text/",
        "https://developers.openai.com/api/docs/guides/realtime-transcription/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 2.5,
          "unit": "million_input_tokens",
          "sourceText": "Text input $2.50 / 1M tokens."
        },
        {
          "amountUsd": 10.0,
          "unit": "million_output_tokens",
          "sourceText": "Text output $10.00 / 1M tokens."
        },
        {
          "amountUsd": 6.0,
          "unit": "other",
          "sourceText": "Audio input $6.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 16000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "16,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 2000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "2,000 max output tokens."
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 25000000,
          "unit": "bytes",
          "scope": "file",
          "sourceText": "File uploads are currently limited to 25 MB."
        },
        {
          "metric": "other",
          "comparator": ">",
          "value": 30,
          "unit": "seconds",
          "scope": "audio",
          "sourceText": "For files longer than 30 seconds, you must use chunking_strategy."
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 500,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 RPM 500."
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 10000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 TPM 10,000."
        }
      ],
      "languageSupport": {
        "rawText": "Official speech-to-text docs list 57 supported languages for current STT and note the underlying model family was trained on 98 languages.",
        "isMultilingual": true,
        "languageCount": 57,
        "voiceCount": 0,
        "listedLanguages": [
          "Afrikaans",
          "Arabic",
          "Armenian",
          "Azerbaijani",
          "Belarusian",
          "Bosnian",
          "Bulgarian",
          "Catalan",
          "Chinese",
          "Croatian",
          "Czech",
          "Danish",
          "Dutch",
          "English",
          "Estonian",
          "Finnish",
          "French",
          "Galician",
          "German",
          "Greek",
          "Hebrew",
          "Hindi",
          "Hungarian",
          "Icelandic",
          "Indonesian",
          "Italian",
          "Japanese",
          "Kannada",
          "Kazakh",
          "Korean",
          "Latvian",
          "Lithuanian",
          "Macedonian",
          "Malay",
          "Marathi",
          "Maori",
          "Nepali",
          "Norwegian",
          "Persian",
          "Polish",
          "Portuguese",
          "Romanian",
          "Russian",
          "Serbian",
          "Slovak",
          "Slovenian",
          "Spanish",
          "Swahili",
          "Swedish",
          "Tagalog",
          "Tamil",
          "Thai",
          "Turkish",
          "Ukrainian",
          "Urdu",
          "Vietnamese",
          "Welsh"
        ],
        "notes": [
          "multilingual",
          "57-language documented support",
          "speaker diarization"
        ]
      }
    }
  ),
  providerContext.stt(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "stt",
      "modelId": "whisper-1",
      "publicName": "Whisper",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "The model page surfaces a cost of $0.006 for transcription, but the model page's displayed unit is inconsistent with the main transcription pricing table. Treat Whisper mainly as a compatibility fallback.",
      "limitsSummary": "Speech-to-text guide applies a 25 MB upload limit. The model supports transcription, translation, and language identification; realtime transcription docs also list whisper-1.",
      "regionSummary": "Project-level data residency applies; verify audio endpoint/model combination in the provider data controls table.",
      "languagesSummary": "Official speech-to-text docs list 57 supported languages for current STT. Whisper translation is documented only into English.",
      "notes": "Compatibility fallback and translation option. Use when you explicitly need Whisper behavior or translation-to-English support.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/whisper-1",
        "https://developers.openai.com/api/docs/guides/speech-to-text/",
        "https://developers.openai.com/api/docs/guides/realtime-transcription/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.006,
          "unit": "other",
          "sourceText": "The model page surfaces a cost of $0.006 for transcription."
        }
      ],
      "constraints": [
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 25000000,
          "unit": "bytes",
          "scope": "file",
          "sourceText": "File uploads are currently limited to 25 MB."
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 500,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 RPM 500."
        }
      ],
      "languageSupport": {
        "rawText": "Official speech-to-text docs list 57 supported languages for current STT and note the underlying model family was trained on 98 languages.",
        "isMultilingual": true,
        "languageCount": 57,
        "voiceCount": 0,
        "listedLanguages": [
          "Afrikaans",
          "Arabic",
          "Armenian",
          "Azerbaijani",
          "Belarusian",
          "Bosnian",
          "Bulgarian",
          "Catalan",
          "Chinese",
          "Croatian",
          "Czech",
          "Danish",
          "Dutch",
          "English",
          "Estonian",
          "Finnish",
          "French",
          "Galician",
          "German",
          "Greek",
          "Hebrew",
          "Hindi",
          "Hungarian",
          "Icelandic",
          "Indonesian",
          "Italian",
          "Japanese",
          "Kannada",
          "Kazakh",
          "Korean",
          "Latvian",
          "Lithuanian",
          "Macedonian",
          "Malay",
          "Marathi",
          "Maori",
          "Nepali",
          "Norwegian",
          "Persian",
          "Polish",
          "Portuguese",
          "Romanian",
          "Russian",
          "Serbian",
          "Slovak",
          "Slovenian",
          "Spanish",
          "Swahili",
          "Swedish",
          "Tagalog",
          "Tamil",
          "Thai",
          "Turkish",
          "Ukrainian",
          "Urdu",
          "Vietnamese",
          "Welsh"
        ],
        "notes": [
          "multilingual",
          "57-language documented support",
          "translation endpoint only translates into English"
        ]
      }
    }
  ),
]);
