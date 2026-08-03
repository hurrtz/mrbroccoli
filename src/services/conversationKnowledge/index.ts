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
const MIN_VECTOR_CANDIDATE_SCORE = 0.16;
const MIN_VECTOR_ONLY_SCORE = 0.42;
const MIN_HYBRID_VECTOR_SCORE = 0.24;
const STRONG_MATCH_SCORE = 0.62;
const NEAR_DUPLICATE_VECTOR_SCORE = 0.94;
const LOW_INFORMATION_QUERY_TOKENS = new Set([
  // English
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by",
  "can", "could", "did", "do", "does", "for", "from", "had", "has",
  "have", "how", "i", "if", "in", "into", "is", "it", "me", "my",
  "of", "on", "or", "our", "should", "that", "the", "their", "then",
  "there", "these", "they", "this", "to", "was", "we", "were", "what",
  "when", "where", "which", "who", "why", "will", "with", "would", "you",
  "your",
  // German
  "aber", "als", "am", "an", "auf", "aus", "bei", "das", "dein", "deine",
  "dem", "den", "der", "des", "die", "du", "ein", "eine", "einem", "einen",
  "einer", "er", "es", "für", "ich", "ihr", "im", "ist", "kann", "könnte",
  "mein", "meine", "mit", "oder", "sein", "sind", "sie", "sollte", "und",
  "unser", "von", "war", "waren", "was", "welche", "welcher", "welches",
  "wie", "wir", "wo", "warum", "zu", "zum", "zur",
  // Spanish, French, Italian, and Portuguese
  "al", "alla", "anche", "avec", "comme", "con", "da", "dans", "de", "del",
  "della", "des", "di", "du", "e", "el", "en", "et", "eu", "gli", "il",
  "in", "la", "le", "les", "lo", "ma", "mais", "me", "mi", "mon", "na",
  "nel", "no", "nos", "nous", "o", "ou", "para", "par", "per", "por",
  "pour", "que", "qui", "se", "si", "son", "su", "sur", "tu", "un", "una",
  "une", "vous", "y",
  // Russian
  "а", "без", "бы", "был", "была", "были", "быть", "в", "вы", "где", "да",
  "для", "до", "его", "ее", "если", "есть", "же", "за", "и", "из", "или",
  "как", "когда", "кто", "ли", "мне", "мы", "на", "не", "но", "о", "он",
  "она", "они", "от", "по", "почему", "с", "со", "так", "то", "у", "что",
  "это", "я",
]);

interface StoredKnowledgeRow {
  content: string;
  conversationId: string;
  id: string;
  ordinal: number;
  title: string;
  updatedAt: string;
  vector: Uint8Array;
}

interface VectorKnowledgeRow extends StoredKnowledgeRow {
  score: number;
}

interface RankedKnowledgeRow extends VectorKnowledgeRow {
  match: "strong" | "related";
  score: number;
  vectorScore: number;
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
  return getKnowledgeQueryTokens(query)
    .filter((token) => token.length >= 2)
    .slice(0, 16)
    .map((token) => `"${token.replace(/"/g, '""')}"*`)
    .join(" OR ");
}

function getKnowledgeQueryTokens(query: string) {
  return Array.from(new Set(tokenizeKnowledgeText(query))).filter(
    (token) => !LOW_INFORMATION_QUERY_TOKENS.has(token),
  );
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
  const queryTokens = getKnowledgeQueryTokens(query);
  const queryVector = createLocalKnowledgeEmbedding(
    queryTokens.join(" ") || query,
  );

  return rows
    .map((row) => ({
      ...row,
      score: compareLocalKnowledgeEmbeddings(queryVector, row.vector),
    }))
    .filter(({ score }) => score >= MIN_VECTOR_CANDIDATE_SCORE)
    .sort((left, right) => right.score - left.score)
    .slice(0, FTS_SEED_LIMIT);
}

function getLexicalEvidence(query: string, row: StoredKnowledgeRow) {
  const queryTokens = getKnowledgeQueryTokens(query);
  const preferredTokens = queryTokens.filter(
    (token) => token.length >= 4 || /^\d+$/.test(token),
  );
  const evidenceTokens = preferredTokens.length > 0
    ? preferredTokens
    : queryTokens.filter((token) => token.length >= 2);
  const rowTokens = new Set(
    tokenizeKnowledgeText(`${row.title}\n${row.content}`),
  );
  const matchedTokens = evidenceTokens.filter((token) => rowTokens.has(token));

  return {
    coverage:
      evidenceTokens.length > 0
        ? matchedTokens.length / evidenceTokens.length
        : 0,
    evidenceTokenCount: evidenceTokens.length,
    matchedTokenCount: matchedTokens.length,
  };
}

function mergeRankedSeeds(
  query: string,
  ftsRows: StoredKnowledgeRow[],
  vectorRows: VectorKnowledgeRow[],
) {
  const candidates = new Map<string, StoredKnowledgeRow>();
  const ftsIds = new Set(ftsRows.map(({ id }) => id));
  const vectorScores = new Map(
    vectorRows.map(({ id, score }) => [id, score] as const),
  );

  ftsRows.forEach((row) => candidates.set(row.id, row));
  vectorRows.forEach((row) => {
    candidates.set(row.id, row);
  });
  const queryTokens = getKnowledgeQueryTokens(query);
  const queryVector = createLocalKnowledgeEmbedding(
    queryTokens.join(" ") || query,
  );

  return [...candidates.values()]
    .flatMap((row) => {
      const vectorScore =
        vectorScores.get(row.id) ??
        compareLocalKnowledgeEmbeddings(queryVector, row.vector);
      const lexical = getLexicalEvidence(query, row);
      const requiredTokenMatches = Math.min(2, lexical.evidenceTokenCount);
      const hasExactEvidence =
        requiredTokenMatches > 0 &&
        lexical.matchedTokenCount >= requiredTokenMatches;
      const hasHybridEvidence =
        ftsIds.has(row.id) &&
        lexical.matchedTokenCount > 0 &&
        vectorScore >= MIN_HYBRID_VECTOR_SCORE;
      const hasStrongVectorEvidence = vectorScore >= MIN_VECTOR_ONLY_SCORE;

      if (
        !hasExactEvidence &&
        !hasHybridEvidence &&
        !hasStrongVectorEvidence
      ) {
        return [];
      }

      const score =
        Math.max(0, vectorScore) * 0.52 +
        lexical.coverage * 0.4 +
        (ftsIds.has(row.id) ? 0.08 : 0);
      return [
        {
          ...row,
          match:
            score >= STRONG_MATCH_SCORE &&
            (lexical.matchedTokenCount >= 2 || vectorScore >= 0.5)
              ? ("strong" as const)
              : ("related" as const),
          score,
          vectorScore,
        },
      ];
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.updatedAt.localeCompare(left.updatedAt),
    );
}

function normalizeDuplicateText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/^user\s*:\s*/u, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function areNearDuplicateRows(
  candidate: RankedKnowledgeRow,
  selected: RankedKnowledgeRow,
) {
  const candidateContent = normalizeDuplicateText(candidate.content);
  const selectedContent = normalizeDuplicateText(selected.content);
  if (candidateContent && candidateContent === selectedContent) {
    return true;
  }

  return (
    normalizeDuplicateText(candidate.title) ===
      normalizeDuplicateText(selected.title) &&
    compareLocalKnowledgeEmbeddings(candidate.vector, selected.vector) >=
      NEAR_DUPLICATE_VECTOR_SCORE
  );
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
    const selected = mergeRankedSeeds(query, ftsRows, vectorRows);
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
      if (
        sourceRows.some((selectedRow) =>
          areNearDuplicateRows(row, selectedRow),
        )
      ) {
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

    for (const row of sourceRows) {
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
        `SOURCE ${contexts.length + 1} — ${row.title} (${row.updatedAt})\n${excerpt}`,
      );
      sources.push({
        conversationId: row.conversationId,
        match: row.match,
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
        contentPolicy: "user-authored-only",
        engine: "local-user-authored-v3",
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
