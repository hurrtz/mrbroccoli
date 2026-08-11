import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import {
  isStorePromoLanguage,
  seedStorePromoFixture,
} from "../src/services/storePromoFixtures";
import {
  isStorePromoOrbPresentation,
  isStorePromoScene,
  type StorePromoOrbPresentation,
} from "../src/services/storePromoPresentation";

type FixtureState = "loading" | "ready" | "denied" | "error";

export default function StorePromosFixtureRoute() {
  const { locale, overtime, phase, phaseProgress, scene, turnProgress } = useLocalSearchParams<{
    locale?: string | string[];
    overtime?: string | string[];
    phase?: string | string[];
    phaseProgress?: string | string[];
    scene?: string | string[];
    turnProgress?: string | string[];
  }>();
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const requestedLocale = first(locale);
  const requestedScene = first(scene);
  const requestedPhase = first(phase);
  const requestedPhaseProgress = first(phaseProgress);
  const requestedTurnProgress = first(turnProgress);
  const requestedOvertime = first(overtime);
  const [state, setState] = useState<FixtureState>("loading");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (
        !isStorePromoLanguage(requestedLocale) ||
        !isStorePromoScene(requestedScene)
      ) {
        setState("error");
        return;
      }

      const hasOrbField = [
        requestedPhase,
        requestedPhaseProgress,
        requestedTurnProgress,
        requestedOvertime,
      ].some(
        (value) => value !== undefined,
      );
      let requestedOrb: StorePromoOrbPresentation | null = null;
      if (hasOrbField) {
        const candidate: unknown = {
          phase: requestedPhase,
          phaseProgress: Number(requestedPhaseProgress),
          turnProgress: Number(requestedTurnProgress),
          overtime: Number(requestedOvertime),
        };
        if (!isStorePromoOrbPresentation(candidate)) {
          setState("error");
          return;
        }
        requestedOrb = candidate;
      }

      try {
        const seeded = await seedStorePromoFixture(
          requestedLocale,
          requestedScene,
          requestedOrb,
        );
        if (!cancelled) {
          setState(seeded ? "ready" : "denied");
        }
      } catch {
        if (!cancelled) {
          setState("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    requestedLocale,
    requestedOvertime,
    requestedPhase,
    requestedPhaseProgress,
    requestedScene,
    requestedTurnProgress,
  ]);

  if (state === "denied") {
    return <Redirect href="/" />;
  }

  return (
    <View
      style={styles.screen}
      testID={`store-promo-fixture-${state}-${requestedScene ?? "unknown"}`}
    >
      {state === "loading" ? <ActivityIndicator /> : null}
      <Text>{state}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
