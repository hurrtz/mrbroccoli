import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as SQLite from "expo-sqlite";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useConversations } from "../../src/hooks/useConversations";
import { getConversationDatabase } from "../../src/services/conversationStore";
import {
  readConversation,
  readStoredConversationMetas,
  removeConversation,
  resetConversationStorageForTests,
  saveConversation,
} from "../../src/hooks/conversations/storage";
import type { Conversation } from "../../src/types";

let mockUuidCounter = 0;

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-native-uuid", () => ({
  v4: () => `test-uuid-${++mockUuidCounter}`,
}));

describe("useConversations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Conversations live in a module-level SQLite store, so without this every
    // test inherits the rows the previous one wrote.
    (SQLite as unknown as { __reset: () => void }).__reset();
    resetConversationStorageForTests();
    mockUuidCounter = 0;
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() =>
      Promise.resolve(null),
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(() =>
      Promise.resolve(),
    );
    (AsyncStorage.removeItem as jest.Mock).mockImplementation(() =>
      Promise.resolve(),
    );
  });

  it("starts with empty conversation list", async () => {
    const { result } = renderHook(() => useConversations());
    expect(result.current.conversations).toEqual([]);
    expect(result.current.activeConversation).toBeNull();
    await waitFor(() => {
      expect(result.current.loaded).toBe(true);
    });
  });

  it("restores the conversation that was active before app reload", async () => {
    const conversation: Conversation = {
      id: "restored-active-thread",
      title: "Keep my place",
      createdAt: "2026-07-21T08:00:00.000Z",
      updatedAt: "2026-07-21T08:01:00.000Z",
      messages: [
        {
          id: "stored-message",
          role: "user",
          content: "Continue here after relaunch",
          model: null,
          provider: null,
          timestamp: "2026-07-21T08:01:00.000Z",
        },
      ],
    };
    const stored = new Map<string, string>([
      ["@mrbroccoli/active_conversation", conversation.id],
      [
        "@mrbroccoli/conversation/restored-active-thread",
        JSON.stringify(conversation),
      ],
      [
        "@mrbroccoli/conversations",
        JSON.stringify([
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
        ]),
      ],
    ]);
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.activeConversation?.id).toBe(conversation.id);
    });
    expect(result.current.activeConversation?.messages).toEqual(
      conversation.messages,
    );
  });

  it("restores the full first-message title from the legacy 40-character format", async () => {
    const fullTitle =
      "This legacy conversation title should now use the complete available header width";
    const conversation: Conversation = {
      id: "legacy-title-thread",
      title: "This legacy conversation title should...",
      createdAt: "2026-07-21T08:00:00.000Z",
      updatedAt: "2026-07-21T08:01:00.000Z",
      messages: [
        {
          id: "stored-message",
          role: "user",
          content: fullTitle,
          model: null,
          provider: null,
          timestamp: "2026-07-21T08:01:00.000Z",
        },
      ],
    };
    const stored = new Map<string, string>([
      ["@mrbroccoli/active_conversation", conversation.id],
      [
        "@mrbroccoli/conversation/legacy-title-thread",
        JSON.stringify(conversation),
      ],
      [
        "@mrbroccoli/conversations",
        JSON.stringify([
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
        ]),
      ],
    ]);
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.activeConversation?.title).toBe(fullTitle);
    });
    expect(result.current.conversations[0]?.title).toBe(fullTitle);
  });

  it("infers exact branch lineage for forks created before branch metadata existed", async () => {
    const parent: Conversation = {
      id: "legacy-parent",
      title: "Legacy parent",
      createdAt: "2026-08-04T08:00:00.000Z",
      updatedAt: "2026-08-04T08:04:00.000Z",
      messages: [
        {
          id: "parent-user-1",
          role: "user",
          content: "First question",
          model: null,
          provider: null,
          timestamp: "2026-08-04T08:00:00.000Z",
        },
        {
          id: "parent-assistant-1",
          role: "assistant",
          content: "First answer",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-08-04T08:01:00.000Z",
        },
        {
          id: "parent-user-2",
          role: "user",
          content: "Corrected follow-up",
          editedAt: "2026-08-04T08:03:00.000Z",
          model: null,
          provider: null,
          timestamp: "2026-08-04T08:02:00.000Z",
        },
        {
          id: "parent-assistant-2",
          role: "assistant",
          content: "Old divergent reply",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-08-04T08:04:00.000Z",
        },
      ],
    };
    const legacyBranch: Conversation = {
      id: "legacy-child",
      title: "Corrected follow-up",
      createdAt: "2026-08-04T08:03:30.000Z",
      updatedAt: "2026-08-04T08:03:30.000Z",
      knowledgeExcludedConversationIds: [parent.id],
      messages: [
        ...parent.messages.slice(0, 3).map((message, index) => ({
          ...message,
          id: `child-message-${index}`,
        })),
        {
          id: "child-generated-reply",
          role: "assistant",
          content: "New reply in the branch",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-08-04T08:05:00.000Z",
        },
      ],
    };
    const stored = new Map<string, string>([
      ["@mrbroccoli/active_conversation", legacyBranch.id],
      [`@mrbroccoli/conversation/${parent.id}`, JSON.stringify(parent)],
      [
        `@mrbroccoli/conversation/${legacyBranch.id}`,
        JSON.stringify(legacyBranch),
      ],
      [
        "@mrbroccoli/conversations",
        JSON.stringify(
          [legacyBranch, parent].map((conversation) => ({
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            messageCount: conversation.messages.length,
            providers: [],
            providerModels: {},
            lastModel: null,
            lastProvider: null,
            pinned: false,
            isPrivate: false,
          })),
        ),
      ],
    ]);
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.activeConversation?.branch).toEqual(
        expect.objectContaining({
          rootConversationId: parent.id,
          parentConversationId: parent.id,
          parentMessageId: "parent-user-2",
          branchMessageId: "child-message-2",
          kind: "edited-prompt",
        }),
      );
    });
    expect(
      result.current.conversations.find(({ id }) => id === legacyBranch.id)
        ?.branch,
    ).toEqual(result.current.activeConversation?.branch);
    await waitFor(async () => {
      const restoredParent = await readConversation(parent.id);
      expect(restoredParent?.knowledgeExcludedConversationIds).toContain(
        legacyBranch.id,
      );
    });
  });

  it("merges a conversation created while launch hydration is still reading storage", async () => {
    const storedConversation: Conversation = {
      id: "stored-before-launch",
      title: "Stored before launch",
      createdAt: "2026-07-21T08:00:00.000Z",
      updatedAt: "2026-07-21T08:01:00.000Z",
      messages: [
        {
          id: "stored-message",
          role: "user",
          content: "Keep this stored conversation",
          model: null,
          provider: null,
          timestamp: "2026-07-21T08:01:00.000Z",
        },
      ],
    };
    const storedMeta = {
      id: storedConversation.id,
      title: storedConversation.title,
      createdAt: storedConversation.createdAt,
      updatedAt: storedConversation.updatedAt,
      messageCount: 1,
      providers: [],
      providerModels: {},
      lastModel: null,
      lastProvider: null,
      pinned: false,
    };
    const stored = new Map<string, string>([
      [
        "@mrbroccoli/conversation/stored-before-launch",
        JSON.stringify(storedConversation),
      ],
    ]);
    let releaseMetaRead: (value: string) => void = () => undefined;
    let metaReadCount = 0;
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === "@mrbroccoli/conversations") {
        metaReadCount += 1;
        if (metaReadCount === 1) {
          return new Promise<string>((resolve) => {
            releaseMetaRead = resolve;
          });
        }
      }

      return Promise.resolve(stored.get(key) ?? null);
    });
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );

    const { result } = renderHook(() => useConversations());

    expect(result.current.loaded).toBe(false);
    await act(async () => {
      result.current.createConversation("Created during launch");
    });
    const createdConversationId = result.current.activeConversation?.id;

    await act(async () => {
      releaseMetaRead(JSON.stringify([storedMeta]));
    });

    await waitFor(() => {
      expect(result.current.conversations).toHaveLength(2);
    });
    expect(result.current.loaded).toBe(true);
    expect(result.current.activeConversation?.id).toBe(createdConversationId);
    expect(result.current.conversations.map(({ id }) => id)).toEqual(
      expect.arrayContaining(["stored-before-launch", createdConversationId]),
    );

    await waitFor(async () => {
      const persistedMetas = await readStoredConversationMetas();
      expect(persistedMetas.map(({ id }) => id)).toEqual(
        expect.arrayContaining(["stored-before-launch", createdConversationId]),
      );
    });
  });

  it("keeps the most recently requested conversation when storage reads resolve out of order", async () => {
    const firstConversation: Conversation = {
      id: "first-selection",
      title: "First",
      createdAt: "2026-07-21T08:00:00.000Z",
      updatedAt: "2026-07-21T08:00:00.000Z",
      messages: [],
    };
    const secondConversation: Conversation = {
      ...firstConversation,
      id: "second-selection",
      title: "Second",
    };
    await saveConversation(firstConversation);
    await saveConversation(secondConversation);

    // Hold both row reads open so the selections can be released in the wrong
    // order on purpose. The gate now sits on the SQLite read rather than on
    // AsyncStorage.
    let releaseFirstRead: () => void = () => undefined;
    let releaseSecondRead: () => void = () => undefined;
    // Both gates are created before the mock can reach them, so releasing one
    // can never race ahead of its resolver being assigned.
    const firstGate = new Promise<void>((resolve) => {
      releaseFirstRead = resolve;
    });
    const secondGate = new Promise<void>((resolve) => {
      releaseSecondRead = resolve;
    });
    let firstReadEntered = false;
    let secondReadEntered = false;
    const database = await getConversationDatabase();
    const readRow = database.getFirstAsync as jest.Mock;
    const passThrough = readRow.getMockImplementation()!;
    readRow.mockImplementation(async (sql: string, ...params: unknown[]) => {
      if (sql.includes("FROM conversations WHERE id = ?")) {
        if (params[0] === "first-selection") {
          firstReadEntered = true;
          await firstGate;
        }
        if (params[0] === "second-selection") {
          secondReadEntered = true;
          await secondGate;
        }
      }
      return passThrough(sql, ...params);
    });

    const { result } = renderHook(() => useConversations());

    let firstSelection = Promise.resolve();
    let secondSelection = Promise.resolve();
    act(() => {
      firstSelection = result.current.selectConversation("first-selection");
      secondSelection = result.current.selectConversation("second-selection");
    });

    await waitFor(() => {
      expect(firstReadEntered).toBe(true);
      expect(secondReadEntered).toBe(true);
    });
    await act(async () => {
      releaseSecondRead();
      await secondSelection;
    });
    await act(async () => {
      releaseFirstRead();
      await firstSelection;
    });
    readRow.mockImplementation(passThrough);

    expect(result.current.activeConversation?.id).toBe("second-selection");
  });

  it("creates a new conversation", async () => {
    const { result } = renderHook(() => useConversations());
    await act(async () => {
      result.current.createConversation(
        "Hello, how are you?",
        "gpt-5.4",
        "openai",
      );
    });
    expect(result.current.conversations).toHaveLength(1);
    expect(result.current.conversations[0].title).toBe("Hello, how are you?");
    expect(result.current.conversations[0].lastModel).toBe("gpt-5.4");
    expect(result.current.conversations[0].lastProvider).toBe("openai");
    expect(result.current.conversations[0].pinned).toBe(false);
    expect(result.current.activeConversation).not.toBeNull();
  });

  it("restores conflicting backup conversations as copies without replacing local data", async () => {
    const stored = new Map<string, string>();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );
    const { result } = renderHook(() => useConversations());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => {
      result.current.createConversation("Local conversation");
    });
    const localConversation = result.current.activeConversation!;
    let restoreResult:
      | Awaited<ReturnType<typeof result.current.restoreConversationBackup>>
      | undefined;

    await act(async () => {
      restoreResult = await result.current.restoreConversationBackup(
        [
          {
            conversation: {
              ...localConversation,
              title: "Imported conversation",
              messages: [
                {
                  id: "imported-message",
                  role: "user",
                  content: "Keep both versions",
                  model: null,
                  provider: null,
                  timestamp: "2026-07-31T08:00:00.000Z",
                },
              ],
            },
            pinned: true,
          },
        ],
        localConversation.id,
      );
    });

    expect(restoreResult).toEqual({
      conversationsCopied: 1,
      conversationsRestored: 1,
      conversationsSkipped: 0,
    });
    expect(result.current.conversations).toHaveLength(2);
    expect(result.current.activeConversation).toMatchObject({
      id: "test-uuid-2",
      title: "Imported conversation",
    });
    await expect(readConversation(localConversation.id)).resolves.toMatchObject(
      {
        id: localConversation.id,
        title: "Local conversation",
      },
    );
  });

  it("remaps branch ancestry when a backup family is restored as copies", async () => {
    const stored = new Map<string, string>();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );
    const { result } = renderHook(() => useConversations());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => {
      result.current.createConversation("Local root");
    });
    const conflictingRootId = result.current.activeConversation!.id;
    const parentMessage = {
      id: "backup-root-message",
      role: "assistant" as const,
      content: "Checkpoint",
      model: "gpt-5.4",
      provider: "openai" as const,
      timestamp: "2026-08-04T10:00:00.000Z",
    };
    const childMessage = {
      ...parentMessage,
      id: "backup-child-message",
    };

    await act(async () => {
      await result.current.restoreConversationBackup(
        [
          {
            conversation: {
              id: conflictingRootId,
              title: "Imported root",
              createdAt: "2026-08-04T10:00:00.000Z",
              updatedAt: "2026-08-04T10:00:00.000Z",
              messages: [parentMessage],
            },
            pinned: false,
          },
          {
            conversation: {
              id: "imported-child",
              title: "Imported child",
              createdAt: "2026-08-04T10:01:00.000Z",
              updatedAt: "2026-08-04T10:01:00.000Z",
              messages: [childMessage],
              knowledgeExcludedConversationIds: [conflictingRootId],
              branch: {
                rootConversationId: conflictingRootId,
                parentConversationId: conflictingRootId,
                parentMessageId: parentMessage.id,
                branchMessageId: childMessage.id,
                kind: "continue-from-message",
                createdAt: "2026-08-04T10:01:00.000Z",
              },
            },
            pinned: false,
          },
        ],
        "imported-child",
      );
    });

    const copiedRoot = result.current.conversations.find(
      ({ title }) => title === "Imported root",
    );
    expect(copiedRoot?.id).toBeTruthy();
    expect(copiedRoot?.id).not.toBe(conflictingRootId);
    expect(result.current.activeConversation).toEqual(
      expect.objectContaining({
        id: "imported-child",
        knowledgeExcludedConversationIds: [copiedRoot?.id],
        branch: expect.objectContaining({
          rootConversationId: copiedRoot?.id,
          parentConversationId: copiedRoot?.id,
        }),
      }),
    );
  });

  it("restores backed-up image bytes to a fresh app-owned file", async () => {
    const { result } = renderHook(() => useConversations());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => {
      await result.current.restoreConversationBackup(
        [
          {
            conversation: {
              id: "imported-image-conversation",
              title: "Imported image",
              createdAt: "2026-08-02T08:00:00.000Z",
              updatedAt: "2026-08-02T08:01:00.000Z",
              messages: [
                {
                  id: "message-with-image",
                  role: "user",
                  content: "Describe this",
                  attachments: [
                    {
                      id: "backup-image-id",
                      kind: "image",
                      uri: "mrbroccoli-backup://image/backup-image-id",
                      mimeType: "image/jpeg",
                      width: 1200,
                      height: 800,
                      byteSize: 11,
                      sharedWithProviders: ["openai"],
                    },
                  ],
                  model: null,
                  provider: null,
                  timestamp: "2026-08-02T08:00:00.000Z",
                },
              ],
            },
            attachments: [
              {
                id: "backup-image-id",
                mimeType: "image/jpeg",
                width: 1200,
                height: 800,
                byteSize: 11,
                data: "aW1hZ2UtYnl0ZXM=",
              },
            ],
            pinned: false,
          },
        ],
        "imported-image-conversation",
      );
    });

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      "file:///documents/message-images/test-uuid-1.jpg",
      "aW1hZ2UtYnl0ZXM=",
      { encoding: "base64" },
    );
    expect(
      result.current.activeConversation?.messages[0].attachments?.[0],
    ).toEqual(
      expect.objectContaining({
        id: "test-uuid-1",
        uri: "file:///documents/message-images/test-uuid-1.jpg",
      }),
    );
  });

  it("skips a repeated image backup after local attachment IDs are regenerated", async () => {
    const stored = new Map<string, string>();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
      "aW1hZ2UtYnl0ZXM=",
    );
    const record = {
      conversation: {
        id: "repeat-image-conversation",
        title: "Repeat image",
        createdAt: "2026-08-02T08:00:00.000Z",
        updatedAt: "2026-08-02T08:01:00.000Z",
        messages: [
          {
            id: "message-with-image",
            role: "user" as const,
            content: "Describe this",
            attachments: [
              {
                id: "backup-image-id",
                kind: "image" as const,
                uri: "mrbroccoli-backup://image/backup-image-id",
                mimeType: "image/jpeg" as const,
                width: 1200,
                height: 800,
                byteSize: 11,
                sharedWithProviders: ["openai" as const],
              },
            ],
            model: null,
            provider: null,
            timestamp: "2026-08-02T08:00:00.000Z",
          },
        ],
      },
      attachments: [
        {
          id: "backup-image-id",
          mimeType: "image/jpeg" as const,
          width: 1200,
          height: 800,
          byteSize: 11,
          data: "aW1hZ2UtYnl0ZXM=",
        },
      ],
      pinned: false,
    };
    const { result } = renderHook(() => useConversations());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => {
      await result.current.restoreConversationBackup([record], null);
    });

    let repeatedResult:
      | Awaited<ReturnType<typeof result.current.restoreConversationBackup>>
      | undefined;
    await act(async () => {
      repeatedResult = await result.current.restoreConversationBackup(
        [record],
        null,
      );
    });

    expect(repeatedResult).toEqual({
      conversationsCopied: 0,
      conversationsRestored: 0,
      conversationsSkipped: 1,
    });
    expect(result.current.conversations).toHaveLength(1);
  });

  it("keeps useful conversation titles beyond the old 40-character limit", async () => {
    const { result } = renderHook(() => useConversations());
    const firstMessage =
      "This is a longer message that should fill the available title container before display truncation";
    await act(async () => {
      result.current.createConversation(firstMessage);
    });

    expect(result.current.conversations[0].title).toBe(firstMessage);
  });

  it("keeps a generous safety limit for pathological conversation titles", async () => {
    const { result } = renderHook(() => useConversations());
    await act(async () => {
      result.current.createConversation("word ".repeat(50));
    });

    const title = result.current.conversations[0].title;
    expect(title.length).toBeLessThanOrEqual(163);
    expect(title.endsWith("...")).toBe(true);
  });

  it("adds a message to the active conversation", async () => {
    const { result } = renderHook(() => useConversations());
    await act(async () => {
      result.current.createConversation("Test");
    });
    await act(async () => {
      result.current.addMessage({
        role: "user",
        content: "Test message",
        model: null,
        provider: null,
      });
    });
    expect(result.current.activeConversation!.messages).toHaveLength(1);
  });

  it("persists settings on one conversation without leaking into another", async () => {
    const stored = new Map<string, string>();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("First");
      result.current.updateConversationSettings({
        responseLength: "thorough",
        llmInstructions: "Focus on architecture trade-offs.",
        ttsVoice: {
          provider: "openai",
          model: "gpt-4o-mini-tts",
          voice: "nova",
        },
      });
    });
    const firstId = result.current.activeConversation!.id;

    await act(async () => {
      result.current.clearActiveConversation();
      result.current.createConversation("Second");
    });

    expect(result.current.activeConversation?.settings).toBeUndefined();

    await act(async () => {
      await result.current.selectConversation(firstId);
    });

    expect(result.current.activeConversation?.settings).toEqual({
      responseLength: "thorough",
      llmInstructions: "Focus on architecture trade-offs.",
      ttsVoice: {
        provider: "openai",
        model: "gpt-4o-mini-tts",
        voice: "nova",
      },
    });
    await expect(readConversation(firstId)).resolves.toMatchObject({
      settings: { responseLength: "thorough" },
    });
  });

  it("updates a stored message in place", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Test");
    });

    let messageId = "";

    await act(async () => {
      const message = result.current.addMessage({
        role: "assistant",
        content: "Original reply",
        model: "gpt-5.4",
        provider: "openai",
      });
      messageId = message?.id ?? "";
    });

    await act(async () => {
      result.current.updateMessage(messageId, (message) => ({
        ...message,
        metadata: {
          notices: [
            {
              stage: "tts",
              level: "warning",
              message: "Provider voice fallback was used.",
            },
          ],
        },
      }));
    });

    expect(result.current.activeConversation?.messages[0]).toEqual(
      expect.objectContaining({
        metadata: {
          notices: [
            {
              stage: "tts",
              level: "warning",
              message: "Provider voice fallback was used.",
            },
          ],
        },
      }),
    );
  });

  it("corrects a user transcript and invalidates stale compact memory", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Transcript correction");
    });

    let messageId = "";
    await act(async () => {
      messageId =
        result.current.addMessage({
          role: "user",
          content: "All in on end design",
          model: null,
          provider: null,
        })?.id ?? "";
      result.current.updateConversationContextSummary(
        "The user prefers end design.",
        1,
      );
    });

    await act(async () => {
      await result.current.editUserMessage(messageId, "All in on Ant Design");
    });

    expect(result.current.activeConversation?.contextSummary).toBeUndefined();
    expect(
      result.current.activeConversation?.summarizedMessageCount,
    ).toBeUndefined();
    expect(result.current.activeConversation?.messages[0]).toEqual(
      expect.objectContaining({
        content: "All in on Ant Design",
        editedAt: expect.any(String),
      }),
    );
    await expect(
      result.current.searchConversations("Ant Design"),
    ).resolves.toEqual([
      expect.objectContaining({ title: "Transcript correction" }),
    ]);
  });

  it("forks an edited prompt with independent history and image files", async () => {
    const stored = new Map<string, string>();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );
    const { result } = renderHook(() => useConversations());
    let originalConversationId = "";
    let editedMessageId = "";
    const sourceAttachment = {
      id: "source-image",
      kind: "image" as const,
      uri: "file:///documents/message-images/source-image.jpg",
      mimeType: "image/jpeg" as const,
      width: 640,
      height: 480,
      byteSize: 128,
      sharedWithProviders: ["openai" as const],
    };

    await act(async () => {
      originalConversationId = result.current.createConversation(
        "Original question",
        "gpt-5.4",
        "openai",
        { responseLength: "thorough" },
      );
      result.current.addMessage({
        role: "user",
        content: "Original question",
        model: null,
        provider: null,
      });
      result.current.addMessage({
        role: "assistant",
        content: "Original answer",
        model: "gpt-5.4",
        provider: "openai",
      });
      editedMessageId =
        result.current.addMessage({
          role: "user",
          content: "Misheard follow-up",
          attachments: [sourceAttachment],
          model: null,
          provider: null,
        })?.id ?? "";
      result.current.addMessage({
        role: "assistant",
        content: "Answer that should remain only in the original",
        model: "gpt-5.4",
        provider: "openai",
      });
      await result.current.editUserMessage(
        editedMessageId,
        "Corrected follow-up",
      );
    });

    let fork: Awaited<
      ReturnType<typeof result.current.branchConversationAtMessage>
    > = null;
    await act(async () => {
      fork = await result.current.branchConversationAtMessage(editedMessageId);
    });

    expect(fork).not.toBeNull();
    expect(fork?.conversation).toEqual(
      expect.objectContaining({
        title: "Corrected follow-up",
        settings: { responseLength: "thorough" },
        branch: expect.objectContaining({
          rootConversationId: originalConversationId,
          parentConversationId: originalConversationId,
          parentMessageId: editedMessageId,
          kind: "edited-prompt",
        }),
      }),
    );
    expect(fork?.conversation.messages).toHaveLength(3);
    expect(fork?.conversation.messages.map(({ content }) => content)).toEqual([
      "Original question",
      "Original answer",
      "Corrected follow-up",
    ]);
    expect(fork?.contextMessages).toHaveLength(2);
    expect(fork?.conversation.knowledgeExcludedConversationIds).toEqual([
      originalConversationId,
    ]);
    expect(fork?.checkpointMessage.id).not.toBe(editedMessageId);
    expect(fork?.checkpointMessage.attachments?.[0]).toEqual(
      expect.objectContaining({
        id: expect.not.stringMatching(/^source-image$/),
        sharedWithProviders: ["openai"],
      }),
    );
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      "file:///documents/message-images/source-image.jpg",
      { encoding: "base64" },
    );
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    expect(result.current.activeConversation?.id).toBe(fork?.conversation.id);
    expect(result.current.conversations).toHaveLength(2);
    expect(
      result.current.conversations.find(
        ({ id }) => id === fork?.conversation.id,
      ),
    ).toEqual(
      expect.objectContaining({
        branchSchemaVersion: 2,
        messageCount: 1,
      }),
    );
    await expect(
      result.current.getConversationById(originalConversationId),
    ).resolves.toEqual(
      expect.objectContaining({
        knowledgeExcludedConversationIds: [fork?.conversation.id],
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: "Answer that should remain only in the original",
          }),
        ]),
      }),
    );
  });

  it("branches recursively from assistant checkpoints and isolates the whole family", async () => {
    const stored = new Map<string, string>();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );
    const { result } = renderHook(() => useConversations());
    let rootId = "";
    let rootCheckpointId = "";

    await act(async () => {
      rootId = result.current.createConversation("Root question");
      result.current.addMessage({
        role: "user",
        content: "Root question",
        model: null,
        provider: null,
      });
      rootCheckpointId =
        result.current.addMessage({
          role: "assistant",
          content: "Root answer",
          model: "gpt-5.4",
          provider: "openai",
        })?.id ?? "";
    });

    let firstBranch: Awaited<
      ReturnType<typeof result.current.branchConversationAtMessage>
    > = null;
    await act(async () => {
      firstBranch =
        await result.current.branchConversationAtMessage(rootCheckpointId);
    });
    let nestedCheckpointId = "";
    await act(async () => {
      result.current.addMessage({
        role: "user",
        content: "Follow this branch",
        model: null,
        provider: null,
      });
      nestedCheckpointId =
        result.current.addMessage({
          role: "assistant",
          content: "Nested answer",
          model: "gpt-5.4",
          provider: "openai",
        })?.id ?? "";
    });

    let nestedBranch: Awaited<
      ReturnType<typeof result.current.branchConversationAtMessage>
    > = null;
    await act(async () => {
      nestedBranch =
        await result.current.branchConversationAtMessage(nestedCheckpointId);
    });

    expect(firstBranch?.conversation.branch).toEqual(
      expect.objectContaining({
        rootConversationId: rootId,
        parentConversationId: rootId,
        parentMessageId: rootCheckpointId,
        kind: "continue-from-message",
      }),
    );
    expect(nestedBranch?.conversation.branch).toEqual(
      expect.objectContaining({
        rootConversationId: rootId,
        parentConversationId: firstBranch?.conversation.id,
        parentMessageId: nestedCheckpointId,
        kind: "continue-from-message",
      }),
    );

    const firstBranchId = firstBranch?.conversation.id ?? "";
    const nestedBranchId = nestedBranch?.conversation.id ?? "";
    await expect(result.current.getConversationById(rootId)).resolves.toEqual(
      expect.objectContaining({
        knowledgeExcludedConversationIds: expect.arrayContaining([
          firstBranchId,
          nestedBranchId,
        ]),
      }),
    );
    await expect(
      result.current.getConversationById(firstBranchId),
    ).resolves.toEqual(
      expect.objectContaining({
        title: "Follow this branch",
        knowledgeExcludedConversationIds: expect.arrayContaining([
          rootId,
          nestedBranchId,
        ]),
      }),
    );
    expect(nestedBranch?.conversation.knowledgeExcludedConversationIds).toEqual(
      expect.arrayContaining([rootId, firstBranchId]),
    );
  });

  it("creates an alternative-response branch from an unedited user prompt", async () => {
    const { result } = renderHook(() => useConversations());
    let messageId = "";
    await act(async () => {
      result.current.createConversation("Try another answer");
      messageId =
        result.current.addMessage({
          role: "user",
          content: "Try another answer",
          model: null,
          provider: null,
        })?.id ?? "";
    });

    let branch: Awaited<
      ReturnType<typeof result.current.branchConversationAtMessage>
    > = null;
    await act(async () => {
      branch = await result.current.branchConversationAtMessage(messageId);
    });

    expect(branch?.conversation.branch?.kind).toBe("alternative-response");
    expect(branch?.contextMessages).toEqual([]);
    expect(branch?.checkpointMessage.role).toBe("user");
  });

  it("persists a rolling context summary on the active conversation", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Test");
    });

    await act(async () => {
      result.current.updateConversationContextSummary(
        "User prefers concise answers and is planning a launch.",
        4,
      );
    });

    expect(result.current.activeConversation?.contextSummary).toBe(
      "User prefers concise answers and is planning a launch.",
    );
    expect(result.current.activeConversation?.summarizedMessageCount).toBe(4);
    await expect(readConversation("test-uuid-1")).resolves.toMatchObject({
      summarizedMessageCount: 4,
    });
  });

  it("lets the user correct saved compact memory without changing its scope", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Memory editing");
      result.current.updateConversationContextSummary("Original summary", 4);
    });
    const conversationId = result.current.activeConversation?.id ?? "";

    await act(async () => {
      await result.current.updateConversationMemory(
        conversationId,
        "Corrected summary",
      );
    });

    expect(result.current.activeConversation).toEqual(
      expect.objectContaining({
        contextSummary: "Corrected summary",
        summarizedMessageCount: 4,
      }),
    );
  });

  it("stores summary usage events alongside conversation memory", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Usage test");
    });

    await act(async () => {
      result.current.updateConversationContextSummary(
        "User prefers quick answers.",
        2,
        {
          kind: "summary",
          source: "estimated",
          promptTokens: 80,
          completionTokens: 12,
          totalTokens: 92,
        },
        "gpt-5.4",
        "openai",
      );
    });

    expect(result.current.activeConversation?.usageEvents).toHaveLength(1);
    expect(result.current.activeConversation?.usageEvents?.[0]).toEqual(
      expect.objectContaining({
        kind: "context-summary",
        model: "gpt-5.4",
        provider: "openai",
        usage: expect.objectContaining({
          kind: "summary",
          totalTokens: 92,
        }),
      }),
    );
  });

  it("clears stored conversation memory without removing the thread", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Memory test");
    });

    await act(async () => {
      result.current.updateConversationContextSummary(
        "User wants a concise summary later.",
        3,
      );
    });

    let updatedConversation = null as Awaited<
      ReturnType<typeof result.current.clearConversationMemory>
    >;

    await act(async () => {
      updatedConversation = await result.current.clearConversationMemory(
        result.current.conversations[0].id,
      );
    });

    expect(updatedConversation?.contextSummary).toBeUndefined();
    expect(updatedConversation?.summarizedMessageCount).toBeUndefined();
    expect(result.current.activeConversation?.contextSummary).toBeUndefined();
    expect(result.current.conversations).toHaveLength(1);
  });

  it("appends messages even when using a stale callback from before conversation creation", async () => {
    const { result } = renderHook(() => useConversations());
    const staleAddMessage = result.current.addMessage;

    await act(async () => {
      result.current.createConversation("Test", "gpt-5.4", "openai");
    });

    await act(async () => {
      staleAddMessage({
        role: "assistant",
        content: "Reply",
        model: "gpt-5.4",
        provider: "openai",
      });
    });

    expect(result.current.activeConversation?.messages).toHaveLength(1);
    expect(result.current.conversations[0].lastModel).toBe("gpt-5.4");
    expect(result.current.conversations[0].lastProvider).toBe("openai");
  });

  it("backfills missing model metadata from stored conversation messages", async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === "@mrbroccoli/conversations") {
        return Promise.resolve(
          JSON.stringify([
            {
              id: "conv-1",
              title: "Existing session",
              updatedAt: "2026-03-14T10:00:00.000Z",
              lastModel: null,
            },
          ]),
        );
      }

      if (key === "@mrbroccoli/conversation/conv-1") {
        return Promise.resolve(
          JSON.stringify({
            id: "conv-1",
            title: "Existing session",
            createdAt: "2026-03-14T09:00:00.000Z",
            updatedAt: "2026-03-14T10:00:00.000Z",
            messages: [
              {
                id: "m1",
                role: "user",
                content: "Hello",
                model: null,
                provider: null,
                timestamp: "2026-03-14T09:59:00.000Z",
              },
              {
                id: "m2",
                role: "assistant",
                content: "Hi",
                model: "claude-sonnet-4-20250514",
                provider: "anthropic",
                timestamp: "2026-03-14T10:00:00.000Z",
              },
            ],
          }),
        );
      }

      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useConversations());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.conversations[0]?.lastModel).toBe(
      "claude-sonnet-4-20250514",
    );
    expect(result.current.conversations[0]?.lastProvider).toBe("anthropic");
  });

  it("updates conversation metadata when assistant replies switch providers", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Switch test", "gpt-5.4", "openai");
    });

    await act(async () => {
      result.current.addMessage({
        role: "assistant",
        content: "OpenAI reply",
        model: "gpt-5.4",
        provider: "openai",
      });
    });

    await act(async () => {
      result.current.addMessage({
        role: "assistant",
        content: "Anthropic reply",
        model: "claude-sonnet-4-20250514",
        provider: "anthropic",
      });
    });

    expect(result.current.conversations[0]?.lastModel).toBe(
      "claude-sonnet-4-20250514",
    );
    expect(result.current.conversations[0]?.lastProvider).toBe("anthropic");
  });

  it("deletes a conversation", async () => {
    const { result } = renderHook(() => useConversations());
    await act(async () => {
      result.current.createConversation("To be deleted");
    });
    const id = result.current.conversations[0].id;
    await act(async () => {
      result.current.addMessage({
        role: "user",
        content: "Delete this image",
        attachments: [
          {
            id: "delete-image",
            kind: "image",
            uri: "file:///documents/message-images/delete-image.jpg",
            mimeType: "image/jpeg",
            width: 100,
            height: 100,
            byteSize: 100,
            sharedWithProviders: ["openai"],
          },
        ],
        model: null,
        provider: null,
      });
    });
    await act(async () => {
      result.current.deleteConversation(id);
    });
    expect(result.current.conversations).toHaveLength(0);
    expect(result.current.activeConversation).toBeNull();
    await waitFor(() =>
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        "file:///documents/message-images/delete-image.jpg",
        { idempotent: true },
      ),
    );
  });

  it("renames a conversation and keeps the active conversation in sync", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Original title");
    });

    const id = result.current.conversations[0].id;

    await act(async () => {
      await result.current.renameConversation(id, "A much better title");
    });

    expect(result.current.conversations[0]?.title).toBe("A much better title");
    expect(result.current.activeConversation?.title).toBe(
      "A much better title",
    );
  });

  it("pins a conversation and sorts pinned items before recent unpinned ones", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("First");
    });

    await act(async () => {
      result.current.clearActiveConversation();
      result.current.createConversation("Second");
    });

    const firstConversationId = result.current.conversations.find(
      (conversation) => conversation.title === "First",
    )?.id;

    expect(firstConversationId).toBeTruthy();

    await act(async () => {
      result.current.toggleConversationPinned(firstConversationId!);
    });

    expect(result.current.conversations[0]?.title).toBe("First");
    expect(result.current.conversations[0]?.pinned).toBe(true);
    expect(result.current.conversations[1]?.title).toBe("Second");
  });

  it("archives sessions persistently and unarchives them when pinned", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Archive this session");
    });
    const conversationId = result.current.activeConversation?.id;

    await act(async () => {
      await result.current.toggleConversationArchived(conversationId!);
    });

    expect(result.current.activeConversation?.archived).toBe(true);
    expect(result.current.conversations[0]).toEqual(
      expect.objectContaining({ archived: true, pinned: false }),
    );

    await act(async () => {
      await result.current.toggleConversationPinned(conversationId!);
    });

    expect(result.current.activeConversation?.archived).toBe(false);
    expect(result.current.conversations[0]).toEqual(
      expect.objectContaining({ archived: false, pinned: true }),
    );
    await expect(readConversation(conversationId!)).resolves.toEqual(
      expect.objectContaining({ archived: false }),
    );
  });

  it("removes a transcript message and invalidates its derived state", async () => {
    const { result } = renderHook(() =>
      useConversations({ pastConversationKnowledgeEnabled: true }),
    );

    await act(async () => {
      result.current.createConversation("Remove one message");
    });
    const conversationId = result.current.activeConversation?.id ?? "";
    let assistantMessageId = "";
    await act(async () => {
      result.current.addMessage({
        role: "user",
        content: "Keep this question",
        model: null,
        provider: null,
      });
      assistantMessageId =
        result.current.addMessage({
          role: "assistant",
          content: "Remove this answer",
          attachments: [
            {
              id: "removed-message-image",
              kind: "image",
              uri: "file:///documents/message-images/removed-message-image.jpg",
              mimeType: "image/jpeg",
              width: 100,
              height: 100,
              byteSize: 100,
              sharedWithProviders: ["openai"],
            },
          ],
          model: "gpt-5.4",
          provider: "openai",
        })?.id ?? "";
      result.current.updateConversationContextSummary("Stale summary", 2);
    });

    await act(async () => {
      await result.current.removeMessage(assistantMessageId);
    });

    expect(result.current.activeConversation?.contextSummary).toBeUndefined();
    expect(
      result.current.activeConversation?.summarizedMessageCount,
    ).toBeUndefined();
    expect(result.current.activeConversation?.messages).toEqual([
      expect.objectContaining({ content: "Keep this question" }),
    ]);
    expect(result.current.conversations[0]).toEqual(
      expect.objectContaining({
        lastModel: null,
        lastProvider: null,
        messageCount: 1,
        providerModels: {},
        providers: [],
      }),
    );
    await expect(readConversation(conversationId)).resolves.toEqual(
      expect.objectContaining({
        messages: [expect.objectContaining({ content: "Keep this question" })],
      }),
    );
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///documents/message-images/removed-message-image.jpg",
      { idempotent: true },
    );
  });

  it("persists private status without removing in-session memory", async () => {
    const stored = new Map<string, string>();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );
    const { result } = renderHook(() =>
      useConversations({
        pastConversationKnowledgeEnabled: true,
      }),
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => {
      result.current.createConversation("Private design notes");
      result.current.updateConversationContextSummary("Keep this locally", 2);
    });
    const conversationId = result.current.activeConversation?.id;

    await act(async () => {
      await result.current.toggleConversationPrivate(conversationId!);
    });

    expect(result.current.activeConversation).toEqual(
      expect.objectContaining({
        id: conversationId,
        isPrivate: true,
        contextSummary: "Keep this locally",
      }),
    );
    expect(result.current.conversations[0]).toEqual(
      expect.objectContaining({ id: conversationId, isPrivate: true }),
    );
    await waitFor(async () => {
      await expect(readConversation(conversationId!)).resolves.toEqual(
        expect.objectContaining({ isPrivate: true }),
      );
    });
  });

  it("searches saved conversations by transcript content", async () => {
    const { result } = renderHook(() => useConversations());

    await act(async () => {
      result.current.createConversation("Trip planning", "gpt-5.4", "openai");
    });

    await act(async () => {
      result.current.addMessage({
        role: "assistant",
        content: "Remember to compare Berlin and Hamburg routes.",
        model: "gpt-5.4",
        provider: "openai",
      });
    });

    let matches = [] as Awaited<
      ReturnType<typeof result.current.searchConversations>
    >;

    await act(async () => {
      matches = await result.current.searchConversations("hamburg");
    });

    expect(matches).toHaveLength(1);
    expect(matches[0]?.title).toBe("Trip planning");
  });

  it("serializes conversation writes so an older save cannot win the race", async () => {
    // The store queues writes behind one another, so a slow first save must
    // hold the second back rather than letting it land and be overwritten.
    let releaseFirstWrite: () => void = () => undefined;
    const firstWriteGate = new Promise<void>((resolve) => {
      releaseFirstWrite = resolve;
    });
    let conversationWriteCount = 0;
    const database = await getConversationDatabase();
    const writeRow = database.runAsync as jest.Mock;
    const passThroughWrite = writeRow.getMockImplementation()!;
    writeRow.mockImplementation(async (sql: string, ...params: unknown[]) => {
      if (sql.includes("INSERT INTO conversations")) {
        conversationWriteCount += 1;
        if (conversationWriteCount === 1) {
          await firstWriteGate;
        }
      }
      return passThroughWrite(sql, ...params);
    });
    const base: Conversation = {
      id: "ordered-writes",
      title: "Ordering",
      createdAt: "2026-07-21T08:00:00.000Z",
      updatedAt: "2026-07-21T08:00:00.000Z",
      messages: [],
    };
    const newest: Conversation = {
      ...base,
      updatedAt: "2026-07-21T08:00:01.000Z",
      messages: [
        {
          id: "message-1",
          role: "user",
          content: "Keep this message",
          model: null,
          provider: null,
          timestamp: "2026-07-21T08:00:01.000Z",
        },
      ],
    };

    const firstSave = saveConversation(base);
    const newestSave = saveConversation(newest);

    // Only the first write may be in flight while the gate is held; the second
    // has to wait its turn instead of racing past and being overwritten.
    await waitFor(() => {
      expect(conversationWriteCount).toBe(1);
    });
    await new Promise((resolve) => setImmediate(resolve));
    expect(conversationWriteCount).toBe(1);
    releaseFirstWrite();
    await Promise.all([firstSave, newestSave]);
    writeRow.mockImplementation(passThroughWrite);

    await expect(readConversation(base.id)).resolves.toEqual(newest);
  });

  it("persists image paths relative to the app container and resolves them on read", async () => {
    const stored = new Map<string, string>();
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        stored.set(key, value);
      },
    );
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => stored.get(key) ?? null,
    );
    const conversation: Conversation = {
      id: "portable-image-path",
      title: "Portable image",
      createdAt: "2026-08-03T08:00:00.000Z",
      updatedAt: "2026-08-03T08:01:00.000Z",
      messages: [
        {
          id: "image-message",
          role: "user",
          content: "Keep this image across updates",
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
          model: null,
          provider: null,
          timestamp: "2026-08-03T08:00:00.000Z",
        },
      ],
    };

    await saveConversation(conversation);

    // Read the raw document column: the point is that the URI is stored
    // relative to the container, which `readConversation` deliberately undoes.
    const database = await getConversationDatabase();
    const row = await database.getFirstAsync<{ document: string }>(
      "SELECT document FROM conversations WHERE id = ?",
      conversation.id,
    );
    const serialized = JSON.parse(row?.document ?? "{}") as Conversation;
    expect(serialized.messages[0]?.attachments?.[0]?.uri).toBe(
      "message-images/image-1.jpg",
    );
    await expect(readConversation(conversation.id)).resolves.toMatchObject({
      messages: [
        {
          attachments: [
            { uri: "file:///documents/message-images/image-1.jpg" },
          ],
        },
      ],
    });
  });

  it("orders deletion after pending writes so a removed thread stays removed", async () => {
    const stored = new Map<string, string>();
    let releaseSave: () => void = () => undefined;
    const key = "@mrbroccoli/conversation/delete-after-save";
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (writeKey: string, value: string) => {
        if (writeKey === key) {
          await new Promise<void>((resolve) => {
            releaseSave = resolve;
          });
        }
        stored.set(writeKey, value);
      },
    );
    (AsyncStorage.removeItem as jest.Mock).mockImplementation(
      async (removeKey: string) => {
        stored.delete(removeKey);
      },
    );
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (readKey: string) => stored.get(readKey) ?? null,
    );
    const conversation: Conversation = {
      id: "delete-after-save",
      title: "Delete me",
      createdAt: "2026-07-21T08:00:00.000Z",
      updatedAt: "2026-07-21T08:00:00.000Z",
      messages: [],
    };

    const pendingSave = saveConversation(conversation);
    const pendingDelete = removeConversation(conversation.id);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    releaseSave();
    await Promise.all([pendingSave, pendingDelete]);

    await expect(readConversation(conversation.id)).resolves.toBeNull();
  });

});
