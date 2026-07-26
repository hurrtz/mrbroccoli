export const lightColors = {
  background: "#FCFBF8",
  backgroundSecondary: "#FCFBF8",
  surface: "#FFFFFF",
  surfaceAlt: "#EFEEE9",
  surfaceElevated: "#FFFFFF",
  text: "#1A1D24",
  textSecondary: "#5D6B7A",
  textMuted: "#5D6B7A",
  accent: "#44A055",
  accentSoft: "#E7F3E9",
  phaseRecording: "rgba(3, 7, 18, 0.08)",
  phaseRecordingTrack: "#44A055",
  phaseTranscribing: "#47BD9A",
  phaseThinkingBriefly: "#4DA6FF",
  phaseSearching: "#8B5CF6",
  phaseThinking: "#6D28D9",
  phaseSynthesizing: "#B5E61D",
  phaseSpeaking: "#059669",
  bubbleUser: "#44A055",
  onAccent: "#FFFFFF",
  onPrimary: "#030712",
  onDanger: "#FFFFFF",
  bubbleAssistant: "#FFFFFF",
  border: "#D9D7D1",
  borderStrong: "#BDBAB2",
  overlay: "rgba(13, 15, 18, 0.46)",
  glow: "rgba(23, 25, 29, 0.08)",
  glowStrong: "rgba(68, 160, 85, 0.18)",
  success: "#059669",
  danger: "#DC2626",
  dangerFill: "#DC2626",
};

export const darkColors = {
  background: "#16181D",
  backgroundSecondary: "#16181D",
  surface: "#1D2025",
  surfaceAlt: "#20242A",
  surfaceElevated: "#1D2025",
  text: "#EDF1F5",
  textSecondary: "#8B97A8",
  textMuted: "#8B97A8",
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
  bubbleAssistant: "#1D2025",
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
