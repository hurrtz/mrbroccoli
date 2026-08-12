/** One configured route in the picker. */
export interface RoutePickerRoute {
  id: string;
  /** Provider id for the brand mark, e.g. "anthropic". Ignored when local. */
  provider?: string;
  providerLabel: string;
  modelLabel: string;
  /** e.g. "High effort". Omit for models with no effort control. */
  effortLabel?: string;
  /** On-device route: takes the cpu glyph, never a provider mark. */
  local?: boolean;
}

/** The bottom sheet the route byline opens. List routes cheapest first. */
export interface RoutePickerProps {
  visible: boolean;
  onClose?: () => void;
  /** Cheapest first — escalation is a list. */
  routes: RoutePickerRoute[];
  /** id of the route answering the next turn. */
  selected?: string;
  /** Picking also closes the sheet. */
  onSelect?: (id: string) => void;
  /** Default "Answer the next turn with". */
  title?: string;
  /** Base path for provider SVGs. */
  assetBase?: string;
}

export function RoutePicker(props: RoutePickerProps): JSX.Element;
