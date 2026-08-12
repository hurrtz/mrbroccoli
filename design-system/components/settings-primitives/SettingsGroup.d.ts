export interface SettingsGroupProps {
  /** Uppercase caption above the card. Omit for an untitled group. */
  title?: string;
  /** Helper prose, demoted below the card — never inside rows. */
  footer?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SettingsGroup(props: SettingsGroupProps): JSX.Element;
