import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConversationDrawer } from "../../components/ConversationDrawer";
import { IntroFlowScreen } from "../../components/introFlow/IntroFlowScreen";
import { ConversationMemoryModal } from "../../components/ConversationMemoryModal";
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
  intro: React.ComponentProps<typeof IntroFlowScreen>;
  isDark: boolean;
  isLandscape: boolean;
  premiumUpgrade: React.ComponentProps<typeof PremiumUpgradeModal>;
  settingsModal: React.ComponentProps<typeof AntSettingsModal>;
  statusDetails: React.ComponentProps<typeof StatusDetailsModal>;
  styleSheet: React.ComponentProps<typeof StyleSheetModal>;
  toast: React.ComponentProps<typeof Toast>;
  workspace: React.ComponentProps<typeof MainScreenWorkspace>;
}

export function MainScreenPresentation({
  colors,
  conversationDrawer,
  conversationMemory,
  intro,
  isDark,
  isLandscape,
  premiumUpgrade,
  settingsModal,
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

      {/* Setup no longer takes the screen. A new user lands in the real
          workspace and is offered a path from the intro banner, or contextually
          when they try a turn with nothing configured. */}
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
      <PremiumUpgradeModal {...premiumUpgrade} />
      <ConversationMemoryModal {...conversationMemory} />
      <ConversationDrawer {...conversationDrawer} />
      <IntroFlowScreen {...intro} />
    </SafeAreaView>
  );
}
