import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "../../design-system/IconButton";
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
  debugLogLabel = "Debug log",
  drawerLabel,
  onOpenDrawer,
  onOpenSettings,
  onToggleDebugLog,
  settingsLabel,
}: MainScreenTopBarProps) {
  return (
    <View style={styles.topBar}>
      <IconButton
        icon="menu"
        onPress={onOpenDrawer}
        accessibilityLabel={drawerLabel}
        testID="main-conversations-button"
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
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.4}
              style={[styles.compactBrandText, { color: colors.text }]}
            >
              {brandName}
            </Text>
          </View>
        ) : (
          <View style={styles.wordmark}>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.4}
              style={[styles.wordmarkText, { color: colors.text }]}
            >
              {brandName}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onToggleDebugLog ? (
          <IconButton
            icon="bug"
            active={debugLogActive}
            onPress={onToggleDebugLog}
            accessibilityLabel={debugLogLabel}
            testID="main-debug-log-button"
          />
        ) : null}

        <IconButton
          icon="setting"
          onPress={onOpenSettings}
          accessibilityLabel={settingsLabel}
          testID="main-settings-button"
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  wordmarkText: {
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.25,
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
