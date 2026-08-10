/** The conversation's settings as one line of muted text, with a control beside it. */
export interface ConversationSettingsSummaryProps {
  /** Noun phrases joined by middots, e.g. "Balanced · Brief · Heart". No trailing stop. */
  summary: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: React.CSSProperties;
}

export function ConversationSettingsSummary(props: ConversationSettingsSummaryProps): JSX.Element;
