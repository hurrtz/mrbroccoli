import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@ant-design/react-native";

import { AntIconButton } from "../../design-system/AntIconButton";
import { Colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";

interface MainScreenTopBarProps {
  brandName: string;
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
  brandName,
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
      <AntIconButton
        icon="menu"
        onPress={onOpenDrawer}
        accessibilityLabel={drawerLabel}
      />

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
              {brandName}
            </Text>
          </View>
        ) : (
          <View style={styles.wordmark}>
            <Text style={[styles.wordmarkText, { color: colors.text }]}>
              {brandName}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onToggleDebugLog ? (
          <Button
            type="ghost"
            size="small"
            style={StyleSheet.flatten([
              styles.iconButton,
              {
                backgroundColor: debugLogActive
                  ? colors.accentSoft
                  : "transparent",
                borderColor: debugLogActive ? colors.accent : "transparent",
              },
            ])}
            activeStyle={{ backgroundColor: colors.surfaceAlt }}
            onPress={onToggleDebugLog}
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
          </Button>
        ) : null}

        <AntIconButton
          icon="setting"
          onPress={onOpenSettings}
          accessibilityLabel={settingsLabel}
        />
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
    minWidth: 44,
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 0,
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
    fontFamily: fonts.headline,
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
    fontFamily: fonts.headline,
  },
});
