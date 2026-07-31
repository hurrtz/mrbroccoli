export const RETIRED_PROVIDER_LABELS = {
  "bytedance-doubao-seed": "ByteDance",
  "moonshot-ai-kimi": "Moonshot",
  perplexity: "Perplexity",
} as const;

export type RetiredProviderId = keyof typeof RETIRED_PROVIDER_LABELS;

export const RETIRED_PROVIDER_IDS = Object.keys(
  RETIRED_PROVIDER_LABELS,
) as RetiredProviderId[];
