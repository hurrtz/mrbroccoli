import {
  aggregateConversationUsage,
  aggregateConversationUsageByRoute,
  estimateChatUsage,
  formatTokenCount,
} from "../../src/utils/usageStats";

describe("usageStats", () => {
  it("estimates token usage for a reply", () => {
    const usage = estimateChatUsage({
      provider: "openai",
      model: "gpt-5.4",
      kind: "reply",
      systemPrompt: "You are helpful.",
      messages: [
        {
          role: "user",
          content: "Explain orbital mechanics simply.",
        },
      ],
      completionText:
        "Orbit means falling around something while moving sideways.",
    });

    expect(usage.kind).toBe("reply");
    expect(usage.source).toBe("estimated");
    expect(usage.promptTokens).toBeGreaterThan(0);
    expect(usage.completionTokens).toBeGreaterThan(0);
    expect(usage.totalTokens).toBe(usage.promptTokens + usage.completionTokens);
  });

  it("aggregates message usage and summary events per conversation", () => {
    const totals = aggregateConversationUsage({
      messages: [
        {
          id: "m1",
          role: "assistant",
          content: "Hi.",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-03-17T12:00:00.000Z",
          usage: {
            kind: "reply",
            source: "estimated",
            promptTokens: 100,
            completionTokens: 20,
            totalTokens: 120,
          },
        },
      ],
      usageEvents: [
        {
          id: "e1",
          kind: "context-summary",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-03-17T12:01:00.000Z",
          usage: {
            kind: "summary",
            source: "estimated",
            promptTokens: 80,
            completionTokens: 15,
            totalTokens: 95,
          },
        },
      ],
    });

    expect(totals.promptTokens).toBe(180);
    expect(totals.completionTokens).toBe(35);
    expect(totals.totalTokens).toBe(215);
    expect(totals.replyCount).toBe(1);
    expect(totals.summaryCount).toBe(1);
  });

  it("breaks conversation usage down by provider and model", () => {
    const routes = aggregateConversationUsageByRoute({
      messages: [
        {
          id: "m1",
          role: "assistant",
          content: "OpenAI reply",
          model: "gpt-5.4",
          provider: "openai",
          timestamp: "2026-03-17T12:00:00.000Z",
          usage: {
            kind: "reply",
            source: "estimated",
            promptTokens: 100,
            completionTokens: 20,
            totalTokens: 120,
          },
        },
        {
          id: "m2",
          role: "assistant",
          content: "Anthropic reply",
          model: "claude-sonnet-4-6",
          provider: "anthropic",
          timestamp: "2026-03-17T12:02:00.000Z",
          usage: {
            kind: "reply",
            source: "estimated",
            promptTokens: 80,
            completionTokens: 18,
            totalTokens: 98,
          },
        },
      ],
      usageEvents: [],
    });

    expect(routes).toHaveLength(2);
    expect(routes[0]).toEqual(
      expect.objectContaining({
        provider: "openai",
        model: "gpt-5.4",
        totalTokens: 120,
      }),
    );
    expect(routes[1]).toEqual(
      expect.objectContaining({
        provider: "anthropic",
        model: "claude-sonnet-4-6",
        totalTokens: 98,
      }),
    );
  });

  it("attributes Uber contributions to their actual model routes", () => {
    const routes = aggregateConversationUsageByRoute({
      messages: [
        {
          id: "m1",
          role: "assistant",
          content: "Synthesized reply",
          model: "gpt-final",
          provider: "openai",
          timestamp: "2026-03-17T12:00:00.000Z",
          usage: {
            kind: "reply",
            source: "estimated",
            promptTokens: 240,
            completionTokens: 60,
            totalTokens: 300,
          },
          metadata: {
            ulraMode: {
              contributions: [
                {
                  modeId: "mode-1",
                  model: "gpt-alt",
                  provider: "openai",
                  round: 0,
                  usage: {
                    kind: "reply",
                    source: "estimated",
                    promptTokens: 80,
                    completionTokens: 20,
                    totalTokens: 100,
                  },
                },
                {
                  modeId: "mode-2",
                  model: "claude-test",
                  provider: "anthropic",
                  round: 0,
                  usage: {
                    kind: "reply",
                    source: "estimated",
                    promptTokens: 80,
                    completionTokens: 20,
                    totalTokens: 100,
                  },
                },
              ],
              estimatedIntermediateTokens: 200,
              failedCalls: 0,
              failures: [],
              roundsCompleted: 0,
              roundsRequested: 1,
              successfulCalls: 2,
            },
          },
        },
      ],
      usageEvents: [],
    });

    expect(routes).toEqual([
      expect.objectContaining({
        provider: "openai",
        model: "gpt-final",
        totalTokens: 100,
      }),
      expect.objectContaining({
        provider: "openai",
        model: "gpt-alt",
        totalTokens: 100,
      }),
      expect.objectContaining({
        provider: "anthropic",
        model: "claude-test",
        totalTokens: 100,
      }),
    ]);
  });

  it("formats token counts for display", () => {
    expect(formatTokenCount(12345)).toBe("12,345");
  });
});
