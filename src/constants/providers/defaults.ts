import type {
  Provider,
  ProviderModelSelections,
  ProviderSttModelSelections,
  ProviderTtsModelSelections,
  ProviderTtsVoiceSelections,
  ResponseModeConfig,
  ResponseModeSelections,
} from "../../types";
import { PROVIDER_ORDER } from "./catalogData";
import { RUNTIME_PROVIDER_MANIFEST } from "./runtimeManifest";
import { DEFAULT_RUNTIME_PROVIDER_ID } from "./runtimeState";
import {
  PROVIDER_DEFAULT_STT_MODELS as PARTIAL_PROVIDER_DEFAULT_STT_MODELS,
  PROVIDER_DEFAULT_TTS_MODELS as PARTIAL_PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES as PARTIAL_PROVIDER_DEFAULT_TTS_VOICES,
} from "./speech";

function expandProviderDefaults(
  partialDefaults: Partial<Record<Provider, string>>,
) {
  return Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      partialDefaults[provider] ?? "",
    ]),
  ) as Record<Provider, string>;
}

export const PROVIDER_DEFAULT_MODELS: ProviderModelSelections =
  Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      RUNTIME_PROVIDER_MANIFEST[provider].llm.defaultModel ?? "",
    ]),
  ) as ProviderModelSelections;

export const DEFAULT_PROVIDER_STT_MODELS: ProviderSttModelSelections =
  expandProviderDefaults(PARTIAL_PROVIDER_DEFAULT_STT_MODELS);

export const DEFAULT_PROVIDER_TTS_MODELS: ProviderTtsModelSelections =
  expandProviderDefaults(PARTIAL_PROVIDER_DEFAULT_TTS_MODELS);

export const DEFAULT_PROVIDER_TTS_VOICES: ProviderTtsVoiceSelections =
  expandProviderDefaults(PARTIAL_PROVIDER_DEFAULT_TTS_VOICES);

/**
 * Neutral placeholder routes for a fresh install. There are no hardcoded
 * default models: every mode points at the default runtime provider with an
 * empty model id, which is never "ready" (see `isResponseModeReady`). The
 * three modes are auto-derived from the user's first configured provider in
 * `updateApiKey`, so this placeholder is replaced before it is ever relied on.
 */
export const MIN_RESPONSE_MODES = 1;
// The approved Thinking surface exposes no more than four switchable slots.
// Persistence normalizes to the same bound so the editor and runtime agree.
export const MAX_RESPONSE_MODES = 4;
export const DEFAULT_RESPONSE_MODE_COUNT = 3;

const NEUTRAL_RESPONSE_MODE_ROUTE = {
  provider: DEFAULT_RUNTIME_PROVIDER_ID,
  model: "",
} as const;

export function createResponseModeId(index: number) {
  return `mode-${index + 1}`;
}

function createNeutralResponseMode(index: number): ResponseModeConfig {
  return {
    id: createResponseModeId(index),
    route: { ...NEUTRAL_RESPONSE_MODE_ROUTE },
  };
}

export const DEFAULT_RESPONSE_MODES: ResponseModeSelections = Array.from(
  { length: DEFAULT_RESPONSE_MODE_COUNT },
  (_, index) => createNeutralResponseMode(index),
);
