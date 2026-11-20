import { providerContext } from "./provider";

const pricing = "https://api-docs.deepseek.com/quick_start/pricing/";
const changes = "https://api-docs.deepseek.com/updates/";

function tokenPrices(input: number, cachedInput: number, output: number) {
  const rates = [
    { unit: "million_input_tokens", label: "cache-miss input", peak: input },
    { unit: "million_input_tokens", label: "cached input", peak: cachedInput },
    { unit: "million_output_tokens", label: "output", peak: output },
  ] as const;
  return rates.flatMap(({ unit, label, peak }) => [
    {
      unit,
      amountUsd: peak,
      sourceText: `Peak price per million ${label} tokens.`,
    },
    {
      unit,
      amountUsd: peak / 2,
      sourceText: `Off-peak price per million ${label} tokens.`,
    },
  ]);
}

const currentModels = [
  {
    modelId: "deepseek-flash",
    publicName: "DeepSeek V4.1 Flash (October 17)",
    aliases: ["deepseek-v4-flash", "deepseek-v4-flash-vision-exp"],
    notes:
      "Serves V4.1-Flash-1017 with text and image input. DeepSeek temporarily routes the retired V4 Flash names to this model.",
    concurrency: 2500,
    input: 0.3,
    cachedInput: 0.006,
    output: 1.2,
  },
  {
    modelId: "deepseek-v4-pro",
    publicName: "DeepSeek V4 Pro",
    aliases: [],
    notes:
      "Serves V4-Pro-0813 with text input. The September change log confirms continued direct availability.",
    concurrency: 500,
    input: 1.32,
    cachedInput: 0.044,
    output: 3.96,
  },
];

export const llms = providerContext.defineLlms([
  ...currentModels.map(
    ({
      modelId,
      publicName,
      aliases,
      notes,
      concurrency,
      input,
      cachedInput,
      output,
    }) =>
      providerContext.llm({
        modelId,
        publicName,
        aliases,
        status: "Documented active/current",
        pricingSummary: `At peak, one million cached input tokens cost USD ${cachedInput}, other input costs USD ${input} and output costs USD ${output}. Off-peak rates are half. Peak windows are 01:00–04:00 and 06:00–10:00 UTC on weekdays outside Chinese public holidays.`,
        limitsSummary: `1M-token context, up to 384K output tokens and ${concurrency} concurrent requests.`,
        notes,
        officialSources: [
          pricing,
          changes,
          "https://api-docs.deepseek.com/api/create-chat-completion/",
        ],
        supportsRealtime: true,
        supportsBatch: null,
        priceMeasurements: tokenPrices(input, cachedInput, output),
        constraints: [
          {
            metric: "context_tokens",
            comparator: "~",
            value: 1_000_000,
            unit: "tokens",
            scope: "model",
            sourceText: "1M-token context window.",
          },
          {
            metric: "other",
            comparator: "<=",
            value: 393_216,
            unit: "tokens",
            scope: "output",
            sourceText: "Chat Completions allows at most 393,216 output tokens (384K).",
          },
          {
            metric: "concurrency",
            comparator: "<=",
            value: concurrency,
            unit: "count",
            scope: "account",
            sourceText: `${concurrency} concurrent model requests.`,
          },
        ],
        languageSupport: null,
      }),
  ),
  ...[
    {
      modelId: "deepseek-chat",
      publicName: "DeepSeek Chat (legacy alias)",
      status: "Discontinued",
      notes:
        "Former non-thinking alias. DeepSeek announced its discontinuation for July 24, 2026.",
    },
    {
      modelId: "deepseek-reasoner",
      publicName: "DeepSeek Reasoner (legacy alias)",
      status: "Discontinued",
      notes:
        "Former thinking alias. DeepSeek announced its discontinuation for July 24, 2026.",
    },
    {
      modelId: "deepseek-coder",
      publicName: "DeepSeek Coder (legacy alias)",
      status: "Historical",
      notes:
        "The September 2024 change log mapped this name to V2.5. The current model list omits it.",
    },
  ].map(({ modelId, publicName, status, notes }) =>
    providerContext.llm({
      modelId,
      publicName,
      status,
      notes,
      limitsSummary: null,
      pricingSummary: "Historical alias without a published current price.",
      officialSources: [changes, pricing],
      supportsRealtime: null,
      supportsBatch: null,
      priceMeasurements: [],
      constraints: [],
      languageSupport: null,
    }),
  ),
]);
