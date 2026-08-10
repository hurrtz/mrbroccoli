export interface BackgroundTaskBarProps {
  visible?: boolean;
  /** Semantic icon name. `cpu` for an on-device install. */
  icon?: string;
  /** What is running, e.g. "Installing on-device AI". */
  title?: string;
  /** The reading: "Step 3 of 5 · about 2 min left". */
  detail?: string;
  /** 0–1. Drives the line along the bottom edge. */
  fraction?: number;
  /** progress while running, success when finished, danger when it failed. */
  tone?: "progress" | "success" | "danger";
  /** Where the row leads — the settings page that owns the job. */
  onPress?: () => void;
  style?: React.CSSProperties;
}

export declare function BackgroundTaskBar(props: BackgroundTaskBarProps): JSX.Element | null;
