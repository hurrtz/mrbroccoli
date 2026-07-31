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
  const memoised = useMemo<SettingsContextValue>(
    () => value,
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
      value.restorePortableSettings,
    ],
  );

  return (
    <SettingsContext.Provider value={memoised}>{children}</SettingsContext.Provider>
  );
}

export function useSharedSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSharedSettings must be used within a SettingsProvider");
  }

  return context;
}
