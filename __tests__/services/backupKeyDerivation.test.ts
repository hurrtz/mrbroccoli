jest.mock("@noble/hashes/pbkdf2", () => ({
  pbkdf2Async: jest.fn(),
}));

describe("backupKeyDerivation", () => {
  afterEach(() => {
    const { NativeModules } = require("react-native");
    delete NativeModules.MrBroccoliBackupCrypto;
    jest.resetModules();
  });

  it("uses the native background PBKDF2 module with normalized input", async () => {
    const pbkdf2Sha256 = jest.fn(async () =>
      Buffer.from([1, 2, 3, 4]).toString("base64"),
    );
    const { NativeModules } = require("react-native");
    NativeModules.MrBroccoliBackupCrypto = { pbkdf2Sha256 };

    const { deriveBackupKeyBytes } = require(
      "../../src/services/backupKeyDerivation"
    ) as typeof import("../../src/services/backupKeyDerivation");
    const result = await deriveBackupKeyBytes({
      iterations: 310_000,
      keyLength: 32,
      passphrase: "\u212b safe passphrase",
      salt: Uint8Array.from([5, 6, 7]),
    });

    expect(pbkdf2Sha256).toHaveBeenCalledWith(
      "Å safe passphrase",
      Buffer.from([5, 6, 7]).toString("base64"),
      310_000,
      32,
    );
    expect(Array.from(result)).toEqual([1, 2, 3, 4]);
    const { pbkdf2Async } = require("@noble/hashes/pbkdf2");
    expect(pbkdf2Async).not.toHaveBeenCalled();
  });
});
