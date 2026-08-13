export interface DriveSessionControlsProps {
  /** The hands-free loop is live. Accent fill + pause glyph; false shows the quiet Resume state. */
  running?: boolean;
  /** A reply exists to replay. */
  canRepeat?: boolean;
  /** Pipeline busy — both buttons dim. */
  disabled?: boolean;
  /** Silence-window seconds remaining; non-null while running shows the "Sends in N…" chip. */
  countdownSeconds?: number | null;
  /** Pre-formatted countdown string (translation) — overrides the default template. */
  countdownText?: string;
  repeatLabel?: string;
  pauseLabel?: string;
  resumeLabel?: string;
  /** Pause/resume the auto-continue loop. One fixed position, state-driven face. */
  onToggle?: () => void;
  onRepeat?: () => void;
  style?: React.CSSProperties;
}
export declare function DriveSessionControls(props: DriveSessionControlsProps): JSX.Element;
