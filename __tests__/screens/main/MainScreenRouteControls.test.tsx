import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { MainScreenRouteControls } from "../../../src/screens/main/MainScreenRouteControls";
import { lightColors } from "../../../src/theme/colors";

const t = (key: string) =>
  ({
    ulraMode: "Model Council",
    webSearch: "Web Search",
  })[key] ?? key;

describe("MainScreenRouteControls", () => {
  it("draws the per-question switches as satellites under the orb", () => {
    const onToggleWebSearchEnabled = jest.fn();
    const screen = render(
      <MainScreenRouteControls
        onToggleWebSearchEnabled={onToggleWebSearchEnabled}
        t={t}
        webSearchEnabled
        webSearchReady
      />,
    );

    const rowStyle = StyleSheet.flatten(
      screen.getByTestId("route-controls-row").props.style,
    );
    const control = screen.getByTestId("route-web-search-control");

    // A centred row of 44pt targets under the orb, not a right-aligned strip
    // of chips beside it.
    expect(rowStyle.justifyContent).toBe("center");
    expect(StyleSheet.flatten(control.props.style)).toEqual(
      expect.objectContaining({ height: 44, width: 44 }),
    );
    expect(control.props.accessibilityRole).toBe("switch");
    expect(control.props.accessibilityState.checked).toBe(true);
    expect(control.props.accessibilityLabel).toBe("Web Search");

    fireEvent.press(control);
    expect(onToggleWebSearchEnabled).toHaveBeenCalledTimes(1);
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

  it("tightens the satellite row in landscape", () => {
    const screen = render(
      <MainScreenRouteControls
        layout="landscape"
        onToggleWebSearchEnabled={jest.fn()}
        t={t}
        webSearchReady
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("route-controls-row").props.style)
        .paddingTop,
    ).toBe(4);
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

  it("omits premium route controls when the caller hides Web Search", () => {
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

  it("shows Model Council as a satellite in portrait only", () => {
    const onToggleUlraMode = jest.fn();
    const portrait = render(
      <MainScreenRouteControls
        onToggleUlraMode={onToggleUlraMode}
        onToggleWebSearchEnabled={jest.fn()}
        t={t}
        ulraModeActive
        ulraModeAvailable
        webSearchReady
      />,
    );
    const council = portrait.getByTestId("route-ulra-mode-control");

    expect(council.props.accessibilityRole).toBe("switch");
    expect(council.props.accessibilityState.checked).toBe(true);
    // The label stays neutral in both states; the well carries the state.
    expect(
      portrait.getByText("Model Council", { includeHiddenElements: true }),
    ).toBeTruthy();
    fireEvent.press(council);
    expect(onToggleUlraMode).toHaveBeenCalledTimes(1);

    const landscape = render(
      <MainScreenRouteControls
        layout="landscape"
        onToggleUlraMode={onToggleUlraMode}
        onToggleWebSearchEnabled={jest.fn()}
        t={t}
        ulraModeActive
        ulraModeAvailable
        webSearchReady
      />,
    );

    // The landscape column has no room for it.
    expect(landscape.queryByTestId("route-ulra-mode-control")).toBeNull();
  });
});
