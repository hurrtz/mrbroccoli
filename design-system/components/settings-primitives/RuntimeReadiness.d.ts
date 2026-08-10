export type ReadinessState = "ready" | "attention" | "broken" | "off";

export type ReadinessStep = "think" | "listen" | "speak" | "search";

/**
 * The four capabilities a conversation needs, on one line, each a 44pt target.
 */
export interface RuntimeReadinessProps {
  /** State per capability. Anything omitted reads as "off". */
  readiness?: Partial<Record<ReadinessStep, ReadinessState>>;
  /**
   * Opens the setting behind a capability. Omit to render the line inert —
   * the cursor drops to default, but the 44pt targets stay, so the layout
   * does not move between the two.
   */
  onSelect?: (step: ReadinessStep) => void;
  style?: React.CSSProperties;
}

export function RuntimeReadiness(props: RuntimeReadinessProps): JSX.Element;
