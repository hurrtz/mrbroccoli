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
        <View
          testID="route-web-search-container"
          style={[
            styles.searchControl,
            !webSearchAvailable ? styles.searchControlDisabled : null,
          ]}
        >
          <Pressable
            testID="route-web-search-label-control"
            accessible={false}
            disabled={!webSearchAvailable}
            hitSlop={4}
            onPress={
              webSearchAvailable
                ? () => onToggleWebSearchEnabled?.()
                : undefined
            }
            style={({ pressed }) => [
              styles.searchLabelControl,
              pressed && webSearchAvailable
                ? styles.searchLabelPressed
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
          </Pressable>
          <NativeSwitch
            testID="route-web-search-control"
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
            onValueChange={
              webSearchAvailable
                ? () => onToggleWebSearchEnabled?.()
                : undefined
            }
            accessibilityLabel={t("webSearch")}
            accessibilityState={{
              checked: webSearchValue,
              disabled: !webSearchAvailable,
            }}
          />
        </View>
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
  searchLabelControl: {
    minHeight: 44,
    justifyContent: "center",
  },
  searchLabelPressed: {
    opacity: 0.62,
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
