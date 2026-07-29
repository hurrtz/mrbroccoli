let mockStoredValue: string | null = null;

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(mockStoredValue)),
  setItem: jest.fn((_key: string, value: string) => {
    mockStoredValue = value;
    return Promise.resolve();
  }),
}));

import {
  createLatencyRouteKey,
  createLatencyRouteKeys,
  getDefaultLatencyEstimateMs,
  getLatencyProgress,
  getLearnedLatencyEstimateMs,
  loadLatencyEstimate,
  recordLatencySample,
  recordLatencySamples,
} from "../../src/services/latencyStats";
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("latencyStats", () => {
  beforeEach(() => {
    mockStoredValue = null;
    jest.clearAllMocks();
  });

  it("keys LLM latency by route and response settings", () => {
    expect(
      createLatencyRouteKey({
        phase: "llm-response",
        provider: "anthropic",
        model: "claude-fable-5",
        effort: "max",
        responseLength: "thorough",
        responseTone: "socratic",
        webSearchMode: "on",
        webSearchProvider: "openai",
      }),
    ).toBe(
      "llm-response-v2:anthropic:claude-fable-5:max:thorough:socratic:on:openai",
    );
  });

  it("learns request preparation separately from provider response time", () => {
    const descriptor = {
      phase: "request-preparation" as const,
      provider: "xai" as const,
      model: "grok-4.5",
      inputSource: "voice" as const,
      webSearchMode: "on" as const,
      webSearchProvider: "openai" as const,
    };

    expect(createLatencyRouteKey(descriptor)).toBe(
      "request-preparation-v1:xai:grok-4.5:voice:on:openai",
    );
    expect(getDefaultLatencyEstimateMs(descriptor)).toBe(2_000);
  });

  it("uses conservative defaults for expensive thinking routes", () => {
    expect(
      getDefaultLatencyEstimateMs({
        phase: "llm-response",
        provider: "anthropic",
        model: "claude-fable-5",
        effort: "max",
        responseLength: "thorough",
        responseTone: "professional",
        webSearchMode: "off",
      }),
    ).toBeGreaterThanOrEqual(40_000);
  });

  it("separates and scales Uber response latency estimates", () => {
    const standardDescriptor = {
      phase: "llm-response" as const,
      provider: "openai" as const,
      model: "gpt-5.6-sol",
      responseLength: "normal" as const,
      webSearchMode: "off" as const,
    };
    const standardEstimate =
      getDefaultLatencyEstimateMs(standardDescriptor);
    const ulraDescriptor = {
      ...standardDescriptor,
      ulraModelCount: 3,
      ulraRounds: 2,
    };

    expect(createLatencyRouteKey(ulraDescriptor)).toBe(
      `${createLatencyRouteKey(standardDescriptor)}:ulra:3:2`,
    );
    expect(getDefaultLatencyEstimateMs(ulraDescriptor)).toBeGreaterThan(
      standardEstimate * 8,
    );
  });

  it("gives xhigh effort its own estimate between high and max", () => {
    const estimate = (effort: string) =>
      getDefaultLatencyEstimateMs({
        phase: "llm-response",
        provider: "openai",
        model: "gpt-5.6-sol",
        effort,
      });

    expect(estimate("xhigh")).toBeGreaterThan(estimate("high"));
    expect(estimate("xhigh")).toBeLessThan(estimate("max"));
  });

  it("keys and estimates the complete turn to first speech", () => {
    const descriptor = {
      phase: "turn-to-first-speech" as const,
      provider: "anthropic" as const,
      model: "claude-fable-5",
      effort: "max",
      responseLength: "thorough" as const,
      responseTone: "professional" as const,
      inputSource: "voice" as const,
      sttMode: "provider" as const,
      sttProvider: "gemini" as const,
      sttModel: "gemini-3.5-flash",
      spokenRepliesEnabled: true,
      ttsMode: "provider" as const,
      ttsProvider: "gemini" as const,
      ttsModel: "gemini-2.5-flash-preview-tts",
      replyPlayback: "wait" as const,
      webSearchMode: "off" as const,
    };

    expect(createLatencyRouteKey(descriptor)).toBe(
      "turn-to-first-speech-v1:anthropic:claude-fable-5:max:thorough:professional:voice:provider:gemini:gemini-3.5-flash:spoken:provider:gemini:gemini-2.5-flash-preview-tts:wait:off:none",
    );
    expect(getDefaultLatencyEstimateMs(descriptor)).toBe(53_000);
  });

  it("keys and estimates the full turn through playback completion", () => {
    const descriptor = {
      phase: "turn-to-completion" as const,
      provider: "anthropic" as const,
      model: "claude-fable-5",
      effort: "max",
      responseLength: "thorough" as const,
      responseTone: "professional" as const,
      inputSource: "voice" as const,
      sttMode: "provider" as const,
      sttProvider: "gemini" as const,
      sttModel: "gemini-3.5-flash",
      spokenRepliesEnabled: true,
      ttsMode: "provider" as const,
      ttsProvider: "gemini" as const,
      ttsModel: "gemini-2.5-flash-preview-tts",
      replyPlayback: "wait" as const,
      webSearchMode: "off" as const,
    };

    expect(createLatencyRouteKey(descriptor)).toBe(
      "turn-to-completion-v1:anthropic:claude-fable-5:max:thorough:professional:voice:provider:gemini:gemini-3.5-flash:spoken:provider:gemini:gemini-2.5-flash-preview-tts:wait:off:none",
    );
    expect(getDefaultLatencyEstimateMs(descriptor)).toBe(95_000);
  });

  it("learns transcription and speech synthesis as distinct phases", () => {
    expect(
      createLatencyRouteKey({
        phase: "stt-transcription",
        provider: "gemini",
        sttMode: "provider",
        sttModel: "gemini-3.5-flash",
      }),
    ).toBe("stt-transcription-v1:provider:gemini:gemini-3.5-flash");
    expect(
      getDefaultLatencyEstimateMs({
        phase: "stt-transcription",
        provider: null,
        sttMode: "native",
      }),
    ).toBe(2_000);

    expect(
      createLatencyRouteKey({
        phase: "tts-synthesis",
        provider: "xai",
        ttsMode: "provider",
        ttsModel: "grok-voice-1",
        responseLength: "normal",
        replyPlayback: "stream",
      }),
    ).toBe("tts-synthesis-v1:provider:xai:grok-voice-1:normal:stream");
    expect(
      getDefaultLatencyEstimateMs({
        phase: "tts-synthesis",
        provider: "xai",
        ttsMode: "provider",
        replyPlayback: "stream",
      }),
    ).toBe(3_500);
  });

  it("uses a credible cold-start estimate for streamed xAI speech", () => {
    expect(
      getDefaultLatencyEstimateMs({
        phase: "turn-to-first-speech",
        provider: "xai",
        model: "grok-4.5",
        effort: "high",
        responseLength: "normal",
        responseTone: "professional",
        inputSource: "text",
        spokenRepliesEnabled: true,
        ttsMode: "provider",
        ttsProvider: "xai",
        replyPlayback: "stream",
        webSearchMode: "off",
      }),
    ).toBe(11_500);
    expect(
      getDefaultLatencyEstimateMs({
        phase: "turn-to-completion",
        provider: "xai",
        model: "grok-4.5",
        effort: "high",
        responseLength: "normal",
        responseTone: "professional",
        inputSource: "text",
        spokenRepliesEnabled: true,
        ttsMode: "provider",
        ttsProvider: "xai",
        replyPlayback: "stream",
        webSearchMode: "off",
      }),
    ).toBe(24_500);
  });

  it("derives learned estimates from recent upper-percentile samples", () => {
    expect(
      getLearnedLatencyEstimateMs([
        8_000,
        10_000,
        12_000,
        18_000,
        24_000,
        30_000,
      ]),
    ).toBeGreaterThan(18_000);
  });

  it("does not let one extreme stall dominate an established route", () => {
    expect(
      getLearnedLatencyEstimateMs([10_000, 11_000, 12_000, 600_000]),
    ).toBeLessThan(20_000);
  });

  it("caps visual progress below complete when estimates are exceeded", () => {
    expect(getLatencyProgress(5_000, 10_000)).toMatchObject({
      overEstimate: false,
    });
    expect(getLatencyProgress(25_000, 10_000)).toMatchObject({
      overEstimate: true,
    });
    expect(getLatencyProgress(60_000, 10_000).progress).toBeLessThan(1);
  });

  it("keeps long-running model samples beyond the old three-minute cutoff", async () => {
    await recordLatencySample("llm-response-v2:test", 4 * 60_000);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/latency_stats",
      expect.stringContaining("240000"),
    );
  });

  it("learns the complete turn estimate from persisted samples", async () => {
    const descriptor = {
      phase: "turn-to-first-speech" as const,
      provider: "anthropic" as const,
      model: "claude-fable-5",
      effort: "max",
      responseLength: "thorough" as const,
      responseTone: "professional" as const,
      inputSource: "voice" as const,
      sttMode: "provider" as const,
      spokenRepliesEnabled: true,
      ttsMode: "provider" as const,
      ttsProvider: "gemini" as const,
      replyPlayback: "wait" as const,
      webSearchMode: "off" as const,
    };
    const keys = createLatencyRouteKeys(descriptor);

    await recordLatencySamples(keys, 88_000);
    await recordLatencySamples(keys, 96_000);

    await expect(loadLatencyEstimate(descriptor)).resolves.toMatchObject({
      estimatedMs: 78_350,
      learned: true,
      sampleCount: 2,
      source: "exact",
    });
  });

  it("uses related route-family samples when an exact setting combination is new", async () => {
    const firstDescriptor = {
      phase: "turn-to-first-speech" as const,
      provider: "gemini" as const,
      model: "gemini-2.5-pro",
      effort: "high",
      responseLength: "normal" as const,
      responseTone: "professional" as const,
      inputSource: "voice" as const,
      sttMode: "provider" as const,
      sttModel: "first-stt-model",
      spokenRepliesEnabled: true,
      ttsMode: "provider" as const,
      ttsProvider: "gemini" as const,
      ttsModel: "first-tts-model",
      replyPlayback: "stream" as const,
      webSearchMode: "off" as const,
    };
    const relatedDescriptor = {
      ...firstDescriptor,
      responseTone: "socratic" as const,
      sttModel: "new-stt-model",
      ttsModel: "new-tts-model",
    };

    await recordLatencySamples(createLatencyRouteKeys(firstDescriptor), 42_000);

    await expect(loadLatencyEstimate(relatedDescriptor)).resolves.toMatchObject({
      estimatedMs: 30_725,
      learned: true,
      sampleCount: 1,
      source: "family",
    });
  });

  it("bounds a lone cold-start outlier until the route has enough evidence", async () => {
    const descriptor = {
      phase: "turn-to-completion" as const,
      provider: "openai" as const,
      model: "gpt-5.4",
      effort: "medium",
      responseLength: "normal" as const,
      responseTone: "professional" as const,
      inputSource: "text" as const,
      spokenRepliesEnabled: false,
      ttsMode: "native" as const,
      replyPlayback: "stream" as const,
      webSearchMode: "off" as const,
    };
    const fallbackMs = getDefaultLatencyEstimateMs(descriptor);

    await recordLatencySamples(
      createLatencyRouteKeys(descriptor),
      10 * 60_000,
    );

    await expect(loadLatencyEstimate(descriptor)).resolves.toMatchObject({
      learned: true,
      sampleCount: 1,
      estimatedMs: expect.any(Number),
    });
    const estimate = await loadLatencyEstimate(descriptor);
    expect(estimate.estimatedMs).toBeLessThan(fallbackMs * 2);
  });

  it("serializes concurrent samples so neither observation is lost", async () => {
    await Promise.all([
      recordLatencySample("llm-response-v2:concurrent", 1_000),
      recordLatencySample("llm-response-v2:concurrent", 2_000),
    ]);

    expect(
      JSON.parse(mockStoredValue ?? "{}")["llm-response-v2:concurrent"].samples,
    ).toEqual([1_000, 2_000]);
  });

  it("ignores malformed persisted sample collections", async () => {
    const descriptor = {
      phase: "llm-response" as const,
      provider: "xai" as const,
      model: "grok-4.5",
      effort: "high",
    };
    const key = createLatencyRouteKey(descriptor);
    mockStoredValue = JSON.stringify({
      [key]: {
        samples: "not-an-array",
        updatedAt: new Date().toISOString(),
      },
    });

    await expect(loadLatencyEstimate(descriptor)).resolves.toMatchObject({
      learned: false,
      sampleCount: 0,
      source: "default",
    });
  });

  it("ignores samples whose persistence timestamp is malformed", async () => {
    const descriptor = {
      phase: "llm-response" as const,
      provider: "xai" as const,
      model: "grok-4.5",
      effort: "high",
    };
    const key = createLatencyRouteKey(descriptor);
    mockStoredValue = JSON.stringify({
      [key]: {
        samples: [40_000, 45_000, 50_000, 55_000],
        updatedAt: "not-a-date",
      },
    });

    await expect(loadLatencyEstimate(descriptor)).resolves.toMatchObject({
      learned: false,
      sampleCount: 0,
      source: "default",
    });
  });

  it("expires stale route history before learning or appending", async () => {
    const key = "llm-response-v2:stale";
    mockStoredValue = JSON.stringify({
      [key]: {
        samples: [40_000, 45_000, 50_000, 55_000],
        updatedAt: "2020-01-01T00:00:00.000Z",
      },
    });

    await recordLatencySample(key, 2_000);

    expect(JSON.parse(mockStoredValue ?? "{}")[key].samples).toEqual([2_000]);
  });
});
