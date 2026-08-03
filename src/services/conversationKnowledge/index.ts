import * as SQLite from "expo-sqlite";

import type {
  Conversation,
  MessageConversationKnowledgeMetadata,
} from "../../types";
import { recordDebugLogEvent } from "../debugLogCapture";
import {
  buildConversationKnowledgeChunks,
  getConversationKnowledgeRevision,
} from "./chunks";
import {
  compareLocalKnowledgeEmbeddings,
  createLocalKnowledgeEmbedding,
  LOCAL_KNOWLEDGE_EMBEDDING,
  tokenizeKnowledgeText,
} from "./embedding";

const DATABASE_NAME = "mr-broccoli-conversation-knowledge.db";
const VECTOR_SCAN_LIMIT = 1_500;
const FTS_SEED_LIMIT = 24;
const DEFAULT_SOURCE_LIMIT = 3;
const DEFAULT_CONTEXT_CHARACTER_BUDGET = 4_800;

interface StoredKnowledgeRow {
  content: string;
  conversationId: string;
  id: string;
  ordinal: number;
  title: string;
  updatedAt: string;
  vector: Uint8Array;
}

interface RankedKnowledgeRow extends StoredKnowledgeRow {
  score: number;
}

export interface ConversationKnowledgeRetrieval {
  context: string;
  metadata: MessageConversationKnowledgeMetadata;
}

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
const conversationMutationQueues = new Map<string, Promise<void>>();
const privateConversationIds = new Set<string>();
let databaseMutationQueue: Promise<void> = Promise.resolve();

function getDatabase() {
  databasePromise ??= SQLite.openDatabaseAsync(DATABASE_NAME).then(
    async (database) => {
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS knowledge_conversations (
          conversation_id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          revision TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS knowledge_chunks (
          id TEXT PRIMARY KEY NOT NULL,
          conversation_id TEXT NOT NULL,
          ordinal INTEGER NOT NULL,
          content TEXT NOT NULL,
          vector BLOB NOT NULL,
          vector_model TEXT NOT NULL,
          FOREIGN KEY (conversation_id)
            REFERENCES knowledge_conversations(conversation_id)
            ON DELETE CASCADE,
          UNIQUE(conversation_id, ordinal)
        );
        CREATE INDEX IF NOT EXISTS knowledge_chunks_conversation_ordinal
          ON knowledge_chunks(conversation_id, ordinal);
        CREATE TABLE IF NOT EXISTS knowledge_chunk_links (
          source_chunk_id TEXT NOT NULL,
          target_chunk_id TEXT NOT NULL,
          relation TEXT NOT NULL,
          weight REAL NOT NULL,
          PRIMARY KEY (source_chunk_id, target_chunk_id, relation),
          FOREIGN KEY (source_chunk_id)
            REFERENCES knowledge_chunks(id) ON DELETE CASCADE,
          FOREIGN KEY (target_chunk_id)
            REFERENCES knowledge_chunks(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS knowledge_chunk_links_target
          ON knowledge_chunk_links(target_chunk_id);
        CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_chunks_fts USING fts5(
          chunk_id UNINDEXED,
          conversation_id UNINDEXED,
          title,
          content,
          tokenize = 'unicode61 remove_diacritics 2'
        );
      `);
      return database;
    },
  );
  return databasePromise;
}

function reportKnowledgeFailure(operation: string, error: unknown) {
  recordDebugLogEvent({
    event: "conversation-knowledge-operation-failed",
    level: "warn",
    payload: { operation, error },
  });
}

function enqueueDatabaseMutation(operation: () => Promise<void>) {
  const result = databaseMutationQueue
    .catch(() => undefined)
    .then(operation);
  databaseMutationQueue = result.catch(() => undefined);
  return result;
}

function enqueueConversationMutation(
  conversationId: string,
  operation: () => Promise<void>,
) {
  const previous = conversationMutationQueues.get(conversationId) ??
    Promise.resolve();
  const queued = previous
    .catch(() => undefined)
    .then(() => enqueueDatabaseMutation(operation))
    .catch((error) => reportKnowledgeFailure("index-mutation", error));
  conversationMutationQueues.set(conversationId, queued);
  void queued.then(() => {
    if (conversationMutationQueues.get(conversationId) === queued) {
      conversationMutationQueues.delete(conversationId);
    }
  });
  return queued;
}

async function deleteConversationRows(
  database: SQLite.SQLiteDatabase,
  conversationId: string,
) {
  await database.runAsync(
    "DELETE FROM knowledge_chunks_fts WHERE conversation_id = ?",
    conversationId,
  );
  await database.runAsync(
    "DELETE FROM knowledge_conversations WHERE conversation_id = ?",
    conversationId,
  );
}

export function removeConversationKnowledge(conversationId: string) {
  return enqueueConversationMutation(conversationId, async () => {
    const database = await getDatabase();
    await database.withTransactionAsync(() =>
      deleteConversationRows(database, conversationId),
    );
  });
}

export function setConversationKnowledgePrivate(
  conversationId: string,
  isPrivate: boolean,
) {
  if (isPrivate) {
    privateConversationIds.add(conversationId);
    return removeConversationKnowledge(conversationId);
  }

  privateConversationIds.delete(conversationId);
  return Promise.resolve();
}

export function syncConversationKnowledge(
  conversation: Conversation,
  enabled: boolean,
) {
  if (!enabled || conversation.isPrivate) {
    if (conversation.isPrivate) {
      privateConversationIds.add(conversation.id);
    }
    return removeConversationKnowledge(conversation.id);
  }

  privateConversationIds.delete(conversation.id);
  return enqueueConversationMutation(conversation.id, async () => {
    if (privateConversationIds.has(conversation.id)) {
      return;
    }

    const chunks = buildConversationKnowledgeChunks(conversation);
    const database = await getDatabase();
    const revision = getConversationKnowledgeRevision(conversation);
    const indexed = await database.getFirstAsync<{ revision: string }>(
      "SELECT revision FROM knowledge_conversations WHERE conversation_id = ?",
      conversation.id,
    );

    if (indexed?.revision === revision) {
      return;
    }

    await database.withTransactionAsync(async () => {
      const transaction = database;
      if (privateConversationIds.has(conversation.id)) {
        await deleteConversationRows(transaction, conversation.id);
        return;
      }

      await deleteConversationRows(transaction, conversation.id);
      if (chunks.length === 0) {
        return;
      }

      await transaction.runAsync(
        `INSERT INTO knowledge_conversations
          (conversation_id, title, updated_at, revision)
         VALUES (?, ?, ?, ?)`,
        conversation.id,
        conversation.title,
        conversation.updatedAt,
        revision,
      );

      for (const chunk of chunks) {
        await transaction.runAsync(
          `INSERT INTO knowledge_chunks
            (id, conversation_id, ordinal, content, vector, vector_model)
           VALUES (?, ?, ?, ?, ?, ?)`,
          chunk.id,
          conversation.id,
          chunk.ordinal,
          chunk.content,
          chunk.vector,
          LOCAL_KNOWLEDGE_EMBEDDING.id,
        );
        await transaction.runAsync(
          `INSERT INTO knowledge_chunks_fts
            (chunk_id, conversation_id, title, content)
           VALUES (?, ?, ?, ?)`,
          chunk.id,
          conversation.id,
          conversation.title,
          chunk.content,
        );
      }

      for (let index = 1; index < chunks.length; index += 1) {
        const previousChunk = chunks[index - 1];
        const currentChunk = chunks[index];
        await transaction.runAsync(
          `INSERT INTO knowledge_chunk_links
            (source_chunk_id, target_chunk_id, relation, weight)
           VALUES (?, ?, 'adjacent', 1), (?, ?, 'adjacent', 1)`,
          previousChunk.id,
          currentChunk.id,
          currentChunk.id,
          previousChunk.id,
        );
      }
    });
  });
}

export async function clearConversationKnowledgeIndex() {
  try {
    await Promise.all(conversationMutationQueues.values());
    await enqueueDatabaseMutation(async () => {
      const database = await getDatabase();
      await database.withTransactionAsync(async () => {
        const transaction = database;
        await transaction.runAsync("DELETE FROM knowledge_chunks_fts");
        await transaction.runAsync("DELETE FROM knowledge_conversations");
      });
    });
  } catch (error) {
    reportKnowledgeFailure("clear-index", error);
  }
}

function buildExclusionClause(ids: string[]) {
  if (ids.length === 0) {
    return { clause: "", parameters: [] as string[] };
  }

  return {
    clause: ` AND chunks.conversation_id NOT IN (${ids.map(() => "?").join(",")})`,
    parameters: ids,
  };
}

function buildFtsQuery(query: string) {
  return Array.from(new Set(tokenizeKnowledgeText(query)))
    .filter((token) => token.length >= 2)
    .slice(0, 16)
    .map((token) => `"${token.replace(/"/g, '""')}"*`)
    .join(" OR ");
}

async function getFtsSeeds(
  database: SQLite.SQLiteDatabase,
  query: string,
  excludedIds: string[],
) {
  const ftsQuery = buildFtsQuery(query);
  if (!ftsQuery) {
    return [];
  }
  const exclusion = buildExclusionClause(excludedIds);

  return database.getAllAsync<StoredKnowledgeRow & { rank: number }>(
    `SELECT
       chunks.id,
       chunks.conversation_id AS conversationId,
       chunks.ordinal,
       chunks.content,
       chunks.vector,
       conversations.title,
       conversations.updated_at AS updatedAt,
       bm25(knowledge_chunks_fts) AS rank
     FROM knowledge_chunks_fts
     JOIN knowledge_chunks AS chunks
       ON chunks.id = knowledge_chunks_fts.chunk_id
     JOIN knowledge_conversations AS conversations
       ON conversations.conversation_id = chunks.conversation_id
     WHERE knowledge_chunks_fts MATCH ?${exclusion.clause}
     ORDER BY rank
     LIMIT ${FTS_SEED_LIMIT}`,
    ftsQuery,
    ...exclusion.parameters,
  );
}

async function getVectorSeeds(
  database: SQLite.SQLiteDatabase,
  query: string,
  excludedIds: string[],
) {
  const exclusion = buildExclusionClause(excludedIds);
  const rows = await database.getAllAsync<StoredKnowledgeRow>(
    `SELECT
       chunks.id,
       chunks.conversation_id AS conversationId,
       chunks.ordinal,
       chunks.content,
       chunks.vector,
       conversations.title,
       conversations.updated_at AS updatedAt
     FROM knowledge_chunks AS chunks
     JOIN knowledge_conversations AS conversations
       ON conversations.conversation_id = chunks.conversation_id
     WHERE chunks.vector_model = ?${exclusion.clause}
     ORDER BY conversations.updated_at DESC
     LIMIT ${VECTOR_SCAN_LIMIT}`,
    LOCAL_KNOWLEDGE_EMBEDDING.id,
    ...exclusion.parameters,
  );
  const queryVector = createLocalKnowledgeEmbedding(query);

  return rows
    .map((row) => ({
      ...row,
      score: compareLocalKnowledgeEmbeddings(queryVector, row.vector),
    }))
    .filter(({ score }) => score >= 0.18)
    .sort((left, right) => right.score - left.score)
    .slice(0, FTS_SEED_LIMIT);
}

function mergeRankedSeeds(
  ftsRows: StoredKnowledgeRow[],
  vectorRows: RankedKnowledgeRow[],
) {
  const ranked = new Map<string, RankedKnowledgeRow>();

  ftsRows.forEach((row, index) => {
    ranked.set(row.id, {
      ...row,
      score: 0.72 + 0.28 * (1 - index / Math.max(1, ftsRows.length)),
    });
  });
  vectorRows.forEach((row) => {
    const existing = ranked.get(row.id);
    ranked.set(row.id, {
      ...row,
      score: Math.max(existing?.score ?? 0, row.score * 0.74) +
        (existing ? row.score * 0.18 : 0),
    });
  });

  return [...ranked.values()].sort((left, right) => right.score - left.score);
}

async function expandSeedContext(
  database: SQLite.SQLiteDatabase,
  seed: RankedKnowledgeRow,
) {
  const neighbors = await database.getAllAsync<{ content: string; ordinal: number }>(
    `SELECT content, ordinal
     FROM knowledge_chunks
     WHERE id = ? OR id IN (
       SELECT target_chunk_id
       FROM knowledge_chunk_links
       WHERE source_chunk_id = ? AND relation = 'adjacent'
     )
     ORDER BY ordinal`,
    seed.id,
    seed.id,
  );
  return neighbors.map(({ content }) => content).join("\n\n");
}

export async function retrieveConversationKnowledge(params: {
  currentConversationId?: string | null;
  privateConversationIds?: string[];
  query: string;
  sourceLimit?: number;
  contextCharacterBudget?: number;
}): Promise<ConversationKnowledgeRetrieval | null> {
  try {
    const query = params.query.trim();
    if (!query) {
      return null;
    }
    const excludedIds = Array.from(
      new Set([
        ...(params.privateConversationIds ?? []),
        ...privateConversationIds,
        ...(params.currentConversationId ? [params.currentConversationId] : []),
      ]),
    );
    await Promise.all(conversationMutationQueues.values());
    await databaseMutationQueue;
    const database = await getDatabase();
    const [ftsRows, vectorRows] = await Promise.all([
      getFtsSeeds(database, query, excludedIds),
      getVectorSeeds(database, query, excludedIds),
    ]);
    const sourceLimit = params.sourceLimit ?? DEFAULT_SOURCE_LIMIT;
    const selected = mergeRankedSeeds(ftsRows, vectorRows);
    const excludedConversationIds = new Set(excludedIds);
    const selectedConversations = new Set<string>();
    const sourceRows: RankedKnowledgeRow[] = [];

    for (const row of selected) {
      if (excludedConversationIds.has(row.conversationId)) {
        continue;
      }
      if (selectedConversations.has(row.conversationId)) {
        continue;
      }
      selectedConversations.add(row.conversationId);
      sourceRows.push(row);
      if (sourceRows.length >= sourceLimit) {
        break;
      }
    }

    if (sourceRows.length === 0) {
      return null;
    }

    const contextBudget = params.contextCharacterBudget ??
      DEFAULT_CONTEXT_CHARACTER_BUDGET;
    const contexts: string[] = [];
    const sources: MessageConversationKnowledgeMetadata["sources"] = [];
    let usedCharacters = 0;

    for (const [index, row] of sourceRows.entries()) {
      const expanded = await expandSeedContext(database, row);
      const remaining = contextBudget - usedCharacters;
      if (remaining <= 0) {
        break;
      }
      const excerpt = expanded.slice(0, remaining).trim();
      if (!excerpt) {
        continue;
      }
      usedCharacters += excerpt.length;
      contexts.push(
        `SOURCE ${index + 1} — ${row.title} (${row.updatedAt})\n${excerpt}`,
      );
      sources.push({
        conversationId: row.conversationId,
        title: row.title,
        updatedAt: row.updatedAt,
      });
    }

    if (contexts.length === 0) {
      return null;
    }

    return {
      context: contexts.join("\n\n"),
      metadata: {
        engine: "local-user-authored-v2",
        sources,
      },
    };
  } catch (error) {
    reportKnowledgeFailure("retrieve", error);
    return null;
  }
}

export function resetConversationKnowledgeForTests() {
  databasePromise = null;
  conversationMutationQueues.clear();
  privateConversationIds.clear();
  databaseMutationQueue = Promise.resolve();
}
