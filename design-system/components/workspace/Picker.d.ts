import React from "react";

export interface PickerProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  /** Small mono label inside the control. Defaults to "Selection". */
  dropdownLabel?: string;
  hideLabel?: boolean;
  hideDropdownLabel?: boolean;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export declare function Picker(props: PickerProps): JSX.Element;
