import type { PhosphorIconName } from "../core/PhosphorIcon";

/**
 * A 44pt control with a mono label beneath it — the composing row under the orb,
 * and the four transport verbs around it. Bare in both appearances: no fill, no
 * border, ever. State lives in the glyph (filled + accent when on); the squircle
 * appears only as a momentary press disc.
 */
export interface OrbSatelliteProps {
  icon: PhosphorIconName;
  /** Shown under the control. One or two words; a newline breaks it onto a second 12px line ("Hands\nfree") — two lines at most. It must survive 19 languages. For the image deck it is the localised count ("3 images"). */
  label: string;
  /** Accessible name when the visible label is too terse. */
  accessibilityLabel?: string;
  /** Tints glyph and label together — Stop is danger, Resume is success. Never a fill or a border. */
  tone?: "neutral" | "danger" | "success";
  /** Momentary action, or a switch that stays on. Defaults to action. */
  kind?: "action" | "toggle";
  /** Only meaningful for toggles: fills the glyph and takes the accent, label with it. */
  active?: boolean;
  /** Dimmed and inert — the transport satellites use it before the speaking phase, and the whole composing row uses it while a turn runs. */
  disabled?: boolean;
  /** Drops the label and narrows the column to 44 — landscape, where there is no room for captions. */
  iconOnly?: boolean;
  /**
   * Replaces the glyph with the pictures themselves — the Image satellite's deck.
   * Pass every attachment's uri; at most three render (front one first, the pile
   * behind it), so the array's length is what says one, two, or three-and-more.
   * `null` entries draw a neutral placeholder tile. The exact count belongs in
   * `label`; there is no badge.
   */
  thumbnails?: (string | null)[];
  onPress?: () => void;
  style?: React.CSSProperties;
}

export function OrbSatellite(props: OrbSatelliteProps): JSX.Element;
