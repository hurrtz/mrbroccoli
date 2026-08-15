/** The conversation's settings as one line of muted text, with a control beside it. */
export interface ConversationSettingsSummaryProps {
  /** Labelled fields joined by the standard separator dot, e.g. "Length: Brief · Tone: Balanced · Voice: Heart". Longer is fine — it truncates at the end rather than wrapping. */
  summary: string;
  onPress?: () => void;
  /** Landscape: the sentence is dropped and only the control remains, so the orb gets the height. */
  iconOnly?: boolean;
  accessibilityLabel?: string;
  style?: React.CSSProperties;
}

export function ConversationSettingsSummary(props: ConversationSettingsSummaryProps): JSX.Element;
