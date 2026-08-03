import * as SQLite from "expo-sqlite";

import {
  clearConversationKnowledgeIndex,
  removeConversationKnowledge,
  resetConversationKnowledgeForTests,
  retrieveConversationKnowledge,
  setConversationKnowledgePrivate,
  syncConversationKnowledge,
} from "../../src/services/conversationKnowledge";
import {
  compareLocalKnowledgeEmbeddings,
  createLocalKnowledgeEmbedding,
} from "../../src/services/conversationKnowledge/embedding";
import type { Conversation } from "../../src/types";

interface FakeConversationRow {
  conversationId: string;
  revision: string;
  title: string;
  updatedAt: string;
}

interface FakeChunkRow {
  content: string;
  conversationId: string;
  id: string;
  ordinal: number;
  vector: Uint8Array;
  vectorModel: string;
}

interface FakeChunkLink {
  sourceId: string;
  targetId: string;
}

const sqliteMock = SQLite as typeof SQLite & {
  __database: {
    execAsync: jest.Mock;
    getAllAsync: jest.Mock;
    getFirstAsync: jest.Mock;
    runAsync: jest.Mock;
    withTransactionAsync: jest.Mock;
    withExclusiveTransactionAsync: jest.Mock;
  };
};

function createConversation(
  id: string,
  title: string,
  userText: string,
  assistantText: string,
  isPrivate = false,
): Conversation {
  return {
    id,
    title,
    createdAt: "2026-08-01T08:00:00.000Z",
    updatedAt: "2026-08-01T08:10:00.000Z",
    isPrivate,
    messages: [
      {
        id: `${id}-user`,
        role: "user",
        content: userText,
        model: null,
        provider: null,
        timestamp: "2026-08-01T08:00:00.000Z",
      },
      {
        id: `${id}-assistant`,
        role: "assistant",
        content: assistantText,
        model: "test-model",
        provider: "openai",
        timestamp: "2026-08-01T08:10:00.000Z",
      },
    ],
  };
}

describe("conversation knowledge", () => {
  let conversations: FakeConversationRow[];
  let chunks: FakeChunkRow[];
  let links: FakeChunkLink[];

  beforeEach(() => {
    conversations = [];
    chunks = [];
    links = [];
    resetConversationKnowledgeForTests();
    jest.clearAllMocks();

    sqliteMock.__database.withExclusiveTransactionAsync.mockImplementation(
      async (operation: (database: typeof sqliteMock.__database) => unknown) =>
        operation(sqliteMock.__database),
    );
    sqliteMock.__database.withTransactionAsync.mockImplementation(
      async (operation: (database: typeof sqliteMock.__database) => unknown) =>
        operation(sqliteMock.__database),
    );
    sqliteMock.__database.runAsync.mockImplementation(
      async (sql: string, ...parameters: unknown[]) => {
        const normalized = sql.replace(/\s+/g, " ").trim();

        if (normalized.startsWith("DELETE FROM knowledge_chunks_fts")) {
          if (parameters.length === 0) {
            return { changes: chunks.length };
          }
          return { changes: 0 };
        }
        if (normalized.startsWith("DELETE FROM knowledge_conversations")) {
          if (parameters.length === 0) {
            const changes = conversations.length;
            conversations = [];
            chunks = [];
            links = [];
            return { changes };
          }
          const conversationId = String(parameters[0]);
          conversations = conversations.filter(
            (row) => row.conversationId !== conversationId,
          );
          chunks = chunks.filter(
            (row) => row.conversationId !== conversationId,
          );
          const retainedChunkIds = new Set(chunks.map(({ id }) => id));
          links = links.filter(
            ({ sourceId, targetId }) =>
              retainedChunkIds.has(sourceId) && retainedChunkIds.has(targetId),
          );
          return { changes: 1 };
        }
        if (normalized.startsWith("INSERT INTO knowledge_conversations")) {
          conversations.push({
            conversationId: String(parameters[0]),
            title: String(parameters[1]),
            updatedAt: String(parameters[2]),
            revision: String(parameters[3]),
          });
          return { changes: 1 };
        }
        if (normalized.startsWith("INSERT INTO knowledge_chunks ")) {
          chunks.push({
            id: String(parameters[0]),
            conversationId: String(parameters[1]),
            ordinal: Number(parameters[2]),
            content: String(parameters[3]),
            vector: parameters[4] as Uint8Array,
            vectorModel: String(parameters[5]),
          });
          return { changes: 1 };
        }
        if (normalized.startsWith("INSERT INTO knowledge_chunk_links")) {
          links.push(
            {
              sourceId: String(parameters[0]),
              targetId: String(parameters[1]),
            },
            {
              sourceId: String(parameters[2]),
              targetId: String(parameters[3]),
            },
          );
          return { changes: 2 };
        }
        return { changes: 1 };
      },
    );
    sqliteMock.__database.getFirstAsync.mockImplementation(
      async (_sql: string, conversationId: string) => {
        const row = conversations.find(
          (candidate) => candidate.conversationId === conversationId,
        );
        return row ? { revision: row.revision } : null;
      },
    );
    sqliteMock.__database.getAllAsync.mockImplementation(
      async (sql: string, ...parameters: unknown[]) => {
        const excludedIds = new Set(parameters.slice(1).map(String));
        const toStoredRow = (chunk: FakeChunkRow) => {
          const conversation = conversations.find(
            (candidate) => candidate.conversationId === chunk.conversationId,
          );
          return {
            ...chunk,
            title: conversation?.title ?? "",
            updatedAt: conversation?.updatedAt ?? "",
          };
        };

        if (sql.includes("bm25(knowledge_chunks_fts)")) {
          const terms: string[] = Array.from(
            String(parameters[0]).match(/[\p{L}\p{N}]+/gu) ?? [],
          );
          return chunks
            .filter((chunk) => !excludedIds.has(chunk.conversationId))
            .filter((chunk) =>
              terms.some((term) =>
                chunk.content.toLocaleLowerCase().includes(term.toLocaleLowerCase()),
              ),
            )
            .map((chunk, rank) => ({ ...toStoredRow(chunk), rank }));
        }
        if (sql.includes("chunks.vector_model = ?")) {
          return chunks
            .filter((chunk) => chunk.vectorModel === parameters[0])
            .filter((chunk) => !excludedIds.has(chunk.conversationId))
            .map(toStoredRow);
        }
        if (sql.includes("knowledge_chunk_links")) {
          const seedId = String(parameters[0]);
          const neighborIds = new Set(
            links
              .filter(({ sourceId }) => sourceId === seedId)
              .map(({ targetId }) => targetId),
          );
          return chunks
            .filter(
              (chunk) => chunk.id === seedId || neighborIds.has(chunk.id),
            )
            .sort((left, right) => left.ordinal - right.ordinal)
            .map(({ content, ordinal }) => ({ content, ordinal }));
        }
        return [];
      },
    );
  });

  it("creates useful low-power embeddings without treating unrelated text as equivalent", () => {
    const gardening = createLocalKnowledgeEmbedding(
      "Tomaten im Berliner Garten regelmäßig gießen",
    );
    const related = createLocalKnowledgeEmbedding(
      "Berliner Tomaten brauchen Wasser im Garten",
    );
    const unrelated = createLocalKnowledgeEmbedding(
      "JavaScript build pipeline and release signing",
    );

    expect(compareLocalKnowledgeEmbeddings(gardening, related)).toBeGreaterThan(
      compareLocalKnowledgeEmbeddings(gardening, unrelated),
    );
  });

  it("serializes writes from different conversations on the shared database", async () => {
    let activeTransactions = 0;
    let maximumActiveTransactions = 0;
    sqliteMock.__database.withTransactionAsync.mockImplementation(
      async (operation: (database: typeof sqliteMock.__database) => unknown) => {
        activeTransactions += 1;
        maximumActiveTransactions = Math.max(
          maximumActiveTransactions,
          activeTransactions,
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
        try {
          return await operation(sqliteMock.__database);
        } finally {
          activeTransactions -= 1;
        }
      },
    );

    await Promise.all([
      syncConversationKnowledge(
        createConversation("first", "First", "alpha", "one"),
        true,
      ),
      syncConversationKnowledge(
        createConversation("second", "Second", "beta", "two"),
        true,
      ),
    ]);

    expect(maximumActiveTransactions).toBe(1);
  });

  it("keeps FTS mutations on the retained database connection", async () => {
    const conversation = createConversation(
      "garden",
      "Garden",
      "How often should I water tomatoes?",
      "Water them in the morning.",
    );

    await syncConversationKnowledge(conversation, true);
    await removeConversationKnowledge(conversation.id);
    await clearConversationKnowledgeIndex();

    expect(sqliteMock.__database.withTransactionAsync).toHaveBeenCalledTimes(3);
    expect(
      sqliteMock.__database.withExclusiveTransactionAsync,
    ).not.toHaveBeenCalled();
  });

  it("indexes user-authored history without promoting assistant output to knowledge", async () => {
    const conversation = createConversation(
      "derived",
      "Derived answer",
      "Which earlier decisions should I revisit?",
      "Session E established the confidential launch assumption.",
    );
    conversation.messages[1].metadata = {
      conversationKnowledge: {
        engine: "local-hybrid-v1",
        sources: [
          {
            conversationId: "session-e",
            title: "Session E",
            updatedAt: "2026-07-31T10:00:00.000Z",
          },
        ],
      },
    };

    await syncConversationKnowledge(conversation, true);

    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.content).toBe(
      "User: Which earlier decisions should I revisit?",
    );
    expect(chunks[0]?.content).not.toContain("confidential launch assumption");
  });

  it("retrieves local sources while excluding the current and private conversations", async () => {
    const garden = createConversation(
      "garden",
      "Berlin balcony garden",
      "How often should I water the tomatoes?",
      "Water the tomatoes in the morning.",
    );
    const privatePlan = createConversation(
      "private-plan",
      "Private plan",
      "The secret tomato supplier is Acme.",
      "Keep that confidential.",
      true,
    );
    const current = createConversation(
      "current",
      "Current session",
      "More about tomatoes",
      "Current answer",
    );
    garden.messages.push(
      {
        id: "garden-user-2",
        role: "user",
        content: "What should I check next?",
        model: null,
        provider: null,
        timestamp: "2026-08-01T08:11:00.000Z",
      },
      {
        id: "garden-assistant-2",
        role: "assistant",
        content: "Check the neighboring soil before watering again.",
        model: "test-model",
        provider: "openai",
        timestamp: "2026-08-01T08:12:00.000Z",
      },
    );

    await syncConversationKnowledge(garden, true);
    await syncConversationKnowledge(privatePlan, true);
    await syncConversationKnowledge(current, true);
    const result = await retrieveConversationKnowledge({
      currentConversationId: current.id,
      privateConversationIds: [privatePlan.id],
      query: "When should I water my Berlin tomatoes?",
    });

    expect(result?.metadata.sources).toEqual([
      expect.objectContaining({ conversationId: garden.id }),
    ]);
    expect(result?.metadata.engine).toBe("local-user-authored-v3");
    expect(result?.metadata.contentPolicy).toBe("user-authored-only");
    expect(result?.metadata.sources[0]?.match).toBe("strong");
    expect(result?.context).toContain("How often should I water the tomatoes?");
    expect(result?.context).toContain("What should I check next?");
    expect(result?.context).not.toContain("Water the tomatoes in the morning");
    expect(result?.context).not.toContain(
      "Check the neighboring soil before watering again",
    );
    expect(result?.context).not.toContain("secret tomato supplier");
    expect(result?.context).not.toContain("Current answer");
  });

  it("abstains when retrieval finds only an incidental low-confidence word", async () => {
    await syncConversationKnowledge(
      createConversation(
        "recipes",
        "Quick recipes",
        "The app can save a broccoli soup recipe.",
        "Saved.",
      ),
      true,
    );

    await expect(
      retrieveConversationKnowledge({
        query: "What is the train schedule in Madrid?",
      }),
    ).resolves.toBeNull();
  });

  it("suppresses duplicate sources imported as separate conversations", async () => {
    const original = createConversation(
      "roadmap-original",
      "Product roadmap",
      "The offline onboarding should choose one language and one model profile.",
      "Understood.",
    );
    const importedCopy = createConversation(
      "roadmap-copy",
      "Product roadmap",
      "The offline onboarding should choose one language and one model profile.",
      "Understood.",
    );
    importedCopy.updatedAt = "2026-08-02T08:10:00.000Z";

    await syncConversationKnowledge(original, true);
    await syncConversationKnowledge(importedCopy, true);
    const result = await retrieveConversationKnowledge({
      query: "Which language and model profile should offline onboarding choose?",
    });

    expect(result?.metadata.sources).toHaveLength(1);
    expect(result?.metadata.sources[0]?.conversationId).toBe("roadmap-copy");
  });

  it("deletes indexed rows when a conversation becomes private or knowledge is disabled", async () => {
    const garden = createConversation(
      "garden",
      "Garden",
      "Remember the tomato schedule",
      "Every morning",
    );
    await syncConversationKnowledge(garden, true);
    expect(chunks).toHaveLength(1);

    await setConversationKnowledgePrivate(garden.id, true);
    expect(chunks).toHaveLength(0);
    await expect(
      retrieveConversationKnowledge({ query: "tomato schedule" }),
    ).resolves.toBeNull();

    await setConversationKnowledgePrivate(garden.id, false);
    await syncConversationKnowledge(garden, true);
    expect(chunks).toHaveLength(1);
    await clearConversationKnowledgeIndex();
    expect(chunks).toHaveLength(0);
    await removeConversationKnowledge(garden.id);
  });
});
