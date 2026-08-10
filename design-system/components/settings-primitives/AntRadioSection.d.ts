import React from "react";

export interface AntRadioOption {
  value: string;
  label: string;
  /** Shown in the info modal rather than under the row. */
  description?: string;
  disabled?: boolean;
}

export interface AntRadioSectionProps {
  label: string;
  options: AntRadioOption[];
  value: string;
  onChange: (value: string) => void;
  headerExtra?: React.ReactNode;
}

export declare function AntRadioSection(props: AntRadioSectionProps): JSX.Element;
