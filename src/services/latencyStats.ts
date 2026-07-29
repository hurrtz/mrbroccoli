import AsyncStorage from "@react-native-async-storage/async-storage";

import type { WebSearchMode, WebSearchProvider } from "../constants/webSearch";
import type {
  AssistantResponseLength,
  AssistantResponseTone,
  Provider,
  ReplyPlayback,
  SttBackendMode,
  TtsBackendMode,
  VoiceTimingProgress,
} from "../types";

const STORAGE_KEY = "@mrbroccoli/latency_stats";
const MAX_SAMPLES_PER_ROUTE = 24;
const MIN_SAMPLE_MS = 250;
const MAX_SAMPLE_MS = 10 * 60_000;
const MAX_SAMPLE_AGE_MS = 45 * 24 * 60 * 60_000;
let latencyWriteQueue: Promise<void> = Promise.resolve();

export type LatencyStatsPhase =
  | "stt-transcription"
  | "request-preparation"
  | "llm-response"
  | "web-search"
  | "tts-synthesis"
  | "turn-to-first-speech"
  | "turn-to-completion";

export interface LatencyRouteDescriptor {
  phase: LatencyStatsPhase;
  provider: Provider | WebSearchProvider | null;
  model?: string | null;
  effort?: string | null;
  responseLength?: AssistantResponseLength;
  responseTone?: AssistantResponseTone;
  webSearchMode?: WebSearchMode;
  webSearchProvider?: WebSearchProvider | null;
  inputSource?: "text" | "voice";
  sttMode?: SttBackendMode;
  sttProvider?: Provider | null;
  sttModel?: string | null;
  ttsMode?: TtsBackendMode;
  ttsProvider?: Provider | null;
  ttsModel?: string | null;
  replyPlayback?: ReplyPlayback;
  spokenRepliesEnabled?: boolean;
  ulraModelCount?: number;
  ulraRounds?: number;
}

export interface LatencyRouteStats {
  samples: number[];
  updatedAt: string;
}

type LatencyStatsStore = Record<string, LatencyRouteStats>;

export interface LatencyEstimate {
  key: string;
  keys: string[];
  estimatedMs: number;
  sampleCount: number;
  learned: boolean;
  source: "default" | "family" | "exact";
}

function normalizeKeyPart(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "none";
  }

  return value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "_");
}

export function createLatencyRouteKey(descriptor: LatencyRouteDescriptor) {
  const ulraKeyParts =
    descriptor.ulraModelCount && descriptor.ulraRounds
      ? [
          "ulra",
          String(descriptor.ulraModelCount),
          String(descriptor.ulraRounds),
        ]
      : [];

  if (descriptor.phase === "stt-transcription") {
    return [
      "stt-transcription-v1",
      normalizeKeyPart(descriptor.sttMode),
      normalizeKeyPart(descriptor.provider),
      normalizeKeyPart(descriptor.sttModel),
    ].join(":");
  }

  if (descriptor.phase === "request-preparation") {
    return [
      "request-preparation-v1",
      normalizeKeyPart(descriptor.provider),
      normalizeKeyPart(descriptor.model),
      normalizeKeyPart(descriptor.inputSource),
      normalizeKeyPart(descriptor.webSearchMode),
      normalizeKeyPart(descriptor.webSearchProvider),
    ].join(":");
  }

  if (descriptor.phase === "web-search") {
    return [
      "web",
      normalizeKeyPart(descriptor.provider),
      normalizeKeyPart(descriptor.webSearchMode),
    ].join(":");
  }

  if (
    descriptor.phase === "turn-to-first-speech" ||
    descriptor.phase === "turn-to-completion"
  ) {
    const versionedPrefix =
      descriptor.phase === "turn-to-completion"
        ? "turn-to-completion-v1"
        : "turn-to-first-speech-v1";

    return [
      versionedPrefix,
      normalizeKeyPart(descriptor.provider),
      normalizeKeyPart(descriptor.model),
      normalizeKeyPart(descriptor.effort),
      normalizeKeyPart(descriptor.responseLength),
      normalizeKeyPart(descriptor.responseTone),
      normalizeKeyPart(descriptor.inputSource),
      normalizeKeyPart(descriptor.sttMode),
      normalizeKeyPart(descriptor.sttProvider),
      normalizeKeyPart(descriptor.sttModel),
      descriptor.spokenRepliesEnabled ? "spoken" : "text-only",
      normalizeKeyPart(descriptor.ttsMode),
      normalizeKeyPart(descriptor.ttsProvider),
      normalizeKeyPart(descriptor.ttsModel),
      normalizeKeyPart(descriptor.replyPlayback),
      normalizeKeyPart(descriptor.webSearchMode),
      normalizeKeyPart(descriptor.webSearchProvider),
      ...ulraKeyParts,
    ].join(":");
  }

  if (descriptor.phase === "tts-synthesis") {
    return [
      "tts-synthesis-v1",
      normalizeKeyPart(descriptor.ttsMode),
      normalizeKeyPart(descriptor.provider),
      normalizeKeyPart(descriptor.ttsModel),
      normalizeKeyPart(descriptor.responseLength),
      normalizeKeyPart(descriptor.replyPlayback),
    ].join(":");
  }

  return [
    // v2 deliberately does not reuse the old first-token samples. The ring is
    // visible until the whole LLM response is ready, so it must learn that same
    // duration rather than an unrelated time-to-first-token metric.
    "llm-response-v2",
    normalizeKeyPart(descriptor.provider),
    normalizeKeyPart(descriptor.model),
    normalizeKeyPart(descriptor.effort),
    normalizeKeyPart(descriptor.responseLength),
    normalizeKeyPart(descriptor.responseTone),
    normalizeKeyPart(descriptor.webSearchMode),
    normalizeKeyPart(descriptor.webSearchProvider),
    ...ulraKeyParts,
  ].join(":");
}

export function createLatencyRouteKeys(descriptor: LatencyRouteDescriptor) {
  const exactKey = createLatencyRouteKey(descriptor);

  if (
    descriptor.phase !== "turn-to-first-speech" &&
    descriptor.phase !== "turn-to-completion"
  ) {
    return [exactKey];
  }

  const familyPrefix =
    descriptor.phase === "turn-to-completion"
      ? "turn-to-completion-family-v1"
      : "turn-to-first-speech-family-v1";
  const familyKey = [
    familyPrefix,
    normalizeKeyPart(descriptor.provider),
    normalizeKeyPart(descriptor.model),
    normalizeKeyPart(descriptor.effort),
    normalizeKeyPart(descriptor.responseLength),
    normalizeKeyPart(descriptor.inputSource),
    normalizeKeyPart(descriptor.sttMode),
    descriptor.spokenRepliesEnabled ? "spoken" : "text-only",
    normalizeKeyPart(descriptor.ttsMode),
    normalizeKeyPart(descriptor.ttsProvider),
    normalizeKeyPart(descriptor.replyPlayback),
    descriptor.webSearchMode && descriptor.webSearchMode !== "off"
      ? "search-on"
      : "search-off",
    ...(descriptor.ulraModelCount && descriptor.ulraRounds
      ? [`ulra-${descriptor.ulraModelCount}-${descriptor.ulraRounds}`]
      : []),
  ].join(":");

  return [exactKey, familyKey];
}

const EFFORT_ESTIMATE_MS: Record<string, number> = {
  low: 6_000,
  medium: 9_000,
  high: 14_000,
  xhigh: 20_000,
  max: 24_000,
};

function getTtsSynthesisEstimateMs(descriptor: LatencyRouteDescriptor) {
  if (descriptor.ttsMode === "kokoro") {
    return descriptor.replyPlayback === "wait" ? 5_000 : 2_500;
  }

  if (descriptor.ttsMode !== "provider") {
    return 1_500;
  }

  return descriptor.replyPlayback === "wait" ? 6_000 : 3_500;
}

function getLlmResponseEstimateMs(descriptor: LatencyRouteDescriptor) {
  const effort = normalizeKeyPart(descriptor.effort);
  const model = normalizeKeyPart(descriptor.model);
  const provider = normalizeKeyPart(descriptor.provider);
  let estimateMs = EFFORT_ESTIMATE_MS[effort] ?? 8_000;

  // xAI's current chat-completions routes usually reach a complete first
  // sentence quickly even with high reasoning effort. Keep cold-start UI
  // estimates credible; route-specific observations replace these priors.
  if (provider === "xai") {
    estimateMs = effort === "high" ? 9_000 : effort === "low" ? 6_000 : 8_000;
  }

  if (provider === "anthropic") {
    estimateMs += 4_000;
  }
  if (model.includes("fable") || model.includes("opus")) {
    estimateMs += 6_000;
  }
  if (descriptor.responseLength === "thorough") {
    estimateMs += 6_000;
  } else if (descriptor.responseLength === "brief") {
    estimateMs -= 2_000;
  }
  if (
    descriptor.webSearchMode &&
    descriptor.webSearchMode !== "off" &&
    descriptor.webSearchProvider
  ) {
    estimateMs += 4_000;
  }
  if (descriptor.ulraModelCount && descriptor.ulraRounds) {
    // Each Ulra stage runs its participants concurrently, while the initial
    // assessment, review rounds, and final synthesis remain sequential.
    estimateMs *= descriptor.ulraRounds + 2;
  }

  return estimateMs;
}

function getInputEstimateMs(descriptor: LatencyRouteDescriptor) {
  if (descriptor.inputSource !== "voice") {
    return 0;
  }

  return descriptor.sttMode === "provider" ? 4_000 : 2_000;
}

function getFirstSpeechEstimateMs(descriptor: LatencyRouteDescriptor) {
  if (!descriptor.spokenRepliesEnabled) {
    return 0;
  }

  if (descriptor.ttsMode === "provider") {
    if (descriptor.replyPlayback !== "wait") {
      return descriptor.ttsProvider === "xai" ? 2_500 : 3_500;
    }

    return descriptor.responseLength === "thorough"
      ? 9_000
      : descriptor.responseLength === "brief"
        ? 3_500
        : 6_500;
  }

  if (descriptor.ttsMode === "kokoro") {
    return descriptor.replyPlayback === "wait" ? 5_000 : 2_500;
  }

  return descriptor.replyPlayback === "wait" ? 2_500 : 1_000;
}

function getCompletionSpeechEstimateMs(descriptor: LatencyRouteDescriptor) {
  if (!descriptor.spokenRepliesEnabled) {
    return 0;
  }

  const playbackMs =
    descriptor.responseLength === "thorough"
      ? 45_000
      : descriptor.responseLength === "brief"
        ? 7_000
        : 20_000;
  const synthesisMs =
    descriptor.ttsMode === "provider"
      ? descriptor.replyPlayback === "wait"
        ? 6_000
        : descriptor.ttsProvider === "xai"
          ? 2_500
          : 3_500
      : descriptor.ttsMode === "kokoro"
        ? descriptor.replyPlayback === "wait"
          ? 5_000
          : 2_500
        : descriptor.replyPlayback === "wait"
          ? 2_500
          : 1_000;

  // Streamed speech overlaps with response generation. Only the residual
  // playback tail belongs on top of the full-response estimate; wait mode
  // begins playback after generation and therefore adds the full duration.
  return (
    synthesisMs +
    (descriptor.replyPlayback === "wait"
      ? playbackMs
      : Math.round(playbackMs * 0.65))
  );
}

export function getDefaultLatencyEstimateMs(
  descriptor: LatencyRouteDescriptor,
) {
  if (descriptor.phase === "stt-transcription") {
    return descriptor.sttMode === "provider" ? 4_000 : 2_000;
  }

  if (descriptor.phase === "request-preparation") {
    return 2_000;
  }

  if (descriptor.phase === "web-search") {
    return 6_000;
  }

  if (descriptor.phase === "tts-synthesis") {
    return getTtsSynthesisEstimateMs(descriptor);
  }

  let estimateMs = getLlmResponseEstimateMs(descriptor);

  if (descriptor.phase === "llm-response") {
    return Math.max(4_000, estimateMs);
  }

  estimateMs += getInputEstimateMs(descriptor);
  estimateMs +=
    descriptor.phase === "turn-to-first-speech"
      ? getFirstSpeechEstimateMs(descriptor)
      : getCompletionSpeechEstimateMs(descriptor);

  return Math.max(5_000, estimateMs);
}

function percentile(sortedSamples: number[], fraction: number) {
  if (sortedSamples.length === 0) {
    return 0;
  }

  const index = Math.min(
    sortedSamples.length - 1,
    Math.max(0, Math.ceil(sortedSamples.length * fraction) - 1),
  );

  return sortedSamples[index] ?? sortedSamples[sortedSamples.length - 1] ?? 0;
}

export function getLearnedLatencyEstimateMs(samples: number[]) {
  if (samples.length === 0) {
    return 0;
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const p50 = percentile(sorted, 0.5);
  const p75 = percentile(sorted, 0.75);
  const p90 = percentile(sorted, 0.9);

  if (samples.length < 4) {
    return Math.round((p50 + p75) / 2);
  }

  // A single network stall must not teach the CTA to count down for minutes.
  // Once slower observations become representative they also lift p50/p75,
  // so sustained route changes still replace the prior naturally.
  const robustP90 = Math.min(p90, Math.max(p75 * 2, p50 * 3));

  return Math.round(p75 * 0.72 + robustP90 * 0.28);
}

export function getLatencyProgress(
  elapsedMs: number,
  estimatedMs: number,
): Pick<VoiceTimingProgress, "progress" | "overEstimate"> {
  const safeEstimateMs = Math.max(1, estimatedMs);

  if (elapsedMs <= safeEstimateMs) {
    const ratio = elapsedMs / safeEstimateMs;

    return {
      progress: Math.min(0.9, 0.06 + Math.pow(ratio, 0.78) * 0.84),
      overEstimate: false,
    };
  }

  const overRatio = (elapsedMs - safeEstimateMs) / safeEstimateMs;

  return {
    progress: Math.min(0.97, 0.9 + (1 - Math.exp(-overRatio)) * 0.07),
    overEstimate: true,
  };
}

function parseStore(raw: string | null): LatencyStatsStore {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as LatencyStatsStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getStoredSamples(
  stats: LatencyRouteStats | undefined,
  nowMs = Date.now(),
) {
  if (!stats || typeof stats !== "object" || !Array.isArray(stats.samples)) {
    return [];
  }

  const updatedAtMs = Date.parse(stats.updatedAt);
  if (
    !Number.isFinite(updatedAtMs) ||
    nowMs - updatedAtMs > MAX_SAMPLE_AGE_MS
  ) {
    return [];
  }

  return stats.samples.filter(
    (sample) =>
      Number.isFinite(sample) &&
      sample >= MIN_SAMPLE_MS &&
      sample <= MAX_SAMPLE_MS,
  );
}

export async function loadLatencyEstimate(
  descriptor: LatencyRouteDescriptor,
): Promise<LatencyEstimate> {
  await latencyWriteQueue.catch(() => undefined);
  const keys = createLatencyRouteKeys(descriptor);
  const [key, familyKey] = keys;
  const fallbackMs = getDefaultLatencyEstimateMs(descriptor);
  const store = parseStore(await AsyncStorage.getItem(STORAGE_KEY));
  const exactSamples = getStoredSamples(store[key]);
  const familySamples = familyKey
    ? getStoredSamples(store[familyKey])
    : [];
  const exactMs = getLearnedLatencyEstimateMs(exactSamples);
  const familyMs = getLearnedLatencyEstimateMs(familySamples);

  if (exactMs > 0 && exactSamples.length >= 4) {
    return {
      key,
      keys,
      estimatedMs: exactMs,
      sampleCount: exactSamples.length,
      learned: true,
      source: "exact",
    };
  }

  if (familyMs > 0 && familySamples.length >= 4) {
    const exactWeight = exactMs
      ? Math.min(0.8, 0.35 + exactSamples.length * 0.15)
      : 0;
    const estimatedMs = exactMs
      ? Math.round(exactMs * exactWeight + familyMs * (1 - exactWeight))
      : familyMs;

    return {
      key,
      keys,
      estimatedMs,
      sampleCount: familySamples.length,
      learned: true,
      source: exactMs ? "exact" : "family",
    };
  }

  const earlyEstimateMs = exactMs || familyMs;
  const earlySampleCount = exactMs
    ? exactSamples.length
    : familySamples.length;

  if (earlyEstimateMs > 0) {
    // Until a route has enough observations to establish its own distribution,
    // keep a lone fast response or transient stall from replacing the prior.
    // At four samples the exact/family branches above use observed timings
    // without this cold-start bound.
    const boundedEarlyEstimateMs = Math.min(
      fallbackMs * 3,
      Math.max(fallbackMs * 0.45, earlyEstimateMs),
    );
    // One real route observation is more useful than a generic provider prior,
    // while the remaining default weight still cushions cold-start outliers.
    const learnedWeight =
      earlySampleCount >= 3 ? 0.8 : earlySampleCount === 2 ? 0.65 : 0.45;
    return {
      key,
      keys,
      estimatedMs: Math.round(
        fallbackMs * (1 - learnedWeight) +
          boundedEarlyEstimateMs * learnedWeight,
      ),
      sampleCount: earlySampleCount,
      learned: true,
      source: exactMs ? "exact" : "family",
    };
  }

  return {
    key,
    keys,
    estimatedMs: fallbackMs,
    sampleCount: 0,
    learned: false,
    source: "default",
  };
}

export async function recordLatencySamples(
  keys: string[],
  durationMs: number,
): Promise<void> {
  if (
    keys.length === 0 ||
    !Number.isFinite(durationMs) ||
    durationMs < MIN_SAMPLE_MS ||
    durationMs > MAX_SAMPLE_MS
  ) {
    return;
  }

  const write = latencyWriteQueue
    .catch(() => undefined)
    .then(async () => {
      const store = parseStore(await AsyncStorage.getItem(STORAGE_KEY));
      const updatedAt = new Date().toISOString();

      for (const key of [...new Set(keys.filter(Boolean))]) {
        const current = getStoredSamples(store[key]);
        const samples = [...current, Math.round(durationMs)].slice(
          -MAX_SAMPLES_PER_ROUTE,
        );

        store[key] = {
          samples,
          updatedAt,
        };
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    });

  latencyWriteQueue = write.catch(() => undefined);
  await write;
}

export async function recordLatencySample(
  key: string,
  durationMs: number,
): Promise<void> {
  await recordLatencySamples([key], durationMs);
}
