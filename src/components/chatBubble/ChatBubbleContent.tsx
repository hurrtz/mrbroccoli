import React from "react";

import { MessageActions } from "./MessageActions";
import { MessageHeader } from "./MessageHeader";
import { MessageText } from "./MessageText";
import { PipelineNotices } from "./PipelineNotices";
import { ReplyFailureCard } from "./ReplyFailureCard";
import { UsageCard } from "./UsageCard";
import { WebSearchReferences } from "./WebSearchReferences";
import type { ChatBubbleProps } from "./types";

export function ChatBubbleContent({
  message,
  onCopy,
  onShare,
  onRepeat,
  onRetry,
  onOpenSpeakingSettings,
  repeatState = "idle",
  selectable = false,
  showUsageStats = false,
}: ChatBubbleProps) {
  return (
    <>
      <MessageHeader message={message} />
      <MessageText message={message} selectable={selectable} />
      <ReplyFailureCard message={message} onRetry={onRetry} />
      <PipelineNotices
        message={message}
        onRepeat={onRepeat}
        onOpenSpeakingSettings={onOpenSpeakingSettings}
      />
      <WebSearchReferences message={message} />
      <UsageCard message={message} showUsageStats={showUsageStats} />
      {selectable && message.role === "assistant" ? (
        <MessageActions
          message={message}
          onCopy={onCopy}
          onShare={onShare}
          onRepeat={onRepeat}
          repeatState={repeatState}
        />
      ) : null}
    </>
  );
}
