import {
  buildConversationArchiveDocuments,
  formatConversationForAiHandoff,
  getConversationArchiveFileName,
} from "../../src/services/conversationArchiveFormat";
import type { Conversation, ConversationMeta } from "../../src/types";

function createConversation(): Conversation {
  return {
    id: "conversation/with unsafe path",
    title: "Travel plan",
    createdAt: "2026-08-02T08:00:00.000Z",
    updatedAt: "2026-08-02T08:01:00.000Z",
    contextSummary: "Private generated memory",
    settings: { llmInstructions: "Hidden conversation instructions" },
    messages: [
      {
        id: "message-1",
        role: "user",
        content: "Plan my trip to Lisbon.",
        model: null,
        provider: null,
        timestamp: "2026-08-02T08:00:00.000Z",
      },
      {
        id: "message-2",
        role: "assistant",
        content: "Start with three days in the old town.",
        model: "gpt-5.4",
        provider: "openai",
        timestamp: "2026-08-02T08:01:00.000Z",
        metadata: {
          providerState: {
            provider: "openai",
            state: { hidden: "provider receipt" },
          },
          webSearch: {
            model: "search-model",
            provider: "openai",
            query: "private search query",
            sources: [{ title: "Lisbon", url: "https://example.com" }],
            summary: "private search summary",
          },
        } as never,
      },
      {
        id: "message-3",
        role: "user",
        content: "",
        attachments: [
          {
            id: "image-1",
            kind: "image",
            uri: "file:///private/travel-photo.jpg",
            mimeType: "image/jpeg",
            width: 1_200,
            height: 800,
            byteSize: 256_000,
            sharedWithProviders: ["openai"],
          },
        ],
        model: null,
        provider: null,
        timestamp: "2026-08-02T08:02:00.000Z",
      },
    ],
  };
}

function createMeta(conversation: Conversation): ConversationMeta {
  return {
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messageCount: conversation.messages.length,
    providers: ["openai"],
    providerModels: { openai: ["gpt-5.4"] },
    lastModel: "gpt-5.4",
    lastProvider: "openai",
    pinned: true,
  };
}

describe("conversationArchiveFormat", () => {
  it("creates path-safe, stable filenames", () => {
    const name = getConversationArchiveFileName(
      "conversation/with unsafe path",
    );

    expect(name).toMatch(/^conversation-[a-f0-9]{64}\.md$/);
    expect(
      getConversationArchiveFileName("conversation/with unsafe path"),
    ).toBe(name);
    expect(name).not.toContain("/");
  });

  it("exports visible transcript content without hidden app or provider state", () => {
    const conversation = createConversation();
    const documents = buildConversationArchiveDocuments({
      activeConversationId: conversation.id,
      exportedAt: "2026-08-02T09:00:00.000Z",
      records: [{ conversation, meta: createMeta(conversation) }],
    });
    const session = [...documents.sessions.values()][0];

    expect(session).toContain("# Travel plan");
    expect(session).toContain("## User");
    expect(session).toContain("Plan my trip to Lisbon.");
    expect(session).toContain("## Assistant — OpenAI · GPT-5.4");
    expect(session).toContain("Start with three days in the old town.");
    expect(session).toContain("[1 image attached]");
    expect(session).not.toContain("file:///private/travel-photo.jpg");
    expect(session).not.toContain("Private generated memory");
    expect(session).not.toContain("Hidden conversation instructions");
    expect(session).not.toContain("provider receipt");
    expect(session).not.toContain("private search query");
    expect(session).not.toContain("private search summary");
    expect(documents.latest).toBe(session);
    expect(documents.index).toContain("[Travel plan](sessions/conversation-");
  });

  it("formats a direct share as an explicit AI handoff", () => {
    const handoff = formatConversationForAiHandoff(createConversation());

    expect(handoff).toContain("# Conversation handoff: Travel plan");
    expect(handoff).toContain(
      "Use this transcript as context and continue from its final turn.",
    );
    expect(handoff).toContain("## User");
    expect(handoff).toContain("## Assistant — OpenAI · GPT-5.4");
    expect(handoff).toContain("[1 image attached]");
    expect(handoff).not.toContain("file:///private/travel-photo.jpg");
    expect(handoff).not.toContain("Private generated memory");
  });
});
