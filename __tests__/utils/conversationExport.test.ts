import {
  formatConversationForCopy,
  formatMessageForCopy,
} from "../../src/utils/conversationExport";
import { Conversation, Message } from "../../src/types";

describe("conversationExport", () => {
  it("formats individual user messages for copying", () => {
    const message: Message = {
      id: "m-1",
      role: "user",
      content: "Explain the wind.",
      model: null,
      provider: null,
      timestamp: "2026-03-15T12:00:00.000Z",
    };

    expect(formatMessageForCopy(message, "en")).toBe("You\nExplain the wind.");
  });

  it("uses a privacy-safe placeholder instead of image data", () => {
    const message: Message = {
      id: "m-image",
      role: "user",
      content: "What is this?",
      attachments: [
        {
          id: "image-1",
          kind: "image",
          uri: "file:///private/image.jpg",
          mimeType: "image/jpeg",
          width: 100,
          height: 100,
          byteSize: 100,
          sharedWithProviders: ["openai"],
        },
      ],
      model: null,
      provider: null,
      timestamp: "2026-03-15T12:00:00.000Z",
    };

    expect(formatMessageForCopy(message, "en")).toBe(
      "You\n[Image]\nWhat is this?",
    );
  });

  it("formats assistant messages with provider and model labels", () => {
    const message: Message = {
      id: "m-2",
      role: "assistant",
      content: "Wind is moving air.",
      model: "gpt-5.4",
      provider: "openai",
      timestamp: "2026-03-15T12:00:05.000Z",
    };

    expect(formatMessageForCopy(message, "en")).toBe(
      "OpenAI · GPT-5.4\nWind is moving air.",
    );
  });

  it("keeps historical messages readable when their provider is no longer active", () => {
    const message = {
      id: "m-retired",
      role: "assistant" as const,
      content: "A historical answer.",
      model: "legacy-model",
      provider: "retired-provider",
      timestamp: "2026-03-15T12:00:05.000Z",
    } as unknown as Message;

    expect(formatMessageForCopy(message, "en")).toBe(
      "retired-provider · legacy-model\nA historical answer.",
    );
  });

  it("formats full conversations for thread copy", () => {
    const conversation: Conversation = {
      id: "c-1",
      title: "Wind basics",
      createdAt: "2026-03-15T12:00:00.000Z",
      updatedAt: "2026-03-15T12:01:00.000Z",
      messages: [
        {
          id: "m-1",
          role: "user",
          content: "Explain the wind.",
          model: null,
          provider: null,
          timestamp: "2026-03-15T12:00:00.000Z",
        },
        {
          id: "m-2",
          role: "assistant",
          content: "Wind is moving air.",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-03-15T12:00:05.000Z",
        },
      ],
    };

    expect(formatConversationForCopy(conversation, "en")).toBe(
      [
        "Conversation: Wind basics",
        "You\nExplain the wind.",
        "OpenAI · GPT-5.4\nWind is moving air.",
      ].join("\n\n"),
    );
  });

  it("includes user-approved saved insights in a thread copy", () => {
    const conversation: Conversation = {
      id: "c-2",
      title: "Product direction",
      createdAt: "2026-08-03T12:00:00.000Z",
      updatedAt: "2026-08-03T12:01:00.000Z",
      messages: [
        {
          id: "m-1",
          role: "assistant",
          content: "Offer a faster local route.",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-08-03T12:00:00.000Z",
        },
      ],
      artifacts: [
        {
          id: "a-1",
          kind: "decision",
          text: "Offer Quick and Thorough routes.",
          sourceMessageId: "m-1",
          createdAt: "2026-08-03T12:01:00.000Z",
        },
      ],
    };

    expect(formatConversationForCopy(conversation, "en")).toContain(
      "Saved insights\nDecision: Offer Quick and Thorough routes.",
    );
  });
});
