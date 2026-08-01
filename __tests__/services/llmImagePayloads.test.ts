import {
  toAPIMessages,
  toOpenAICompatibleMessages,
  type ChatMessage,
} from "../../src/services/llm/shared";
import { toGeminiContents } from "../../src/services/llm/providers/geminiGenerateContent";

const imageMessage: ChatMessage = {
  role: "user",
  content: "What is shown?",
  attachments: [
    {
      id: "image-1",
      kind: "image",
      uri: "file:///message-images/image-1.png",
      mimeType: "image/png",
      width: 640,
      height: 480,
      byteSize: 800,
      sharedWithProviders: ["anthropic", "gemini", "openai"],
      data: "base64-png",
    },
  ],
};

describe("LLM image payloads", () => {
  it("uses Anthropic base64 image source blocks", () => {
    expect(toAPIMessages([imageMessage])).toEqual([
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: "base64-png",
            },
          },
          { type: "text", text: "What is shown?" },
        ],
      },
    ]);
  });

  it("uses Gemini inlineData parts", () => {
    expect(toGeminiContents([imageMessage])).toEqual([
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: "base64-png",
            },
          },
          { text: "What is shown?" },
        ],
      },
    ]);
  });

  it("uses OpenAI image data URLs", () => {
    expect(toOpenAICompatibleMessages("openai", [imageMessage])).toEqual([
      {
        role: "user",
        content: [
          { type: "text", text: "What is shown?" },
          {
            type: "image_url",
            image_url: {
              url: "data:image/png;base64,base64-png",
            },
          },
        ],
      },
    ]);
  });
});
