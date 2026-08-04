import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { ChatBubbleContent } from "./chatBubble/ChatBubbleContent";
import { styles } from "./chatBubble/styles";
import type { ChatBubbleProps } from "./chatBubble/types";

function MessageRowSurface({
  messageId,
  isUser,
  selectable,
  children,
}: {
  messageId: string;
  isUser: boolean;
  selectable: boolean;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View
      testID={`chat-message-row-${messageId}`}
      style={[
        styles.messageRow,
        isUser ? styles.messageRowUser : styles.messageRowAssistant,
        selectable ? styles.messageRowSelectable : null,
        isUser
          ? {
              backgroundColor: colors.accentSoft,
              borderColor: colors.borderStrong,
              borderRightColor: colors.accent,
            }
          : {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderLeftColor: colors.borderStrong,
            },
      ]}
    >
      {children}
    </View>
  );
}

export const ChatBubble = React.memo(function ChatBubble({
  message,
  branchChildren,
  branchOrigin,
  onCopy,
  onEdit,
  onBranch,
  onOpenBranches,
  onOpenBranchSource,
  onShare,
  onRepeat,
  onRetry,
  onOpenSpeakingSettings,
  repeatState = "idle",
  selectable = false,
  showUsageStats = false,
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const content = (
    <MessageRowSurface
      messageId={message.id}
      isUser={isUser}
      selectable={selectable}
    >
      <ChatBubbleContent
        message={message}
        branchChildren={branchChildren}
        branchOrigin={branchOrigin}
        onCopy={onCopy}
        onEdit={onEdit}
        onBranch={onBranch}
        onOpenBranches={onOpenBranches}
        onOpenBranchSource={onOpenBranchSource}
        onShare={onShare}
        onRepeat={onRepeat}
        onRetry={onRetry}
        onOpenSpeakingSettings={onOpenSpeakingSettings}
        repeatState={repeatState}
        selectable={selectable}
        showUsageStats={showUsageStats}
      />
    </MessageRowSurface>
  );

  return (
    <View
      style={[
        styles.wrapper,
        isUser ? styles.wrapperUser : styles.wrapperAssistant,
      ]}
    >
      {onCopy && !selectable ? (
        <TouchableOpacity
          style={styles.messageRowTouchTarget}
          activeOpacity={0.92}
          onLongPress={() => onCopy(message)}
          delayLongPress={220}
          accessible={false}
        >
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
});
