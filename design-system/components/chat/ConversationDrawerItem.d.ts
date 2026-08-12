export interface ConversationDrawerModel {
  /** Provider id, e.g. "anthropic". One entry per model — a provider running two models appears twice. */
  provider: string;
}

export interface ConversationDrawerItemProps {
  title: string;
  /** One entry per model taking part; renders one provider mark each, duplicates included. */
  models?: ConversationDrawerModel[];
  messageCount?: number;
  /** Pre-formatted date, no time of day (e.g. "09.08.26"). */
  updatedAt?: string;
  /** Root session title. Present on forked sessions; renders the tappable root tag on its own row. */
  forkOf?: string;
  active?: boolean;
  pinned?: boolean;
  isPrivate?: boolean;
  onSelect?: () => void;
  onOpenActions?: () => void;
  /** Jump to the root session; fired by the fork tag (44pt touch target). */
  onOpenRoot?: () => void;
  assetBase?: string;
}

export declare function ConversationDrawerItem(props: ConversationDrawerItemProps): JSX.Element;
