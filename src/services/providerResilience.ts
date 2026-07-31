import type { Provider } from "../types";
import {
  getDefaultModelEffort,
  getModelEffortOptions,
  normalizeResponseModeRouteEffort,
} from "../utils/modelEffort";

import {
  getPersistableRuntimeOverrideTarget,
  ProviderRequestError,
  type ProviderFailureKind,
} from "./providerErrors";
import {
  disableRuntimeCapabilityConfiguration,
  ensureRuntimeCapabilityOverridesLoaded,
  isRuntimeCapabilityConfigurationDisabled,
  type RuntimeCapabilityOverrideCapability,
} from "./runtimeCapabilityOverrides";

export type ResilientProviderCapability =
  RuntimeCapabilityOverrideCapability;

export interface ProviderModelRequestResult<T> {
  actualModelEffort?: string;
  actualModel: string;
  attempts: number;
  requestedModelEffort?: string;
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
  modelEffort?: string;
  provider: Provider;
  request: (model: string, modelEffort?: string) => Promise<T>;
  retryDelayMs?: number;
}

export interface ProviderCircuitState {
  capability: ResilientProviderCapability;
  failureKind: ProviderFailureKind;
  message: string;
  openedAt: number;
  provider: Provider;
}

export class ProviderCircuitOpenError extends Error {
  readonly capability: ResilientProviderCapability;
  readonly failureKind: ProviderFailureKind;
  readonly provider: Provider;

  constructor(state: ProviderCircuitState) {
    super(state.message);
    this.name = "ProviderCircuitOpenError";
    this.capability = state.capability;
    this.failureKind = state.failureKind;
    this.provider = state.provider;
  }
}

const DEFAULT_RETRY_DELAY_MS = 350;
const DEFAULT_MAX_SAME_MODEL_RETRIES = 1;
const MAX_MODEL_CANDIDATES = 3;
const TEMPORARY_CIRCUIT_MS = 5 * 60_000;
const UNAVAILABLE_MODEL_CIRCUIT_MS = 30 * 60_000;

const unhealthyModels = new Map<string, number>();
const providerCircuits = new Map<string, ProviderCircuitState>();
const providerCircuitListeners = new Set<() => void>();

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

function providerCircuitKey(
  provider: Provider,
  capability: ResilientProviderCapability,
) {
  return `${provider}:${capability}`;
}

function emitProviderCircuitChange() {
  providerCircuitListeners.forEach((listener) => listener());
}

function openProviderCircuit(params: {
  capability: ResilientProviderCapability;
  error: unknown;
  failureKind: ProviderFailureKind;
  provider: Provider;
}) {
  const state: ProviderCircuitState = {
    capability: params.capability,
    failureKind: params.failureKind,
    message:
      params.error instanceof Error
        ? params.error.message
        : String(params.error),
    openedAt: Date.now(),
    provider: params.provider,
  };
  const key = providerCircuitKey(params.provider, params.capability);
  const previous = providerCircuits.get(key);
  providerCircuits.set(key, state);

  if (
    !previous ||
    previous.failureKind !== state.failureKind ||
    previous.message !== state.message
  ) {
    emitProviderCircuitChange();
  }

  recordResilienceEvent({
    event: "provider-circuit-opened",
    level: "warn",
    payload: { ...state },
  });
}

function clearProviderCircuit(
  provider: Provider,
  capability: ResilientProviderCapability,
) {
  if (providerCircuits.delete(providerCircuitKey(provider, capability))) {
    emitProviderCircuitChange();
    recordResilienceEvent({
      event: "provider-circuit-closed",
      payload: { capability, provider },
    });
  }
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

function isModelScopedQuotaFailure(error: unknown, model: string) {
  if (
    !(error instanceof ProviderRequestError) ||
    error.failureKind !== "quota"
  ) {
    return false;
  }

  const detail = error.detail.toLowerCase();
  const normalizedModel = model.trim().toLowerCase();

  return (
    (normalizedModel.length > 0 && detail.includes(normalizedModel)) ||
    detail.includes("model quota") ||
    detail.includes("quota per model") ||
    detail.includes("per-model quota")
  );
}

function canFailOverToAnotherModel(kind: ProviderFailureKind | null) {
  // Providers may return generic quota messages even when only one model is
  // exhausted. The candidate chain is bounded, so probe its curated fallbacks
  // instead of assuming the entire provider is unavailable.
  return (
    kind === "capacity" ||
    kind === "configuration-unsupported" ||
    kind === "model-unavailable" ||
    kind === "quota" ||
    kind === "rate-limit" ||
    kind === "server"
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
  const runtimeAvailable = candidates.filter(
    (model) =>
      !isRuntimeCapabilityConfigurationDisabled({
        capability: params.capability,
        model,
        provider: params.provider,
      }),
  );
  const available = runtimeAvailable.filter(
    (model) =>
      !isModelCircuitOpen({
        capability: params.capability,
        model,
        provider: params.provider,
      }),
  );

  // Never make a provider permanently unusable because every candidate was
  // temporarily unhealthy in an earlier request. Durable provider-confirmed
  // overrides are never probed again until the local override is cleared.
  return available.length > 0 ? available : runtimeAvailable.slice(0, 1);
}

function getAvailableModelEfforts(params: {
  capability: ResilientProviderCapability;
  model: string;
  provider: Provider;
  requestedEffort?: string;
}) {
  const requestedEffort = params.requestedEffort?.trim();

  if (params.capability !== "llm" || !requestedEffort) {
    return [undefined];
  }

  const effortOptions = getModelEffortOptions(params.provider, params.model);

  if (effortOptions.length === 0) {
    return [undefined];
  }

  const normalizedRequestedEffort = normalizeResponseModeRouteEffort({
    effort: requestedEffort,
    model: params.model,
    provider: params.provider,
  }).effort;
  const candidates = [
    normalizedRequestedEffort,
    getDefaultModelEffort(params.provider, params.model),
    ...effortOptions.map((option) => option.id),
  ];
  const unique = new Set<string>();

  for (const candidate of candidates) {
    const effort = candidate?.trim();

    if (
      effort &&
      !isRuntimeCapabilityConfigurationDisabled({
        capability: params.capability,
        effort,
        model: params.model,
        provider: params.provider,
      })
    ) {
      unique.add(effort);
    }
  }

  return [...unique];
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
  await ensureRuntimeCapabilityOverridesLoaded();

  const providerCircuit = getProviderCircuitState(
    params.provider,
    params.capability,
  );

  if (providerCircuit) {
    recordResilienceEvent({
      event: "provider-circuit-request-blocked",
      level: "warn",
      payload: { ...providerCircuit },
    });
    throw new ProviderCircuitOpenError(providerCircuit);
  }

  const requestedModel = params.candidateModels[0]?.trim() ?? "";
  const requestedModelEffort = params.modelEffort?.trim();
  const candidates = getAvailableCandidates(params)
    .map((model) => ({
      efforts: getAvailableModelEfforts({
        capability: params.capability,
        model,
        provider: params.provider,
        requestedEffort: requestedModelEffort,
      }),
      model,
    }))
    .filter(({ efforts }) => efforts.length > 0);
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
    const { efforts, model } = candidates[modelIndex];
    let effortIndex = 0;
    let sameModelRetry = 0;

    while (true) {
      const modelEffort = efforts[effortIndex];

      if (params.abortSignal?.aborted) {
        const abortError = new Error("Provider request aborted.");
        abortError.name = "AbortError";
        throw abortError;
      }

      attempts += 1;

      try {
        const value =
          modelEffort === undefined
            ? await params.request(model)
            : await params.request(model, modelEffort);

        unhealthyModels.delete(
          circuitKey(params.provider, params.capability, model),
        );
        clearProviderCircuit(params.provider, params.capability);
        const effortFallbackUsed =
          model === requestedModel &&
          requestedModelEffort !== undefined &&
          getModelEffortOptions(params.provider, requestedModel).length > 0 &&
          modelEffort !== requestedModelEffort;

        if (
          attempts > 1 ||
          model !== requestedModel ||
          effortFallbackUsed
        ) {
          recordResilienceEvent({
            event: "provider-model-request-recovered",
            payload: {
              actualModel: model,
              actualModelEffort: modelEffort ?? null,
              attempts,
              capability: params.capability,
              provider: params.provider,
              requestedModel,
              requestedModelEffort: requestedModelEffort ?? null,
              usedFallback: model !== requestedModel || effortFallbackUsed,
            },
          });
        }

        return {
          actualModel: model,
          ...(modelEffort ? { actualModelEffort: modelEffort } : {}),
          attempts,
          requestedModel,
          ...(requestedModelEffort
            ? { requestedModelEffort }
            : {}),
          usedFallback: model !== requestedModel || effortFallbackUsed,
          value,
        };
      } catch (error) {
        lastError = error;

        if (isAbortError(error, params.abortSignal)) {
          throw error;
        }

        const kind = getProviderFailureKind(error);
        const persistableOverride = getPersistableRuntimeOverrideTarget({
          effort: modelEffort,
          error,
          model,
        });
        if (persistableOverride) {
          const configurationOverride =
            persistableOverride.kind === "configuration";
          const persisted =
            await disableRuntimeCapabilityConfiguration({
              capability: params.capability,
              ...(configurationOverride
                ? { effort: persistableOverride.effort }
                : {}),
              model,
              provider: params.provider,
              reason: configurationOverride
                ? "configuration-unsupported"
                : "model-unavailable",
            });

          if (persisted) {
            recordResilienceEvent({
              event: "provider-runtime-configuration-disabled",
              level: "warn",
              payload: {
                capability: params.capability,
                ...(configurationOverride
                  ? { effort: persistableOverride.effort }
                  : {}),
                failureKind: kind,
                model,
                provider: params.provider,
              },
            });
          }
        }
        const failureScope =
          kind === "quota"
            ? isModelScopedQuotaFailure(error, model)
              ? "model"
              : "unspecified"
            : undefined;
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
            ...(failureScope ? { failureScope } : {}),
            message: error instanceof Error ? error.message : String(error),
            model,
            provider: params.provider,
          },
        });

        if (shouldRetrySameModel) {
          sameModelRetry += 1;
          await waitForRetry(retryDelayMs, params.abortSignal);
          continue;
        }

        const nextEffort = efforts[effortIndex + 1];
        const shouldTryAnotherEffort =
          callerAllowsRetry &&
          persistableOverride?.kind === "configuration" &&
          nextEffort !== undefined;

        if (shouldTryAnotherEffort) {
          effortIndex += 1;
          sameModelRetry = 0;
          recordResilienceEvent({
            event: "provider-model-configuration-failover",
            level: "warn",
            payload: {
              capability: params.capability,
              failedEffort: modelEffort ?? null,
              failureKind: kind ?? "unknown",
              model,
              nextEffort,
              provider: params.provider,
            },
          });
          continue;
        }

        const hasFallback = modelIndex < candidates.length - 1;
        const shouldFailOver =
          callerAllowsRetry && hasFallback && canFailOverToAnotherModel(kind);

        if (!shouldFailOver) {
          const providerWideTerminalFailure =
            kind === "authentication" ||
            kind === "credits" ||
            (kind === "quota" &&
              failureScope !== "model" &&
              !hasFallback);

          if (providerWideTerminalFailure && kind) {
            openProviderCircuit({
              capability: params.capability,
              error,
              failureKind: kind,
              provider: params.provider,
            });
          }
          throw error;
        }

        if (persistableOverride?.kind !== "configuration") {
          markModelUnhealthy({
            capability: params.capability,
            kind,
            model,
            provider: params.provider,
          });
        }
        recordResilienceEvent({
          event: "provider-model-failover",
          level: "warn",
          payload: {
            capability: params.capability,
            failedModel: model,
            failureKind: kind ?? "unknown",
            ...(failureScope ? { failureScope } : {}),
            nextModel: candidates[modelIndex + 1]?.model,
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

export function getProviderCircuitState(
  provider: Provider,
  capability: ResilientProviderCapability,
) {
  return providerCircuits.get(providerCircuitKey(provider, capability)) ?? null;
}

export function subscribeToProviderCircuitChanges(listener: () => void) {
  providerCircuitListeners.add(listener);
  return () => {
    providerCircuitListeners.delete(listener);
  };
}

export function resetProviderCircuit(
  provider: Provider,
  capability?: ResilientProviderCapability,
) {
  if (capability) {
    clearProviderCircuit(provider, capability);
    return;
  }

  let changed = false;
  for (const key of providerCircuits.keys()) {
    if (key.startsWith(`${provider}:`)) {
      providerCircuits.delete(key);
      changed = true;
    }
  }

  if (changed) {
    emitProviderCircuitChange();
    recordResilienceEvent({
      event: "provider-circuits-reset",
      payload: { provider },
    });
  }
}

export function resetProviderModelHealthForTests() {
  unhealthyModels.clear();
  providerCircuits.clear();
}
