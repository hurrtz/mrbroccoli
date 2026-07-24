import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { Colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";

interface MainScreenTopBarProps {
  colors: Colors;
  compact?: boolean;
  debugLogActive?: boolean;
  debugLogLabel?: string;
  drawerLabel: string;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onToggleDebugLog?: () => void;
  settingsLabel: string;
}

export const MainScreenTopBar = React.memo(function MainScreenTopBar({
  colors,
  compact = false,
  debugLogActive = false,
  debugLogLabel = "LOG",
  drawerLabel,
  onOpenDrawer,
  onOpenSettings,
  onToggleDebugLog,
  settingsLabel,
}: MainScreenTopBarProps) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        style={[
          styles.iconButton,
          {
            backgroundColor: "transparent",
            borderColor: "transparent",
          },
        ]}
        onPress={onOpenDrawer}
        accessibilityRole="button"
        accessibilityLabel={drawerLabel}
      >
        <Feather name="sidebar" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <View
        testID="main-screen-title-slot"
        pointerEvents="none"
        style={styles.brandLayer}
      >
        {compact ? (
          <View
            style={[
              styles.compactBrand,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.compactBrandText, { color: colors.text }]}>
              Mr Broccoli
            </Text>
          </View>
        ) : (
          <View style={styles.wordmark}>
            <Text style={[styles.wordmarkText, { color: colors.text }]}>
              Mr Broccoli
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onToggleDebugLog ? (
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: debugLogActive
                  ? colors.accentSoft
                  : "transparent",
                borderColor: debugLogActive ? colors.accent : "transparent",
              },
            ]}
            onPress={onToggleDebugLog}
            accessibilityRole="button"
            accessibilityLabel={debugLogLabel}
          >
            <Text
              style={[
                styles.logButtonText,
                {
                  color: debugLogActive ? colors.accent : colors.textSecondary,
                },
              ]}
            >
              {debugLogLabel}
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: "transparent",
              borderColor: "transparent",
            },
          ]}
          onPress={onOpenSettings}
          accessibilityRole="button"
          accessibilityLabel={settingsLabel}
        >
          <Feather name="settings" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  topBar: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 10,
  },
  brandLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logButtonText: {
    fontSize: 11,
    letterSpacing: 0.6,
    fontFamily: fonts.displayHeavy,
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  wordmarkText: {
    fontSize: 20,
    letterSpacing: 0.3,
    fontFamily: fonts.displayHeavy,
  },
  compactBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  compactBrandText: {
    fontSize: 14,
    letterSpacing: 0.6,
    fontFamily: fonts.displayHeavy,
  },
});
