export type ConversationIntegrityState = "loading" | "clean" | "findings" | "failed";

export interface ConversationIntegrityModalProps {
  /** null renders nothing. */
  conversation: { title: string } | null;
  state?: ConversationIntegrityState;
  /** Messages that differ from their recorded hash. */
  findingsCount?: number;
  /** Subset repairable automatically; > 0 shows the Repair action. */
  repairableCount?: number;
  /** A repair snapshot exists; shows Undo repair. */
  canUndo?: boolean;
  /** Repair in flight: actions disable, closing blocks. */
  busy?: boolean;
  onRepair?: () => void;
  onUndo?: () => void;
  onExportOriginals?: () => void;
  onClose: () => void;
  inline?: boolean;
}

export declare function ConversationIntegrityModal(props: ConversationIntegrityModalProps): JSX.Element;
