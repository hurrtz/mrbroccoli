import { useCallback } from "react";

import type { SettingsTab } from "../../features/settings-core/types";
import type { Provider, Settings } from "../../types";
import type { SetupGuideStep } from "./setupGuideSupport";

interface MainScreenSurfaceActionsParams {
  closeSettings: () => void;
  handleClearMemory: () => Promise<void>;
  handleCopyMemory: () => Promise<void>;
  handleCopyThread: (conversationId?: string) => Promise<void>;
  handleFinishSetupGuide: () => Promise<void>;
  handleGenerateTitle: () => Promise<void>;
  handleOpenSettingsFromSummary: () => Promise<void>;
  handleOpenSetupGuide: (
    step?: SetupGuideStep,
    source?: "settings" | "app",
  ) => void;
  handleRenameThread: (
    conversationId: string,
    nextTitle: string,
  ) => Promise<void>;
  handleShareThread: (conversationId?: string) => Promise<void>;
  handleValidateProviderKey: () => Promise<boolean>;
  openMemory: (conversationId?: string) => Promise<void>;
  openSettings: (focusProvider?: Provider, focusTab?: SettingsTab) => void;
  runAfterDrawerDismiss: (action: () => void) => void;
  setDrawerVisible: (visible: boolean) => void;
  setStyleSheetVisible: (visible: boolean) => void;
  setupGuideVoiceTest: {
    handleAction: () => Promise<void>;
    reset: (stopPlayback: boolean) => Promise<void>;
  };
  updateSettings: (partial: Partial<Settings>) => void;
  webSearchActive: boolean;
}

export function useMainScreenSurfaceActions({
  closeSettings,
  handleClearMemory,
  handleCopyMemory,
  handleCopyThread,
  handleFinishSetupGuide,
  handleGenerateTitle,
  handleOpenSettingsFromSummary,
  handleOpenSetupGuide,
  handleRenameThread,
  handleShareThread,
  handleValidateProviderKey,
  openMemory,
  openSettings,
  runAfterDrawerDismiss,
  setDrawerVisible,
  setStyleSheetVisible,
  setupGuideVoiceTest,
  updateSettings,
  webSearchActive,
}: MainScreenSurfaceActionsParams) {
  const {
    handleAction: handleSetupGuideVoiceTest,
    reset: resetSetupGuideVoiceTest,
  } = setupGuideVoiceTest;
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
  const handleOpenSetupGuideFromSettings = useCallback(() => {
    closeSettings();
    handleOpenSetupGuide("intro", "settings");
  }, [closeSettings, handleOpenSetupGuide]);
  const handleAutoRenameConversation = useCallback(() => {
    void handleGenerateTitle();
  }, [handleGenerateTitle]);
  const handleValidateSetupGuideProviderKey = useCallback(() => {
    void handleValidateProviderKey();
  }, [handleValidateProviderKey]);
  const handleSetupGuideVoiceTestAction = useCallback(() => {
    void handleSetupGuideVoiceTest();
  }, [handleSetupGuideVoiceTest]);
  const handleResetSetupGuideVoiceTest = useCallback(() => {
    void resetSetupGuideVoiceTest(true);
  }, [resetSetupGuideVoiceTest]);
  const handleFinishSetupGuidePress = useCallback(() => {
    void handleFinishSetupGuide();
  }, [handleFinishSetupGuide]);
  const handleOpenSettingsFromSetupGuide = useCallback(() => {
    void handleOpenSettingsFromSummary();
  }, [handleOpenSettingsFromSummary]);
  const handleSetupGuideShortcutVisibilityChange = useCallback(
    (visible: boolean) => {
      updateSettings({ showSetupGuideShortcut: visible });
    },
    [updateSettings],
  );
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
    handleFinishSetupGuidePress,
    handleManageDrawerMemory,
    handleOpenConversationSettings,
    handleOpenDrawer,
    handleOpenMainSettings,
    handleOpenProviderSettings,
    handleOpenSettingsFromSetupGuide,
    handleOpenSetupGuideFromSettings,
    handleOpenSpeakingSettings,
    handleRenameDrawerThread,
    handleResetSetupGuideVoiceTest,
    handleSetupGuideShortcutVisibilityChange,
    handleSetupGuideVoiceTestAction,
    handleShareDrawerThread,
    handleToggleWebSearch,
    handleValidateSetupGuideProviderKey,
  };
}
