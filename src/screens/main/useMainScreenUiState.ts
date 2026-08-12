import { useCallback, useEffect, useRef, useState } from "react";

import { getCatalogProviderIdForAppProvider } from "../../catalog/appProviders";
import type { CatalogProviderId } from "../../catalog/types";
import type {
  SettingsPage,
  SettingsTab,
} from "../../features/settings-core/types";
import { Conversation, Provider } from "../../types";

export function useMainScreenUiState() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsFocusCatalogProviderId, setSettingsFocusCatalogProviderId] =
    useState<CatalogProviderId | undefined>();
  const [settingsFocusTab, setSettingsFocusTab] = useState<
    SettingsTab | undefined
  >();
  const [settingsFocusPage, setSettingsFocusPage] = useState<
    SettingsPage | undefined
  >();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusDetailsVisible, setStatusDetailsVisible] = useState(false);
  const [routePickerVisible, setRoutePickerVisible] = useState(false);
  const [transcriptSheetVisible, setTranscriptSheetVisible] = useState(false);
  const [memoryConversation, setMemoryConversation] =
    useState<Conversation | null>(null);
  const [memoryVisible, setMemoryVisible] = useState(false);
  const pendingDrawerDismissActionRef = useRef<null | (() => void)>(null);
  const pendingTranscriptDismissActionRef = useRef<null | (() => void)>(null);

  const openSettings = useCallback(
    (
      focusProvider?: Provider,
      focusTab?: SettingsTab,
      focusPage?: SettingsPage,
    ) => {
      setSettingsFocusCatalogProviderId(
        focusProvider
          ? getCatalogProviderIdForAppProvider(focusProvider)
          : undefined,
      );
      setSettingsFocusTab(focusTab);
      setSettingsFocusPage(focusPage);
      setSettingsVisible(true);
    },
    [],
  );

  const openCatalogSettings = useCallback(
    (focusCatalogProviderId?: CatalogProviderId) => {
      setSettingsFocusCatalogProviderId(focusCatalogProviderId);
      setSettingsFocusTab(undefined);
      setSettingsFocusPage(undefined);
      setSettingsVisible(true);
    },
    [],
  );

  const closeSettings = useCallback(() => {
    setSettingsVisible(false);
    setSettingsFocusCatalogProviderId(undefined);
    setSettingsFocusTab(undefined);
    // The modal recomputes its landing page every time it becomes visible, so a
    // focus target left behind here would send the next plain open to whatever
    // page the last deep link chose.
    setSettingsFocusPage(undefined);
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

  const openRoutePicker = useCallback(() => {
    setRoutePickerVisible(true);
  }, []);

  const closeRoutePicker = useCallback(() => {
    setRoutePickerVisible(false);
  }, []);

  const openTranscriptSheet = useCallback(() => {
    setTranscriptSheetVisible(true);
  }, []);

  const closeTranscriptSheet = useCallback(() => {
    setTranscriptSheetVisible(false);
  }, []);

  const runAfterTranscriptDismiss = useCallback(
    (action: () => void) => {
      if (!transcriptSheetVisible) {
        action();
        return;
      }

      pendingTranscriptDismissActionRef.current = action;
      setTranscriptSheetVisible(false);
    },
    [transcriptSheetVisible],
  );

  const handleTranscriptDismiss = useCallback(() => {
    const pendingAction = pendingTranscriptDismissActionRef.current;
    pendingTranscriptDismissActionRef.current = null;
    pendingAction?.();
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

  // React Native delivers Modal onDismiss on iOS only, so the drawer's
  // deferred actions (share thread, manage memory) would never run on
  // Android. This fallback drains the pending action once the drawer state
  // is hidden; the delay leaves room for the native modal teardown, and the
  // ref is consumed atomically so an earlier iOS onDismiss wins harmlessly.
  useEffect(() => {
    if (drawerVisible || !pendingDrawerDismissActionRef.current) {
      return;
    }

    const timer = setTimeout(handleDrawerDismiss, 350);
    return () => clearTimeout(timer);
  }, [drawerVisible, handleDrawerDismiss]);

  // The design-system sheet keeps its native Modal mounted through the exit
  // animation. iOS reports the real dismissal; Android needs this fallback
  // before another sibling Modal may be presented safely.
  useEffect(() => {
    if (transcriptSheetVisible || !pendingTranscriptDismissActionRef.current) {
      return;
    }

    const timer = setTimeout(handleTranscriptDismiss, 350);
    return () => clearTimeout(timer);
  }, [handleTranscriptDismiss, transcriptSheetVisible]);

  return {
    settingsVisible,
    settingsFocusCatalogProviderId,
    settingsFocusTab,
    settingsFocusPage,
    drawerVisible,
    routePickerVisible,
    statusDetailsVisible,
    transcriptSheetVisible,
    memoryConversation,
    memoryVisible,
    setDrawerVisible,
    setMemoryConversation,
    openSettings,
    openCatalogSettings,
    closeSettings,
    openMemoryConversation,
    closeMemory,
    openStatusDetails,
    closeStatusDetails,
    openRoutePicker,
    closeRoutePicker,
    openTranscriptSheet,
    closeTranscriptSheet,
    runAfterTranscriptDismiss,
    handleTranscriptDismiss,
    runAfterDrawerDismiss,
    handleDrawerDismiss,
  };
}
