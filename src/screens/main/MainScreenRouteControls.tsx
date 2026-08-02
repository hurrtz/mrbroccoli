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
  onToggleUlraMode?: () => void;
  showWebSearch?: boolean;
  t: TranslateFn;
  ulraModeActive?: boolean;
  ulraModeAvailable?: boolean;
  webSearchEnabled?: boolean;
  webSearchReady?: boolean;
}

export const MainScreenRouteControls = React.memo(
  function MainScreenRouteControls({
    colors,
    layout = "portrait",
    onToggleWebSearchEnabled,
    onToggleUlraMode,
    showWebSearch = true,
    t,
    ulraModeActive = false,
    ulraModeAvailable = false,
    webSearchEnabled = false,
    webSearchReady = false,
  }: MainScreenRouteControlsProps) {
    const webSearchAvailable =
      webSearchReady && Boolean(onToggleWebSearchEnabled);
    const webSearchValue = webSearchAvailable && webSearchEnabled;
    const showUlraMode =
      layout === "portrait" && ulraModeAvailable && Boolean(onToggleUlraMode);
    const showWebSearchControl =
      showWebSearch && (layout === "portrait" || webSearchAvailable);

    if (!showWebSearchControl && !showUlraMode) {
      return null;
    }

    return (
      <View
        testID="route-controls-row"
        style={[
          styles.row,
          layout === "landscape" ? styles.rowLandscape : null,
          showUlraMode ? styles.rowWithUlraMode : null,
        ]}
      >
        {showUlraMode ? (
          <RouteSwitchControl
            colors={colors}
            label={t("ulraMode")}
            onPress={onToggleUlraMode}
            testIDPrefix="route-ulra-mode"
            value={ulraModeActive}
          />
        ) : null}
        {showWebSearchControl ? (
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
        ) : null}
      </View>
    );
  },
);

function RouteSwitchControl({
  colors,
  label,
  onPress,
  testIDPrefix,
  value,
}: {
  colors: Colors;
  label: string;
  onPress?: () => void;
  testIDPrefix: string;
  value: boolean;
}) {
  return (
    <Pressable
      testID={`${testIDPrefix}-container`}
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.searchControl,
        pressed ? styles.searchControlPressed : null,
      ]}
    >
      <NativeSwitch
        testID={`${testIDPrefix}-control`}
        accessible={false}
        focusable={false}
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={styles.searchSwitch}
        value={value}
        trackColor={{
          false: colors.borderStrong,
          true: Platform.OS === "android" ? colors.accentSoft : colors.accent,
        }}
        thumbColor={
          Platform.OS === "android"
            ? value
              ? colors.accent
              : colors.surface
            : undefined
        }
        ios_backgroundColor={colors.borderStrong}
      />
      <Text
        testID={`${testIDPrefix}-label`}
        accessible={false}
        style={[
          styles.searchLabel,
          styles.routeSwitchLabel,
          { color: colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

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
  rowWithUlraMode: {
    justifyContent: "space-between",
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
  routeSwitchLabel: {
    textAlign: "left",
  },
  searchSwitch: {
    alignSelf: "center",
  },
});
