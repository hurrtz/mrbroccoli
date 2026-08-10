export interface AntNumberInputRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Values below this are rejected and the field reverts. */
  min?: number;
}

export declare function AntNumberInputRow(props: AntNumberInputRowProps): JSX.Element;
