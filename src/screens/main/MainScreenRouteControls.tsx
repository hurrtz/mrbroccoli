import React from "react";
import { StyleSheet, View } from "react-native";

import { OrbSatellite } from "../../design-system/OrbSatellite";
import type { Colors } from "../../theme/colors";
import type { TranslateFn } from "./shared";

interface MainScreenRouteControlsProps {
  /** Unused by the row itself; the satellites resolve their own. */
  colors?: Colors;
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
    // Hidden rather than shown greyed out. A switch that cannot move reads as
    // a broken control, and the reason it cannot move lives in Settings, not
    // next to it.
    const showWebSearchControl = showWebSearch && webSearchAvailable;

    if (!showWebSearchControl && !showUlraMode) {
      return null;
    }

    return (
      <View
        testID="route-controls-row"
        style={[
          styles.row,
          layout === "landscape" ? styles.rowLandscape : null,
        ]}
      >
        {showUlraMode ? (
          <OrbSatellite
            accessibilityLabel={t("ulraMode")}
            active={ulraModeActive}
            icon="council"
            kind="toggle"
            label={t("ulraMode")}
            onPress={onToggleUlraMode}
            testID="route-ulra-mode-control"
          />
        ) : null}
        {showWebSearchControl ? (
          <OrbSatellite
            accessibilityLabel={t("webSearch")}
            active={webSearchValue}
            icon="search"
            kind="toggle"
            label={t("webSearch")}
            onPress={() => onToggleWebSearchEnabled?.()}
            testID="route-web-search-control"
          />
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingTop: 8,
  },
  rowLandscape: {
    paddingTop: 4,
  },
});
