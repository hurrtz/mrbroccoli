import type { SQLiteDatabase } from "expo-sqlite";
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

type StorageScope =
  "conversation" | "metadata" | "active-conversation" | "migration";

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
  console.error(
    `[conversation-storage] ${operation} failed (${storageScope})`,
    error,
  );
  reportPersistenceAlert("conversations", operation);
}

let readyPromise: Promise<void> | null = null;

/** Retry failed legacy imports. Only presentation reads may degrade to an empty result. */
function ensureReady() {
  readyPromise ??= migrateConversationsFromAsyncStorage()
    .then(() => undefined)
    .catch((error) => {
      reportStorageFailure("migration", "migrate", error);
      // Clear the cache so the next call retries instead of remembering failure.
      readyPromise = null;
      throw error;
    });

  return readyPromise;
}

export async function readConversation(id: string, strict = false) {
  try {
    await ensureReady();
    const row = await readConversationRow(id);

    if (!row) {
      return null;
    }

    const resolvedConversation = resolveConversationImageAttachmentUris(
      row.conversation,
    ) as Conversation & { isPrivate?: unknown };
    const { isPrivate: legacyIsPrivate, ...conversation } =
      resolvedConversation;

    if (legacyIsPrivate !== undefined) {
      // Retired private markers become ordinary sessions. Persist the current
      // shape after the read so old installs do not carry a hidden state that
      // no longer has a control or product meaning.
      void saveConversation(conversation, { mode: "update" });
    }

    return conversation;
  } catch (error) {
    reportStorageFailure("conversation", "read", error);
    if (strict) throw error;
    return null;
  }
}

export async function readStoredConversationMetas(strict = false) {
  try {
    await ensureReady();
    return await readConversationMetaRows();
  } catch (error) {
    reportStorageFailure("metadata", "read", error);
    if (strict) throw error;
    return [];
  }
}

export async function readActiveConversationId() {
  try {
    await ensureReady();
    const storedId = await readAppStateValue(ACTIVE_CONVERSATION_STATE_KEY);
    return storedId?.trim() || null;
  } catch (error) {
    reportStorageFailure(
      "active-conversation",
      "read active conversation",
      error,
    );
    return null;
  }
}

interface SaveOptions {
  initialMeta?: ConversationMeta;
  clearRouteHistory?: boolean;
  preserveTitle?: boolean;
  mode?: "insert" | "update";
}

async function writeConversation(
  database: SQLiteDatabase,
  conversation: Conversation,
  options: SaveOptions = {},
) {
  // Read inside the queued transaction. A pin or lock may have changed since
  // a voice callback captured its in-memory document.
  const row = await database.getFirstAsync<{
    meta: string;
    locked: number | null;
    awaiting: number | null;
  }>(
    `SELECT meta, CASE WHEN json_valid(document) THEN json_extract(document, '$.isLocked') END AS locked,
       CASE WHEN json_valid(document) THEN json_extract(document, '$.awaitingFirstPrompt') END AS awaiting
     FROM conversations WHERE id = ?`,
    conversation.id,
  );
  if (options.mode === "update" && !row) return false;
  if (options.mode === "insert" && row)
    throw new Error("New conversation ID is already in use.");
  const previous: ConversationMeta | undefined = row
    ? JSON.parse(row.meta)
    : options.initialMeta;
  const wasLocked = Boolean(row?.locked || previous?.isLocked);
  const document = { ...conversation };
  if (row && Boolean(document.isLocked) !== wasLocked)
    document.isLocked = wasLocked;
  if (row && !row.awaiting) delete document.awaitingFirstPrompt;
  if (options.preserveTitle && previous) document.title = previous.title;
  const meta = buildConversationMetaFromConversation(
    document,
    options.clearRouteHistory && previous
      ? {
          ...previous,
          lastModel: null,
          lastProvider: null,
          providers: [],
          providerModels: {},
        }
      : previous,
  );
  if (document.archived) meta.pinned = false;
  await upsertConversationRow(database, {
    conversation: document,
    document: JSON.stringify(
      relativizeConversationImageAttachmentUris(document),
    ),
    meta,
  });
  return true;
}

export async function saveConversation(
  conversation: Conversation,
  options?: SaveOptions,
) {
  try {
    await ensureReady();
    return await runInConversationTransaction((database) =>
      writeConversation(database, conversation, options),
    );
  } catch (error) {
    reportStorageFailure("conversation", "save", error);
    return false;
  }
}

/** A fork and its family exclusions commit together, without overwriting sibling content. */
export async function saveConversationBranch(
  branch: Conversation,
  rootId: string,
  parentId: string,
  canReadParent: (id: string, locked?: boolean) => boolean,
) {
  try {
    await ensureReady();
    return await runInConversationTransaction(async (database) => {
      const family = await database.getAllAsync<{
        id: string;
        exclusions: string | null;
        locked: number | null;
      }>(
        `SELECT id, json_extract(document, '$.knowledgeExcludedConversationIds') AS exclusions,
           json_extract(document, '$.isLocked') AS locked FROM conversations
         WHERE id IN (?, ?) OR json_extract(meta, '$.branch.rootConversationId') = ?`,
        parentId,
        rootId,
        rootId,
      );
      const parent = family.find((row) => row.id === parentId);
      if (!parent || !canReadParent(parentId, Boolean(parent.locked))) {
        throw new Error("The branch source is unavailable.");
      }
      // Keep the origin first so older readers retain its stable family order.
      const ids = [
        parentId,
        ...family.map(({ id }) => id).filter((id) => id !== parentId),
      ];
      const conversation = { ...branch, knowledgeExcludedConversationIds: ids };
      await writeConversation(database, conversation, { mode: "insert" });
      for (const row of family) {
        const previous: string[] = row.exclusions
          ? JSON.parse(row.exclusions)
          : [];
        const excluded = new Set([
          ...previous,
          ...ids.filter((id) => id !== row.id),
          branch.id,
        ]);
        await database.runAsync(
          "UPDATE conversations SET document = json_set(document, '$.knowledgeExcludedConversationIds', json(?)) WHERE id = ?",
          JSON.stringify([...excluded]),
          row.id,
        );
      }
      return conversation;
    });
  } catch (error) {
    reportStorageFailure("conversation", "create branch", error);
    throw error;
  }
}

/** Import every record and its initial pin in one SQLite transaction. */
export async function saveConversationsAtomically(
  conversations: Conversation[],
  initialMetas: ConversationMeta[] = [],
) {
  if (conversations.length === 0) {
    return;
  }

  try {
    await ensureReady();
    const metasById = new Map(initialMetas.map((meta) => [meta.id, meta]));
    await runInConversationTransaction(async (database) => {
      for (const conversation of conversations) {
        await writeConversation(database, conversation, {
          initialMeta: metasById.get(conversation.id),
          mode: metasById.has(conversation.id) ? "insert" : undefined,
        });
      }
    });
  } catch (error) {
    reportStorageFailure("conversation", "save batch", error);
    // Import/branch callers must not publish success after the transaction rolls back.
    throw error;
  }
}

/** Claim before contacting the title provider, including when auto-naming is off. */
export async function consumeFirstPrompt(id: string) {
  try {
    await ensureReady();
    return await runInConversationTransaction(async (database) => {
      const row = await database.getFirstAsync<{ title: string }>(
        `UPDATE conversations SET document = json_remove(document, '$.awaitingFirstPrompt')
         WHERE id = ? AND json_extract(document, '$.awaitingFirstPrompt')
         RETURNING json_extract(document, '$.title') AS title`,
        id,
      );
      return row?.title ?? null;
    });
  } catch (error) {
    reportStorageFailure("conversation", "claim first prompt", error);
    return null;
  }
}

export async function setStoredConversationLock(id: string, isLocked: boolean) {
  try {
    await ensureReady();
    const jsonBoolean = JSON.stringify(isLocked);
    const result = await runInConversationTransaction((database) =>
      database.runAsync(
        `UPDATE conversations SET document = json_set(document, '$.isLocked', json(?)),
       meta = json_set(meta, '$.isLocked', json(?)) WHERE id = ?`,
        jsonBoolean,
        jsonBoolean,
        id,
      ),
    );
    return result.changes > 0;
  } catch (error) {
    reportStorageFailure("conversation", "save session lock", error);
    return false;
  }
}

export async function renameStoredConversation(
  id: string,
  title: string,
  expectedTitle?: string,
) {
  try {
    await ensureReady();
    const result = await runInConversationTransaction((database) =>
      database.runAsync(
        `UPDATE conversations SET document = json_set(document, '$.title', ?),
         meta = json_set(meta, '$.title', ?)
       WHERE id = ? AND (? IS NULL OR (
         json_extract(document, '$.title') = ? AND NOT coalesce(json_extract(document, '$.isLocked'), 0)
       ))`,
        title,
        title,
        id,
        expectedTitle ?? null,
        expectedTitle ?? null,
      ),
    );
    return result.changes > 0;
  } catch (error) {
    reportStorageFailure("conversation", "rename", error);
    return false;
  }
}

export async function setConversationPinned(id: string, pinned: boolean) {
  try {
    await ensureReady();
    const result = await runInConversationTransaction((database) =>
      database.runAsync(
        `UPDATE conversations SET pinned = ?, meta = CASE WHEN ? THEN
         json_set(meta, '$.pinned', json('true'), '$.archived', json('false'))
         ELSE json_set(meta, '$.pinned', json('false')) END,
       document = CASE WHEN ? AND json_extract(document, '$.archived')
         THEN json_set(document, '$.archived', json('false')) ELSE document END
       WHERE id = ?`,
        pinned,
        pinned,
        pinned,
        id,
      ),
    );
    return result.changes > 0;
  } catch (error) {
    reportStorageFailure("metadata", "save pin", error);
    return false;
  }
}

export async function removeConversation(id: string) {
  try {
    await ensureReady();
    const document = await runInConversationTransaction(async (database) => {
      const row = await database.getFirstAsync<{ document: string }>(
        "SELECT document FROM conversations WHERE id = ?", id,
      );
      if (!row) return null;
      await deleteConversationRow(database, id);
      return row.document;
    });
    if (document === null) return null;
    try {
      const conversation = resolveConversationImageAttachmentUris(JSON.parse(document) as Conversation);
      return conversation.messages.flatMap((message) => message.attachments ?? []);
    } catch (error) {
      // A user can explicitly remove an unreadable legacy row. Its files cannot
      // be identified safely, but the committed deletion still releases its lock.
      reportStorageFailure("conversation", "read attachments after removal", error);
      return [];
    }
  } catch (error) {
    reportStorageFailure("conversation", "remove", error);
    return null;
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
export function persistConversationMeta(
  metas: ConversationMeta[],
  expected?: ConversationMeta[],
) {
  const sortedMetas = sortConversationMeta(
    metas.map(normalizeConversationMeta),
  );

  void (async () => {
    try {
      await ensureReady();
      await runInConversationTransaction((database) =>
        updateConversationMetaRows(database, sortedMetas, expected),
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
