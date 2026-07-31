import {
  DEFAULT_WEB_SEARCH_PROVIDER_SETTINGS,
  WEB_SEARCH_PROVIDER_CONTROL_SUPPORT,
  WEB_SEARCH_PROVIDER_IDS,
  WEB_SEARCH_SEARCH_MODE_VALUES,
  type WebSearchProvider,
  type WebSearchSearchMode,
} from "../src/constants/webSearch";
import {
  RUNTIME_PROVIDER_MANIFEST,
  type RuntimeAppProviderId,
} from "../src/constants/providers/runtimeManifest";

export type LiveProviderMatrixStep =
  | {
      id: string;
      kind: "llm";
      provider: RuntimeAppProviderId;
      model: string;
      effort?: string;
      reservedUsd: number;
    }
  | {
      id: string;
      kind: "stt";
      provider: RuntimeAppProviderId;
      model: string;
      reservedUsd: number;
    }
  | {
      id: string;
      kind: "tts";
      provider: RuntimeAppProviderId;
      model: string;
      voice?: string;
      reservedUsd: number;
    }
  | {
      id: string;
      kind: "web-search";
      provider: WebSearchProvider;
      searchMode: WebSearchSearchMode;
      reservedUsd: number;
    }
  | {
      id: string;
      kind: "voice-directory";
      provider: RuntimeAppProviderId;
      reservedUsd: number;
    };

export const LIVE_PROVIDER_ENV_KEYS: Record<
  RuntimeAppProviderId,
  string
> = {
  openai: "MR_BROCCOLI_OPENAI_API_KEY",
  openrouter: "MR_BROCCOLI_OPENROUTER_API_KEY",
  anthropic: "MR_BROCCOLI_ANTHROPIC_API_KEY",
  "alibaba-qwen-dashscope": "MR_BROCCOLI_QWEN_API_KEY",
  gemini: "MR_BROCCOLI_GEMINI_API_KEY",
  xai: "MR_BROCCOLI_XAI_API_KEY",
  deepseek: "MR_BROCCOLI_DEEPSEEK_API_KEY",
  mistral: "MR_BROCCOLI_MISTRAL_API_KEY",
  elevenlabs: "MR_BROCCOLI_ELEVENLABS_API_KEY",
};

// These are deliberately conservative release-test reservations, not pricing
// shown in the product and not a provider invoice estimate. The matrix asks
// every LLM for a one-token answer and synthesizes/transcribes only a tiny
// fixture. Keeping the values here makes additions fail the USD guard before
// any network request instead of silently expanding release spend.
const RESERVED_USD = {
  llm: 0.004,
  stt: 0.0025,
  tts: 0.004,
  webSearch: 0.012,
  voiceDirectory: 0,
} as const;

function stepId(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(":");
}

function getRepresentativeVoice(
  provider: RuntimeAppProviderId,
  model: string,
) {
  const manifest = RUNTIME_PROVIDER_MANIFEST[provider].tts;
  const compatibleVoice = manifest.voiceOptions.find(
    (voice) => !voice.modelIds || voice.modelIds.includes(model),
  );

  return compatibleVoice?.id ?? manifest.defaultVoice ?? manifest.voiceFallback;
}

export function buildLiveProviderMatrix(): LiveProviderMatrixStep[] {
  const steps: LiveProviderMatrixStep[] = [];

  for (const [providerId, manifest] of Object.entries(
    RUNTIME_PROVIDER_MANIFEST,
  )) {
    const provider = providerId as RuntimeAppProviderId;

    for (const model of manifest.llm.models) {
      const efforts = model.effort?.options.map((option) => option.id) ?? [
        undefined,
      ];

      for (const effort of efforts) {
        steps.push({
          id: stepId(["llm", provider, model.id, effort]),
          kind: "llm",
          provider,
          model: model.id,
          ...(effort ? { effort } : {}),
          reservedUsd: RESERVED_USD.llm,
        });
      }
    }

    for (const model of manifest.stt.models) {
      steps.push({
        id: stepId(["stt", provider, model.id]),
        kind: "stt",
        provider,
        model: model.id,
        reservedUsd: RESERVED_USD.stt,
      });
    }

    if (manifest.tts.voiceDirectory) {
      steps.push({
        id: stepId(["voice-directory", provider]),
        kind: "voice-directory",
        provider,
        reservedUsd: RESERVED_USD.voiceDirectory,
      });
    }

    for (const model of manifest.tts.models) {
      const voice = getRepresentativeVoice(provider, model.id);

      steps.push({
        id: stepId(["tts", provider, model.id, voice]),
        kind: "tts",
        provider,
        model: model.id,
        ...(voice ? { voice } : {}),
        reservedUsd: RESERVED_USD.tts,
      });
    }
  }

  for (const provider of WEB_SEARCH_PROVIDER_IDS) {
    const defaultSearchMode =
      DEFAULT_WEB_SEARCH_PROVIDER_SETTINGS[provider].searchMode;
    const searchModes = WEB_SEARCH_PROVIDER_CONTROL_SUPPORT[provider].searchMode
      ? WEB_SEARCH_SEARCH_MODE_VALUES
      : [defaultSearchMode];

    for (const searchMode of searchModes) {
      steps.push({
        id: stepId(["web-search", provider, searchMode]),
        kind: "web-search",
        provider,
        searchMode,
        reservedUsd: RESERVED_USD.webSearch,
      });
    }
  }

  return steps;
}

export function getLiveProviderMatrixReservedUsd(
  steps = buildLiveProviderMatrix(),
) {
  return Number(
    steps.reduce((total, step) => total + step.reservedUsd, 0).toFixed(4),
  );
}
