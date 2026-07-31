import { useCallback } from "react";
import type {
  ResponseMode,
  ResponseModeRoute,
  Settings,
} from "../../types";
import {
  getDefaultAssistantInstructions,
  getDefaultTtsListenLanguages,
  isDefaultAssistantInstructions,
} from "../../types";
import {
  createApiKeyUpdater,
  createResponseModeAdder,
  createResponseModeRemover,
  createProviderModelUpdater,
  createResponseModeUpdater,
  updateTopLevelSettingsValue,
} from "./actionHelpers";
import type { PortableSettings } from "../../services/appDataBackup";
import { mergeSettings } from "./mergeStoredSettings";
import { persistPublicSettings } from "./storage";
import type { SettingsUpdate } from "./types";

interface UseSettingsActionsParams {
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function useSettingsActions({ setSettings }: UseSettingsActionsParams) {
  const updateSettings = useCallback((partial: SettingsUpdate) => {
    setSettings((prev) => {
      const nextLanguage = partial.language ?? prev.language;
      const shouldRefreshAssistantInstructions =
        partial.language &&
        partial.assistantInstructions === undefined &&
        isDefaultAssistantInstructions(prev.assistantInstructions);
      const nextTtsListenLanguages =
        partial.ttsListenLanguages ??
        (partial.language &&
        prev.ttsListenLanguages.join("|") ===
          getDefaultTtsListenLanguages(prev.language).join("|")
          ? getDefaultTtsListenLanguages(nextLanguage)
          : prev.ttsListenLanguages);

      const next = mergeSettings({
        ...prev,
        ...partial,
        ttsListenLanguages: nextTtsListenLanguages,
        assistantInstructions: shouldRefreshAssistantInstructions
          ? getDefaultAssistantInstructions(nextLanguage)
          : partial.assistantInstructions ?? prev.assistantInstructions,
        apiKeys: prev.apiKeys,
        providerModels: prev.providerModels,
        responseModes: partial.responseModes ?? prev.responseModes,
      });
      void persistPublicSettings(next);
      return next;
    });
  }, [setSettings]);

  const updateProviderModel = useCallback(
    createProviderModelUpdater(setSettings, "providerModels"),
    [setSettings],
  );

  const updateResponseModeRoute = useCallback(
    (mode: ResponseMode, value: ResponseModeRoute) => {
      createResponseModeUpdater(setSettings)(mode, value);
    },
    [setSettings],
  );

  const addResponseMode = useCallback(
    createResponseModeAdder(setSettings),
    [setSettings],
  );

  const removeResponseMode = useCallback(
    (mode: ResponseMode) => {
      createResponseModeRemover(setSettings)(mode);
    },
    [setSettings],
  );

  const updateActiveResponseMode = useCallback(
    (value: ResponseMode) => {
      updateTopLevelSettingsValue(setSettings, "activeResponseMode", value);
    },
    [setSettings],
  );

  const updateProviderTtsVoice = useCallback(
    createProviderModelUpdater(setSettings, "providerTtsVoices"),
    [setSettings],
  );

  const updateProviderTtsModel = useCallback(
    createProviderModelUpdater(setSettings, "providerTtsModels"),
    [setSettings],
  );

  const updateProviderSttModel = useCallback(
    createProviderModelUpdater(setSettings, "providerSttModels"),
    [setSettings],
  );

  const updateApiKey = useCallback(createApiKeyUpdater(setSettings), [setSettings]);
  const restorePortableSettings = useCallback(
    (portableSettings: PortableSettings) => {
      setSettings((current) => {
        const next = mergeSettings(
          {
            ...portableSettings,
            providerValidationResults: {},
            ulraModeActive: false,
          },
          current.apiKeys,
        );
        void persistPublicSettings(next);
        return next;
      });
    },
    [setSettings],
  );

  return {
    updateSettings,
    updateProviderModel,
    updateProviderSttModel,
    updateProviderTtsModel,
    updateResponseModeRoute,
    addResponseMode,
    removeResponseMode,
    updateActiveResponseMode,
    updateProviderTtsVoice,
    updateApiKey,
    restorePortableSettings,
  };
}
