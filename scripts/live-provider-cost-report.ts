import fs from "node:fs";
import path from "node:path";

import { PROVIDER_CATALOG } from "../src/catalog";
import { getCatalogModelForAppProvider } from "../src/catalog/appProviders";
import { getWebSearchProviderModel } from "../src/constants/webSearch";
import type { Provider, UsageEstimate } from "../src/types";

import type { LiveProviderMatrixStep } from "./live-provider-matrix-plan";

export const LIVE_PROVIDER_COST_REPORT_SCHEMA_VERSION = 1;
export const DEFAULT_LIVE_PROVIDER_COST_REPORT_DIR =
  "artifacts/provider-matrix";

export type LiveProviderCostSource =
  | "provider-reported"
  | "catalog-estimate"
  | "catalog-partial"
  | "free"
  | "unknown";

export interface SanitizedProviderUsage {
  responseCount?: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  audioInputSeconds?: number;
  inputCharacters?: number;
  searchRequests?: number;
  providerReportedCredits?: number;
  providerReportedUsd?: number;
  tokenSource?: "provider-response" | "local-estimate";
  unitSource?: "provider-response" | "release-fixture";
}

interface MutableLiveProviderCostStep {
  step: LiveProviderMatrixStep;
  status: "not-run" | "running" | "passed" | "failed";
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  usage: SanitizedProviderUsage;
}

interface CatalogCostComponent {
  amountUsd: number;
  description: string;
  sourceText: string;
}

type PricedUnit =
  | "million_input_tokens"
  | "million_output_tokens"
  | "minute"
  | "hour"
  | "second"
  | "million_characters";

interface SelectedRate {
  amountUsd: number;
  sourceText: string;
  sourceUrl?: string;
  note?: string;
}

export interface LiveProviderCostStepReport {
  id: string;
  kind: LiveProviderMatrixStep["kind"];
  provider: string;
  model?: string;
  effort?: string;
  searchMode?: string;
  status: MutableLiveProviderCostStep["status"];
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  reservedUsd: number;
  costSource: LiveProviderCostSource;
  accountedUsd: number | null;
  upperBoundUsd: number;
  fullyAccounted: boolean;
  usage: SanitizedProviderUsage;
  components: CatalogCostComponent[];
  pricingSources: string[];
  caveats: string[];
}

export interface LiveProviderCostProviderReport {
  provider: string;
  attemptedSteps: number;
  passedSteps: number;
  failedSteps: number;
  fullyAccountedSteps: number;
  incompleteSteps: number;
  accountedUsd: number;
  upperBoundUsd: number;
}

export interface LiveProviderCostReport {
  schemaVersion: number;
  currency: "USD";
  catalogUpdatedAt: string;
  startedAt: string;
  endedAt: string;
  complete: boolean;
  caveat: string;
  summary: {
    matrixSteps: number;
    attemptedSteps: number;
    passedSteps: number;
    failedSteps: number;
    fullyAccountedSteps: number;
    incompleteSteps: number;
    fullMatrixReservedUsd: number;
    attemptedReservedUsd: number;
    accountedUsd: number;
    upperBoundUsd: number;
  };
  providers: LiveProviderCostProviderReport[];
  steps: LiveProviderCostStepReport[];
}

const SEARCH_TOOL_PRICING: Partial<
  Record<
    string,
    { amountUsdPerRequest: number; source: string; note?: string }
  >
> = {
  openai: {
    amountUsdPerRequest: 0.01,
    source: "https://openai.com/api/pricing/",
  },
  anthropic: {
    amountUsdPerRequest: 0.01,
    source:
      "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
  },
  xai: {
    amountUsdPerRequest: 0.005,
    source: "https://docs.x.ai/developers/pricing",
  },
  gemini: {
    amountUsdPerRequest: 0.014,
    source: "https://ai.google.dev/gemini-api/docs/pricing",
    note:
      "Gemini 3 search list price is used; account free allowances can make the invoiced tool cost lower.",
  },
};

// The generated provider catalog deliberately keeps an empty price list when
// current official model pages describe a model but do not expose structured
// pricing. Pin the small set of release-matrix gaps here so cost reports remain
// reproducible instead of silently inheriting future price changes.
const PINNED_RELEASE_PRICING: Record<
  string,
  {
    rates: Partial<Record<PricedUnit, number>>;
    source: string;
    note?: string;
  }
> = {
  "openai:gpt-5.6-sol": {
    rates: { million_input_tokens: 5, million_output_tokens: 30 },
    source: "https://developers.openai.com/api/docs/models",
  },
  "openai:gpt-5.6-terra": {
    rates: { million_input_tokens: 2.5, million_output_tokens: 15 },
    source: "https://developers.openai.com/api/docs/models",
  },
  "openai:gpt-5.6-luna": {
    rates: { million_input_tokens: 1, million_output_tokens: 6 },
    source: "https://developers.openai.com/api/docs/models",
  },
  "openai:gpt-realtime-2.1": {
    rates: { million_input_tokens: 4, million_output_tokens: 24 },
    source:
      "https://developers.openai.com/api/docs/models/gpt-realtime-2.1",
    note: "Text-token pricing is used for the text-only realtime fixture.",
  },
  "anthropic:claude-sonnet-5": {
    rates: { million_input_tokens: 2, million_output_tokens: 10 },
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
    note:
      "Claude Sonnet 5 introductory pricing is pinned for release runs through 2026-08-31; refresh this snapshot afterward.",
  },
  "anthropic:claude-fable-5": {
    rates: { million_input_tokens: 10, million_output_tokens: 50 },
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  "gemini:gemini-3.6-flash": {
    rates: { million_input_tokens: 1.5, million_output_tokens: 7.5 },
    source: "https://ai.google.dev/gemini-api/docs/pricing",
  },
  "gemini:gemini-3.5-flash": {
    rates: { million_input_tokens: 1.5, million_output_tokens: 9 },
    source: "https://ai.google.dev/gemini-api/docs/pricing",
  },
  "gemini:gemini-3.5-flash-lite": {
    rates: { million_input_tokens: 0.3, million_output_tokens: 2.5 },
    source: "https://ai.google.dev/gemini-api/docs/pricing",
  },
  "deepseek:deepseek-v4-flash": {
    rates: { million_input_tokens: 0.14, million_output_tokens: 0.28 },
    source: "https://api-docs.deepseek.com/quick_start/pricing",
    note: "Cache-miss input pricing is used as the conservative standard rate.",
  },
  "deepseek:deepseek-v4-pro": {
    rates: { million_input_tokens: 0.435, million_output_tokens: 0.87 },
    source: "https://api-docs.deepseek.com/quick_start/pricing",
    note: "Cache-miss input pricing is used as the conservative standard rate.",
  },
};

function finiteNonNegative(value: unknown): number | undefined {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(numberValue) && numberValue >= 0
    ? numberValue
    : undefined;
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function firstNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = finiteNonNegative(record[key]);

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function getUsageRecord(payload: unknown) {
  const root = getRecord(payload);

  if (!root) {
    return null;
  }

  const response = getRecord(root.response);

  return (
    getRecord(root.usage) ??
    getRecord(root.usageMetadata) ??
    getRecord(response?.usage) ??
    null
  );
}

function countSearchCalls(
  value: unknown,
  visited = new WeakSet<object>(),
): number {
  if (!value || typeof value !== "object") {
    return 0;
  }

  if (visited.has(value)) {
    return 0;
  }

  visited.add(value);

  if (Array.isArray(value)) {
    return value.reduce(
      (total, entry) => total + countSearchCalls(entry, visited),
      0,
    );
  }

  const record = value as Record<string, unknown>;
  const type = typeof record.type === "string" ? record.type : "";
  const name = typeof record.name === "string" ? record.name : "";
  const isSearchCall =
    type === "web_search_call" ||
    type === "google_search_call" ||
    (type === "server_tool_use" && name === "web_search");

  return (
    (isSearchCall ? 1 : 0) +
    Object.values(record).reduce(
      (total, entry) => total + countSearchCalls(entry, visited),
      0,
    )
  );
}

function getProviderSearchRequests(
  usage: Record<string, unknown> | null,
  root: Record<string, unknown> | null,
) {
  if (!usage) {
    return undefined;
  }

  const serverToolUse = getRecord(usage.server_tool_use);
  const anthropicRequests = finiteNonNegative(
    serverToolUse?.web_search_requests,
  );

  if (anthropicRequests !== undefined) {
    return anthropicRequests;
  }

  const xaiToolUse =
    getRecord(usage.server_side_tool_usage) ??
    getRecord(root?.server_side_tool_usage);
  const xaiRequests = finiteNonNegative(
    xaiToolUse?.SERVER_SIDE_TOOL_WEB_SEARCH,
  );

  return xaiRequests;
}

export function extractSanitizedProviderUsage(
  payload: unknown,
  headers: Record<string, string | undefined> = {},
): SanitizedProviderUsage {
  const root = getRecord(payload);
  const usage = getUsageRecord(payload);
  const baseInputTokens = usage
    ? firstNumber(usage, [
        "input_tokens",
        "prompt_tokens",
        "promptTokenCount",
        "inputTokens",
      ])
    : undefined;
  const toolInputTokens = usage
    ? firstNumber(usage, ["tool_use_input_tokens", "toolUsePromptTokenCount"])
    : undefined;
  const baseOutputTokens = usage
    ? firstNumber(usage, [
        "output_tokens",
        "completion_tokens",
        "candidatesTokenCount",
        "outputTokens",
      ])
    : undefined;
  const thoughtTokens = usage
    ? firstNumber(usage, ["thoughts_tokens", "thoughtsTokenCount"])
    : undefined;
  const inputTokens = addOptionalNumber(baseInputTokens, toolInputTokens);
  const outputTokens = addOptionalNumber(baseOutputTokens, thoughtTokens);
  const totalTokens = usage
    ? firstNumber(usage, ["total_tokens", "totalTokenCount", "totalTokens"])
    : undefined;
  const providerReportedUsd =
    (usage
      ? firstNumber(usage, [
          "cost",
          "cost_usd",
          "total_cost",
          "total_cost_usd",
        ])
      : undefined) ??
    (root
      ? firstNumber(root, ["cost", "cost_usd", "total_cost_usd"])
      : undefined);
  const providerSearchRequests = getProviderSearchRequests(usage, root);
  const discoveredSearchRequests = countSearchCalls(payload);
  const providerReportedCredits = firstNumber(
    Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
    ),
    ["character-cost", "x-character-cost", "xi-character-cost"],
  );
  const hasProviderTokens =
    inputTokens !== undefined ||
    outputTokens !== undefined ||
    totalTokens !== undefined;
  const searchRequests =
    providerSearchRequests ??
    (discoveredSearchRequests > 0 ? discoveredSearchRequests : undefined);

  return {
    responseCount: 1,
    ...(inputTokens !== undefined ? { inputTokens } : {}),
    ...(outputTokens !== undefined ? { outputTokens } : {}),
    ...(totalTokens !== undefined ? { totalTokens } : {}),
    ...(searchRequests !== undefined ? { searchRequests } : {}),
    ...(providerReportedCredits !== undefined
      ? { providerReportedCredits }
      : {}),
    ...(providerReportedUsd !== undefined ? { providerReportedUsd } : {}),
    ...(hasProviderTokens ? { tokenSource: "provider-response" as const } : {}),
    ...(searchRequests !== undefined
      ? { unitSource: "provider-response" as const }
      : {}),
  };
}

function addOptionalNumber(left?: number, right?: number) {
  return left === undefined && right === undefined
    ? undefined
    : (left ?? 0) + (right ?? 0);
}

function mergeUsage(
  existing: SanitizedProviderUsage,
  next: SanitizedProviderUsage,
  fillOnly = false,
): SanitizedProviderUsage {
  const numericKeys = [
    "responseCount",
    "inputTokens",
    "outputTokens",
    "totalTokens",
    "audioInputSeconds",
    "inputCharacters",
    "searchRequests",
    "providerReportedCredits",
    "providerReportedUsd",
  ] as const;
  const merged: SanitizedProviderUsage = { ...existing };

  for (const key of numericKeys) {
    if (fillOnly) {
      if (merged[key] === undefined && next[key] !== undefined) {
        (merged as Record<string, unknown>)[key] = next[key];
      }
      continue;
    }

    const value = addOptionalNumber(existing[key], next[key]);
    if (value !== undefined) {
      (merged as Record<string, unknown>)[key] = value;
    }
  }

  merged.tokenSource =
    existing.tokenSource === "provider-response" ||
    next.tokenSource === "provider-response"
      ? "provider-response"
      : existing.tokenSource ?? next.tokenSource;
  merged.unitSource =
    existing.unitSource === "provider-response" ||
    next.unitSource === "provider-response"
      ? "provider-response"
      : existing.unitSource ?? next.unitSource;

  return merged;
}

function getCatalogPricing(step: LiveProviderMatrixStep) {
  if (step.kind === "voice-directory") {
    return null;
  }

  const service =
    step.kind === "web-search" ? "llm" : (step.kind as "llm" | "stt" | "tts");
  const model =
    step.kind === "web-search"
      ? getWebSearchProviderModel(step.provider)
      : step.model;

  return getCatalogModelForAppProvider(
    step.provider as Provider,
    model,
    service,
  );
}

function isStandardPriceSource(sourceText: string) {
  return !/(cached|batch|flex|priority|audio input|long context|>\s*200|above\s*200)/i.test(
    sourceText,
  );
}

function selectRate(
  step: LiveProviderMatrixStep,
  unit: PricedUnit,
): SelectedRate | null {
  const model =
    step.kind === "web-search"
      ? getWebSearchProviderModel(step.provider)
      : step.kind === "voice-directory"
        ? ""
        : step.model;
  const pinned = PINNED_RELEASE_PRICING[`${step.provider}:${model}`];
  const pinnedAmount = pinned?.rates[unit];

  if (pinned && pinnedAmount !== undefined) {
    return {
      amountUsd: pinnedAmount,
      sourceText: `Pinned release price: ${pinnedAmount} USD per ${unit.replaceAll("_", " ")}.`,
      sourceUrl: pinned.source,
      ...(pinned.note ? { note: pinned.note } : {}),
    };
  }

  const measurements = getCatalogPricing(step)?.priceMeasurements ?? [];
  const candidates = measurements.filter(
    (measurement) =>
      measurement.unit === unit && isStandardPriceSource(measurement.sourceText),
  );

  return candidates[0] ?? null;
}

function roundUsd(value: number) {
  return Number(value.toFixed(8));
}

function estimateCatalogCost(
  step: LiveProviderMatrixStep,
  usage: SanitizedProviderUsage,
) {
  const components: CatalogCostComponent[] = [];
  const pricingSources = new Set<string>();
  const caveats: string[] = [];
  let missingRequiredPrice = false;

  const addTokenComponent = (
    tokens: number | undefined,
    unit: "million_input_tokens" | "million_output_tokens",
    description: string,
  ) => {
    if (tokens === undefined) {
      missingRequiredPrice = true;
      return;
    }

    const rate = selectRate(step, unit);

    if (!rate) {
      missingRequiredPrice = true;
      return;
    }

    components.push({
      amountUsd: roundUsd((tokens / 1_000_000) * rate.amountUsd),
      description,
      sourceText: rate.sourceText,
    });
    if (rate.sourceUrl) {
      pricingSources.add(rate.sourceUrl);
    }
    if (rate.note) {
      caveats.push(rate.note);
    }
  };

  if (step.kind === "llm") {
    addTokenComponent(usage.inputTokens, "million_input_tokens", "Input tokens");
    addTokenComponent(usage.outputTokens, "million_output_tokens", "Output tokens");
  }

  if (step.kind === "web-search") {
    addTokenComponent(usage.inputTokens, "million_input_tokens", "Search model input tokens");
    addTokenComponent(usage.outputTokens, "million_output_tokens", "Search model output tokens");
    const searchPricing = SEARCH_TOOL_PRICING[step.provider];

    if (usage.searchRequests === undefined || !searchPricing) {
      missingRequiredPrice = true;
    } else {
      components.push({
        amountUsd: roundUsd(
          usage.searchRequests * searchPricing.amountUsdPerRequest,
        ),
        description: "Billable search tool requests",
        sourceText: `${searchPricing.amountUsdPerRequest} USD per request`,
      });
      pricingSources.add(searchPricing.source);
      if (searchPricing.note) {
        caveats.push(searchPricing.note);
      }
    }
  }

  if (step.kind === "stt") {
    const durationSeconds = usage.audioInputSeconds;
    const minuteRate = selectRate(step, "minute");
    const hourRate = selectRate(step, "hour");
    const secondRate = selectRate(step, "second");

    if (durationSeconds === undefined) {
      missingRequiredPrice = true;
    } else if (secondRate) {
      components.push({
        amountUsd: roundUsd(durationSeconds * secondRate.amountUsd),
        description: "Transcribed audio seconds",
        sourceText: secondRate.sourceText,
      });
      if (secondRate.sourceUrl) pricingSources.add(secondRate.sourceUrl);
      if (secondRate.note) caveats.push(secondRate.note);
    } else if (minuteRate) {
      components.push({
        amountUsd: roundUsd((durationSeconds / 60) * minuteRate.amountUsd),
        description: "Transcribed audio minutes",
        sourceText: minuteRate.sourceText,
      });
      if (minuteRate.sourceUrl) pricingSources.add(minuteRate.sourceUrl);
      if (minuteRate.note) caveats.push(minuteRate.note);
    } else if (hourRate) {
      components.push({
        amountUsd: roundUsd((durationSeconds / 3600) * hourRate.amountUsd),
        description: "Transcribed audio hours",
        sourceText: hourRate.sourceText,
      });
      if (hourRate.sourceUrl) pricingSources.add(hourRate.sourceUrl);
      if (hourRate.note) caveats.push(hourRate.note);
    } else {
      addTokenComponent(usage.inputTokens, "million_input_tokens", "Transcription input tokens");
      addTokenComponent(usage.outputTokens, "million_output_tokens", "Transcription output tokens");
    }
  }

  if (step.kind === "tts") {
    const characterRate = selectRate(step, "million_characters");

    if (characterRate && usage.inputCharacters !== undefined) {
      components.push({
        amountUsd: roundUsd(
          (usage.inputCharacters / 1_000_000) * characterRate.amountUsd,
        ),
        description: "Synthesized input characters",
        sourceText: characterRate.sourceText,
      });
      if (characterRate.sourceUrl) pricingSources.add(characterRate.sourceUrl);
      if (characterRate.note) caveats.push(characterRate.note);
    } else {
      addTokenComponent(usage.inputTokens, "million_input_tokens", "Speech input tokens");
      const outputRate = selectRate(step, "million_output_tokens");

      if (outputRate) {
        addTokenComponent(usage.outputTokens, "million_output_tokens", "Speech output tokens");
      }
    }
  }

  const catalog = getCatalogPricing(step);
  for (const source of catalog?.officialSources ?? []) {
    pricingSources.add(source);
  }

  if (usage.tokenSource === "local-estimate") {
    caveats.push(
      "The provider did not return token usage; local token counts were used.",
    );
  }

  return {
    components,
    pricingSources: Array.from(pricingSources),
    caveats,
    missingRequiredPrice,
  };
}

function buildStepReport(
  entry: MutableLiveProviderCostStep,
): LiveProviderCostStepReport {
  const { step, usage } = entry;
  const providerReportedUsd = usage.providerReportedUsd;
  let components: CatalogCostComponent[] = [];
  let pricingSources: string[] = [];
  let caveats: string[] = [];
  let accountedUsd: number | null = null;
  let costSource: LiveProviderCostSource = "unknown";
  let fullyAccounted = false;

  if (step.kind === "voice-directory" && entry.status === "passed") {
    accountedUsd = 0;
    costSource = "free";
    fullyAccounted = true;
  } else if (providerReportedUsd !== undefined) {
    accountedUsd = roundUsd(providerReportedUsd);
    costSource = "provider-reported";
    fullyAccounted = true;
    components = [
      {
        amountUsd: accountedUsd,
        description: "Provider-reported request cost",
        sourceText: "Provider response usage metadata",
      },
    ];
  } else if (entry.status === "passed" || entry.status === "failed") {
    const estimate = estimateCatalogCost(step, usage);
    components = estimate.components;
    pricingSources = estimate.pricingSources;
    caveats = estimate.caveats;
    accountedUsd =
      components.length > 0
        ? roundUsd(
            components.reduce((total, component) => total + component.amountUsd, 0),
          )
        : null;
    fullyAccounted = !estimate.missingRequiredPrice;
    costSource = fullyAccounted
      ? "catalog-estimate"
      : accountedUsd !== null
        ? "catalog-partial"
        : "unknown";
  }

  if (!fullyAccounted && entry.status !== "not-run") {
    caveats.push(
      "The provider did not return a dollar charge and the pricing snapshot cannot account for every billed unit.",
    );
  }

  const upperBoundUsd =
    entry.status === "not-run"
      ? 0
      : (costSource === "provider-reported" || costSource === "free") &&
          accountedUsd !== null
        ? accountedUsd
        : Math.max(accountedUsd ?? 0, step.reservedUsd);

  return {
    id: step.id,
    kind: step.kind,
    provider: step.provider,
    ...(step.kind !== "voice-directory" && step.kind !== "web-search"
      ? { model: step.model }
      : {}),
    ...(step.kind === "web-search"
      ? {
          model: getWebSearchProviderModel(step.provider),
          searchMode: step.searchMode,
        }
      : {}),
    ...(step.kind === "llm" && step.effort ? { effort: step.effort } : {}),
    status: entry.status,
    ...(entry.startedAt ? { startedAt: entry.startedAt } : {}),
    ...(entry.endedAt ? { endedAt: entry.endedAt } : {}),
    ...(entry.durationMs !== undefined ? { durationMs: entry.durationMs } : {}),
    reservedUsd: step.reservedUsd,
    costSource,
    accountedUsd,
    upperBoundUsd: roundUsd(upperBoundUsd),
    fullyAccounted,
    usage,
    components,
    pricingSources,
    caveats: Array.from(new Set(caveats)),
  };
}

function buildProviderReports(
  steps: LiveProviderCostStepReport[],
): LiveProviderCostProviderReport[] {
  const providers = new Map<string, LiveProviderCostProviderReport>();

  for (const step of steps) {
    if (step.status === "not-run") {
      continue;
    }

    const current = providers.get(step.provider) ?? {
      provider: step.provider,
      attemptedSteps: 0,
      passedSteps: 0,
      failedSteps: 0,
      fullyAccountedSteps: 0,
      incompleteSteps: 0,
      accountedUsd: 0,
      upperBoundUsd: 0,
    };

    current.attemptedSteps += 1;
    current.passedSteps += step.status === "passed" ? 1 : 0;
    current.failedSteps += step.status === "failed" ? 1 : 0;
    current.fullyAccountedSteps += step.fullyAccounted ? 1 : 0;
    current.incompleteSteps += step.fullyAccounted ? 0 : 1;
    current.accountedUsd = roundUsd(
      current.accountedUsd + (step.accountedUsd ?? 0),
    );
    current.upperBoundUsd = roundUsd(
      current.upperBoundUsd + step.upperBoundUsd,
    );
    providers.set(step.provider, current);
  }

  return Array.from(providers.values()).sort((left, right) =>
    left.provider.localeCompare(right.provider),
  );
}

export function formatLiveProviderCostReportMarkdown(
  report: LiveProviderCostReport,
) {
  const rows = report.providers.map(
    (provider) =>
      `| ${provider.provider} | ${provider.attemptedSteps} | ${provider.passedSteps} | ${provider.fullyAccountedSteps} | $${provider.accountedUsd.toFixed(6)} | $${provider.upperBoundUsd.toFixed(6)} |`,
  );
  const incomplete = report.steps
    .filter((step) => step.status !== "not-run" && !step.fullyAccounted)
    .map((step) => `- \`${step.id}\`: ${step.caveats.join(" ")}`);

  return [
    "# Live provider matrix cost report",
    "",
    `Run: ${report.startedAt} to ${report.endedAt}`,
    `Status: ${report.complete ? "complete" : "incomplete"}`,
    "",
    `Accounted cost: **$${report.summary.accountedUsd.toFixed(6)} USD**`,
    `Conservative upper bound for attempted steps: **$${report.summary.upperBoundUsd.toFixed(6)} USD**`,
    `Full-matrix pre-request reservation: **$${report.summary.fullMatrixReservedUsd.toFixed(4)} USD**`,
    "",
    report.caveat,
    "",
    "| Provider | Attempted | Passed | Fully accounted | Accounted USD | Upper-bound USD |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...rows,
    "",
    "## Incomplete pricing",
    "",
    ...(incomplete.length > 0 ? incomplete : ["All attempted steps were accounted for."]),
    "",
  ].join("\n");
}

export function createLiveProviderCostTracker(
  steps: LiveProviderMatrixStep[],
  options: { startedAt?: string } = {},
) {
  const startedAt = options.startedAt ?? new Date().toISOString();
  const entries = new Map<string, MutableLiveProviderCostStep>(
    steps.map((step) => [
      step.id,
      {
        step,
        status: "not-run" as const,
        usage: {},
      },
    ]),
  );

  const requireEntry = (step: LiveProviderMatrixStep) => {
    const entry = entries.get(step.id);

    if (!entry) {
      throw new Error(`Unknown live-provider cost step: ${step.id}`);
    }

    return entry;
  };

  const buildReport = (endedAt = new Date().toISOString()) => {
    const stepReports = Array.from(entries.values()).map(buildStepReport);
    const attemptedSteps = stepReports.filter(
      (step) => step.status !== "not-run",
    );
    const providers = buildProviderReports(stepReports);
    const accountedUsd = roundUsd(
      attemptedSteps.reduce(
        (total, step) => total + (step.accountedUsd ?? 0),
        0,
      ),
    );
    const upperBoundUsd = roundUsd(
      attemptedSteps.reduce((total, step) => total + step.upperBoundUsd, 0),
    );
    const passedSteps = attemptedSteps.filter(
      (step) => step.status === "passed",
    ).length;
    const failedSteps = attemptedSteps.filter(
      (step) => step.status === "failed",
    ).length;
    const fullyAccountedSteps = attemptedSteps.filter(
      (step) => step.fullyAccounted,
    ).length;

    return {
      schemaVersion: LIVE_PROVIDER_COST_REPORT_SCHEMA_VERSION,
      currency: "USD" as const,
      catalogUpdatedAt: PROVIDER_CATALOG.updatedAt,
      startedAt,
      endedAt,
      complete: passedSteps === steps.length && failedSteps === 0,
      caveat:
        "Provider-reported dollar costs are exact for that response. Other values are list-price estimates from sanitized usage metadata or release fixtures; account credits, free tiers, caching, taxes, negotiated pricing, and provider-side rounding can change the invoice.",
      summary: {
        matrixSteps: steps.length,
        attemptedSteps: attemptedSteps.length,
        passedSteps,
        failedSteps,
        fullyAccountedSteps,
        incompleteSteps: attemptedSteps.length - fullyAccountedSteps,
        fullMatrixReservedUsd: roundUsd(
          steps.reduce((total, step) => total + step.reservedUsd, 0),
        ),
        attemptedReservedUsd: roundUsd(
          attemptedSteps.reduce((total, step) => total + step.reservedUsd, 0),
        ),
        accountedUsd,
        upperBoundUsd,
      },
      providers,
      steps: stepReports,
    } satisfies LiveProviderCostReport;
  };

  return {
    startStep(step: LiveProviderMatrixStep, now = new Date()) {
      const entry = requireEntry(step);
      entry.status = "running";
      entry.startedAt = now.toISOString();
    },
    recordProviderResponse(
      step: LiveProviderMatrixStep,
      payload: unknown,
      headers: Record<string, string | undefined> = {},
    ) {
      const entry = requireEntry(step);
      entry.usage = mergeUsage(
        entry.usage,
        extractSanitizedProviderUsage(payload, headers),
      );
    },
    finishStep(
      step: LiveProviderMatrixStep,
      options: {
        passed: boolean;
        fallbackUsage?: SanitizedProviderUsage;
        now?: Date;
      },
    ) {
      const entry = requireEntry(step);
      const ended = options.now ?? new Date();
      entry.status = options.passed ? "passed" : "failed";
      entry.endedAt = ended.toISOString();
      entry.durationMs = entry.startedAt
        ? Math.max(0, ended.getTime() - Date.parse(entry.startedAt))
        : 0;
      if (options.fallbackUsage) {
        entry.usage = mergeUsage(entry.usage, options.fallbackUsage, true);
      }
    },
    buildReport,
    writeReports(
      outputDirectory = DEFAULT_LIVE_PROVIDER_COST_REPORT_DIR,
      endedAt = new Date().toISOString(),
    ) {
      const report = buildReport(endedAt);
      const absoluteDirectory = path.resolve(outputDirectory);
      fs.mkdirSync(absoluteDirectory, { recursive: true });
      const jsonPath = path.join(
        absoluteDirectory,
        "live-provider-cost-report.json",
      );
      const markdownPath = path.join(
        absoluteDirectory,
        "live-provider-cost-report.md",
      );
      fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, {
        mode: 0o600,
      });
      fs.writeFileSync(
        markdownPath,
        formatLiveProviderCostReportMarkdown(report),
        { mode: 0o600 },
      );
      fs.chmodSync(jsonPath, 0o600);
      fs.chmodSync(markdownPath, 0o600);

      return { report, jsonPath, markdownPath };
    },
  };
}

export function buildLlmFallbackUsage(
  usage: UsageEstimate,
): SanitizedProviderUsage {
  return {
    inputTokens: usage.promptTokens,
    outputTokens: usage.completionTokens,
    totalTokens: usage.totalTokens,
    tokenSource: "local-estimate",
  };
}

export function getWavDurationSeconds(base64: string) {
  const bytes = Buffer.from(base64, "base64");

  if (bytes.length < 44 || bytes.toString("ascii", 0, 4) !== "RIFF") {
    throw new Error("The release STT fixture is not a valid RIFF WAV file.");
  }

  let offset = 12;
  let byteRate = 0;
  let dataSize = 0;

  while (offset + 8 <= bytes.length) {
    const chunkId = bytes.toString("ascii", offset, offset + 4);
    const chunkSize = bytes.readUInt32LE(offset + 4);
    const chunkStart = offset + 8;

    if (chunkId === "fmt " && chunkSize >= 12 && chunkStart + 12 <= bytes.length) {
      byteRate = bytes.readUInt32LE(chunkStart + 8);
    }

    if (chunkId === "data") {
      dataSize = Math.min(chunkSize, Math.max(0, bytes.length - chunkStart));
    }

    offset = chunkStart + chunkSize + (chunkSize % 2);
  }

  if (byteRate <= 0 || dataSize <= 0) {
    throw new Error("The release STT fixture has no billable WAV audio data.");
  }

  return dataSize / byteRate;
}
