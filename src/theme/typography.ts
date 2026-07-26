import { Platform, type TextStyle } from "react-native";

export const fonts = {
  headline: "UnicaOne_400Regular",
  display: "Outfit_600SemiBold",
  displayHeavy: "Outfit_700Bold",
  body: "Outfit_400Regular",
  bodyMedium: "Outfit_500Medium",
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  }),
};

/**
 * Semantic text roles shared across the app. `screenTitle`, `sectionTitle`,
 * and `subsectionTitle` are the mobile equivalents of h1–h3; `body`,
 * `supporting`, and `caption` cover paragraph text; the remaining roles are
 * reserved for controls and metadata. Components should choose a role for
 * meaning first, then add only layout-specific properties locally.
 */
export const textStyles = {
  screenTitle: {
    fontFamily: fonts.headline,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "400",
    letterSpacing: -0.25,
  },
  sectionTitle: {
    fontFamily: fonts.headline,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: -0.1,
  },
  subsectionTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  supporting: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "400",
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "400",
  },
  controlLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    letterSpacing: 0.75,
    textTransform: "uppercase",
  },
  controlValue: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
  action: {
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
  },
  compactAction: {
    fontFamily: fonts.display,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  metadata: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "400",
  },
} satisfies Record<string, TextStyle>;
