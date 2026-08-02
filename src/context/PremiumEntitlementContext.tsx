import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import {
  ErrorCode,
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  restorePurchases,
  useIAP,
  type Product,
  type Purchase,
  type ExpoPurchaseError,
} from "expo-iap";

import { PREMIUM_PRODUCT_ID } from "../constants/premium";
import {
  cachePremiumEntitlement,
  clearCachedPremiumEntitlement,
  isOwnedPremiumPurchase,
  loadCachedPremiumEntitlement,
} from "../services/premiumEntitlement";

export type PremiumEntitlementStatus = "loading" | "free" | "premium";
export type PremiumStoreError =
  | "cancelled"
  | "pending"
  | "store-unavailable"
  | "purchase-failed"
  | null;

interface PremiumEntitlementContextValue {
  status: PremiumEntitlementStatus;
  isPremium: boolean;
  storeConnected: boolean;
  storeProduct: Product | null;
  storeProductLoading: boolean;
  displayPrice: string | null;
  busy: boolean;
  error: PremiumStoreError;
  purchasePremium: () => Promise<void>;
  restorePremium: () => Promise<void>;
  refreshPremium: () => Promise<void>;
  clearError: () => void;
}

const PremiumEntitlementContext =
  createContext<PremiumEntitlementContextValue | null>(null);

function purchaseErrorKind(error: ExpoPurchaseError): PremiumStoreError {
  if (error.code === ErrorCode.UserCancelled) {
    return "cancelled";
  }
  if (
    error.code === ErrorCode.Pending ||
    error.code === ErrorCode.DeferredPayment
  ) {
    return "pending";
  }
  if (
    error.code === ErrorCode.BillingUnavailable ||
    error.code === ErrorCode.IapNotAvailable ||
    error.code === ErrorCode.ConnectionClosed ||
    error.code === ErrorCode.ServiceDisconnected
  ) {
    return "store-unavailable";
  }
  return "purchase-failed";
}

export function PremiumEntitlementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<PremiumEntitlementStatus>("loading");
  const [storeProduct, setStoreProduct] = useState<Product | null>(null);
  const [storeProductLoading, setStoreProductLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<PremiumStoreError>(null);
  const [cacheLoaded, setCacheLoaded] = useState(false);
  const reconciliationStartedRef = useRef(false);
  const reconciliationInFlightRef = useRef(false);

  const grantPremium = useCallback(async () => {
    await cachePremiumEntitlement();
    setStatus("premium");
    setError(null);
  }, []);

  const handlePurchaseSuccess = useCallback(
    (purchase: Purchase) => {
      if (purchase.productId !== PREMIUM_PRODUCT_ID) {
        return;
      }
      if (purchase.purchaseState === "pending") {
        setError("pending");
        setBusy(false);
        return;
      }
      if (!isOwnedPremiumPurchase(purchase)) {
        setError("purchase-failed");
        setBusy(false);
        return;
      }

      void grantPremium()
        .then(async () => {
          try {
            await finishTransaction({ purchase, isConsumable: false });
          } catch {
            // Keep the locally verified entitlement. The unfinished transaction is
            // replayed by the store so finalization can be retried later.
            setError("purchase-failed");
          }
        })
        .finally(() => setBusy(false));
    },
    [grantPremium],
  );

  const { connected, reconnect, requestPurchase } = useIAP({
    onPurchaseSuccess: handlePurchaseSuccess,
    onPurchaseError: (purchaseError) => {
      setError(purchaseErrorKind(purchaseError));
      setBusy(false);
    },
    onError: () => {
      setError("store-unavailable");
      setBusy(false);
    },
  });

  useEffect(() => {
    let active = true;

    void loadCachedPremiumEntitlement()
      .then((cached) => {
        if (active) {
          setStatus(cached ? "premium" : "free");
        }
      })
      .catch(() => {
        if (active) {
          setStatus("free");
        }
      })
      .finally(() => {
        if (active) {
          setCacheLoaded(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const reconcileWithStore = useCallback(
    async (restore: boolean) => {
      if (reconciliationInFlightRef.current) {
        return;
      }
      reconciliationInFlightRef.current = true;
      setBusy(true);
      setError(null);
      try {
        if (!connected) {
          const reconnected = await reconnect();
          if (!reconnected) {
            setError("store-unavailable");
            return;
          }
        }

        if (restore) {
          await restorePurchases();
        }

        const purchases = await getAvailablePurchases();
        const ownedPurchase = purchases.find(isOwnedPremiumPurchase);
        if (ownedPurchase) {
          await grantPremium();
          await finishTransaction({
            purchase: ownedPurchase,
            isConsumable: false,
          }).catch(() => undefined);
        } else {
          await clearCachedPremiumEntitlement();
          setStatus("free");
        }
      } catch {
        // A network or store outage is not evidence that an offline cached
        // entitlement was revoked. Preserve the current status and retry later.
        setError("store-unavailable");
      } finally {
        reconciliationInFlightRef.current = false;
        setBusy(false);
      }
    },
    [connected, grantPremium, reconnect],
  );

  const loadProduct = useCallback(async () => {
    setStoreProductLoading(true);
    try {
      if (!connected) {
        const reconnected = await reconnect();
        if (!reconnected) {
          setStoreProduct(null);
          setError("store-unavailable");
          return null;
        }
      }
      const products = await fetchProducts({
        skus: [PREMIUM_PRODUCT_ID],
        type: "in-app",
      });
      const product = (products ?? []).find(
        (candidate): candidate is Product =>
          candidate.type === "in-app" && candidate.id === PREMIUM_PRODUCT_ID,
      );
      setStoreProduct(product ?? null);
      if (!product) {
        setError("store-unavailable");
      }
      return product ?? null;
    } catch {
      setStoreProduct(null);
      setError("store-unavailable");
      return null;
    } finally {
      setStoreProductLoading(false);
    }
  }, [connected, reconnect]);

  useEffect(() => {
    if (!connected || !cacheLoaded || reconciliationStartedRef.current) {
      return;
    }
    reconciliationStartedRef.current = true;
    void loadProduct();
    void reconcileWithStore(false);
  }, [cacheLoaded, connected, loadProduct, reconcileWithStore]);

  useEffect(() => {
    let previousState: AppStateStatus = AppState.currentState;
    const subscription = AppState.addEventListener("change", (nextState) => {
      const returningToForeground =
        nextState === "active" && previousState !== "active";
      previousState = nextState;
      if (
        returningToForeground &&
        cacheLoaded &&
        reconciliationStartedRef.current
      ) {
        void reconcileWithStore(false);
      }
    });
    return () => subscription.remove();
  }, [cacheLoaded, reconcileWithStore]);

  const purchasePremium = useCallback(async () => {
    if (!storeProduct) {
      setError("store-unavailable");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (!connected) {
        const reconnected = await reconnect();
        if (!reconnected) {
          setError("store-unavailable");
          setBusy(false);
          return;
        }
      }
      await requestPurchase({
        request: {
          apple: { sku: PREMIUM_PRODUCT_ID },
          google: { skus: [PREMIUM_PRODUCT_ID] },
        },
        type: "in-app",
      });
    } catch {
      setError("purchase-failed");
      setBusy(false);
    }
  }, [connected, reconnect, requestPurchase, storeProduct]);

  const restorePremium = useCallback(
    () => reconcileWithStore(true),
    [reconcileWithStore],
  );
  const refreshPremium = useCallback(async () => {
    await reconcileWithStore(false);
    await loadProduct();
  }, [loadProduct, reconcileWithStore]);

  const value = useMemo<PremiumEntitlementContextValue>(
    () => ({
      status,
      isPremium: status === "premium",
      storeConnected: connected,
      storeProduct,
      storeProductLoading,
      displayPrice: storeProduct?.displayPrice ?? null,
      busy,
      error,
      purchasePremium,
      restorePremium,
      refreshPremium,
      clearError: () => setError(null),
    }),
    [
      busy,
      connected,
      error,
      purchasePremium,
      refreshPremium,
      restorePremium,
      status,
      storeProduct,
      storeProductLoading,
    ],
  );

  return (
    <PremiumEntitlementContext.Provider value={value}>
      {children}
    </PremiumEntitlementContext.Provider>
  );
}

export function usePremiumEntitlement() {
  const context = useContext(PremiumEntitlementContext);
  if (!context) {
    throw new Error(
      "usePremiumEntitlement must be used within PremiumEntitlementProvider",
    );
  }
  return context;
}
