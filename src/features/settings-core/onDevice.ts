import {
  getLocalModel,
  localModelSupportsLanguages,
} from "../../constants/localModels";
import type { Settings, SpeechLanguage } from "../../types";
import { deriveResponseModesForProvider } from "../../utils/responseModes";

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

  let responseModes = settings.responseModes.filter(({ route }) => {
    return (
      !route.localModelId ||
      localModelSupportsLanguages(
        getLocalModel(route.localModelId),
        nextLanguages,
      )
    );
  });
  if (responseModes.length !== settings.responseModes.length) {
    if (responseModes.length === 0) {
      responseModes = deriveResponseModesForProvider(settings.lastProvider, 1);
    }
    nextSettings.responseModes = responseModes;
    if (!responseModes.some(({ id }) => id === settings.activeResponseMode)) {
      nextSettings.activeResponseMode = responseModes[0].id;
    }
  }

  return nextSettings;
}
