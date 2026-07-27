import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch as NativeSwitch,
  Text,
  View,
} from "react-native";

import type { Colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import type { TranslateFn } from "./shared";

interface MainScreenRouteControlsProps {
  colors: Colors;
  layout?: "portrait" | "landscape";
  onToggleWebSearchEnabled?: () => void;
  t: TranslateFn;
  webSearchEnabled?: boolean;
  webSearchReady?: boolean;
}

export const MainScreenRouteControls = React.memo(
  function MainScreenRouteControls({
    colors,
    layout = "portrait",
    onToggleWebSearchEnabled,
    t,
    webSearchEnabled = false,
    webSearchReady = false,
  }: MainScreenRouteControlsProps) {
    const webSearchAvailable =
      webSearchReady && Boolean(onToggleWebSearchEnabled);
    const webSearchValue = webSearchAvailable && webSearchEnabled;

    return (
      <View
        testID="route-controls-row"
        style={[
          styles.row,
          layout === "landscape" ? styles.rowLandscape : null,
        ]}
      >
        <Pressable
          testID="route-web-search-container"
          accessibilityLabel={t("webSearch")}
          accessibilityRole="switch"
          accessibilityState={{
            checked: webSearchValue,
            disabled: !webSearchAvailable,
          }}
          disabled={!webSearchAvailable}
          onPress={
            webSearchAvailable
              ? () => onToggleWebSearchEnabled?.()
              : undefined
          }
          style={({ pressed }) => [
            styles.searchControl,
            !webSearchAvailable ? styles.searchControlDisabled : null,
            pressed && webSearchAvailable
              ? styles.searchControlPressed
              : null,
          ]}
        >
          <Text
            testID="route-web-search-label"
            accessible={false}
            style={[
              styles.searchLabel,
              {
                color: webSearchAvailable
                  ? colors.textSecondary
                  : colors.textMuted,
              },
            ]}
          >
            {t("webSearch")}
          </Text>
          <NativeSwitch
            testID="route-web-search-control"
            accessible={false}
            focusable={false}
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={styles.searchSwitch}
            value={webSearchValue}
            disabled={!webSearchAvailable}
            trackColor={{
              false: colors.borderStrong,
              true:
                Platform.OS === "android" ? colors.accentSoft : colors.accent,
            }}
            thumbColor={
              Platform.OS === "android"
                ? webSearchValue
                  ? colors.accent
                  : colors.surface
                : undefined
            }
            ios_backgroundColor={colors.borderStrong}
          />
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    marginTop: -6,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rowLandscape: {
    marginTop: 6,
  },
  searchControl: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  searchControlDisabled: {
    opacity: 0.52,
  },
  searchControlPressed: {
    opacity: 0.72,
  },
  searchLabel: {
    minWidth: 78,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.body,
    includeFontPadding: false,
    textAlign: "right",
    textAlignVertical: "center",
  },
  searchSwitch: {
    alignSelf: "center",
  },
});
