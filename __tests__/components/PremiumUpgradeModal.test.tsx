import React from "react";
import { StyleSheet } from "react-native";

import { PremiumUpgradeModal } from "../../src/components/PremiumUpgradeModal";
import { usePremiumEntitlement } from "../../src/context/PremiumEntitlementContext";
import { renderWithProviders } from "../test-utils/renderWithProviders";

const mockRecordDebugLogEvent = jest.fn();

jest.mock("../../src/context/PremiumEntitlementContext", () => ({
  usePremiumEntitlement: jest.fn(),
}));

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: (...args: unknown[]) => mockRecordDebugLogEvent(...args),
}));

const mockedUsePremiumEntitlement = jest.mocked(usePremiumEntitlement);

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
        "One-time purchase. No subscription and no token markup; provider usage is billed by your providers.",
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
});
