import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConversationDrawer } from "../../components/ConversationDrawer";
import { ConversationMemoryModal } from "../../components/ConversationMemoryModal";
import { SetupGuideModal } from "../../components/SetupGuideModal";
import { FreeOfflineSetupScreen } from "../../components/FreeOfflineSetupScreen";
import { PremiumUpgradeModal } from "../../components/PremiumUpgradeModal";
import { Toast } from "../../components/Toast";
import { AntSettingsModal } from "../../features/settings/AntSettingsModal";
import { Colors } from "../../theme/colors";
import { MainScreenWorkspace } from "./MainScreenWorkspace";
import { StatusDetailsModal } from "./StatusDetailsModal";
import { StyleSheetModal } from "./StyleSheetModal";
import { styles } from "./styles";

interface MainScreenPresentationProps {
  colors: Colors;
  conversationDrawer: React.ComponentProps<typeof ConversationDrawer>;
  conversationMemory: React.ComponentProps<typeof ConversationMemoryModal>;
  freeOffline: React.ComponentProps<typeof FreeOfflineSetupScreen>;
  isDark: boolean;
  isLandscape: boolean;
  premiumUpgrade: React.ComponentProps<typeof PremiumUpgradeModal>;
  settingsModal: React.ComponentProps<typeof AntSettingsModal>;
  setupGuide: React.ComponentProps<typeof SetupGuideModal>;
  statusDetails: React.ComponentProps<typeof StatusDetailsModal>;
  styleSheet: React.ComponentProps<typeof StyleSheetModal>;
  toast: React.ComponentProps<typeof Toast>;
  workspace: React.ComponentProps<typeof MainScreenWorkspace>;
}

export function MainScreenPresentation({
  colors,
  conversationDrawer,
  conversationMemory,
  freeOffline,
  isDark,
  isLandscape,
  premiumUpgrade,
  settingsModal,
  setupGuide,
  statusDetails,
  styleSheet,
  toast,
  workspace,
}: MainScreenPresentationProps) {
  return (
    <SafeAreaView
      testID="main-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={
        Platform.OS === "ios" && isLandscape
          ? ["top"]
          : ["top", "left", "right"]
      }
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <Toast {...toast} />

      {freeOffline.controller.setupVisible ? (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            style={[
              styles.defaultLayout,
              isLandscape ? styles.defaultLayoutLandscape : null,
            ]}
          >
            <FreeOfflineSetupScreen {...freeOffline} />
          </KeyboardAvoidingView>
          {/* The purchase path must stay reachable while setup blocks the
              workspace; otherwise unsupported devices can never buy Premium. */}
          <PremiumUpgradeModal {...premiumUpgrade} />
        </>
      ) : (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            style={[
              styles.defaultLayout,
              isLandscape ? styles.defaultLayoutLandscape : null,
            ]}
          >
            <MainScreenWorkspace {...workspace} />
          </KeyboardAvoidingView>

          <StyleSheetModal {...styleSheet} />
          <StatusDetailsModal {...statusDetails} />
          <AntSettingsModal {...settingsModal} />
          <SetupGuideModal {...setupGuide} />
          <PremiumUpgradeModal {...premiumUpgrade} />
          <ConversationMemoryModal {...conversationMemory} />
          <ConversationDrawer {...conversationDrawer} />
        </>
      )}
    </SafeAreaView>
  );
}
