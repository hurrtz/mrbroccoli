import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import {
  isStorePromoLanguage,
  seedStorePromoFixture,
} from "../src/services/storePromoFixtures";

type FixtureState = "loading" | "ready" | "denied" | "error";

export default function StorePromosFixtureRoute() {
  const { locale } = useLocalSearchParams<{ locale?: string | string[] }>();
  const requestedLocale = Array.isArray(locale) ? locale[0] : locale;
  const [state, setState] = useState<FixtureState>("loading");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!isStorePromoLanguage(requestedLocale)) {
        setState("error");
        return;
      }

      try {
        const seeded = await seedStorePromoFixture(requestedLocale);
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
  }, [requestedLocale]);

  if (state === "denied") {
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.screen} testID={`store-promo-fixture-${state}`}>
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
