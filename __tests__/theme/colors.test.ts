import {
  darkColors,
  getAccessibleForeground,
  lightColors,
  withAlpha,
} from "../../src/theme/colors";

function relativeLuminance(hexColor: string) {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return (
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  );
}

function contrastRatio(firstColor: string, secondColor: string) {
  const luminances = [
    relativeLuminance(firstColor),
    relativeLuminance(secondColor),
  ].sort((first, second) => second - first);

  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

describe("theme colors", () => {
  it("uses the dedicated light palette", () => {
    expect(lightColors).toMatchObject({
      background: "#FCFBF8",
      surface: "#FFFFFF",
      text: "#1A1D24",
      textSecondary: "#5D6B7A",
      accent: "#44A055",
      activeControl: "#378445",
      onActiveControl: "#FFFFFF",
      activeControlIcon: "#FFFFFF",
      activeControlIconBackground: "#FFFFFF1F",
      inactiveControlBorder: "#D9D7D1",
      bubbleUser: "#44A055",
      success: "#059669",
      danger: "#DC2626",
      dangerFill: "#DC2626",
      phaseRecording: "rgba(3, 7, 18, 0.14)",
      phaseRecordingTrack: "#2E9E52",
      phaseTranscribing: "#2FA39B",
      phaseThinkingBriefly: "#3A8FD0",
      phaseSearching: "#4A67CC",
      phaseThinking: "#6A4CC4",
      phaseSynthesizing: "#2FA39B",
      phaseSpeaking: "#2E9E52",
      turnTrack: "#EFEEE9",
      turnInk: "#5D6B7A",
      premium: "#8A6A12",
    });
  });

  it("uses the dedicated dark palette", () => {
    expect(darkColors).toMatchObject({
      background: "#16181D",
      surface: "#1D2025",
      text: "#EDF1F5",
      textSecondary: "#8B97A8",
      accent: "#5DC17D",
      activeControl: "#5DC17D",
      onActiveControl: "#16181D",
      activeControlIcon: "#16181D",
      activeControlIconBackground: "#16181D1F",
      inactiveControlBorder: "#2A2F37",
      success: "#10B981",
      danger: "#F87171",
      phaseRecording: "#1E6B3A",
      phaseRecordingTrack: "#5DC17D",
      phaseTranscribing: "#4FD1C5",
      phaseThinkingBriefly: "#6BB2F5",
      phaseSearching: "#8093F0",
      phaseThinking: "#A78BFA",
      phaseSynthesizing: "#4FD1C5",
      phaseSpeaking: "#5DC17D",
      turnTrack: "#262B33",
      turnInk: "#8B97A8",
      premium: "#C9A227",
    });
  });

  it.each([
    ["light gold dot on the canvas", lightColors.background, lightColors.premium],
    ["light gold dot on a card", lightColors.surface, lightColors.premium],
    ["dark gold dot on the canvas", darkColors.background, darkColors.premium],
    ["dark gold dot on a card", darkColors.surface, darkColors.premium],
  ])(
    "keeps the %s above the 3:1 non-text floor",
    (_role, background, ink) => {
      expect(contrastRatio(background, ink)).toBeGreaterThanOrEqual(3);
    },
  );

  it.each([
    ["light", lightColors],
    ["dark", darkColors],
  ] as const)(
    "keeps the %s phase ramp symmetric at its bookends",
    (_mode, colors) => {
      // The ramp is green at both ends of a turn: synthesizing mirrors
      // transcribing and speaking mirrors the recording track, so the colour
      // travels out to violet and back rather than ending somewhere new.
      expect(colors.phaseSynthesizing).toBe(colors.phaseTranscribing);
      expect(colors.phaseSpeaking).toBe(colors.phaseRecordingTrack);
    },
  );

  it.each([
    [
      "light primary text",
      lightColors.background,
      lightColors.text,
    ],
    [
      "light secondary text",
      lightColors.background,
      lightColors.textSecondary,
    ],
    [
      "dark primary text",
      darkColors.background,
      darkColors.text,
    ],
    [
      "dark secondary text",
      darkColors.background,
      darkColors.textSecondary,
    ],
  ])(
    "keeps %s readable against the main background",
    (_role, background, foreground) => {
      expect(contrastRatio(background, foreground)).toBeGreaterThanOrEqual(
        4.5,
      );
    },
  );

  it.each([
    ["light", lightColors],
    ["dark", darkColors],
  ] as const)("keeps every %s phase label readable", (_mode, colors) => {
    const phaseColors = [
      colors.phaseRecordingTrack,
      colors.phaseTranscribing,
      colors.phaseThinkingBriefly,
      colors.phaseSearching,
      colors.phaseThinking,
      colors.phaseSynthesizing,
      colors.phaseSpeaking,
    ];

    for (const phaseColor of phaseColors) {
      expect(
        contrastRatio(
          phaseColor,
          getAccessibleForeground(phaseColor),
        ),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each([
    [lightColors.activeControl, lightColors.onActiveControl],
    [darkColors.activeControl, darkColors.onActiveControl],
    [lightColors.bubbleUser, lightColors.onPrimary],
    [darkColors.bubbleUser, darkColors.onPrimary],
    [lightColors.dangerFill, lightColors.onDanger],
    [darkColors.dangerFill, darkColors.onDanger],
  ])("keeps filled action text readable", (background, foreground) => {
    expect(contrastRatio(background, foreground)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("withAlpha", () => {
  it("converts six-digit hex tokens to translucent rgba", () => {
    expect(withAlpha("#DC2626", 0.12)).toBe("rgba(220, 38, 38, 0.12)");
    expect(withAlpha(lightColors.success, 0.09)).toBe("rgba(5, 150, 105, 0.09)");
  });

  it("returns already-translucent tokens unchanged", () => {
    expect(withAlpha("rgba(3, 7, 18, 0.14)", 0.3)).toBe("rgba(3, 7, 18, 0.14)");
  });
});
