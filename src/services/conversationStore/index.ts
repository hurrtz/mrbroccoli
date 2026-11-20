import * as SQLite from "expo-sqlite";

import type { Conversation, ConversationMeta } from "../../types";

export const CONVERSATION_DATABASE_NAME = "mr-broccoli-conversations.db";

export const ACTIVE_CONVERSATION_STATE_KEY = "active_conversation";

interface ConversationRow {
  document: string;
  meta: string;
}

interface MetaRow {
  meta: string;
}

interface AppStateRow {
  value: string | null;
}

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Serializes every write. Mobile SQLite runs on one shared connection, and
// `withTransactionAsync` cannot nest -- a second BEGIN while one is open
// throws. The knowledge index guards the same way
// (`conversationKnowledge/index.ts`).
let writeQueue: Promise<unknown> = Promise.resolve();

const SCHEMA = `
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY NOT NULL,
    document TEXT NOT NULL,
    meta TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    pinned INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS conversations_order
    ON conversations(pinned DESC, updated_at DESC);
  CREATE TABLE IF NOT EXISTS app_state (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
  );
`;

export function getConversationDatabase() {
  databasePromise ??= SQLite.openDatabaseAsync(CONVERSATION_DATABASE_NAME).then(
    async (database) => {
      await database.execAsync(SCHEMA);
      return database;
    },
  ).catch((error: unknown) => {
    // A transient open/schema failure must not poison every later operation.
    databasePromise = null;
    throw error;
  });

  return databasePromise;
}

/**
 * Runs `operation` inside a transaction, queued behind any write already in
 * flight. Returning the operation's value keeps callers from having to reach
 * back into the database for what they just wrote.
 */
export function runInConversationTransaction<T>(
  operation: (database: SQLite.SQLiteDatabase) => Promise<T>,
): Promise<T> {
  const queued = writeQueue.catch(() => undefined).then(async () => {
    const database = await getConversationDatabase();
    let result: T;
    await database.withTransactionAsync(async () => {
      result = await operation(database);
    });
    return result!;
  });

  writeQueue = queued;
  return queued;
}

/** Waits for queued writes so a read never observes a stale row. */
export async function settleConversationWrites() {
  await writeQueue.catch(() => undefined);
}

export async function readConversationRow(id: string) {
  await settleConversationWrites();
  const database = await getConversationDatabase();
  const row = await database.getFirstAsync<ConversationRow>(
    "SELECT document, meta FROM conversations WHERE id = ?",
    id,
  );

  if (!row) {
    return null;
  }

  return {
    conversation: JSON.parse(row.document) as Conversation,
    meta: JSON.parse(row.meta) as ConversationMeta,
  };
}

export async function readConversationMetaRows() {
  await settleConversationWrites();
  const database = await getConversationDatabase();
  const rows = await database.getAllAsync<MetaRow>(
    "SELECT meta FROM conversations ORDER BY pinned DESC, updated_at DESC",
  );

  return rows.map((row) => JSON.parse(row.meta) as ConversationMeta);
}

export async function readAppStateValue(key: string) {
  await settleConversationWrites();
  const database = await getConversationDatabase();
  const row = await database.getFirstAsync<AppStateRow>(
    "SELECT value FROM app_state WHERE key = ?",
    key,
  );

  return row?.value ?? null;
}

export function writeAppStateValue(key: string, value: string | null) {
  return runInConversationTransaction(async (database) => {
    if (value === null) {
      await database.runAsync("DELETE FROM app_state WHERE key = ?", key);
      return;
    }

    await database.runAsync(
      `INSERT INTO app_state (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      key,
      value,
    );
  });
}

/** Write the authoritative document and its derived drawer metadata together. */
export async function upsertConversationRow(
  database: SQLite.SQLiteDatabase,
  params: {
    conversation: Conversation;
    document: string;
    meta: ConversationMeta;
  },
) {
  const { conversation, document, meta } = params;

  await database.runAsync(
    `INSERT INTO conversations (id, document, meta, updated_at, pinned)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       document = excluded.document, meta = excluded.meta,
       updated_at = excluded.updated_at, pinned = excluded.pinned`,
    conversation.id,
    document,
    JSON.stringify(meta),
    conversation.updatedAt,
    meta.pinned ? 1 : 0,
  );
}

/**
 * Updates stored metadata for conversations that already exist.
 *
 * Metadata absent from `metas` is deliberately left alone rather than deleted.
 * Callers pass filtered in-memory lists, and treating an omission as a delete
 * would let a UI-level filter destroy conversations.
 */
export async function updateConversationMetaRows(
  database: SQLite.SQLiteDatabase,
  metas: ConversationMeta[],
  expected?: ConversationMeta[],
) {
  const originals = new Map(
    expected?.map((meta) => [meta.id, JSON.stringify(meta)]),
  );
  for (const meta of metas) {
    await database.runAsync(
      `UPDATE conversations
       SET meta = ?, updated_at = ?, pinned = ?
       WHERE id = ? AND (? IS NULL OR meta = ?)`,
      JSON.stringify(meta),
      meta.updatedAt,
      meta.pinned ? 1 : 0,
      meta.id,
      originals.get(meta.id) ?? null,
      originals.get(meta.id) ?? null,
    );
  }
}

export async function deleteConversationRow(
  database: SQLite.SQLiteDatabase,
  id: string,
) {
  await database.runAsync("DELETE FROM conversations WHERE id = ?", id);
}

/**
 * Replaces the whole conversation set in one transaction.
 *
 * Used where the store is authored wholesale rather than edited -- store promo
 * fixtures being the current caller. Ordinary saves must not use this: it
 * deletes conversations absent from `entries`.
 */
export function replaceAllConversationRows(
  entries: { conversation: Conversation; document: string; meta: ConversationMeta }[],
) {
  return runInConversationTransaction(async (database) => {
    await database.runAsync("DELETE FROM conversations");

    for (const { conversation, document, meta } of entries) {
      await database.runAsync(
        `INSERT INTO conversations (id, document, meta, updated_at, pinned)
         VALUES (?, ?, ?, ?, ?)`,
        conversation.id,
        document,
        JSON.stringify(meta),
        conversation.updatedAt,
        meta.pinned ? 1 : 0,
      );
    }
  });
}

/** Test seam: drops the cached handle so a suite can start from a fresh store. */
export function resetConversationDatabaseForTests() {
  databasePromise = null;
  writeQueue = Promise.resolve();
}
