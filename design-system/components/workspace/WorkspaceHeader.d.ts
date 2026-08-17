/**
 * The workspace header: one raised block, two 44pt rows, hairline between —
 * who answers next, and what this conversation is set to. Sits 14pt below the
 * top bar. Portrait only; landscape keeps `RouteByline` and the icon-only
 * `ConversationSettingsSummary`, which have the room the narrow column needs.
 */
export interface WorkspaceHeaderProps {
  /** Provider id for the mark, e.g. "openai". Ignored when `local`. */
  provider?: string;
  providerLabel?: string;
  /** Display name of the answering model. Truncates at one line. */
  modelName: string;
  /** The effort word, named not plotted — "High", "Normal". Omit when the model has no effort control. */
  effort?: string;
  /** On-device routes take the cpu glyph, never a provider mark. */
  local?: boolean;
  /** False for a single configured model: the caret and the press target both go. */
  switchable?: boolean;
  assetBase?: string;
  /** Opens the route picker. */
  onSwitchRoute?: () => void;
  /** The conversation's settings as one line of "Label: value" pairs, pre-composed and localised. Truncates at the end. */
  summary?: string;
  /** Opens the conversation settings sheet. */
  onOpenSettings?: () => void;
  /** A turn is in flight: the block keeps its shape, fill and hairline exactly and drops to disabled strength — neither row is pressable. */
  running?: boolean;
  /** This running turn is a council: both rows centre and strip to the report — the answering model above, "2 of 4 models done · Round 2 of 3" below (plus a "1 failed" clause only when one has). No effort word, no caret, no settings control — and no dimming, since nothing is left to disable and this is the only report of a long wait. */
  council?: boolean;
  style?: React.CSSProperties;
}

export function WorkspaceHeader(props: WorkspaceHeaderProps): JSX.Element;
