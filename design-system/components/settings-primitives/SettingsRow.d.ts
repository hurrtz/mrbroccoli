export interface SettingsRowProps {
  /** Semantic PhosphorIcon name. */
  icon?: string;
  label: string;
  /** Current value, right-aligned before the chevron. */
  value?: string;
  /** Trailing control (switch, button). Omit for the drill-in chevron; pass null for nothing. */
  control?: React.ReactNode | null;
  /** Danger ink for destructive rows (chevron suppressed — pass control={null}). */
  danger?: boolean;
  /** Accent ink for additive rows ("Add a model"). */
  accent?: boolean;
  onPress?: () => void;
  last?: boolean;
}
export declare function SettingsRow(props: SettingsRowProps): JSX.Element;
