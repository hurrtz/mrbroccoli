jest.mock("expo-crypto", () => {
  const nodeCrypto = require("node:crypto");

  class MockEncryptionKey {
    mockValue: Uint8Array;

    constructor(mockValue: Uint8Array) {
      this.mockValue = mockValue;
    }

    static async import(value: Uint8Array) {
      return new MockEncryptionKey(Uint8Array.from(value));
    }
  }

  class MockSealedData {
    mockValue: Uint8Array;

    constructor(mockValue: Uint8Array) {
      this.mockValue = mockValue;
    }

    static fromCombined(value: string | Uint8Array) {
      return new MockSealedData(
        typeof value === "string"
          ? Uint8Array.from(Buffer.from(value, "base64"))
          : Uint8Array.from(value),
      );
    }

    async combined(encoding?: "base64" | "bytes") {
      return encoding === "base64"
        ? Buffer.from(this.mockValue).toString("base64")
        : Uint8Array.from(this.mockValue);
    }
  }

  return {
    AESEncryptionKey: MockEncryptionKey,
    AESSealedData: MockSealedData,
    getRandomBytes: (length: number) =>
      Uint8Array.from(nodeCrypto.randomBytes(length)),
    aesEncryptAsync: async (
      plaintext: Uint8Array,
      key: MockEncryptionKey,
      options: { additionalData?: Uint8Array },
    ) => {
      const iv = nodeCrypto.randomBytes(12);
      const cipher = nodeCrypto.createCipheriv(
        "aes-256-gcm",
        Buffer.from(key.mockValue),
        iv,
      );
      if (options.additionalData) {
        cipher.setAAD(Buffer.from(options.additionalData));
      }
      const ciphertext = Buffer.concat([
        cipher.update(Buffer.from(plaintext)),
        cipher.final(),
      ]);
      return new MockSealedData(
        Uint8Array.from(
          Buffer.concat([iv, ciphertext, cipher.getAuthTag()]),
        ),
      );
    },
    aesDecryptAsync: async (
      sealed: MockSealedData,
      key: MockEncryptionKey,
      options: { additionalData?: Uint8Array },
    ) => {
      const combined = Buffer.from(sealed.mockValue);
      const iv = combined.subarray(0, 12);
      const tag = combined.subarray(combined.length - 16);
      const ciphertext = combined.subarray(12, combined.length - 16);
      const decipher = nodeCrypto.createDecipheriv(
        "aes-256-gcm",
        Buffer.from(key.mockValue),
        iv,
      );
      if (options.additionalData) {
        decipher.setAAD(Buffer.from(options.additionalData));
      }
      decipher.setAuthTag(tag);
      return Uint8Array.from(
        Buffer.concat([decipher.update(ciphertext), decipher.final()]),
      );
    },
  };
});

import {
  AppDataBackupError,
  createAppDataBackup,
  decryptAppDataBackup,
  encryptAppDataBackup,
  isEncryptedAppDataBackup,
  parseAppDataBackup,
  serializeAppDataBackup,
} from "../../src/services/appDataBackup";
import { DEFAULT_SETTINGS, type Conversation } from "../../src/types";

const conversation: Conversation = {
  id: "conversation-1",
  title: "Private notes",
  createdAt: "2026-07-31T08:00:00.000Z",
  updatedAt: "2026-07-31T08:01:00.000Z",
  isPrivate: true,
  messages: [
    {
      id: "message-1",
      role: "user",
      content: "A private thought",
      model: null,
      provider: null,
      timestamp: "2026-07-31T08:00:00.000Z",
    },
  ],
};

async function createBackup() {
  return createAppDataBackup({
    activeConversationId: conversation.id,
    appVersion: "2.6.0",
    conversationMetas: [
      {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messageCount: 1,
        providers: [],
        providerModels: {},
        lastModel: null,
        lastProvider: null,
        pinned: true,
      },
    ],
    getConversationById: async () => conversation,
    settings: {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "secret-openai-key",
      },
      providerValidationResults: {
        openai: {
          llm: {
            status: "success",
            message: "private account detail",
            model: "gpt-5.4",
          },
        },
      },
      ulraModeActive: true,
    },
  });
}

describe("appDataBackup", () => {
  it("exports conversations and portable settings without credentials or diagnostics", async () => {
    const backup = await createBackup();
    const serialized = serializeAppDataBackup(backup);

    expect(backup.data.conversations).toEqual([
      { conversation, pinned: true },
    ]);
    expect(backup.data.settings).not.toHaveProperty("apiKeys");
    expect(backup.data.settings).not.toHaveProperty(
      "providerValidationResults",
    );
    expect(backup.data.settings.ulraModeActive).toBe(false);
    expect(backup.data.conversations[0]?.conversation.isPrivate).toBe(true);
    expect(serialized).not.toContain("secret-openai-key");
    expect(serialized).not.toContain("private account detail");
    expect(parseAppDataBackup(serialized)).toEqual(backup);
  });

  it("encrypts and decrypts an authenticated backup with a passphrase", async () => {
    const backup = await createBackup();
    const encrypted = await encryptAppDataBackup(
      backup,
      "a long test passphrase",
    );

    expect(isEncryptedAppDataBackup(encrypted)).toBe(true);
    expect(encrypted).not.toContain("A private thought");
    await expect(
      decryptAppDataBackup(encrypted, "a long test passphrase"),
    ).resolves.toEqual(backup);
    await expect(
      decryptAppDataBackup(encrypted, "the wrong passphrase"),
    ).rejects.toMatchObject({
      code: "decrypt-failed",
    });
  });

  it("rejects obviously weak passphrases when creating encrypted backups", async () => {
    const backup = await createBackup();

    await expect(
      encryptAppDataBackup(backup, "aaaaaaaaaaaa"),
    ).rejects.toMatchObject({ code: "passphrase-too-weak" });
  });

  it("rejects backups that contain API key fields or duplicate conversation ids", async () => {
    const backup = await createBackup();
    const withApiKeys = {
      ...backup,
      data: {
        ...backup.data,
        settings: {
          ...backup.data.settings,
          apiKeys: { openai: "must-not-import" },
        },
      },
    };
    expect(() => parseAppDataBackup(JSON.stringify(withApiKeys))).toThrow(
      AppDataBackupError,
    );

    const duplicate = {
      ...backup,
      data: {
        ...backup.data,
        conversations: [
          ...backup.data.conversations,
          ...backup.data.conversations,
        ],
      },
    };
    expect(() => parseAppDataBackup(JSON.stringify(duplicate))).toThrow(
      AppDataBackupError,
    );
  });
});
