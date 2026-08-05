import { useEffect, useState } from "react";

import {
  loadStorePromoScene,
  type StorePromoScene,
} from "../services/storePromoPresentation";

export function useStorePromoPresentation() {
  const [scene, setScene] = useState<StorePromoScene | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadStorePromoScene()
      .then((storedScene) => {
        if (!cancelled) {
          setScene(storedScene);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { loaded, scene };
}
