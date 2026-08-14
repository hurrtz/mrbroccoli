export type VoicePhase =
  | "idle"
  | "recording"
  | "transcribing"
  | "thinking-briefly"
  | "searching"
  | "thinking"
  | "synthesizing"
  | "speaking";

/**
 * The workspace's one loud element: a large circular control whose two rings
 * carry the current phase and the whole turn against its estimate.
 */
export interface VoiceOrbProps {
  /** Which pipeline phase the orb is showing. Defaults to idle. */
  phase?: VoicePhase;
  /** 0–1 progress. Recording: how much of the recording window is used before auto-submit (both rings, one indicator). Transcribing→synthesizing: the current phase against itself (inner ring). Speaking: how much of the whole response was read (both rings) — paragraph jumps move it. */
  phaseProgress?: number;
  /** 0–1 through the whole turn against its estimate. Drives the outer ring during the middle phases (transcribing → synthesizing); ignored while idle, recording or speaking. */
  turnProgress?: number;
  /** 0–1 past the estimate. Above 0 both rings fill with red as the turn runs. */
  overtime?: number;
  /** Diameter in points. 196 in portrait, 150 in landscape. */
  size?: number;
  /** Accessible name. Falls back to a per-phase sentence. */
  label?: string;
  onPress?: () => void;
  style?: React.CSSProperties;
}

export function VoiceOrb(props: VoiceOrbProps): JSX.Element;
