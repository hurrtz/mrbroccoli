import React from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { EdgeInsets } from "react-native-safe-area-context";
import { Toast } from "../../components/Toast";
import { AntIconButton } from "../../design-system/AntIconButton";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { SettingsPage } from "../settings-core/types";
import { styles } from "./styles";

interface AntSettingsFrameProps {
  activePage: SettingsPage;
  children: React.ReactNode;
  contentScrollRef: React.RefObject<ScrollView | null>;
  entrance: Animated.Value;
  insets: EdgeInsets;
  isLandscape: boolean;
  keyboardInset: number;
  modalMaxWidth: number;
  onBack: () => void;
  onClose: () => void;
  onDismissValidationToast: () => void;
  title: string;
  validationToastMessage: string | null;
}

export function AntSettingsFrame({
  activePage,
  children,
  contentScrollRef,
  entrance,
  insets,
  isLandscape,
  keyboardInset,
  modalMaxWidth,
  onBack,
  onClose,
  onDismissValidationToast,
  title,
  validationToastMessage,
}: AntSettingsFrameProps) {
  const { colors } = useTheme();
  const { isRtl, t } = useLocalization();
  const showsBackButton = activePage !== "overview";
  const animatedModalStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  return (
    <View
      testID="settings-modal"
      accessibilityViewIsModal
      style={[
        styles.overlay,
        {
          paddingTop: isLandscape ? Math.max(insets.top + 8, 16) : 0,
          paddingBottom: isLandscape ? Math.max(insets.bottom + 8, 16) : 0,
          paddingHorizontal: isLandscape ? 12 : 0,
        },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.backdrop,
          {
            backgroundColor: colors.overlay,
            opacity: entrance,
          },
        ]}
      />
      <Pressable style={styles.backdrop} onPress={onClose} accessible={false} />
      <Animated.View
        style={[
          styles.modal,
          isLandscape ? styles.modalLandscape : null,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: isLandscape ? 22 : 0,
            borderWidth: isLandscape ? 1 : 0,
            maxWidth: modalMaxWidth,
            shadowColor: colors.glow,
          },
          animatedModalStyle,
        ]}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
              paddingTop: isLandscape ? 14 : insets.top + 12,
            },
          ]}
        >
          {showsBackButton ? (
            <AntIconButton
              iconNode={
                <Feather
                  name={isRtl ? "arrow-right" : "arrow-left"}
                  size={22}
                  color={colors.textSecondary}
                />
              }
              style={styles.headerControl}
              onPress={onBack}
              accessibilityLabel={t("settingsBackToOverview")}
              testID="settings-back-button"
            />
          ) : (
            <View style={styles.headerControl} />
          )}
          <View style={styles.headerTitleWrap}>
            <Text
              testID="settings-modal-title"
              accessibilityRole="header"
              style={[styles.headerTitle, { color: colors.text }]}
            >
              {title}
            </Text>
          </View>
          <AntIconButton
            iconNode={
              <Feather name="x" size={22} color={colors.textSecondary} />
            }
            style={styles.headerControl}
            onPress={onClose}
            accessibilityLabel={t("dismiss")}
            testID="settings-close-button"
          />
        </View>

        <ScrollView
          testID="settings-scroll-view"
          ref={contentScrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: Math.max(insets.bottom + 20, keyboardInset + 20),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          nestedScrollEnabled
        >
          {children}
        </ScrollView>
      </Animated.View>
      <Toast
        message={validationToastMessage ?? ""}
        visible={validationToastMessage !== null}
        onDismiss={onDismissValidationToast}
        tone="danger"
      />
    </View>
  );
}
