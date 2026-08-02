import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory } from "expo-file-system";
import { NativeModules, Platform } from "react-native";

import {
  CONVERSATION_ARCHIVE_CONFIG_KEY,
  loadConversationArchiveConfig,
  pickConversationArchiveDirectory,
  syncConversationArchive,
} from "../../src/services/conversationArchive";
import { getConversationArchiveFileName } from "../../src/services/conversationArchiveFormat";
import type { Conversation, ConversationMeta } from "../../src/types";

const fileSystemTestApi = require("expo-file-system") as {
  __getFileContent: (uri: string) => string | undefined;
  __reset: () => void;
};

function createRecord(id: string) {
  const conversation: Conversation = {
    id,
    title: `Conversation ${id}`,
    createdAt: "2026-08-02T08:00:00.000Z",
    updatedAt: "2026-08-02T08:01:00.000Z",
    messages: [
      {
        id: "message-1",
        role: "user",
        content: "Visible message",
        model: null,
        provider: null,
        timestamp: "2026-08-02T08:00:00.000Z",
      },
    ],
  };
  const meta: ConversationMeta = {
    id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messageCount: 1,
    providers: [],
    providerModels: {},
    lastModel: null,
    lastProvider: null,
    pinned: false,
  };
  return { conversation, meta };
}

describe("conversationArchive", () => {
  beforeEach(async () => {
    jest.replaceProperty(Platform, "OS", "android");
    fileSystemTestApi.__reset();
    await AsyncStorage.clear();
  });

  afterEach(() => {
    delete NativeModules.MrBroccoliArchiveDirectory;
    jest.restoreAllMocks();
  });

  it("persists and resolves iOS security-scoped folder bookmarks", async () => {
    jest.replaceProperty(Platform, "OS", "ios");
    const root = new Directory("file:///iCloud Drive/Mr Broccoli");
    root.create();
    jest.mocked(Directory.pickDirectoryAsync).mockResolvedValue(root);
    const createBookmark = jest.fn(async () => ({
      bookmark: "bookmark-data",
      uri: root.uri,
    }));
    const resolveBookmark = jest.fn(async () => ({
      bookmark: "refreshed-bookmark-data",
      stale: true,
      uri: root.uri,
    }));
    NativeModules.MrBroccoliArchiveDirectory = {
      createBookmark,
      resolveBookmark,
    };

    const selected = await pickConversationArchiveDirectory();
    expect(selected).toMatchObject({
      directoryName: "Mr Broccoli",
      directoryUri: root.uri,
      iosBookmark: "bookmark-data",
    });
    expect(createBookmark).toHaveBeenCalledWith(root.uri);

    const result = await syncConversationArchive({
      activeConversationId: null,
      config: selected,
      conversationMetas: [],
      getConversationById: jest.fn(),
      now: () => new Date("2026-08-02T10:00:00.000Z"),
    });
    expect(resolveBookmark).toHaveBeenCalledWith("bookmark-data");
    expect(result.config.iosBookmark).toBe("refreshed-bookmark-data");
  });

  it("writes index, latest, and session documents and removes only stale managed files", async () => {
    const root = new Directory("file:///archive");
    root.create();
    const sessions = root.createDirectory("sessions");
    const staleManagedFile = sessions.createFile(
      `conversation-${"a".repeat(64)}.md`,
      "text/markdown",
    );
    staleManagedFile.write("stale");
    const userFile = sessions.createFile("notes.md", "text/markdown");
    userFile.write("keep me");
    const { conversation, meta } = createRecord("conversation-1");

    const result = await syncConversationArchive({
      activeConversationId: conversation.id,
      config: {
        version: 1,
        directoryName: "Archive",
        directoryUri: root.uri,
      },
      conversationMetas: [meta],
      getConversationById: jest.fn(async () => conversation),
      now: () => new Date("2026-08-02T10:00:00.000Z"),
    });

    const sessionUri = `${sessions.uri}/${getConversationArchiveFileName(
      conversation.id,
    )}`;
    expect(fileSystemTestApi.__getFileContent(sessionUri)).toContain(
      "Visible message",
    );
    expect(
      fileSystemTestApi.__getFileContent(`${root.uri}/index.md`),
    ).toContain("Conversation conversation-1");
    expect(
      fileSystemTestApi.__getFileContent(`${root.uri}/latest.md`),
    ).toContain("Visible message");
    expect(staleManagedFile.exists).toBe(false);
    expect(userFile.exists).toBe(true);
    expect(result).toMatchObject({
      conversationCount: 1,
      config: { lastSyncedAt: "2026-08-02T10:00:00.000Z" },
    });
    await expect(loadConversationArchiveConfig()).resolves.toEqual(
      result.config,
    );
  });

  it("keeps the destination device-local and outside app-data backups", async () => {
    const config = {
      version: 1 as const,
      directoryName: "Drive",
      directoryUri: "content://drive/archive",
      lastSyncedAt: "2026-08-02T10:00:00.000Z",
    };
    await AsyncStorage.setItem(
      CONVERSATION_ARCHIVE_CONFIG_KEY,
      JSON.stringify(config),
    );

    await expect(loadConversationArchiveConfig()).resolves.toEqual(config);
    expect(CONVERSATION_ARCHIVE_CONFIG_KEY).not.toBe("@mrbroccoli/settings");
  });
});
