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
      accent: "#32894D",
      success: "#059669",
      danger: "#DC2626",
      phaseRecordingTrack: "#32894D",
      phaseTranscribing: "#0F766E",
      phaseThinkingBriefly: "#2563EB",
      phaseSearching: "#7C3AED",
      phaseThinking: "#C026D3",
      phaseSynthesizing: "#65A30D",
      phaseSpeaking: "#059669",
    });
  });

  it("uses the dedicated dark palette", () => {
    expect(darkColors).toMatchObject({
      accent: "#5DC17D",
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
    [lightColors.bubbleUser, lightColors.onPrimary],
    [darkColors.bubbleUser, darkColors.onPrimary],
    [lightColors.dangerFill, lightColors.onDanger],
    [darkColors.dangerFill, darkColors.onDanger],
  ])("keeps filled action text readable", (background, foreground) => {
    expect(contrastRatio(background, foreground)).toBeGreaterThanOrEqual(4.5);
  });
});
