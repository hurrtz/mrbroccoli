import { useCallback } from "react";
import { Share } from "react-native";

import * as Clipboard from "expo-clipboard";

import type { TranslationKey } from "../../i18n";
import type { AppLanguage, Conversation } from "../../types";
import {
  formatConversationForAiHandoff,
  formatConversationForCopy,
} from "../../utils/conversationExport";
import type { useConversations } from "../../hooks/useConversations";
import type { ShowToastFn } from "./shared";

type TranslateFn = (
  key: TranslationKey,
  params?: Record<string, string | number | undefined>,
) => string;

type ConversationsApi = ReturnType<typeof useConversations>;

interface UseConversationActionsParams {
  activeConversation: Conversation | null;
  getConversationById: ConversationsApi["getConversationById"];
  renameConversation: ConversationsApi["renameConversation"];
  toggleConversationPinned: ConversationsApi["toggleConversationPinned"];
  toggleConversationArchived: ConversationsApi["toggleConversationArchived"];
  deleteConversation: ConversationsApi["deleteConversation"];
  selectConversation: ConversationsApi["selectConversation"];
  clearActiveConversation: ConversationsApi["clearActiveConversation"];
  resetVoiceSessionState: () => Promise<void>;
  showToast: ShowToastFn;
  language: AppLanguage;
  t: TranslateFn;
}

export function useConversationActions({
  activeConversation,
  getConversationById,
  renameConversation,
  toggleConversationPinned,
  toggleConversationArchived,
  deleteConversation,
  selectConversation,
  clearActiveConversation,
  resetVoiceSessionState,
  showToast,
  language,
  t,
}: UseConversationActionsParams) {
  const copyText = useCallback(
    async (text: string, successMessage: string) => {
      if (!text.trim()) {
        showToast(t("nothingToCopyYet"));
        return false;
      }

      try {
        await Clipboard.setStringAsync(text);
        showToast(successMessage, undefined, "success");
        return true;
      } catch {
        showToast(t("couldntCopyText"), undefined, "danger");
        return false;
      }
    },
    [showToast, t],
  );

  const resolveConversation = useCallback(
    async (conversationId?: string) => {
      return conversationId
        ? getConversationById(conversationId)
        : activeConversation;
    },
    [activeConversation, getConversationById],
  );

  const handleCopyMessage = useCallback(
    async (content: string) => {
      return copyText(content.trim(), t("messageCopied"));
    },
    [copyText, t],
  );

  const handleCopyThread = useCallback(
    async (conversationId?: string) => {
      const conversation = await resolveConversation(conversationId);

      if (!conversation || conversation.messages.length === 0) {
        showToast(t("noConversationToCopyYet"));
        return;
      }

      await copyText(
        formatConversationForCopy(conversation, language),
        t("threadCopied"),
      );
    },
    [copyText, language, resolveConversation, showToast, t],
  );

  const handleShareThread = useCallback(
    async (conversationId?: string) => {
      const conversation = await resolveConversation(conversationId);

      if (!conversation || conversation.messages.length === 0) {
        showToast(t("noConversationToShareYet"));
        return;
      }

      const title = conversation.title.trim() || t("untitledConversation");
      const message = formatConversationForAiHandoff(conversation);

      try {
        await Share.share(
          {
            title,
            message,
          },
          {
            dialogTitle: title,
          },
        );
      } catch {
        showToast(t("couldntShareText"), undefined, "danger");
      }
    },
    [resolveConversation, showToast, t],
  );

  const handleShareMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();

      if (!trimmed) {
        showToast(t("nothingToShareYet"));
        return;
      }

      try {
        await Share.share({ message: trimmed });
      } catch {
        showToast(t("couldntShareText"), undefined, "danger");
      }
    },
    [showToast, t],
  );

  // Google Play's generative-AI policy requires an in-app way to report or
  // flag offensive model output. The serverless report travels through the
  // system share sheet so the user chooses the channel and sees exactly what
  // leaves the device.
  const handleReportMessage = useCallback(
    async (message: {
      content: string;
      model: string | null;
      provider: string | null;
    }) => {
      const route = [message.provider, message.model]
        .filter(Boolean)
        .join(" · ");
      const report = [
        t("reportResponseIntro"),
        route ? `Route: ${route}` : null,
        "",
        message.content.trim(),
      ]
        .filter((line) => line !== null)
        .join("\n");

      try {
        await Share.share({ message: report });
      } catch {
        showToast(t("couldntShareText"), undefined, "danger");
      }
    },
    [showToast, t],
  );

  const handleRenameThread = useCallback(
    async (conversationId: string, nextTitle: string) => {
      await renameConversation(conversationId, nextTitle);
      showToast(t("threadRenamed"), undefined, "success");
    },
    [renameConversation, showToast, t],
  );

  const handleTogglePinned = useCallback(
    async (conversationId: string) => {
      const pinned = await toggleConversationPinned(conversationId);
      showToast(
        pinned ? t("threadPinned") : t("threadUnpinned"),
        undefined,
        "success",
      );
    },
    [showToast, t, toggleConversationPinned],
  );

  const handleToggleArchived = useCallback(
    async (conversationId: string) => {
      const archived = await toggleConversationArchived(conversationId);
      if (archived === null) {
        return;
      }
      showToast(
        archived ? t("threadArchived") : t("threadUnarchived"),
        undefined,
        "success",
      );
    },
    [showToast, t, toggleConversationArchived],
  );

  const handleSelectConversation = useCallback(
    async (conversationId: string) => {
      await resetVoiceSessionState();
      await selectConversation(conversationId);
    },
    [resetVoiceSessionState, selectConversation],
  );

  const handleStartNewSession = useCallback(async () => {
    await resetVoiceSessionState();
    clearActiveConversation();
  }, [clearActiveConversation, resetVoiceSessionState]);

  const handleDeleteConversation = useCallback(
    async (conversationId: string) => {
      if (activeConversation?.id === conversationId) {
        await resetVoiceSessionState();
      }

      deleteConversation(conversationId);
    },
    [activeConversation?.id, deleteConversation, resetVoiceSessionState],
  );

  return {
    copyText,
    handleCopyMessage,
    handleCopyThread,
    handleShareThread,
    handleShareMessage,
    handleReportMessage,
    handleRenameThread,
    handleTogglePinned,
    handleToggleArchived,
    handleSelectConversation,
    handleStartNewSession,
    handleDeleteConversation,
  };
}
