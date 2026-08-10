import React from "react";

export interface ToastProps {
  message: string;
  visible?: boolean;
  /** info is the neutral notice; success confirms; danger reports a failure. */
  tone?: "info" | "success" | "danger";
  /** When present the toast waits for the user instead of auto-dismissing. */
  onRetry?: () => void;
  onDismiss?: () => void;
  /** Render in flow instead of pinned 60pt below the top edge. */
  inline?: boolean;
}

export declare function Toast(props: ToastProps): JSX.Element | null;
