import { useCallback, useRef } from "react";

import {
  createDebugTurnId,
  recordDebugLogEvent,
} from "../../services/debugLogCapture";
import type {
  ConversationBranchResult,
  Message,
  MessageImageAttachment,
} from "../../types";
import type { VoiceCaptureRequest } from "../../hooks/useVoicePipeline";
import type { ShowToastFn } from "./shared";

interface UseTextTurnSubmitControllerParams {
  handleVoiceCaptureDone: (params: VoiceCaptureRequest) => Promise<void>;
  isBusy: boolean;
  branchConversationAtMessage?: (
    messageId: string,
  ) => Promise<ConversationBranchResult | null>;
  branchCreatedMessage?: string;
  branchFailureMessage?: string;
  promptSubmissionBlockMessage?: string | null;
  retrySubmissionBlockMessage?: string | null;
  showToast?: ShowToastFn;
  pendingAttachments?: MessageImageAttachment[];
  onTextTurnAccepted?: (text: string) => void;
}

export function useTextTurnSubmitController({
  handleVoiceCaptureDone,
  isBusy,
  branchConversationAtMessage,
  branchCreatedMessage,
  branchFailureMessage,
  promptSubmissionBlockMessage,
  retrySubmissionBlockMessage = promptSubmissionBlockMessage,
  showToast,
  pendingAttachments = [],
  onTextTurnAccepted,
}: UseTextTurnSubmitControllerParams) {
  const submissionInFlightRef = useRef(false);

  const runTextTurn = useCallback(
    (params: {
      existingUserMessageId?: string;
      attachments?: MessageImageAttachment[];
      text: string;
      source: "new" | "retry";
    }) => {
      const trimmed = params.text.trim();

      if (!trimmed || isBusy || submissionInFlightRef.current) {
        return;
      }

      const blockedMessage =
        params.source === "retry"
          ? retrySubmissionBlockMessage
          : promptSubmissionBlockMessage;
      if (blockedMessage) {
        showToast?.(blockedMessage, undefined, "danger");
        return;
      }

      submissionInFlightRef.current = true;
      const turnId = createDebugTurnId();
      recordDebugLogEvent({
        event:
          params.source === "retry"
            ? "text-message-retry-requested"
            : "text-message-submit-requested",
        payload: {
          messageId: params.existingUserMessageId ?? null,
          textLength: trimmed.length,
          turnId,
        },
      });

      const attachments =
        params.source === "retry" ? params.attachments : pendingAttachments;
      void handleVoiceCaptureDone({
        ...(params.source === "new" && onTextTurnAccepted
          ? { onTurnAccepted: () => onTextTurnAccepted(trimmed) }
          : {}),
        ...(attachments?.length ? { attachments } : {}),
        existingUserMessageId: params.existingUserMessageId,
        transcriptionOverride: trimmed,
        turnId,
      }).finally(() => {
        submissionInFlightRef.current = false;
      });
    },
    [
      handleVoiceCaptureDone,
      isBusy,
      promptSubmissionBlockMessage,
      retrySubmissionBlockMessage,
      showToast,
      pendingAttachments,
      onTextTurnAccepted,
    ],
  );

  const handleSubmitTextMessage = useCallback(
    (text: string) => {
      runTextTurn({ source: "new", text });
    },
    [runTextTurn],
  );

  const handleRetryMessage = useCallback(
    (message: Message) => {
      runTextTurn({
        existingUserMessageId: message.id,
        attachments: message.attachments,
        source: "retry",
        text: message.content,
      });
    },
    [runTextTurn],
  );

  const handleBranchMessage = useCallback(
    async (message: Message): Promise<boolean> => {
      if (
        !branchConversationAtMessage ||
        isBusy ||
        submissionInFlightRef.current
      ) {
        return false;
      }

      if (message.role === "user" && retrySubmissionBlockMessage) {
        showToast?.(retrySubmissionBlockMessage, undefined, "danger");
        return false;
      }

      submissionInFlightRef.current = true;
      const turnId = createDebugTurnId();
      recordDebugLogEvent({
        event: "conversation-branch-requested",
        payload: {
          messageId: message.id,
          messageRole: message.role,
          textLength: message.content.trim().length,
          turnId,
        },
      });

      try {
        const branch = await branchConversationAtMessage(message.id);
        if (!branch) {
          throw new Error("The conversation could not be branched.");
        }
        recordDebugLogEvent({
          event: "conversation-branch-created",
          payload: {
            conversationId: branch.conversation.id,
            contextMessageCount: branch.contextMessages.length,
            kind: branch.conversation.branch?.kind ?? null,
            sourceMessageId: message.id,
            turnId,
          },
        });

        if (branch.checkpointMessage.role === "assistant") {
          if (branchCreatedMessage) {
            showToast?.(branchCreatedMessage, undefined, "success");
          }
          return true;
        }

        await handleVoiceCaptureDone({
          ...(branch.checkpointMessage.attachments?.length
            ? { attachments: branch.checkpointMessage.attachments }
            : {}),
          conversationOverride: branch.conversation,
          existingUserMessageId: branch.checkpointMessage.id,
          messagesOverride: branch.contextMessages,
          transcriptionOverride: branch.checkpointMessage.content,
          turnId,
        });
        return true;
      } catch (error) {
        recordDebugLogEvent({
          event: "conversation-branch-failed",
          level: "warn",
          payload: { error, messageId: message.id, turnId },
        });
        if (branchFailureMessage) {
          showToast?.(branchFailureMessage, undefined, "danger");
        }
        return false;
      } finally {
        submissionInFlightRef.current = false;
      }
    },
    [
      branchConversationAtMessage,
      branchCreatedMessage,
      branchFailureMessage,
      handleVoiceCaptureDone,
      isBusy,
      retrySubmissionBlockMessage,
      showToast,
    ],
  );

  return {
    handleBranchMessage,
    handleRetryMessage,
    handleSubmitTextMessage,
  };
}
