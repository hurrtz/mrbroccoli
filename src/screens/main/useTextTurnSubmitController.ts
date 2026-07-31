import { useCallback, useRef } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import type { Message } from "../../types";
import type { ShowToastFn } from "./shared";

interface UseTextTurnSubmitControllerParams {
  handleVoiceCaptureDone: (params: {
    existingUserMessageId?: string;
    transcriptionOverride?: string;
  }) => Promise<void>;
  isBusy: boolean;
  promptSubmissionBlockMessage?: string | null;
  showToast?: ShowToastFn;
}

export function useTextTurnSubmitController({
  handleVoiceCaptureDone,
  isBusy,
  promptSubmissionBlockMessage,
  showToast,
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
      recordDebugLogEvent({
        event:
          params.source === "retry"
            ? "text-message-retry-requested"
            : "text-message-submit-requested",
        payload: {
          messageId: params.existingUserMessageId ?? null,
          textLength: trimmed.length,
        },
      });

      void handleVoiceCaptureDone({
        existingUserMessageId: params.existingUserMessageId,
        transcriptionOverride: trimmed,
      }).finally(() => {
        submissionInFlightRef.current = false;
      });
    },
    [
      handleVoiceCaptureDone,
      isBusy,
      promptSubmissionBlockMessage,
      showToast,
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
