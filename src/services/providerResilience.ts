import type { Provider } from "../types";

import {
  ProviderRequestError,
  type ProviderFailureKind,
} from "./providerErrors";

export type ResilientProviderCapability = "llm" | "stt" | "tts" | "web-search";

export interface ProviderModelRequestResult<T> {
  actualModel: string;
  attempts: number;
  requestedModel: string;
  usedFallback: boolean;
  value: T;
}

interface ProviderModelRequestParams<T> {
  abortSignal?: AbortSignal;
  canRetry?: () => boolean;
  candidateModels: readonly string[];
  capability: ResilientProviderCapability;
  maxSameModelRetries?: number;
  provider: Provider;
  request: (model: string) => Promise<T>;
  retryDelayMs?: number;
}

const DEFAULT_RETRY_DELAY_MS = 350;
const DEFAULT_MAX_SAME_MODEL_RETRIES = 1;
const MAX_MODEL_CANDIDATES = 3;
const TEMPORARY_CIRCUIT_MS = 5 * 60_000;
const UNAVAILABLE_MODEL_CIRCUIT_MS = 30 * 60_000;

const unhealthyModels = new Map<string, number>();

function recordResilienceEvent(params: {
  event: string;
  level?: "warn";
  payload: Record<string, unknown>;
}) {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const { recordDebugLogEvent } =
    require("./debugLogCapture") as typeof import("./debugLogCapture");
  recordDebugLogEvent(params);
}

function circuitKey(
  provider: Provider,
  capability: ResilientProviderCapability,
  model: string,
) {
  return `${provider}:${capability}:${model}`;
}

function isAbortError(error: unknown, abortSignal?: AbortSignal) {
  return (
    abortSignal?.aborted === true ||
    (error instanceof Error &&
      (error.name === "AbortError" ||
        error.message.toLowerCase().includes("aborted")))
  );
}

export function getProviderFailureKind(
  error: unknown,
): ProviderFailureKind | null {
  if (error instanceof ProviderRequestError) {
    return error.failureKind;
  }

  if (
    error &&
    typeof error === "object" &&
    "failureKind" in error &&
    typeof error.failureKind === "string"
  ) {
    return error.failureKind as ProviderFailureKind;
  }

  if (error instanceof Error) {
    if (error.name === "TtsTimeoutError") {
      return "timeout";
    }

    const normalized = error.message.toLowerCase();

    if (
      normalized.includes("network request failed") ||
      normalized.includes("failed to fetch") ||
      normalized.includes("load failed") ||
      normalized.includes("networkerror")
    ) {
      return "network";
    }

    if (
      normalized.includes("timed out") ||
      normalized.includes("took too long")
    ) {
      return "timeout";
    }
  }

  return null;
}

function canRetrySameModel(kind: ProviderFailureKind | null) {
  return (
    kind === "capacity" ||
    kind === "network" ||
    kind === "rate-limit" ||
    kind === "server" ||
    kind === "timeout"
  );
}

function canFailOverToAnotherModel(kind: ProviderFailureKind | null) {
  return (
    kind === "capacity" || kind === "model-unavailable" || kind === "server"
  );
}

function getCircuitDurationMs(kind: ProviderFailureKind | null) {
  return kind === "model-unavailable"
    ? UNAVAILABLE_MODEL_CIRCUIT_MS
    : TEMPORARY_CIRCUIT_MS;
}

function markModelUnhealthy(params: {
  capability: ResilientProviderCapability;
  kind: ProviderFailureKind | null;
  model: string;
  provider: Provider;
}) {
  unhealthyModels.set(
    circuitKey(params.provider, params.capability, params.model),
    Date.now() + getCircuitDurationMs(params.kind),
  );
}

function isModelCircuitOpen(params: {
  capability: ResilientProviderCapability;
  model: string;
  provider: Provider;
}) {
  const key = circuitKey(params.provider, params.capability, params.model);
  const retryAt = unhealthyModels.get(key);

  if (!retryAt) {
    return false;
  }

  if (retryAt <= Date.now()) {
    unhealthyModels.delete(key);
    return false;
  }

  return true;
}

function normalizeCandidates(candidateModels: readonly string[]) {
  const unique = new Set<string>();

  for (const candidate of candidateModels) {
    const model = candidate.trim();

    if (model) {
      unique.add(model);
    }

    if (unique.size >= MAX_MODEL_CANDIDATES) {
      break;
    }
  }

  return [...unique];
}

function getAvailableCandidates(params: {
  candidateModels: readonly string[];
  capability: ResilientProviderCapability;
  provider: Provider;
}) {
  const candidates = normalizeCandidates(params.candidateModels);
  const available = candidates.filter(
    (model) =>
      !isModelCircuitOpen({
        capability: params.capability,
        model,
        provider: params.provider,
      }),
  );

  // Never make a provider permanently unusable because every candidate was
  // unhealthy in an earlier request. Probe the preferred model again when
  // there is no healthy alternative.
  return available.length > 0 ? available : candidates.slice(0, 1);
}

function waitForRetry(delayMs: number, abortSignal?: AbortSignal) {
  if (delayMs <= 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleAbort = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const abortError = new Error("Provider request aborted.");
      abortError.name = "AbortError";
      reject(abortError);
    };

    if (abortSignal?.aborted) {
      handleAbort();
      return;
    }

    abortSignal?.addEventListener("abort", handleAbort, { once: true });
    timeoutId = setTimeout(() => {
      abortSignal?.removeEventListener("abort", handleAbort);
      resolve();
    }, delayMs);
  });
}

export async function executeProviderModelRequest<T>(
  params: ProviderModelRequestParams<T>,
): Promise<ProviderModelRequestResult<T>> {
  const requestedModel = params.candidateModels[0]?.trim() ?? "";
  const candidates = getAvailableCandidates(params);
  const maxSameModelRetries =
    params.maxSameModelRetries ?? DEFAULT_MAX_SAME_MODEL_RETRIES;
  const retryDelayMs = params.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
  let attempts = 0;
  let lastError: unknown;

  if (candidates.length === 0) {
    throw new Error(
      `No ${params.capability} model is configured for ${params.provider}.`,
    );
  }

  for (let modelIndex = 0; modelIndex < candidates.length; modelIndex += 1) {
    const model = candidates[modelIndex];

    for (
      let sameModelRetry = 0;
      sameModelRetry <= maxSameModelRetries;
      sameModelRetry += 1
    ) {
      if (params.abortSignal?.aborted) {
        const abortError = new Error("Provider request aborted.");
        abortError.name = "AbortError";
        throw abortError;
      }

      attempts += 1;

      try {
        const value = await params.request(model);

        unhealthyModels.delete(
          circuitKey(params.provider, params.capability, model),
        );

        if (attempts > 1 || model !== requestedModel) {
          recordResilienceEvent({
            event: "provider-model-request-recovered",
            payload: {
              actualModel: model,
              attempts,
              capability: params.capability,
              provider: params.provider,
              requestedModel,
              usedFallback: model !== requestedModel,
            },
          });
        }

        return {
          actualModel: model,
          attempts,
          requestedModel,
          usedFallback: model !== requestedModel,
          value,
        };
      } catch (error) {
        lastError = error;

        if (isAbortError(error, params.abortSignal)) {
          throw error;
        }

        const kind = getProviderFailureKind(error);
        const callerAllowsRetry = params.canRetry?.() ?? true;
        const shouldRetrySameModel =
          callerAllowsRetry &&
          sameModelRetry < maxSameModelRetries &&
          canRetrySameModel(kind);

        recordResilienceEvent({
          event: shouldRetrySameModel
            ? "provider-model-request-retrying"
            : "provider-model-request-failed",
          level: "warn",
          payload: {
            attempt: attempts,
            capability: params.capability,
            failureKind: kind ?? "unknown",
            message: error instanceof Error ? error.message : String(error),
            model,
            provider: params.provider,
          },
        });

        if (shouldRetrySameModel) {
          await waitForRetry(retryDelayMs, params.abortSignal);
          continue;
        }

        const hasFallback = modelIndex < candidates.length - 1;
        const shouldFailOver =
          callerAllowsRetry && hasFallback && canFailOverToAnotherModel(kind);

        if (!shouldFailOver) {
          throw error;
        }

        markModelUnhealthy({
          capability: params.capability,
          kind,
          model,
          provider: params.provider,
        });
        recordResilienceEvent({
          event: "provider-model-failover",
          level: "warn",
          payload: {
            capability: params.capability,
            failedModel: model,
            failureKind: kind ?? "unknown",
            nextModel: candidates[modelIndex + 1],
            provider: params.provider,
            requestedModel,
          },
        });
        break;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError ?? "Provider request failed."));
}

export function resetProviderModelHealthForTests() {
  unhealthyModels.clear();
}
