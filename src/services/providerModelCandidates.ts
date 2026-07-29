import {
  RUNTIME_PROVIDER_MANIFEST,
  type RuntimeProviderManifestEntry,
} from "../constants/providers/runtimeManifest";
import type { Provider } from "../types";

export type ProviderModelCapability = "llm" | "stt" | "tts";

function getCapabilityManifest(
  provider: Provider,
  capability: ProviderModelCapability,
) {
  return RUNTIME_PROVIDER_MANIFEST[provider][
    capability
  ] as RuntimeProviderManifestEntry[ProviderModelCapability];
}

export function getProviderModelCandidates(params: {
  capability: ProviderModelCapability;
  provider: Provider;
  requestedModel?: string;
  isCompatible?: (model: string) => boolean;
}) {
  const manifest = getCapabilityManifest(params.provider, params.capability);
  const requestedModel =
    params.requestedModel?.trim() || manifest.defaultModel?.trim() || "";
  const candidates = [requestedModel, ...(manifest.fallbackModelIds ?? [])];
  const unique = new Set<string>();

  for (const candidate of candidates) {
    const model = candidate.trim();

    if (model && (params.isCompatible?.(model) ?? true)) {
      unique.add(model);
    }
  }

  // A user-selected model must remain the first attempt even if stale
  // metadata cannot prove compatibility. The provider response remains the
  // authority, and only explicitly curated alternatives follow it.
  if (requestedModel && !unique.has(requestedModel)) {
    return [
      requestedModel,
      ...[...unique].filter((model) => model !== requestedModel),
    ];
  }

  return [...unique];
}
