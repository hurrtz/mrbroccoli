/** The peeking top edge of the transcript drawer, pinned to the bottom of the workspace. States "Transcript" and nothing else — the byline above already names the conversation and its model. */
export interface TranscriptHandleProps {
  /** Only used for the accessible name ("Show transcript. N messages"); not rendered. */
  messageCount?: number;
  onPress?: () => void;
  style?: React.CSSProperties;
}

export function TranscriptHandle(props: TranscriptHandleProps): JSX.Element;
