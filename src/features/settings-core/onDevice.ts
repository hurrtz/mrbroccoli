import {
  getLocalModel,
  localModelSupportsLanguages,
  type LocalModelDefinition,
} from "../../constants/localModels";
import type { Settings, SpeechLanguage } from "../../types";

export function getLocalLanguageSettingsUpdate(
  settings: Settings,
  language: SpeechLanguage,
  singleChoice = false,
): Partial<Omit<Settings, "apiKeys" | "providerModels">> | null {
  const selected = settings.localLanguages.includes(language);
  const nextLanguages = singleChoice
    ? [language]
    : selected
      ? settings.localLanguages.filter((candidate) => candidate !== language)
      : [...settings.localLanguages, language];

  if (nextLanguages.length === 0) {
    return null;
  }

  const nextSettings: Partial<Omit<Settings, "apiKeys" | "providerModels">> = {
    localLanguages: nextLanguages,
    ttsListenLanguages: nextLanguages,
    sttLanguage: nextLanguages.length === 1 ? nextLanguages[0] : "auto",
  };

  if (
    settings.localSttModelId &&
    !localModelSupportsLanguages(
      getLocalModel(settings.localSttModelId),
      nextLanguages,
    )
  ) {
    nextSettings.localSttModelId = null;
    if (settings.sttMode === "local") {
      nextSettings.sttMode = "native";
    }
  }

  if (
    settings.localTtsModelId &&
    !localModelSupportsLanguages(
      getLocalModel(settings.localTtsModelId),
      nextLanguages,
    )
  ) {
    nextSettings.localTtsModelId = null;
    if (settings.ttsMode === "local") {
      nextSettings.ttsMode = "native";
    }
  }

  if (
    settings.ttsMode === "kokoro" &&
    !localModelSupportsLanguages(
      getLocalModel("kokoro-multilingual"),
      nextLanguages,
    )
  ) {
    nextSettings.ttsMode = "native";
  }

  return nextSettings;
}

export function getLocalModelRemovalSettingsUpdate(
  settings: Settings,
  model: LocalModelDefinition,
): Partial<Omit<Settings, "apiKeys" | "providerModels">> {
  const nextSettings: Partial<Omit<Settings, "apiKeys" | "providerModels">> =
    {};

  if (settings.localSttModelId === model.id) {
    nextSettings.localSttModelId = null;
    nextSettings.sttMode = "native";
  }
  if (
    settings.localTtsModelId === model.id ||
    (model.id === "kokoro-multilingual" && settings.ttsMode === "kokoro")
  ) {
    nextSettings.localTtsModelId = null;
    nextSettings.ttsMode = "native";
  }
  return nextSettings;
}
