/** The product's only switch: a 46×28 track inside a 44pt target. */
export interface SwitchProps {
  value?: boolean;
  onChange?: (next: boolean) => void;
  /** Required when no adjacent label names the switch. */
  accessibilityLabel?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export declare function Switch(props: SwitchProps): JSX.Element;
