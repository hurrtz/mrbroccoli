export interface WebSearchSource {
  /** Display title — the app derives it from the page title or the hostname. */
  title: string;
  url: string;
}

/** Disclosure under a searching turn: query, summary, source chips. */
export interface WebSearchReferencesProps {
  /** Default "Web search". */
  title?: string;
  /** The collapsed count, pre-formatted: "4 sources". */
  countLabel?: string;
  query?: string;
  summary?: string;
  sources?: WebSearchSource[];
  onOpenSource?: (source: WebSearchSource) => void;
  defaultExpanded?: boolean;
  style?: React.CSSProperties;
}

export function WebSearchReferences(props: WebSearchReferencesProps): JSX.Element;
