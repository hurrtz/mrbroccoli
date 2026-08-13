import { useMemo } from "react";

import type { Colors } from "../../theme/colors";
import { useTheme } from "../../theme/ThemeContext";

/**
 * The introduction's palette, derived from whichever theme the app is in.
 *
 * **Decision:** The introduction follows the app's light or dark theme rather
 * than carrying a fixed one. An earlier version was permanently dark so it
 * would read as a distinct place; in a light app that landed as two products
 * stitched together. Distinctness now belongs to the one surface that has to
 * interrupt -- the workspace banner -- and the flow behind it is simply the app.
 */
export function getIntroTheme(colors: Colors, isDark: boolean) {
  return {
    canvas: colors.background,
    panel: colors.surface,
    panelActive: colors.surfaceAlt,
    border: colors.border,
    borderStrong: colors.borderStrong,

    text: colors.text,
    textSecondary: colors.textSecondary,
    textMuted: colors.textMuted,

    accent: colors.accent,
    accentSoft: colors.accentSoft,
    accentBorder: colors.accent,
    onAccent: colors.onAccent,

    /**
     * Warm sand for a chosen option: at rest a hairline, once chosen a fill
     * across the whole control, which is what makes a selection readable from
     * across the screen. It stays distinct from the green accent, which means
     * "the thing to press next" rather than "the thing you picked".
     *
     * Light needs a deeper tone than dark: the pale sand that reads as warm on
     * a near-black canvas disappears into a near-white one.
     */
    sand: isDark ? "#D9C7A7" : "#8A6A33",
    sandSoft: isDark ? "rgba(217, 199, 167, 0.13)" : "rgba(138, 106, 51, 0.09)",
    sandBorder: isDark
      ? "rgba(217, 199, 167, 0.30)"
      : "rgba(138, 106, 51, 0.34)",
    onSand: isDark ? "#17140E" : "#FFFFFF",

    muted: colors.textMuted,
    mutedSoft: isDark ? "rgba(139, 151, 168, 0.14)" : "rgba(93, 107, 122, 0.10)",

    premium: colors.premium,
    premiumSoft: colors.premiumSoft,
    premiumBorder: colors.premiumBorder,
    onPremium: colors.onPremium,
  };
}

export type IntroTheme = ReturnType<typeof getIntroTheme>;

/** The active introduction palette. Every intro surface derives its own. */
export function useIntroTheme(): IntroTheme {
  const { colors, isDark } = useTheme();
  return useMemo(() => getIntroTheme(colors, isDark), [colors, isDark]);
}

/**
 * The workspace banner's own palette, and the one place a second hue is used.
 *
 * **Decision:** The banner is deliberately not the app's colours. It is the
 * single thing on a first launch that must not read as furniture, and it keeps
 * that job now that the flow behind it follows the theme. Violet carries it in
 * both light and dark without going black, which read as a system notice rather
 * than an invitation.
 */
export const introBannerTheme = {
  canvas: "#5B21B6",
  glow: "rgba(167, 139, 250, 0.30)",
  text: "#FFFFFF",
  textSecondary: "rgba(237, 233, 254, 0.86)",
  dismiss: "rgba(237, 233, 254, 0.72)",
  action: "#FFFFFF",
  onAction: "#4C1D95",
} as const;

/**
 * Restrained corners, matching the app's own cards and fields rather than the
 * pill-shaped controls an earlier version used. `pill` remains for the genuinely
 * circular controls -- the play button and the header actions -- where the shape
 * is the control rather than a style.
 */
export const introRadius = {
  panel: 14,
  control: 10,
  pill: 999,
} as const;
