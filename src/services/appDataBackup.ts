import {
  AESEncryptionKey,
  AESSealedData,
  aesDecryptAsync,
  aesEncryptAsync,
  getRandomBytes,
} from "expo-crypto";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToUtf8, utf8ToBytes } from "@noble/hashes/utils";

import type {
  Conversation,
  ConversationMeta,
  Settings,
} from "../types";

export const APP_DATA_BACKUP_FORMAT = "mrbroccoli-app-data";
export const APP_DATA_BACKUP_VERSION = 1;
export const ENCRYPTED_APP_DATA_BACKUP_FORMAT =
  "mrbroccoli-app-data-encrypted";
export const APP_DATA_BACKUP_MAX_BYTES = 50 * 1024 * 1024;
export const APP_DATA_BACKUP_MIN_PASSPHRASE_LENGTH = 12;

const PBKDF2_ITERATIONS = 310_000;
const PBKDF2_SALT_BYTES = 16;
const AES_KEY_BYTES = 32;
const AES_IV_BYTES = 12;
const AES_TAG_BYTES = 16;
const ENCRYPTION_AAD = utf8ToBytes(
  `${ENCRYPTED_APP_DATA_BACKUP_FORMAT}:${APP_DATA_BACKUP_VERSION}`,
);

export type PortableSettings = Omit<
  Settings,
  "apiKeys" | "providerValidationResults"
>;

export interface AppDataBackupConversation {
  conversation: Conversation;
  pinned: boolean;
}

export interface AppDataBackup {
  appVersion: string;
  data: {
    activeConversationId: string | null;
    conversations: AppDataBackupConversation[];
    settings: PortableSettings;
  };
  exportedAt: string;
  format: typeof APP_DATA_BACKUP_FORMAT;
  version: typeof APP_DATA_BACKUP_VERSION;
}

export interface EncryptedAppDataBackup {
  cipher: {
    combined: string;
    ivBytes: typeof AES_IV_BYTES;
    name: "aes-256-gcm";
    tagBytes: typeof AES_TAG_BYTES;
  };
  format: typeof ENCRYPTED_APP_DATA_BACKUP_FORMAT;
  kdf: {
    iterations: typeof PBKDF2_ITERATIONS;
    name: "pbkdf2-hmac-sha256";
    salt: string;
  };
  version: typeof APP_DATA_BACKUP_VERSION;
}

export interface AppDataBackupRestoreResult {
  conversationsCopied: number;
  conversationsRestored: number;
  conversationsSkipped: number;
  settingsRestored: boolean;
}

export class AppDataBackupError extends Error {
  constructor(
    public readonly code:
      | "decrypt-failed"
      | "invalid"
      | "passphrase-required"
      | "too-large"
      | "unsupported",
  ) {
    super(code);
    this.name = "AppDataBackupError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function bytesToBase64(bytes: Uint8Array) {
  const BufferCtor = (globalThis as any).Buffer;
  if (BufferCtor) {
    return BufferCtor.from(bytes).toString("base64");
  }

  let binary = "";

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  if (typeof btoa !== "undefined") {
    return btoa(binary);
  }

  throw new AppDataBackupError("unsupported");
}

function base64ToBytes(base64: string) {
  const BufferCtor = (globalThis as any).Buffer;
  if (BufferCtor) {
    return new Uint8Array(BufferCtor.from(base64, "base64"));
  }

  if (typeof atob === "undefined") {
    throw new AppDataBackupError("unsupported");
  }

  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === "string";
}

function isNullableString(value: unknown) {
  return value === null || typeof value === "string";
}

function isValidMessage(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string" &&
    isNullableString(value.model) &&
    isNullableString(value.provider) &&
    typeof value.timestamp === "string"
  );
}

function isValidConversation(value: unknown): value is Conversation {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.title === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    value.messages.every(isValidMessage) &&
    isOptionalString(value.contextSummary) &&
    (value.summarizedMessageCount === undefined ||
      (typeof value.summarizedMessageCount === "number" &&
        Number.isFinite(value.summarizedMessageCount)))
  );
}

function isValidBackupConversation(
  value: unknown,
): value is AppDataBackupConversation {
  return (
    isRecord(value) &&
    typeof value.pinned === "boolean" &&
    isValidConversation(value.conversation)
  );
}

function parseJsonDocument(content: string) {
  if (utf8ToBytes(content).byteLength > APP_DATA_BACKUP_MAX_BYTES) {
    throw new AppDataBackupError("too-large");
  }

  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new AppDataBackupError("invalid");
  }
}

function parsePlainBackupDocument(value: unknown): AppDataBackup {
  if (!isRecord(value)) {
    throw new AppDataBackupError("invalid");
  }

  if (value.format !== APP_DATA_BACKUP_FORMAT) {
    throw new AppDataBackupError("invalid");
  }

  if (value.version !== APP_DATA_BACKUP_VERSION) {
    throw new AppDataBackupError("unsupported");
  }

  if (
    typeof value.appVersion !== "string" ||
    typeof value.exportedAt !== "string" ||
    !isRecord(value.data) ||
    !isRecord(value.data.settings) ||
    "apiKeys" in value.data.settings ||
    !Array.isArray(value.data.conversations) ||
    !value.data.conversations.every(isValidBackupConversation) ||
    !isNullableString(value.data.activeConversationId)
  ) {
    throw new AppDataBackupError("invalid");
  }

  const conversationIds = value.data.conversations.map(
    (record) =>
      (record as AppDataBackupConversation).conversation.id,
  );
  if (new Set(conversationIds).size !== conversationIds.length) {
    throw new AppDataBackupError("invalid");
  }

  return value as unknown as AppDataBackup;
}

function parseEncryptedBackupDocument(
  value: unknown,
): EncryptedAppDataBackup {
  if (!isRecord(value)) {
    throw new AppDataBackupError("invalid");
  }

  if (value.format !== ENCRYPTED_APP_DATA_BACKUP_FORMAT) {
    throw new AppDataBackupError("invalid");
  }

  if (value.version !== APP_DATA_BACKUP_VERSION) {
    throw new AppDataBackupError("unsupported");
  }

  if (
    !isRecord(value.kdf) ||
    value.kdf.name !== "pbkdf2-hmac-sha256" ||
    value.kdf.iterations !== PBKDF2_ITERATIONS ||
    typeof value.kdf.salt !== "string" ||
    !isRecord(value.cipher) ||
    value.cipher.name !== "aes-256-gcm" ||
    value.cipher.ivBytes !== AES_IV_BYTES ||
    value.cipher.tagBytes !== AES_TAG_BYTES ||
    typeof value.cipher.combined !== "string"
  ) {
    throw new AppDataBackupError("invalid");
  }

  return value as unknown as EncryptedAppDataBackup;
}

function toPortableSettings(settings: Settings): PortableSettings {
  const {
    apiKeys: _apiKeys,
    providerValidationResults: _providerValidationResults,
    ...portableSettings
  } = settings;

  return {
    ...portableSettings,
    ulraModeActive: false,
  };
}

export async function createAppDataBackup(params: {
  activeConversationId: string | null;
  appVersion: string;
  conversationMetas: ConversationMeta[];
  getConversationById: (id: string) => Promise<Conversation | null>;
  settings: Settings;
}): Promise<AppDataBackup> {
  const records = await Promise.all(
    params.conversationMetas.map(async (meta) => {
      const conversation = await params.getConversationById(meta.id);
      return conversation
        ? {
            conversation,
            pinned: meta.pinned,
          }
        : null;
    }),
  );

  return {
    appVersion: params.appVersion,
    data: {
      activeConversationId: params.activeConversationId,
      conversations: records.filter(
        (record): record is AppDataBackupConversation => record !== null,
      ),
      settings: toPortableSettings(params.settings),
    },
    exportedAt: new Date().toISOString(),
    format: APP_DATA_BACKUP_FORMAT,
    version: APP_DATA_BACKUP_VERSION,
  };
}

export function serializeAppDataBackup(backup: AppDataBackup) {
  return `${JSON.stringify(backup, null, 2)}\n`;
}

export function parseAppDataBackup(content: string) {
  return parsePlainBackupDocument(parseJsonDocument(content));
}

export function isEncryptedAppDataBackup(content: string) {
  const parsed = parseJsonDocument(content);
  return (
    isRecord(parsed) &&
    parsed.format === ENCRYPTED_APP_DATA_BACKUP_FORMAT
  );
}

async function deriveBackupKey(passphrase: string, salt: Uint8Array) {
  const keyBytes = await pbkdf2Async(sha256, passphrase.normalize("NFKC"), salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: AES_KEY_BYTES,
    asyncTick: 10,
  });

  try {
    return await AESEncryptionKey.import(keyBytes);
  } finally {
    keyBytes.fill(0);
  }
}

export async function encryptAppDataBackup(
  backup: AppDataBackup,
  passphrase: string,
) {
  if (passphrase.length < APP_DATA_BACKUP_MIN_PASSPHRASE_LENGTH) {
    throw new AppDataBackupError("passphrase-required");
  }

  const salt = getRandomBytes(PBKDF2_SALT_BYTES);
  const key = await deriveBackupKey(passphrase, salt);
  const plaintext = utf8ToBytes(serializeAppDataBackup(backup));
  const sealed = await aesEncryptAsync(plaintext, key, {
    additionalData: ENCRYPTION_AAD,
    nonce: { length: AES_IV_BYTES },
    tagLength: AES_TAG_BYTES,
  });
  const combined = await sealed.combined("base64");
  const encrypted: EncryptedAppDataBackup = {
    cipher: {
      combined,
      ivBytes: AES_IV_BYTES,
      name: "aes-256-gcm",
      tagBytes: AES_TAG_BYTES,
    },
    format: ENCRYPTED_APP_DATA_BACKUP_FORMAT,
    kdf: {
      iterations: PBKDF2_ITERATIONS,
      name: "pbkdf2-hmac-sha256",
      salt: bytesToBase64(salt),
    },
    version: APP_DATA_BACKUP_VERSION,
  };

  plaintext.fill(0);
  salt.fill(0);
  return `${JSON.stringify(encrypted, null, 2)}\n`;
}

export async function decryptAppDataBackup(
  content: string,
  passphrase: string,
) {
  if (!passphrase) {
    throw new AppDataBackupError("passphrase-required");
  }

  const encrypted = parseEncryptedBackupDocument(parseJsonDocument(content));
  let salt: Uint8Array;

  try {
    salt = base64ToBytes(encrypted.kdf.salt);
  } catch {
    throw new AppDataBackupError("invalid");
  }

  if (salt.byteLength !== PBKDF2_SALT_BYTES) {
    throw new AppDataBackupError("invalid");
  }

  try {
    const key = await deriveBackupKey(passphrase, salt);
    const sealed = AESSealedData.fromCombined(encrypted.cipher.combined, {
      ivLength: encrypted.cipher.ivBytes,
      tagLength: encrypted.cipher.tagBytes,
    });
    const plaintext = await aesDecryptAsync(sealed, key, {
      additionalData: ENCRYPTION_AAD,
      output: "bytes",
    });
    const backup = parseAppDataBackup(bytesToUtf8(plaintext));
    plaintext.fill(0);
    return backup;
  } catch (error) {
    if (error instanceof AppDataBackupError) {
      throw error;
    }
    throw new AppDataBackupError("decrypt-failed");
  } finally {
    salt.fill(0);
  }
}
