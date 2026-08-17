import React from "react";

export interface ChatTranscriptProps {
  /** TranscriptMessage rows, oldest first. */
  children?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  isEmpty?: boolean;
  style?: React.CSSProperties;
}

export declare function ChatTranscript(props: ChatTranscriptProps): JSX.Element;
