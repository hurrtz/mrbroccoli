import {
  useEffect,
  useMemo,
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

async function hydrateConversationMetas(metas: ConversationMeta[]) {
  return Promise.all(
    metas.map(async (meta) => {
      const shouldHydrate =
        !meta.createdAt ||
        meta.messageCount === 0 ||
        meta.providers.length === 0 ||
        Object.keys(meta.providerModels ?? {}).length === 0;

      if (!shouldHydrate) {
        return meta;
      }

      const conversation = await readConversation(meta.id);

      if (!conversation) {
        return meta;
      }

      return buildConversationMetaFromConversation(conversation, meta);
    }),
  );
}

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
  conversations: ConversationMeta[];
  onHydrated: () => void;
  setActiveConversationValue: (conversation: Conversation | null) => void;
  setConversations: Dispatch<SetStateAction<ConversationMeta[]>>;
}) {
  const {
    activeConversationRef,
    conversations,
    onHydrated,
    setActiveConversationValue,
    setConversations,
  } = params;

  const hydrateConversationMetasCallback = useMemo(
    () => hydrateConversationMetas,
    [],
  );

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

            if (!needsHydration && !mayHaveLegacyTitle) {
              return normalizedMeta;
            }

            const conversation = await readConversation(meta.id);

            if (!conversation) {
              return normalizedMeta;
            }

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
              legacyParent,
            );
            if (restoredConversation !== conversation) {
              void saveConversation(restoredConversation);
            }

            return buildConversationMetaFromConversation(
              restoredConversation,
              normalizedMeta,
            );
          }),
        );

        const hydratedMetas =
          await hydrateConversationMetasCallback(normalizedMetas);

        if (cancelled) {
          return;
        }

        const sortedStoredMetas = sortConversationMeta(hydratedMetas);
        setConversations((currentMetas) => {
          const mergedMetas = mergeConversationMetas(
            sortedStoredMetas,
            currentMetas,
          );

          if (JSON.stringify(mergedMetas) !== JSON.stringify(storedMetas)) {
            persistConversationMeta(mergedMetas);
          }

          return mergedMetas;
        });

        if (!storedActiveConversationId) {
          return;
        }

        const activeConversationStillExists = sortedStoredMetas.some(
          (conversation) => conversation.id === storedActiveConversationId,
        );
        const storedActiveConversation = activeConversationStillExists
          ? await readConversation(storedActiveConversationId)
          : null;
        const restoredActiveConversation = storedActiveConversation
          ? restoreLegacyConversationTitle(storedActiveConversation)
          : null;

        if (
          storedActiveConversation &&
          restoredActiveConversation &&
          restoredActiveConversation !== storedActiveConversation
        ) {
          void saveConversation(restoredActiveConversation);
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
    hydrateConversationMetasCallback,
    onHydrated,
    setActiveConversationValue,
    setConversations,
  ]);

  useEffect(() => {
    let cancelled = false;

    if (
      conversations.length === 0 ||
      !conversations.some(
        (conversation) =>
          conversation.messageCount === 0 || conversation.providers.length === 0,
      )
    ) {
      return;
    }

    void (async () => {
      const hydratedMetas = await hydrateConversationMetasCallback(conversations);

      if (cancelled) {
        return;
      }

      if (JSON.stringify(hydratedMetas) === JSON.stringify(conversations)) {
        return;
      }

      setConversations(persistConversationMeta(hydratedMetas));
    })();

    return () => {
      cancelled = true;
    };
  }, [conversations, hydrateConversationMetasCallback, setConversations]);
}
