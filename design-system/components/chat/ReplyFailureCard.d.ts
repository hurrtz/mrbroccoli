/** A failed turn, rendered on the user's message that caused it. */
export interface ReplyFailureCardProps {
  /** Default "Reply failed". */
  title?: string;
  /** The provider's error, already humanised by the app. */
  message?: string;
  /** e.g. "Your message was kept. Retrying sends it again unchanged." */
  hint?: string;
  /** Default "Retry". */
  retryLabel?: string;
  /** Omit to hide the action (e.g. while a retry is already running). */
  onRetry?: () => void;
  style?: React.CSSProperties;
}

export function ReplyFailureCard(props: ReplyFailureCardProps): JSX.Element;
