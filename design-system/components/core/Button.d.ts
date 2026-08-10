import React from "react";

export interface ButtonProps {
  children?: React.ReactNode;
  /** ghost is the default; primary carries the accent; warning is destructive. */
  type?: "ghost" | "primary" | "warning";
  /** small drops to a 40pt control — use only inside dense cards. */
  size?: "small" | "large";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export declare function Button(props: ButtonProps): JSX.Element;
