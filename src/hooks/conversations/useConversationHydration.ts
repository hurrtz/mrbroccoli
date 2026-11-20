import {
  useEffect,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import { Conversation, ConversationMeta } from "../../types";
import {
  buildConversationMetaFromConversation,
  conversationMetaNeedsHydration,
  normalizeConversationMeta,
  restoreLegacyConversationBranch,
  restoreLegacyConversationTitle,
  sortConversationMeta,
} from "./meta";
import {
  persistConversationMeta,
  readActiveConversationId,
  readConversation,
  readStoredConversationMetas,
  saveConversation,
} from "./storage";

function mergeConversationMetas(
  storedMetas: ConversationMeta[],
  currentMetas: ConversationMeta[],
) {
  const mergedById = new Map(
    storedMetas.map((meta) => [meta.id, meta] as const),
  );

  // In-memory entries were created or changed after the storage read began,
  // so they are the authoritative version when the same ID exists in both.
  for (const meta of currentMetas) {
    mergedById.set(meta.id, meta);
  }

  return sortConversationMeta([...mergedById.values()]);
}

export function useConversationHydration(params: {
  activeConversationRef: MutableRefObject<Conversation | null>;
  onHydrated: () => void;
  setActiveConversationValue: (conversation: Conversation | null) => void;
  setConversations: Dispatch<SetStateAction<ConversationMeta[]>>;
}) {
  const {
    activeConversationRef,
    onHydrated,
    setActiveConversationValue,
    setConversations,
  } = params;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [storedMetas, storedActiveConversationId] = await Promise.all([
          readStoredConversationMetas(),
          readActiveConversationId(),
        ]);

        if (cancelled) {
          return;
        }

        if (storedMetas.length === 0) {
          if (storedActiveConversationId && !activeConversationRef.current) {
            setActiveConversationValue(null);
          }
          return;
        }

        const normalizedMetas = await Promise.all(
          storedMetas.map(async (meta) => {
            const needsHydration = conversationMetaNeedsHydration(meta);
            const normalizedMeta = normalizeConversationMeta(meta);
            const mayHaveLegacyTitle =
              normalizedMeta.title.endsWith("...") &&
              normalizedMeta.title.length <= 43;

            if (
              normalizedMeta.isLocked ||
              (!needsHydration && !mayHaveLegacyTitle)
            ) {
              return normalizedMeta;
            }

            const conversation = await readConversation(meta.id);

            if (!conversation) {
              return normalizedMeta;
            }

            if (conversation.isLocked)
              return { ...normalizedMeta, isLocked: true };
            const titleRestoredConversation =
              restoreLegacyConversationTitle(conversation);
            const legacyParentId =
              titleRestoredConversation.knowledgeExcludedConversationIds?.at(
                -1,
              );
            const legacyParent = legacyParentId
              ? await readConversation(legacyParentId)
              : null;
            const restoredConversation = restoreLegacyConversationBranch(
              titleRestoredConversation,
              legacyParent?.isLocked ? null : legacyParent,
            );
            if (restoredConversation !== conversation) {
              void saveConversation(restoredConversation, { mode: "update" });
            }

            return buildConversationMetaFromConversation(
              restoredConversation,
              normalizedMeta,
            );
          }),
        );

        if (cancelled) {
          return;
        }

        const sortedStoredMetas = sortConversationMeta(normalizedMetas);
        const repairs = normalizedMetas.filter(
          (meta, index) =>
            JSON.stringify(meta) !== JSON.stringify(storedMetas[index]),
        );
        if (repairs.length) persistConversationMeta(repairs, storedMetas);
        setConversations((current) =>
          mergeConversationMetas(sortedStoredMetas, current),
        );

        if (!storedActiveConversationId) {
          return;
        }

        const activeConversationMeta = sortedStoredMetas.find(
          (conversation) => conversation.id === storedActiveConversationId,
        );
        // Authentication grants never survive launch. Keep a locked session in
        // the overview, but do not even read its body into React state.
        if (activeConversationMeta?.isLocked) {
          setActiveConversationValue(null);
          return;
        }
        const storedActiveConversation = activeConversationMeta
          ? await readConversation(storedActiveConversationId)
          : null;
        const restoredActiveConversation =
          storedActiveConversation && !storedActiveConversation.isLocked
            ? restoreLegacyConversationTitle(storedActiveConversation)
            : null;

        if (
          storedActiveConversation &&
          restoredActiveConversation &&
          restoredActiveConversation !== storedActiveConversation
        ) {
          void saveConversation(restoredActiveConversation, {
            mode: "update",
          });
        }

        if (!cancelled && !activeConversationRef.current) {
          setActiveConversationValue(restoredActiveConversation);
        }
      } finally {
        if (!cancelled) {
          onHydrated();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    activeConversationRef,
    onHydrated,
    setActiveConversationValue,
    setConversations,
  ]);
}
