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
    expect(onChunk).toHaveBeenNthCalledWith(1, "Local ");
    expect(onChunk).toHaveBeenNthCalledWith(2, "reply.");
  });
});
