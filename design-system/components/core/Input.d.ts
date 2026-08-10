import React from "react";

export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** password masks the value — used for provider API keys. */
  type?: "text" | "password";
  disabled?: boolean;
  allowClear?: boolean;
  /** A 44×44 slot at the trailing edge, normally an IconButton. */
  suffix?: React.ReactNode;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export declare function Input(props: InputProps): JSX.Element;
