const database = {
  execAsync: jest.fn(() => Promise.resolve()),
  getAllAsync: jest.fn(() => Promise.resolve([])),
  getFirstAsync: jest.fn(() => Promise.resolve(null)),
  runAsync: jest.fn(() => Promise.resolve({ changes: 0, lastInsertRowId: 0 })),
  withTransactionAsync: jest.fn(async (operation) => operation(database)),
  withExclusiveTransactionAsync: jest.fn(async (operation) => operation(database)),
};

module.exports = {
  openDatabaseAsync: jest.fn(() => Promise.resolve(database)),
  __database: database,
};
