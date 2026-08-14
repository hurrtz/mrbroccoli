import React from "react";
import { StyleSheet, Text } from "react-native";

import { fonts, textStyles } from "../../theme/typography";
import { useIntroTheme } from "./introTheme";

/**
 * Step heading. Uses the same headline face as the conversation drawer so the
 * introduction reads as part of the app.
 *
 * Headings are centred: every step is a single column of content with nothing
 * beside it, and a left-aligned heading over centred content read as a form.
 */
export function IntroTitle({ children }: { children: React.ReactNode }) {
  const theme = useIntroTheme();
  return (
    <Text style={[styles.title, { color: theme.text }]}>{children}</Text>
  );
}

export function IntroBody({ children }: { children: React.ReactNode }) {
  const theme = useIntroTheme();
  return (
    <Text style={[styles.body, { color: theme.textSecondary }]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  title: {
    ...textStyles.screenTitle,
    // 30 left longer headings breaking with a single word on line two.
    fontSize: 27,
    lineHeight: 33,
    textAlign: "center",
  },
});
