import * as SecureStore from "expo-secure-store";
import type { Purchase } from "expo-iap";

import { PREMIUM_PRODUCT_ID } from "../constants/premium";

const PREMIUM_ENTITLEMENT_KEY = "mrbroccoli.premium_entitlement";

export interface CachedPremiumEntitlement {
  version: 1;
  productId: typeof PREMIUM_PRODUCT_ID;
  verifiedAt: string;
}

export function isOwnedPremiumPurchase(
  purchase: Pick<Purchase, "productId" | "purchaseState">,
) {
  return (
    purchase.productId === PREMIUM_PRODUCT_ID &&
    purchase.purchaseState === "purchased"
  );
}

export function parseCachedPremiumEntitlement(
  value: string | null,
): CachedPremiumEntitlement | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CachedPremiumEntitlement>;
    return parsed.version === 1 &&
      parsed.productId === PREMIUM_PRODUCT_ID &&
      typeof parsed.verifiedAt === "string" &&
      Number.isFinite(Date.parse(parsed.verifiedAt))
      ? {
          version: 1,
          productId: PREMIUM_PRODUCT_ID,
          verifiedAt: parsed.verifiedAt,
        }
      : null;
  } catch {
    return null;
  }
}

export async function loadCachedPremiumEntitlement() {
  return parseCachedPremiumEntitlement(
    await SecureStore.getItemAsync(PREMIUM_ENTITLEMENT_KEY),
  );
}

export async function cachePremiumEntitlement(
  verifiedAt = new Date().toISOString(),
) {
  const entitlement: CachedPremiumEntitlement = {
    version: 1,
    productId: PREMIUM_PRODUCT_ID,
    verifiedAt,
  };
  await SecureStore.setItemAsync(
    PREMIUM_ENTITLEMENT_KEY,
    JSON.stringify(entitlement),
  );
  return entitlement;
}

export async function clearCachedPremiumEntitlement() {
  await SecureStore.deleteItemAsync(PREMIUM_ENTITLEMENT_KEY);
}
