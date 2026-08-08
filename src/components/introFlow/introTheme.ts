/**
 * A self-contained palette for the introduction.
 *
 * The app is warm white with green accents. The introduction deliberately is
 * not: it reads as a place rather than a screen, so a first-time user
 * recognises it as an aside they can leave, and so the workspace behind it
 * still feels like the destination.
 *
 * **Decision:** These values do not follow the light/dark theme. The
 * introduction is the same surface in both, because its job is to be
 * unmistakably distinct from whatever it sits on top of. Every colour needed
 * is therefore defined here rather than pulled from `theme/colors`.
 */
export const introTheme = {
  /** Deep neutral canvas, warm enough not to read as pure black. */
  canvas: "#14161A",
  /** Slightly lifted panel for grouped content. */
  panel: "#1B1E24",
  /** Pressed/selected state for a panel. */
  panelActive: "#232830",
  /** Hairline borders: visible on the canvas without drawing attention. */
  border: "#2A2F38",
  borderStrong: "#3A414D",

  text: "#F2F5F8",
  textSecondary: "#A3AEBD",
  textMuted: "#6F7B8B",

  /** The app's green, lifted for contrast against the dark canvas. */
  accent: "#5DC17D",
  accentSoft: "rgba(93, 193, 125, 0.14)",
  accentBorder: "rgba(93, 193, 125, 0.32)",
  onAccent: "#0E1013",

  /** Optional-step marker: present but never competing with the accent. */
  muted: "#7C8798",
  mutedSoft: "rgba(124, 135, 152, 0.14)",

  /** Premium is the one place a second hue is allowed. */
  premium: "#C9A227",
  premiumSoft: "rgba(201, 162, 39, 0.14)",
  premiumBorder: "rgba(201, 162, 39, 0.34)",
} as const;

/**
 * Radii tuned to the ElevenLabs input the design references: generously
 * rounded panels, fully rounded controls.
 */
export const introRadius = {
  panel: 20,
  control: 14,
  pill: 999,
} as const;
