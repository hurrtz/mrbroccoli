/** Dialog showing the conversation's rolling summary, editable in place. */
export interface ConversationMemoryModalProps {
  visible: boolean;
  onClose?: () => void;
  /** Default "What this conversation remembers". */
  title?: string;
  /** The conversation's name, under the title. */
  conversationTitle?: string;
  /** One sentence on what the memory is and how it is used. */
  description?: string;
  /** "14 turns summarized" — the label over the summary while one exists. */
  countLabel?: string;
  /** Shown instead of the editor while nothing is summarized. Default "Nothing summarized yet." */
  emptyText?: string;
  summary?: string;
  onCopy?: () => void;
  /** Receives the edited draft. Enabled only when the draft differs and is non-empty. */
  onSave?: (summary: string) => void;
  /** "Forget" — danger ink, but a plain action: forgetting is reversible by talking. */
  onClear?: () => void;
  copyLabel?: string;
  saveLabel?: string;
  clearLabel?: string;
  /** Position over the nearest positioned ancestor (device frames, kits). */
  inline?: boolean;
}

export function ConversationMemoryModal(props: ConversationMemoryModalProps): JSX.Element | null;
