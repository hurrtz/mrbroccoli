import { useCallback, useRef, useState } from "react";

import { getCatalogProviderIdForAppProvider } from "../../catalog/appProviders";
import type { CatalogProviderId } from "../../catalog/types";
import type { SettingsTab } from "../../features/settings-core/types";
import { Conversation, Provider } from "../../types";

export function useMainScreenUiState() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsFocusCatalogProviderId, setSettingsFocusCatalogProviderId] =
    useState<CatalogProviderId | undefined>();
  const [settingsFocusTab, setSettingsFocusTab] = useState<SettingsTab | undefined>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusDetailsVisible, setStatusDetailsVisible] = useState(false);
  const [setupGuideVisible, setSetupGuideVisible] = useState(false);
  const [memoryConversation, setMemoryConversation] =
    useState<Conversation | null>(null);
  const [memoryVisible, setMemoryVisible] = useState(false);
  const pendingDrawerDismissActionRef = useRef<null | (() => void)>(null);

  const openSettings = useCallback(
    (focusProvider?: Provider, focusTab?: SettingsTab) => {
    setSettingsFocusCatalogProviderId(
      focusProvider ? getCatalogProviderIdForAppProvider(focusProvider) : undefined,
    );
    setSettingsFocusTab(focusTab);
    setSettingsVisible(true);
    },
    [],
  );

  const openCatalogSettings = useCallback(
    (focusCatalogProviderId?: CatalogProviderId) => {
      setSettingsFocusCatalogProviderId(focusCatalogProviderId);
      setSettingsFocusTab(undefined);
      setSettingsVisible(true);
    },
    [],
  );

  const closeSettings = useCallback(() => {
    setSettingsVisible(false);
    setSettingsFocusCatalogProviderId(undefined);
    setSettingsFocusTab(undefined);
  }, []);

  const openMemoryConversation = useCallback((conversation: Conversation) => {
    setMemoryConversation(conversation);
    setMemoryVisible(true);
  }, []);

  const closeMemory = useCallback(() => {
    setMemoryVisible(false);
    setMemoryConversation(null);
  }, []);

  const openStatusDetails = useCallback(() => {
    setStatusDetailsVisible(true);
  }, []);

  const closeStatusDetails = useCallback(() => {
    setStatusDetailsVisible(false);
  }, []);

  const runAfterDrawerDismiss = useCallback(
    (action: () => void) => {
      if (!drawerVisible) {
        action();
        return;
      }

      pendingDrawerDismissActionRef.current = action;
      setDrawerVisible(false);
    },
    [drawerVisible],
  );

  const handleDrawerDismiss = useCallback(() => {
    const pendingAction = pendingDrawerDismissActionRef.current;
    pendingDrawerDismissActionRef.current = null;
    pendingAction?.();
  }, []);

  return {
    settingsVisible,
    settingsFocusCatalogProviderId,
    settingsFocusTab,
    drawerVisible,
    statusDetailsVisible,
    setupGuideVisible,
    memoryConversation,
    memoryVisible,
    setDrawerVisible,
    setSetupGuideVisible,
    setMemoryConversation,
    openSettings,
    openCatalogSettings,
    closeSettings,
    openMemoryConversation,
    closeMemory,
    openStatusDetails,
    closeStatusDetails,
    runAfterDrawerDismiss,
    handleDrawerDismiss,
  };
}
