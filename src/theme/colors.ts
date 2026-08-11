export const lightColors = {
  background: "#FCFBF8",
  backgroundSecondary: "#FCFBF8",
  surface: "#FFFFFF",
  surfaceAlt: "#EFEEE9",
  surfaceElevated: "#FFFFFF",
  // A card that has to read as sitting above the canvas. In light the white is
  // already a step up from the warm background; in dark the lift has to come
  // from lightness, because a shadow on a near-black canvas is invisible.
  surfaceRaised: "#FFFFFF",
  surfaceRaisedBorder: "#D9D7D1",
  text: "#1A1D24",
  textSecondary: "#5D6B7A",
  textMuted: "#5D6B7A",
  accent: "#44A055",
  accentSoft: "#E7F3E9",
  activeControl: "#378445",
  onActiveControl: "#FFFFFF",
  activeControlIcon: "#FFFFFF",
  activeControlIconBackground: "#FFFFFF1F",
  inactiveControlBorder: "#D9D7D1",
  // The voice pipeline "bookends" ramp: green at both ends of a turn,
  // travelling through teal and blue to violet at the deepest thinking and
  // back. Synthesizing deliberately mirrors transcribing, and speaking mirrors
  // the recording track. Recording itself is a technique, not just a value: a
  // translucent dark wash in light, a solid darker green in dark.
  phaseRecording: "rgba(3, 7, 18, 0.14)",
  phaseRecordingTrack: "#2E9E52",
  phaseTranscribing: "#2FA39B",
  phaseThinkingBriefly: "#3A8FD0",
  phaseSearching: "#4A67CC",
  phaseThinking: "#6A4CC4",
  phaseSynthesizing: "#2FA39B",
  phaseSpeaking: "#2E9E52",
  // The orb's whole-turn ring against its estimate.
  turnTrack: "#EFEEE9",
  turnInk: "#5D6B7A",
  // Paid capability has one colour everywhere. Light needs a deeper gold than
  // dark: the tone that reads warm on a near-black canvas disappears into a
  // near-white one. The intro flow keeps its own copy on purpose — its palette
  // is deliberately independent of the app theme.
  premium: "#8A6A12",
  premiumSoft: "rgba(138, 106, 18, 0.10)",
  premiumBorder: "rgba(138, 106, 18, 0.32)",
  onPremium: "#FFFFFF",
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
  surfaceRaised: "#262B33",
  surfaceRaisedBorder: "#3B424D",
  text: "#EDF1F5",
  textSecondary: "#8B97A8",
  textMuted: "#8B97A8",
  accent: "#5DC17D",
  accentSoft: "#1A3423",
  activeControl: "#5DC17D",
  onActiveControl: "#16181D",
  activeControlIcon: "#16181D",
  activeControlIconBackground: "#16181D1F",
  inactiveControlBorder: "#2A2F37",
  // The dark set is authored for the near-black canvas, not the light set
  // brightened. Same bookends symmetry as light.
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
  premiumSoft: "rgba(201, 162, 39, 0.14)",
  premiumBorder: "rgba(201, 162, 39, 0.34)",
  onPremium: "#1A1405",
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
