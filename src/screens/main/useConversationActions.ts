import { useCallback } from "react";
import { Share } from "react-native";

import * as Clipboard from "expo-clipboard";

import { TranslationKey } from "../../i18n";
import { AppLanguage, Conversation } from "../../types";
import { formatConversationForCopy } from "../../utils/conversationExport";
import type { useConversations } from "../../hooks/useConversations";
import type { ShowToastFn } from "./shared";

type TranslateFn = (
  key: TranslationKey,
  params?: Record<string, string | number | undefined>,
) => string;

type ConversationsApi = ReturnType<typeof useConversations>;

interface UseConversationActionsParams {
  activeConversation: Conversation | null;
  memoryConversation: Conversation | null;
  getConversationById: ConversationsApi["getConversationById"];
  renameConversation: ConversationsApi["renameConversation"];
  toggleConversationPinned: ConversationsApi["toggleConversationPinned"];
  clearConversationMemory: ConversationsApi["clearConversationMemory"];
  deleteConversation: ConversationsApi["deleteConversation"];
  selectConversation: ConversationsApi["selectConversation"];
  clearActiveConversation: ConversationsApi["clearActiveConversation"];
  resetVoiceSessionState: () => Promise<void>;
  openMemoryConversation: (conversation: Conversation) => void;
  setMemoryConversation: (conversation: Conversation | null) => void;
  showToast: ShowToastFn;
  language: AppLanguage;
  t: TranslateFn;
}

export function useConversationActions({
  activeConversation,
  memoryConversation,
  getConversationById,
  renameConversation,
  toggleConversationPinned,
  clearConversationMemory,
  deleteConversation,
  selectConversation,
  clearActiveConversation,
  resetVoiceSessionState,
  openMemoryConversation,
  setMemoryConversation,
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
      const message = formatConversationForCopy(conversation, language);

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
    [language, resolveConversation, showToast, t],
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

  const handleRenameThread = useCallback(
    async (conversationId: string, nextTitle: string) => {
      await renameConversation(conversationId, nextTitle);
      showToast(t("threadRenamed"), undefined, "success");
    },
    [renameConversation, showToast, t],
  );

  const handleTogglePinned = useCallback(
    (conversationId: string) => {
      const pinned = toggleConversationPinned(conversationId);
      showToast(
        pinned ? t("threadPinned") : t("threadUnpinned"),
        undefined,
        "success",
      );
    },
    [showToast, t, toggleConversationPinned],
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

  const openMemory = useCallback(
    async (conversationId?: string) => {
      const conversation = await resolveConversation(conversationId);

      if (!conversation) {
        showToast(t("noConversationToManageYet"));
        return;
      }

      openMemoryConversation(conversation);
    },
    [openMemoryConversation, resolveConversation, showToast, t],
  );

  const handleCopyMemory = useCallback(async () => {
    const summary = memoryConversation?.contextSummary?.trim() ?? "";

    if (!summary) {
      showToast(t("noConversationToManageYet"));
      return;
    }

    await copyText(summary, t("memoryCopied"));
  }, [copyText, memoryConversation?.contextSummary, showToast, t]);

  const handleClearMemory = useCallback(async () => {
    if (!memoryConversation) {
      return;
    }

    const updatedConversation = await clearConversationMemory(
      memoryConversation.id,
    );

    setMemoryConversation(updatedConversation);
    showToast(t("memoryCleared"), undefined, "success");
  }, [clearConversationMemory, memoryConversation, setMemoryConversation, showToast, t]);

  return {
    copyText,
    handleCopyMessage,
    handleCopyThread,
    handleShareThread,
    handleShareMessage,
    handleRenameThread,
    handleTogglePinned,
    handleSelectConversation,
    handleStartNewSession,
    handleDeleteConversation,
    openMemory,
    handleCopyMemory,
    handleClearMemory,
  };
}
