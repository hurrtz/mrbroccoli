import { providerContext } from "./provider";

export const llms = providerContext.defineLlms([
  providerContext.llm(
    {
      "modelId": "grok-4.6",
      "publicName": "Grok 4.6",
      "status": "Documented active/current",
      "pricingSummary": "$2.00 / 1M input tokens, $0.50 / 1M cached input tokens, and $6.00 / 1M output tokens below 200,000 prompt tokens; $4.00, $1.00, and $12.00 respectively once a prompt reaches that threshold, applied to every token in the request.",
      "limitsSummary": "500,000 context window. Supports text and image input, text output, function calling, structured outputs, and reasoning effort low/medium/high/xhigh.",
      "regionSummary": null,
      "languagesSummary": "No official model-specific language matrix is published.",
      "notes": "Current xAI frontier model, released 2026-08-12. Adds an xhigh reasoning effort above Grok 4.5's low/medium/high. Long-context pricing is charged on the whole request once the prompt reaches 200,000 tokens, not only on the tokens past it.",
      "officialSources": [
        "https://docs.x.ai/developers/grok-4-6",
        "https://docs.x.ai/developers/models/grok-4.6"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": null,
      "priceMeasurements": [
        {
          "amountUsd": 2,
          "unit": "million_input_tokens",
          "sourceText": "Input $2.00 / 1M tokens below 200k prompt tokens."
        },
        {
          "amountUsd": 0.5,
          "unit": "million_input_tokens",
          "sourceText": "Cached input $0.50 / 1M tokens below 200k prompt tokens."
        },
        {
          "amountUsd": 6,
          "unit": "million_output_tokens",
          "sourceText": "Output $6.00 / 1M tokens below 200k prompt tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 500000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 500,000 tokens."
        }
      ],
      "languageSupport": {
        "rawText": "No official model-specific language coverage table is published.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": ["multilingual support inferred; official count unknown"]
      }
    }
  ),
  providerContext.llm(
    {
      "modelId": "grok-4.5",
      "publicName": "Grok 4.5",
      "aliases": ["grok-4.5-latest", "grok-build-latest"],
      "status": "Documented active/current",
      "pricingSummary": "$2.00 / 1M input tokens, $0.50 / 1M cached input tokens, and $6.00 / 1M output tokens for short-context requests.",
      "limitsSummary": "500,000 context window. Supports text and image input, text output, Chat Completions, Responses, and reasoning effort low/medium/high.",
      "regionSummary": "Official docs list us-east-1 and us-west-2.",
      "languagesSummary": "No official model-specific language matrix is published.",
      "notes": "Current xAI frontier model. Reasoning defaults to high and cannot be disabled.",
      "officialSources": [
        "https://docs.x.ai/developers/models/grok-4.5",
        "https://docs.x.ai/developers/grok-4-5",
        "https://docs.x.ai/developers/model-capabilities/text/reasoning"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 2,
          "unit": "million_input_tokens",
          "sourceText": "Input tokens $2.00 / 1M tokens."
        },
        {
          "amountUsd": 0.5,
          "unit": "million_input_tokens",
          "sourceText": "Cached tokens $0.50 / 1M tokens."
        },
        {
          "amountUsd": 6,
          "unit": "million_output_tokens",
          "sourceText": "Output tokens $6.00 / 1M tokens."
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 500000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 500,000."
        }
      ],
      "languageSupport": {
        "rawText": "No official model-specific language coverage table is published.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": ["multilingual support inferred; official count unknown"]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "xai",
      "providerName": "xAI",
      "service": "llm",
      "modelId": "grok-4.3",
      "publicName": "Grok 4.3",
      "aliases": [
        "grok-4.3-latest",
        "grok-latest",
        "grok-4",
        "grok-4-latest",
        "grok-4-0709",
        "grok-4-1-fast-reasoning",
        "grok-4-1-fast-non-reasoning",
        "grok-4-fast",
        "grok-4-fast-reasoning",
        "grok-4-fast-non-reasoning",
        "grok-3"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$1.25 / 1M input tokens, $0.20 / 1M cached input tokens, $2.50 / 1M output tokens.",
      "limitsSummary": "1,000,000 context window. Supports text and image input, text output, function calling, structured outputs, streaming, and configurable reasoning effort none/low/medium/high.",
      "regionSummary": "Official docs list us-east-1 and eu-west-1 regional availability.",
      "languagesSummary": "No official model-specific language matrix published; general-purpose multilingual LLM inferred, but no official count published.",
      "notes": "Current flagship xAI picker entry. Official docs name the canonical model grok-4.3 and recommend it for general chat. Retired Grok 3/4 fast and dated slugs are kept only as aliases because xAI redirects them to Grok 4.3.",
      "officialSources": [
        "https://docs.x.ai/developers/models/grok-4.3",
        "https://docs.x.ai/developers/models",
        "https://docs.x.ai/developers/model-capabilities/text/reasoning"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 1.25,
          "unit": "million_input_tokens",
          "sourceText": "Input Tokens $1.25 / 1M tokens"
        },
        {
          "amountUsd": 0.2,
          "unit": "million_input_tokens",
          "sourceText": "Cached tokens $0.20 / 1M tokens"
        },
        {
          "amountUsd": 2.5,
          "unit": "million_output_tokens",
          "sourceText": "Output Tokens $2.50 / 1M tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 1,000,000"
        }
      ],
      "languageSupport": {
        "rawText": "No official model-specific language coverage table found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "inference: general multilingual support likely, but official count unknown"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "xai",
      "providerName": "xAI",
      "service": "llm",
      "modelId": "grok-build-0.1",
      "publicName": "Grok Build 0.1",
      "aliases": [
        "grok-code-fast-1",
        "grok-code-fast",
        "grok-code-fast-1-0825"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$1.00 / 1M input tokens and $2.00 / 1M output tokens.",
      "limitsSummary": "256,000 token context window. Fast coding model trained for agentic coding workflows.",
      "regionSummary": "Use live discovery for exact regional/team availability.",
      "languagesSummary": "No official model-specific language matrix published; coding-focused multilingual behavior is inferred, but no official count published.",
      "notes": "Current xAI coding picker entry. Replaces the retired grok-code-fast-1 slug.",
      "officialSources": [
        "https://docs.x.ai/developers/models/grok-build-0.1",
        "https://docs.x.ai/developers/models",
        "https://docs.x.ai/developers/migration/may-15-retirement"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 1.0,
          "unit": "million_input_tokens",
          "sourceText": "Input$1.00 / 1M tokens"
        },
        {
          "amountUsd": 2.0,
          "unit": "million_output_tokens",
          "sourceText": "Output$2.00 / 1M tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 256000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context 256k tokens"
        }
      ],
      "languageSupport": {
        "rawText": "No official model-specific language coverage table found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "coding-focused",
          "inference: general multilingual support likely, but official count unknown"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "xai",
      "providerName": "xAI",
      "service": "llm",
      "modelId": "grok-4.20-reasoning",
      "publicName": "Grok 4.20 Reasoning",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$2.00 / 1M input tokens, $6.00 / 1M output tokens on the official xAI API site.",
      "limitsSummary": "2,000,000 context window. Batch pricing is 50% off standard token rates. Responses API storage is 30 days by default.",
      "regionSummary": "Public API site presents it as current public API model. Regional availability may vary by team; use global endpoint or live discovery.",
      "languagesSummary": "No official per-language matrix published; general-purpose multilingual LLM inferred, but no official count published.",
      "notes": "Best candidate for a stable premium reasoning picker. Official docs repeatedly use this exact model ID in examples.",
      "officialSources": [
        "https://x.ai/api",
        "https://docs.x.ai/developers/model-capabilities/text/generate-text",
        "https://docs.x.ai/developers/models",
        "https://docs.x.ai/developers/advanced-api-usage/batch-api"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 2.0,
          "unit": "million_input_tokens",
          "sourceText": "Text Input $2.00"
        },
        {
          "amountUsd": 6.0,
          "unit": "million_output_tokens",
          "sourceText": "Output $6.00"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 2000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 2M / 2,000,000"
        }
      ],
      "languageSupport": {
        "rawText": "No official model-specific language coverage table found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "inference: general multilingual support likely, but official count unknown"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "xai",
      "providerName": "xAI",
      "service": "llm",
      "modelId": "grok-4.20-non-reasoning",
      "publicName": "Grok 4.20 Non-Reasoning",
      "aliases": [],
      "status": "Unknown",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$2.00 / 1M input tokens, $6.00 / 1M output tokens on xAI\u2019s official API site.",
      "limitsSummary": "2,000,000 context window on the official API site.",
      "regionSummary": "Appears on the official API site; regional/team availability should be live-discovered.",
      "languagesSummary": "Unknown.",
      "notes": "Publicly shown on xAI\u2019s API marketing page, but I did not find a matching first-party developer model page in docs.x.ai during this audit. Keep behind live discovery rather than a hard-coded stable picker.",
      "officialSources": [
        "https://x.ai/api"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 2.0,
          "unit": "million_input_tokens",
          "sourceText": "Text Input $2.00"
        },
        {
          "amountUsd": 6.0,
          "unit": "million_output_tokens",
          "sourceText": "Output $6.00"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 2000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 2M"
        }
      ],
      "languageSupport": {
        "rawText": "Unknown.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "inference",
          "live-discovery-only recommended"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "xai",
      "providerName": "xAI",
      "service": "llm",
      "modelId": "grok-4.20-multi-agent-0309",
      "publicName": "Grok 4.20 Multi-Agent",
      "aliases": [
        "grok-4.20-multi-agent"
      ],
      "status": "Preview",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "$2.00 / 1M input tokens, $0.20 / 1M cached tokens, $6.00 / 1M output tokens.",
      "limitsSummary": "Official docs expose this as beta/preview-style multi-agent research functionality. Use alias for latest behavior; use dated ID for deterministic pinning.",
      "regionSummary": "Unknown from the evidence retrieved here.",
      "languagesSummary": "Unknown.",
      "notes": "Do not put in a normal mobile model picker unless the app explicitly supports research/agent workflows and citations.",
      "officialSources": [
        "https://docs.x.ai/developers/models/grok-4.20-multi-agent-beta-0309",
        "https://docs.x.ai/developers/model-capabilities/text/multi-agent",
        "https://docs.x.ai/developers/release-notes"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 2.0,
          "unit": "million_input_tokens",
          "sourceText": "Input Tokens $2.00 / 1M tokens"
        },
        {
          "amountUsd": 0.2,
          "unit": "million_input_tokens",
          "sourceText": "Cached tokens $0.20 / 1M tokens"
        },
        {
          "amountUsd": 6.0,
          "unit": "million_output_tokens",
          "sourceText": "Output Tokens $6.00 / 1M tokens"
        }
      ],
      "constraints": [],
      "languageSupport": {
        "rawText": "No official model-specific language table found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "research-oriented",
          "preview/beta semantics"
        ]
      }
    }
  ),
]);
