import React from "react";

export type VoiceVisualPhase =
  | "idle" | "recording" | "transcribing" | "thinking-briefly" | "searching" | "thinking" | "synthesizing" | "speaking";

export interface PhaseAwareVoiceActionProps {
  visualPhase?: VoiceVisualPhase;
  /** Left-hand copy: "Your turn." while recording, "Please wait." otherwise. */
  prompt?: string;
  /** Right-hand copy: the phase name — Parsing, Searching, Thinking, Speaking. */
  title?: string;
  /** One extra line under the title, e.g. "Tap when done." */
  detail?: string;
  /** 0–1 fill across the bar while recording. */
  recordingProgress?: number;
  playbackPaused?: boolean;
  onPress?: () => void;
  style?: React.CSSProperties;
}

export declare function PhaseAwareVoiceAction(props: PhaseAwareVoiceActionProps): JSX.Element;
export declare function getAccessibleForeground(background: string): string;
