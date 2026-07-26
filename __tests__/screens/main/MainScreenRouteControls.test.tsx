import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { AntSwitch } from "../../../src/design-system/AntSwitch";
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
    webSearch: "Web Search",
  })[key] ?? key;

describe("MainScreenRouteControls", () => {
  it("right-aligns and optically centers the Ant web-search control", () => {
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
    const searchSwitch = screen.getByTestId("route-web-search-control");
    const antSwitch = screen.UNSAFE_getByType(AntSwitch);
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
    expect(searchSwitch.props.accessibilityRole).toBe("switch");
    expect(searchSwitch.props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    expect(antSwitch.props.disabled).toBe(false);
    expect(antSwitch.props.checked).toBe(true);
    expect(antSwitch.props.trackColor).toEqual({
      false: lightColors.borderStrong,
      true: lightColors.accent,
    });
    expect(antSwitch.props.thumbColor).toBe(lightColors.onAccent);
    expect(antSwitch.props.thumbTintColor).toBe(lightColors.onAccent);

    fireEvent.press(searchSwitch);
    expect(onToggleWebSearchEnabled).toHaveBeenCalledTimes(1);
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

    const searchSwitch = screen.getByTestId("route-web-search-control");
    const antSwitch = screen.UNSAFE_getByType(AntSwitch);
    const containerStyle = StyleSheet.flatten(
      screen.getByTestId("route-web-search-container").props.style,
    );

    expect(screen.getByText("Web Search")).toBeTruthy();
    expect(containerStyle.opacity).toBe(0.52);
    expect(searchSwitch.props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
    expect(antSwitch.props.disabled).toBe(true);
    expect(antSwitch.props.onChange).toBeUndefined();
    expect(antSwitch.props.checked).toBe(false);

    fireEvent.press(searchSwitch);
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
      StyleSheet.flatten(
        screen.getByTestId("route-controls-row").props.style,
      ).marginTop,
    ).toBe(6);
  });
});
