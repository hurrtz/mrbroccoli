import { Conversation, ConversationMeta } from "../../types";
import { reportPersistenceAlert } from "../../services/persistenceAlerts";
import { recordDebugLogEvent } from "../../services/debugLogCapture";
import {
  relativizeConversationImageAttachmentUris,
  resolveConversationImageAttachmentUris,
} from "../../services/imageAttachmentFiles";
import {
  ACTIVE_CONVERSATION_STATE_KEY,
  deleteConversationRow,
  readAppStateValue,
  readConversationMetaRows,
  readConversationRow,
  resetConversationDatabaseForTests,
  runInConversationTransaction,
  updateConversationMetaRows,
  upsertConversationRow,
  writeAppStateValue,
} from "../../services/conversationStore";
import { migrateConversationsFromAsyncStorage } from "../../services/conversationStore/migration";
import {
  buildConversationMetaFromConversation,
  normalizeConversationMeta,
  sortConversationMeta,
} from "./meta";

type StorageScope = "conversation" | "metadata" | "active-conversation" | "migration";

function reportStorageFailure(
  storageScope: StorageScope,
  operation: string,
  error: unknown,
) {
  recordDebugLogEvent({
    event: "persistence-operation-failed",
    level: "warn",
    payload: {
      domain: "conversations",
      error,
      operation,
      storageScope,
    },
  });
  console.error(`[conversation-storage] ${operation} failed (${storageScope})`, error);
  reportPersistenceAlert("conversations", operation);
}

let readyPromise: Promise<void> | null = null;

/**
 * Runs the one-time AsyncStorage import before the first read or write.
 *
 * A failed migration is reported and swallowed rather than rethrown. The
 * transaction has already rolled back, so SQLite is merely empty while the
 * legacy keys remain intact; surfacing an empty list and retrying next launch
 * loses nothing, whereas propagating the error would break hydration outright.
 */
function ensureReady() {
  readyPromise ??= migrateConversationsFromAsyncStorage()
    .then(() => undefined)
    .catch((error) => {
      reportStorageFailure("migration", "migrate", error);
      // Clear the cache so the next call retries instead of remembering failure.
      readyPromise = null;
    });

  return readyPromise;
}

export async function readConversation(id: string) {
  try {
    await ensureReady();
    const row = await readConversationRow(id);

    if (!row) {
      return null;
    }

    return resolveConversationImageAttachmentUris(row.conversation);
  } catch (error) {
    reportStorageFailure("conversation", "read", error);
    return null;
  }
}

export async function readStoredConversationMetas() {
  try {
    await ensureReady();
    return await readConversationMetaRows();
  } catch (error) {
    reportStorageFailure("metadata", "read", error);
    return [];
  }
}

export async function readActiveConversationId() {
  try {
    await ensureReady();
    const storedId = await readAppStateValue(ACTIVE_CONVERSATION_STATE_KEY);
    return storedId?.trim() || null;
  } catch (error) {
    reportStorageFailure("active-conversation", "read active conversation", error);
    return null;
  }
}

export async function saveConversation(conversation: Conversation) {
  try {
    await ensureReady();
    const document = JSON.stringify(
      relativizeConversationImageAttachmentUris(conversation),
    );

    await runInConversationTransaction((database) =>
      upsertConversationRow(database, {
        conversation,
        document,
        // Only consulted when the row is new; an existing row keeps the
        // metadata its callers own, including pinned state.
        initialMeta: buildConversationMetaFromConversation(conversation),
      }),
    );
  } catch (error) {
    reportStorageFailure("conversation", "save", error);
  }
}

/**
 * Writes several conversations in one transaction.
 *
 * Branching and backup restore each touch more than one record: a branch also
 * rewrites its family's knowledge exclusions, and a restore imports a whole
 * set. Saving them one at a time would leave a family half-updated, or an
 * import half-applied, if the app died midway.
 */
export async function saveConversationsAtomically(conversations: Conversation[]) {
  if (conversations.length === 0) {
    return;
  }

  try {
    await ensureReady();
    const prepared = conversations.map((conversation) => ({
      conversation,
      document: JSON.stringify(
        relativizeConversationImageAttachmentUris(conversation),
      ),
      initialMeta: buildConversationMetaFromConversation(conversation),
    }));

    await runInConversationTransaction(async (database) => {
      for (const entry of prepared) {
        await upsertConversationRow(database, entry);
      }
    });
  } catch (error) {
    reportStorageFailure("conversation", "save batch", error);
  }
}

export async function removeConversation(id: string) {
  try {
    await ensureReady();
    await runInConversationTransaction((database) =>
      deleteConversationRow(database, id),
    );
  } catch (error) {
    reportStorageFailure("conversation", "remove", error);
  }
}

export async function persistActiveConversationId(id: string | null) {
  try {
    await ensureReady();
    await writeAppStateValue(ACTIVE_CONVERSATION_STATE_KEY, id);
  } catch (error) {
    reportStorageFailure(
      "active-conversation",
      "save active conversation",
      error,
    );
  }
}

/**
 * Sorts and returns metadata synchronously while the write settles in the
 * background. Callers feed the return value straight into React state, so it
 * must stay synchronous.
 */
export function persistConversationMeta(metas: ConversationMeta[]) {
  const sortedMetas = sortConversationMeta(metas.map(normalizeConversationMeta));

  void (async () => {
    try {
      await ensureReady();
      await runInConversationTransaction((database) =>
        updateConversationMetaRows(database, sortedMetas),
      );
    } catch (error) {
      reportStorageFailure("metadata", "save metadata", error);
    }
  })();

  return sortedMetas;
}

/**
 * Test seam: clears the database handle and the one-time migration guard
 * together. Resetting only one of them leaves a suite either reading a stale
 * store or skipping the migration it meant to exercise.
 */
export function resetConversationStorageForTests() {
  readyPromise = null;
  resetConversationDatabaseForTests();
}

export async function hydrateConversationMeta(meta: ConversationMeta) {
  const conversation = await readConversation(meta.id);

  if (!conversation) {
    return meta;
  }

  return buildConversationMetaFromConversation(conversation, meta);
}
