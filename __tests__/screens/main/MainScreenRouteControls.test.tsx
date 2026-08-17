import React from "react";
import { Platform, StyleSheet, Switch as NativeSwitch } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { MainScreenRouteControls } from "../../../src/screens/main/MainScreenRouteControls";
import { lightColors } from "../../../src/theme/colors";

const t = (key: string) =>
  ({
    ulraMode: "Model Council",
    webSearch: "Web Search",
  })[key] ?? key;

describe("MainScreenRouteControls", () => {
  it("right-aligns and optically centers the platform-native web-search control", () => {
    const onToggleWebSearchEnabled = jest.fn();
    const screen = render(
      <MainScreenRouteControls
        colors={lightColors}
        onToggleWebSearchEnabled={onToggleWebSearchEnabled}
        t={t}
        webSearchEnabled
        webSearchReady
      />,
    );

    const rowStyle = StyleSheet.flatten(
      screen.getByTestId("route-controls-row").props.style,
    );
    const searchControl = screen.getByTestId("route-web-search-container");
    const nativeSwitch = screen.UNSAFE_getByType(NativeSwitch);
    const searchLabelStyle = StyleSheet.flatten(
      screen.getByTestId("route-web-search-label").props.style,
    );

    expect(rowStyle.justifyContent).toBe("flex-end");
    expect(rowStyle.marginTop).toBe(-6);
    expect(searchLabelStyle).toEqual(
      expect.objectContaining({
        includeFontPadding: false,
        textAlignVertical: "center",
      }),
    );
    expect(searchLabelStyle.transform).toBeUndefined();
    expect(searchControl.props.accessibilityRole).toBe("switch");
    expect(searchControl.props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    expect(nativeSwitch.props.disabled).toBe(false);
    expect(nativeSwitch.props.value).toBe(true);
    expect(nativeSwitch.props.trackColor).toEqual({
      false: lightColors.borderStrong,
      true:
        Platform.OS === "android" ? lightColors.accentSoft : lightColors.accent,
    });
    expect(nativeSwitch.props.thumbColor).toBe(
      Platform.OS === "android" ? lightColors.accent : undefined,
    );
    expect(nativeSwitch.props.ios_backgroundColor).toBe(
      lightColors.borderStrong,
    );
    expect(nativeSwitch.props.accessible).toBe(false);
    expect(nativeSwitch.props.pointerEvents).toBe("none");
    expect(nativeSwitch.props.onValueChange).toBeUndefined();

    fireEvent.press(screen.getByTestId("route-web-search-label"));
    expect(onToggleWebSearchEnabled).toHaveBeenCalledTimes(1);

    fireEvent.press(nativeSwitch);
    expect(onToggleWebSearchEnabled).toHaveBeenCalledTimes(2);
  });

  it("leaves the row entirely when search is not configured", () => {
    // A switch that cannot move reads as a broken control, and the reason it
    // cannot move lives in Settings rather than beside it.
    const onToggleWebSearchEnabled = jest.fn();
    const screen = render(
      <MainScreenRouteControls
        colors={lightColors}
        onToggleWebSearchEnabled={onToggleWebSearchEnabled}
        t={t}
        webSearchEnabled
      />,
    );

    expect(screen.queryByTestId("route-web-search-container")).toBeNull();
    expect(screen.queryByText("Web Search")).toBeNull();
    expect(screen.queryByTestId("route-controls-row")).toBeNull();
  });

  it("adds breathing room above Web Search in landscape", () => {
    const screen = render(
      <MainScreenRouteControls
        colors={lightColors}
        layout="landscape"
        onToggleWebSearchEnabled={jest.fn()}
        t={t}
        webSearchReady
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("route-controls-row").props.style)
        .marginTop,
    ).toBe(6);
  });

  it("omits an unavailable Web Search control from constrained landscape layouts", () => {
    const screen = render(
      <MainScreenRouteControls
        colors={lightColors}
        layout="landscape"
        onToggleWebSearchEnabled={jest.fn()}
        t={t}
      />,
    );

    expect(screen.queryByTestId("route-controls-row")).toBeNull();
    expect(screen.queryByTestId("route-web-search-container")).toBeNull();
  });

  it("omits Web Search when the caller hides that route control", () => {
    const screen = render(
      <MainScreenRouteControls
        colors={lightColors}
        onToggleWebSearchEnabled={jest.fn()}
        showWebSearch={false}
        t={t}
        webSearchReady
      />,
    );

    expect(screen.queryByTestId("route-controls-row")).toBeNull();
    expect(screen.queryByTestId("route-web-search-container")).toBeNull();
  });

  it("shows the Model Council switch on the portrait left side only", () => {
    const onToggleUlraMode = jest.fn();
    const screen = render(
      <MainScreenRouteControls
        colors={lightColors}
        onToggleUlraMode={onToggleUlraMode}
        onToggleWebSearchEnabled={jest.fn()}
        t={t}
        ulraModeActive
        ulraModeAvailable
        webSearchReady
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("route-controls-row").props.style)
        .justifyContent,
    ).toBe("space-between");
    expect(
      screen.getByTestId("route-ulra-mode-container").props.accessibilityState,
    ).toEqual({ checked: true });
    expect(
      screen.getByTestId("route-ulra-mode-container").children[0],
    ).toMatchObject({
      props: { testID: "route-ulra-mode-control" },
    });
    expect(
      StyleSheet.flatten(
        screen.getByTestId("route-ulra-mode-label").props.style,
      ).textAlign,
    ).toBe("left");

    fireEvent.press(screen.getByTestId("route-ulra-mode-label"));
    expect(onToggleUlraMode).toHaveBeenCalledTimes(1);

    screen.rerender(
      <MainScreenRouteControls
        colors={lightColors}
        layout="landscape"
        onToggleUlraMode={onToggleUlraMode}
        onToggleWebSearchEnabled={jest.fn()}
        t={t}
        ulraModeActive
        ulraModeAvailable
        webSearchReady
      />,
    );
    expect(screen.queryByTestId("route-ulra-mode-container")).toBeNull();
  });
});
