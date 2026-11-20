import { modelTokenTerms } from "../definitions";
import { providerContext } from "./provider";

export const llms = providerContext.defineLlms([
  ...[
    {
      modelId: "claude-fable-5-2",
      publicName: "Claude Fable 5.2",
      inputUsd: 8,
      outputUsd: 40,
    },
    {
      modelId: "claude-opus-5-5",
      publicName: "Claude Opus 5.5",
      inputUsd: 4,
      outputUsd: 20,
    },
    {
      modelId: "claude-sonnet-5-5",
      publicName: "Claude Sonnet 5.5",
      inputUsd: 2,
      outputUsd: 10,
    },
    {
      modelId: "claude-haiku-5-5",
      publicName: "Claude Haiku 5.5",
      inputUsd: 0.1,
      outputUsd: 0.5,
    },
    {
      modelId: "claude-fable-5-1",
      publicName: "Claude Fable 5.1",
      inputUsd: 10,
      outputUsd: 50,
    },
    {
      modelId: "claude-sonnet-5",
      publicName: "Claude Sonnet 5",
      inputUsd: 2,
      outputUsd: 10,
    },
    {
      modelId: "claude-opus-5",
      publicName: "Claude Opus 5",
      inputUsd: 5,
      outputUsd: 25,
    },
    {
      modelId: "claude-fable-5",
      publicName: "Claude Fable 5",
      inputUsd: 10,
      outputUsd: 50,
    },
  ].map(({ modelId, publicName, inputUsd, outputUsd }) =>
    providerContext.llm({
      modelId,
      publicName,
      ...modelTokenTerms({
        contextTokens: 1_000_000,
        outputTokens: 128_000,
        inputUsd,
        outputUsd,
        ...(modelId === "claude-haiku-5-5"
          ? { priceBasis: "Standard prompts up to 100,000 tokens" }
          : {}),
      }),
      status: "Available on the Claude API",
      notes:
        modelId === "claude-fable-5-2"
          ? "Anthropic retains data for 30 days on this model unless the organization has express authorization for zero retention."
          : "Messages accepts text and image input and produces text. Effort uses output_config.",
      officialSources: [
        `https://platform.claude.com/docs/en/models/${modelId.slice("claude-".length)}/overview`,
        "https://platform.claude.com/docs/en/models/overview",
      ],
      supportsRealtime: false,
      supportsBatch: true,
      languageSupport: null,
    }),
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-opus-4-8",
      "publicName": "Claude Opus 4.8",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$5 / million input tokens, $25 / million output tokens. Batch API is 50% off. Fast mode preview is $10 / million input tokens and $50 / million output tokens.",
      "limitsSummary": "1M context window, 128k max output. Standard request size limit 32 MB. Text streaming via SSE. Batch jobs can take up to 24 hours.",
      "regionSummary": "Global default. US-only inference via inference_geo is documented at 1.1x pricing for Opus 4.6 and newer models.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Latest premium Anthropic picker entry. Supports text+image input, text output, vision, tools/function calling, structured outputs, adaptive thinking, SSE streaming, and Message Batches. Anthropic documents no beta header requirement for the model. No documented native speech input/output.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8",
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/about-claude/models/overview",
        "https://platform.claude.com/docs/en/release-notes/overview",
        "https://platform.claude.com/docs/en/api/openai-sdk"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 5.0,
          "unit": "million_input_tokens",
          "sourceText": "$5 / input MTok"
        },
        {
          "amountUsd": 25.0,
          "unit": "million_output_tokens",
          "sourceText": "$25 / output MTok"
        },
        {
          "amountUsd": 10.0,
          "unit": "million_input_tokens",
          "sourceText": "Fast mode input pricing"
        },
        {
          "amountUsd": 50.0,
          "unit": "million_output_tokens",
          "sourceText": "Fast mode output pricing"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 1M tokens"
        },
        {
          "metric": "other",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output 128k tokens"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-opus-4-7",
      "publicName": "Claude Opus 4.7",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$5 / million input tokens, $25 / million output tokens. Batch API is 50% off.",
      "limitsSummary": "1M context window, 128k max output. Standard request size limit 32 MB. Text streaming via SSE. Batch jobs can take up to 24 hours.",
      "regionSummary": "Global default. US-only inference via inference_geo is documented at 1.1x pricing for Opus 4.6 and newer models.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Latest premium Anthropic picker entry. Supports text+image input, text output, vision, tools/function calling, structured outputs, adaptive thinking, SSE streaming, and Message Batches. Anthropic documents the same tool/platform feature set as Opus 4.6, plus higher-resolution image support. No documented native speech input/output.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/models/overview",
        "https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7",
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/release-notes/overview",
        "https://platform.claude.com/docs/en/api/openai-sdk"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 5.0,
          "unit": "million_input_tokens",
          "sourceText": "$5 / input MTok"
        },
        {
          "amountUsd": 25.0,
          "unit": "million_output_tokens",
          "sourceText": "$25 / output MTok"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 1M tokens"
        },
        {
          "metric": "other",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output 128k tokens"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-opus-4-6",
      "publicName": "Claude Opus 4.6",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$5 / million input tokens, $25 / million output tokens. Batch API is 50% off. Fast mode preview is $30 / million input tokens and $150 / million output tokens.",
      "limitsSummary": "1M context window, 128k max output. Standard request size limit 32 MB. Text streaming via SSE. Batch jobs can take up to 24 hours.",
      "regionSummary": "Global default. US-only inference via inference_geo is documented at 1.1x pricing for Opus 4.6 and newer models.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Previous premium Anthropic picker entry. Active, but superseded by Opus 4.7. Supports text+image input, text output, vision, tools/function calling, structured outputs, extended thinking, SSE streaming, and Message Batches. No documented native speech input/output.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/models/overview",
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/release-notes/overview",
        "https://platform.claude.com/docs/en/api/openai-sdk"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 5.0,
          "unit": "million_input_tokens",
          "sourceText": "$5 / input MTok"
        },
        {
          "amountUsd": 25.0,
          "unit": "million_output_tokens",
          "sourceText": "$25 / output MTok"
        },
        {
          "amountUsd": 30.0,
          "unit": "million_input_tokens",
          "sourceText": "Fast mode input pricing"
        },
        {
          "amountUsd": 150.0,
          "unit": "million_output_tokens",
          "sourceText": "Fast mode output pricing"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 1M tokens"
        },
        {
          "metric": "other",
          "comparator": "=",
          "value": 128000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output 128k tokens"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-sonnet-4-6",
      "publicName": "Claude Sonnet 4.6",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$3 / million input tokens, $15 / million output tokens. Batch API is 50% off.",
      "limitsSummary": "1M context window, 64k max output. Standard request size limit 32 MB. Text streaming via SSE. Batch jobs can take up to 24 hours.",
      "regionSummary": "Global default. US-only inference controls exist at provider level; explicit Sonnet 4.6 pricing text for the 1.1x multiplier is inferred from Anthropic's 'Opus 4.6 and newer models' / 'models released after 2026-02-01' wording.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Best default Anthropic picker entry for most users. Supports text+image input, text output, vision, tools/function calling, structured outputs, extended thinking, SSE streaming, and Message Batches. No documented native speech input/output.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/models/overview",
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/release-notes/overview",
        "https://platform.claude.com/docs/en/api/openai-sdk"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 3.0,
          "unit": "million_input_tokens",
          "sourceText": "$3 / input MTok"
        },
        {
          "amountUsd": 15.0,
          "unit": "million_output_tokens",
          "sourceText": "$15 / output MTok"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 1M tokens"
        },
        {
          "metric": "other",
          "comparator": "=",
          "value": 64000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output 64k tokens"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-haiku-4-5-20251001",
      "publicName": "Claude Haiku 4.5",
      "aliases": [
        "claude-haiku-4-5"
      ],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$1 / million input tokens, $5 / million output tokens. Batch API is 50% off.",
      "limitsSummary": "200k context window, 64k max output. Standard request size limit 32 MB. Text streaming via SSE. Batch jobs can take up to 24 hours.",
      "regionSummary": "Global default. No model-specific US-only multiplier text was separately identified in the source set.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Best cheap/fallback Anthropic picker entry. Supports text+image input, text output, vision, tools/function calling, structured outputs, SSE streaming, and Message Batches. No documented native speech input/output.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/models/overview",
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "https://platform.claude.com/docs/en/api/openai-sdk"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 1.0,
          "unit": "million_input_tokens",
          "sourceText": "$1 / input MTok"
        },
        {
          "amountUsd": 5.0,
          "unit": "million_output_tokens",
          "sourceText": "$5 / output MTok"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 200000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 200k tokens"
        },
        {
          "metric": "other",
          "comparator": "=",
          "value": 64000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output 64k tokens"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-opus-4-5-20251101",
      "publicName": "Claude Opus 4.5",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$5 / million input tokens, $25 / million output tokens. Batch API is 50% off.",
      "limitsSummary": "Standard context guidance for non-1M current models is 200k. Standard request size limit 32 MB. Max output was not explicitly recovered in the source set used here.",
      "regionSummary": "Global default. US-only 1.1x pricing is documented for Opus 4.6 and newer models; no separate Opus 4.5 US-pricing statement was verified.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Active but superseded by Opus 4.6. Reasonable advanced/live-discovery option; not ideal for the default picker. Supports text+image input, text output, tools, vision, streaming, batch, and structured outputs.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
        "https://docs.anthropic.com/en/release-notes/api"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 5.0,
          "unit": "million_input_tokens",
          "sourceText": "$5 / input MTok"
        },
        {
          "amountUsd": 25.0,
          "unit": "million_output_tokens",
          "sourceText": "$25 / output MTok"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 200000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Other Claude models have a 200k token context window"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-opus-4-1-20250805",
      "publicName": "Claude Opus 4.1",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$15 / million input tokens, $75 / million output tokens. Batch API is 50% off.",
      "limitsSummary": "Standard context guidance for non-1M current models is 200k. Standard request size limit 32 MB. Max output was not explicitly recovered in the source set used here.",
      "regionSummary": "Global default. No model-specific US-only multiplier statement was verified in the source set.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Active but clearly superseded. Keep behind advanced/live discovery only. Supports text+image input, text output, tools, vision, streaming, batch, and extended thinking.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "https://docs.anthropic.com/en/docs/build-with-claude/context-windows"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 15.0,
          "unit": "million_input_tokens",
          "sourceText": "$15 / input MTok"
        },
        {
          "amountUsd": 75.0,
          "unit": "million_output_tokens",
          "sourceText": "$75 / output MTok"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 200000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Other Claude models have a 200k token context window"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-opus-4-20250514",
      "publicName": "Claude Opus 4",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$15 / million input tokens, $75 / million output tokens. Batch API is 50% off.",
      "limitsSummary": "Standard context guidance for non-1M current models is 200k. Standard request size limit 32 MB. Max output was not explicitly recovered in the source set used here.",
      "regionSummary": "Global default. No model-specific US-only multiplier statement was verified in the source set.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Active but heavily superseded. Keep behind advanced/live discovery only. Supports text+image input, text output, tools, vision, streaming, batch, and extended thinking.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "https://docs.anthropic.com/en/docs/build-with-claude/context-windows"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 15.0,
          "unit": "million_input_tokens",
          "sourceText": "$15 / input MTok"
        },
        {
          "amountUsd": 75.0,
          "unit": "million_output_tokens",
          "sourceText": "$75 / output MTok"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 200000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Other Claude models have a 200k token context window"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-sonnet-4-5-20250929",
      "publicName": "Claude Sonnet 4.5",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$3 / million input tokens, $15 / million output tokens. Standard pricing applies up to 200k input tokens; 1M context beta uses premium long-context pricing above 200k input tokens ($6 input / $22.50 output). Batch API is 50% off.",
      "limitsSummary": "200k standard context window. 1M context is beta for Tier 4/custom-limit orgs with the context-1m-2025-08-07 header. Standard request size limit 32 MB. Max output was not explicitly recovered in the source set used here.",
      "regionSummary": "Global default. No model-specific US-only multiplier statement was verified in the source set.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Active but superseded by Sonnet 4.6. Good advanced/live-discovery option. Supports text+image input, text output, tools, vision, streaming, batch, structured outputs, and extended thinking.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "https://docs.anthropic.com/en/release-notes/api",
        "https://docs.anthropic.com/en/docs/build-with-claude/context-windows"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 3.0,
          "unit": "million_input_tokens",
          "sourceText": "$3 / input MTok"
        },
        {
          "amountUsd": 15.0,
          "unit": "million_output_tokens",
          "sourceText": "$15 / output MTok"
        },
        {
          "amountUsd": 6.0,
          "unit": "million_input_tokens",
          "sourceText": "Long-context input pricing above 200k input tokens"
        },
        {
          "amountUsd": 22.5,
          "unit": "million_output_tokens",
          "sourceText": "Long-context output pricing above 200k input tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 200000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Standard context window 200k"
        },
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "1M context beta with header for Tier 4/custom-limit orgs"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-sonnet-4-20250514",
      "publicName": "Claude Sonnet 4",
      "aliases": [],
      "status": "Documented active/current",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$3 / million input tokens, $15 / million output tokens. Standard pricing applies up to 200k input tokens; 1M context beta uses premium long-context pricing above 200k input tokens ($6 input / $22.50 output). Batch API is 50% off.",
      "limitsSummary": "200k standard context window. 1M context is beta for Tier 4/custom-limit orgs with the context-1m-2025-08-07 header. Standard request size limit 32 MB. Max output was not explicitly recovered in the source set used here.",
      "regionSummary": "Global default. No model-specific US-only multiplier statement was verified in the source set.",
      "languagesSummary": "Multilingual capability documented; no formal language matrix published.",
      "notes": "Active but superseded by Sonnet 4.5 and 4.6. Keep behind advanced/live discovery only. Supports text+image input, text output, tools, vision, streaming, batch, and extended thinking.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "https://docs.anthropic.com/en/release-notes/api",
        "https://docs.anthropic.com/en/docs/build-with-claude/context-windows"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 3.0,
          "unit": "million_input_tokens",
          "sourceText": "$3 / input MTok"
        },
        {
          "amountUsd": 15.0,
          "unit": "million_output_tokens",
          "sourceText": "$15 / output MTok"
        },
        {
          "amountUsd": 6.0,
          "unit": "million_input_tokens",
          "sourceText": "Long-context input pricing above 200k input tokens"
        },
        {
          "amountUsd": 22.5,
          "unit": "million_output_tokens",
          "sourceText": "Long-context output pricing above 200k input tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 200000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Standard context window 200k"
        },
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 1000000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "1M context beta with header for Tier 4/custom-limit orgs"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "no official exhaustive language matrix",
          "text only; no native speech output"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "anthropic",
      "providerName": "Anthropic",
      "service": "llm",
      "modelId": "claude-3-haiku-20240307",
      "publicName": "Claude 3 Haiku",
      "aliases": [],
      "status": "Deprecated",
      "catalogScope": "Mostly exhaustive",
      "pricingSummary": "$0.25 / million input tokens and $1.25 / million output tokens while still available.",
      "limitsSummary": "Deprecated on 2026-02-19; retirement scheduled for 2026-04-20. Standard context guidance for non-1M current models is 200k. Standard request size limit 32 MB.",
      "regionSummary": "Global default. No model-specific data-residency pricing statement was verified in the source set.",
      "languagesSummary": "Multilingual capability documented at family level; no formal model-specific language matrix published.",
      "notes": "Do not add to a stable picker. Only keep for compatibility if an existing customer explicitly depends on it before retirement. No documented native speech input/output.",
      "officialSources": [
        "https://platform.claude.com/docs/en/about-claude/pricing",
        "https://platform.claude.com/docs/en/about-claude/model-deprecations",
        "https://docs.anthropic.com/en/docs/build-with-claude/context-windows"
      ],
      "openAiCompatible": true,
      "supportsRealtime": true,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.25,
          "unit": "million_input_tokens",
          "sourceText": "$0.25 / input MTok"
        },
        {
          "amountUsd": 1.25,
          "unit": "million_output_tokens",
          "sourceText": "$1.25 / output MTok"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 200000,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Other Claude models have a 200k token context window"
        },
        {
          "metric": "file_size_bytes",
          "comparator": "<=",
          "value": 33554432,
          "unit": "bytes",
          "scope": "general",
          "sourceText": "Standard endpoints 32 MB"
        }
      ],
      "languageSupport": {
        "rawText": "Anthropic documents multilingual capabilities for current Claude models. No official exhaustive API language matrix was found.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "deprecated",
          "text only; no native speech output"
        ]
      }
    }
  ),
]);
