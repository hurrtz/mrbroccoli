import { generateInternalChat } from "../../src/services/llm";
import {
  runUlraModeDeliberation,
  UlraModeConfig,
} from "../../src/services/ulraMode";

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../src/services/llm", () => ({
  generateInternalChat: jest.fn(),
}));

const generateInternalChatMock =
  generateInternalChat as jest.MockedFunction<typeof generateInternalChat>;

const config: UlraModeConfig = {
  rounds: 2,
  routes: [
    {
      apiKey: "openai-key",
      modeId: "mode-1",
      model: "gpt-test",
      provider: "openai",
    },
    {
      apiKey: "anthropic-key",
      modeId: "mode-2",
      model: "claude-test",
      provider: "anthropic",
    },
    {
      apiKey: "gemini-key",
      modeId: "mode-3",
      model: "gemini-test",
      provider: "gemini",
    },
  ],
};

describe("runUlraModeDeliberation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    generateInternalChatMock.mockImplementation(async (params) => ({
      text: `${params.provider} response ${generateInternalChatMock.mock.calls.length}`,
      usage: {
        kind: "reply",
        source: "estimated",
        promptTokens: 10,
        completionTokens: 5,
        totalTokens: 15,
      },
    }));
  });

  it("runs independent answers, barrier-synchronized rounds, and a synthesis prompt", async () => {
    const result = await runUlraModeDeliberation({
      assistantInstructions: "Be precise.",
      config,
      language: "en",
      messages: [{ role: "user", content: "Compare these options." }],
    });

    expect(generateInternalChatMock).toHaveBeenCalledTimes(9);
    expect(result.entries).toHaveLength(9);
    expect(result.roundsCompleted).toBe(2);
    expect(result.failures).toEqual([]);
    expect(result.estimatedUsage.totalTokens).toBe(135);

    const firstRoundPrompts = generateInternalChatMock.mock.calls
      .slice(3, 6)
      .map(
        ([request]) =>
          request.messages[request.messages.length - 1]?.content,
      );
    expect(firstRoundPrompts.every((prompt) =>
      prompt?.includes('"round":0'),
    )).toBe(true);
    expect(firstRoundPrompts.some((prompt) =>
      prompt?.includes('"round":1'),
    )).toBe(false);

    const secondRoundPrompts = generateInternalChatMock.mock.calls
      .slice(6, 9)
      .map(
        ([request]) =>
          request.messages[request.messages.length - 1]?.content,
      );
    expect(secondRoundPrompts.every((prompt) =>
      prompt?.includes('"round":1'),
    )).toBe(true);
    expect(secondRoundPrompts.some((prompt) =>
      prompt?.includes('"round":2'),
    )).toBe(false);
    expect(result.synthesisPrompt).toContain(
      "Successful private contributions: 9.",
    );
  });

  it("keeps successful work and reports partial participant failures", async () => {
    generateInternalChatMock.mockImplementation(async (params) => {
      if (params.provider === "anthropic") {
        throw new Error("rate limited");
      }
      return {
        text: `${params.provider} contribution`,
        usage: {
          kind: "reply",
          source: "estimated",
          promptTokens: 4,
          completionTokens: 2,
          totalTokens: 6,
        },
      };
    });

    const result = await runUlraModeDeliberation({
      assistantInstructions: "",
      config: { ...config, rounds: 1 },
      language: "en",
      messages: [{ role: "user", content: "Question" }],
    });

    expect(result.entries).toHaveLength(4);
    expect(result.failures).toHaveLength(2);
    expect(result.roundsCompleted).toBe(1);
    expect(result.synthesisPrompt).toContain("Failed private calls: 2.");
  });

  it("fails clearly when every initial participant fails", async () => {
    generateInternalChatMock.mockRejectedValue(new Error("offline"));

    await expect(
      runUlraModeDeliberation({
        assistantInstructions: "",
        config,
        language: "en",
        messages: [{ role: "user", content: "Question" }],
      }),
    ).rejects.toThrow("Every Ultra Mode model failed");
  });

  it("does not start model calls after cancellation", async () => {
    const abortController = new AbortController();
    abortController.abort();

    const result = await runUlraModeDeliberation({
      abortSignal: abortController.signal,
      assistantInstructions: "",
      config,
      language: "en",
      messages: [{ role: "user", content: "Question" }],
    });

    expect(generateInternalChatMock).not.toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        entries: [],
        failures: [],
        roundsCompleted: 0,
        synthesisPrompt: "",
      }),
    );
  });
});
