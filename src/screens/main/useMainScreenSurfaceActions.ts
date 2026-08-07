import { useCallback } from "react";

import type { SettingsTab } from "../../features/settings-core/types";
import type { Provider, Settings } from "../../types";

interface MainScreenSurfaceActionsParams {
  handleClearMemory: () => Promise<void>;
  handleCopyMemory: () => Promise<void>;
  handleCopyThread: (conversationId?: string) => Promise<void>;
  handleGenerateTitle: () => Promise<void>;
  handleRenameThread: (
    conversationId: string,
    nextTitle: string,
  ) => Promise<void>;
  handleShareThread: (conversationId?: string) => Promise<void>;
  openMemory: (conversationId?: string) => Promise<void>;
  openSettings: (focusProvider?: Provider, focusTab?: SettingsTab) => void;
  runAfterDrawerDismiss: (action: () => void) => void;
  setDrawerVisible: (visible: boolean) => void;
  setStyleSheetVisible: (visible: boolean) => void;
  updateSettings: (partial: Partial<Settings>) => void;
  webSearchActive: boolean;
}

export function useMainScreenSurfaceActions({
  handleClearMemory,
  handleCopyMemory,
  handleCopyThread,
  handleGenerateTitle,
  handleRenameThread,
  handleShareThread,
  openMemory,
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
  const handleCopyMemoryPress = useCallback(() => {
    void handleCopyMemory();
  }, [handleCopyMemory]);
  const handleClearMemoryPress = useCallback(() => {
    void handleClearMemory();
  }, [handleClearMemory]);
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
  const handleManageDrawerMemory = useCallback(
    (id: string) => {
      runAfterDrawerDismiss(() => {
        void openMemory(id);
      });
    },
    [openMemory, runAfterDrawerDismiss],
  );
  const handleRenameDrawerThread = useCallback(
    (id: string, title: string) => {
      void handleRenameThread(id, title);
    },
    [handleRenameThread],
  );

  return {
    handleAutoRenameConversation,
    handleClearMemoryPress,
    handleCloseConversationSettings,
    handleCloseDrawer,
    handleCopyDrawerThread,
    handleCopyMemoryPress,
    handleManageDrawerMemory,
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
