import React from "react";
import { fireEvent, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { MainScreenRouteCard } from "../../../src/screens/main/MainScreenRouteCard";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

jest.mock("../../../src/components/ProviderIcon", () => ({
  ProviderIcon: ({ provider }: { provider: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, provider);
  },
}));

const responseModes = [
  {
    id: "mode-1" as const,
    route: { provider: "xai" as const, model: "grok-4-1-fast-reasoning" },
  },
  {
    id: "mode-2" as const,
    route: { provider: "xai" as const, model: "grok-4.1" },
  },
];

describe("MainScreenRouteCard", () => {
  it("names the effort instead of plotting it", () => {
    // The dot ladder is retired: the word already says the effort.
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1", "mode-2"]}
        onOpenRoutePicker={jest.fn()}
        responseModes={responseModes}
      />,
    );

    expect(screen.getByTestId("route-byline-effort")).toBeTruthy();
    expect(screen.queryByTestId("route-byline-effort-dots")).toBeNull();
  });

  it("renders the route byline when routes are available", () => {
    const onOpenRoutePicker = jest.fn();
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1", "mode-2"]}
        onOpenRoutePicker={onOpenRoutePicker}
        responseModes={responseModes}
      />,
    );

    const modelRow = within(screen.getByTestId("response-mode-row"));

    expect(modelRow.getByTestId("route-byline")).toBeTruthy();
    expect(screen.queryByTestId("route-utility-row")).toBeNull();
    expect(screen.queryByTestId("route-style-control")).toBeNull();
    expect(screen.queryByTestId("route-web-search-control")).toBeNull();
    fireEvent.press(modelRow.getByTestId("route-byline"));
    expect(onOpenRoutePicker).toHaveBeenCalledTimes(1);
  });

  it("becomes a credit line with a single configured model", () => {
    const onOpenRoutePicker = jest.fn();
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1"]}
        onOpenRoutePicker={onOpenRoutePicker}
        responseModes={responseModes}
      />,
    );

    fireEvent.press(screen.getByTestId("route-byline"));
    expect(onOpenRoutePicker).not.toHaveBeenCalled();
  });

  it("uses the two-row workspace header in portrait", () => {
    const onOpenRoutePicker = jest.fn();
    const onOpenSettings = jest.fn();
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1", "mode-2"]}
        onOpenRoutePicker={onOpenRoutePicker}
        presentation="workspace-header"
        responseModes={responseModes}
        settingsSummary={{
          accessibilityLabel: "Conversation settings",
          onPress: onOpenSettings,
          summary: "Brief · Balanced · Heart",
        }}
      />,
    );

    expect(screen.getByTestId("workspace-header-model")).toBeTruthy();
    expect(screen.getByText("Brief · Balanced · Heart")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("workspace-header-model").props.style,
      ),
    ).toMatchObject({ minHeight: 56, paddingHorizontal: 16 });
    expect(
      StyleSheet.flatten(
        screen.getByTestId("workspace-header-model-name").props.style,
      ),
    ).toMatchObject({ fontSize: 17, lineHeight: 22 });
    expect(
      StyleSheet.flatten(
        screen.getByTestId("workspace-header-effort").props.style,
      ),
    ).toMatchObject({ fontSize: 11, lineHeight: 16, marginLeft: "auto" });
    fireEvent.press(screen.getByTestId("workspace-header-model"));
    fireEvent.press(screen.getByTestId("workspace-header-settings"));
    expect(onOpenRoutePicker).toHaveBeenCalledTimes(1);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("dims and locks the route and conversation settings after submission", () => {
    const onOpenRoutePicker = jest.fn();
    const onOpenSettings = jest.fn();
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1", "mode-2"]}
        onOpenRoutePicker={onOpenRoutePicker}
        presentation="workspace-header"
        responseModes={responseModes}
        running
        settingsSummary={{
          accessibilityLabel: "Conversation settings",
          onPress: onOpenSettings,
          summary: "Brief · Balanced · Heart",
        }}
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("workspace-header").props.style)
        .opacity,
    ).toBe(0.38);
    expect(screen.getByTestId("workspace-header").props.role).toBe("status");
    expect(screen.getByText("Brief · Balanced · Heart")).toBeTruthy();

    fireEvent.press(screen.getByTestId("workspace-header-model"));
    fireEvent.press(screen.getByTestId("workspace-header-settings"));

    expect(onOpenRoutePicker).not.toHaveBeenCalled();
    expect(onOpenSettings).not.toHaveBeenCalled();
  });

  it("reuses the full-strength header for live Council progress", () => {
    const onOpenRoutePicker = jest.fn();
    const onOpenSettings = jest.fn();
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1", "mode-2"]}
        councilReport={{
          modelName: "Claude Opus 5",
          provider: "anthropic",
          summary: "Model 2 of 4 · Round 2 of 3",
        }}
        onOpenRoutePicker={onOpenRoutePicker}
        presentation="workspace-header"
        responseModes={responseModes}
        running
        settingsSummary={{
          accessibilityLabel: "Conversation settings",
          onPress: onOpenSettings,
          summary: "Brief · Balanced · Heart",
        }}
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("workspace-header").props.style)
        .opacity,
    ).toBeUndefined();
    expect(screen.getByText("Claude Opus 5")).toBeTruthy();
    expect(screen.getByText("Model 2 of 4 · Round 2 of 3")).toBeTruthy();
    expect(screen.queryByText("Brief · Balanced · Heart")).toBeNull();

    fireEvent.press(screen.getByTestId("workspace-header-model"));
    fireEvent.press(screen.getByTestId("workspace-header-settings"));

    expect(onOpenRoutePicker).not.toHaveBeenCalled();
    expect(onOpenSettings).not.toHaveBeenCalled();
  });

  it("removes the old provider card when no route is ready", () => {
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={[]}
        onOpenRoutePicker={jest.fn()}
        responseModes={responseModes}
      />,
    );

    expect(screen.queryByTestId("provider-empty-state")).toBeNull();
    expect(screen.queryByTestId("free-edition-status")).toBeNull();
    expect(screen.queryByTestId("response-mode-row")).toBeNull();
  });
});
