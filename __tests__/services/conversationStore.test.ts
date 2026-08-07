import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

import {
  persistActiveConversationId,
  persistConversationMeta,
  readActiveConversationId,
  readConversation,
  readStoredConversationMetas,
  removeConversation,
  resetConversationStorageForTests,
  saveConversation,
} from "../../src/hooks/conversations/storage";
import { buildConversationMetaFromConversation } from "../../src/hooks/conversations/meta";
import {
  getConversationDatabase,
  runInConversationTransaction,
} from "../../src/services/conversationStore";
import {
  LEGACY_ACTIVE_CONVERSATION_KEY,
  LEGACY_META_KEY,
  legacyConversationKey,
  migrateConversationsFromAsyncStorage,
} from "../../src/services/conversationStore/migration";
import type { Conversation, ConversationMeta } from "../../src/types";

// Imported the same way application code imports it. `jest.requireMock` would
// return a second copy of the mock with its own database, and resetting that
// copy would leave this suite's rows in place.
const sqliteMock = SQLite as unknown as { __reset: () => void };

function createConversation(
  id: string,
  overrides: Partial<Conversation> = {},
): Conversation {
  return {
    id,
    title: `Conversation ${id}`,
    createdAt: "2026-08-01T08:00:00.000Z",
    updatedAt: "2026-08-01T08:10:00.000Z",
    messages: [
      {
        id: `${id}-user`,
        role: "user",
        content: "How does the store work?",
        model: null,
        provider: null,
        timestamp: "2026-08-01T08:00:00.000Z",
      },
      {
        id: `${id}-assistant`,
        role: "assistant",
        content: "It keeps conversations in SQLite.",
        model: "gpt-5.6-sol",
        provider: "openai",
        timestamp: "2026-08-01T08:10:00.000Z",
      },
    ],
    ...overrides,
  };
}

async function seedLegacyConversations(conversations: Conversation[]) {
  const metas = conversations.map((conversation) =>
    buildConversationMetaFromConversation(conversation),
  );
  await AsyncStorage.multiSet([
    [LEGACY_META_KEY, JSON.stringify(metas)],
    ...conversations.map(
      (conversation) =>
        [
          legacyConversationKey(conversation.id),
          JSON.stringify(conversation),
        ] as const,
    ),
  ]);
  return metas;
}

describe("conversation store", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    sqliteMock.__reset();
    resetConversationStorageForTests();
  });

  describe("persistence", () => {
    it("round-trips a conversation through SQLite", async () => {
      const conversation = createConversation("c1");

      await saveConversation(conversation);

      await expect(readConversation("c1")).resolves.toEqual(conversation);
    });

    it("returns null for a conversation that was never stored", async () => {
      await expect(readConversation("absent")).resolves.toBeNull();
    });

    it("derives the metadata list from stored conversations", async () => {
      await saveConversation(createConversation("c1"));

      const metas = await readStoredConversationMetas();

      expect(metas).toHaveLength(1);
      expect(metas[0]).toMatchObject({
        id: "c1",
        messageCount: 2,
        lastProvider: "openai",
        providers: ["openai"],
      });
    });

    it("removes a conversation and its metadata in one step", async () => {
      // Deleting used to touch two AsyncStorage keys, so a crash between them
      // left metadata pointing at a record that no longer existed.
      await saveConversation(createConversation("c1"));

      await removeConversation("c1");

      await expect(readConversation("c1")).resolves.toBeNull();
      await expect(readStoredConversationMetas()).resolves.toEqual([]);
    });

    it("keeps pinned state when the conversation is saved again", async () => {
      const conversation = createConversation("c1");
      await saveConversation(conversation);
      persistConversationMeta([
        { ...buildConversationMetaFromConversation(conversation), pinned: true },
      ]);

      await saveConversation({ ...conversation, title: "Renamed" });

      const [meta] = await readStoredConversationMetas();
      expect(meta.pinned).toBe(true);
    });

    it("does not delete conversations missing from a metadata update", async () => {
      // Callers pass filtered in-memory lists. Treating an omission as a delete
      // would let a drawer filter destroy conversations.
      await saveConversation(createConversation("c1"));
      await saveConversation(createConversation("c2"));

      persistConversationMeta([buildConversationMetaFromConversation(createConversation("c1"))]);
      await new Promise((resolve) => setImmediate(resolve));

      const metas = await readStoredConversationMetas();
      expect(metas.map((meta) => meta.id).sort()).toEqual(["c1", "c2"]);
    });

    it("orders pinned conversations ahead of recent ones", async () => {
      const older = createConversation("older", {
        updatedAt: "2026-08-01T08:00:00.000Z",
      });
      const newer = createConversation("newer", {
        updatedAt: "2026-08-02T08:00:00.000Z",
      });
      await saveConversation(older);
      await saveConversation(newer);

      persistConversationMeta([
        { ...buildConversationMetaFromConversation(older), pinned: true },
        buildConversationMetaFromConversation(newer),
      ]);
      await new Promise((resolve) => setImmediate(resolve));

      const metas = await readStoredConversationMetas();
      expect(metas.map((meta) => meta.id)).toEqual(["older", "newer"]);
    });

    it("stores and clears the active conversation id", async () => {
      await persistActiveConversationId("c1");
      await expect(readActiveConversationId()).resolves.toBe("c1");

      await persistActiveConversationId(null);
      await expect(readActiveConversationId()).resolves.toBeNull();
    });
  });

  describe("transactions", () => {
    it("leaves no partial write behind when a transaction fails", async () => {
      await saveConversation(createConversation("existing"));

      await expect(
        runInConversationTransaction(async (database) => {
          await database.runAsync(
            `INSERT INTO conversations (id, document, meta, updated_at, pinned)
             VALUES ('added', '{}', '{}', '2026-08-01T08:00:00.000Z', 0)`,
          );
          throw new Error("interrupted");
        }),
      ).rejects.toThrow("interrupted");

      const metas = await readStoredConversationMetas();
      expect(metas.map((meta) => meta.id)).toEqual(["existing"]);
    });
  });

  describe("migration from AsyncStorage", () => {
    it("imports conversations and the active id on first read", async () => {
      await seedLegacyConversations([
        createConversation("c1"),
        createConversation("c2"),
      ]);
      await AsyncStorage.setItem(LEGACY_ACTIVE_CONVERSATION_KEY, "c2");

      const metas = await readStoredConversationMetas();

      expect(metas.map((meta) => meta.id).sort()).toEqual(["c1", "c2"]);
      await expect(readActiveConversationId()).resolves.toBe("c2");
      await expect(readConversation("c1")).resolves.toMatchObject({ id: "c1" });
    });

    it("runs once and reports it was already migrated on a later call", async () => {
      await seedLegacyConversations([createConversation("c1")]);

      const first = await migrateConversationsFromAsyncStorage();
      const second = await migrateConversationsFromAsyncStorage();

      expect(first).toMatchObject({ migrated: 1, alreadyMigrated: false });
      expect(second).toMatchObject({ migrated: 0, alreadyMigrated: true });
    });

    it("does not resurrect a conversation deleted after migration", async () => {
      // The marker has to survive independently of the rows, or a delete would
      // be undone by the next launch re-importing the legacy record.
      await seedLegacyConversations([createConversation("c1")]);
      await readStoredConversationMetas();

      await removeConversation("c1");
      resetConversationStorageForTests();

      await expect(readStoredConversationMetas()).resolves.toEqual([]);
    });

    it("leaves the legacy keys in place as a recovery path", async () => {
      await seedLegacyConversations([createConversation("c1")]);

      await migrateConversationsFromAsyncStorage();

      await expect(AsyncStorage.getItem(LEGACY_META_KEY)).resolves.not.toBeNull();
      await expect(
        AsyncStorage.getItem(legacyConversationKey("c1")),
      ).resolves.not.toBeNull();
    });

    it("skips metadata whose conversation record is missing", async () => {
      const metas = [
        buildConversationMetaFromConversation(createConversation("present")),
        buildConversationMetaFromConversation(createConversation("ghost")),
      ] satisfies ConversationMeta[];
      await AsyncStorage.multiSet([
        [LEGACY_META_KEY, JSON.stringify(metas)],
        [
          legacyConversationKey("present"),
          JSON.stringify(createConversation("present")),
        ],
      ]);

      const result = await migrateConversationsFromAsyncStorage();

      expect(result).toMatchObject({ migrated: 1, skipped: 1 });
      await expect(readStoredConversationMetas()).resolves.toHaveLength(1);
    });

    it("preserves a record that cannot be parsed rather than dropping it", async () => {
      // Documents move as raw strings. Re-serializing would quietly rewrite or
      // reject data the previous store accepted.
      const [meta] = await seedLegacyConversations([createConversation("c1")]);
      await AsyncStorage.setItem(legacyConversationKey("c1"), "{ not json");

      await migrateConversationsFromAsyncStorage();

      const database = await getConversationDatabase();
      const row = await database.getFirstAsync<{ document: string }>(
        "SELECT document FROM conversations WHERE id = ?",
        meta.id,
      );
      expect(row?.document).toBe("{ not json");
    });

    it("completes cleanly when there is nothing to migrate", async () => {
      const result = await migrateConversationsFromAsyncStorage();

      expect(result).toMatchObject({ migrated: 0, skipped: 0 });
      await expect(readStoredConversationMetas()).resolves.toEqual([]);
    });
  });
});
