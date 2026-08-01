import { useCallback, useRef } from "react";

import {
  createDebugTurnId,
  recordDebugLogEvent,
} from "../../services/debugLogCapture";
import type { Message, MessageImageAttachment } from "../../types";
import type { VoiceCaptureRequest } from "../../hooks/useVoicePipeline";
import type { ShowToastFn } from "./shared";

interface UseTextTurnSubmitControllerParams {
  handleVoiceCaptureDone: (params: VoiceCaptureRequest) => Promise<void>;
  isBusy: boolean;
  promptSubmissionBlockMessage?: string | null;
  showToast?: ShowToastFn;
  pendingAttachments?: MessageImageAttachment[];
}

export function useTextTurnSubmitController({
  handleVoiceCaptureDone,
  isBusy,
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

  return {
    handleRetryMessage,
    handleSubmitTextMessage,
  };
}
