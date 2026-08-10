export interface ResponseModeOption {
  id: string;
  /** Provider id for the brand mark. Ignored when local is true. */
  provider?: string;
  providerLabel?: string;
  modelLabel: string;
  effortLabel?: string;
  /** An on-device route: shows the cpu glyph instead of a provider mark. */
  local?: boolean;
  /** false dims the card and blocks selection. */
  ready?: boolean;
}

export interface ResponseModeToggleProps {
  modes: ResponseModeOption[];
  selected: string;
  onSelect?: (id: string) => void;
  /** Stack the cards instead of laying them side by side. */
  compact?: boolean;
  /** Show provider family and effort alongside the model name. */
  detailed?: boolean;
  assetBase?: string;
}

export declare function ResponseModeToggle(props: ResponseModeToggleProps): JSX.Element;
