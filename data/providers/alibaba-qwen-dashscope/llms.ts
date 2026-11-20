import { modelTokenTerms } from "../definitions";
import { providerContext } from "./provider";

const qwenStudio = "https://www.alibabacloud.com/help/en/model-studio";
const qwenModels = "https://docs.modelstudio.console.alibabacloud.com/en/model-studio";
const qwenText = {
  supportsRealtime: false,
  supportsBatch: null,
  languageSupport: null,
};

function qwenSnapshot({
  modelId, publicName, alias, inputUsd, outputUsd, outputTokens, priceBasis, otherRates, source,
}: {
  modelId: string;
  publicName: string;
  alias: string;
  inputUsd: number;
  outputUsd: number;
  outputTokens: number;
  priceBasis: string;
  otherRates?: string;
  source: string;
}) {
  const terms = modelTokenTerms({
    contextTokens: 1_000_000, outputTokens, inputUsd, outputUsd, priceBasis,
  });
  return providerContext.llm({
    ...qwenText,
    modelId,
    publicName,
    aliases: [alias],
    status: "Documented snapshot",
    ...terms,
    pricingSummary: [terms.pricingSummary, otherRates].filter(Boolean).join(" "),
    notes: `Pinned snapshot for ${alias}. Regional availability and pricing depend on the deployment.`,
    officialSources: [source, `${qwenStudio}/model-pricing`, `${qwenStudio}/text-generation-model`],
  });
}

export const llms = providerContext.defineLlms([
  providerContext.llm({
    ...qwenText,
    modelId: "qwen4-max",
    publicName: "Qwen4-Max",
    status: "Documented active/current",
    ...modelTokenTerms({
      contextTokens: 1_000_000, outputTokens: 262_144, inputUsd: 1.5, outputUsd: 4.5,
      priceBasis: "Singapore International deployment, up to 1 million input tokens",
    }),
    limitsSummary: "1,000,000-token context. With thinking disabled the input limit is 991,808 and output is 131,072. With thinking enabled the input limit is 983,616 and thinking plus output can use up to 262,144 tokens.",
    regionSummary: "The Singapore International rate applies to the default app deployment. Global and Beijing deployments charge USD 1.413 per million input and USD 4.24 per million output tokens.",
    notes: "Accepts text, images and video. Reasoning defaults to high and supports low and extra high. Disable thinking to use the non-reasoning mode.",
    officialSources: [`${qwenModels}/qwen4-max`, `${qwenStudio}/model-pricing`, `${qwenStudio}/text-generation-model`],
  }),
  qwenSnapshot({
    modelId: "qwen3.8-max-0902",
    publicName: "Qwen3.8-Max (0902)",
    alias: "qwen3.8-max",
    inputUsd: 2, outputUsd: 6, outputTokens: 131_072,
    priceBasis: "Singapore International deployment, up to 1 million input tokens",
    otherRates: "Global deployment charges USD 1.65 per million input and USD 4.951 per million output tokens.",
    source: "https://www.alibabacloud.com/en/notice/model_studio_update_notice_for_qwen38max_models_863",
  }),
  providerContext.llm({
    ...qwenText,
    modelId: "qwen3.8-flash",
    publicName: "Qwen3.8-Flash",
    status: "Documented active/current",
    ...modelTokenTerms({
      contextTokens: 1_000_000, outputTokens: 131_072, inputUsd: 0.15, outputUsd: 0.47,
      priceBasis: "Singapore International deployment, up to 1 million input tokens",
    }),
    notes: "Accepts text, images and video. Batch inference is available in Beijing and varies by deployment.",
    officialSources: [`${qwenModels}/qwen3-8-flash`, `${qwenStudio}/model-pricing`, `${qwenStudio}/text-generation-model`],
  }),
  qwenSnapshot({
    modelId: "qwen3.7-flash-2026-07-15",
    publicName: "Qwen3.7-Flash (2026-07-15)",
    alias: "qwen3.7-flash",
    inputUsd: 0.03, outputUsd: 0.13, outputTokens: 131_072,
    priceBasis: "Singapore International deployment, up to 32K input tokens",
    otherRates: "From over 32K through 256K the input and output rates per million tokens are USD 0.10 and 0.40. Above 256K they are USD 0.20 and 0.80.",
    source: `${qwenStudio}/qwen3-7-flash`,
  }),
  qwenSnapshot({
    modelId: "qwen3.7-plus-2026-05-26",
    publicName: "Qwen3.7-Plus (2026-05-26)",
    alias: "qwen3.7-plus",
    inputUsd: 0.4, outputUsd: 1.6, outputTokens: 131_072,
    priceBasis: "Singapore International snapshot, up to 256K input tokens",
    otherRates: "Above 256K the rates are USD 1.20 per million input and USD 4.80 per million output tokens.",
    source: `${qwenStudio}/qwen3-7-plus`,
  }),
  qwenSnapshot({
    modelId: "qwen3.7-max-2026-05-20",
    publicName: "Qwen3.7-Max (2026-05-20)",
    alias: "qwen3.7-max",
    inputUsd: 2.5, outputUsd: 7.5, outputTokens: 131_072,
    priceBasis: "Singapore International deployment, up to 1 million input tokens",
    source: `${qwenModels}/qwen3-7-max`,
  }),
  qwenSnapshot({
    modelId: "qwen3.6-flash-2026-04-16",
    publicName: "Qwen3.6-Flash (2026-04-16)",
    alias: "qwen3.6-flash",
    inputUsd: 0.25, outputUsd: 1.5, outputTokens: 65_536,
    priceBasis: "Singapore International snapshot, up to 256K input tokens",
    otherRates: "Above 256K the rates are USD 1 per million input and USD 4 per million output tokens.",
    source: `${qwenStudio}/qwen3-6-flash`,
  }),
  qwenSnapshot({
    modelId: "qwen3.6-plus-2026-04-02",
    publicName: "Qwen3.6-Plus (2026-04-02)",
    alias: "qwen3.6-plus",
    inputUsd: 0.5, outputUsd: 3, outputTokens: 65_536,
    priceBasis: "Singapore International snapshot, up to 256K input tokens",
    otherRates: "Above 256K the rates are USD 2 per million input and USD 6 per million output tokens.",
    source: `${qwenModels}/qwen3-6-plus`,
  }),
  providerContext.llm(
    {
      "providerId": "alibaba-qwen-dashscope",
      "providerName": "Alibaba / Qwen (DashScope)",
      "service": "llm",
      "modelId": "qwen3.5-plus",
      "publicName": "Qwen3.5-Plus",
      "aliases": [
        "qwen3.5-plus-2026-02-15"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Tiered LLM pricing by request-size bucket; documented minimum global rate starts at $0.115 / 1M input tokens (non-thinking, <=128K) and $0.688 / 1M output tokens.",
      "limitsSummary": "1,000,000 context; max output 65,536; max CoT 81,920; thinking enabled by default.",
      "regionSummary": "Documented in global and Chinese Mainland model tables; region-specific availability differs across docs.",
      "languagesSummary": "General-purpose multilingual multimodal LLM; exact language list not enumerated on the cited pricing rows.",
      "notes": "Good stable picker candidate for balanced premium tier. Canonical stable ID is qwen3.5-plus; snapshot should be hidden.",
      "officialSources": [
        "https://www.alibabacloud.com/help/en/model-studio/models",
        "https://www.alibabacloud.com/help/en/model-studio/rate-limit",
        "https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.115,
          "unit": "million_input_tokens",
          "sourceText": "0<Token\u2264128K non-thinking: $0.115"
        },
        {
          "amountUsd": 0.688,
          "unit": "million_output_tokens",
          "sourceText": "minimum output price shown in models summary for Qwen3.5-Plus family"
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
        },
        {
          "metric": "context_tokens",
          "comparator": "<=",
          "value": 65536,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output 65,536"
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 30000,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "qwen3.5-plus 30,000 RPM"
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 5000000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "qwen3.5-plus 5,000,000 TPM"
        }
      ],
      "languageSupport": {
        "rawText": "General-purpose Qwen LLM; no exact language count on the cited rows.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "multimodal",
          "thinking-enabled-by-default"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "alibaba-qwen-dashscope",
      "providerName": "Alibaba / Qwen (DashScope)",
      "service": "llm",
      "modelId": "qwen-plus",
      "publicName": "Qwen-Plus",
      "aliases": [
        "qwen-plus-latest",
        "qwen-plus-2025-12-01",
        "qwen-plus-0125"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Tiered. Global table shows non-thinking <=128K at $0.115 / 1M input and $0.287 / 1M output; US-specific qwen-plus-us pricing differs.",
      "limitsSummary": "1,000,000 context; max output 32,768; max CoT 81,920.",
      "regionSummary": "Has general/global form and a separate US-specific form qwen-plus-us.",
      "languagesSummary": "General-purpose multilingual LLM; exact language list not enumerated on cited rows.",
      "notes": "Strong stable picker candidate. Hide qwen-plus-latest in normal picker; keep snapshot IDs internal.",
      "officialSources": [
        "https://www.alibabacloud.com/help/en/model-studio/models",
        "https://www.alibabacloud.com/help/en/model-studio/rate-limit",
        "https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 0.115,
          "unit": "million_input_tokens",
          "sourceText": "0<Token\u2264128K non-thinking: $0.115"
        },
        {
          "amountUsd": 0.287,
          "unit": "million_output_tokens",
          "sourceText": "0<Token\u2264128K non-thinking: $0.287"
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
        },
        {
          "metric": "context_tokens",
          "comparator": "<=",
          "value": 32768,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Max output 32,768"
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 30000,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "qwen-plus 30,000 RPM"
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 5000000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "qwen-plus 5,000,000 TPM"
        }
      ],
      "languageSupport": {
        "rawText": "General-purpose Qwen LLM.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "thinking-and-non-thinking"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "alibaba-qwen-dashscope",
      "providerName": "Alibaba / Qwen (DashScope)",
      "service": "llm",
      "modelId": "qwen3.5-flash",
      "publicName": "Qwen3.5-Flash",
      "aliases": [
        "qwen3.5-flash-2026-02-23"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Tiered. <=128K input bucket: $0.029 / 1M input and $0.287 / 1M output; higher buckets increase. Supports context cache and batch calls.",
      "limitsSummary": "1,000,000 context; max output 65,536; max CoT 81,920; thinking enabled by default.",
      "regionSummary": "Documented in global and Chinese Mainland tables.",
      "languagesSummary": "General-purpose multilingual LLM.",
      "notes": "Best low-cost stable picker candidate for text/chat. Snapshot should stay hidden.",
      "officialSources": [
        "https://www.alibabacloud.com/help/en/model-studio/models",
        "https://www.alibabacloud.com/help/en/model-studio/rate-limit"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.029,
          "unit": "million_input_tokens",
          "sourceText": "0<Token\u2264128K: $0.029"
        },
        {
          "amountUsd": 0.287,
          "unit": "million_output_tokens",
          "sourceText": "0<Token\u2264128K: $0.287"
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
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 30000,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "qwen3.5-flash 30,000 RPM"
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 10000000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "qwen3.5-flash 10,000,000 TPM"
        }
      ],
      "languageSupport": {
        "rawText": "General-purpose Qwen LLM.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "cheap-default-candidate",
          "context-cache",
          "batch-supported"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "alibaba-qwen-dashscope",
      "providerName": "Alibaba / Qwen (DashScope)",
      "service": "llm",
      "modelId": "qwen-flash",
      "publicName": "Qwen-Flash",
      "aliases": [
        "qwen-flash-2025-07-28"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Tiered. US-specific qwen-flash-us shows <=256K at $0.05 / 1M input and $0.4 / 1M output. Global qwen-flash pricing differs.",
      "limitsSummary": "1,000,000 context; max output 32,768; max CoT 81,920.",
      "regionSummary": "Region-specific variant qwen-flash-us exists.",
      "languagesSummary": "General-purpose multilingual LLM.",
      "notes": "Reasonable stable picker candidate where you want the Qwen3 commercial flash line rather than qwen3.5-flash. Region handling matters.",
      "officialSources": [
        "https://www.alibabacloud.com/help/en/model-studio/models",
        "https://www.alibabacloud.com/help/en/model-studio/rate-limit",
        "https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": true,
      "priceMeasurements": [
        {
          "amountUsd": 0.05,
          "unit": "million_input_tokens",
          "sourceText": "US qwen-flash-us 0<Token\u2264256K: $0.05"
        },
        {
          "amountUsd": 0.4,
          "unit": "million_output_tokens",
          "sourceText": "US qwen-flash-us 0<Token\u2264256K: $0.4"
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
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 30000,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "qwen-flash 30,000 RPM"
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 10000000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "qwen-flash 10,000,000 TPM"
        }
      ],
      "languageSupport": {
        "rawText": "General-purpose Qwen LLM.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "region-specific-us-variant-exists"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "alibaba-qwen-dashscope",
      "providerName": "Alibaba / Qwen (DashScope)",
      "service": "llm",
      "modelId": "qwen3-max",
      "publicName": "Qwen3-Max",
      "aliases": [
        "qwen3-max-preview",
        "qwen3-max-2026-01-23",
        "qwen3-max-2025-09-23"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Tiered. Hong Kong / Chinese Mainland rows show 0-32K at $1.2 / 1M input and $6 / 1M output; other regional rows show lower minimums for some snapshots.",
      "limitsSummary": "262,144 context; max output 32,768; max CoT 81,920; supports built-in tools on current thinking snapshot.",
      "regionSummary": "Region-sensitive. Hong Kong and Chinese Mainland tables are explicitly documented; OpenAI-compatible list also varies by region.",
      "languagesSummary": "General-purpose flagship LLM.",
      "notes": "Expose qwen3-max, not qwen3-max-preview. Preview ID should not be in a stable picker.",
      "officialSources": [
        "https://www.alibabacloud.com/help/en/model-studio/models",
        "https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope",
        "https://www.alibabacloud.com/help/en/model-studio/rate-limit"
      ],
      "openAiCompatible": true,
      "supportsRealtime": false,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 1.2,
          "unit": "million_input_tokens",
          "sourceText": "0<Token\u226432K: $1.2"
        },
        {
          "amountUsd": 6.0,
          "unit": "million_output_tokens",
          "sourceText": "0<Token\u226432K: $6"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 262144,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 262,144"
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 600,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "EU/Hong Kong qwen3-max 600 RPM"
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 1000000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "EU/Hong Kong qwen3-max 1,000,000 TPM"
        }
      ],
      "languageSupport": {
        "rawText": "Flagship Qwen LLM.",
        "isMultilingual": true,
        "languageCount": 0,
        "voiceCount": 0,
        "listedLanguages": [],
        "notes": [
          "flagship",
          "preview-id-should-be-hidden"
        ]
      }
    }
  ),
  providerContext.llm(
    {
      "providerId": "alibaba-qwen-dashscope",
      "providerName": "Alibaba / Qwen (DashScope)",
      "service": "llm",
      "modelId": "qwen3-omni-flash-realtime",
      "publicName": "Qwen3-Omni-Flash-Realtime",
      "aliases": [
        "qwen3-omni-flash-realtime-2025-12-01",
        "qwen3-omni-flash-realtime-2025-09-15"
      ],
      "status": "Documented active/current",
      "catalogScope": "Dynamic/non-exhaustive",
      "pricingSummary": "Realtime multimodal pricing is modality-dependent; the cited models page gives separate text/audio/image/video token prices for the omni family rather than a single flat token rate.",
      "limitsSummary": "65,536 context; max input 49,152; max output 16,384; single WebSocket session lasts up to 120 minutes.",
      "regionSummary": "WebSocket endpoints documented for Singapore and Beijing; rate-limit page describes US and Chinese Mainland runtime constraints.",
      "languagesSummary": "Supports up to 10 languages; qwen3-omni-flash-realtime-2025-12-01 supports up to 49 voices.",
      "notes": "This is the right realtime voice-chat picker candidate. Do not expose qwen-omni-turbo-realtime in a stable picker.",
      "officialSources": [
        "https://www.alibabacloud.com/help/en/model-studio/realtime",
        "https://www.alibabacloud.com/help/en/model-studio/models",
        "https://www.alibabacloud.com/help/en/model-studio/rate-limit"
      ],
      "openAiCompatible": false,
      "supportsRealtime": true,
      "supportsBatch": false,
      "priceMeasurements": [
        {
          "amountUsd": 8.974,
          "unit": "other",
          "sourceText": "Text+Audio output: $8.974 (audio) per 1M tokens"
        }
      ],
      "constraints": [
        {
          "metric": "context_tokens",
          "comparator": "=",
          "value": 65536,
          "unit": "tokens",
          "scope": "model",
          "sourceText": "Context window 65,536"
        },
        {
          "metric": "session_duration_seconds",
          "comparator": "<=",
          "value": 7200,
          "unit": "seconds",
          "scope": "session",
          "sourceText": "A single WebSocket session lasts up to 120 minutes"
        },
        {
          "metric": "rate_limit_rpm",
          "comparator": "=",
          "value": 60,
          "unit": "requests_per_minute",
          "scope": "account",
          "sourceText": "qwen3-omni-flash-realtime 60 RPM"
        },
        {
          "metric": "rate_limit_tpm",
          "comparator": "=",
          "value": 100000,
          "unit": "tokens_per_minute",
          "scope": "account",
          "sourceText": "qwen3-omni-flash-realtime 100,000 TPM"
        }
      ],
      "languageSupport": {
        "rawText": "Supports up to 10 languages; latest snapshot supports up to 49 voices.",
        "isMultilingual": true,
        "languageCount": 10,
        "voiceCount": 49,
        "listedLanguages": [],
        "notes": [
          "realtime-audio-and-image-input",
          "audio-output-disabled-in-thinking-mode"
        ]
      }
    }
  ),
]);
