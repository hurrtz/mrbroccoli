import React from "react";
import { fireEvent, within } from "@testing-library/react-native";

import { MainScreenRouteCard } from "../../../src/screens/main/MainScreenRouteCard";
import { TranslateFn } from "../../../src/screens/main/shared";
import { lightColors } from "../../../src/theme/colors";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

jest.mock("../../../src/components/ProviderIcon", () => ({
  ProviderIcon: ({ provider }: { provider: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, provider);
  },
}));

const t = ((key: string) => {
  const copy: Record<string, string> = {
    freeEdition: "Private Offline · Free",
    freeOfflineIntro: "Choose languages and prepare private AI.",
    freeOfflineReady: "Your private offline setup is ready.",
    setupGuideConnectProviderTitle: "Connect a provider",
    setupGuideConnectProviderDescription: "Add an API key to begin.",
  };
  return copy[key] ?? key;
}) as TranslateFn;

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
  it("renders only the unobstructed model-card row when routes are available", () => {
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1", "mode-2"]}
        colors={lightColors}
        isPremium
        offlineReady={false}
        onOpenSetupGuide={jest.fn()}
        onSelectResponseMode={jest.fn()}
        responseModes={responseModes}
        language="en"
        t={t}
      />,
    );

    const modelRow = within(screen.getByTestId("response-mode-row"));

    expect(modelRow.getByTestId("route-byline")).toBeTruthy();
    expect(screen.queryByTestId("route-utility-row")).toBeNull();
    expect(screen.queryByTestId("route-style-control")).toBeNull();
    expect(screen.queryByTestId("route-web-search-control")).toBeNull();
  });

  it("opens provider setup from the empty state", () => {
    const onOpenSetupGuide = jest.fn();
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={[]}
        colors={lightColors}
        isPremium
        offlineReady={false}
        onOpenSetupGuide={onOpenSetupGuide}
        onSelectResponseMode={jest.fn()}
        responseModes={responseModes}
        language="en"
        t={t}
      />,
    );

    fireEvent.press(screen.getByRole("button"));
    expect(onOpenSetupGuide).toHaveBeenCalledTimes(1);
  });

  it("keeps the landscape empty state compact without losing accessible copy", () => {
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={[]}
        colors={lightColors}
        compact
        isPremium
        offlineReady={false}
        onOpenSetupGuide={jest.fn()}
        onSelectResponseMode={jest.fn()}
        responseModes={responseModes}
        language="en"
        t={t}
      />,
    );

    expect(screen.queryByText("Add an API key to begin.")).toBeNull();
    expect(
      screen.getByLabelText("Connect a provider. Add an API key to begin."),
    ).toBeTruthy();
  });

  it("shows Free as a ready private offline edition", () => {
    const onOpenSetupGuide = jest.fn();
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={["mode-1"]}
        colors={lightColors}
        isPremium={false}
        offlineReady
        onOpenSetupGuide={onOpenSetupGuide}
        onSelectResponseMode={jest.fn()}
        responseModes={responseModes}
        language="en"
        t={t}
      />,
    );

    expect(screen.getByText("Private Offline · Free")).toBeTruthy();
    fireEvent.press(
      screen.getByLabelText(
        "Private Offline · Free. Your private offline setup is ready.",
      ),
    );
    expect(onOpenSetupGuide).toHaveBeenCalledTimes(1);
  });

  it("opens Free setup instead of showing the cloud-provider empty state", () => {
    const onOpenSetupGuide = jest.fn();
    const screen = renderWithProviders(
      <MainScreenRouteCard
        activeResponseMode="mode-1"
        availableResponseModes={[]}
        colors={lightColors}
        isPremium={false}
        offlineReady={false}
        onOpenSetupGuide={onOpenSetupGuide}
        onSelectResponseMode={jest.fn()}
        responseModes={responseModes}
        language="en"
        t={t}
      />,
    );

    expect(screen.queryByTestId("provider-empty-state")).toBeNull();
    fireEvent.press(screen.getByTestId("free-edition-status"));
    expect(onOpenSetupGuide).toHaveBeenCalledTimes(1);
  });
});
