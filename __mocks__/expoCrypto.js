class MockEncryptionKey {
  static async import() {
    return new MockEncryptionKey();
  }
}

class MockSealedData {
  static fromCombined() {
    return new MockSealedData();
  }

  async combined() {
    return "";
  }
}

module.exports = {
  AESEncryptionKey: MockEncryptionKey,
  AESSealedData: MockSealedData,
  aesDecryptAsync: jest.fn(),
  aesEncryptAsync: jest.fn(async () => new MockSealedData()),
  getRandomBytes: jest.fn((length) => new Uint8Array(length)),
  randomUUID: jest.fn(() => "mock-image-uuid"),
};
