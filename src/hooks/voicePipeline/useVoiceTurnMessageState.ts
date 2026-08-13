import { useCallback, useRef } from "react";

import type {
  MessageMetadata,
  MessagePipelineNotice,
  MessageTurnReceipt,
} from "../../types";
import type { UseVoicePipelineParams } from "./types";

type UpdateMessage = UseVoicePipelineParams["updateMessage"];

export function getUnexpectedIssueDetail(
  error: unknown,
  fallbackMessage: string,
): string | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const detail = error.message.trim();
  return detail && detail !== fallbackMessage ? detail : undefined;
}

export function formatNoticeToast(notice: MessagePipelineNotice) {
  return notice.detail ? `${notice.message} ${notice.detail}` : notice.message;
}

export function appendNoticeMetadata(
  metadata: MessageMetadata | undefined,
  notice: MessagePipelineNotice,
): MessageMetadata {
  const notices = metadata?.notices ?? [];
  const alreadyPresent = notices.some(
    (entry) =>
      entry.stage === notice.stage &&
      entry.message === notice.message &&
      entry.detail === notice.detail,
  );

  return {
    ...metadata,
    notices: alreadyPresent ? notices : [...notices, notice],
  };
}

export function useVoiceTurnMessageState(updateMessage: UpdateMessage) {
  const ttsFallbackNoticeRecordedRef = useRef(false);
  const lastUserMessageIdRef = useRef<string | null>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);
  const assistantHasTurnReceiptRef = useRef(false);
  const pendingAssistantNoticesRef = useRef<MessagePipelineNotice[]>([]);
  const pendingTurnReceiptUpdatesRef = useRef<
    ((receipt: MessageTurnReceipt) => MessageTurnReceipt)[]
  >([]);

  const clearReplyFailure = useCallback(
    (messageId: string) => {
      updateMessage(messageId, (message) => {
        if (!message.metadata?.replyFailure) {
          return message;
        }

        const { replyFailure: _replyFailure, ...remainingMetadata } =
          message.metadata;

        return {
          ...message,
          metadata:
            Object.keys(remainingMetadata).length > 0
              ? remainingMetadata
              : undefined,
        };
      });
    },
    [updateMessage],
  );

  const markReplyFailure = useCallback(
    (messageId: string, error: Error) => {
      updateMessage(messageId, (message) => ({
        ...message,
        metadata: {
          ...message.metadata,
          replyFailure: {
            message: error.message,
          },
        },
      }));
    },
    [updateMessage],
  );

  const resetTurnMessageState = useCallback(
    (existingUserMessageId?: string) => {
      ttsFallbackNoticeRecordedRef.current = false;
      lastUserMessageIdRef.current = existingUserMessageId ?? null;
      lastAssistantMessageIdRef.current = null;
      assistantHasTurnReceiptRef.current = false;
      pendingAssistantNoticesRef.current = [];
      pendingTurnReceiptUpdatesRef.current = [];

      if (existingUserMessageId) {
        clearReplyFailure(existingUserMessageId);
      }
    },
    [clearReplyFailure],
  );

  const queueAssistantNotice = useCallback((notice: MessagePipelineNotice) => {
    pendingAssistantNoticesRef.current = [
      ...pendingAssistantNoticesRef.current,
      notice,
    ];
  }, []);

  const consumeAssistantMetadata = useCallback((metadata?: MessageMetadata) => {
    const pendingNotices = pendingAssistantNoticesRef.current;
    const pendingReceiptUpdates = pendingTurnReceiptUpdatesRef.current;
    pendingAssistantNoticesRef.current = [];
    pendingTurnReceiptUpdatesRef.current = [];

    const metadataWithNotices = pendingNotices.reduce(
      (currentMetadata, notice) =>
        appendNoticeMetadata(currentMetadata, notice),
      metadata,
    );

    if (!metadataWithNotices?.turnReceipt) {
      assistantHasTurnReceiptRef.current = false;
      return metadataWithNotices;
    }

    assistantHasTurnReceiptRef.current = true;
    return {
      ...metadataWithNotices,
      turnReceipt: pendingReceiptUpdates.reduce(
        (receipt, update) => update(receipt),
        metadataWithNotices.turnReceipt,
      ),
    };
  }, []);

  const updateAssistantTurnReceipt = useCallback(
    (update: (receipt: MessageTurnReceipt) => MessageTurnReceipt) => {
      const assistantMessageId = lastAssistantMessageIdRef.current;
      if (!assistantMessageId) {
        pendingTurnReceiptUpdatesRef.current = [
          ...pendingTurnReceiptUpdatesRef.current,
          update,
        ];
        return;
      }
      if (!assistantHasTurnReceiptRef.current) {
        return;
      }

      updateMessage(assistantMessageId, (message) => {
        const receipt = message.metadata?.turnReceipt;
        if (!receipt) {
          return message;
        }

        return {
          ...message,
          metadata: {
            ...message.metadata,
            turnReceipt: update(receipt),
          },
        };
      });
    },
    [updateMessage],
  );

  const recordAssistantNotice = useCallback(
    (notice: MessagePipelineNotice) => {
      const assistantMessageId = lastAssistantMessageIdRef.current;
      if (!assistantMessageId) {
        queueAssistantNotice(notice);
        return;
      }

      updateMessage(assistantMessageId, (message) => ({
        ...message,
        metadata: appendNoticeMetadata(message.metadata, notice),
      }));
    },
    [queueAssistantNotice, updateMessage],
  );

  const recordTtsFallbackNotice = useCallback(
    (notice: MessagePipelineNotice) => {
      if (ttsFallbackNoticeRecordedRef.current) {
        return false;
      }

      recordAssistantNotice(notice);
      ttsFallbackNoticeRecordedRef.current = true;
      return true;
    },
    [recordAssistantNotice],
  );

  const persistPendingNoticesForUser = useCallback(() => {
    const userMessageId = lastUserMessageIdRef.current;
    const pendingNotices = pendingAssistantNoticesRef.current;

    if (!userMessageId || pendingNotices.length === 0) {
      return;
    }

    updateMessage(userMessageId, (message) => ({
      ...message,
      metadata: pendingNotices.reduce(
        (metadata, notice) => appendNoticeMetadata(metadata, notice),
        message.metadata,
      ),
    }));
    pendingAssistantNoticesRef.current = [];
  }, [updateMessage]);

  return {
    consumeAssistantMetadata,
    lastAssistantMessageIdRef,
    lastUserMessageIdRef,
    markReplyFailure,
    persistPendingNoticesForUser,
    queueAssistantNotice,
    recordAssistantNotice,
    recordTtsFallbackNotice,
    resetTurnMessageState,
    updateAssistantTurnReceipt,
  };
}
