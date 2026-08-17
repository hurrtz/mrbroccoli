export interface TranscriptMessageAction {
  /** Semantic PhosphorIcon name. Shipped row order: edit, branch, copy, share-alt, sound, warning. */
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
  /** Corrected messages read "14:12 · edited" on the name line. */
  edited?: boolean;
  /** The newest row draws no thread line below its speaker. */
  last?: boolean;
  /** Text fold state (controlled). The latest message in an ongoing session should arrive expanded. */
  expanded?: boolean;
  onToggle?: () => void;
  /** The meta line, e.g. "3 sources · OpenRouter · 6.4 s". Omit entirely when usage stats are off; hidden while a foldable row is collapsed. */
  meta?: string;
  /** Turn receipt rows (route, effort, timing, tokens, search, council). Given these, the meta line ends in an info mark and opens the modal. */
  metrics?: TranscriptMessageMetric[];
  metricsOpen?: boolean;
  onOpenMetrics?: () => void;
  onCloseMetrics?: () => void;
  metricsTitle?: string;
  metricsDoneLabel?: string;
  /** Position the receipt modal over the nearest positioned ancestor — for device frames in cards and kits. */
  metricsInline?: boolean;
  /** Always visible, as bare 44pt icon targets. */
  actions?: TranscriptMessageAction[];
  assetBase?: string;
}

export declare function TranscriptMessage(props: TranscriptMessageProps): JSX.Element;
