module.exports = {
  cacheDirectory: "file:///cache/",
  documentDirectory: "file:///documents/",
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({
    exists: true,
    isDirectory: false,
    size: 0,
  })),
  makeDirectoryAsync: jest.fn(async () => undefined),
  readDirectoryAsync: jest.fn(async () => []),
  readAsStringAsync: jest.fn(async () => ""),
  writeAsStringAsync: jest.fn(async () => undefined),
};
