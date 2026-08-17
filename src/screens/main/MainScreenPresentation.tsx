import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConversationDrawer } from "../../components/ConversationDrawer";
import { Toast } from "../../components/Toast";
import { AntSettingsModal } from "../../features/settings/AntSettingsModal";
import type { AppLanguage } from "../../i18n/localeRegistry";
import { Colors } from "../../theme/colors";
import type { IpadLayout } from "../../utils/ipadLayout";
import { MainScreenWorkspace } from "./MainScreenWorkspace";
import { DisclosureDialog } from "./DisclosureDialog";
import { ImageSourceSheet } from "./ImageSourceSheet";
import { StyleSheetModal } from "./StyleSheetModal";
import { styles } from "./styles";

interface MainScreenPresentationProps {
  colors: Colors;
  conversationDrawer: React.ComponentProps<typeof ConversationDrawer>;
  imageConsent: React.ComponentProps<typeof DisclosureDialog>;
  imageSource: React.ComponentProps<typeof ImageSourceSheet>;
  isDark: boolean;
  ipadLayout: IpadLayout;
  isLandscape: boolean;
  language: AppLanguage;
  settingsModal: React.ComponentProps<typeof AntSettingsModal>;
  styleSheet: React.ComponentProps<typeof StyleSheetModal>;
  surfaceTransition: { label: string; visible: boolean };
  toast: React.ComponentProps<typeof Toast>;
  workspace: React.ComponentProps<typeof MainScreenWorkspace>;
}

export function MainScreenPresentation({
  colors,
  conversationDrawer,
  imageConsent,
  imageSource,
  isDark,
  ipadLayout,
  isLandscape,
  language,
  settingsModal,
  styleSheet,
  surfaceTransition,
  toast,
  workspace,
}: MainScreenPresentationProps) {
  const workspaceSurface = (
    <KeyboardAvoidingView
      accessibilityElementsHidden={surfaceTransition.visible}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      importantForAccessibility={
        surfaceTransition.visible ? "no-hide-descendants" : "auto"
      }
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={[
        styles.defaultLayout,
        isLandscape && !ipadLayout.isRegularWidth
          ? styles.defaultLayoutLandscape
          : null,
        ipadLayout.isRegularWidth ? styles.ipadWorkspaceLayout : null,
      ]}
    >
      <MainScreenWorkspace {...workspace} />
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView
      testID="main-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={
        ipadLayout.isRegularWidth
          ? ["top", "bottom", "left", "right"]
          : Platform.OS === "ios" && isLandscape
            ? ["top"]
            : ["top", "left", "right"]
      }
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {/* Store screenshots relaunch between independently seeded scenes. This
          stable native marker proves that each scene hydrated the requested
          interface language before any capture, without adding spoken UI. */}
      <View
        collapsable={false}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        testID={`app-locale-${language}`}
      />
      <Toast {...toast} />

      {ipadLayout.isRegularWidth ? (
        <View style={styles.ipadShell} testID="ipad-regular-shell">
          <ConversationDrawer
            {...conversationDrawer}
            onOpenSettings={workspace.topBar.onOpenSettings}
            presentation="sidebar"
            sidebarWidth={ipadLayout.sidebarWidth ?? 300}
          />
          {workspaceSurface}
        </View>
      ) : (
        workspaceSurface
      )}

      {surfaceTransition.visible ? (
        <View
          accessibilityLabel={surfaceTransition.label}
          accessibilityRole="progressbar"
          accessibilityViewIsModal
          style={[
            presentationStyles.surfaceTransition,
            { backgroundColor: colors.background },
          ]}
          testID="secondary-surface-transition"
        >
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : null}

      <ImageSourceSheet {...imageSource} />
      <DisclosureDialog {...imageConsent} />

      <StyleSheetModal {...styleSheet} />
      <AntSettingsModal {...settingsModal} />
      {!ipadLayout.isRegularWidth ? (
        <ConversationDrawer {...conversationDrawer} />
      ) : null}
    </SafeAreaView>
  );
}

const presentationStyles = StyleSheet.create({
  surfaceTransition: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
