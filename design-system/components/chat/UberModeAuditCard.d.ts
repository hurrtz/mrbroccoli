/** Disclosure under a Model Council reply: the audit of who said what. */
export interface UberModeAuditCardProps {
  /** Default "Model Council". */
  title?: string;
  /** The collapsed line, pre-formatted: "3 rounds · 11 calls · 1 failed". */
  summary?: string;
  /** The verdict sentence: "Convergence reached after round 2." */
  outcome?: string;
  /** Pre-formatted audit lines: calls, reviews, synthesis history. */
  details?: string[];
  /** Default "Routes". */
  routesLabel?: string;
  /** One line per participant: "#1 · Anthropic · Claude Sonnet 4.5". */
  routes?: string[];
  defaultExpanded?: boolean;
  style?: React.CSSProperties;
}

export function UberModeAuditCard(props: UberModeAuditCardProps): JSX.Element;
