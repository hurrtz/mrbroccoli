/** Branch chips on a message: where it came from and what grew out of it. */
export interface MessageBranchIndicatorProps {
  /** "Context kept from 'Weekend plans'" — or "Branch source unavailable". */
  originLabel?: string;
  /** Omit when the source conversation is gone; the chip renders inert in surface-alt. */
  onOpenSource?: () => void;
  /** "2 branches", pre-pluralised by the app. */
  branchesLabel?: string;
  onOpenBranches?: () => void;
  style?: React.CSSProperties;
}

export function MessageBranchIndicator(props: MessageBranchIndicatorProps): JSX.Element | null;
