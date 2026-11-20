import { getStrictestCatalogMaxConstraint } from "../catalog";
import { getCatalogConstraintsForAppProvider } from "../catalog/appProviders";
import type { Provider, SttBackendMode } from "../types";

// Worst-case (uncompressed 16 kHz mono 16-bit PCM) upload bitrate of the audio
// we send to provider STT ≈ 32,000 bytes/s. Compressed recordings are smaller,
// so a cap derived from this stays safely under the limit for them too.
const RECORDING_BYTES_PER_SECOND = 16_000 * 2;
// Headroom below the hard provider limit (container overhead + estimate slack).
const SIZE_SAFETY_FACTOR = 0.9;
// Generous fallback when no provider upload limit is known (native STT, or a
// model without a documented size cap).
export const FALLBACK_MAX_RECORDING_MS = 15 * 60 * 1000;

/** Bound each turn by both the route's maximum duration and its upload size. */
export function getMaxRecordingMs(params: {
  sttMode: SttBackendMode;
  sttProvider: Provider | null;
  sttModel: string;
}): number {
  if (params.sttMode !== "provider" || !params.sttProvider) {
    return FALLBACK_MAX_RECORDING_MS;
  }

  const constraints = getCatalogConstraintsForAppProvider(
    params.sttProvider,
    params.sttModel,
    "stt",
  );
  const maxBytes = getStrictestCatalogMaxConstraint(
    constraints, "file_size_bytes",
  )?.value;
  const maxSeconds = getStrictestCatalogMaxConstraint(
    constraints, "duration_seconds",
  )?.value;
  const limits = [
    maxBytes && (maxBytes * SIZE_SAFETY_FACTOR * 1000) / RECORDING_BYTES_PER_SECOND,
    maxSeconds && maxSeconds * 1000,
  ].filter((limit): limit is number => typeof limit === "number" && limit > 0);

  return limits.length ? Math.floor(Math.min(...limits)) : FALLBACK_MAX_RECORDING_MS;
}
