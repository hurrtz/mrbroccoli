// Real SQLite for tests, standing in for expo-sqlite.
//
// The previous stub answered every query with `[]` and every write with
// `{ changes: 0 }`. That was survivable while SQLite only held the derived
// knowledge index, but conversations are authoritative: a suite asserting
// against a stub would stay green while the store did nothing.
//
// `node:sqlite` ships with Node 22 (CI pins 22) and supports FTS5 and WAL, so
// no native dependency is needed. Its API is synchronous; expo-sqlite's is
// async, so every method here is a thin async wrapper.
//
// Each method is a `jest.fn` wrapping the real implementation. Callers get
// working SQL by default, and a suite that prefers hand-built fixtures can
// still override any single method with `mockImplementation` --
// `conversationKnowledge.test.ts` does exactly that.
const { DatabaseSync } = require("node:sqlite");

// One database backs every name. The app opens two files (conversations and
// the knowledge index) whose table names do not collide, and a single shared
// object keeps `__database` a stable identity for suites that reach for it.
// Consequence: a test cannot assert that dropping one file leaves the other
// intact. That separation is enforced by the app opening distinct filenames,
// which is verified on device rather than here.
let connection = new DatabaseSync(":memory:");

// expo-sqlite accepts booleans and binds them as integers; node:sqlite throws
// on them. Coercing here keeps the mock faithful to the device, so a value
// that works in production is never rejected in a test.
function normalizeBindValue(value) {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (value === undefined) {
    return null;
  }
  return value;
}

// expo-sqlite takes bind parameters either spread or as a single array.
function normalizeParams(params) {
  if (params.length === 1 && Array.isArray(params[0])) {
    return params[0].map(normalizeBindValue);
  }
  // A lone plain object is a named-parameter map; pass it through untouched.
  if (
    params.length === 1 &&
    params[0] !== null &&
    typeof params[0] === "object" &&
    !ArrayBuffer.isView(params[0])
  ) {
    return params;
  }
  return params.map(normalizeBindValue);
}

async function runTransaction(begin, task) {
  connection.exec(begin);
  try {
    const result = await task(database);
    connection.exec("COMMIT");
    return result;
  } catch (error) {
    connection.exec("ROLLBACK");
    throw error;
  }
}

const database = {
  execAsync: jest.fn(async (sql) => {
    connection.exec(sql);
  }),

  getAllAsync: jest.fn(async (sql, ...params) =>
    connection.prepare(sql).all(...normalizeParams(params)),
  ),

  getFirstAsync: jest.fn(
    async (sql, ...params) =>
      connection.prepare(sql).get(...normalizeParams(params)) ?? null,
  ),

  runAsync: jest.fn(async (sql, ...params) => {
    const result = connection.prepare(sql).run(...normalizeParams(params));
    return {
      changes: Number(result.changes),
      // node:sqlite reports `lastInsertRowid`; expo-sqlite `lastInsertRowId`.
      lastInsertRowId: Number(result.lastInsertRowid),
    };
  }),

  withTransactionAsync: jest.fn((task) => runTransaction("BEGIN", task)),

  withExclusiveTransactionAsync: jest.fn((task) =>
    runTransaction("BEGIN EXCLUSIVE", task),
  ),

  closeAsync: jest.fn(async () => {
    // Closing is a no-op: the shared connection outlives individual suites and
    // is replaced wholesale by `__reset`.
  }),
};

module.exports = {
  openDatabaseAsync: jest.fn(() => Promise.resolve(database)),
  deleteDatabaseAsync: jest.fn(() => Promise.resolve()),
  __database: database,
  // Drops every table so a suite can start from an empty store.
  __reset: () => {
    connection.close();
    connection = new DatabaseSync(":memory:");
  },
};
