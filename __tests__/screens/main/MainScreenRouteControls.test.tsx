import React from "react";
import { Platform, StyleSheet, Switch as NativeSwitch } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { MainScreenRouteControls } from "../../../src/screens/main/MainScreenRouteControls";
import { lightColors } from "../../../src/theme/colors";

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, `icon:${name}`);
  },
}));

const t = (key: string) =>
  ({
    ulraMode: "Uber Mode",
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

  it("stays visible but is visually and functionally disabled when search is not configured", () => {
    const onToggleWebSearchEnabled = jest.fn();
    const screen = render(
      <MainScreenRouteControls
        colors={lightColors}
        onToggleWebSearchEnabled={onToggleWebSearchEnabled}
        t={t}
        webSearchEnabled
      />,
    );

    const searchControl = screen.getByTestId("route-web-search-container");
    const nativeSwitch = screen.UNSAFE_getByType(NativeSwitch);
    const containerStyle = StyleSheet.flatten(
      screen.getByTestId("route-web-search-container").props.style,
    );

    expect(screen.getByText("Web Search")).toBeTruthy();
    expect(containerStyle.opacity).toBe(0.52);
    expect(searchControl.props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
    expect(nativeSwitch.props.disabled).toBe(true);
    expect(nativeSwitch.props.onValueChange).toBeUndefined();
    expect(nativeSwitch.props.value).toBe(false);

    fireEvent.press(screen.getByTestId("route-web-search-label"));
    fireEvent.press(nativeSwitch);
    expect(onToggleWebSearchEnabled).not.toHaveBeenCalled();
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

  it("shows the Uber Mode switch on the portrait left side only", () => {
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
    expect(
      screen.queryByTestId("route-ulra-mode-container"),
    ).toBeNull();
  });
});
