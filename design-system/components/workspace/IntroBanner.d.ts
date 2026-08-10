export interface IntroBannerProps {
  title: string;
  body: string;
  /** The call to action inside the white pill. */
  action: string;
  /** The dismiss control. Withhold it until the user has opened the intro at least once — see IntroBanner.prompt.md. */
  showDismiss?: boolean;
  onOpen?: () => void;
  onDismiss?: () => void;
  visible?: boolean;
  /** A single 48pt row instead of the card — centred title only. For landscape, where the full card takes nearly half the column. `body` and `action` are dropped. */
  compact?: boolean;
}

export declare function IntroBanner(props: IntroBannerProps): JSX.Element | null;
