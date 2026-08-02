import React from "react";
import { AppState, Pressable, Text, type AppStateStatus } from "react-native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";

import { PREMIUM_PRODUCT_ID } from "../../src/constants/premium";
import {
  PremiumEntitlementProvider,
  usePremiumEntitlement,
} from "../../src/context/PremiumEntitlementContext";
import { cachePremiumEntitlement } from "../../src/services/premiumEntitlement";

const mockFetchProducts = jest.fn();
const mockFinishTransaction = jest.fn();
const mockGetAvailablePurchases = jest.fn();
const mockReconnect = jest.fn();
const mockRequestPurchase = jest.fn();
const mockRestorePurchases = jest.fn();
const mockSecureValues = new Map<string, string>();
let mockOnPurchaseSuccess: (purchase: {
  productId: string;
  purchaseState: string;
}) => void = () => undefined;

jest.mock("expo-secure-store", () => ({
  deleteItemAsync: jest.fn(async (key: string) => {
    mockSecureValues.delete(key);
  }),
  getItemAsync: jest.fn(
    async (key: string) => mockSecureValues.get(key) ?? null,
  ),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockSecureValues.set(key, value);
  }),
}));

jest.mock("expo-iap", () => ({
  ErrorCode: {
    UserCancelled: "user-cancelled",
    Pending: "pending",
    DeferredPayment: "deferred-payment",
    BillingUnavailable: "billing-unavailable",
    IapNotAvailable: "iap-not-available",
    ConnectionClosed: "connection-closed",
    ServiceDisconnected: "service-disconnected",
  },
  fetchProducts: (...args: unknown[]) => mockFetchProducts(...args),
  finishTransaction: (...args: unknown[]) => mockFinishTransaction(...args),
  getAvailablePurchases: (...args: unknown[]) =>
    mockGetAvailablePurchases(...args),
  restorePurchases: (...args: unknown[]) => mockRestorePurchases(...args),
  useIAP: (options: { onPurchaseSuccess: typeof mockOnPurchaseSuccess }) => {
    mockOnPurchaseSuccess = options.onPurchaseSuccess;
    return {
      connected: true,
      reconnect: mockReconnect,
      requestPurchase: mockRequestPurchase,
    };
  },
}));

function Probe() {
  const entitlement = usePremiumEntitlement();
  return (
    <>
      <Text testID="entitlement-status">{entitlement.status}</Text>
      <Text testID="entitlement-error">{entitlement.error ?? "none"}</Text>
      <Text testID="store-product">
        {entitlement.storeProduct?.id ?? "none"}
      </Text>
      <Pressable
        testID="restore-premium"
        onPress={() => void entitlement.restorePremium()}
      />
      <Pressable
        testID="purchase-premium"
        onPress={() => void entitlement.purchasePremium()}
      />
    </>
  );
}

function renderProvider() {
  return render(
    <PremiumEntitlementProvider>
      <Probe />
    </PremiumEntitlementProvider>,
  );
}

describe("PremiumEntitlementProvider", () => {
  beforeEach(() => {
    mockSecureValues.clear();
    jest.clearAllMocks();
    mockFetchProducts.mockResolvedValue([
      {
        id: PREMIUM_PRODUCT_ID,
        type: "in-app",
        displayPrice: "€14.99",
      },
    ]);
    mockFinishTransaction.mockResolvedValue(undefined);
    mockGetAvailablePurchases.mockResolvedValue([]);
    mockReconnect.mockResolvedValue(true);
    mockRequestPurchase.mockResolvedValue(null);
    mockRestorePurchases.mockResolvedValue(undefined);
  });

  it("keeps a cached entitlement when the store is temporarily unavailable", async () => {
    await cachePremiumEntitlement("2026-08-02T00:00:00.000Z");
    mockGetAvailablePurchases.mockRejectedValueOnce(new Error("offline"));
    const screen = renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("entitlement-status").props.children).toBe(
        "premium",
      );
    });
  });

  it("falls back to Free when both the local cache and store are unavailable", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(
      new Error("keychain unavailable"),
    );
    mockGetAvailablePurchases.mockRejectedValueOnce(new Error("offline"));
    const screen = renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("entitlement-status").props.children).toBe(
        "free",
      );
    });
  });

  it("revokes stale local access after an authoritative empty store result", async () => {
    await cachePremiumEntitlement("2026-08-02T00:00:00.000Z");
    const screen = renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("entitlement-status").props.children).toBe(
        "free",
      );
    });
  });

  it("restores the permanent product without a Mr Broccoli account", async () => {
    mockGetAvailablePurchases.mockResolvedValue([
      {
        productId: PREMIUM_PRODUCT_ID,
        purchaseState: "purchased",
      },
    ]);
    const screen = renderProvider();

    await act(async () => undefined);
    await waitFor(() => {
      expect(screen.getByTestId("entitlement-status").props.children).toBe(
        "premium",
      );
    });
    expect(mockFinishTransaction).toHaveBeenCalledWith({
      purchase: expect.objectContaining({ productId: PREMIUM_PRODUCT_ID }),
      isConsumable: false,
    });
  });

  it("runs the platform restore flow after an explicit user action", async () => {
    const screen = renderProvider();
    await waitFor(() =>
      expect(mockGetAvailablePurchases).toHaveBeenCalledTimes(1),
    );
    mockGetAvailablePurchases.mockResolvedValueOnce([
      {
        productId: PREMIUM_PRODUCT_ID,
        purchaseState: "purchased",
      },
    ]);

    fireEvent.press(screen.getByTestId("restore-premium"));

    await waitFor(() => expect(mockRestorePurchases).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(screen.getByTestId("entitlement-status").props.children).toBe(
        "premium",
      );
    });
  });

  it("grants and finalizes the permanent product after a purchase", async () => {
    const screen = renderProvider();
    await waitFor(() =>
      expect(mockGetAvailablePurchases).toHaveBeenCalledTimes(1),
    );

    fireEvent.press(screen.getByTestId("purchase-premium"));
    await waitFor(() => expect(mockRequestPurchase).toHaveBeenCalledTimes(1));
    expect(mockRequestPurchase).toHaveBeenCalledWith({
      request: {
        apple: { sku: PREMIUM_PRODUCT_ID },
        google: { skus: [PREMIUM_PRODUCT_ID] },
      },
      type: "in-app",
    });
    act(() => {
      mockOnPurchaseSuccess({
        productId: PREMIUM_PRODUCT_ID,
        purchaseState: "purchased",
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("entitlement-status").props.children).toBe(
        "premium",
      );
    });
    expect(mockFinishTransaction).toHaveBeenCalledWith({
      purchase: expect.objectContaining({ productId: PREMIUM_PRODUCT_ID }),
      isConsumable: false,
    });
  });

  it("does not start a purchase when the store product is unavailable", async () => {
    mockFetchProducts.mockResolvedValueOnce([]);
    const screen = renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("store-product").props.children).toBe("none");
      expect(screen.getByTestId("entitlement-error").props.children).toBe(
        "store-unavailable",
      );
    });

    fireEvent.press(screen.getByTestId("purchase-premium"));

    expect(mockRequestPurchase).not.toHaveBeenCalled();
  });

  it("does not grant Premium for an unconfirmed purchase state", async () => {
    const screen = renderProvider();
    await waitFor(() =>
      expect(mockGetAvailablePurchases).toHaveBeenCalledTimes(1),
    );

    act(() => {
      mockOnPurchaseSuccess({
        productId: PREMIUM_PRODUCT_ID,
        purchaseState: "unknown",
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("entitlement-status").props.children).toBe(
        "free",
      );
    });
    expect(mockFinishTransaction).not.toHaveBeenCalled();
  });

  it("rechecks store ownership after returning to the foreground", async () => {
    let onAppStateChange: (state: AppStateStatus) => void = () => undefined;
    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_event, listener) => {
        onAppStateChange = listener;
        return { remove: jest.fn() };
      });
    renderProvider();
    await waitFor(() =>
      expect(mockGetAvailablePurchases).toHaveBeenCalledTimes(1),
    );

    act(() => onAppStateChange("background"));
    act(() => onAppStateChange("active"));

    await waitFor(() =>
      expect(mockGetAvailablePurchases).toHaveBeenCalledTimes(2),
    );
  });
});
