export interface ConversationDrawerItemProps {
  title: string;
  /** Provider ids used in this conversation; one row each, paired with models. */
  providers?: string[];
  models?: string[];
  messageCount?: number;
  /** Pre-formatted date and time. */
  updatedAt?: string;
  active?: boolean;
  pinned?: boolean;
  isPrivate?: boolean;
  hasBranches?: boolean;
  expanded?: boolean;
  /** Branch depth, indenting 14pt per level and capped at 4. */
  depth?: number;
  onSelect?: () => void;
  onOpenActions?: () => void;
  onToggleBranches?: () => void;
  assetBase?: string;
}

export declare function ConversationDrawerItem(props: ConversationDrawerItemProps): JSX.Element;
