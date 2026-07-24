import { getCatalogModelForAppProvider } from "../../catalog/appProviders";
import type { AppLanguage, Provider } from "../../types";
import {
  RUNTIME_PROVIDER_MANIFEST,
  type RuntimeModelSpec,
  type RuntimeVoiceOption,
} from "./runtimeManifest";
import type { ModelInfo, TtsVoiceOption } from "./types";

function getCatalogSpeechModelLabel(
  provider: Provider,
  service: "stt" | "tts",
  modelId: string,
) {
  return getCatalogModelForAppProvider(provider, modelId, service)?.publicName ?? null;
}

function buildRuntimeSpeechModelOptions(
  provider: Provider,
  service: "stt" | "tts",
  specs: RuntimeModelSpec[],
): ModelInfo[] {
  return specs.map(({ id, fallbackName }) => ({
    id,
    name: getCatalogSpeechModelLabel(provider, service, id) ?? fallbackName ?? id,
  }));
}

function toVoiceOptions(options: RuntimeVoiceOption[]): TtsVoiceOption[] {
  return options.map(({ id, label }) => ({ id, label }));
}

export const PROVIDER_STT_MODEL_OPTIONS: Partial<Record<Provider, ModelInfo[]>> =
  Object.fromEntries(
    Object.entries(RUNTIME_PROVIDER_MANIFEST).flatMap(([provider, manifest]) =>
      manifest.stt.models.length > 0
        ? [
            [
              provider,
              buildRuntimeSpeechModelOptions(
                provider as Provider,
                "stt",
                manifest.stt.models,
              ),
            ],
          ]
        : [],
    ),
  ) as Partial<Record<Provider, ModelInfo[]>>;

export const PROVIDER_DEFAULT_STT_MODELS: Partial<Record<Provider, string>> =
  Object.fromEntries(
    Object.entries(RUNTIME_PROVIDER_MANIFEST).flatMap(([provider, manifest]) =>
      manifest.stt.defaultModel ? [[provider, manifest.stt.defaultModel]] : [],
    ),
  ) as Partial<Record<Provider, string>>;

export function getProviderSttModelOptions(provider: Provider) {
  return PROVIDER_STT_MODEL_OPTIONS[provider] ?? [];
}

export function getSttModelLabel(provider: Provider, modelId: string) {
  const option = getProviderSttModelOptions(provider).find(
    (model) => model.id === modelId,
  );
  return option?.name ?? modelId;
}

export const PROVIDER_TTS_VOICE_OPTIONS: Partial<Record<Provider, TtsVoiceOption[]>> =
  Object.fromEntries(
    Object.entries(RUNTIME_PROVIDER_MANIFEST).flatMap(([provider, manifest]) =>
      manifest.tts.voiceOptions.length > 0
        ? [[provider, toVoiceOptions(manifest.tts.voiceOptions)]]
        : [],
    ),
  ) as Partial<Record<Provider, TtsVoiceOption[]>>;

export const PROVIDER_DEFAULT_TTS_VOICES: Partial<Record<Provider, string>> =
  Object.fromEntries(
    Object.entries(RUNTIME_PROVIDER_MANIFEST).flatMap(([provider, manifest]) =>
      manifest.tts.defaultVoice ? [[provider, manifest.tts.defaultVoice]] : [],
    ),
  ) as Partial<Record<Provider, string>>;

export const PROVIDER_TTS_MODEL_OPTIONS: Partial<Record<Provider, ModelInfo[]>> =
  Object.fromEntries(
    Object.entries(RUNTIME_PROVIDER_MANIFEST).flatMap(([provider, manifest]) =>
      manifest.tts.models.length > 0
        ? [
            [
              provider,
              buildRuntimeSpeechModelOptions(
                provider as Provider,
                "tts",
                manifest.tts.models,
              ),
            ],
          ]
        : [],
    ),
  ) as Partial<Record<Provider, ModelInfo[]>>;

export const PROVIDER_DEFAULT_TTS_MODELS: Partial<Record<Provider, string>> =
  Object.fromEntries(
    Object.entries(RUNTIME_PROVIDER_MANIFEST).flatMap(([provider, manifest]) =>
      manifest.tts.defaultModel ? [[provider, manifest.tts.defaultModel]] : [],
    ),
  ) as Partial<Record<Provider, string>>;

function localizeVoiceOptions(
  options: RuntimeVoiceOption[],
  language: AppLanguage,
): TtsVoiceOption[] {
  if (language === "en") {
    return toVoiceOptions(options);
  }

  return options.map(({ id, label, localizedLabels }) => ({
    id,
    label: localizedLabels?.de ?? label,
  }));
}

export function getProviderTtsVoiceOptions(
  provider: Provider,
  language: AppLanguage,
  modelId?: string,
) {
  const voiceOptions = RUNTIME_PROVIDER_MANIFEST[provider].tts.voiceOptions;

  return localizeVoiceOptions(
    modelId
      ? voiceOptions.filter(
          (voice) => !voice.modelIds || voice.modelIds.includes(modelId),
        )
      : voiceOptions,
    language,
  );
}

export function getProviderTtsModelOptions(provider: Provider) {
  return PROVIDER_TTS_MODEL_OPTIONS[provider] ?? [];
}

export function providerUsesTtsVoiceDirectory(provider: Provider) {
  return Boolean(RUNTIME_PROVIDER_MANIFEST[provider].tts.voiceDirectory);
}

export function providerRequiresTtsVoice(provider: Provider) {
  return RUNTIME_PROVIDER_MANIFEST[provider].tts.requiresVoice === true;
}

export function providerTtsModelSupportsInstructions(
  provider: Provider,
  modelId: string,
) {
  return (
    RUNTIME_PROVIDER_MANIFEST[provider].tts.models.find(
      (model) => model.id === modelId,
    )?.supportsInstructions === true
  );
}

export function getTtsModelLabel(provider: Provider, modelId: string) {
  const option = getProviderTtsModelOptions(provider).find(
    (model) => model.id === modelId,
  );
  return option?.name ?? modelId;
}

export function getTtsVoiceLabel(
  provider: Provider,
  voiceId: string,
  language: AppLanguage = "en",
) {
  const option = getProviderTtsVoiceOptions(provider, language).find(
    (voice) => voice.id === voiceId,
  );
  return option?.label ?? voiceId;
}
