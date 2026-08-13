import React from "react";
import { fireEvent, within } from "@testing-library/react-native";

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

  it("labels routes without an effort control as Normal without dots", () => {
    const localMode = {
      id: "mode-1" as const,
      route: {
        runtime: "local" as const,
        localModelId: "qwen3-0.6b-q8" as const,
        provider: "openai" as const,
        model: "Qwen3 0.6B",
      },
    };
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1"]}
        onOpenRoutePicker={jest.fn()}
        responseModes={[localMode]}
      />,
    );

    expect(screen.getByTestId("route-byline-effort").props.children).toBe(
      "Normal",
    );
    expect(screen.queryByTestId("route-byline-effort-dots")).toBeNull();
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
