// Browser stub for `expo-iap`.
//
// PremiumUpgradeModal reads its state from PremiumEntitlementContext, which
// throws outside PremiumEntitlementProvider — so the provider has to be in the
// preview chain. But the real module resolves a native In-App Purchase module
// on import (`Cannot find native module 'ExpoIap'`), and because the provider
// wraps every card, that one error surfaced on all 31 previews.
//
// The stub settles the provider into its loaded, non-premium state: no
// entitlement, no products, no error. That is precisely the state the upgrade
// modal exists to render, so previewing against it is honest rather than a
// workaround. Purchase flows are interaction-driven and cannot be captured in
// a static screenshot regardless.
//
// Nothing here reaches the app: the shipped bundle uses the real expo-iap.

export const ErrorCode = {
  Unknown: "unknown",
  UserCancelled: "user-cancelled",
  ItemUnavailable: "item-unavailable",
  NetworkError: "network-error",
};

export async function fetchProducts() {
  return [];
}

export async function getAvailablePurchases() {
  return [];
}

export async function restorePurchases() {
  return [];
}

export async function finishTransaction() {
  return undefined;
}

export function useIAP() {
  return {
    connected: true,
    products: [],
    availablePurchases: [],
    currentPurchase: null,
    currentPurchaseError: null,
    finishTransaction,
    getAvailablePurchases,
    fetchProducts,
    restorePurchases,
  };
}
