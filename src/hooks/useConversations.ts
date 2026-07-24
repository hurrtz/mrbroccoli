import { useState, useEffect, useCallback, useRef } from "react";
import { Conversation, ConversationMeta } from "../types";
import {
  persistActiveConversationId,
  persistConversationMeta,
} from "./conversations/storage";
import { useConversationHydration } from "./conversations/useConversationHydration";
import { useConversationMutations } from "./conversations/useConversationMutations";
import { useConversationSearch } from "./conversations/useConversationSearch";

export function useConversations() {
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
    getConversationById,
    renameConversation,
    selectConversation,
    toggleConversationPinned,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
  } = useConversationMutations({
    activeConversationRef,
    persistMetas,
    setActiveConversationValue,
    setConversations,
  });
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
    renameConversation,
    toggleConversationPinned,
    searchConversations,
    deleteConversation,
    clearActiveConversation,
  };
}
