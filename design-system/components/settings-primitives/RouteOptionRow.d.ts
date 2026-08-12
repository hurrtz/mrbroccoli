export interface RouteOptionRowProps {
  /** The active route. Exactly one per picker. */
  selected?: boolean;
  /** Radio dimmed and unselectable — on-device models before a viable test, mid-download, or not installed. */
  disabled?: boolean;
  /** Free-edition ghost: dimmed row, lock glyph, no radio interaction. */
  locked?: boolean;
  label: string;
  /** Mono meta: install state, size, privacy note, provider attribution. */
  meta?: string;
  /** The row's single state-driven action (IconAction): download, cancel, test-egg, update. */
  action?: React.ReactNode;
  /** Extra content under a selected route (voice value row etc.), indented past the radio. */
  sub?: React.ReactNode;
  onSelect?: () => void;
  last?: boolean;
}
export declare function RouteOptionRow(props: RouteOptionRowProps): JSX.Element;
