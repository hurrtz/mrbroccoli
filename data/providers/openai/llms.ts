import { modelTokenTerms } from "../definitions";
import { providerContext } from "./provider";

export const llms = providerContext.defineLlms([
  ...[
    {
      modelId: "gpt-6.2-astra",
      publicName: "GPT-6.2 Astra",
      inputUsd: 8,
      outputUsd: 40,
    },
    {
      modelId: "gpt-6.2-sol",
      publicName: "GPT-6.2 Sol",
      inputUsd: 2,
      outputUsd: 10,
    },
    {
      modelId: "gpt-6.1-terra",
      publicName: "GPT-6.1 Terra",
      inputUsd: 1,
      outputUsd: 5,
    },
    {
      modelId: "gpt-6.1-sol",
      publicName: "GPT-6.1 Sol",
      inputUsd: 2,
      outputUsd: 10,
    },
    {
      modelId: "gpt-6-astra",
      publicName: "GPT-6 Astra",
      inputUsd: 10,
      outputUsd: 50,
    },
    {
      modelId: "gpt-6-sol",
      publicName: "GPT-6 Sol",
      inputUsd: 2,
      outputUsd: 10,
    },
    {
      modelId: "gpt-6-luna",
      publicName: "GPT-6 Luna",
      inputUsd: 0.1,
      outputUsd: 0.5,
    },
  ].map(({ modelId, publicName, inputUsd, outputUsd }) =>
    providerContext.llm({
      modelId,
      publicName,
      ...modelTokenTerms({
        contextTokens: 1_050_000,
        outputTokens: 128_000,
        inputUsd,
        outputUsd,
      }),
      status: "Available on the OpenAI API",
      notes:
        "Text and image input, text output. Chat Completions and Responses support streaming.",
      officialSources: [
        `https://developers.openai.com/api/docs/models/${modelId}`,
      ],
      supportsRealtime: false,
      supportsBatch: true,
      languageSupport: null,
    }),
  ),
  providerContext.llm(
    {
      "modelId": "gpt-5.6-sol",
      "publicName": "GPT-5.6 Sol",
      "aliases": ["gpt-5.6"],
      "status": "Documented active/current",
      "limitsSummary": "1,050,000 context tokens; 922,000 max input tokens; 128,000 max output tokens.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list is published.",
      "notes": "Frontier GPT-5.6 tier for complex professional work; supports Chat Completions, Responses, Batch, and streaming.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-5.6-sol",
        "https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6"
      ],
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1050000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window: 1,050,000 tokens."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output: 128,000 tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes the model as multimodal and supports text and image input.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": ["multilingual", "vision-supported"]
      }
    }
  ),
  providerContext.llm(
    {
      "modelId": "gpt-5.6-terra",
      "publicName": "GPT-5.6 Terra",
      "status": "Documented active/current",
      "limitsSummary": "1,050,000 context tokens; 922,000 max input tokens; 128,000 max output tokens.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list is published.",
      "notes": "GPT-5.6 tier balancing intelligence and cost; supports Chat Completions, Responses, Batch, and streaming.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-5.6-terra",
        "https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6"
      ],
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1050000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window: 1,050,000 tokens."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output: 128,000 tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes the model as multimodal and supports text and image input.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": ["multilingual", "vision-supported"]
      }
    }
  ),
  providerContext.llm(
    {
      "modelId": "gpt-5.6-luna",
      "publicName": "GPT-5.6 Luna",
      "status": "Documented active/current",
      "limitsSummary": "1,050,000 context tokens; 922,000 max input tokens; 128,000 max output tokens.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list is published.",
      "notes": "GPT-5.6 tier for efficient, high-volume workloads; supports Chat Completions, Responses, Batch, and streaming.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-5.6-luna",
        "https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6"
      ],
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1050000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window: 1,050,000 tokens."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output: 128,000 tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes the model as multimodal and supports text and image input.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": ["multilingual", "vision-supported"]
      }
    }
  ),
  providerContext.llm(
    {
      "modelId": "gpt-realtime-2.1",
      "publicName": "GPT-Realtime-2.1",
      "status": "Documented active/current",
      "limitsSummary": "128,000 context tokens; 32,000 max output tokens.",
      "languagesSummary": "Realtime text, image, and audio input with text and audio output.",
      "notes": "Current full-size realtime model with configurable reasoning and WebSocket support.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-realtime-2.1",
        "https://developers.openai.com/api/docs/guides/realtime-conversations"
      ],
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window: 128,000 tokens."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 32000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output: 32,000 tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI documents text, audio, and image input with text and audio output.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": ["realtime", "audio-input", "audio-output"]
      }
    }
  ),
  providerContext.llm(
    {
      "modelId": "gpt-realtime-2.1-mini",
      "publicName": "GPT-Realtime-2.1 mini",
      "status": "Documented active/current",
      "limitsSummary": "128,000 context tokens; 32,000 max output tokens.",
      "languagesSummary": "Realtime text, image, and audio input with text and audio output.",
      "notes": "Current lower-latency realtime model with WebSocket support.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini",
        "https://developers.openai.com/api/docs/guides/realtime-conversations"
      ],
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window: 128,000 tokens."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 32000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output: 32,000 tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI documents text, audio, and image input with text and audio output.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": ["realtime", "audio-input", "audio-output"]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-5.5",
      "publicName": "GPT-5.5",
      "aliases": [
        "gpt-5.5-2026-04-23"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$5.00 / 1M input tokens, $30.00 / 1M output tokens, $0.50 / 1M cached input; Batch halves standard pricing. Prompts above 272K input tokens are billed at higher rates for the full session.",
      "limitsSummary": "Pricing docs identify a 272K-token long-context threshold; exact max context and output token limits should be verified from live model metadata when needed.",
      "regionSummary": "Regional processing endpoints are documented with a 10% uplift for GPT-5.5.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list is published on the model page.",
      "notes": "Newest OpenAI frontier model. Canonical stable slug is gpt-5.5; use the snapshot only for explicit pinning.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-5.5",
        "https://developers.openai.com/api/docs/guides/latest-model",
        "https://developers.openai.com/api/docs/pricing/",
        "https://developers.openai.com/api/docs/guides/your-data/",
        "https://developers.openai.com/api/docs/models"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 5.0,
          "unit": "million_input_tokens",
          "sourceText": "Text input $5.00 / 1M tokens."
        },
        {
          "amountUsd": 30.0,
          "unit": "million_output_tokens",
          "sourceText": "Text output $30.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "other",
          "comparator": ">",
          "value": 272000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "For GPT-5.5, prompts with >272K input tokens are priced at 2x input and 1.5x output for the full session."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "vision-supported",
          "no official per-model language list"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-5.4",
      "publicName": "GPT-5.4",
      "aliases": [
        "gpt-5.4-2026-03-05"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$2.50 / 1M input tokens, $15.00 / 1M output tokens, $0.25 / 1M cached input; Batch halves standard pricing. Long-context sessions above 272K input tokens are billed at higher rates for the full session.",
      "limitsSummary": "1,050,000 context tokens; 128,000 max output tokens; long-context surcharge kicks in above 272K input tokens.",
      "regionSummary": "Regional processing endpoints are documented with a 10% uplift for GPT-5.4 family models.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list published on the model page.",
      "notes": "Safe premium default for a stable picker. Canonical stable slug is gpt-5.4; use dated snapshot only for explicit pinning.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-5.4",
        "https://developers.openai.com/api/docs/pricing/",
        "https://openai.com/api/pricing/",
        "https://developers.openai.com/api/docs/guides/your-data/",
        "https://developers.openai.com/api/docs/models"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 2.5,
          "unit": "million_input_tokens",
          "sourceText": "Text input $2.50 / 1M tokens."
        },
        {
          "amountUsd": 15.0,
          "unit": "million_output_tokens",
          "sourceText": "Text output $15.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1050000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "1,050,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "128,000 max output tokens."
        },
        {
          "metric": "other",
          "comparator": ">",
          "value": 272000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "For models with a 1.05M context window (GPT-5.4 and GPT-5.4 pro), prompts with >272K input tokens are priced at 2x input and 1.5x output for the full session."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "vision-supported",
          "no official per-model language list"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-5.4-mini",
      "publicName": "GPT-5.4 mini",
      "aliases": [
        "gpt-5.4-mini-2026-03-17"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.75 / 1M input tokens, $4.50 / 1M output tokens, $0.075 / 1M cached input; Batch halves standard pricing.",
      "limitsSummary": "400,000 context tokens; 128,000 max output tokens.",
      "regionSummary": "Regional processing endpoints are documented with a 10% uplift for GPT-5.4 family models.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list published on the model page.",
      "notes": "Recommended cost/performance default for many mobile chat flows. Canonical stable slug is gpt-5.4-mini.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-5.4-mini",
        "https://developers.openai.com/api/docs/pricing/",
        "https://openai.com/api/pricing/",
        "https://developers.openai.com/api/docs/guides/your-data/",
        "https://developers.openai.com/api/docs/models"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.75,
          "unit": "million_input_tokens",
          "sourceText": "Text input $0.75 / 1M tokens."
        },
        {
          "amountUsd": 4.5,
          "unit": "million_output_tokens",
          "sourceText": "Text output $4.50 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 400000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "400,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "128,000 max output tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "vision-supported",
          "no official per-model language list"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-5.4-nano",
      "publicName": "GPT-5.4 nano",
      "aliases": [
        "gpt-5.4-nano-2026-03-17"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.20 / 1M input tokens, $1.25 / 1M output tokens, $0.02 / 1M cached input; Batch halves standard pricing.",
      "limitsSummary": "400,000 context tokens; 128,000 max output tokens.",
      "regionSummary": "Regional processing endpoints are documented with a 10% uplift for GPT-5.4 family models.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list published on the model page.",
      "notes": "Good cheapest stable text fallback; weaker than mini/flagship models.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-5.4-nano",
        "https://developers.openai.com/api/docs/pricing/",
        "https://openai.com/api/pricing/",
        "https://developers.openai.com/api/docs/guides/your-data/",
        "https://developers.openai.com/api/docs/models"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.2,
          "unit": "million_input_tokens",
          "sourceText": "Text input $0.20 / 1M tokens."
        },
        {
          "amountUsd": 1.25,
          "unit": "million_output_tokens",
          "sourceText": "Text output $1.25 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 400000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "400,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "128,000 max output tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "vision-supported",
          "no official per-model language list"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-5.4-pro",
      "publicName": "GPT-5.4 pro",
      "aliases": [
        "gpt-5.4-pro-2026-03-05"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$30.00 / 1M input tokens and $180.00 / 1M output tokens; Batch pricing is public; long-context sessions above 272K input tokens are billed at higher rates for the full session.",
      "limitsSummary": "1,050,000 context tokens; 128,000 max output tokens; available in Responses API only; some requests can take several minutes.",
      "regionSummary": "Regional processing endpoints are documented with a 10% uplift for GPT-5.4 family models.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list published on the model page.",
      "notes": "Publicly available but not a good default picker entry for a voice-first consumer app because it is expensive, slow, and Responses-only.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-5.4-pro",
        "https://developers.openai.com/api/docs/pricing/",
        "https://openai.com/api/pricing/",
        "https://developers.openai.com/api/docs/guides/your-data/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 30.0,
          "unit": "million_input_tokens",
          "sourceText": "Text input $30.00 / 1M tokens."
        },
        {
          "amountUsd": 180.0,
          "unit": "million_output_tokens",
          "sourceText": "Text output $180.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1050000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "1,050,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "128,000 max output tokens."
        },
        {
          "metric": "other",
          "comparator": ">",
          "value": 272000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "For models with a 1.05M context window (GPT-5.4 and GPT-5.4 pro), prompts with >272K input tokens are priced at 2x input and 1.5x output for the full session."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "vision-supported",
          "Responses-API-first"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-4.1",
      "publicName": "GPT-4.1",
      "aliases": [
        "gpt-4.1-2025-04-14"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$2.00 / 1M input tokens, $8.00 / 1M output tokens, $0.50 / 1M cached input; Batch pricing is public.",
      "limitsSummary": "1,047,576 context tokens; 32,768 max output tokens.",
      "regionSummary": "Regional support is documented in the provider data controls table; verify project/region settings at deployment time.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list published on the model page.",
      "notes": "Good non-reasoning stable picker option if you want a mainstream low-latency text+vision model alongside GPT-5.4.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-4.1",
        "https://developers.openai.com/api/docs/pricing/",
        "https://developers.openai.com/api/docs/models",
        "https://developers.openai.com/api/docs/guides/your-data/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 2.0,
          "unit": "million_input_tokens",
          "sourceText": "Text input $2.00 / 1M tokens."
        },
        {
          "amountUsd": 8.0,
          "unit": "million_output_tokens",
          "sourceText": "Text output $8.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1047576,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "1,047,576 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 32768,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "32,768 max output tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "vision-supported",
          "tool-calling oriented"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-4.1-mini",
      "publicName": "GPT-4.1 mini",
      "aliases": [
        "gpt-4.1-mini-2025-04-14"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.40 / 1M input tokens, $1.60 / 1M output tokens, $0.10 / 1M cached input; Batch pricing is public.",
      "limitsSummary": "1,047,576 context tokens; 32,768 max output tokens.",
      "regionSummary": "Regional support is documented in the provider data controls table; verify project/region settings at deployment time.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list published on the model page.",
      "notes": "Recommended secondary stable picker entry when GPT-5.4-mini is unavailable or you want a non-reasoning alternative.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-4.1-mini",
        "https://developers.openai.com/api/docs/pricing/",
        "https://developers.openai.com/api/docs/models",
        "https://developers.openai.com/api/docs/guides/your-data/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.4,
          "unit": "million_input_tokens",
          "sourceText": "Text input $0.40 / 1M tokens."
        },
        {
          "amountUsd": 1.6,
          "unit": "million_output_tokens",
          "sourceText": "Text output $1.60 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1047576,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "1,047,576 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 32768,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "32,768 max output tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "vision-supported",
          "tool-calling oriented"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-4.1-nano",
      "publicName": "GPT-4.1 nano",
      "aliases": [
        "gpt-4.1-nano-2025-04-14"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.10 / 1M input tokens, $0.40 / 1M output tokens, $0.025 / 1M cached input; Batch pricing is public.",
      "limitsSummary": "1,047,576 context tokens; 32,768 max output tokens.",
      "regionSummary": "Regional support is documented in the provider data controls table; verify project/region settings at deployment time.",
      "languagesSummary": "Multilingual text+vision model; no model-specific language list published on the model page.",
      "notes": "Lowest-cost GPT-4.1 family fallback; include only if your picker needs an ultra-cheap non-reasoning option.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-4.1-nano",
        "https://developers.openai.com/api/docs/pricing/",
        "https://developers.openai.com/api/docs/models",
        "https://developers.openai.com/api/docs/guides/your-data/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.1,
          "unit": "million_input_tokens",
          "sourceText": "Text input $0.10 / 1M tokens."
        },
        {
          "amountUsd": 0.4,
          "unit": "million_output_tokens",
          "sourceText": "Text output $0.40 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1047576,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "1,047,576 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 32768,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "32,768 max output tokens."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "vision-supported",
          "tool-calling oriented"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-realtime-1.5",
      "publicName": "GPT-Realtime-1.5",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Text: $4.00 / 1M input tokens, $16.00 / 1M output tokens. Audio: $32.00 / 1M input tokens, $64.00 / 1M output tokens. Cached input discounts are public.",
      "limitsSummary": "32,000 context tokens; 4,096 max output tokens; Realtime sessions are capped at 60 minutes.",
      "regionSummary": "Use project-level data residency and region-specific endpoints where available; realtime tracing has EU caveats in the data controls guide.",
      "languagesSummary": "Multilingual voice-capable model, but no per-model supported-language list is published on the model page.",
      "notes": "Recommended premium default for true realtime voice. Use Realtime API transports (WebRTC/WebSocket/SIP) rather than chaining STT+LLM+TTS when low latency matters.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-realtime-1.5",
        "https://developers.openai.com/api/docs/pricing/",
        "https://openai.com/api/pricing/",
        "https://developers.openai.com/api/docs/guides/realtime-conversations/",
        "https://developers.openai.com/api/docs/guides/realtime-sip/",
        "https://developers.openai.com/api/docs/guides/audio/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 4.0,
          "unit": "million_input_tokens",
          "sourceText": "Text input $4.00 / 1M tokens."
        },
        {
          "amountUsd": 16.0,
          "unit": "million_output_tokens",
          "sourceText": "Text output $16.00 / 1M tokens."
        },
        {
          "amountUsd": 32.0,
          "unit": "other",
          "sourceText": "Audio input $32.00 / 1M tokens."
        },
        {
          "amountUsd": 64.0,
          "unit": "other",
          "sourceText": "Audio output $64.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 32000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "32,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 4096,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "4,096 max output tokens."
        },
        {
          "metric": "session_duration_seconds",
          "comparator": "<=",
          "value": 3600,
          "unit": "seconds",
          "scope": "session",
          "sourceText": "Realtime sessions can last up to 60 minutes."
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 200,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 RPM 200."
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 40000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 TPM 40,000."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "audio input/output",
          "voice-agent oriented"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-realtime-mini",
      "publicName": "GPT-Realtime-mini",
      "aliases": [
        "gpt-realtime-mini-2025-12-15",
        "gpt-realtime-mini-2025-10-06"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Text: $0.60 / 1M input tokens, $2.40 / 1M output tokens. Audio: $10.00 / 1M input tokens, $20.00 / 1M output tokens. Cached input discounts are public.",
      "limitsSummary": "32,000 context tokens; 4,096 max output tokens; Realtime sessions are capped at 60 minutes.",
      "regionSummary": "Use project-level data residency and region-specific endpoints where available; realtime tracing has EU caveats in the data controls guide.",
      "languagesSummary": "Multilingual voice-capable model, but no per-model supported-language list is published on the model page.",
      "notes": "Recommended cost-sensitive realtime voice fallback. Good stable picker entry for low-latency audio chat.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-realtime-mini",
        "https://developers.openai.com/api/docs/pricing/",
        "https://openai.com/api/pricing/",
        "https://developers.openai.com/api/docs/guides/realtime-conversations/",
        "https://developers.openai.com/api/docs/guides/realtime-sip/",
        "https://developers.openai.com/api/docs/guides/audio/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.6,
          "unit": "million_input_tokens",
          "sourceText": "Text input $0.60 / 1M tokens."
        },
        {
          "amountUsd": 2.4,
          "unit": "million_output_tokens",
          "sourceText": "Text output $2.40 / 1M tokens."
        },
        {
          "amountUsd": 10.0,
          "unit": "other",
          "sourceText": "Audio input $10.00 / 1M tokens."
        },
        {
          "amountUsd": 20.0,
          "unit": "other",
          "sourceText": "Audio output $20.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 32000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "32,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 4096,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "4,096 max output tokens."
        },
        {
          "metric": "session_duration_seconds",
          "comparator": "<=",
          "value": 3600,
          "unit": "seconds",
          "scope": "session",
          "sourceText": "Realtime sessions can last up to 60 minutes."
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 200,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 RPM 200."
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 40000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 TPM 40,000."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "audio input/output",
          "voice-agent oriented"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-audio-1.5",
      "publicName": "GPT-Audio-1.5",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Text: $2.50 / 1M input tokens, $10.00 / 1M output tokens. Audio: $32.00 / 1M input tokens, $64.00 / 1M output tokens.",
      "limitsSummary": "128,000 context tokens; 16,384 max output tokens. Best fit for turn-based audio in/out with Chat Completions rather than live duplex Realtime sessions.",
      "regionSummary": "Use project-level data residency and region-specific endpoints where available.",
      "languagesSummary": "Multilingual audio-capable model, but no per-model supported-language list is published on the model page.",
      "notes": "Recommended premium REST audio-chat model when you do not want a WebRTC/WebSocket Realtime integration.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-audio-1.5",
        "https://developers.openai.com/api/docs/guides/audio/",
        "https://developers.openai.com/api/docs/pricing/",
        "https://openai.com/api/pricing/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
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
          "amountUsd": 32.0,
          "unit": "other",
          "sourceText": "Audio input $32.00 / 1M tokens."
        },
        {
          "amountUsd": 64.0,
          "unit": "other",
          "sourceText": "Audio output $64.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "128,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 16384,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "16,384 max output tokens."
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
          "value": 30000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 TPM 30,000."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "audio input/output",
          "REST turn-based audio chat"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "openai",
      "providerName": "OpenAI",
      "service": "llm",
      "modelId": "gpt-audio-mini",
      "publicName": "GPT-Audio-mini",
      "aliases": [
        "gpt-audio-mini-2025-12-15",
        "gpt-audio-mini-2025-10-06"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Text: $0.60 / 1M input tokens, $2.40 / 1M output tokens. The opened official model page did not surface separate audio-token pricing for the mini variant, so treat audio-token pricing as unknown until re-verified.",
      "limitsSummary": "128,000 context tokens; 16,384 max output tokens.",
      "regionSummary": "Use project-level data residency and region-specific endpoints where available.",
      "languagesSummary": "Multilingual audio-capable model, but no per-model supported-language list is published on the model page.",
      "notes": "Recommended budget REST audio-chat model. Lower-cost alternative to gpt-audio-1.5.",
      "officialSources": [
        "https://developers.openai.com/api/docs/models/gpt-audio-mini",
        "https://developers.openai.com/api/docs/guides/audio/",
        "https://developers.openai.com/api/docs/pricing/"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.6,
          "unit": "million_input_tokens",
          "sourceText": "Text input $0.60 / 1M tokens."
        },
        {
          "amountUsd": 2.4,
          "unit": "million_output_tokens",
          "sourceText": "Text output $2.40 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "128,000 context window."
        },
        {
          "metric": "other",
          "comparator": "<=",
          "value": 16384,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "16,384 max output tokens."
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
          "value": 30000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "Tier 1 TPM 30,000."
        }
      ],
      "languageSupport": {
        "rawText": "OpenAI describes current flagship/latest models as multilingual, but no per-model language list is published on these model pages.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multilingual",
          "audio input/output",
          "REST turn-based audio chat"
        ]
      }
    }
  ),
]);
