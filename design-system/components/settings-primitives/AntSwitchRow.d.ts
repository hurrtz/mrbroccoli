export interface AntSwitchRowProps {
  label: string;
  /** One supporting line. Sentence case, full stop. */
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export declare function AntSwitchRow(props: AntSwitchRowProps): JSX.Element;
