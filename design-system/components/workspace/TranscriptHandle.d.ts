/** The peeking top edge of the transcript drawer, pinned to the bottom of the workspace. */
export interface TranscriptHandleProps {
  /** 0 shows the empty state and suppresses the preview. */
  messageCount?: number;
  /** Provenance of the last reply, e.g. "GPT-5 · 2 min ago". */
  meta?: string;
  /** One line of the last reply. Truncates; never wraps. */
  preview?: string;
  onPress?: () => void;
  style?: React.CSSProperties;
}

export function TranscriptHandle(props: TranscriptHandleProps): JSX.Element;
