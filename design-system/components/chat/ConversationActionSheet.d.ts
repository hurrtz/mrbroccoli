export interface ConversationActionSheetConversation {
  id: string;
  title: string;
  messageCount?: number;
  pinned?: boolean;
  isPrivate?: boolean;
  archived?: boolean;
}

export interface ConversationActionSheetProps {
  /** null renders nothing. */
  conversation: ConversationActionSheetConversation | null;
  onClose: () => void;
  /** id-callback rows close the sheet themselves after firing. */
  onTogglePinned?: (id: string) => void;
  onTogglePrivate?: (id: string) => void;
  /** Opens the rename modal; the sheet stays open underneath. */
  onRename?: (conversation: ConversationActionSheetConversation) => void;
  /** Generate a title from the conversation's content — moved here from the conversation settings sheet. */
  onAutoName?: (id: string) => void;
  /** Archive/unarchive — a system addition over the upstream sheet. */
  onToggleArchived?: (id: string) => void;
  /** Opens the integrity modal; the sheet stays open underneath. */
  onReviewIntegrity?: (conversation: ConversationActionSheetConversation) => void;
  onManageMemory?: (id: string) => void;
  onShare?: (id: string) => void;
  onCopy?: (id: string) => void;
  onDelete?: (id: string) => void;
  /** Absolute positioning for framed previews. */
  inline?: boolean;
}

export declare function ConversationActionSheet(props: ConversationActionSheetProps): JSX.Element;
