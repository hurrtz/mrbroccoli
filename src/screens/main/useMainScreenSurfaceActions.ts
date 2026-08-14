import { useCallback } from "react";

import type { SettingsTab } from "../../features/settings-core/types";
import type { Provider, Settings } from "../../types";

interface MainScreenSurfaceActionsParams {
  handleCopyThread: (conversationId?: string) => Promise<void>;
  handleGenerateTitle: () => Promise<void>;
  handleRenameThread: (
    conversationId: string,
    nextTitle: string,
  ) => Promise<void>;
  handleShareThread: (conversationId?: string) => Promise<void>;
  openSettings: (focusProvider?: Provider, focusTab?: SettingsTab) => void;
  runAfterDrawerDismiss: (action: () => void) => void;
  setDrawerVisible: (visible: boolean) => void;
  setStyleSheetVisible: (visible: boolean) => void;
  updateSettings: (partial: Partial<Settings>) => void;
  webSearchActive: boolean;
}

export function useMainScreenSurfaceActions({
  handleCopyThread,
  handleGenerateTitle,
  handleRenameThread,
  handleShareThread,
  openSettings,
  runAfterDrawerDismiss,
  setDrawerVisible,
  setStyleSheetVisible,
  updateSettings,
  webSearchActive,
}: MainScreenSurfaceActionsParams) {
  const handleOpenDrawer = useCallback(() => {
    setDrawerVisible(true);
  }, [setDrawerVisible]);
  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, [setDrawerVisible]);
  const handleOpenMainSettings = useCallback(() => {
    openSettings();
  }, [openSettings]);
  const handleOpenProviderSettings = useCallback(() => {
    openSettings(undefined, "providers");
  }, [openSettings]);
  const handleOpenSpeakingSettings = useCallback(() => {
    openSettings(undefined, "tts");
  }, [openSettings]);
  const handleToggleWebSearch = useCallback(() => {
    updateSettings({
      webSearchMode: webSearchActive ? "off" : "on",
    });
  }, [updateSettings, webSearchActive]);
  const handleOpenConversationSettings = useCallback(() => {
    setStyleSheetVisible(true);
  }, [setStyleSheetVisible]);
  const handleCloseConversationSettings = useCallback(() => {
    setStyleSheetVisible(false);
  }, [setStyleSheetVisible]);
  const handleAutoRenameConversation = useCallback(() => {
    void handleGenerateTitle();
  }, [handleGenerateTitle]);
  const handleCopyDrawerThread = useCallback(
    (id: string) => {
      void handleCopyThread(id);
    },
    [handleCopyThread],
  );
  const handleShareDrawerThread = useCallback(
    (id: string) => {
      runAfterDrawerDismiss(() => {
        void handleShareThread(id);
      });
    },
    [handleShareThread, runAfterDrawerDismiss],
  );
  const handleRenameDrawerThread = useCallback(
    (id: string, title: string) => {
      void handleRenameThread(id, title);
    },
    [handleRenameThread],
  );

  return {
    handleAutoRenameConversation,
    handleCloseConversationSettings,
    handleCloseDrawer,
    handleCopyDrawerThread,
    handleOpenConversationSettings,
    handleOpenDrawer,
    handleOpenMainSettings,
    handleOpenProviderSettings,
    handleOpenSpeakingSettings,
    handleRenameDrawerThread,
    handleShareDrawerThread,
    handleToggleWebSearch,
  };
}
