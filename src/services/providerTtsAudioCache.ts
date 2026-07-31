import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

import { recordDebugLogEvent } from "./debugLogCapture";

const STORAGE_KEY = "@mrbroccoli/provider_tts_audio_cache_v1";
const CACHE_VERSION = 1;
const MAX_CACHE_ENTRIES = 64;
const MAX_CACHE_BYTES = 128 * 1024 * 1024;
const CACHE_TTL_MS = 14 * 24 * 60 * 60_000;

export interface ProviderTtsAudioCacheEntry {
  audioPath: string;
  cachedAtMs: number;
  lastAccessedAtMs: number;
  providerModel: string | null;
  sizeBytes: number;
}

interface PersistedProviderTtsAudioCache {
  entries: Record<string, ProviderTtsAudioCacheEntry>;
  version: 1;
}

const entries = new Map<string, ProviderTtsAudioCacheEntry>();
let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isPersistedEntry(
  value: unknown,
): value is ProviderTtsAudioCacheEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ProviderTtsAudioCacheEntry>;
  return (
    typeof candidate.audioPath === "string" &&
    candidate.audioPath.length > 0 &&
    isFiniteNonNegative(candidate.cachedAtMs) &&
    isFiniteNonNegative(candidate.lastAccessedAtMs) &&
    (candidate.providerModel === null ||
      typeof candidate.providerModel === "string") &&
    isFiniteNonNegative(candidate.sizeBytes)
  );
}

function parsePersistedCache(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedProviderTtsAudioCache>;
    if (
      parsed.version !== CACHE_VERSION ||
      !parsed.entries ||
      typeof parsed.entries !== "object"
    ) {
      return null;
    }
    return parsed.entries;
  } catch {
    return null;
  }
}

function shouldDeleteManagedFile(audioPath: string) {
  const cacheDirectory = FileSystem.cacheDirectory;
  return Boolean(
    cacheDirectory &&
      audioPath.startsWith(cacheDirectory) &&
      audioPath.slice(cacheDirectory.length).startsWith("tts-"),
  );
}

async function deleteManagedFile(audioPath: string) {
  if (!shouldDeleteManagedFile(audioPath)) {
    return;
  }

  try {
    await FileSystem.deleteAsync(audioPath, { idempotent: true });
  } catch {
    // The index remains authoritative even if an OS-level cache deletion fails.
  }
}

function serializeCache(): PersistedProviderTtsAudioCache {
  return {
    entries: Object.fromEntries(entries),
    version: CACHE_VERSION,
  };
}

function queuePersist() {
  const snapshot = JSON.stringify(serializeCache());
  const write = writeQueue
    .catch(() => undefined)
    .then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot));
  writeQueue = write.catch(() => undefined);
  return write;
}

async function removeEntry(cacheKey: string, deleteFile: boolean) {
  const entry = entries.get(cacheKey);
  entries.delete(cacheKey);
  if (deleteFile && entry) {
    await deleteManagedFile(entry.audioPath);
  }
}

async function pruneCache(nowMs = Date.now()) {
  const expiredKeys = [...entries]
    .filter(([, entry]) => nowMs - entry.cachedAtMs > CACHE_TTL_MS)
    .map(([cacheKey]) => cacheKey);

  for (const cacheKey of expiredKeys) {
    await removeEntry(cacheKey, true);
  }

  const ordered = [...entries].sort(
    ([, first], [, second]) =>
      first.lastAccessedAtMs - second.lastAccessedAtMs,
  );
  let totalBytes = ordered.reduce(
    (sum, [, entry]) => sum + entry.sizeBytes,
    0,
  );

  while (
    ordered.length > MAX_CACHE_ENTRIES ||
    totalBytes > MAX_CACHE_BYTES
  ) {
    const oldest = ordered.shift();
    if (!oldest) {
      break;
    }
    const [cacheKey, entry] = oldest;
    totalBytes = Math.max(0, totalBytes - entry.sizeBytes);
    await removeEntry(cacheKey, true);
  }
}

async function hydrateCache() {
  const persisted = parsePersistedCache(
    await AsyncStorage.getItem(STORAGE_KEY),
  );
  const now = Date.now();
  let changed = false;

  entries.clear();
  if (persisted) {
    const candidates = Object.entries(persisted)
      .filter(([, entry]) => isPersistedEntry(entry))
      .sort(
        ([, first], [, second]) =>
          first.lastAccessedAtMs - second.lastAccessedAtMs,
      );

    for (const [cacheKey, entry] of candidates) {
      if (now - entry.cachedAtMs > CACHE_TTL_MS) {
        changed = true;
        await deleteManagedFile(entry.audioPath);
        continue;
      }

      try {
        const info = await FileSystem.getInfoAsync(entry.audioPath);
        if (!info.exists || info.isDirectory) {
          changed = true;
          continue;
        }
        entries.set(cacheKey, {
          ...entry,
          sizeBytes:
            typeof info.size === "number" && Number.isFinite(info.size)
              ? Math.max(0, info.size)
              : entry.sizeBytes,
        });
      } catch {
        changed = true;
      }
    }
  }

  const sizeBeforePrune = entries.size;
  await pruneCache(now);
  changed = changed || entries.size !== sizeBeforePrune;
  hydrated = true;

  if (changed) {
    await queuePersist();
  }

  recordDebugLogEvent({
    event: "provider-tts-cache-hydrated",
    payload: {
      entries: entries.size,
    },
  });
}

async function ensureHydrated() {
  if (hydrated) {
    return;
  }

  if (!hydrationPromise) {
    hydrationPromise = hydrateCache()
      .catch((error) => {
        entries.clear();
        hydrated = true;
        recordDebugLogEvent({
          event: "provider-tts-cache-hydration-failed",
          level: "warn",
          payload: { error },
        });
      })
      .finally(() => {
        hydrationPromise = null;
      });
  }
  await hydrationPromise;
}

export async function getProviderTtsAudioCacheEntry(cacheKey: string) {
  await ensureHydrated();
  const entry = entries.get(cacheKey);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.cachedAtMs > CACHE_TTL_MS) {
    await removeEntry(cacheKey, true);
    await queuePersist();
    return null;
  }

  try {
    const info = await FileSystem.getInfoAsync(entry.audioPath);
    if (!info.exists || info.isDirectory) {
      await removeEntry(cacheKey, false);
      await queuePersist();
      return null;
    }
  } catch {
    await removeEntry(cacheKey, false);
    await queuePersist();
    return null;
  }

  const touched = {
    ...entry,
    lastAccessedAtMs: Date.now(),
  };
  entries.delete(cacheKey);
  entries.set(cacheKey, touched);
  void queuePersist().catch(() => undefined);
  return touched;
}

export async function setProviderTtsAudioCacheEntry(
  cacheKey: string,
  entry: Pick<ProviderTtsAudioCacheEntry, "audioPath" | "providerModel">,
) {
  await ensureHydrated();
  const now = Date.now();
  let sizeBytes = 0;

  try {
    const info = await FileSystem.getInfoAsync(entry.audioPath);
    sizeBytes =
      info.exists &&
      !info.isDirectory &&
      typeof info.size === "number" &&
      Number.isFinite(info.size)
        ? Math.max(0, info.size)
        : 0;
  } catch {
    sizeBytes = 0;
  }

  entries.delete(cacheKey);
  entries.set(cacheKey, {
    ...entry,
    cachedAtMs: now,
    lastAccessedAtMs: now,
    sizeBytes,
  });
  await pruneCache(now);
  try {
    await queuePersist();
  } catch (error) {
    recordDebugLogEvent({
      event: "provider-tts-cache-persist-failed",
      level: "warn",
      payload: { error },
    });
  }
}

export async function clearProviderTtsAudioCache() {
  await ensureHydrated();
  const cachedEntries = [...entries.values()];
  entries.clear();

  await Promise.all(
    cachedEntries.map(({ audioPath }) => deleteManagedFile(audioPath)),
  );
  await writeQueue.catch(() => undefined);
  await AsyncStorage.removeItem(STORAGE_KEY);

  recordDebugLogEvent({
    event: "provider-tts-cache-cleared",
    payload: {
      entries: cachedEntries.length,
    },
  });

  return cachedEntries.length;
}

export function resetProviderTtsAudioCacheForTests() {
  entries.clear();
  hydrated = true;
  hydrationPromise = null;
  writeQueue = Promise.resolve();
}

export function simulateProviderTtsAudioCacheRestartForTests() {
  entries.clear();
  hydrated = false;
  hydrationPromise = null;
  writeQueue = Promise.resolve();
}

export const PROVIDER_TTS_AUDIO_CACHE_LIMITS = {
  maxBytes: MAX_CACHE_BYTES,
  maxEntries: MAX_CACHE_ENTRIES,
  ttlMs: CACHE_TTL_MS,
} as const;
