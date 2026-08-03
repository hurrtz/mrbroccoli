import { useCallback } from "react";
import { Share } from "react-native";

import * as Clipboard from "expo-clipboard";

import type { TranslationKey } from "../../i18n";
import type {
  AppLanguage,
  Conversation,
  ConversationArtifactKind,
} from "../../types";
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

const ARTIFACT_TRANSLATION_KEYS = {
  decision: "artifactDecision",
  idea: "artifactIdea",
  assumption: "artifactAssumption",
  counterargument: "artifactCounterargument",
  question: "artifactQuestion",
  hypothesis: "artifactHypothesis",
  action: "artifactAction",
} satisfies Record<ConversationArtifactKind, TranslationKey>;

interface UseConversationActionsParams {
  activeConversation: Conversation | null;
  memoryConversation: Conversation | null;
  getConversationById: ConversationsApi["getConversationById"];
  renameConversation: ConversationsApi["renameConversation"];
  toggleConversationPinned: ConversationsApi["toggleConversationPinned"];
  toggleConversationPrivate: ConversationsApi["toggleConversationPrivate"];
  clearConversationMemory: ConversationsApi["clearConversationMemory"];
  updateConversationMemory: ConversationsApi["updateConversationMemory"];
  removeConversationArtifact: ConversationsApi["removeConversationArtifact"];
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
  toggleConversationPrivate,
  clearConversationMemory,
  updateConversationMemory,
  removeConversationArtifact,
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

  const handleTogglePrivate = useCallback(
    async (conversationId: string) => {
      const isPrivate = await toggleConversationPrivate(conversationId);
      if (isPrivate === null) {
        return;
      }
      showToast(
        isPrivate
          ? t("conversationMarkedPrivate")
          : t("conversationIncludedInKnowledge"),
        undefined,
        "success",
      );
    },
    [showToast, t, toggleConversationPrivate],
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
    const artifacts = memoryConversation?.artifacts ?? [];

    if (!summary && artifacts.length === 0) {
      showToast(t("noConversationToManageYet"));
      return;
    }

    const artifactText = artifacts.length
      ? [
          t("savedInsights"),
          ...artifacts.map(
            (artifact) =>
              `${t(ARTIFACT_TRANSLATION_KEYS[artifact.kind])}: ${artifact.text}`,
          ),
        ].join("\n")
      : "";
    await copyText(
      [summary, artifactText].filter(Boolean).join("\n\n"),
      t("memoryCopied"),
    );
  }, [copyText, memoryConversation, showToast, t]);

  const handleClearMemory = useCallback(async () => {
    if (!memoryConversation) {
      return;
    }

    const updatedConversation = await clearConversationMemory(
      memoryConversation.id,
    );

    setMemoryConversation(updatedConversation);
    showToast(t("memoryCleared"), undefined, "success");
  }, [
    clearConversationMemory,
    memoryConversation,
    setMemoryConversation,
    showToast,
    t,
  ]);

  const handleSaveMemory = useCallback(
    async (summary: string) => {
      if (!memoryConversation) {
        return false;
      }

      const updatedConversation = await updateConversationMemory(
        memoryConversation.id,
        summary,
      );
      if (!updatedConversation) {
        return false;
      }

      setMemoryConversation(updatedConversation);
      showToast(t("memorySaved"), undefined, "success");
      return true;
    },
    [
      memoryConversation,
      setMemoryConversation,
      showToast,
      t,
      updateConversationMemory,
    ],
  );

  const handleRemoveArtifact = useCallback(
    async (artifactId: string) => {
      if (!memoryConversation) {
        return false;
      }

      const updatedConversation = await removeConversationArtifact(
        memoryConversation.id,
        artifactId,
      );
      if (!updatedConversation) {
        return false;
      }

      setMemoryConversation(updatedConversation);
      showToast(t("insightRemoved"), undefined, "success");
      return true;
    },
    [
      memoryConversation,
      removeConversationArtifact,
      setMemoryConversation,
      showToast,
      t,
    ],
  );

  return {
    copyText,
    handleCopyMessage,
    handleCopyThread,
    handleShareThread,
    handleShareMessage,
    handleRenameThread,
    handleTogglePinned,
    handleTogglePrivate,
    handleSelectConversation,
    handleStartNewSession,
    handleDeleteConversation,
    openMemory,
    handleCopyMemory,
    handleClearMemory,
    handleSaveMemory,
    handleRemoveArtifact,
  };
}
