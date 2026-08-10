import React from "react";

export interface ChatTranscriptProps {
  /** ChatBubble rows, oldest first. */
  children?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  isEmpty?: boolean;
  style?: React.CSSProperties;
}

export declare function ChatTranscript(props: ChatTranscriptProps): JSX.Element;
