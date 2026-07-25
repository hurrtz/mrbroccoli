import type {
  KokoroTtsFallbackRoute,
  ProviderTtsFallbackRoute,
  TtsBackendMode,
  TtsFallbackPolicy,
  TtsFallbackRoute,
} from "../types";

export const DEFAULT_TTS_FALLBACK_POLICY: TtsFallbackPolicy = {
  provider: [],
  kokoro: [],
};

export const TTS_FALLBACK_OPTIONS = {
  provider: ["kokoro", "native"] as const satisfies readonly ProviderTtsFallbackRoute[],
  kokoro: ["provider", "native"] as const satisfies readonly KokoroTtsFallbackRoute[],
};

export function getTtsFallbackRoutes(
  policy: TtsFallbackPolicy,
  primaryMode: TtsBackendMode,
): TtsFallbackRoute[] {
  return primaryMode === "native" ? [] : [...policy[primaryMode]];
}

export function normalizeTtsFallbackPolicy(
  value: unknown,
): TtsFallbackPolicy {
  if (!value || typeof value !== "object") {
    return {
      provider: [],
      kokoro: [],
    };
  }

  const candidate = value as {
    provider?: unknown;
    kokoro?: unknown;
  };
  const normalizeRoutes = <T extends TtsFallbackRoute>(
    routes: unknown,
    allowed: readonly T[],
  ): T[] => {
    if (!Array.isArray(routes)) {
      return [];
    }

    const normalized: T[] = [];

    for (const route of routes) {
      if (
        allowed.includes(route as T) &&
        !normalized.includes(route as T)
      ) {
        normalized.push(route as T);
      }
    }

    return normalized;
  };

  return {
    provider: normalizeRoutes(candidate.provider, TTS_FALLBACK_OPTIONS.provider),
    kokoro: normalizeRoutes(candidate.kokoro, TTS_FALLBACK_OPTIONS.kokoro),
  };
}
