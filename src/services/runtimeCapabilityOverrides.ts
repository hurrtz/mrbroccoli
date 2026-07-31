import AsyncStorage from "@react-native-async-storage/async-storage";

import { isRuntimeProviderId } from "../constants/providers/runtimeState";
import type { Provider } from "../types";
import { reportPersistenceAlert } from "./persistenceAlerts";

export type RuntimeCapabilityOverrideCapability =
  | "llm"
  | "stt"
  | "tts"
  | "web-search";
export type RuntimeCapabilityOverrideReason =
  | "configuration-unsupported"
  | "model-unavailable";

export interface RuntimeCapabilityOverride {
  capability: RuntimeCapabilityOverrideCapability;
  disabledAt: number;
  effort?: string;
  model: string;
  provider: Provider;
  reason: RuntimeCapabilityOverrideReason;
}

interface StoredRuntimeCapabilityOverrides {
  overrides: RuntimeCapabilityOverride[];
  version: 1;
}

export const RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY =
  "@mrbroccoli/runtime-capability-overrides";

const CAPABILITIES = new Set<RuntimeCapabilityOverrideCapability>([
  "llm",
  "stt",
  "tts",
  "web-search",
]);
const REASONS = new Set<RuntimeCapabilityOverrideReason>([
  "configuration-unsupported",
  "model-unavailable",
]);

let overrides = new Map<string, RuntimeCapabilityOverride>();
let loadPromise: Promise<void> | null = null;
let loaded = false;
let persistenceQueue = Promise.resolve();
let revision = 0;
const listeners = new Set<() => void>();

function getOverrideKey(
  value: Pick<
    RuntimeCapabilityOverride,
    "capability" | "effort" | "model" | "provider"
  >,
) {
  return [
    value.provider,
    value.capability,
    value.model.trim(),
    value.effort?.trim() ?? "",
  ].join("\u0000");
}

function isRuntimeCapabilityOverride(
  value: unknown,
): value is RuntimeCapabilityOverride {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<RuntimeCapabilityOverride>;
  return (
    isRuntimeProviderId(candidate.provider) &&
    CAPABILITIES.has(
      candidate.capability as RuntimeCapabilityOverrideCapability,
    ) &&
    typeof candidate.model === "string" &&
    candidate.model.trim().length > 0 &&
    (candidate.effort === undefined ||
      (typeof candidate.effort === "string" &&
        candidate.effort.trim().length > 0)) &&
    typeof candidate.disabledAt === "number" &&
    Number.isFinite(candidate.disabledAt) &&
    candidate.disabledAt > 0 &&
    REASONS.has(candidate.reason as RuntimeCapabilityOverrideReason)
  );
}

function parseStoredOverrides(raw: string | null) {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredRuntimeCapabilityOverrides>;

    if (parsed.version !== 1 || !Array.isArray(parsed.overrides)) {
      return [];
    }

    return parsed.overrides.filter(isRuntimeCapabilityOverride).map((entry) => ({
      ...entry,
      model: entry.model.trim(),
      ...(entry.effort ? { effort: entry.effort.trim() } : {}),
    }));
  } catch {
    return [];
  }
}

function emitChange() {
  revision += 1;
  listeners.forEach((listener) => listener());
}

function serializeOverrides() {
  return JSON.stringify({
    version: 1,
    overrides: [...overrides.values()],
  } satisfies StoredRuntimeCapabilityOverrides);
}

function enqueuePersistence(operation: () => Promise<void>) {
  persistenceQueue = persistenceQueue
    .catch(() => undefined)
    .then(operation)
    .catch((error) => {
      console.error(
        "[runtime-capability-overrides] persistence failed",
        error,
      );
      reportPersistenceAlert("settings", "save");
    });

  return persistenceQueue;
}

export async function ensureRuntimeCapabilityOverridesLoaded() {
  if (loaded) {
    return;
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const stored = parseStoredOverrides(
          await AsyncStorage.getItem(
            RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY,
          ),
        );
        overrides = new Map(
          stored.map((entry) => [getOverrideKey(entry), entry]),
        );
      } catch (error) {
        console.error(
          "[runtime-capability-overrides] failed to load",
          error,
        );
        reportPersistenceAlert("settings", "load");
      } finally {
        loaded = true;
        emitChange();
      }
    })();
  }

  await loadPromise;
}

export function isRuntimeCapabilityConfigurationDisabled(params: {
  capability: RuntimeCapabilityOverrideCapability;
  effort?: string;
  model: string;
  provider: Provider;
}) {
  const base = {
    capability: params.capability,
    model: params.model.trim(),
    provider: params.provider,
  };

  if (
    overrides.has(
      getOverrideKey({
        ...base,
      }),
    )
  ) {
    return true;
  }

  const effort = params.effort?.trim();
  return Boolean(
    effort &&
      overrides.has(
        getOverrideKey({
          ...base,
          effort,
        }),
      ),
  );
}

export async function disableRuntimeCapabilityConfiguration(
  params: Omit<RuntimeCapabilityOverride, "disabledAt"> & {
    disabledAt?: number;
  },
) {
  await ensureRuntimeCapabilityOverridesLoaded();

  const entry: RuntimeCapabilityOverride = {
    capability: params.capability,
    disabledAt: params.disabledAt ?? Date.now(),
    ...(params.effort?.trim() ? { effort: params.effort.trim() } : {}),
    model: params.model.trim(),
    provider: params.provider,
    reason: params.reason,
  };
  const key = getOverrideKey(entry);

  if (overrides.has(key)) {
    return false;
  }

  overrides.set(key, entry);
  emitChange();
  await enqueuePersistence(() =>
    AsyncStorage.setItem(
      RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY,
      serializeOverrides(),
    ),
  );
  return true;
}

export function getRuntimeCapabilityOverrides() {
  return [...overrides.values()];
}

export function getRuntimeCapabilityOverrideRevision() {
  return revision;
}

export function subscribeToRuntimeCapabilityOverrides(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function clearRuntimeCapabilityOverrides() {
  await ensureRuntimeCapabilityOverridesLoaded();

  if (overrides.size === 0) {
    return;
  }

  overrides.clear();
  emitChange();
  await enqueuePersistence(() =>
    AsyncStorage.removeItem(RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY),
  );
}

export function resetRuntimeCapabilityOverridesForTests() {
  overrides.clear();
  loadPromise = null;
  loaded = false;
  persistenceQueue = Promise.resolve();
  revision = 0;
}
