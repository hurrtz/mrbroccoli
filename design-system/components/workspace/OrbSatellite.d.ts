import type { PhosphorIconName } from "../core/PhosphorIcon";

/** A 44pt control with a mono label beneath it, for the row under the orb. */
export interface OrbSatelliteProps {
  icon: PhosphorIconName;
  /** Shown under the control. One or two words; it must survive 19 languages. */
  label: string;
  /** Accessible name when the visible label is too terse. */
  accessibilityLabel?: string;
  /** Momentary action, or a switch that stays on. Defaults to action. */
  kind?: "action" | "toggle";
  /** Only meaningful for toggles. */
  active?: boolean;
  onPress?: () => void;
  style?: React.CSSProperties;
}

export function OrbSatellite(props: OrbSatelliteProps): JSX.Element;
