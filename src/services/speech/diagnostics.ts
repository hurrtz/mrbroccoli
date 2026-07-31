import type { TtsBackendMode, TtsListenLanguage } from "../../types";
import { recordDebugLogEvent } from "../debugLogCapture";

export type SpeechDiagnosticSource =
  | "conversation"
  | "repeat"
  | "preview"
  | "unknown";

export type SpeechDiagnosticStage =
  | "tts-requested"
  | "tts-succeeded"
  | "tts-fallback"
  | "tts-failed"
  | "local-attempt"
  | "local-failed"
  | "playback-enqueued"
  | "playback-started"
  | "playback-finished"
  | "playback-stopped"
  | "playback-drained";

export type SpeechDiagnosticRoute =
  | "kokoro"
  | "local"
  | "provider"
  | "native";

export interface SpeechDiagnosticsContext {
  requestId?: string;
  source?: SpeechDiagnosticSource;
  mode?: TtsBackendMode;
  provider?: string | null;
  providerModel?: string | null;
  language?: TtsListenLanguage | "app";
  voice?: string | null;
  turnId?: string;
}

export interface SpeechDiagnosticEvent {
  id: string;
  createdAt: string;
  requestId?: string;
  source: SpeechDiagnosticSource;
  stage: SpeechDiagnosticStage;
  requestedRoute?: SpeechDiagnosticRoute;
  actualRoute?: SpeechDiagnosticRoute;
  language?: TtsListenLanguage | "app";
  mode?: TtsBackendMode;
  provider?: string | null;
  providerModel?: string | null;
  voice?: string | null;
  message?: string;
  fallbackReason?: string;
  textLength?: number;
  turnId?: string;
}

export interface SpeechDiagnosticRequestSummary {
  id: string;
  requestId: string;
  createdAt: string;
  source: SpeechDiagnosticSource;
  latestStage: SpeechDiagnosticStage;
  requestedRoute: SpeechDiagnosticRoute | null;
  actualRoute: SpeechDiagnosticRoute | null;
  language: TtsListenLanguage | "app" | null;
  provider: string | null;
  providerModel: string | null;
  voice: string | null;
  fallbackReason: string | null;
  message: string | null;
  textLength: number | null;
}

const MAX_SPEECH_DIAGNOSTICS = 200;

let speechDiagnosticEvents: SpeechDiagnosticEvent[] = [];
const speechDiagnosticsListeners = new Set<() => void>();
const turnIdsByRequestId = new Map<string, string>();

function nextSpeechDiagnosticId() {
  return `speech-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function notifySpeechDiagnosticsListeners() {
  speechDiagnosticsListeners.forEach((listener) => {
    listener();
  });
}

export function createSpeechRequestId(prefix = "speech") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function recordSpeechDiagnostic(
  event: Omit<SpeechDiagnosticEvent, "id" | "createdAt">,
) {
  if (event.requestId && event.turnId) {
    turnIdsByRequestId.set(event.requestId, event.turnId);
  }
  const turnId =
    event.turnId ??
    (event.requestId ? turnIdsByRequestId.get(event.requestId) : undefined);
  const entry: SpeechDiagnosticEvent = {
    ...event,
    turnId,
    id: nextSpeechDiagnosticId(),
    createdAt: new Date().toISOString(),
    source: event.source ?? "unknown",
  };

  speechDiagnosticEvents = [entry, ...speechDiagnosticEvents].slice(
    0,
    MAX_SPEECH_DIAGNOSTICS,
  );
  if (turnIdsByRequestId.size > MAX_SPEECH_DIAGNOSTICS) {
    const retainedRequestIds = new Set(
      speechDiagnosticEvents.flatMap((diagnostic) =>
        diagnostic.requestId ? [diagnostic.requestId] : [],
      ),
    );
    turnIdsByRequestId.forEach((_turnId, requestId) => {
      if (!retainedRequestIds.has(requestId)) {
        turnIdsByRequestId.delete(requestId);
      }
    });
  }
  notifySpeechDiagnosticsListeners();
  recordDebugLogEvent({
    category: "speech",
    event: entry.stage,
    level: entry.stage === "tts-failed" ? "warn" : "info",
    payload: {
      actualRoute: entry.actualRoute ?? null,
      fallbackReason: entry.fallbackReason ?? null,
      language: entry.language ?? null,
      message: entry.message ?? null,
      provider: entry.provider ?? null,
      providerModel: entry.providerModel ?? null,
      requestId: entry.requestId ?? null,
      requestedRoute: entry.requestedRoute ?? null,
      source: entry.source,
      textLength: entry.textLength ?? null,
      turnId: entry.turnId ?? null,
      voice: entry.voice ?? null,
    },
  });

  if (
    typeof __DEV__ !== "undefined" &&
    __DEV__ &&
    process.env.NODE_ENV !== "test"
  ) {
    console.info("[speech]", JSON.stringify(entry));
  }

  return entry;
}

export function getSpeechDiagnostics() {
  return [...speechDiagnosticEvents];
}

export function subscribeToSpeechDiagnostics(listener: () => void) {
  speechDiagnosticsListeners.add(listener);

  return () => {
    speechDiagnosticsListeners.delete(listener);
  };
}

export function getSpeechDiagnosticRequestSummaries(limit = 8) {
  const summaries = new Map<string, SpeechDiagnosticRequestSummary>();

  [...speechDiagnosticEvents].reverse().forEach((event) => {
    if (!event.requestId) {
      return;
    }

    const existing = summaries.get(event.requestId);

    if (!existing) {
      summaries.set(event.requestId, {
        id: event.requestId,
        requestId: event.requestId,
        createdAt: event.createdAt,
        source: event.source,
        latestStage: event.stage,
        requestedRoute: event.requestedRoute ?? null,
        actualRoute: event.actualRoute ?? null,
        language: event.language ?? null,
        provider: event.provider ?? null,
        providerModel: event.providerModel ?? null,
        voice: event.voice ?? null,
        fallbackReason: event.fallbackReason ?? null,
        message: event.message ?? null,
        textLength: event.textLength ?? null,
      });
      return;
    }

    existing.createdAt = event.createdAt;
    existing.source = event.source ?? existing.source;
    existing.latestStage = event.stage;
    existing.requestedRoute = event.requestedRoute ?? existing.requestedRoute;
    existing.actualRoute = event.actualRoute ?? existing.actualRoute;
    existing.language = event.language ?? existing.language;
    existing.provider = event.provider ?? existing.provider;
    existing.providerModel = event.providerModel ?? existing.providerModel;
    existing.voice = event.voice ?? existing.voice;
    existing.fallbackReason = event.fallbackReason ?? existing.fallbackReason;
    existing.message = event.message ?? existing.message;
    existing.textLength = event.textLength ?? existing.textLength;
  });

  return [...summaries.values()]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, limit);
}

export function clearSpeechDiagnostics() {
  speechDiagnosticEvents = [];
  turnIdsByRequestId.clear();
  notifySpeechDiagnosticsListeners();
}
