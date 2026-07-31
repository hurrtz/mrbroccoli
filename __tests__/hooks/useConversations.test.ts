import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useConversations } from "../../src/hooks/useConversations";
import {
  readConversation,
  removeConversation,
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
      ["@mrbroccoli/conversation/restored-active-thread", JSON.stringify(conversation)],
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
      ["@mrbroccoli/conversation/legacy-title-thread", JSON.stringify(conversation)],
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
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === "@mrbroccoli/conversations") {
          metaReadCount += 1;
          if (metaReadCount === 1) {
            return new Promise<string>((resolve) => {
              releaseMetaRead = resolve;
            });
          }
        }

        return Promise.resolve(stored.get(key) ?? null);
      },
    );
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
      expect.arrayContaining([
        "stored-before-launch",
        createdConversationId,
      ]),
    );

    await waitFor(() => {
      const persistedMetas = JSON.parse(
        stored.get("@mrbroccoli/conversations") ?? "[]",
      );
      expect(persistedMetas.map(({ id }: { id: string }) => id)).toEqual(
        expect.arrayContaining([
          "stored-before-launch",
          createdConversationId,
        ]),
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
    let releaseFirstRead: (value: string) => void = () => undefined;
    let releaseSecondRead: (value: string) => void = () => undefined;
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === "@mrbroccoli/conversation/first-selection") {
        return new Promise<string>((resolve) => {
          releaseFirstRead = resolve;
        });
      }
      if (key === "@mrbroccoli/conversation/second-selection") {
        return new Promise<string>((resolve) => {
          releaseSecondRead = resolve;
        });
      }
      return Promise.resolve(null);
    });
    const { result } = renderHook(() => useConversations());

    let firstSelection = Promise.resolve();
    let secondSelection = Promise.resolve();
    act(() => {
      firstSelection = result.current.selectConversation("first-selection");
      secondSelection = result.current.selectConversation("second-selection");
    });

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "@mrbroccoli/conversation/first-selection",
      );
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "@mrbroccoli/conversation/second-selection",
      );
    });
    await act(async () => {
      releaseSecondRead(JSON.stringify(secondConversation));
      await secondSelection;
    });
    await act(async () => {
      releaseFirstRead(JSON.stringify(firstConversation));
      await firstSelection;
    });

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
    expect(JSON.parse(stored.get(
      `@mrbroccoli/conversation/${localConversation.id}`,
    )!)).toMatchObject({
      id: localConversation.id,
      title: "Local conversation",
    });
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
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      `@mrbroccoli/conversation/${firstId}`,
      expect.stringContaining('"responseLength":"thorough"'),
    );
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
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/conversation/test-uuid-1",
      expect.stringContaining('"summarizedMessageCount":4'),
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
      result.current.deleteConversation(id);
    });
    expect(result.current.conversations).toHaveLength(0);
    expect(result.current.activeConversation).toBeNull();
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
    const stored = new Map<string, string>();
    let releaseFirstWrite: () => void = () => undefined;
    let conversationWriteCount = 0;
    const key = "@mrbroccoli/conversation/ordered-writes";
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (writeKey: string, value: string) => {
        if (writeKey !== key) {
          stored.set(writeKey, value);
          return;
        }

        conversationWriteCount += 1;
        if (conversationWriteCount === 1) {
          await new Promise<void>((resolve) => {
            releaseFirstWrite = resolve;
          });
        }
        stored.set(writeKey, value);
      },
    );
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (readKey: string) => stored.get(readKey) ?? null,
    );
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
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(conversationWriteCount).toBe(1);
    releaseFirstWrite();
    await Promise.all([firstSave, newestSave]);

    await expect(readConversation(base.id)).resolves.toEqual(newest);
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
