import React, { createContext, useContext, useMemo } from "react";
import { useSettings } from "../hooks/useSettings";

type SettingsContextValue = ReturnType<typeof useSettings>;

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useSettings();
  const memoizedValue = useMemo<SettingsContextValue>(
    () => ({
      settings: value.settings,
      loaded: value.loaded,
      updateSettings: value.updateSettings,
      updateProviderModel: value.updateProviderModel,
      updateProviderSttModel: value.updateProviderSttModel,
      updateProviderTtsModel: value.updateProviderTtsModel,
      updateResponseModeRoute: value.updateResponseModeRoute,
      addResponseMode: value.addResponseMode,
      removeResponseMode: value.removeResponseMode,
      updateActiveResponseMode: value.updateActiveResponseMode,
      updateProviderTtsVoice: value.updateProviderTtsVoice,
      updateApiKey: value.updateApiKey,
      updateProviderValidationResult: value.updateProviderValidationResult,
      restorePortableSettings: value.restorePortableSettings,
    }),
    [
      value.settings,
      value.loaded,
      value.updateSettings,
      value.updateProviderModel,
      value.updateProviderSttModel,
      value.updateProviderTtsModel,
      value.updateResponseModeRoute,
      value.addResponseMode,
      value.removeResponseMode,
      value.updateActiveResponseMode,
      value.updateProviderTtsVoice,
      value.updateApiKey,
      value.updateProviderValidationResult,
      value.restorePortableSettings,
    ],
  );

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSharedSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSharedSettings must be used within a SettingsProvider");
  }

  return context;
}
