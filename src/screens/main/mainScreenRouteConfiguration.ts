import {
  PROVIDER_DEFAULT_STT_MODELS,
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LABELS,
  getProviderTtsVoiceOptions,
  getTtsModelLabel,
  providerTtsModelSupportsInstructions,
} from "../../constants/models";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import { providerHasVoiceDirectory } from "../../services/providerVoiceDirectory";
import type { AppLanguage, Provider, Settings } from "../../types";
import {
  getEnabledSttProviders,
  getEnabledTtsProviders,
} from "../../utils/providerCapabilities";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";
import {
  getAvailableResponseModes,
  getResponseModeRoute,
} from "../../utils/responseModes";

export function getMainScreenRouteConfiguration(
  settings: Settings,
  conversationsLoaded: boolean,
) {
  const activeResponseMode = settings.activeResponseMode;
  const activeResponseRoute = getResponseModeRoute(settings);
  const provider = activeResponseRoute.provider;
  const providerApiKey = settings.apiKeys[provider].trim();
  const model = activeResponseRoute.model;
  const modelEffort = activeResponseRoute.effort;
  const availableResponseModes = getAvailableResponseModes(settings);
  const availableSttProviders = getEnabledSttProviders(settings);
  const availableTtsProviders = getEnabledTtsProviders(settings);
  const sttProvider =
    settings.sttMode === "provider" ? settings.sttProvider : null;
  const ttsProvider = settings.ttsProvider;
  const webSearchProvider = settings.webSearchProvider;
  const webSearchMode = settings.webSearchMode;
  const sttApiKey = sttProvider
    ? settings.apiKeys[sttProvider].trim()
    : "";
  const ttsApiKey = ttsProvider
    ? settings.apiKeys[ttsProvider].trim()
    : "";
  const webSearchApiKey = webSearchProvider
    ? settings.apiKeys[webSearchProvider].trim()
    : "";
  const webSearchOptions = webSearchProvider
    ? settings.webSearchProviderSettings[webSearchProvider]
    : undefined;
  const webSearchReady =
    !!webSearchProvider &&
    hasProviderCredentialForCapability(
      webSearchProvider,
      webSearchApiKey,
      "search",
    );
  const selectedSttModel = sttProvider
    ? settings.providerSttModels[sttProvider] ||
      PROVIDER_DEFAULT_STT_MODELS[sttProvider] ||
      ""
    : "";
  const globalSelectedTtsVoice = ttsProvider
    ? settings.providerTtsVoices[ttsProvider] ||
      PROVIDER_DEFAULT_TTS_VOICES[ttsProvider] ||
      ""
    : "";
  const selectedTtsModel = ttsProvider
    ? settings.providerTtsModels[ttsProvider] ||
      PROVIDER_DEFAULT_TTS_MODELS[ttsProvider] ||
      ""
    : "";

  return {
    activeResponseMode,
    availableResponseModes,
    availableSttProviders,
    availableTtsProviders,
    globalSelectedTtsVoice,
    model,
    modelEffort,
    provider,
    providerApiKey,
    providerLabel: PROVIDER_LABELS[provider],
    selectedSttModel,
    selectedTtsModel,
    sttApiKey,
    sttProvider,
    ttsApiKey,
    ttsProvider,
    voiceInputDisabled:
      !conversationsLoaded ||
      !hasProviderCredentialForCapability(
        provider,
        providerApiKey,
        "llm",
      ),
    webSearchActive: webSearchMode !== "off" && webSearchReady,
    webSearchApiKey,
    webSearchMode,
    webSearchOptions,
    webSearchProvider,
    webSearchReady,
  };
}

export function getConversationTtsControlState(params: {
  language: AppLanguage;
  providerVoiceDirectories: ProviderVoiceDirectories;
  selectedTtsModel: string;
  settings: Settings;
  ttsProvider: Provider | null;
}) {
  const {
    language,
    providerVoiceDirectories,
    selectedTtsModel,
    settings,
    ttsProvider,
  } = params;
  const providerTtsEnabled =
    settings.ttsMode === "provider" && Boolean(ttsProvider);

  if (!providerTtsEnabled || !ttsProvider) {
    return {
      conversationTtsRouteLabel: null,
      conversationTtsVoiceOptions: [],
      ttsInstructionsSupported: false,
    };
  }

  const voices = providerHasVoiceDirectory(ttsProvider)
    ? providerVoiceDirectories[ttsProvider]?.voices.length
      ? providerVoiceDirectories[ttsProvider]?.voices ?? []
      : getProviderTtsVoiceOptions(
          ttsProvider,
          language,
          selectedTtsModel,
        )
    : getProviderTtsVoiceOptions(
        ttsProvider,
        language,
        selectedTtsModel,
      );
  const conversationTtsVoiceOptions = voices.map((voice) => ({
    value:
      "value" in voice && typeof voice.value === "string"
        ? voice.value
        : voice.id,
    label: voice.label,
  }));

  return {
    conversationTtsRouteLabel: selectedTtsModel
      ? `${PROVIDER_LABELS[ttsProvider]} · ${getTtsModelLabel(
          ttsProvider,
          selectedTtsModel,
        )}`
      : null,
    conversationTtsVoiceOptions,
    ttsInstructionsSupported: providerTtsModelSupportsInstructions(
      ttsProvider,
      selectedTtsModel,
    ),
  };
}
