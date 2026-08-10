export interface AntTextAreaProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export declare function AntTextArea(props: AntTextAreaProps): JSX.Element;
