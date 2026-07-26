import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { AntSwitch } from "../../design-system/AntSwitch";
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
          <Text
            testID="route-web-search-label"
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
          <AntSwitch
            testID="route-web-search-control"
            style={styles.searchSwitch}
            checked={webSearchValue}
            disabled={!webSearchAvailable}
            trackColor={{
              false: colors.borderStrong,
              true: colors.accent,
            }}
            thumbColor={colors.onAccent}
            thumbTintColor={colors.onAccent}
            onChange={
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
