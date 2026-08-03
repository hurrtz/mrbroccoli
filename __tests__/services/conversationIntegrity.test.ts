import {
  applyConversationIntegrityRepairs,
  scanConversationIntegrity,
  undoConversationIntegrityRepairs,
} from "../../src/services/conversationIntegrity";
import type { Conversation, Message } from "../../src/types";

function createMessage(
  id: string,
  role: Message["role"],
  content: string,
): Message {
  return {
    id,
    role,
    content,
    model: role === "assistant" ? "gpt-test" : null,
    provider: role === "assistant" ? "openai" : null,
    timestamp: "2026-08-03T08:00:00.000Z",
  };
}

function createConversation(messages: Message[]): Conversation {
  return {
    id: "conversation-1",
    title: "Integrity review",
    createdAt: "2026-08-03T08:00:00.000Z",
    updatedAt: "2026-08-03T08:00:00.000Z",
    messages,
  };
}

const leakedResponse = [
  "Here is the useful answer that should remain.",
  "",
  "[Truncated: earlier conversation had 6 more turn(s)]",
  "SOURCE 4 — Previous product discussion",
  "User: private historical prompt",
  "Assistant (openai/gpt-test): private historical response",
].join("\n");

describe("conversation integrity", () => {
  it("finds serialized internal context in assistant responses and previews a safe repair", () => {
    const conversation = createConversation([
      createMessage("user-1", "user", "Tell me about the product"),
      createMessage("assistant-1", "assistant", leakedResponse),
    ]);

    expect(scanConversationIntegrity(conversation)).toEqual({
      automaticallyRepairableCount: 1,
      conversationId: conversation.id,
      findings: [
        expect.objectContaining({
          kind: "assistant-internal-context",
          markerIds: expect.arrayContaining([
            "truncated-history",
            "source-header",
            "serialized-speaker",
          ]),
          messageId: "assistant-1",
          originalContent: leakedResponse,
          removedContent: expect.stringContaining("private historical prompt"),
          suggestedContent: "Here is the useful answer that should remain.",
        }),
      ],
    });
  });

  it("never edits user-authored text or flags one isolated marker", () => {
    const conversation = createConversation([
      createMessage("user-1", "user", leakedResponse),
      createMessage(
        "assistant-1",
        "assistant",
        "A document can legitimately contain a SOURCE 2 — heading.",
      ),
    ]);

    expect(scanConversationIntegrity(conversation).findings).toEqual([]);
  });

  it("flags a fully leaked response for manual review without suggesting deletion", () => {
    const conversation = createConversation([
      createMessage(
        "assistant-1",
        "assistant",
        "[Truncated: earlier conversation had 2 more turn(s)]\nUser: secret",
      ),
    ]);

    expect(scanConversationIntegrity(conversation)).toEqual(
      expect.objectContaining({
        automaticallyRepairableCount: 0,
        findings: [expect.objectContaining({ suggestedContent: null })],
      }),
    );
  });

  it("repairs only the leaked suffix and creates a reversible snapshot", () => {
    const conversation = createConversation([
      createMessage("assistant-1", "assistant", leakedResponse),
    ]);
    const repairedAt = "2026-08-03T09:00:00.000Z";

    const repair = applyConversationIntegrityRepairs(conversation, repairedAt);

    expect(repair.conversation.messages[0]?.content).toBe(
      "Here is the useful answer that should remain.",
    );
    expect(repair.conversation.updatedAt).toBe(repairedAt);
    expect(repair.snapshot).toEqual({
      conversationId: conversation.id,
      repairedAt,
      messages: [
        {
          messageId: "assistant-1",
          originalContent: leakedResponse,
          repairedContent: "Here is the useful answer that should remain.",
        },
      ],
    });

    const restored = undoConversationIntegrityRepairs(
      repair.conversation,
      repair.snapshot!,
      "2026-08-03T09:01:00.000Z",
    );
    expect(restored?.conversation.messages[0]?.content).toBe(leakedResponse);
  });

  it("refuses undo after a repaired response was edited", () => {
    const conversation = createConversation([
      createMessage("assistant-1", "assistant", leakedResponse),
    ]);
    const repair = applyConversationIntegrityRepairs(conversation);
    const editedConversation = {
      ...repair.conversation,
      messages: repair.conversation.messages.map((message) => ({
        ...message,
        content: `${message.content} User edit`,
      })),
    };

    expect(
      undoConversationIntegrityRepairs(editedConversation, repair.snapshot!),
    ).toBeNull();
  });
});
