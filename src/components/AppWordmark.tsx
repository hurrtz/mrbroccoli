import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { fonts } from "../theme/typography";

export const APP_HEADER_MIN_HEIGHT = 62;
export const APP_HEADER_PADDING_TOP = 8;
export const APP_HEADER_PADDING_BOTTOM = 10;

export function AppWordmark({
  color,
  name,
  testID,
}: {
  color: string;
  name: string;
  testID?: string;
}) {
  return (
    <View style={styles.wordmark}>
      <Text
        testID={testID}
        numberOfLines={1}
        maxFontSizeMultiplier={1.4}
        style={[styles.wordmarkText, { color }]}
      >
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    alignItems: "center",
    flexDirection: "row",
    gap: 1,
  },
  wordmarkText: {
    fontFamily: fonts.headline,
    fontSize: 26,
    letterSpacing: -0.25,
    lineHeight: 32,
  },
});
