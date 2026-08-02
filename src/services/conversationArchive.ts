import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File } from "expo-file-system";
import { NativeModules, Platform } from "react-native";

import type { Conversation, ConversationMeta } from "../types";
import {
  buildConversationArchiveDocuments,
  CONVERSATION_ARCHIVE_SESSION_FILE_PATTERN,
  type ConversationArchiveRecord,
} from "./conversationArchiveFormat";

export const CONVERSATION_ARCHIVE_CONFIG_KEY =
  "@mrbroccoli/conversation_archive";

export type ConversationArchiveErrorCode =
  "access-lost" | "sync-failed" | "unavailable";

export class ConversationArchiveError extends Error {
  constructor(
    readonly code: ConversationArchiveErrorCode,
    cause?: unknown,
  ) {
    super(code, { cause });
    this.name = "ConversationArchiveError";
  }
}

export interface ConversationArchiveConfig {
  version: 1;
  directoryName: string;
  directoryUri: string;
  iosBookmark?: string;
  lastSyncedAt?: string;
}

interface IosArchiveDirectoryNativeModule {
  createBookmark(uri: string): Promise<{ bookmark: string; uri: string }>;
  resolveBookmark(
    bookmark: string,
  ): Promise<{ bookmark: string; stale: boolean; uri: string }>;
}

function getIosArchiveDirectoryNativeModule() {
  return NativeModules.MrBroccoliArchiveDirectory as
    | IosArchiveDirectoryNativeModule
    | undefined;
}

function isArchiveConfig(value: unknown): value is ConversationArchiveConfig {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<ConversationArchiveConfig>;
  return (
    candidate.version === 1 &&
    typeof candidate.directoryName === "string" &&
    candidate.directoryName.length > 0 &&
    typeof candidate.directoryUri === "string" &&
    candidate.directoryUri.length > 0 &&
    (candidate.iosBookmark === undefined ||
      typeof candidate.iosBookmark === "string") &&
    (candidate.lastSyncedAt === undefined ||
      typeof candidate.lastSyncedAt === "string")
  );
}

export async function loadConversationArchiveConfig() {
  const raw = await AsyncStorage.getItem(CONVERSATION_ARCHIVE_CONFIG_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isArchiveConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveConversationArchiveConfig(
  config: ConversationArchiveConfig,
) {
  await AsyncStorage.setItem(
    CONVERSATION_ARCHIVE_CONFIG_KEY,
    JSON.stringify(config),
  );
}

export async function clearConversationArchiveConfig() {
  await AsyncStorage.removeItem(CONVERSATION_ARCHIVE_CONFIG_KEY);
}

export function isConversationArchivePickerCancellation(error: unknown) {
  const value = error instanceof Error ? `${error.name} ${error.message}` : "";
  return /cancel/i.test(value);
}

function getDirectoryDisplayName(directory: Directory) {
  try {
    const decoded = decodeURIComponent(directory.name);
    return decoded.split(":").filter(Boolean).pop() ?? decoded;
  } catch {
    return directory.name;
  }
}

export async function pickConversationArchiveDirectory(
  currentConfig?: ConversationArchiveConfig | null,
) {
  const directory = await Directory.pickDirectoryAsync(
    currentConfig?.directoryUri,
  );
  let directoryUri = directory.uri;
  let iosBookmark: string | undefined;

  if (Platform.OS === "ios") {
    const iosNativeModule = getIosArchiveDirectoryNativeModule();
    if (!iosNativeModule?.createBookmark) {
      throw new ConversationArchiveError("unavailable");
    }
    try {
      const result = await iosNativeModule.createBookmark(directory.uri);
      directoryUri = result.uri;
      iosBookmark = result.bookmark;
    } catch (error) {
      throw new ConversationArchiveError("unavailable", error);
    }
  }

  return {
    version: 1,
    directoryName: getDirectoryDisplayName(directory) || "Selected folder",
    directoryUri,
    ...(iosBookmark ? { iosBookmark } : {}),
  } satisfies ConversationArchiveConfig;
}

async function resolveArchiveDirectory(config: ConversationArchiveConfig) {
  if (Platform.OS !== "ios") {
    return { config, directory: new Directory(config.directoryUri) };
  }
  const iosNativeModule = getIosArchiveDirectoryNativeModule();
  if (!config.iosBookmark || !iosNativeModule?.resolveBookmark) {
    throw new ConversationArchiveError("access-lost");
  }

  try {
    const resolved = await iosNativeModule.resolveBookmark(config.iosBookmark);
    const nextConfig =
      resolved.bookmark === config.iosBookmark &&
      resolved.uri === config.directoryUri
        ? config
        : {
            ...config,
            directoryUri: resolved.uri,
            iosBookmark: resolved.bookmark,
          };
    return { config: nextConfig, directory: new Directory(resolved.uri) };
  } catch (error) {
    throw new ConversationArchiveError("access-lost", error);
  }
}

function getOrCreateDirectory(parent: Directory, name: string) {
  const existing = parent
    .list()
    .find(
      (entry): entry is Directory =>
        entry instanceof Directory && entry.name === name,
    );
  return existing ?? parent.createDirectory(name);
}

function writeFile(directory: Directory, name: string, content: string) {
  const existing = directory
    .list()
    .find(
      (entry): entry is File => entry instanceof File && entry.name === name,
    );
  const file = existing ?? directory.createFile(name, "text/markdown");
  file.write(content);
}

export async function syncConversationArchive(params: {
  activeConversationId: string | null;
  config: ConversationArchiveConfig;
  conversationMetas: ConversationMeta[];
  getConversationById: (id: string) => Promise<Conversation | null>;
  now?: () => Date;
}) {
  const resolved = await resolveArchiveDirectory(params.config);
  let sessionsDirectory: Directory;

  try {
    resolved.directory.list();
    sessionsDirectory = getOrCreateDirectory(resolved.directory, "sessions");
  } catch (error) {
    throw new ConversationArchiveError("access-lost", error);
  }

  const records = (
    await Promise.all(
      params.conversationMetas.map(async (meta) => {
        const conversation = await params.getConversationById(meta.id);
        return conversation ? { conversation, meta } : null;
      }),
    )
  ).filter((record): record is ConversationArchiveRecord => record !== null);
  const syncedAt = (params.now ?? (() => new Date()))().toISOString();
  const documents = buildConversationArchiveDocuments({
    activeConversationId: params.activeConversationId,
    exportedAt: syncedAt,
    records,
  });

  try {
    for (const [name, content] of documents.sessions) {
      writeFile(sessionsDirectory, name, content);
    }
    writeFile(resolved.directory, "index.md", documents.index);
    writeFile(resolved.directory, "latest.md", documents.latest);

    for (const entry of sessionsDirectory.list()) {
      if (
        entry instanceof File &&
        CONVERSATION_ARCHIVE_SESSION_FILE_PATTERN.test(entry.name) &&
        !documents.sessions.has(entry.name)
      ) {
        entry.delete();
      }
    }
  } catch (error) {
    throw new ConversationArchiveError("sync-failed", error);
  }

  const nextConfig: ConversationArchiveConfig = {
    ...resolved.config,
    lastSyncedAt: syncedAt,
  };
  await saveConversationArchiveConfig(nextConfig);
  return { config: nextConfig, conversationCount: records.length };
}
