import { useCallback } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";

interface MainScreenReplyReplayParams {
  activeReplayMessageId: string | null;
  handleRepeatLastReply: (
    textOverride?: string,
    messageId?: string,
  ) => Promise<void>;
  stopReplay: () => Promise<void>;
}

export function useMainScreenReplyReplay({
  activeReplayMessageId,
  handleRepeatLastReply,
  stopReplay,
}: MainScreenReplyReplayParams) {
  return useCallback(
    async (message: { id: string; content: string }) => {
      if (activeReplayMessageId === message.id) {
        recordDebugLogEvent({
          event: "reply-repeat-stop-requested",
          payload: {
            messageId: message.id,
          },
        });
        await stopReplay();
        return;
      }

      recordDebugLogEvent({
        event: "reply-repeat-requested",
        payload: {
          contentLength: message.content.length,
          messageId: message.id,
        },
      });
      await handleRepeatLastReply(message.content, message.id);
    },
    [activeReplayMessageId, handleRepeatLastReply, stopReplay],
  );
}
