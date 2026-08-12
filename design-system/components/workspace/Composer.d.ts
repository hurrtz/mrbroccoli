/** The text composer — page two of the workspace pager. */
export interface ComposerProps {
  value: string;
  onChange?: (value: string) => void;
  /** Only invoked while value is non-empty; the send button is inert otherwise. */
  onSend?: () => void;
  /** Fix the height to fill the orb's slot so the controls below never move. Unset, the field grows to a 116pt cap. */
  height?: number;
  /** Default "Type a message". */
  placeholder?: string;
  /** Accessible name of the field. Default "Message". */
  accessibilityLabel?: string;
  style?: React.CSSProperties;
}

export function Composer(props: ComposerProps): JSX.Element;
