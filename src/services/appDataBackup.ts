import {
  AESEncryptionKey,
  AESSealedData,
  aesDecryptAsync,
  aesEncryptAsync,
  getRandomBytes,
} from "expo-crypto";
import { bytesToUtf8, utf8ToBytes } from "@noble/hashes/utils";

import type {
  Conversation,
  ConversationMeta,
  MessageImageMimeType,
  Settings,
} from "../types";
import { deriveBackupKeyBytes } from "./backupKeyDerivation";
import { readImageAttachmentData } from "./imageAttachmentFiles";

export const APP_DATA_BACKUP_FORMAT = "mrbroccoli-app-data";
export const APP_DATA_BACKUP_VERSION = 2;
export const ENCRYPTED_APP_DATA_BACKUP_FORMAT = "mrbroccoli-app-data-encrypted";
export const APP_DATA_BACKUP_MAX_BYTES = 50 * 1024 * 1024;
export const ENCRYPTED_APP_DATA_BACKUP_MAX_BYTES =
  Math.ceil((APP_DATA_BACKUP_MAX_BYTES * 4) / 3) + 64 * 1024;
export const APP_DATA_BACKUP_MIN_PASSPHRASE_LENGTH = 12;

const PBKDF2_ITERATIONS = 310_000;
const PBKDF2_SALT_BYTES = 16;
const AES_KEY_BYTES = 32;
const AES_IV_BYTES = 12;
const AES_TAG_BYTES = 16;
const SUPPORTED_APP_DATA_BACKUP_VERSIONS = [1, 2] as const;

function encryptionAad(version: number) {
  return utf8ToBytes(`${ENCRYPTED_APP_DATA_BACKUP_FORMAT}:${version}`);
}

export type PortableSettings = Omit<
  Settings,
  "apiKeys" | "providerValidationResults"
>;

export interface AppDataBackupConversation {
  attachments?: AppDataBackupImageAttachment[];
  conversation: Conversation;
  pinned: boolean;
}

export interface AppDataBackupImageAttachment {
  byteSize: number;
  data: string;
  height: number;
  id: string;
  mimeType: MessageImageMimeType;
  width: number;
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
  version: 1 | typeof APP_DATA_BACKUP_VERSION;
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
  version: 1 | typeof APP_DATA_BACKUP_VERSION;
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
      | "passphrase-too-weak"
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

  const attachments = value.attachments;

  return (
    typeof value.id === "string" &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string" &&
    isNullableString(value.model) &&
    isNullableString(value.provider) &&
    typeof value.timestamp === "string" &&
    (attachments === undefined ||
      (Array.isArray(attachments) &&
        attachments.every(
          (attachment) =>
            isRecord(attachment) &&
            attachment.kind === "image" &&
            typeof attachment.id === "string" &&
            typeof attachment.uri === "string" &&
            attachment.uri === `mrbroccoli-backup://image/${attachment.id}` &&
            ["image/jpeg", "image/png", "image/webp"].includes(
              String(attachment.mimeType),
            ) &&
            typeof attachment.width === "number" &&
            attachment.width > 0 &&
            typeof attachment.height === "number" &&
            attachment.height > 0 &&
            typeof attachment.byteSize === "number" &&
            attachment.byteSize > 0 &&
            Array.isArray(attachment.sharedWithProviders) &&
            attachment.sharedWithProviders.every(
              (provider) => typeof provider === "string",
            ),
        )))
  );
}

const CONVERSATION_ARTIFACT_KINDS = [
  "decision",
  "idea",
  "assumption",
  "counterargument",
  "question",
  "hypothesis",
  "action",
] as const;

const CONVERSATION_BRANCH_KINDS = [
  "edited-prompt",
  "alternative-response",
  "continue-from-message",
] as const;

function isValidConversationBranch(
  value: unknown,
  messages: Conversation["messages"],
) {
  return (
    isRecord(value) &&
    typeof value.rootConversationId === "string" &&
    value.rootConversationId.length > 0 &&
    typeof value.parentConversationId === "string" &&
    value.parentConversationId.length > 0 &&
    typeof value.parentMessageId === "string" &&
    value.parentMessageId.length > 0 &&
    typeof value.branchMessageId === "string" &&
    messages.some((message) => message.id === value.branchMessageId) &&
    CONVERSATION_BRANCH_KINDS.includes(
      value.kind as (typeof CONVERSATION_BRANCH_KINDS)[number],
    ) &&
    typeof value.createdAt === "string"
  );
}

function isValidConversationArtifact(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    CONVERSATION_ARTIFACT_KINDS.includes(
      value.kind as (typeof CONVERSATION_ARTIFACT_KINDS)[number],
    ) &&
    typeof value.text === "string" &&
    value.text.trim().length > 0 &&
    typeof value.sourceMessageId === "string" &&
    value.sourceMessageId.length > 0 &&
    typeof value.createdAt === "string"
  );
}

function isValidBackupImageAttachment(
  value: unknown,
): value is AppDataBackupImageAttachment {
  const hasValidData =
    isRecord(value) &&
    typeof value.data === "string" &&
    value.data.length > 0 &&
    value.data.length % 4 === 0 &&
    /^[A-Za-z0-9+/]*={0,2}$/.test(value.data);

  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    ["image/jpeg", "image/png", "image/webp"].includes(
      String(value.mimeType),
    ) &&
    typeof value.width === "number" &&
    value.width > 0 &&
    typeof value.height === "number" &&
    value.height > 0 &&
    typeof value.byteSize === "number" &&
    value.byteSize > 0 &&
    hasValidData &&
    base64ToBytes(value.data as string).byteLength === value.byteSize
  );
}

function isValidConversation(value: unknown): value is Conversation {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    return false;
  }
  const messages = value.messages;

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.title === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    messages.every(isValidMessage) &&
    (value.artifacts === undefined ||
      (Array.isArray(value.artifacts) &&
        value.artifacts.every(isValidConversationArtifact) &&
        value.artifacts.every((artifact) =>
          messages.some(
            (message) =>
              isRecord(artifact) &&
              isRecord(message) &&
              artifact.sourceMessageId === message.id,
          ),
        ))) &&
    (value.isPrivate === undefined || typeof value.isPrivate === "boolean") &&
    (value.knowledgeExcludedConversationIds === undefined ||
      (Array.isArray(value.knowledgeExcludedConversationIds) &&
        value.knowledgeExcludedConversationIds.every(
          (id) => typeof id === "string" && id.length > 0,
        ))) &&
    (value.branch === undefined ||
      isValidConversationBranch(value.branch, messages)) &&
    isOptionalString(value.contextSummary) &&
    (value.summarizedMessageCount === undefined ||
      (typeof value.summarizedMessageCount === "number" &&
        Number.isFinite(value.summarizedMessageCount)))
  );
}

function isValidBackupConversation(
  value: unknown,
): value is AppDataBackupConversation {
  if (
    !isRecord(value) ||
    typeof value.pinned !== "boolean" ||
    !isValidConversation(value.conversation)
  ) {
    return false;
  }

  const referencedIds = value.conversation.messages.flatMap((message) =>
    (message.attachments ?? []).map((attachment) => attachment.id),
  );
  if (referencedIds.length === 0) {
    return (
      value.attachments === undefined ||
      (Array.isArray(value.attachments) && value.attachments.length === 0)
    );
  }
  if (
    !Array.isArray(value.attachments) ||
    !value.attachments.every(isValidBackupImageAttachment)
  ) {
    return false;
  }
  const attachmentIds = value.attachments.map(
    (attachment) => (attachment as AppDataBackupImageAttachment).id,
  );

  return (
    new Set(attachmentIds).size === attachmentIds.length &&
    referencedIds.every((id) => attachmentIds.includes(id)) &&
    attachmentIds.every((id) => referencedIds.includes(id))
  );
}

function parseJsonDocument(
  content: string,
  maxBytes = APP_DATA_BACKUP_MAX_BYTES,
) {
  if (utf8ToBytes(content).byteLength > maxBytes) {
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

  if (
    !SUPPORTED_APP_DATA_BACKUP_VERSIONS.includes(
      value.version as (typeof SUPPORTED_APP_DATA_BACKUP_VERSIONS)[number],
    )
  ) {
    throw new AppDataBackupError("unsupported");
  }

  if (
    typeof value.appVersion !== "string" ||
    typeof value.exportedAt !== "string" ||
    !isRecord(value.data) ||
    !isRecord(value.data.settings) ||
    "apiKeys" in value.data.settings ||
    !Array.isArray(value.data.conversations) ||
    !(value.version === 1
      ? value.data.conversations.every(
          (record) =>
            isRecord(record) &&
            typeof record.pinned === "boolean" &&
            isValidConversation(record.conversation),
        )
      : value.data.conversations.every(isValidBackupConversation)) ||
    !isNullableString(value.data.activeConversationId)
  ) {
    throw new AppDataBackupError("invalid");
  }

  const conversationIds = value.data.conversations.map(
    (record) => (record as AppDataBackupConversation).conversation.id,
  );
  if (new Set(conversationIds).size !== conversationIds.length) {
    throw new AppDataBackupError("invalid");
  }

  return value as unknown as AppDataBackup;
}

function parseEncryptedBackupDocument(value: unknown): EncryptedAppDataBackup {
  if (!isRecord(value)) {
    throw new AppDataBackupError("invalid");
  }

  if (value.format !== ENCRYPTED_APP_DATA_BACKUP_FORMAT) {
    throw new AppDataBackupError("invalid");
  }

  if (
    !SUPPORTED_APP_DATA_BACKUP_VERSIONS.includes(
      value.version as (typeof SUPPORTED_APP_DATA_BACKUP_VERSIONS)[number],
    )
  ) {
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
  const conversations = await Promise.all(
    params.conversationMetas.map((meta) => params.getConversationById(meta.id)),
  );
  const estimatedImageDataBytes = conversations.reduce(
    (total, conversation) =>
      total +
      (conversation?.messages.reduce(
        (conversationTotal, message) =>
          conversationTotal +
          (message.attachments ?? []).reduce(
            (messageTotal, attachment) =>
              messageTotal + Math.ceil(attachment.byteSize / 3) * 4,
            0,
          ),
        0,
      ) ?? 0),
    0,
  );
  if (estimatedImageDataBytes > APP_DATA_BACKUP_MAX_BYTES) {
    throw new AppDataBackupError("too-large");
  }

  const records: (AppDataBackupConversation | null)[] = await Promise.all(
    params.conversationMetas.map(async (meta, conversationIndex) => {
      const conversation = conversations[conversationIndex];
      if (!conversation) {
        return null;
      }

      const attachments = await Promise.all(
        conversation.messages.flatMap((message) =>
          (message.attachments ?? []).map(async (attachment) => ({
            byteSize: attachment.byteSize,
            data: await readImageAttachmentData(attachment),
            height: attachment.height,
            id: attachment.id,
            mimeType: attachment.mimeType,
            width: attachment.width,
          })),
        ),
      );
      const portableConversation: Conversation = {
        ...conversation,
        messages: conversation.messages.map((message) => ({
          ...message,
          ...(message.attachments?.length
            ? {
                attachments: message.attachments.map((attachment) => ({
                  ...attachment,
                  uri: `mrbroccoli-backup://image/${attachment.id}`,
                })),
              }
            : {}),
        })),
      };

      return {
        ...(attachments.length > 0 ? { attachments } : {}),
        conversation: portableConversation,
        pinned: meta.pinned,
      };
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
  const content = `${JSON.stringify(backup, null, 2)}\n`;
  if (utf8ToBytes(content).byteLength > APP_DATA_BACKUP_MAX_BYTES) {
    throw new AppDataBackupError("too-large");
  }
  return content;
}

export function parseAppDataBackup(content: string) {
  return parsePlainBackupDocument(parseJsonDocument(content));
}

export function isEncryptedAppDataBackup(content: string) {
  const parsed = parseJsonDocument(
    content,
    ENCRYPTED_APP_DATA_BACKUP_MAX_BYTES,
  );
  return isRecord(parsed) && parsed.format === ENCRYPTED_APP_DATA_BACKUP_FORMAT;
}

export function isBackupPassphraseObviouslyWeak(passphrase: string) {
  const normalized = passphrase.normalize("NFKC").trim().toLowerCase();
  const compact = normalized.replace(/\s/g, "");
  if (compact.length === 0 || new Set(compact).size <= 2) {
    return true;
  }

  for (let unitLength = 1; unitLength <= 4; unitLength += 1) {
    if (
      normalized.length % unitLength === 0 &&
      normalized.slice(0, unitLength).repeat(normalized.length / unitLength) ===
        normalized
    ) {
      return true;
    }
  }

  return [
    "123456789012",
    "password1234",
    "passwordpassword",
    "qwertyuiop12",
    "letmeinletmein",
  ].includes(compact);
}

async function deriveBackupKey(passphrase: string, salt: Uint8Array) {
  const keyBytes = await deriveBackupKeyBytes({
    iterations: PBKDF2_ITERATIONS,
    keyLength: AES_KEY_BYTES,
    passphrase,
    salt,
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
  if (isBackupPassphraseObviouslyWeak(passphrase)) {
    throw new AppDataBackupError("passphrase-too-weak");
  }

  const salt = getRandomBytes(PBKDF2_SALT_BYTES);
  const key = await deriveBackupKey(passphrase, salt);
  const plaintext = utf8ToBytes(serializeAppDataBackup(backup));
  const sealed = await aesEncryptAsync(plaintext, key, {
    additionalData: encryptionAad(APP_DATA_BACKUP_VERSION),
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

  const encrypted = parseEncryptedBackupDocument(
    parseJsonDocument(content, ENCRYPTED_APP_DATA_BACKUP_MAX_BYTES),
  );
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
      additionalData: encryptionAad(encrypted.version),
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
