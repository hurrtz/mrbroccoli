import * as SecureStore from "expo-secure-store";

const mockSecureValues = new Map<string, string>();

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

import { PREMIUM_PRODUCT_ID } from "../../src/constants/premium";
import {
  cachePremiumEntitlement,
  clearCachedPremiumEntitlement,
  isOwnedPremiumPurchase,
  loadCachedPremiumEntitlement,
  parseCachedPremiumEntitlement,
} from "../../src/services/premiumEntitlement";

describe("premium entitlement", () => {
  beforeEach(() => {
    mockSecureValues.clear();
    jest.clearAllMocks();
  });

  it("accepts only the permanent Premium product", () => {
    expect(
      isOwnedPremiumPurchase({
        productId: PREMIUM_PRODUCT_ID,
        purchaseState: "purchased",
      }),
    ).toBe(true);
    expect(
      isOwnedPremiumPurchase({
        productId: PREMIUM_PRODUCT_ID,
        purchaseState: "pending",
      }),
    ).toBe(false);
    expect(
      isOwnedPremiumPurchase({
        productId: PREMIUM_PRODUCT_ID,
        purchaseState: "unknown",
      }),
    ).toBe(false);
    expect(
      isOwnedPremiumPurchase({
        productId: "another-product",
        purchaseState: "purchased",
      }),
    ).toBe(false);
  });

  it("rejects malformed and stale cache entries", () => {
    expect(parseCachedPremiumEntitlement("not json")).toBeNull();
    expect(
      parseCachedPremiumEntitlement(
        JSON.stringify({
          version: 1,
          productId: "old-premium-product",
          verifiedAt: "2026-08-02T00:00:00.000Z",
        }),
      ),
    ).toBeNull();
  });

  it("persists and clears a verified offline entitlement", async () => {
    await cachePremiumEntitlement("2026-08-02T00:00:00.000Z");

    await expect(loadCachedPremiumEntitlement()).resolves.toEqual({
      version: 1,
      productId: PREMIUM_PRODUCT_ID,
      verifiedAt: "2026-08-02T00:00:00.000Z",
    });

    await clearCachedPremiumEntitlement();
    await expect(loadCachedPremiumEntitlement()).resolves.toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      "mrbroccoli.premium_entitlement",
    );
  });
});
