import { ConversationMeta, ToastTone } from "../../types";

export type ConversationDrawerPresentation = "modal" | "sidebar";

export interface ConversationDrawerProps {
  visible: boolean;
  /** Inline sidebars stay mounted independently of the modal visibility flag. */
  presentation?: ConversationDrawerPresentation;
  sidebarWidth?: number;
  /** Monotonic one-shot request used by Settings to reveal Archived again. */
  archivedRevealRequestId?: number | null;
  /** Acknowledges a consumed reveal so it cannot leak into a later mount. */
  onArchivedRevealHandled?: (requestId: number) => void;
  conversations: ConversationMeta[];
  activeId: string | null;
  onSearchConversations: (query: string) => Promise<ConversationMeta[]>;
  onSelect: (id: string) => Promise<void> | void;
  onCanUseSessionDeviceAuth: (id: string) => Promise<boolean>;
  onLockSession: (id: string, password: string) => Promise<boolean>;
  onUnlockSession: (
    id: string,
    method: "device" | "password",
    password?: string,
  ) => Promise<boolean>;
  onRemoveSessionLock: (
    id: string,
    method: "device" | "password",
    password?: string,
  ) => Promise<boolean>;
  onCopyThread: (id: string) => void;
  onShareThread: (id: string) => void;
  onRenameThread: (id: string, title: string) => void;
  onTogglePinned: (id: string) => void;
  onToggleArchived: (id: string) => void;
  onAutoName: (id: string) => void;
  onNewSession: () => Promise<void> | void;
  onDelete: (id: string) => void;
  onClose: () => void;
  /** Global app Settings action shown only by the persistent sidebar header. */
  onOpenSettings?: () => void;
  onDismiss?: () => void;
  /** Feedback for actions begun in the drawer (auto-naming) surfaces here —
      the workspace toast layer sits under this modal and cannot. */
  toast?: { message: string; onRetry?: () => void; tone?: ToastTone } | null;
  onDismissToast?: () => void;
}
