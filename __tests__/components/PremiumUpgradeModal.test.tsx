import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { fireEvent } from "@testing-library/react-native";

import { PremiumUpgradeModal } from "../../src/components/PremiumUpgradeModal";
import { usePremiumEntitlement } from "../../src/context/PremiumEntitlementContext";
import { renderWithProviders } from "../test-utils/renderWithProviders";

const mockRecordDebugLogEvent = jest.fn();

jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  const mockedUseWindowDimensions = jest.fn(() => ({
    fontScale: 1,
    height: 844,
    scale: 3,
    width: 390,
  }));

  return new Proxy(actual, {
    get(target, property, receiver) {
      return property === "useWindowDimensions"
        ? mockedUseWindowDimensions
        : Reflect.get(target, property, receiver);
    },
  });
});

jest.mock("../../src/context/PremiumEntitlementContext", () => ({
  usePremiumEntitlement: jest.fn(),
}));

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: (...args: unknown[]) => mockRecordDebugLogEvent(...args),
}));

const mockedUsePremiumEntitlement = jest.mocked(usePremiumEntitlement);
const mockUseWindowDimensions = jest.mocked(useWindowDimensions);

function setViewport(width: number, height: number) {
  mockUseWindowDimensions.mockReturnValue({
    fontScale: 1,
    height,
    scale: 3,
    width,
  });
}

function mockFreeEntitlement() {
  mockedUsePremiumEntitlement.mockReturnValue({
    status: "free",
    isPremium: false,
    developmentEntitlementMode: null,
    setDevelopmentEntitlementMode: jest.fn(async () => undefined),
    busy: false,
    error: null,
    storeConnected: true,
    storeProduct: {} as ReturnType<
      typeof usePremiumEntitlement
    >["storeProduct"],
    storeProductLoading: false,
    displayPrice: "€14.99",
    purchasePremium: jest.fn(async () => undefined),
    restorePremium: jest.fn(async () => undefined),
    refreshPremium: jest.fn(async () => undefined),
    clearError: jest.fn(),
  });
}

describe("PremiumUpgradeModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("makes the one-time value and concrete Premium capabilities visible", () => {
    mockedUsePremiumEntitlement.mockReturnValue({
      status: "free",
      isPremium: false,
      developmentEntitlementMode: null,
      setDevelopmentEntitlementMode: jest.fn(async () => undefined),
      busy: false,
      error: null,
      storeConnected: true,
      storeProduct: {} as ReturnType<
        typeof usePremiumEntitlement
      >["storeProduct"],
      storeProductLoading: false,
      displayPrice: "€14.99",
      purchasePremium: jest.fn(async () => undefined),
      restorePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      clearError: jest.fn(),
    });

    const screen = renderWithProviders(
      <PremiumUpgradeModal visible onClose={jest.fn()} />,
    );

    expect(
      screen.getByText(
        "One-time purchase. No subscription and no token markup; models and voices run on your own keys, billed by your providers — none are included.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Switch response modes and run multi-model Model Council deliberation",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Free remains usable: offline conversations, history, backups, and manual export stay available.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Buy Premium · €14.99")).toBeTruthy();
    const premiumIcon = screen.getByTestId("phosphor-icon-thunderbolt", {
      includeHiddenElements: true,
    });
    expect(premiumIcon.props.color).toBe("#8A6A12");
    const valueCard = StyleSheet.flatten(
      screen.getByTestId("premium-value-card").props.style,
    );
    expect(valueCard).toMatchObject({
      backgroundColor: "rgba(138, 106, 18, 0.10)",
      borderColor: "rgba(138, 106, 18, 0.32)",
    });
    expect(mockRecordDebugLogEvent).toHaveBeenCalledWith({
      event: "premium-upgrade-dialog-presented",
      payload: {
        busy: false,
        connected: true,
        productAvailable: true,
        productLoading: false,
        status: "free",
      },
    });
  });

  it("keeps buy and restore actions reachable with a shrinkable body", () => {
    // Regression: App Review saw neither the purchase nor the restore button
    // because the fixed-height body pushed the dialog footer off-screen on the
    // smaller iPad compatibility-mode window.
    mockedUsePremiumEntitlement.mockReturnValue({
      status: "free",
      isPremium: false,
      developmentEntitlementMode: null,
      setDevelopmentEntitlementMode: jest.fn(async () => undefined),
      busy: false,
      error: null,
      storeConnected: true,
      storeProduct: {} as ReturnType<
        typeof usePremiumEntitlement
      >["storeProduct"],
      storeProductLoading: false,
      displayPrice: "€14.99",
      purchasePremium: jest.fn(async () => undefined),
      restorePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      clearError: jest.fn(),
    });

    const screen = renderWithProviders(
      <PremiumUpgradeModal visible onClose={jest.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: "Restore purchase" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Buy Premium · €14.99" }),
    ).toBeTruthy();
    const scroll = screen.getByTestId("premium-upgrade-scroll");
    expect(StyleSheet.flatten(scroll.props.style)).toMatchObject({
      flexShrink: 1,
    });
  });

  it("keeps the deterministic automation purchase actionable without a store product", () => {
    const purchasePremium = jest.fn(async () => undefined);
    mockedUsePremiumEntitlement.mockReturnValue({
      status: "free",
      isPremium: false,
      developmentEntitlementMode: "free",
      setDevelopmentEntitlementMode: jest.fn(async () => undefined),
      busy: false,
      error: null,
      storeConnected: false,
      storeProduct: null,
      storeProductLoading: false,
      displayPrice: "€14.99",
      purchasePremium,
      restorePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      clearError: jest.fn(),
    });

    const screen = renderWithProviders(
      <PremiumUpgradeModal visible onClose={jest.fn()} />,
    );
    const buy = screen.getByRole("button", {
      name: "Buy Premium · €14.99",
    });

    fireEvent.press(buy);

    expect(purchasePremium).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("presents the upgrade surface as a bottom sheet in portrait", () => {
    setViewport(390, 844);
    mockFreeEntitlement();

    const screen = renderWithProviders(
      <PremiumUpgradeModal visible onClose={jest.fn()} />,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.width).toBe("100%");
    expect(card.borderBottomLeftRadius).toBe(0);
  });

  it("keeps the purchase and restore actions reachable in the sheet", () => {
    setViewport(390, 844);
    mockFreeEntitlement();

    const screen = renderWithProviders(
      <PremiumUpgradeModal visible onClose={jest.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: "Restore purchase" }),
    ).toBeTruthy();
    expect(screen.getByText("Buy Premium · €14.99")).toBeTruthy();

    // Sheet-specific: the card's height clamp only appears when `layout`
    // resolves to "sheet". At a 390x844 viewport with zero safe-area insets
    // that clamp is min(844 * 0.85, 844 - 0) = 717.4. The plain dialog layout
    // has no maxHeight number here (it uses a percentage string), so this
    // assertion fails if the sheet opt-in regresses.
    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxHeight).toBe(717.4);
  });
});
