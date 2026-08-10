import type { VoicePhase } from "./VoiceOrb";

/** Phase dot, what is happening, and what the conversation is. Sits under the orb. */
export interface WorkspaceStatusLineProps {
  /** What is happening, in display type. "Tap to speak", "Listening", "Speaking". */
  title: string;
  /** Conversation name and age at rest; the phase instruction while a turn runs. */
  detail?: string;
  /** Tints the dot. Defaults to idle. */
  phase?: VoicePhase;
  /** Omit to hide the info control entirely. */
  onInfo?: () => void;
  style?: React.CSSProperties;
}

export function WorkspaceStatusLine(props: WorkspaceStatusLineProps): JSX.Element;
