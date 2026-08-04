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
        Uint8Array.from(Buffer.concat([iv, ciphertext, cipher.getAuthTag()])),
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

jest.mock("expo-file-system/legacy", () => ({
  documentDirectory: "file:///documents/",
  EncodingType: { Base64: "base64" },
  readAsStringAsync: jest.fn(async () => "aW1hZ2UtYnl0ZXM="),
}));

import {
  AppDataBackupError,
  APP_DATA_BACKUP_MAX_BYTES,
  ENCRYPTED_APP_DATA_BACKUP_MAX_BYTES,
  createAppDataBackup,
  decryptAppDataBackup,
  encryptAppDataBackup,
  isEncryptedAppDataBackup,
  parseAppDataBackup,
  serializeAppDataBackup,
} from "../../src/services/appDataBackup";
import { DEFAULT_SETTINGS, type Conversation } from "../../src/types";
import * as FileSystem from "expo-file-system/legacy";

const conversation: Conversation = {
  id: "conversation-1",
  title: "Private notes",
  createdAt: "2026-07-31T08:00:00.000Z",
  updatedAt: "2026-07-31T08:01:00.000Z",
  isPrivate: true,
  knowledgeExcludedConversationIds: ["source-conversation"],
  messages: [
    {
      id: "message-1",
      role: "user",
      content: "A private thought",
      editedAt: "2026-07-31T08:00:30.000Z",
      model: null,
      provider: null,
      timestamp: "2026-07-31T08:00:00.000Z",
    },
  ],
  artifacts: [
    {
      id: "artifact-1",
      kind: "assumption",
      text: "This is worth verifying.",
      sourceMessageId: "message-1",
      createdAt: "2026-07-31T08:01:00.000Z",
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
  it("allows encrypted envelopes to account for base64 expansion", () => {
    expect(ENCRYPTED_APP_DATA_BACKUP_MAX_BYTES).toBeGreaterThan(
      APP_DATA_BACKUP_MAX_BYTES,
    );
  });

  it("exports conversations and portable settings without credentials or diagnostics", async () => {
    const backup = await createBackup();
    const serialized = serializeAppDataBackup(backup);

    expect(backup.data.conversations).toEqual([{ conversation, pinned: true }]);
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

  it("rebases stale iOS image paths before embedding backup bytes", async () => {
    const conversationWithImage: Conversation = {
      ...conversation,
      messages: [
        {
          ...conversation.messages[0],
          attachments: [
            {
              id: "image-1",
              kind: "image",
              uri: "file:///var/mobile/Containers/Data/Application/OLD-CONTAINER/Documents/message-images/image-1.jpg",
              mimeType: "image/jpeg",
              width: 1200,
              height: 800,
              byteSize: 11,
              sharedWithProviders: ["openai"],
            },
          ],
        },
      ],
    };
    jest
      .mocked(FileSystem.readAsStringAsync)
      .mockImplementationOnce(async (uri) => {
        if (uri !== "file:///documents/message-images/image-1.jpg") {
          throw new Error("ERR_FILE_NOT_READABLE");
        }
        return "aW1hZ2UtYnl0ZXM=";
      });
    const backup = await createAppDataBackup({
      activeConversationId: conversation.id,
      appVersion: "2.7.0",
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
          pinned: false,
        },
      ],
      getConversationById: async () => conversationWithImage,
      settings: DEFAULT_SETTINGS,
    });
    const serialized = serializeAppDataBackup(backup);

    expect(serialized).not.toContain("OLD-CONTAINER");
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      "file:///documents/message-images/image-1.jpg",
      { encoding: "base64" },
    );
    expect(backup.data.conversations[0].attachments).toEqual([
      expect.objectContaining({
        id: "image-1",
        data: "aW1hZ2UtYnl0ZXM=",
      }),
    ]);
    expect(
      backup.data.conversations[0].conversation.messages[0].attachments?.[0]
        .uri,
    ).toBe("mrbroccoli-backup://image/image-1");
    expect(parseAppDataBackup(serialized)).toEqual(backup);
  });

  it("rejects oversized image backups before reading image files", async () => {
    const oversizedConversation: Conversation = {
      ...conversation,
      messages: [
        {
          ...conversation.messages[0],
          attachments: Array.from({ length: 4 }, (_, index) => ({
            id: `image-${index}`,
            kind: "image" as const,
            uri: `file:///private/message-images/image-${index}.png`,
            mimeType: "image/png" as const,
            width: 2000,
            height: 2000,
            byteSize: 12 * 1024 * 1024,
            sharedWithProviders: ["openai" as const],
          })),
        },
      ],
    };
    jest.mocked(FileSystem.readAsStringAsync).mockClear();

    await expect(
      createAppDataBackup({
        activeConversationId: conversation.id,
        appVersion: "2.7.0",
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
            pinned: false,
          },
        ],
        getConversationById: async () => oversizedConversation,
        settings: DEFAULT_SETTINGS,
      }),
    ).rejects.toMatchObject({ code: "too-large" });
    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
  });

  it("migrates readable version 1 backups without attachments", async () => {
    const backup = await createBackup();
    const legacy = {
      ...backup,
      version: 1,
      data: {
        ...backup.data,
        conversations: backup.data.conversations.map(
          ({ attachments: _attachments, ...record }) => record,
        ),
      },
    };

    expect(parseAppDataBackup(JSON.stringify(legacy))).toEqual(legacy);
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

  it("rejects saved insights whose type or source provenance is invalid", async () => {
    const backup = await createBackup();
    const invalid = {
      ...backup,
      data: {
        ...backup.data,
        conversations: [
          {
            ...backup.data.conversations[0],
            conversation: {
              ...backup.data.conversations[0].conversation,
              artifacts: [
                {
                  id: "bad-artifact",
                  kind: "fact",
                  text: "Unverified",
                  sourceMessageId: "missing-message",
                  createdAt: "2026-08-03T12:00:00.000Z",
                },
              ],
            },
          },
        ],
      },
    };

    expect(() => parseAppDataBackup(JSON.stringify(invalid))).toThrow(
      AppDataBackupError,
    );
  });
});
