import { useEffect } from "react";

import { Provider, ResponseMode, Settings } from "../../types";
import { getResponseModeRoute } from "../../utils/responseModes";

interface UseProviderAvailabilityGuardsParams {
  activeResponseMode: ResponseMode;
  availableResponseModes: ResponseMode[];
  availableSttProviders: Provider[];
  availableTtsProviders: Provider[];
  loaded: boolean;
  providerApiKey: string;
  settings: Settings;
  sttProvider: Provider | null;
  ttsProvider: Provider | null;
  updateActiveResponseMode: (value: ResponseMode) => void;
  updateSettings: (partial: Partial<Settings>) => void;
}

export function useProviderAvailabilityGuards({
  activeResponseMode,
  availableResponseModes,
  availableSttProviders,
  availableTtsProviders,
  loaded,
  providerApiKey,
  settings,
  sttProvider,
  ttsProvider,
  updateActiveResponseMode,
  updateSettings,
}: UseProviderAvailabilityGuardsParams) {
  useEffect(() => {
    const activeRoute = getResponseModeRoute(settings, activeResponseMode);
    if (!loaded || providerApiKey || activeRoute?.runtime === "local") {
      return;
    }

    const fallbackMode = availableResponseModes[0];

    if (fallbackMode && fallbackMode !== activeResponseMode) {
      updateActiveResponseMode(fallbackMode);
    }
  }, [
    activeResponseMode,
    availableResponseModes,
    loaded,
    providerApiKey,
    settings,
    updateActiveResponseMode,
  ]);

  useEffect(() => {
    if (!loaded || settings.sttMode !== "provider") {
      return;
    }

    const nextProvider =
      sttProvider && availableSttProviders.includes(sttProvider)
        ? sttProvider
        : (availableSttProviders[0] ?? null);

    if (nextProvider !== settings.sttProvider) {
      updateSettings({ sttProvider: nextProvider });
    }
  }, [
    availableSttProviders,
    loaded,
    settings.sttMode,
    settings.sttProvider,
    sttProvider,
    updateSettings,
  ]);

  useEffect(() => {
    if (!loaded || settings.ttsMode !== "provider") {
      return;
    }

    const nextProvider =
      ttsProvider && availableTtsProviders.includes(ttsProvider)
        ? ttsProvider
        : (availableTtsProviders[0] ?? null);

    if (nextProvider !== settings.ttsProvider) {
      updateSettings({ ttsProvider: nextProvider });
    }
  }, [
    availableTtsProviders,
    loaded,
    settings.ttsMode,
    settings.ttsProvider,
    ttsProvider,
    updateSettings,
  ]);
}
