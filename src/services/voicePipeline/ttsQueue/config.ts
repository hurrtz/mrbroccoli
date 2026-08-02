import { KOKORO_TTS_TARGET_CHUNK_CHARS } from "../../../constants/kokoro";
import type { TtsBackendMode, TtsFallbackRoute } from "../../../types";
import {
  getProviderTtsTargetChunkChars,
  PROVIDER_TTS_MAX_INPUT_CHARS,
} from "../../tts";
import type { RunVoicePipelineParams } from "../types";

export function normalizeFallbackRoutes(
  primaryMode: TtsBackendMode,
  fallbackRoutes?: TtsFallbackRoute[],
) {
  if (primaryMode === "native") {
    return [];
  }

  const allowedRoutes =
    primaryMode === "provider"
      ? new Set<TtsBackendMode>(["kokoro", "native"])
      : new Set<TtsBackendMode>(["provider", "native"]);
  const normalized: TtsBackendMode[] = [];

  for (const route of fallbackRoutes ?? []) {
    if (allowedRoutes.has(route) && !normalized.includes(route)) {
      normalized.push(route);
    }
  }

  return normalized;
}

export function getTtsChunkTargetChars(
  routes: TtsBackendMode[],
  provider: RunVoicePipelineParams["ttsProvider"],
) {
  const targetSizes = routes.flatMap((route) => {
    if (route === "kokoro") {
      return [KOKORO_TTS_TARGET_CHUNK_CHARS];
    }

    if (route === "local") {
      return [KOKORO_TTS_TARGET_CHUNK_CHARS];
    }

    if (route === "provider") {
      return [
        Math.min(
          PROVIDER_TTS_MAX_INPUT_CHARS,
          getProviderTtsTargetChunkChars(provider),
        ),
      ];
    }

    return [];
  });

  return targetSizes.length > 0
    ? Math.min(...targetSizes)
    : PROVIDER_TTS_MAX_INPUT_CHARS;
}
