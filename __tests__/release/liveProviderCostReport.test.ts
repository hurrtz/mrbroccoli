import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  createLiveProviderCostTracker,
  extractSanitizedProviderUsage,
  formatLiveProviderCostReportMarkdown,
  getWavDurationSeconds,
} from "../../scripts/live-provider-cost-report";
import type { LiveProviderMatrixStep } from "../../scripts/live-provider-matrix-plan";
import { STT_VALIDATION_AUDIO_BASE64 } from "../../src/services/sttValidationAudio";

const knownOpenAiStep: LiveProviderMatrixStep = {
  id: "llm:openai:gpt-5.4-2026-03-05:low",
  kind: "llm",
  provider: "openai",
  model: "gpt-5.4-2026-03-05",
  effort: "low",
  reservedUsd: 0.004,
};

const openRouterStep: LiveProviderMatrixStep = {
  id: "llm:openrouter:openai/gpt-5.6-sol-20260709:low",
  kind: "llm",
  provider: "openrouter",
  model: "openai/gpt-5.6-sol-20260709",
  effort: "low",
  reservedUsd: 0.004,
};

const pinnedOpenAiStep: LiveProviderMatrixStep = {
  id: "llm:openai:gpt-5.6-luna:low",
  kind: "llm",
  provider: "openai",
  model: "gpt-5.6-luna",
  effort: "low",
  reservedUsd: 0.004,
};

describe("live provider cost report", () => {
  it("extracts only sanitized token, direct-cost, credit, and search usage", () => {
    const usage = extractSanitizedProviderUsage(
      {
        secret: "must-never-be-retained",
        output_text: "private provider response",
        usage: {
          input_tokens: 105,
          output_tokens: 23,
          total_tokens: 128,
          cost: 0.00125,
          server_tool_use: { web_search_requests: 2 },
        },
      },
      { "character-cost": "7", authorization: "secret-header" },
    );

    expect(usage).toEqual({
      responseCount: 1,
      inputTokens: 105,
      outputTokens: 23,
      totalTokens: 128,
      searchRequests: 2,
      providerReportedCredits: 7,
      providerReportedUsd: 0.00125,
      tokenSource: "provider-response",
      unitSource: "provider-response",
    });
    expect(JSON.stringify(usage)).not.toContain("private provider response");
    expect(JSON.stringify(usage)).not.toContain("secret");
  });

  it("prefers xAI successful billable tool counts over attempted call objects", () => {
    const usage = extractSanitizedProviderUsage({
      server_side_tool_usage: {
        SERVER_SIDE_TOOL_WEB_SEARCH: 2,
      },
      output: [
        { type: "web_search_call" },
        { type: "web_search_call" },
        { type: "web_search_call" },
      ],
      usage: {
        input_tokens: 50,
        output_tokens: 10,
      },
    });

    expect(usage.searchRequests).toBe(2);
  });

  it("includes Gemini tool-input and thinking tokens in billable token totals", () => {
    const usage = extractSanitizedProviderUsage({
      usageMetadata: {
        promptTokenCount: 27,
        candidatesTokenCount: 45,
        toolUsePromptTokenCount: 31,
        thoughtsTokenCount: 10_309,
        totalTokenCount: 10_412,
      },
    });

    expect(usage).toEqual(
      expect.objectContaining({
        inputTokens: 58,
        outputTokens: 10_354,
        totalTokens: 10_412,
        tokenSource: "provider-response",
      }),
    );
  });

  it("calculates a complete catalog estimate from provider token usage", () => {
    const tracker = createLiveProviderCostTracker([knownOpenAiStep], {
      startedAt: "2026-07-31T12:00:00.000Z",
    });
    tracker.startStep(knownOpenAiStep, new Date("2026-07-31T12:00:01.000Z"));
    tracker.recordProviderResponse(knownOpenAiStep, {
      usage: {
        input_tokens: 1_000,
        output_tokens: 100,
        total_tokens: 1_100,
      },
    });
    tracker.finishStep(knownOpenAiStep, {
      passed: true,
      now: new Date("2026-07-31T12:00:02.000Z"),
    });

    const report = tracker.buildReport("2026-07-31T12:00:03.000Z");
    expect(report.summary.accountedUsd).toBe(0.004);
    expect(report.summary.upperBoundUsd).toBe(0.004);
    expect(report.summary.fullyAccountedSteps).toBe(1);
    expect(report.steps[0]).toEqual(
      expect.objectContaining({
        costSource: "catalog-estimate",
        fullyAccounted: true,
        accountedUsd: 0.004,
      }),
    );
  });

  it("uses a provider-reported dollar cost without requiring local pricing", () => {
    const tracker = createLiveProviderCostTracker([openRouterStep]);
    tracker.startStep(openRouterStep);
    tracker.recordProviderResponse(openRouterStep, {
      usage: {
        input_tokens: 100,
        output_tokens: 5,
        cost: 0.00042,
      },
    });
    tracker.finishStep(openRouterStep, { passed: true });

    const report = tracker.buildReport();
    expect(report.steps[0]).toEqual(
      expect.objectContaining({
        costSource: "provider-reported",
        fullyAccounted: true,
        accountedUsd: 0.00042,
        upperBoundUsd: 0.00042,
      }),
    );
  });

  it("uses pinned current pricing while retaining the release reservation as a conservative bound", () => {
    const tracker = createLiveProviderCostTracker([pinnedOpenAiStep]);
    tracker.startStep(pinnedOpenAiStep);
    tracker.recordProviderResponse(pinnedOpenAiStep, {
      usage: { input_tokens: 1_000, output_tokens: 100 },
    });
    tracker.finishStep(pinnedOpenAiStep, { passed: true });

    const report = tracker.buildReport();
    expect(report.steps[0]).toEqual(
      expect.objectContaining({
        costSource: "catalog-estimate",
        fullyAccounted: true,
        accountedUsd: 0.0016,
        upperBoundUsd: 0.004,
      }),
    );
    expect(report.steps[0].pricingSources).toContain(
      "https://developers.openai.com/api/docs/models",
    );
  });

  it("keeps the reservation as an upper bound when pricing is incomplete", () => {
    const tracker = createLiveProviderCostTracker([openRouterStep]);
    tracker.startStep(openRouterStep);
    tracker.finishStep(openRouterStep, {
      passed: false,
      fallbackUsage: {
        inputTokens: 10,
        outputTokens: 1,
        tokenSource: "local-estimate",
      },
    });

    const report = tracker.buildReport();
    expect(report.steps[0]).toEqual(
      expect.objectContaining({
        costSource: "unknown",
        fullyAccounted: false,
        accountedUsd: null,
        upperBoundUsd: 0.004,
      }),
    );
    expect(report.complete).toBe(false);
  });

  it("writes private, content-free JSON and Markdown artifacts", () => {
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "mrbroccoli-provider-cost-"),
    );
    const tracker = createLiveProviderCostTracker([knownOpenAiStep]);

    try {
      tracker.startStep(knownOpenAiStep);
      tracker.recordProviderResponse(knownOpenAiStep, {
        apiKey: "sk-secret-value",
        response: "private answer",
        usage: { input_tokens: 10, output_tokens: 2 },
      });
      tracker.finishStep(knownOpenAiStep, { passed: true });
      const { report, jsonPath, markdownPath } = tracker.writeReports(directory);
      const json = fs.readFileSync(jsonPath, "utf8");
      const markdown = fs.readFileSync(markdownPath, "utf8");

      expect(json).not.toContain("sk-secret-value");
      expect(json).not.toContain("private answer");
      expect(markdown).not.toContain("sk-secret-value");
      expect(formatLiveProviderCostReportMarkdown(report)).toBe(markdown);
      expect(fs.statSync(jsonPath).mode & 0o777).toBe(0o600);
      expect(fs.statSync(markdownPath).mode & 0o777).toBe(0o600);

      fs.chmodSync(jsonPath, 0o644);
      fs.chmodSync(markdownPath, 0o644);
      tracker.writeReports(directory);
      expect(fs.statSync(jsonPath).mode & 0o777).toBe(0o600);
      expect(fs.statSync(markdownPath).mode & 0o777).toBe(0o600);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it("derives the exact duration of the release WAV fixture", () => {
    expect(getWavDurationSeconds(STT_VALIDATION_AUDIO_BASE64)).toBeGreaterThan(
      0,
    );
  });
});
