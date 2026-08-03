import type { Message } from "../../types";

export type RepeatState = "idle" | "preparing" | "speaking";

export interface ChatBubbleProps {
  message: Message;
  onCopy?: (message: Message) => Promise<boolean>;
  onEdit?: (message: Message) => void;
  onSaveInsight?: (message: Message) => void;
  onShare?: (message: Message) => void;
  onRepeat?: (message: Message) => void;
  onRetry?: (message: Message) => void;
  onOpenSpeakingSettings?: () => void;
  repeatState?: RepeatState;
  selectable?: boolean;
  showUsageStats?: boolean;
}
