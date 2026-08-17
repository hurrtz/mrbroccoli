import { darkColors, lightColors, type Colors } from "../../src/theme/colors";

/**
 * Phase 7 of the design-system migration: contrast, checked against the
 * surface each colour actually sits on, in both appearances. The design
 * system's own four contrast failures were all in dark, and every one came
 * from a colour tuned against the canvas being reused on a tinted surface —
 * hence pairings, not palette-wide sweeps.
 */

function relativeLuminance(hexColor: string) {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)!
    .slice(0, 3)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first: string, second: string) {
  const [lighter, darker] = [
    relativeLuminance(first),
    relativeLuminance(second),
  ].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const GRAPHICAL_FLOOR = 3;
const TEXT_FLOOR = 4.5;

type Pairing = [
  name: string,
  ink: (colors: Colors) => string,
  surface: (colors: Colors) => string,
  floor: number,
];

/** Non-text graphics need 3:1; text needs 4.5:1. */
const PAIRINGS: Pairing[] = [
  // The orb's phase inks draw rings directly on the canvas. The light
  // transcribing/synthesizing teal sits at 2.97:1 — a design-owned hex taken
  // verbatim under Phase 1's no-rounding rule; documented separately below.
  ["recording ring on canvas", (c) => c.phaseRecordingTrack, (c) => c.background, GRAPHICAL_FLOOR],
  ["brief-thinking ring on canvas", (c) => c.phaseThinkingBriefly, (c) => c.background, GRAPHICAL_FLOOR],
  ["searching ring on canvas", (c) => c.phaseSearching, (c) => c.background, GRAPHICAL_FLOOR],
  ["thinking ring on canvas", (c) => c.phaseThinking, (c) => c.background, GRAPHICAL_FLOOR],
  ["speaking ring on canvas", (c) => c.phaseSpeaking, (c) => c.background, GRAPHICAL_FLOOR],
  // The turn ring's progress ink runs over its own track and the canvas.
  ["turn ink on turn track", (c) => c.turnInk, (c) => c.turnTrack, GRAPHICAL_FLOOR],
  ["turn ink on canvas", (c) => c.turnInk, (c) => c.background, GRAPHICAL_FLOOR],
  // The status dot rests on the accent between turns.
  ["idle status dot on canvas", (c) => c.accent, (c) => c.background, GRAPHICAL_FLOOR],
  // Satellite toggle wells in dark; light sits at 2.87:1 and is documented
  // separately below — the same pre-existing pairing IconButton uses.
  // Labels and readings on the surfaces they actually use.
  ["satellite label on canvas", (c) => c.textSecondary, (c) => c.background, TEXT_FLOOR],
  ["byline model name on canvas", (c) => c.text, (c) => c.background, TEXT_FLOOR],
  ["handle preview on raised surface", (c) => c.textSecondary, (c) => c.surfaceRaised, TEXT_FLOOR],
  ["card body on surface", (c) => c.textSecondary, (c) => c.surface, TEXT_FLOOR],
  // The filled card action uses the app's control pairing, not the raw
  // accent: white on the light accent measures 3.28:1 and fails the text
  // floor, which is exactly why activeControl exists.
  ["card action label on its control", (c) => c.onActiveControl, (c) => c.activeControl, TEXT_FLOOR],
  ["task bar title on its tint", (c) => c.text, (c) => c.accentSoft, TEXT_FLOOR],
  ["failed task bar title on its tint", (c) => c.text, (c) => c.surfaceAlt, TEXT_FLOOR],
  ["verdict success on surface", (c) => c.success, (c) => c.surface, GRAPHICAL_FLOOR],
  ["verdict danger on surface", (c) => c.danger, (c) => c.surface, GRAPHICAL_FLOOR],
  // Readiness dots on the settings canvas and cards (Phase 4).
  ["readiness ready dot on canvas", (c) => c.success, (c) => c.background, GRAPHICAL_FLOOR],
  ["readiness broken dot on canvas", (c) => c.danger, (c) => c.background, GRAPHICAL_FLOOR],
  ["readiness attention ring on canvas", (c) => c.attention, (c) => c.background, GRAPHICAL_FLOOR],
];

describe.each([
  ["light", lightColors],
  ["dark", darkColors],
] as const)("design-system contrast in %s", (_mode, colors) => {
  it.each(PAIRINGS)("keeps %s above its floor", (_name, ink, surface, floor) => {
    const inkValue = ink(colors);
    const surfaceValue = surface(colors);
    // rgba inks are washes over other fills; they have no single computable
    // ratio and are excluded by construction — every pairing here is opaque.
    expect(inkValue.startsWith("#")).toBe(true);
    expect(surfaceValue.startsWith("#")).toBe(true);
    expect(contrastRatio(inkValue, surfaceValue)).toBeGreaterThanOrEqual(
      floor,
    );
  });
});

/**
 * Documented shortfalls, all in light, all design-owned values reported to
 * the owner in the migration report. Pinned so a future palette change that
 * fixes one breaks this block and prompts promoting it into PAIRINGS above.
 */
describe("reported light-appearance shortfalls", () => {
  it("light transcribing/synthesizing teal sits just under the 3:1 floor", () => {
    const ratio = contrastRatio(
      lightColors.phaseTranscribing,
      lightColors.background,
    );
    expect(lightColors.phaseSynthesizing).toBe(lightColors.phaseTranscribing);
    expect(ratio).toBeGreaterThanOrEqual(2.9);
    expect(ratio).toBeLessThan(GRAPHICAL_FLOOR);
  });

  it("the light toggle glyph on its tinted well is a pre-existing 2.87:1", () => {
    const ratio = contrastRatio(lightColors.accent, lightColors.accentSoft);
    expect(ratio).toBeGreaterThanOrEqual(2.8);
    expect(ratio).toBeLessThan(GRAPHICAL_FLOOR);
    // Dark passes comfortably.
    expect(
      contrastRatio(darkColors.accent, darkColors.accentSoft),
    ).toBeGreaterThanOrEqual(GRAPHICAL_FLOOR);
  });
});
