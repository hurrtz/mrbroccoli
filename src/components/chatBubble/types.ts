import type {
  ConversationBranchOrigin,
  ConversationMeta,
  Message,
} from "../../types";

export type RepeatState = "idle" | "preparing" | "speaking";

export interface ChatBubbleProps {
  message: Message;
  branchChildren?: ConversationMeta[];
  branchOrigin?: ConversationBranchOrigin & {
    parentTitle?: string;
    parentAvailable: boolean;
  };
  onCopy?: (message: Message) => Promise<boolean>;
  onEdit?: (message: Message) => void;
  onBranch?: (message: Message) => Promise<boolean> | void;
  onOpenBranches?: (branches: ConversationMeta[]) => void;
  onOpenBranchSource?: (conversationId: string, messageId: string) => void;
  onSaveInsight?: (message: Message) => void;
  onShare?: (message: Message) => void;
  onRepeat?: (message: Message) => void;
  onRetry?: (message: Message) => void;
  onOpenSpeakingSettings?: () => void;
  repeatState?: RepeatState;
  selectable?: boolean;
  showUsageStats?: boolean;
}
