import { useState, useEffect, useCallback, useRef } from "react";
import { Conversation, ConversationMeta } from "../types";
import {
  persistActiveConversationId,
  persistConversationMeta,
  saveConversation,
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
    createConversation,
    deleteConversation,
    editUserMessage,
    branchConversationAtMessage,
    restoreConversationBackup,
    getConversationById,
    renameConversation,
    removeMessage,
    selectConversation,
    toggleConversationPinned,
    toggleConversationPrivate,
    toggleConversationArchived,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
    clearConversationSettings,
  } = useConversationMutations({
    activeConversationRef,
    conversationMetas: conversations,
    persistMetas,
    setActiveConversationValue,
    setConversations,
    pastConversationKnowledgeEnabled,
  });
  const branchExclusionReconciliationRef = useRef<string | null>(null);
  const branchFamilySignature = conversations
    .map(
      ({ branch, id }) =>
        `${id}:${branch?.rootConversationId ?? id}:${
          branch?.parentConversationId ?? "root"
        }`,
    )
    .join("|");

  useEffect(() => {
    if (
      !loaded ||
      branchExclusionReconciliationRef.current === branchFamilySignature
    ) {
      return;
    }
    branchExclusionReconciliationRef.current = branchFamilySignature;
    const familyIdsByRoot = new Map<string, string[]>();
    for (const meta of conversations) {
      const rootId = meta.branch?.rootConversationId ?? meta.id;
      familyIdsByRoot.set(rootId, [
        ...(familyIdsByRoot.get(rootId) ?? []),
        meta.id,
      ]);
    }

    void Promise.all(
      [...familyIdsByRoot.values()]
        .filter((familyIds) => familyIds.length > 1)
        .flatMap((familyIds) =>
          familyIds.map(async (conversationId) => {
            const conversation = await getConversationById(conversationId);
            if (!conversation) {
              return;
            }
            const nextExcludedIds = [
              ...new Set([
                ...(conversation.knowledgeExcludedConversationIds ?? []),
                ...familyIds.filter((id) => id !== conversationId),
              ]),
            ];
            if (
              JSON.stringify(nextExcludedIds) ===
              JSON.stringify(
                conversation.knowledgeExcludedConversationIds ?? [],
              )
            ) {
              return;
            }

            const updatedConversation = {
              ...conversation,
              knowledgeExcludedConversationIds: nextExcludedIds,
            };
            await saveConversation(updatedConversation);
            if (activeConversationRef.current?.id === conversationId) {
              setActiveConversationValue(updatedConversation);
            }
          }),
        ),
    );
  }, [
    activeConversationRef,
    branchFamilySignature,
    conversations,
    getConversationById,
    loaded,
    setActiveConversationValue,
  ]);
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
    clearConversationSettings,
    renameConversation,
    removeMessage,
    toggleConversationPinned,
    toggleConversationPrivate,
    toggleConversationArchived,
    searchConversations,
    deleteConversation,
    editUserMessage,
    branchConversationAtMessage,
    restoreConversationBackup,
    clearActiveConversation,
  };
}
