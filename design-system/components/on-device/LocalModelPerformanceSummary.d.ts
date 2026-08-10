export interface LocalModelPerformanceSummaryProps {
  /** How the number was arrived at: Measured, Calibrated or Estimated. */
  evidence?: string;
  /** The verdict: Viable, Below target, Test failed, Strong, Likely, Close, Not recommended. */
  fit?: string;
  /** Metric strings, e.g. ["14.2 tok/s", "Load 1.8 s", "Headroom 2.4×"]. */
  details?: string[];
}

export declare function LocalModelPerformanceSummary(props: LocalModelPerformanceSummaryProps): JSX.Element;
