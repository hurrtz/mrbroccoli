export interface AutoSetupPlanItem {
  role: "think" | "listen" | "speak";
  roleLabel: string;
  name: string;
  size: string;
  evidence?: string;
  fit?: string;
  details?: string[];
}

export interface AutoSetupFailure {
  /** Heading, e.g. "Install did not finish". */
  title?: string;
  /** What happened, in plain words, and what state the device is left in. */
  detail?: string;
  /** Which plan row failed. Rows before it read as installed, rows after as waiting. */
  role?: "think" | "listen" | "speak";
  /** Replaces the failed row's own line. */
  note?: string;
}

export interface AutoSetupCardProps {
  /**
   * Leave undefined and the card runs itself — useful for one screen or a
   * specimen. Pass a state and the host owns the clock, which is what an
   * install that has to survive leaving the screen needs.
   */
  state?: "offer" | "scanning" | "proposal" | "installing" | "done" | "failed";
  /** 0–1 install progress. Only read while installing. */
  fraction?: number;
  /** How many device facts have been measured so far. Only read while scanning. */
  scanned?: number;
  /** The three models chosen: one to think with, one to listen, one to speak. */
  plan?: AutoSetupPlanItem[];
  /** Device readings revealed one at a time during the check. */
  facts?: { label: string; value: string }[];
  /** What went wrong. Only read in the failed state; a default is supplied. */
  error?: AutoSetupFailure;
  /** Estimated total download time in seconds, used for both time readings. */
  estimateSeconds?: number;
  /** Hide the icon, title and body — for a screen that already carries them. */
  showHeader?: boolean;
  /** Overrides for any string. */
  copy?: Record<string, string>;
  /** The device check begins. */
  onStart?: () => void;
  /** The user accepted the proposal. */
  onInstall?: () => void;
  /** Retry after a failure. */
  onRetry?: () => void;
  /** Leave for the manual catalogue. Omit to hide that route. */
  onManual?: () => void;
  /** Leave while the install keeps running. Omit to hide that route. */
  onContinue?: () => void;
  /** Acknowledge the finished install. Omit to hide the closing action. */
  onFinish?: () => void;
  style?: React.CSSProperties;
}

export declare const AUTO_SETUP_COPY: Record<string, string>;
export declare const AUTO_SETUP_PLAN: AutoSetupPlanItem[];
export declare const AUTO_SETUP_FACTS: { label: string; value: string }[];
export declare function AutoSetupCard(props: AutoSetupCardProps): JSX.Element;
