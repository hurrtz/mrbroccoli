export interface IntroBannerProps {
  /** Defaults to "Set up Mr Broccoli". */
  title?: string;
  /** Defaults to "A minute of setup gets him thinking, hearing you and speaking back.". */
  body?: string;
  /** The dismiss control. Withhold it until the user has opened the intro at least once — see IntroBanner.prompt.md. */
  showDismiss?: boolean;
  /** The whole banner is one pressable; the play circle is an affordance, not a separate target. */
  onOpen?: () => void;
  onDismiss?: () => void;
  visible?: boolean;
  /** Single 48pt row for landscape. */
  compact?: boolean;
}

export declare function IntroBanner(props: IntroBannerProps): JSX.Element | null;
