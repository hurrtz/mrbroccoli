import { useState, useEffect, useCallback, useRef } from "react";
import { AppState } from "react-native";
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
  setConversationKnowledgeExcluded,
  syncConversationKnowledge,
} from "../services/conversationKnowledge";
import { clearSessionLock } from "../services/sessionLock";

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
  const authorizedConversationIdsRef = useRef(new Set<string>());
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
  const canAccessConversation = useCallback(
    (id: string) => {
      const meta = conversations.find((conversation) => conversation.id === id);
      return !meta?.isLocked || authorizedConversationIdsRef.current.has(id);
    },
    [conversations],
  );

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
    toggleConversationArchived,
    updateConversationLocked: updateConversationLockedValue,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
    clearConversationSettings,
  } = useConversationMutations({
    activeConversationRef,
    canAccessConversation,
    conversationMetas: conversations,
    persistMetas,
    setActiveConversationValue,
    setConversations,
    pastConversationKnowledgeEnabled,
  });
  const grantConversationAccess = useCallback((id: string) => {
    authorizedConversationIdsRef.current.add(id);
  }, []);
  const updateConversationLocked = useCallback(
    async (id: string, isLocked: boolean) => {
      const updated = await updateConversationLockedValue(id, isLocked);
      if (updated && isLocked) {
        authorizedConversationIdsRef.current.delete(id);
      }
      return updated;
    },
    [updateConversationLockedValue],
  );
  const deleteConversationWithCredentials = useCallback(
    (id: string) => {
      authorizedConversationIdsRef.current.delete(id);
      void clearSessionLock(id);
      deleteConversation(id);
    },
    [deleteConversation],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        return;
      }
      authorizedConversationIdsRef.current.clear();
      const activeId = activeConversationRef.current?.id;
      if (
        activeId &&
        conversations.some(
          (conversation) =>
            conversation.id === activeId && conversation.isLocked,
        )
      ) {
        setActiveConversationValue(null);
      }
    });
    return () => subscription.remove();
  }, [conversations, setActiveConversationValue]);
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
    .map(({ id, isLocked, title }) => `${id}:${isLocked ? 1 : 0}:${title}`)
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
        const excluded = Boolean(meta.isLocked);
        await setConversationKnowledgeExcluded(meta.id, excluded);
        if (excluded) {
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
    grantConversationAccess,
    getConversationById,
    addMessage,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
    clearConversationSettings,
    renameConversation,
    removeMessage,
    toggleConversationPinned,
    toggleConversationArchived,
    updateConversationLocked,
    searchConversations,
    deleteConversation: deleteConversationWithCredentials,
    editUserMessage,
    branchConversationAtMessage,
    restoreConversationBackup,
    clearActiveConversation,
  };
}
