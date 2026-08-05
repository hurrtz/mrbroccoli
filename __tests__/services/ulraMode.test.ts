import { generateInternalChat } from "../../src/services/llm";
import { recordDebugLogEvent } from "../../src/services/debugLogCapture";
import { ProviderRequestError } from "../../src/services/providerErrors";
import {
  getUlraModeFailureParticipants,
  runUlraModeDeliberation,
  ULRA_MODE_MAX_CONTRIBUTION_CHARACTERS,
  ULRA_MODE_PARTICIPANT_TIMEOUT_MS,
  ULRA_MODE_SYNTHESIS_HISTORY_TOKEN_BUDGET,
  UlraModeConfig,
} from "../../src/services/ulraMode";

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../src/services/llm", () => ({
  generateInternalChat: jest.fn(),
}));

const generateInternalChatMock = generateInternalChat as jest.MockedFunction<
  typeof generateInternalChat
>;
const recordDebugLogEventMock = recordDebugLogEvent as jest.MockedFunction<
  typeof recordDebugLogEvent
>;

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
      model: params.model,
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
      conversationSummary: "The user previously selected option B.",
      language: "en",
      messages: [{ role: "user", content: "Compare these options." }],
    });

    expect(generateInternalChatMock).toHaveBeenCalledTimes(9);
    expect(result.entries).toHaveLength(9);
    expect(result.roundsCompleted).toBe(2);
    expect(result.failures).toEqual([]);
    expect(result.estimatedUsage.totalTokens).toBe(135);

    expect(result.convergenceReached).toBe(false);
    expect(result.synthesisContract).toBe("evidence-ledger-v1");
    expect(result.synthesisContributions).toBe(9);
    expect(result.synthesisOmittedContributions).toBe(0);
    expect(result.synthesisEstimatedTokens).toBeGreaterThan(0);
    expect(
      generateInternalChatMock.mock.calls.every(
        ([request]) =>
          request.messages.length === 1 &&
          request.messages[0]?.content === "Compare these options.",
      ),
    ).toBe(true);
    expect(
      generateInternalChatMock.mock.calls.every(([request]) =>
        request.systemPrompt.includes(
          "Earlier conversation summary for background context only",
        ),
      ),
    ).toBe(true);

    const firstRoundPrompts = generateInternalChatMock.mock.calls
      .slice(3, 6)
      .map(([request]) => request.systemPrompt);
    expect(
      firstRoundPrompts.every((prompt) => prompt?.includes('"round":0')),
    ).toBe(true);
    expect(
      firstRoundPrompts.some((prompt) => prompt?.includes('"round":1')),
    ).toBe(false);

    const secondRoundPrompts = generateInternalChatMock.mock.calls
      .slice(6, 9)
      .map(([request]) => request.systemPrompt);
    expect(
      secondRoundPrompts.every((prompt) => prompt?.includes('"round":1')),
    ).toBe(true);
    expect(
      secondRoundPrompts.some((prompt) => prompt?.includes('"round":0')),
    ).toBe(false);
    expect(
      secondRoundPrompts.some((prompt) => prompt?.includes('"round":2')),
    ).toBe(false);
    expect(result.synthesisPrompt).toContain(
      "Successful private contributions retained: 9.",
    );
    expect(result.synthesisPrompt.match(/"participant":/g)).toHaveLength(9);
    expect(result.synthesisPrompt).toContain('"round":0');
    expect(result.synthesisPrompt).toContain('"round":1');
    expect(result.synthesisPrompt).toContain('"round":2');
    expect(result.synthesisPrompt).toContain(
      "retained successful private Uber Mode history",
    );
    expect(result.synthesisPrompt).toContain(
      "highest available round as its current position",
    );
    expect(result.synthesisPrompt).toContain(
      "Older superseded contributions omitted for context safety: 0.",
    );
    expect(result.synthesisPrompt).toContain(
      "Give well-supported minority critiques full consideration",
    );
    expect(result.synthesisPrompt).toContain("evidence-ledger-v1");
    expect(result.synthesisPrompt).toContain("privately build a claim ledger");
    expect(result.synthesisPrompt).toContain("reasoned inferences");
    expect(result.synthesisPrompt).toContain(
      "assumptions that still need verification",
    );
    expect(result.synthesisPrompt).toContain(
      "unresolved challenges or dissent",
    );
    expect(result.synthesisPrompt).toContain(
      "Never invent evidence or citations",
    );
    expect(result.synthesisPrompt).toContain("Completed review rounds: 2.");
    expect(result.synthesisPrompt).toContain(
      "Unanimous explicit convergence reached: no.",
    );
    expect(firstRoundPrompts[0]).toContain("Actively stress-test");
    expect(firstRoundPrompts[0]).toContain("UBER_REVIEW: CHALLENGE");
    expect(firstRoundPrompts[0]).toContain("never manufacture disagreement");
    expect(
      generateInternalChatMock.mock.calls.every(
        ([request]) => !request.systemPrompt.includes("250 words"),
      ),
    ).toBe(true);
    expect(firstRoundPrompts[0]).toContain(
      "all material reasoning and evidence",
    );
    expect(firstRoundPrompts[0]).not.toContain('"provider":');
    expect(firstRoundPrompts[0]).not.toContain('"model":');
    expect(firstRoundPrompts[0]).not.toContain('"modeId":');
    expect(result.synthesisPrompt).not.toContain('"provider":');
    expect(result.synthesisPrompt).not.toContain('"model":');
  });

  it("stops unused review rounds only after unanimous explicit convergence", async () => {
    generateInternalChatMock.mockImplementation(async (params) => ({
      model: params.model,
      text: params.systemPrompt.includes("review round")
        ? "UBER_REVIEW: CONVERGED\nThe positions survive stress-testing."
        : `${params.provider} independent position`,
      usage: {
        kind: "reply",
        source: "estimated",
        promptTokens: 10,
        completionTokens: 5,
        totalTokens: 15,
      },
    }));

    const result = await runUlraModeDeliberation({
      assistantInstructions: "",
      config: { ...config, rounds: 5 },
      language: "en",
      messages: [{ role: "user", content: "Question" }],
    });

    expect(generateInternalChatMock).toHaveBeenCalledTimes(6);
    expect(result.entries).toHaveLength(6);
    expect(result.roundsCompleted).toBe(1);
    expect(result.convergenceReached).toBe(true);
    expect(result.synthesisPrompt).not.toContain("UBER_REVIEW");
    expect(result.synthesisPrompt).toContain('"round":0');
    expect(result.synthesisPrompt).toContain('"round":1');
    expect(result.synthesisPrompt.match(/"participant":/g)).toHaveLength(6);
    expect(result.synthesisPrompt).toContain('"reviewVerdict":"converged"');
    expect(result.synthesisPrompt).toContain(
      "Unanimous explicit convergence reached: yes.",
    );
  });

  it("continues when models challenge peers or omit the convergence marker", async () => {
    generateInternalChatMock.mockImplementation(async (params) => ({
      model: params.model,
      text: params.systemPrompt.includes("review round 1")
        ? "UBER_REVIEW: CHALLENGE\nA material assumption remains unsupported."
        : params.systemPrompt.includes("review round 2")
          ? "The marker was omitted, so convergence is unproven."
          : `${params.provider} independent position`,
      usage: {
        kind: "reply",
        source: "estimated",
        promptTokens: 10,
        completionTokens: 5,
        totalTokens: 15,
      },
    }));

    const result = await runUlraModeDeliberation({
      assistantInstructions: "",
      config: { ...config, rounds: 2 },
      language: "en",
      messages: [{ role: "user", content: "Question" }],
    });

    expect(generateInternalChatMock).toHaveBeenCalledTimes(9);
    expect(result.roundsCompleted).toBe(2);
    expect(result.convergenceReached).toBe(false);
    expect(result.synthesisPrompt).toContain('"reviewVerdict":"challenge"');
  });

  it("uses a generous emergency bound for runaway contributions", async () => {
    const oversizedResponse = `Opening evidence ${"x".repeat(
      ULRA_MODE_MAX_CONTRIBUTION_CHARACTERS * 2,
    )} final conclusion`;
    generateInternalChatMock.mockImplementation(async (params) => ({
      model: params.model,
      text: oversizedResponse,
      usage: {
        kind: "reply",
        source: "estimated",
        promptTokens: 10,
        completionTokens: 2_000,
        totalTokens: 2_010,
      },
    }));

    const result = await runUlraModeDeliberation({
      assistantInstructions: "",
      config: { ...config, rounds: 1 },
      language: "en",
      messages: [{ role: "user", content: "Question" }],
    });

    expect(ULRA_MODE_MAX_CONTRIBUTION_CHARACTERS).toBe(8_000);
    expect(
      result.entries.every(
        ({ text }) => text.length <= ULRA_MODE_MAX_CONTRIBUTION_CHARACTERS,
      ),
    ).toBe(true);
    expect(result.entries[0]?.text).toContain("Middle omitted");
    expect(result.entries[0]?.text).toContain("Opening evidence");
    expect(result.entries[0]?.text).toContain("final conclusion");
    expect(result.synthesisPrompt.match(/"participant":/g)).toHaveLength(6);
    expect(result.synthesisPrompt.length).toBeLessThan(
      oversizedResponse.length * result.entries.length,
    );
  });

  it("retains every latest position while dropping only older history under context pressure", async () => {
    const oversizedResponse = `Opening evidence ${"x".repeat(
      ULRA_MODE_MAX_CONTRIBUTION_CHARACTERS * 2,
    )} final conclusion`;
    generateInternalChatMock.mockImplementation(async (params) => ({
      model: params.model,
      text: oversizedResponse,
      usage: {
        kind: "reply",
        source: "estimated",
        promptTokens: 10,
        completionTokens: 2_000,
        totalTokens: 2_010,
      },
    }));

    const result = await runUlraModeDeliberation({
      assistantInstructions: "",
      config: { ...config, rounds: 4 },
      language: "en",
      messages: [{ role: "user", content: "Question" }],
    });

    expect(ULRA_MODE_SYNTHESIS_HISTORY_TOKEN_BUDGET).toBe(24_000);
    expect(result.entries).toHaveLength(15);
    expect(result.synthesisPrompt.match(/"round":4/g)).toHaveLength(3);
    const synthesisEntries =
      result.synthesisPrompt.match(/"participant":/g) ?? [];
    expect(synthesisEntries.length).toBeLessThan(result.entries.length);
    expect(result.synthesisContributions).toBe(synthesisEntries.length);
    expect(result.synthesisOmittedContributions).toBeGreaterThan(0);
    expect(result.synthesisPrompt).toMatch(
      /Older superseded contributions omitted for context safety: [1-9]\d*\./,
    );
  });

  it("keeps successful work and reports partial participant failures", async () => {
    generateInternalChatMock.mockImplementation(async (params) => {
      if (params.provider === "anthropic") {
        throw new Error("rate limited");
      }
      return {
        model: params.model,
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
    expect(result.convergenceReached).toBe(false);
    expect(result.synthesisPrompt).toContain("Failed private calls: 2.");
  });

  it("times out and retires a private participant that never settles", async () => {
    jest.useFakeTimers();

    try {
      let hungRequestSignal: AbortSignal | undefined;
      generateInternalChatMock.mockImplementation(async (params) => {
        if (params.provider === "anthropic") {
          hungRequestSignal = params.abortSignal;
          return new Promise(() => undefined);
        }

        return {
          model: params.model,
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

      let result: Awaited<ReturnType<typeof runUlraModeDeliberation>> | null =
        null;
      const deliberationPromise = runUlraModeDeliberation({
        assistantInstructions: "",
        config: { ...config, rounds: 1 },
        language: "en",
        messages: [{ role: "user", content: "Question" }],
      }).then((value) => {
        result = value;
        return value;
      });

      await jest.advanceTimersByTimeAsync(0);

      expect(
        recordDebugLogEventMock.mock.calls.filter(
          ([event]) => event.event === "ulra-mode-participant-completed",
        ),
      ).toHaveLength(2);
      expect(
        recordDebugLogEventMock.mock.calls.some(
          ([event]) => event.event === "ulra-mode-round-completed",
        ),
      ).toBe(false);

      await jest.advanceTimersByTimeAsync(ULRA_MODE_PARTICIPANT_TIMEOUT_MS);

      expect(result).not.toBeNull();
      expect(await deliberationPromise).toEqual(
        expect.objectContaining({
          retiredParticipants: 1,
          roundsCompleted: 1,
        }),
      );
      expect(hungRequestSignal?.aborted).toBe(true);
      expect(generateInternalChatMock).toHaveBeenCalledTimes(5);
      expect(result?.entries).toHaveLength(4);
      expect(result?.failures).toEqual([
        expect.objectContaining({
          failureKind: "timeout",
          participant: 2,
          round: 0,
        }),
      ]);
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not call a terminally failed participant in later rounds", async () => {
    generateInternalChatMock.mockImplementation(async (params) => {
      if (params.provider === "anthropic") {
        throw new ProviderRequestError({
          action: "reply",
          failureKind: "quota",
          message: "Quota exhausted",
          provider: "anthropic",
          status: 429,
        });
      }
      return {
        model: params.model,
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
      config: { ...config, rounds: 2 },
      language: "en",
      messages: [{ role: "user", content: "Question" }],
    });

    expect(
      generateInternalChatMock.mock.calls.filter(
        ([request]) => request.provider === "anthropic",
      ),
    ).toHaveLength(1);
    expect(generateInternalChatMock).toHaveBeenCalledTimes(7);
    expect(result.entries).toHaveLength(6);
    expect(result.failures).toEqual([
      expect.objectContaining({
        failureKind: "quota",
        participant: 2,
        round: 0,
      }),
    ]);
    expect(result.roundsCompleted).toBe(2);
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
    ).rejects.toThrow("Every Model Council model failed");
  });

  it("summarizes repeated failures as calls from one participant", () => {
    expect(
      getUlraModeFailureParticipants([
        {
          message: "rate limited",
          modeId: "mode-3",
          model: "gemini-3.1-pro-preview",
          participant: 3,
          provider: "gemini",
          round: 0,
        },
        {
          message: "rate limited",
          modeId: "mode-3",
          model: "gemini-3.1-pro-preview",
          participant: 3,
          provider: "gemini",
          round: 1,
        },
      ]),
    ).toEqual(["#3 · Google / gemini-3.1-pro-preview · ×2"]);
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
