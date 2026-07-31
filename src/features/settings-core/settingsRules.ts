import {
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  getProviderSttModelOptions,
  getProviderTtsModelOptions,
  getProviderTtsVoiceOptions,
  providerUsesTtsVoiceDirectory,
} from "../../constants/models";
import { getTtsFallbackRoutes } from "../../constants/ttsFallback";
import {
  Provider,
  ProviderSttModelSelections,
  ProviderTtsModelSelections,
  ProviderTtsVoiceSelections,
  ResponseModeSelections,
  Settings,
} from "../../types";
import {
  getDefaultModelForProvider,
  isValidModelForProvider,
} from "../../utils/responseModes";
import { normalizeResponseModeRouteEffort } from "../../utils/modelEffort";

function routesEqual(
  left: ResponseModeSelections[number]["route"],
  right: ResponseModeSelections[number]["route"],
) {
  return (
    left.provider === right.provider &&
    left.model === right.model &&
    left.effort === right.effort
  );
}

export function getNormalizedSttProvider(
  settings: Settings,
  enabledSttProviders: Provider[],
) {
  if (settings.sttMode !== "provider") {
    return null;
  }

  const nextProvider =
    settings.sttProvider && enabledSttProviders.includes(settings.sttProvider)
      ? settings.sttProvider
      : (enabledSttProviders[0] ?? null);

  return nextProvider !== settings.sttProvider ? nextProvider : null;
}

export function getNormalizedResponseModes(
  settings: Settings,
  enabledProviders: Provider[],
): ResponseModeSelections | null {
  if (enabledProviders.length === 0) {
    return null;
  }

  let changed = false;
  const nextResponseModes = settings.responseModes.map((entry) => ({ ...entry }));

  for (const mode of nextResponseModes) {
    const currentRoute = mode.route;

    if (enabledProviders.includes(currentRoute.provider)) {
      const normalizedRoute = normalizeResponseModeRouteEffort(currentRoute);

      if (!routesEqual(currentRoute, normalizedRoute)) {
        mode.route = normalizedRoute;
        changed = true;
      }

      continue;
    }

    const nextProvider = enabledProviders[0];
    const preferredModel = settings.providerModels[nextProvider];
    const nextModel = isValidModelForProvider(nextProvider, preferredModel)
      ? preferredModel
      : getDefaultModelForProvider(nextProvider);

    mode.route = normalizeResponseModeRouteEffort({
      provider: nextProvider,
      model: nextModel,
    });
    changed = true;
  }

  return changed ? nextResponseModes : null;
}

export function getNormalizedTtsProvider(
  settings: Settings,
  enabledTtsProviders: Provider[],
) {
  const providerRouteActive =
    settings.ttsMode === "provider" ||
    getTtsFallbackRoutes(
      settings.ttsFallbackPolicy,
      settings.ttsMode,
    ).includes("provider");

  if (!providerRouteActive) {
    return null;
  }

  const nextProvider =
    settings.ttsProvider && enabledTtsProviders.includes(settings.ttsProvider)
      ? settings.ttsProvider
      : (enabledTtsProviders[0] ?? null);

  return nextProvider !== settings.ttsProvider ? nextProvider : null;
}

export function getNormalizedProviderSttModels(
  settings: Settings,
  enabledSttProviders: Provider[],
): ProviderSttModelSelections | null {
  if (settings.sttMode !== "provider") {
    return null;
  }

  const nextProviderSttModels = { ...settings.providerSttModels };
  let changed = false;

  for (const provider of enabledSttProviders) {
    const supportedModels = getProviderSttModelOptions(provider);
    const defaultModel = supportedModels[0]?.id;

    if (!supportedModels.length || !defaultModel) {
      continue;
    }

    const currentModel = nextProviderSttModels[provider];
    const isValid = supportedModels.some((model) => model.id === currentModel);

    if (!isValid) {
      nextProviderSttModels[provider] = defaultModel;
      changed = true;
    }
  }

  return changed ? nextProviderSttModels : null;
}

export function getNormalizedProviderTtsModels(
  settings: Settings,
  enabledTtsProviders: Provider[],
): ProviderTtsModelSelections | null {
  const nextProviderTtsModels = { ...settings.providerTtsModels };
  let changed = false;

  for (const provider of enabledTtsProviders) {
    const supportedModels = getProviderTtsModelOptions(provider);
    const defaultModel =
      supportedModels.some(
        (model) => model.id === PROVIDER_DEFAULT_TTS_MODELS[provider],
      )
        ? PROVIDER_DEFAULT_TTS_MODELS[provider]
        : supportedModels[0]?.id;

    if (!supportedModels.length || !defaultModel) {
      continue;
    }

    const currentModel = nextProviderTtsModels[provider];
    const isValid = supportedModels.some((model) => model.id === currentModel);

    if (!isValid) {
      nextProviderTtsModels[provider] = defaultModel;
      changed = true;
    }
  }

  return changed ? nextProviderTtsModels : null;
}

export function getNormalizedProviderTtsVoices(
  settings: Settings,
  enabledTtsProviders: Provider[],
  language: Settings["language"],
): ProviderTtsVoiceSelections | null {
  const nextProviderTtsVoices = { ...settings.providerTtsVoices };
  let changed = false;

  for (const provider of enabledTtsProviders) {
    const currentVoice = nextProviderTtsVoices[provider];

    if (providerUsesTtsVoiceDirectory(provider) && currentVoice?.trim()) {
      continue;
    }

    const supportedVoices = getProviderTtsVoiceOptions(
      provider,
      language,
      settings.providerTtsModels[provider] ||
        PROVIDER_DEFAULT_TTS_MODELS[provider],
    );
    const defaultVoice =
      PROVIDER_DEFAULT_TTS_VOICES[provider] || supportedVoices[0]?.id;

    if (!supportedVoices.length || !defaultVoice) {
      continue;
    }

    const isValid = supportedVoices.some((voice) => voice.id === currentVoice);

    if (!isValid) {
      nextProviderTtsVoices[provider] = defaultVoice;
      changed = true;
    }
  }

  return changed ? nextProviderTtsVoices : null;
}
