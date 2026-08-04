const mockCompletion = jest.fn();
const mockRelease = jest.fn(async () => undefined);
const mockStopCompletion = jest.fn(async () => undefined);
const mockInitLlama = jest.fn(async () => ({
  completion: mockCompletion,
  release: mockRelease,
  stopCompletion: mockStopCompletion,
}));

jest.mock("llama.rn", () => ({ initLlama: mockInitLlama }));
jest.mock("../../src/services/localModelManager", () => ({
  getLocalModelInstallStatus: jest.fn(async () => ({
    installed: true,
    path: "/models/qwen.gguf",
    verified: true,
  })),
}));
jest.mock("../../src/services/localDeviceCapabilities", () => ({
  probeLocalDeviceCapabilities: jest.fn(),
  saveLocalModelBenchmarkResult: jest.fn(),
}));

import {
  releaseLocalLlmResources,
  sanitizeLocalResponseText,
  streamLocalChat,
} from "../../src/services/localLlm";

describe("local LLM", () => {
  beforeEach(async () => {
    await releaseLocalLlmResources();
    jest.clearAllMocks();
    mockCompletion.mockImplementation(
      async (
        _params: unknown,
        onToken?: (value: { token: string }) => void,
      ) => {
        onToken?.({ token: "Local " });
        onToken?.({ token: "reply." });
        return {
          content: "Local reply.",
          text: "Local reply.",
          interrupted: false,
          tokens_evaluated: 12,
          tokens_predicted: 3,
          timings: { predicted_per_second: 8 },
        };
      },
    );
  });

  afterAll(async () => {
    await releaseLocalLlmResources();
  });

  it("streams a response from the verified local model file", async () => {
    const onChunk = jest.fn();

    await expect(
      streamLocalChat({
        messages: [
          {
            id: "message-1",
            role: "user",
            content: "Hello",
            model: null,
            provider: null,
            timestamp: "2026-08-02T00:00:00.000Z",
          },
        ],
        modelId: "qwen3-0.6b-q8",
        assistantInstructions: "Be helpful.",
        responseLength: "brief",
        responseTone: "professional",
        language: "en",
        onChunk,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        fullText: "Local reply.",
        usage: expect.objectContaining({
          promptTokens: 12,
          completionTokens: 3,
          totalTokens: 15,
        }),
      }),
    );
    expect(mockInitLlama).toHaveBeenCalledWith(
      expect.objectContaining({ model: "/models/qwen.gguf" }),
    );
    expect(mockCompletion).toHaveBeenCalledWith(
      expect.objectContaining({ enable_thinking: false }),
      expect.any(Function),
    );
    expect(onChunk).toHaveBeenNthCalledWith(1, "Local ");
    expect(onChunk).toHaveBeenNthCalledWith(2, "reply.");
  });

  it("enables Qwen thinking only for the thorough local model", async () => {
    await streamLocalChat({
      messages: [],
      modelId: "qwen3-1.7b-q8",
      assistantInstructions: "Be helpful.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      onChunk: jest.fn(),
    });

    expect(mockCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        enable_thinking: true,
        reasoning_format: "auto",
      }),
      expect.any(Function),
    );
  });

  it("keeps Qwen reasoning private and saves a plain German answer", async () => {
    mockCompletion.mockImplementationOnce(
      async (
        _params: unknown,
        onToken?: (value: {
          content?: string;
          reasoning_content?: string;
          token: string;
        }) => void,
      ) => {
        onToken?.({
          token: "<think>English reasoning",
          content: "",
          reasoning_content: "English reasoning",
        });
        onToken?.({
          token: "</think>**Versch",
          content: "**Versch",
          reasoning_content: "English reasoning",
        });
        onToken?.({
          token: "ränkung** ist faszinierend.",
          content: "**Verschränkung** ist faszinierend.",
          reasoning_content: "English reasoning",
        });
        return {
          content:
            "<think>English reasoning</think>\n\n**Verschränkung** ist faszinierend.",
          text: "<think>English reasoning</think>\n\n**Verschränkung** ist faszinierend.",
          interrupted: false,
          tokens_evaluated: 14,
          tokens_predicted: 8,
          timings: { predicted_per_second: 7 },
        };
      },
    );
    const onChunk = jest.fn();

    const result = await streamLocalChat({
      messages: [],
      modelId: "qwen3-1.7b-q8",
      assistantInstructions: "Be helpful.",
      responseLength: "normal",
      responseTone: "professional",
      language: "de",
      onChunk,
    });

    expect(result.fullText).toBe("Verschränkung ist faszinierend.");
    expect(onChunk.mock.calls.flat().join("")).toBe(
      "Verschränkung ist faszinierend.",
    );
    expect(onChunk.mock.calls.flat().join("")).not.toContain("think");
    const completionParams = mockCompletion.mock.calls[0][0];
    expect(completionParams.messages[0].content).toContain(
      "single target language is German",
    );
    expect(completionParams.messages[0].content).toContain(
      "Respond in German",
    );
  });

  it("drops an unfinished private thinking block", () => {
    expect(sanitizeLocalResponseText("<think>Still reasoning in English"))
      .toBe("");
  });
});
