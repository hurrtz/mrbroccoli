export interface InstallProgressProps {
  /** What is happening right now, e.g. "Downloading Whisper Small". */
  label?: string;
  /** 1-based position in the queue. Omit to hide the step reading. */
  step?: number;
  /** How many steps the queue holds. */
  stepCount?: number;
  /** Time reading, e.g. "about 2 min left". */
  remaining?: string;
  /** 0–1. Drives the fill and the percentage. */
  fraction?: number;
  /** Fill colour. Accent by default; pass the danger token for a stalled queue. */
  tone?: string;
  style?: React.CSSProperties;
}

export declare function InstallProgress(props: InstallProgressProps): JSX.Element;
