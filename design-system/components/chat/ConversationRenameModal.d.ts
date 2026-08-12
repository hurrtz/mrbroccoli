export interface ConversationRenameModalProps {
  visible: boolean;
  /** Current title, shown muted above the field. */
  title?: string;
  /** Field value (controlled). */
  value: string;
  onChange: (value: string) => void;
  /** Disabled while the field is empty or whitespace. */
  onSubmit: () => void;
  onClose: () => void;
  inline?: boolean;
}

export declare function ConversationRenameModal(props: ConversationRenameModalProps): JSX.Element;
