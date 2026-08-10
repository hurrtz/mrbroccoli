export interface AutoSetupPlanRowProps {
  /** Which job the model was picked for: think, listen or speak. Sets the glyph. */
  role?: "think" | "listen" | "speak";
  /** The job, written out: "Thinking", "Listening", "Speaking". */
  roleLabel?: string;
  /** Model name, e.g. "Whisper Small". */
  name?: string;
  /** Download size, e.g. "466 MB". */
  size?: string;
  /** How the fit was arrived at: Measured, Calibrated, Estimated. */
  evidence?: string;
  /** The verdict: Viable, Likely, Close. */
  fit?: string;
  /** Metric strings shown under the verdict. */
  details?: string[];
  /** Where this row is in the install: planned, active, done, failed, skipped. */
  state?: "planned" | "active" | "done" | "failed" | "skipped";
  /** Replaces the performance summary with one line — used while installing or after a failure. */
  note?: string;
  style?: React.CSSProperties;
}

export declare function AutoSetupPlanRow(props: AutoSetupPlanRowProps): JSX.Element;
