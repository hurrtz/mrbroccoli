import { useState, useEffect, useCallback, useRef } from "react";
import { Conversation, ConversationMeta } from "../types";
import {
  persistActiveConversationId,
  persistConversationMeta,
} from "./conversations/storage";
import { useConversationHydration } from "./conversations/useConversationHydration";
import { useConversationMutations } from "./conversations/useConversationMutations";
import { useConversationSearch } from "./conversations/useConversationSearch";
import {
  clearConversationKnowledgeIndex,
  setConversationKnowledgePrivate,
  syncConversationKnowledge,
} from "../services/conversationKnowledge";

export function useConversations({
  pastConversationKnowledgeEnabled = false,
}: {
  pastConversationKnowledgeEnabled?: boolean;
} = {}) {
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [loaded, setLoaded] = useState(false);
  const activeConversationRef = useRef<Conversation | null>(null);
  const setActiveConversationValue = useCallback(
    (conversation: Conversation | null) => {
      activeConversationRef.current = conversation;
      setActiveConversation(conversation);
      void persistActiveConversationId(conversation?.id ?? null);
    },
    [],
  );
  const persistMetas = useCallback((metas: ConversationMeta[]) => {
    return persistConversationMeta(metas);
  }, []);
  const handleHydrated = useCallback(() => {
    setLoaded(true);
  }, []);

  useConversationHydration({
    activeConversationRef,
    conversations,
    onHydrated: handleHydrated,
    setActiveConversationValue,
    setConversations,
  });

  useEffect(() => {
    if (!activeConversation || conversations.length === 0) {
      return;
    }

    const existsInMeta = conversations.some(
      (conversation) => conversation.id === activeConversation.id,
    );

    if (!existsInMeta) {
      setActiveConversationValue(null);
    }
  }, [activeConversation, conversations, setActiveConversationValue]);

  const {
    addMessage,
    clearActiveConversation,
    clearConversationMemory,
    createConversation,
    deleteConversation,
    editUserMessage,
    restoreConversationBackup,
    getConversationById,
    inspectConversationIntegrity,
    renameConversation,
    repairConversationIntegrity,
    selectConversation,
    toggleConversationPinned,
    toggleConversationPrivate,
    undoConversationIntegrityRepair,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
  } = useConversationMutations({
    activeConversationRef,
    conversationMetas: conversations,
    persistMetas,
    setActiveConversationValue,
    setConversations,
    pastConversationKnowledgeEnabled,
  });
  const knowledgeReconciliationRef = useRef<string | null>(null);
  const knowledgeConversationSignature = conversations
    .map(({ id, isPrivate, title }) => `${id}:${isPrivate ? 1 : 0}:${title}`)
    .join("|");

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const signature = pastConversationKnowledgeEnabled
      ? `enabled:${knowledgeConversationSignature}`
      : "disabled";
    if (knowledgeReconciliationRef.current === signature) {
      return;
    }
    knowledgeReconciliationRef.current = signature;

    if (!pastConversationKnowledgeEnabled) {
      void clearConversationKnowledgeIndex();
      return;
    }

    void Promise.all(
      conversations.map(async (meta) => {
        await setConversationKnowledgePrivate(meta.id, Boolean(meta.isPrivate));
        if (meta.isPrivate) {
          return;
        }
        const conversation = await getConversationById(meta.id);
        if (conversation) {
          await syncConversationKnowledge(conversation, true);
        }
      }),
    );
  }, [
    conversations,
    getConversationById,
    knowledgeConversationSignature,
    loaded,
    pastConversationKnowledgeEnabled,
  ]);
  const { searchConversations } = useConversationSearch({
    conversations,
    getConversationById,
  });
  return {
    conversations,
    activeConversation,
    loaded,
    createConversation,
    selectConversation,
    getConversationById,
    addMessage,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
    clearConversationMemory,
    inspectConversationIntegrity,
    renameConversation,
    repairConversationIntegrity,
    toggleConversationPinned,
    toggleConversationPrivate,
    undoConversationIntegrityRepair,
    searchConversations,
    deleteConversation,
    editUserMessage,
    restoreConversationBackup,
    clearActiveConversation,
  };
}
