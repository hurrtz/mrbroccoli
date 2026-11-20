import { modelTokenTerms } from "../definitions";
import { providerContext } from "./provider";

const mistralText = { supportsRealtime: false, supportsBatch: true, languageSupport: null };

export const llms = providerContext.defineLlms([
  providerContext.llm({
    ...mistralText,
    modelId: "mistral-large-4-0",
    publicName: "Mistral Large 4",
    aliases: ["mistral-large-4"],
    status: "Generally available",
    ...modelTokenTerms({ contextTokens: 1_000_000, inputUsd: 0.7, outputUsd: 2.1 }),
    notes: "Multimodal chat and function calling. Reasoning defaults to high and supports low and medium. Cached input costs USD 0.07 per million tokens.",
    officialSources: [
      "https://docs.mistral.ai/models/mistral-large-4-0",
      "https://docs.mistral.ai/inference/conversations/reasoning",
    ],
  }),
  providerContext.llm({
    ...mistralText,
    modelId: "mistral-medium-3-5",
    publicName: "Mistral Medium 3.5",
    status: "Deprecated October 31, 2026",
    ...modelTokenTerms({
      contextTokens: 256_000, inputUsd: 1.5, outputUsd: 7.5, priceBasis: "Published launch rates",
    }),
    notes: "Mistral identifies Large 4 as the replacement for this saved model.",
    officialSources: [
      "https://docs.mistral.ai/models/mistral-medium-3-5-26-04",
      "https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5/",
    ],
  }),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "mistral-small-2603",
      "publicName": "Mistral Small 4",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.15/M input, $0.60/M output.",
      "limitsSummary": "256k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "Multimodal general model; no per-language list documented.",
      "notes": "Good stable picker candidate for a modern low-cost general model. I did not find an official `-latest` alias mapping for this model.",
      "officialSources": [
        "https://docs.mistral.ai/models/mistral-small-4-0-26-03",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.15,
          "unit": "million_input_tokens",
          "sourceText": "$0.15 /M Tokens"
        },
        {
          "amountUsd": 0.6,
          "unit": "million_output_tokens",
          "sourceText": "$0.6 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multimodal",
          "language list not explicitly enumerated"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "mistral-large-2512",
      "publicName": "Mistral Large 3",
      "aliases": [
        "mistral-large-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.50/M input, $1.50/M output.",
      "limitsSummary": "256k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "Multimodal general model; no per-language list documented.",
      "notes": "Flagship general model. Safe stable picker candidate.",
      "officialSources": [
        "https://docs.mistral.ai/models/mistral-large-3-25-12",
        "https://docs.mistral.ai/api/endpoint/chat",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.5,
          "unit": "million_input_tokens",
          "sourceText": "$0.5 /M Tokens"
        },
        {
          "amountUsd": 1.5,
          "unit": "million_output_tokens",
          "sourceText": "$1.5 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multimodal",
          "language list not explicitly enumerated"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "mistral-medium-2508",
      "publicName": "Mistral Medium 3.1",
      "aliases": [
        "mistral-medium-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.40/M input, $2.00/M output.",
      "limitsSummary": "128k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "Multimodal general model; no per-language list documented.",
      "notes": "Commercial frontier model. Safe stable picker candidate if you want a premium mid/high tier.",
      "officialSources": [
        "https://docs.mistral.ai/models/mistral-medium-3-1-25-08",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.4,
          "unit": "million_input_tokens",
          "sourceText": "$0.4 /M Tokens"
        },
        {
          "amountUsd": 2.0,
          "unit": "million_output_tokens",
          "sourceText": "$2 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 128k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multimodal",
          "language list not explicitly enumerated"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "mistral-small-2506",
      "publicName": "Mistral Small 3.2",
      "aliases": [
        "mistral-small-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.10/M input, $0.30/M output.",
      "limitsSummary": "128k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "General model; no per-language list documented.",
      "notes": "Safe stable picker candidate for value/general use.",
      "officialSources": [
        "https://docs.mistral.ai/models/mistral-small-3-2-25-06",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.1,
          "unit": "million_input_tokens",
          "sourceText": "$0.1 /M Tokens"
        },
        {
          "amountUsd": 0.3,
          "unit": "million_output_tokens",
          "sourceText": "$0.3 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 128k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "language list not explicitly enumerated"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "ministral-14b-2512",
      "publicName": "Ministral 3 14B",
      "aliases": [
        "ministral-14b-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.20/M input, $0.20/M output.",
      "limitsSummary": "256k context documented.",
      "regionSummary": "Cloud API; optimized for local deployment according to model page.",
      "languagesSummary": "Text and vision; no explicit language list documented.",
      "notes": "Reasonable advanced picker option if you want an efficient local/edge-oriented model family.",
      "officialSources": [
        "https://docs.mistral.ai/models/ministral-3-14b-25-12",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.2,
          "unit": "million_input_tokens",
          "sourceText": "$0.2 /M Tokens"
        },
        {
          "amountUsd": 0.2,
          "unit": "million_output_tokens",
          "sourceText": "$0.2 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k"
        }
      ],
      "languageSupport": {
        "rawText": "Best-in-class text and vision capabilities; no language list given.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "edge/local oriented",
          "vision capable"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "ministral-8b-2512",
      "publicName": "Ministral 3 8B",
      "aliases": [
        "ministral-8b-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.15/M input, $0.15/M output.",
      "limitsSummary": "256k context documented.",
      "regionSummary": "Cloud API; built for edge deployment according to model page.",
      "languagesSummary": "Text and vision; no explicit language list documented.",
      "notes": "Advanced picker candidate; often better left to power-user mode.",
      "officialSources": [
        "https://docs.mistral.ai/models/ministral-3-8b-25-12",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/capabilities/structured_output/custom",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.15,
          "unit": "million_input_tokens",
          "sourceText": "$0.15 /M Tokens"
        },
        {
          "amountUsd": 0.15,
          "unit": "million_output_tokens",
          "sourceText": "$0.15 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k"
        }
      ],
      "languageSupport": {
        "rawText": "Best-in-class text and vision capabilities; no language list given.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "edge/local oriented",
          "vision capable"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "ministral-3b-2512",
      "publicName": "Ministral 3 3B",
      "aliases": [
        "ministral-3b-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.10/M input, $0.10/M output.",
      "limitsSummary": "256k context documented.",
      "regionSummary": "Cloud API; compact local/edge model family.",
      "languagesSummary": "Language and vision capabilities; no explicit language list documented.",
      "notes": "Useful for advanced/edge-oriented picker sections, not necessary for a basic consumer picker.",
      "officialSources": [
        "https://docs.mistral.ai/models/ministral-3-3b-25-12",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.1,
          "unit": "million_input_tokens",
          "sourceText": "$0.1 /M Tokens"
        },
        {
          "amountUsd": 0.1,
          "unit": "million_output_tokens",
          "sourceText": "$0.1 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k"
        }
      ],
      "languageSupport": {
        "rawText": "Robust language and vision capabilities; no language list given.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "edge/local oriented",
          "vision capable"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "magistral-medium-2509",
      "publicName": "Magistral Medium 1.2",
      "aliases": [
        "magistral-medium-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$2.00/M input, $5.00/M output.",
      "limitsSummary": "128k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "Reasoning model; no explicit language list documented.",
      "notes": "Reasoning-focused model. Probably too expensive for a default mobile picker.",
      "officialSources": [
        "https://docs.mistral.ai/models/magistral-medium-1-2-25-09",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 2.0,
          "unit": "million_input_tokens",
          "sourceText": "$2 /M Tokens"
        },
        {
          "amountUsd": 5.0,
          "unit": "million_output_tokens",
          "sourceText": "$5 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 128k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "reasoning-focused"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "magistral-small-2509",
      "publicName": "Magistral Small 1.2",
      "aliases": [
        "magistral-small-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Model page documents $0.50/M input; output pricing is on-page but not fully recovered in my snippet, so treat as verify-live before hardcoding.",
      "limitsSummary": "128k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "Reasoning model; no explicit language list documented.",
      "notes": "Reasoning-focused small model. Pricing should be re-verified live before hardcoding full output price because my retrieved snippet was truncated.",
      "officialSources": [
        "https://docs.mistral.ai/models/magistral-small-1-2-25-09",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.5,
          "unit": "million_input_tokens",
          "sourceText": "$0.5 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 128k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "reasoning-focused",
          "pricing snippet incomplete in retrieved lines"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "devstral-2512",
      "publicName": "Devstral 2",
      "aliases": [
        "devstral-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.40/M input, $2.00/M output.",
      "limitsSummary": "256k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "Coding/agentic model; no explicit language list documented.",
      "notes": "Specialist code-agent model. Keep out of a mainstream voice-chat picker unless the app explicitly supports coding modes.",
      "officialSources": [
        "https://docs.mistral.ai/models/devstral-2-25-12",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.4,
          "unit": "million_input_tokens",
          "sourceText": "$0.4 /M Tokens"
        },
        {
          "amountUsd": 2.0,
          "unit": "million_output_tokens",
          "sourceText": "$2 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "code-agent specialist"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "labs-devstral-small-2512",
      "publicName": "Devstral Small 2",
      "aliases": [
        "devstral-small-latest"
      ],
      "status": "Preview",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.10/M input, $0.30/M output.",
      "limitsSummary": "256k context documented.",
      "regionSummary": "Cloud API; Labs/open source specialist.",
      "languagesSummary": "Coding/agentic model; no explicit language list documented.",
      "notes": "Labs model. Not suitable for a default stable picker.",
      "officialSources": [
        "https://docs.mistral.ai/models/devstral-small-2-25-12",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.1,
          "unit": "million_input_tokens",
          "sourceText": "$0.1 /M Tokens"
        },
        {
          "amountUsd": 0.3,
          "unit": "million_output_tokens",
          "sourceText": "$0.3 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "labs",
          "code-agent specialist"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "devstral-medium-2507",
      "publicName": "Devstral Medium 1.0",
      "aliases": [
        "devstral-medium-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.40/M input, $2.00/M output.",
      "limitsSummary": "128k context documented.",
      "regionSummary": "Cloud API; enterprise-grade SWE-focused model.",
      "languagesSummary": "Coding/agentic model; no explicit language list documented.",
      "notes": "Specialist coding model. Keep behind advanced settings.",
      "officialSources": [
        "https://docs.mistral.ai/models/devstral-medium-1-0-25-07",
        "https://docs.mistral.ai/capabilities/code_generation",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.4,
          "unit": "million_input_tokens",
          "sourceText": "$0.4 /M Tokens"
        },
        {
          "amountUsd": 2.0,
          "unit": "million_output_tokens",
          "sourceText": "$2 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 128k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list on the model page.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "code-agent specialist"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "codestral-2508",
      "publicName": "Codestral",
      "aliases": [
        "codestral-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.30/M input, $0.90/M output.",
      "limitsSummary": "128k context documented.",
      "regionSummary": "Cloud API; code-focused.",
      "languagesSummary": "Code-completion/code-generation specialist.",
      "notes": "Specialist coding model. Not for a normal voice-chat picker.",
      "officialSources": [
        "https://docs.mistral.ai/models/codestral-25-08",
        "https://docs.mistral.ai/capabilities/code_generation",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.3,
          "unit": "million_input_tokens",
          "sourceText": "$0.3 /M Tokens"
        },
        {
          "amountUsd": 0.9,
          "unit": "million_output_tokens",
          "sourceText": "$0.9 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 128k"
        }
      ],
      "languageSupport": {
        "rawText": "Code specialist; no natural-language coverage table documented.",
        "isMultilingual": false,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "code specialist",
          "FIM support"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "voxtral-small-2507",
      "publicName": "Voxtral Small",
      "aliases": [
        "voxtral-small-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.004/min audio, $0.10/M input tokens, $0.30/M output tokens.",
      "limitsSummary": "32k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "Audio-input chat model; official transcription family claims strong 13-language multilingual performance, but the model page itself does not provide a standalone language matrix.",
      "notes": "Useful only if your app supports audio-input chat prompts. Not TTS.",
      "officialSources": [
        "https://docs.mistral.ai/models/voxtral-small-25-07",
        "https://docs.mistral.ai/capabilities/audio_transcription/offline_transcription",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.004,
          "unit": "minute",
          "sourceText": "$0.004 /Min"
        },
        {
          "amountUsd": 0.1,
          "unit": "million_input_tokens",
          "sourceText": "$0.1 /M Tokens"
        },
        {
          "amountUsd": 0.3,
          "unit": "million_output_tokens",
          "sourceText": "$0.3 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 32000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 32k"
        }
      ],
      "languageSupport": {
        "rawText": "Official audio docs describe 13-language support for Voxtral transcription services; the chat-model page itself does not enumerate a separate list.",
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
          "audio-input",
          "not TTS",
          "language list inferred from official Voxtral audio docs"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "voxtral-mini-2507",
      "publicName": "Voxtral Mini",
      "aliases": [
        "voxtral-mini-latest"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.001/min audio, $0.04/M input tokens, $0.04/M output tokens.",
      "limitsSummary": "32k context documented.",
      "regionSummary": "Cloud API; no model-specific region split documented.",
      "languagesSummary": "Audio-input chat model. Official audio docs describe 13-language support for Voxtral transcription family; chat-model page does not publish a separate matrix.",
      "notes": "The alias `voxtral-mini-latest` is endpoint-scoped: official docs say chat maps to `voxtral-mini-2507`, but `/audio/transcriptions` maps the same alias to `voxtral-mini-2602`.",
      "officialSources": [
        "https://docs.mistral.ai/models/voxtral-mini-25-07",
        "https://docs.mistral.ai/capabilities/audio_transcription/offline_transcription",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.001,
          "unit": "minute",
          "sourceText": "$0.001 /Min"
        },
        {
          "amountUsd": 0.04,
          "unit": "million_input_tokens",
          "sourceText": "$0.04 /M Tokens"
        },
        {
          "amountUsd": 0.04,
          "unit": "million_output_tokens",
          "sourceText": "$0.04 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 32000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 32k"
        }
      ],
      "languageSupport": {
        "rawText": "Official audio docs describe 13-language support for Voxtral transcription services; the chat-model page itself does not enumerate a separate list.",
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
          "audio-input",
          "not TTS",
          "alias is endpoint-scoped"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "labs-mistral-small-creative",
      "publicName": "Mistral Small Creative",
      "aliases": [],
      "status": "Preview",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$0.10/M input, $0.30/M output.",
      "limitsSummary": "32k context documented.",
      "regionSummary": "Cloud API; Labs model.",
      "languagesSummary": "Creative writing/roleplay specialized; no explicit language list documented.",
      "notes": "Labs/experimental. Do not expose in a default stable picker.",
      "officialSources": [
        "https://docs.mistral.ai/models/mistral-small-creative-25-12",
        "https://docs.mistral.ai/capabilities/function_calling",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.1,
          "unit": "million_input_tokens",
          "sourceText": "$0.1 /M Tokens"
        },
        {
          "amountUsd": 0.3,
          "unit": "million_output_tokens",
          "sourceText": "$0.3 /M Tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 32000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 32k"
        }
      ],
      "languageSupport": {
        "rawText": "No explicit language list documented.",
        "isMultilingual": false,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "labs",
          "creative specialist"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "mistral-ai",
      "providerName": "Mistral AI",
      "service": "llm",
      "modelId": "labs-leanstral-2603",
      "publicName": "Leanstral",
      "aliases": [],
      "status": "Preview",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Model page shows $0.",
      "limitsSummary": "256k context documented.",
      "regionSummary": "Cloud API; Labs/open-source specialist.",
      "languagesSummary": "Lean 4 formal proof engineering specialist, not a general voice-chat model.",
      "notes": "Strongly unsuitable for a normal consumer app picker.",
      "officialSources": [
        "https://docs.mistral.ai/models/leanstral-26-03",
        "https://docs.mistral.ai/getting-started/changelog"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.0,
          "unit": "other",
          "sourceText": "$0"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k"
        }
      ],
      "languageSupport": {
        "rawText": "Specialized for Lean 4 formal proof engineering.",
        "isMultilingual": false,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "labs",
          "niche specialist"
        ]
      }
    }
  ),
]);
