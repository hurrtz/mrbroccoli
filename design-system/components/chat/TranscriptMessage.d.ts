export interface TranscriptMessageAction {
  /** Semantic PhosphorIcon name, e.g. "branch", "copy", "share-alt", "sound". */
  icon: string;
  label: string;
  onPress?: () => void;
}

export interface TranscriptMessageMetric {
  label: string;
  /** Pre-formatted value string. */
  value: string;
}

export interface TranscriptMessageProps {
  role: "user" | "assistant";
  /** The message text, one entry per paragraph. Collapsed, paragraphs flatten into a three-line clamp. */
  paragraphs: string[];
  /** Assistant rows: model display name. Ignored when council is given. */
  model?: string;
  /** Assistant rows: provider id for the margin mark. */
  provider?: string;
  /** Council turns: provider ids, one per participating model (duplicates allowed) — renders "Council of" + marks. */
  council?: string[];
  /** Pre-formatted time of day, e.g. "14:12". */
  time?: string;
  /** Text fold state (controlled). The latest message in an ongoing session should arrive expanded. */
  expanded?: boolean;
  onToggle?: () => void;
  /** The always-visible meta line, e.g. "3 sources · OpenRouter · 6.4 s". Omit entirely when usage stats are off. */
  meta?: string;
  /** Full metrics for the meta disclosure (turn, route, timing, tokens, search, council). */
  metrics?: TranscriptMessageMetric[];
  metricsOpen?: boolean;
  onToggleMetrics?: () => void;
  /** Shown only while expanded, as bare 44pt icon targets. */
  actions?: TranscriptMessageAction[];
  assetBase?: string;
}

export declare function TranscriptMessage(props: TranscriptMessageProps): JSX.Element;
