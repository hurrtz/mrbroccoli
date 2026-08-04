import { useCallback, useRef } from "react";

import {
  createDebugTurnId,
  recordDebugLogEvent,
} from "../../services/debugLogCapture";
import type {
  ConversationFork,
  Message,
  MessageImageAttachment,
} from "../../types";
import type { VoiceCaptureRequest } from "../../hooks/useVoicePipeline";
import type { ShowToastFn } from "./shared";

interface UseTextTurnSubmitControllerParams {
  handleVoiceCaptureDone: (params: VoiceCaptureRequest) => Promise<void>;
  isBusy: boolean;
  forkConversationAtMessage?: (
    messageId: string,
  ) => Promise<ConversationFork | null>;
  forkFailureMessage?: string;
  promptSubmissionBlockMessage?: string | null;
  showToast?: ShowToastFn;
  pendingAttachments?: MessageImageAttachment[];
}

export function useTextTurnSubmitController({
  handleVoiceCaptureDone,
  isBusy,
  forkConversationAtMessage,
  forkFailureMessage,
  promptSubmissionBlockMessage,
  showToast,
  pendingAttachments = [],
}: UseTextTurnSubmitControllerParams) {
  const submissionInFlightRef = useRef(false);

  const runTextTurn = useCallback(
    (params: {
      existingUserMessageId?: string;
      text: string;
      source: "new" | "retry";
    }) => {
      const trimmed = params.text.trim();

      if (!trimmed || isBusy || submissionInFlightRef.current) {
        return;
      }

      if (promptSubmissionBlockMessage) {
        showToast?.(promptSubmissionBlockMessage, undefined, "danger");
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

      void handleVoiceCaptureDone({
        ...(params.source !== "retry" && pendingAttachments.length > 0
          ? { attachments: pendingAttachments }
          : {}),
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
      showToast,
      pendingAttachments,
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
        source: "retry",
        text: message.content,
      });
    },
    [runTextTurn],
  );

  const handleForkMessage = useCallback(
    (message: Message) => {
      if (
        message.role !== "user" ||
        !message.editedAt ||
        !forkConversationAtMessage ||
        isBusy ||
        submissionInFlightRef.current
      ) {
        return;
      }

      if (promptSubmissionBlockMessage) {
        showToast?.(promptSubmissionBlockMessage, undefined, "danger");
        return;
      }

      submissionInFlightRef.current = true;
      const turnId = createDebugTurnId();
      recordDebugLogEvent({
        event: "text-message-fork-requested",
        payload: {
          messageId: message.id,
          textLength: message.content.trim().length,
          turnId,
        },
      });

      void forkConversationAtMessage(message.id)
        .then(async (fork) => {
          if (!fork) {
            throw new Error("The edited message could not be forked.");
          }
          recordDebugLogEvent({
            event: "text-message-fork-created",
            payload: {
              conversationId: fork.conversation.id,
              contextMessageCount: fork.contextMessages.length,
              sourceMessageId: message.id,
              turnId,
            },
          });
          await handleVoiceCaptureDone({
            ...(fork.promptMessage.attachments?.length
              ? { attachments: fork.promptMessage.attachments }
              : {}),
            conversationOverride: fork.conversation,
            existingUserMessageId: fork.promptMessage.id,
            messagesOverride: fork.contextMessages,
            transcriptionOverride: fork.promptMessage.content,
            turnId,
          });
        })
        .catch((error) => {
          recordDebugLogEvent({
            event: "text-message-fork-failed",
            level: "warn",
            payload: { error, messageId: message.id, turnId },
          });
          if (forkFailureMessage) {
            showToast?.(forkFailureMessage, undefined, "danger");
          }
        })
        .finally(() => {
          submissionInFlightRef.current = false;
        });
    },
    [
      forkConversationAtMessage,
      forkFailureMessage,
      handleVoiceCaptureDone,
      isBusy,
      promptSubmissionBlockMessage,
      showToast,
    ],
  );

  return {
    handleForkMessage,
    handleRetryMessage,
    handleSubmitTextMessage,
  };
}
