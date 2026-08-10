import React from "react";

/** The seven step ids, in order. */
export const INTRO_STEPS: string[];

/** English defaults for every string the flow renders. */
export const INTRO_COPY: Record<string, string>;

/**
 * The seven-step introduction the workspace banner opens: what the app is, what
 * setup requires, the offer to set the device up automatically, the one
 * requirement, the two optional parts, and Premium.
 */
export interface IntroFlowProps {
  visible?: boolean;
  /** Step to open on. A fresh open passes 0; a return from purchase passes the step it left. */
  initialStep?: number;
  /** Overrides for any INTRO_COPY key. Merge, not replace. */
  copy?: Partial<Record<string, string>>;
  /**
   * Props for the automatic-setup step's card. Omit and the card runs itself;
   * pass state, fraction, scanned and handlers when the install has to keep
   * running after the introduction is closed.
   */
  autoSetup?: Record<string, unknown>;
  onClose?: () => void;
  /** Receives the step it was invoked from, so a cancelled purchase can return there. */
  onConnectProvider?: (step: number) => void;
  onInstallLocal?: () => void;
  /** Receives the step it was invoked from, so a cancelled purchase can return there. */
  onOpenPremium?: (step: number) => void;
  onOpenStt?: () => void;
  onOpenTts?: () => void;
  style?: React.CSSProperties;
}

export function IntroFlow(props: IntroFlowProps): JSX.Element | null;
