import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConversationDrawer } from "../../components/ConversationDrawer";
import { IntroFlowScreen } from "../../components/introFlow/IntroFlowScreen";
import { PremiumUpgradeModal } from "../../components/PremiumUpgradeModal";
import { Toast } from "../../components/Toast";
import { AntSettingsModal } from "../../features/settings/AntSettingsModal";
import { Colors } from "../../theme/colors";
import { MainScreenWorkspace } from "./MainScreenWorkspace";
import { DisclosureDialog } from "./DisclosureDialog";
import { ImageSourceSheet } from "./ImageSourceSheet";
import { StyleSheetModal } from "./StyleSheetModal";
import { styles } from "./styles";

interface MainScreenPresentationProps {
  colors: Colors;
  conversationDrawer: React.ComponentProps<typeof ConversationDrawer>;
  councilDisclosure: React.ComponentProps<typeof DisclosureDialog>;
  imageConsent: React.ComponentProps<typeof DisclosureDialog>;
  intro: React.ComponentProps<typeof IntroFlowScreen>;
  imageSource: React.ComponentProps<typeof ImageSourceSheet>;
  isDark: boolean;
  isLandscape: boolean;
  premiumUpgrade: React.ComponentProps<typeof PremiumUpgradeModal>;
  settingsModal: React.ComponentProps<typeof AntSettingsModal>;
  styleSheet: React.ComponentProps<typeof StyleSheetModal>;
  toast: React.ComponentProps<typeof Toast>;
  workspace: React.ComponentProps<typeof MainScreenWorkspace>;
}

export function MainScreenPresentation({
  colors,
  conversationDrawer,
  councilDisclosure,
  imageConsent,
  intro,
  imageSource,
  isDark,
  isLandscape,
  premiumUpgrade,
  settingsModal,
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

      <ImageSourceSheet {...imageSource} />
      <DisclosureDialog {...councilDisclosure} />
      <DisclosureDialog {...imageConsent} />

      <StyleSheetModal {...styleSheet} />
      <AntSettingsModal {...settingsModal} />
      <PremiumUpgradeModal {...premiumUpgrade} />
      <ConversationDrawer {...conversationDrawer} />
      <IntroFlowScreen {...intro} />
    </SafeAreaView>
  );
}
