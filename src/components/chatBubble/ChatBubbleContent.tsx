import React from "react";

import { MessageActions } from "./MessageActions";
import { MessageHeader } from "./MessageHeader";
import { MessageText } from "./MessageText";
import { MessageImageAttachments } from "../MessageImageAttachments";
import { PipelineNotices } from "./PipelineNotices";
import { ReplyFailureCard } from "./ReplyFailureCard";
import { TurnReceiptCard } from "./TurnReceiptCard";
import { UberModeAuditCard } from "./UberModeAuditCard";
import { UsageCard } from "./UsageCard";
import { WebSearchReferences } from "./WebSearchReferences";
import { ConversationKnowledgeReferences } from "./ConversationKnowledgeReferences";
import { MessageBranchIndicator } from "./MessageBranchIndicator";
import type { ChatBubbleProps } from "./types";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";

export function ChatBubbleContent({
  message,
  branchChildren,
  branchOrigin,
  onCopy,
  onEdit,
  onBranch,
  onOpenBranches,
  onOpenBranchSource,
  onSaveInsight,
  onShare,
  onRepeat,
  onRetry,
  onOpenSpeakingSettings,
  repeatState = "idle",
  selectable = false,
  showUsageStats = false,
}: ChatBubbleProps) {
  const { t } = useLocalization();
  const { colors } = useTheme();

  return (
    <>
      <MessageHeader message={message} />
      <MessageImageAttachments
        attachments={message.attachments ?? []}
        colors={colors}
        t={t}
      />
      <MessageText message={message} selectable={selectable} />
      <MessageBranchIndicator
        messageId={message.id}
        branchChildren={branchChildren}
        branchOrigin={branchOrigin}
        onOpenBranches={onOpenBranches}
        onOpenBranchSource={onOpenBranchSource}
      />
      <ReplyFailureCard message={message} onRetry={onRetry} />
      <PipelineNotices
        message={message}
        onRepeat={onRepeat}
        onOpenSpeakingSettings={onOpenSpeakingSettings}
      />
      <TurnReceiptCard message={message} />
      <UberModeAuditCard message={message} />
      <ConversationKnowledgeReferences message={message} />
      <WebSearchReferences message={message} />
      <UsageCard message={message} showUsageStats={showUsageStats} />
      {selectable &&
      (message.role === "assistant" || onEdit || onBranch || onSaveInsight) ? (
        <MessageActions
          message={message}
          onCopy={onCopy}
          onEdit={message.role === "user" ? onEdit : undefined}
          onBranch={onBranch}
          onSaveInsight={onSaveInsight}
          onShare={onShare}
          onRepeat={onRepeat}
          repeatState={repeatState}
        />
      ) : null}
    </>
  );
}
