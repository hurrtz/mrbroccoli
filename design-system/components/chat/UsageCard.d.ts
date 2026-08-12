/** One quiet mono line of token usage under the reply. */
export interface UsageCardProps {
  /** Pre-formatted by the app: "~1.2k prompt · 480 completion · ~1.7k total". Nothing renders without it. */
  text?: string;
  style?: React.CSSProperties;
}

export function UsageCard(props: UsageCardProps): JSX.Element | null;
