/** One label/value line of the receipt. Values arrive formatted — the app composes them from locale keys. */
export interface TurnReceiptRow {
  label: string;
  /** Pre-formatted, middle-dot separated, e.g. "OpenAI · GPT-5 · ×2". */
  value: string;
  /** Timing and transport rows render in the mono metadata face. */
  mono?: boolean;
}

/** Disclosure under an assistant reply: what the turn actually did. */
export interface TurnReceiptCardProps {
  /** Default "Turn receipt". */
  title?: string;
  /** The collapsed line, e.g. "OpenRouter · 6.4 s". */
  summary?: string;
  rows: TurnReceiptRow[];
  defaultExpanded?: boolean;
  style?: React.CSSProperties;
}

export function TurnReceiptCard(props: TurnReceiptCardProps): JSX.Element;
