import type { PhosphorIconName } from "../core/PhosphorIcon";

/** A 44pt control with a mono label beneath it, for the row under the orb. */
export interface OrbSatelliteProps {
  icon: PhosphorIconName;
  /** Shown under the control. One or two words; it must survive 19 languages. */
  label: string;
  /** Accessible name when the visible label is too terse. */
  accessibilityLabel?: string;
  /** Tints the glyph and the label only — never a fill or a border. Stop is danger, Resume is success. */
  tone?: "neutral" | "danger" | "success";
  /** Momentary action, or a switch that stays on. Defaults to action. */
  kind?: "action" | "toggle";
  /** Only meaningful for toggles. */
  active?: boolean;
  /** Dimmed and inert — the transport satellites use it before the speaking phase. */
  disabled?: boolean;
  onPress?: () => void;
  style?: React.CSSProperties;
}

export function OrbSatellite(props: OrbSatelliteProps): JSX.Element;
