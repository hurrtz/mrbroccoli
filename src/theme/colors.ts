export const lightColors = {
  background: "#F3F2EE",
  backgroundSecondary: "#ECEAE5",
  surface: "#FCFBF8",
  surfaceAlt: "#EFEEE9",
  surfaceElevated: "#FFFFFF",
  text: "#17191D",
  textSecondary: "#60636A",
  textMuted: "#6F737B",
  accent: "#32894D",
  accentSoft: "#E4F1E7",
  phaseRecording: "#24743C",
  phaseRecordingTrack: "#32894D",
  phaseTranscribing: "#0F766E",
  phaseThinkingBriefly: "#2563EB",
  phaseSearching: "#7C3AED",
  phaseThinking: "#C026D3",
  phaseSynthesizing: "#65A30D",
  phaseSpeaking: "#059669",
  bubbleUser: "#32894D",
  onAccent: "#FFFFFF",
  onPrimary: "#030712",
  onDanger: "#FFFFFF",
  bubbleAssistant: "#FCFBF8",
  border: "#D9D7D1",
  borderStrong: "#BDBAB2",
  overlay: "rgba(13, 15, 18, 0.46)",
  glow: "rgba(23, 25, 29, 0.08)",
  glowStrong: "rgba(50, 137, 77, 0.18)",
  success: "#059669",
  danger: "#DC2626",
  dangerFill: "#DC2626",
};

export const darkColors = {
  background: "#0D0F12",
  backgroundSecondary: "#111419",
  surface: "#15181D",
  surfaceAlt: "#20242A",
  surfaceElevated: "#1C2026",
  text: "#F4F2ED",
  textSecondary: "#A8ABB2",
  textMuted: "#8C9099",
  accent: "#5DC17D",
  accentSoft: "#1A3423",
  phaseRecording: "#329F59",
  phaseRecordingTrack: "#5DC17D",
  phaseTranscribing: "#2DD4BF",
  phaseThinkingBriefly: "#60A5FA",
  phaseSearching: "#A78BFA",
  phaseThinking: "#E879F9",
  phaseSynthesizing: "#A3E635",
  phaseSpeaking: "#10B981",
  bubbleUser: "#5DC17D",
  onAccent: "#FFFFFF",
  onPrimary: "#111827",
  onDanger: "#111827",
  bubbleAssistant: "#15181D",
  border: "#2C3138",
  borderStrong: "#424851",
  overlay: "rgba(0, 0, 0, 0.72)",
  glow: "rgba(0, 0, 0, 0.26)",
  glowStrong: "rgba(93, 193, 125, 0.22)",
  success: "#10B981",
  danger: "#F87171",
  dangerFill: "#F87171",
};

export type Colors = typeof lightColors;

const LIGHT_PHASE_FOREGROUND = "#FFFFFF";
const DARK_PHASE_FOREGROUND = "#030712";

function relativeLuminance(hexColor: string) {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);

  if (!channels || channels.length !== 3) {
    return 0;
  }

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrastRatio(firstColor: string, secondColor: string) {
  const lighter = Math.max(
    relativeLuminance(firstColor),
    relativeLuminance(secondColor),
  );
  const darker = Math.min(
    relativeLuminance(firstColor),
    relativeLuminance(secondColor),
  );

  return (lighter + 0.05) / (darker + 0.05);
}

export function getAccessibleForeground(backgroundColor: string) {
  return contrastRatio(backgroundColor, DARK_PHASE_FOREGROUND) >
    contrastRatio(backgroundColor, LIGHT_PHASE_FOREGROUND)
    ? DARK_PHASE_FOREGROUND
    : LIGHT_PHASE_FOREGROUND;
}
