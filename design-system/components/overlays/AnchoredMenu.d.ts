export interface AnchoredMenuItem {
  /** Semantic PhosphorIcon name; renders trailing, after the label. */
  icon: string;
  label: string;
  danger?: boolean;
  onPress?: () => void;
}

export interface AnchoredMenuProps {
  visible?: boolean;
  /** Semantic clusters, ordered by frequency; a 6px band separates groups, hairlines separate rows within one. Danger last, alone. */
  groups: AnchoredMenuItem[][];
  /** Fired by the click-away layer AND after every item press. */
  onClose?: () => void;
  /** Panel placement (top/right/bottom/left) — the caller anchors it to the pressed control. */
  style?: React.CSSProperties;
  /** Default 252. */
  width?: number;
  /** Absolute positioning for framed previews. */
  inline?: boolean;
}

export declare function AnchoredMenu(props: AnchoredMenuProps): JSX.Element | null;
