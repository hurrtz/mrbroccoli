export interface PipelineNoticeAction {
  label: string;
  icon?: string;
  onPress?: () => void;
  /** quiet renders the bordered secondary treatment; default is accent-soft. */
  tone?: "default" | "quiet";
}

/** One warning the pipeline raised mid-turn. */
export interface PipelineNotice {
  /** The stage's localized label: "Speech to text", "Web search", … */
  stageLabel: string;
  level: "info" | "error";
  message: string;
  detail?: string;
  /** Recovery, e.g. retry speech / open speaking settings on a TTS error. */
  actions?: PipelineNoticeAction[];
}

/** Flat list of pipeline warnings under the reply. Renders nothing when empty. */
export interface PipelineNoticesProps {
  notices?: PipelineNotice[];
  style?: React.CSSProperties;
}

export function PipelineNotices(props: PipelineNoticesProps): JSX.Element | null;
