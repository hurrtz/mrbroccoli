export interface AntPickerOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AntPickerRowProps {
  label: string;
  value: string;
  options: readonly AntPickerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Drop the 16pt side inset when the row is not inside AntPickerRows. */
  standalone?: boolean;
}

export declare function AntPickerRow(props: AntPickerRowProps): JSX.Element;
