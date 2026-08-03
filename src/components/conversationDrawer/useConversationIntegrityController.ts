import React from "react";

import type { ConversationIntegrityInspection } from "../../services/conversationIntegrity";
import type { ConversationMeta } from "../../types";

interface UseConversationIntegrityControllerParams {
  onInspect: (
    conversationId: string,
  ) => Promise<ConversationIntegrityInspection | null>;
  onRepair: (conversationId: string) => Promise<unknown>;
  onUndo: (conversationId: string) => Promise<unknown>;
}

export function useConversationIntegrityController({
  onInspect,
  onRepair,
  onUndo,
}: UseConversationIntegrityControllerParams) {
  const requestRef = React.useRef(0);
  const [conversation, setConversation] =
    React.useState<ConversationMeta | null>(null);
  const [inspection, setInspection] =
    React.useState<ConversationIntegrityInspection | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const loadInspection = React.useCallback(
    async (conversationId: string, requestId: number) => {
      setLoading(true);
      setFailed(false);
      try {
        const nextInspection = await onInspect(conversationId);
        if (requestRef.current !== requestId) {
          return;
        }
        setInspection(nextInspection);
        setFailed(nextInspection === null);
      } catch {
        if (requestRef.current === requestId) {
          setInspection(null);
          setFailed(true);
        }
      } finally {
        if (requestRef.current === requestId) {
          setLoading(false);
        }
      }
    },
    [onInspect],
  );

  const open = React.useCallback(
    (nextConversation: ConversationMeta) => {
      const requestId = requestRef.current + 1;
      requestRef.current = requestId;
      setConversation(nextConversation);
      setInspection(null);
      void loadInspection(nextConversation.id, requestId);
    },
    [loadInspection],
  );

  const close = React.useCallback(() => {
    requestRef.current += 1;
    setConversation(null);
    setInspection(null);
    setLoading(false);
    setBusy(false);
    setFailed(false);
  }, []);

  const runMutation = React.useCallback(
    async (mutation: (conversationId: string) => Promise<unknown>) => {
      if (!conversation || busy) {
        return;
      }

      const requestId = requestRef.current + 1;
      requestRef.current = requestId;
      setBusy(true);
      setFailed(false);
      try {
        const result = await mutation(conversation.id);
        if (requestRef.current !== requestId) {
          return;
        }
        if (!result) {
          setFailed(true);
          return;
        }
        await loadInspection(conversation.id, requestId);
      } catch {
        if (requestRef.current === requestId) {
          setFailed(true);
        }
      } finally {
        if (requestRef.current === requestId) {
          setBusy(false);
        }
      }
    },
    [busy, conversation, loadInspection],
  );

  const repair = React.useCallback(
    () => runMutation(onRepair),
    [onRepair, runMutation],
  );
  const undo = React.useCallback(
    () => runMutation(onUndo),
    [onUndo, runMutation],
  );

  return {
    busy,
    close,
    conversation,
    failed,
    inspection,
    loading,
    open,
    repair,
    undo,
  };
}
