import React from "react";

export interface AntPickerSectionProps {
  title?: string;
  children: React.ReactNode;
  helperText?: React.ReactNode;
  headerExtra?: React.ReactNode;
}

export declare function AntPickerSection(props: AntPickerSectionProps): JSX.Element;
