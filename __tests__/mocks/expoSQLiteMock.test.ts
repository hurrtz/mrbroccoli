import * as SQLite from "expo-sqlite";

// The expo-sqlite mock is test infrastructure the conversation store depends
// on for its correctness claims. Its predecessor answered every read with `[]`
// and every write with `{ changes: 0 }`, which let suites pass without
// exercising a single statement.
//
// These tests assert the mock really executes SQL. Without them, a future
// regression in the mock would silently hollow out every suite built on it,
// and those suites would keep reporting green.
const sqliteMock = SQLite as typeof SQLite & { __reset: () => void };

async function openDatabase() {
  return SQLite.openDatabaseAsync("expo-sqlite-mock.test.db");
}

describe("expo-sqlite mock", () => {
  beforeEach(() => {
    sqliteMock.__reset();
  });

  it("executes real SQL rather than returning canned values", async () => {
    const database = await openDatabase();
    await database.execAsync(
      "CREATE TABLE widgets (id TEXT PRIMARY KEY NOT NULL, label TEXT NOT NULL)",
    );
    await database.runAsync("INSERT INTO widgets VALUES (?, ?)", "a", "first");
    await database.runAsync("INSERT INTO widgets VALUES (?, ?)", "b", "second");

    const rows = await database.getAllAsync<{ id: string; label: string }>(
      "SELECT id, label FROM widgets ORDER BY id",
    );

    expect(rows).toEqual([
      { id: "a", label: "first" },
      { id: "b", label: "second" },
    ]);
  });

  it("reports the rows a write actually changed", async () => {
    const database = await openDatabase();
    await database.execAsync("CREATE TABLE widgets (id TEXT PRIMARY KEY NOT NULL)");
    await database.runAsync("INSERT INTO widgets VALUES ('a')");

    const deleted = await database.runAsync(
      "DELETE FROM widgets WHERE id = ?",
      "a",
    );
    const missing = await database.runAsync(
      "DELETE FROM widgets WHERE id = ?",
      "absent",
    );

    expect(deleted.changes).toBe(1);
    expect(missing.changes).toBe(0);
  });

  it("binds booleans as integers the way expo-sqlite does", async () => {
    // node:sqlite rejects booleans outright. expo-sqlite accepts them and
    // stores 0/1, so the mock coerces -- otherwise a value that works on
    // device would throw only in tests.
    const database = await openDatabase();
    await database.execAsync(
      "CREATE TABLE flags (id TEXT PRIMARY KEY NOT NULL, is_private INTEGER NOT NULL)",
    );

    await database.runAsync("INSERT INTO flags VALUES (?, ?)", "a", true);
    await database.runAsync("INSERT INTO flags VALUES (?, ?)", "b", false);

    const rows = await database.getAllAsync<{ id: string; is_private: number }>(
      "SELECT id, is_private FROM flags ORDER BY id",
    );

    expect(rows).toEqual([
      { id: "a", is_private: 1 },
      { id: "b", is_private: 0 },
    ]);
  });

  it("treats undefined as null", async () => {
    const database = await openDatabase();
    await database.execAsync("CREATE TABLE notes (id TEXT, body TEXT)");

    await database.runAsync(
      "INSERT INTO notes VALUES (?, ?)",
      "a",
      undefined as unknown as string,
    );

    const row = await database.getFirstAsync<{ body: string | null }>(
      "SELECT body FROM notes WHERE id = 'a'",
    );

    expect(row?.body).toBeNull();
  });

  it("returns null from getFirstAsync when nothing matches", async () => {
    const database = await openDatabase();
    await database.execAsync("CREATE TABLE notes (id TEXT)");

    await expect(
      database.getFirstAsync("SELECT id FROM notes WHERE id = 'absent'"),
    ).resolves.toBeNull();
  });

  it("rolls a failed transaction back so no partial write survives", async () => {
    // This is the property the conversation store migration depends on: a
    // half-applied branch or restore must never be observable.
    const database = await openDatabase();
    await database.execAsync("CREATE TABLE widgets (id TEXT PRIMARY KEY NOT NULL)");
    await database.runAsync("INSERT INTO widgets VALUES ('existing')");

    await expect(
      database.withTransactionAsync(async () => {
        await database.runAsync("INSERT INTO widgets VALUES ('added')");
        throw new Error("interrupted");
      }),
    ).rejects.toThrow("interrupted");

    const rows = await database.getAllAsync<{ id: string }>(
      "SELECT id FROM widgets",
    );
    expect(rows).toEqual([{ id: "existing" }]);
  });

  it("commits a transaction that completes", async () => {
    const database = await openDatabase();
    await database.execAsync("CREATE TABLE widgets (id TEXT PRIMARY KEY NOT NULL)");

    await database.withTransactionAsync(async () => {
      await database.runAsync("INSERT INTO widgets VALUES ('a')");
      await database.runAsync("INSERT INTO widgets VALUES ('b')");
    });

    const rows = await database.getAllAsync<{ id: string }>(
      "SELECT id FROM widgets ORDER BY id",
    );
    expect(rows).toEqual([{ id: "a" }, { id: "b" }]);
  });

  it("enforces foreign keys and cascades deletes when asked to", async () => {
    // The conversation schema leans on ON DELETE CASCADE to remove a
    // conversation's messages, so the pragma has to be honoured here too.
    const database = await openDatabase();
    await database.execAsync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE conversations (id TEXT PRIMARY KEY NOT NULL);
      CREATE TABLE messages (
        id TEXT PRIMARY KEY NOT NULL,
        conversation_id TEXT NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      );
    `);
    await database.runAsync("INSERT INTO conversations VALUES ('c1')");
    await database.runAsync("INSERT INTO messages VALUES ('m1', 'c1')");

    await database.runAsync("DELETE FROM conversations WHERE id = 'c1'");

    const rows = await database.getAllAsync("SELECT id FROM messages");
    expect(rows).toEqual([]);
  });

  it("round-trips binary values as Uint8Array", async () => {
    // The knowledge index stores embedding vectors as BLOBs.
    const database = await openDatabase();
    await database.execAsync("CREATE TABLE vectors (id TEXT, vector BLOB)");
    const vector = new Uint8Array([0, 127, 255]);

    await database.runAsync("INSERT INTO vectors VALUES (?, ?)", "a", vector);

    const row = await database.getFirstAsync<{ vector: Uint8Array }>(
      "SELECT vector FROM vectors WHERE id = 'a'",
    );

    expect(row?.vector).toBeInstanceOf(Uint8Array);
    expect(Array.from(row?.vector ?? [])).toEqual([0, 127, 255]);
  });

  it("accepts bind parameters as a single array", async () => {
    const database = await openDatabase();
    await database.execAsync("CREATE TABLE widgets (id TEXT, label TEXT)");

    await database.runAsync("INSERT INTO widgets VALUES (?, ?)", ["a", "first"]);

    const row = await database.getFirstAsync<{ label: string }>(
      "SELECT label FROM widgets WHERE id = ?",
      ["a"],
    );
    expect(row?.label).toBe("first");
  });

  it("starts each suite from an empty store after __reset", async () => {
    const database = await openDatabase();
    await database.execAsync("CREATE TABLE widgets (id TEXT)");
    await database.runAsync("INSERT INTO widgets VALUES ('a')");

    sqliteMock.__reset();

    const reopened = await openDatabase();
    await expect(
      reopened.getAllAsync("SELECT name FROM sqlite_master WHERE type = 'table'"),
    ).resolves.toEqual([]);
  });
});
