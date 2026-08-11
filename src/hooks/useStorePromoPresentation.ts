import { useEffect, useState } from "react";

import {
  loadStorePromoOrbPresentation,
  loadStorePromoScene,
  type StorePromoOrbPresentation,
  type StorePromoScene,
} from "../services/storePromoPresentation";

export function useStorePromoPresentation() {
  const [scene, setScene] = useState<StorePromoScene | null>(null);
  const [orb, setOrb] = useState<StorePromoOrbPresentation | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      loadStorePromoScene(),
      loadStorePromoOrbPresentation(),
    ])
      .then(([storedScene, storedOrb]) => {
        if (!cancelled) {
          setScene(storedScene);
          setOrb(storedOrb);
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

  return { loaded, orb, scene };
}
