import {
  darkColors,
  getAccessibleForeground,
  lightColors,
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
      phaseRecordingTrack: "#44A055",
      phaseTranscribing: "#47BD9A",
      phaseThinkingBriefly: "#4DA6FF",
      phaseSearching: "#8B5CF6",
      phaseThinking: "#6D28D9",
      phaseSynthesizing: "#B5E61D",
      phaseSpeaking: "#059669",
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
      phaseRecordingTrack: "#5DC17D",
      phaseTranscribing: "#2DD4BF",
      phaseThinkingBriefly: "#60A5FA",
      phaseSearching: "#A78BFA",
      phaseThinking: "#E879F9",
      phaseSynthesizing: "#A3E635",
      phaseSpeaking: "#10B981",
    });
  });

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
