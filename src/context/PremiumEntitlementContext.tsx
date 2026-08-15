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
import {
  loadDevelopmentEntitlementMode,
  saveDevelopmentEntitlementMode,
  type DevelopmentEntitlementMode,
} from "../services/developmentEntitlement";
import { recordDebugLogEvent } from "../services/debugLogCapture";

const DEVELOPMENT_PREMIUM_DISPLAY_PRICE = "€14.99";

export type PremiumEntitlementStatus = "loading" | "free" | "premium";
export type PremiumStoreError =
  "cancelled" | "pending" | "store-unavailable" | "purchase-failed" | null;

interface PremiumEntitlementContextValue {
  status: PremiumEntitlementStatus;
  isPremium: boolean;
  storeConnected: boolean;
  storeProduct: Product | null;
  storeProductLoading: boolean;
  displayPrice: string | null;
  busy: boolean;
  error: PremiumStoreError;
  developmentEntitlementMode: DevelopmentEntitlementMode | null;
  setDevelopmentEntitlementMode: (
    mode: DevelopmentEntitlementMode,
  ) => Promise<void>;
  purchasePremium: () => Promise<void>;
  restorePremium: () => Promise<void>;
  refreshPremium: () => Promise<void>;
  clearError: () => void;
}

function getGoogleBuyOfferToken(product: Product) {
  if (product.platform !== "android") {
    return undefined;
  }
  return product.discountOffers?.find(
    (offer) =>
      offer.id == null &&
      offer.preorderDetailsAndroid == null &&
      offer.rentalDetailsAndroid == null &&
      Boolean(offer.offerTokenAndroid),
  )?.offerTokenAndroid;
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

function recordPremiumStoreEvent(
  event: string,
  payload: Record<string, unknown> = {},
  level: "info" | "warn" | "error" = "info",
) {
  recordDebugLogEvent({
    event,
    level,
    payload: {
      expectedProductId: PREMIUM_PRODUCT_ID,
      ...payload,
    },
  });
}

function normalizePremiumStoreError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }
  const normalized = new Error("Premium store operation failed.");
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    Object.assign(normalized, { code: error.code });
  }
  return normalized;
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
  const [developmentEntitlementMode, setDevelopmentEntitlementModeState] =
    useState<DevelopmentEntitlementMode | null>(null);
  const reconciliationStartedRef = useRef(false);
  const reconciliationInFlightRef = useRef(false);

  const grantPremium = useCallback(async () => {
    await cachePremiumEntitlement();
    setStatus("premium");
    setError(null);
    recordPremiumStoreEvent("premium-entitlement-granted", {
      source: "store",
    });
  }, []);

  const handlePurchaseSuccess = useCallback(
    (purchase: Purchase) => {
      if (developmentEntitlementMode) {
        recordPremiumStoreEvent(
          "premium-purchase-update-ignored",
          { mode: developmentEntitlementMode, reason: "development-mode" },
          "warn",
        );
        return;
      }
      recordPremiumStoreEvent("premium-purchase-update-received", {
        productId: purchase.productId,
        purchaseState: purchase.purchaseState,
      });
      if (purchase.productId !== PREMIUM_PRODUCT_ID) {
        recordPremiumStoreEvent(
          "premium-purchase-update-ignored",
          {
            productId: purchase.productId,
            reason: "unexpected-product",
          },
          "warn",
        );
        return;
      }
      if (purchase.purchaseState === "pending") {
        recordPremiumStoreEvent("premium-purchase-pending", {
          productId: purchase.productId,
          purchaseState: purchase.purchaseState,
        });
        setError("pending");
        setBusy(false);
        return;
      }
      if (!isOwnedPremiumPurchase(purchase)) {
        recordPremiumStoreEvent(
          "premium-purchase-not-owned",
          {
            productId: purchase.productId,
            purchaseState: purchase.purchaseState,
          },
          "warn",
        );
        setError("purchase-failed");
        setBusy(false);
        return;
      }

      void grantPremium()
        .then(async () => {
          try {
            await finishTransaction({ purchase, isConsumable: false });
            recordPremiumStoreEvent("premium-purchase-finalized", {
              productId: purchase.productId,
            });
          } catch (finishError) {
            // Keep the locally verified entitlement. The unfinished transaction is
            // replayed by the store so finalization can be retried later.
            recordPremiumStoreEvent(
              "premium-purchase-finalization-failed",
              { error: normalizePremiumStoreError(finishError) },
              "error",
            );
            setError("purchase-failed");
          }
        })
        .finally(() => setBusy(false));
    },
    [developmentEntitlementMode, grantPremium],
  );

  const { connected, reconnect, requestPurchase } = useIAP({
    onPurchaseSuccess: handlePurchaseSuccess,
    onPurchaseError: (purchaseError) => {
      if (developmentEntitlementMode) {
        return;
      }
      recordPremiumStoreEvent(
        "premium-purchase-request-failed",
        {
          code: purchaseError.code,
          error: normalizePremiumStoreError(purchaseError),
        },
        purchaseError.code === ErrorCode.UserCancelled ? "info" : "error",
      );
      setError(purchaseErrorKind(purchaseError));
      setBusy(false);
    },
    onError: (storeError) => {
      if (developmentEntitlementMode) {
        return;
      }
      recordPremiumStoreEvent(
        "premium-store-listener-failed",
        { error: normalizePremiumStoreError(storeError) },
        "error",
      );
      setError("store-unavailable");
      setBusy(false);
    },
  });

  useEffect(() => {
    recordPremiumStoreEvent("premium-store-connection-changed", {
      connected,
      mode: developmentEntitlementMode ?? "store",
    });
  }, [connected, developmentEntitlementMode]);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const developmentMode = await loadDevelopmentEntitlementMode();
        if (!active) {
          return;
        }
        if (developmentMode) {
          recordPremiumStoreEvent(
            "premium-entitlement-development-mode-loaded",
            {
              mode: developmentMode,
            },
          );
          setDevelopmentEntitlementModeState(developmentMode);
          setStatus(developmentMode);
          return;
        }

        const cached = await loadCachedPremiumEntitlement();
        if (active) {
          recordPremiumStoreEvent("premium-entitlement-cache-loaded", {
            owned: Boolean(cached),
            status: cached ? "premium" : "free",
          });
          setStatus(cached ? "premium" : "free");
        }
      } catch (cacheError) {
        if (active) {
          recordPremiumStoreEvent(
            "premium-entitlement-cache-load-failed",
            { error: normalizePremiumStoreError(cacheError) },
            "error",
          );
          setStatus("free");
        }
      } finally {
        if (active) {
          setCacheLoaded(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const reconcileWithStore = useCallback(
    async (restore: boolean) => {
      if (developmentEntitlementMode) {
        recordPremiumStoreEvent("premium-entitlement-reconciliation-skipped", {
          mode: developmentEntitlementMode,
          reason: "development-mode",
          restore,
        });
        return;
      }
      if (reconciliationInFlightRef.current) {
        recordPremiumStoreEvent("premium-entitlement-reconciliation-skipped", {
          reason: "already-running",
          restore,
        });
        return;
      }
      reconciliationInFlightRef.current = true;
      setBusy(true);
      setError(null);
      recordPremiumStoreEvent("premium-entitlement-reconciliation-started", {
        connected,
        restore,
      });
      try {
        if (!connected) {
          const reconnected = await reconnect();
          recordPremiumStoreEvent("premium-store-reconnect-completed", {
            reconnected,
            source: "reconciliation",
          });
          if (!reconnected) {
            recordPremiumStoreEvent(
              "premium-entitlement-reconciliation-failed",
              { reason: "store-reconnect-failed", restore },
              "error",
            );
            setError("store-unavailable");
            return;
          }
        }

        if (restore) {
          recordPremiumStoreEvent("premium-store-restore-started");
          await restorePurchases();
          recordPremiumStoreEvent("premium-store-restore-completed");
        }

        const purchases = await getAvailablePurchases();
        const ownedPurchase = purchases.find(isOwnedPremiumPurchase);
        recordPremiumStoreEvent("premium-store-ownership-loaded", {
          owned: Boolean(ownedPurchase),
          productIds: purchases.map((purchase) => purchase.productId),
          purchaseCount: purchases.length,
          restore,
        });
        if (ownedPurchase) {
          await grantPremium();
          try {
            await finishTransaction({
              purchase: ownedPurchase,
              isConsumable: false,
            });
            recordPremiumStoreEvent("premium-owned-purchase-finalized", {
              productId: ownedPurchase.productId,
            });
          } catch (finishError) {
            recordPremiumStoreEvent(
              "premium-owned-purchase-finalization-failed",
              { error: normalizePremiumStoreError(finishError) },
              "warn",
            );
          }
        } else {
          await clearCachedPremiumEntitlement();
          setStatus("free");
          recordPremiumStoreEvent("premium-entitlement-cleared", {
            reason: "store-has-no-owned-product",
          });
        }
        recordPremiumStoreEvent(
          "premium-entitlement-reconciliation-completed",
          {
            owned: Boolean(ownedPurchase),
            restore,
          },
        );
      } catch (reconciliationError) {
        // A network or store outage is not evidence that an offline cached
        // entitlement was revoked. Preserve the current status and retry later.
        recordPremiumStoreEvent(
          "premium-entitlement-reconciliation-failed",
          {
            error: normalizePremiumStoreError(reconciliationError),
            restore,
          },
          "error",
        );
        setError("store-unavailable");
      } finally {
        reconciliationInFlightRef.current = false;
        setBusy(false);
      }
    },
    [connected, developmentEntitlementMode, grantPremium, reconnect],
  );

  const loadProduct = useCallback(async () => {
    if (developmentEntitlementMode) {
      return null;
    }
    setStoreProductLoading(true);
    recordPremiumStoreEvent("premium-store-products-load-started", {
      connected,
    });
    try {
      if (!connected) {
        const reconnected = await reconnect();
        recordPremiumStoreEvent("premium-store-reconnect-completed", {
          reconnected,
          source: "product-load",
        });
        if (!reconnected) {
          setStoreProduct(null);
          setError("store-unavailable");
          recordPremiumStoreEvent(
            "premium-store-products-load-failed",
            { reason: "store-reconnect-failed" },
            "error",
          );
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
      recordPremiumStoreEvent("premium-store-products-loaded", {
        expectedProductFound: Boolean(product),
        productCount: products?.length ?? 0,
        productIds: (products ?? []).map((candidate) => candidate.id),
      });
      setStoreProduct(product ?? null);
      if (!product) {
        setError("store-unavailable");
      }
      return product ?? null;
    } catch (productError) {
      setStoreProduct(null);
      setError("store-unavailable");
      recordPremiumStoreEvent(
        "premium-store-products-load-failed",
        { error: normalizePremiumStoreError(productError) },
        "error",
      );
      return null;
    } finally {
      setStoreProductLoading(false);
    }
  }, [connected, developmentEntitlementMode, reconnect]);

  useEffect(() => {
    if (
      developmentEntitlementMode ||
      !connected ||
      !cacheLoaded ||
      reconciliationStartedRef.current
    ) {
      return;
    }
    reconciliationStartedRef.current = true;
    void loadProduct();
    void reconcileWithStore(false);
  }, [
    cacheLoaded,
    connected,
    developmentEntitlementMode,
    loadProduct,
    reconcileWithStore,
  ]);

  useEffect(() => {
    if (developmentEntitlementMode || !cacheLoaded) {
      return;
    }
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
  }, [cacheLoaded, developmentEntitlementMode, reconcileWithStore]);

  const setDevelopmentEntitlementMode = useCallback(
    async (mode: DevelopmentEntitlementMode) => {
      if (!developmentEntitlementMode) {
        return;
      }
      if (!(await saveDevelopmentEntitlementMode(mode))) {
        return;
      }
      setDevelopmentEntitlementModeState(mode);
      setStatus(mode);
      setStoreProduct(null);
      setError(null);
      setBusy(false);
    },
    [developmentEntitlementMode],
  );

  const purchasePremium = useCallback(async () => {
    if (developmentEntitlementMode) {
      recordPremiumStoreEvent(
        "premium-purchase-request-blocked",
        { mode: developmentEntitlementMode, reason: "development-mode" },
        "warn",
      );
      setError("store-unavailable");
      return;
    }
    if (!storeProduct) {
      recordPremiumStoreEvent(
        "premium-purchase-request-blocked",
        { reason: "product-unavailable" },
        "warn",
      );
      setError("store-unavailable");
      return;
    }
    setBusy(true);
    setError(null);
    recordPremiumStoreEvent("premium-purchase-request-started", {
      connected,
      productId: storeProduct.id,
    });
    try {
      if (!connected) {
        const reconnected = await reconnect();
        recordPremiumStoreEvent("premium-store-reconnect-completed", {
          reconnected,
          source: "purchase",
        });
        if (!reconnected) {
          recordPremiumStoreEvent(
            "premium-purchase-request-failed",
            { reason: "store-reconnect-failed" },
            "error",
          );
          setError("store-unavailable");
          setBusy(false);
          return;
        }
      }
      const googleOfferToken = getGoogleBuyOfferToken(storeProduct);
      await requestPurchase({
        request: {
          apple: { sku: PREMIUM_PRODUCT_ID },
          google: {
            skus: [PREMIUM_PRODUCT_ID],
            ...(googleOfferToken ? { offerToken: googleOfferToken } : {}),
          },
        },
        type: "in-app",
      });
      recordPremiumStoreEvent("premium-purchase-request-submitted", {
        productId: storeProduct.id,
      });
    } catch (purchaseError) {
      recordPremiumStoreEvent(
        "premium-purchase-request-failed",
        { error: normalizePremiumStoreError(purchaseError) },
        "error",
      );
      setError("purchase-failed");
      setBusy(false);
    }
  }, [
    connected,
    developmentEntitlementMode,
    reconnect,
    requestPurchase,
    storeProduct,
  ]);

  const restorePremium = useCallback(() => {
    recordPremiumStoreEvent("premium-restore-requested");
    return reconcileWithStore(true);
  }, [reconcileWithStore]);
  const refreshPremium = useCallback(async () => {
    recordPremiumStoreEvent("premium-store-refresh-requested");
    await reconcileWithStore(false);
    await loadProduct();
  }, [loadProduct, reconcileWithStore]);

  const value = useMemo<PremiumEntitlementContextValue>(
    () => ({
      status,
      isPremium: status === "premium",
      storeConnected: developmentEntitlementMode === null && connected,
      storeProduct,
      storeProductLoading,
      displayPrice:
        storeProduct?.displayPrice ??
        (developmentEntitlementMode === "free"
          ? DEVELOPMENT_PREMIUM_DISPLAY_PRICE
          : null),
      busy,
      error,
      developmentEntitlementMode,
      setDevelopmentEntitlementMode,
      purchasePremium,
      restorePremium,
      refreshPremium,
      clearError: () => setError(null),
    }),
    [
      busy,
      connected,
      developmentEntitlementMode,
      error,
      purchasePremium,
      refreshPremium,
      restorePremium,
      setDevelopmentEntitlementMode,
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
