import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system/legacy";

import {
  sanitizeConsoleArguments,
  sanitizeDebugPayload,
  sanitizeRecoveredLegacyLog,
} from "./debugLogSanitizer";
import { validateDebugLogEntries } from "./debugLogValidator";
import { appendDebugLogFile } from "./debugLogFileStorage";
import {
  DEBUG_LOG_SCHEMA_VERSION,
  encodeJournalRecord,
  formatDebugLogSession,
  parseJournal,
  utf8Length,
} from "./debugLog/format";
import {
  ensureLogsDirectory,
  getActiveCapturePath,
  getLegacyActiveCapturePath,
  pruneCompletedLogs,
  queueDebugLogWrite,
  writeAtomic,
} from "./debugLog/storage";
import type {
  ActiveDebugLogSession,
  DebugLogCaptureResult,
  DebugLogCaptureState,
  DebugLogCategory,
  DebugLogEntry,
  DebugLogLevel,
  PendingDebugLogAggregate,
  PendingDebugLogEntry,
  RecoveredDebugLogCaptureResult,
} from "./debugLog/types";

export type {
  DebugLogCaptureResult,
  DebugLogCaptureState,
  DebugLogEntry,
  RecoveredDebugLogCaptureResult,
} from "./debugLog/types";

const listeners = new Set<() => void>();
const FLUSH_DELAY_MS = 250;
const AGGREGATE_FLUSH_DELAY_MS = 1_000;
const MAX_CAPTURE_BYTES = 2 * 1024 * 1024;
const MAX_CAPTURE_ENTRIES = 5_000;
const MAX_CAPTURE_DURATION_MS = 30 * 60_000;
const MAX_PRE_ROLL_ENTRIES = 100;
const MAX_PRE_ROLL_AGE_MS = 5 * 60_000;
const HIGH_FREQUENCY_EVENTS = new Set<string>(["native-waveform-event"]);

let activeSession: ActiveDebugLogSession | null = null;
let lastExportPath: string | null = null;
let consoleCaptureInstalled = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let aggregateFlushTimer: ReturnType<typeof setTimeout> | null = null;
let stopPromise: Promise<DebugLogCaptureResult | null> | null = null;
const pendingAggregates = new Map<string, PendingDebugLogAggregate>();
const preRollEntries: PendingDebugLogEntry[] = [];
const turnIdsByAbortSignal = new WeakMap<AbortSignal, string>();

const originalConsole = {
  error: console.error.bind(console),
  info: console.info.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
};

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function nextSessionId() {
  return `debug-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDebugTurnId() {
  return `turn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function registerDebugTurnSignal(signal: AbortSignal, turnId: string) {
  turnIdsByAbortSignal.set(signal, turnId);
}

export function getDebugTurnIdForSignal(signal?: AbortSignal | null) {
  return signal ? (turnIdsByAbortSignal.get(signal) ?? null) : null;
}

function scheduleFlush() {
  if (!activeSession || flushTimer) {
    return;
  }
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushPendingJournal(activeSession).catch(() => undefined);
  }, FLUSH_DELAY_MS);
}

async function flushPendingJournal(session: ActiveDebugLogSession | null) {
  if (!session || session.pendingJournalLines.length === 0) {
    return;
  }
  const lines = session.pendingJournalLines.splice(0).join("");
  try {
    await queueDebugLogWrite(() => appendDebugLogFile(session.livePath, lines));
  } catch (error) {
    session.pendingJournalLines.unshift(lines);
    session.storageError =
      error instanceof Error ? error : new Error("Debug journal append failed.");
    notifyListeners();
    throw session.storageError;
  }
}

function appendPreRoll(entry: Omit<PendingDebugLogEntry, "timestamp">) {
  const now = Date.now();
  preRollEntries.push({
    ...entry,
    payload: sanitizeDebugPayload(entry.payload),
    timestamp: new Date(now).toISOString(),
  });
  while (
    preRollEntries.length > MAX_PRE_ROLL_ENTRIES ||
    (preRollEntries[0] &&
      now - Date.parse(preRollEntries[0].timestamp) > MAX_PRE_ROLL_AGE_MS)
  ) {
    preRollEntries.shift();
  }
}

function appendEntry(
  entry: Omit<PendingDebugLogEntry, "timestamp">,
  options: { force?: boolean; preRoll?: boolean; timestamp?: string } = {},
) {
  const session = activeSession;
  if (!session) {
    appendPreRoll(entry);
    return;
  }
  if (HIGH_FREQUENCY_EVENTS.has(entry.event)) {
    session.droppedEntries += 1;
    return;
  }

  const now = Date.now();
  const sanitizedPayload = sanitizeDebugPayload(
    options.preRoll
      ? { ...entry.payload, preRoll: true }
      : entry.payload,
  );
  const candidate: DebugLogEntry = {
    ...entry,
    payload: sanitizedPayload,
    elapsedMs: options.preRoll
      ? Date.parse(options.timestamp ?? new Date(now).toISOString()) - session.startedAtMs
      : now - session.startedAtMs,
    sequence: session.nextSequence,
    timestamp: options.timestamp ?? new Date(now).toISOString(),
  };
  const journalLine = encodeJournalRecord({ type: "entry", ...candidate });
  const limitReached =
    session.entries.length >= MAX_CAPTURE_ENTRIES ||
    session.journalBytes + utf8Length(journalLine) > MAX_CAPTURE_BYTES ||
    now - session.startedAtMs > MAX_CAPTURE_DURATION_MS;

  if (limitReached && !options.force) {
    session.droppedEntries += 1;
    if (!session.truncated) {
      session.truncated = true;
      appendEntry(
        {
          category: "app",
          event: "capture-limit-reached",
          level: "warn",
          payload: {
            maxBytes: MAX_CAPTURE_BYTES,
            maxDurationMs: MAX_CAPTURE_DURATION_MS,
            maxEntries: MAX_CAPTURE_ENTRIES,
          },
        },
        { force: true },
      );
    }
    return;
  }

  session.nextSequence += 1;
  session.entries.push(candidate);
  session.pendingJournalLines.push(journalLine);
  session.journalBytes += utf8Length(journalLine);
  notifyListeners();
  scheduleFlush();
}

function clearAggregateFlushTimer() {
  if (aggregateFlushTimer) {
    clearTimeout(aggregateFlushTimer);
    aggregateFlushTimer = null;
  }
}

function flushAggregatedEntries() {
  clearAggregateFlushTimer();
  if (!activeSession || pendingAggregates.size === 0) {
    pendingAggregates.clear();
    return;
  }
  const aggregates = [...pendingAggregates.entries()];
  pendingAggregates.clear();
  for (const [event, aggregate] of aggregates) {
    appendEntry({
      category: aggregate.category,
      event: `${event}s`,
      level: aggregate.level,
      payload: {
        averageChunkLength: Math.round(
          aggregate.totalChunkLength / Math.max(1, aggregate.count),
        ),
        chunks: aggregate.count,
        maxChunkLength: aggregate.maxChunkLength,
        totalLength: aggregate.totalChunkLength,
        windowMs: Math.max(0, aggregate.lastAtMs - aggregate.firstAtMs),
      },
    });
  }
}

function aggregateStreamChunk(entry: Omit<PendingDebugLogEntry, "timestamp">) {
  const chunkLength =
    typeof entry.payload?.chunkLength === "number" &&
    Number.isFinite(entry.payload.chunkLength)
      ? Math.max(0, Math.round(entry.payload.chunkLength))
      : 0;
  const now = Date.now();
  const current = pendingAggregates.get(entry.event);
  pendingAggregates.set(entry.event, {
    category: entry.category,
    count: (current?.count ?? 0) + 1,
    firstAtMs: current?.firstAtMs ?? now,
    lastAtMs: now,
    level: entry.level,
    maxChunkLength: Math.max(current?.maxChunkLength ?? 0, chunkLength),
    totalChunkLength: (current?.totalChunkLength ?? 0) + chunkLength,
  });
  if (!aggregateFlushTimer) {
    aggregateFlushTimer = setTimeout(() => {
      aggregateFlushTimer = null;
      flushAggregatedEntries();
    }, AGGREGATE_FLUSH_DELAY_MS);
  }
}

function recordEntry(entry: Omit<PendingDebugLogEntry, "timestamp">) {
  if (entry.event === "voice-pipeline-stream-chunk" && activeSession) {
    aggregateStreamChunk(entry);
    return;
  }
  appendEntry(entry);
}

export function getDebugLogCaptureState(): DebugLogCaptureState {
  return {
    active: activeSession !== null,
    entryCount: activeSession?.entries.length ?? 0,
    lastExportPath,
    sessionId: activeSession?.id ?? null,
    startedAt: activeSession?.startedAtIso ?? null,
    storageHealthy: activeSession?.storageError === null,
    truncated: activeSession?.truncated ?? false,
  };
}

export function subscribeToDebugLogCapture(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function installDebugLogConsoleCapture() {
  if (consoleCaptureInstalled) return;
  consoleCaptureInstalled = true;
  (["log", "info", "warn", "error"] as const).forEach((level) => {
    const original = originalConsole[level];
    console[level] = (...args: unknown[]) => {
      original(...args);
      recordEntry({
        category: "console",
        event: "console-output",
        level,
        payload: {
          argumentCount: args.length,
          arguments: sanitizeConsoleArguments(args),
        },
      });
    };
  });
}

export function recordDebugLogEvent(params: {
  category?: DebugLogCategory;
  event: string;
  level?: DebugLogLevel;
  payload?: Record<string, unknown>;
}) {
  recordEntry({
    category: params.category ?? "app",
    event: params.event,
    level: params.level ?? "info",
    payload: params.payload,
  });
}

export async function startDebugLogCapture(
  payload: Record<string, unknown> = {},
) {
  installDebugLogConsoleCapture();
  if (activeSession) return getDebugLogCaptureState();

  const directory = ensureLogsDirectory();
  const livePath = getActiveCapturePath();
  const existing = await FileSystem.getInfoAsync(livePath);
  if (existing.exists) {
    throw new Error("A pending debug log must be recovered before starting a new capture.");
  }
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

  const sessionId = nextSessionId();
  const startedAtMs = Date.now();
  const context = sanitizeDebugPayload(payload) ?? {};
  const session: ActiveDebugLogSession = {
    context,
    droppedEntries: 0,
    entries: [],
    finalPath: `${directory}${sessionId}.log`,
    id: sessionId,
    journalBytes: 0,
    livePath,
    nextSequence: 1,
    pendingJournalLines: [],
    startedAtIso: new Date(startedAtMs).toISOString(),
    startedAtMs,
    storageError: null,
    truncated: false,
  };
  const header = encodeJournalRecord({
    context,
    schemaVersion: DEBUG_LOG_SCHEMA_VERSION,
    sessionId,
    startedAt: session.startedAtIso,
    type: "session",
  });
  await FileSystem.writeAsStringAsync(livePath, header);
  session.journalBytes = utf8Length(header);
  activeSession = session;
  pendingAggregates.clear();
  clearAggregateFlushTimer();

  const now = Date.now();
  preRollEntries
    .filter((entry) => now - Date.parse(entry.timestamp) <= MAX_PRE_ROLL_AGE_MS)
    .forEach((entry) =>
      appendEntry(entry, { preRoll: true, timestamp: entry.timestamp }),
    );
  preRollEntries.length = 0;
  appendEntry(
    { category: "app", event: "capture-started", level: "info", payload },
    { force: true },
  );
  await flushPendingJournal(session);
  notifyListeners();
  return getDebugLogCaptureState();
}

async function performStopDebugLogCapture(
  payload: Record<string, unknown>,
): Promise<DebugLogCaptureResult | null> {
  const session = activeSession;
  if (!session) return null;

  flushAggregatedEntries();
  appendEntry(
    {
      category: "app",
      event: "capture-stopping",
      level: "info",
      payload: {
        ...payload,
        droppedEntries: session.droppedEntries,
        storageRecoveredAtStop: session.storageError !== null,
        truncated: session.truncated,
      },
    },
    { force: true },
  );
  const validationIssues = validateDebugLogEntries(session.entries);
  appendEntry(
    {
      category: "app",
      event: "capture-validation-summary",
      level: validationIssues.length > 0 ? "warn" : "info",
      payload: {
        issueCount: validationIssues.length,
        issues: validationIssues,
      },
    },
    { force: true },
  );

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  await flushPendingJournal(session).catch(() => undefined);
  const endedAtMs = Date.now();
  const endedAtIso = new Date(endedAtMs).toISOString();
  const content = formatDebugLogSession(
    session,
    endedAtIso,
    endedAtMs,
    "complete",
  );

  await queueDebugLogWrite(async () => {
    await FileSystem.makeDirectoryAsync(ensureLogsDirectory(), {
      intermediates: true,
    });
    await writeAtomic(session.finalPath, content);
    await FileSystem.deleteAsync(session.livePath, { idempotent: true });
  });

  let copiedToClipboard = false;
  try {
    await Clipboard.setStringAsync(content);
    copiedToClipboard = true;
  } catch {
    copiedToClipboard = false;
  }

  activeSession = null;
  pendingAggregates.clear();
  clearAggregateFlushTimer();
  lastExportPath = session.finalPath;
  notifyListeners();
  await pruneCompletedLogs().catch(() => undefined);
  return {
    content,
    copiedToClipboard,
    entryCount: session.entries.length,
    path: session.finalPath,
    sessionId: session.id,
    validationIssueCount: validationIssues.length,
  };
}

export function stopDebugLogCapture(
  payload: Record<string, unknown> = {},
): Promise<DebugLogCaptureResult | null> {
  if (stopPromise) return stopPromise;
  stopPromise = performStopDebugLogCapture(payload).finally(() => {
    stopPromise = null;
  });
  return stopPromise;
}

async function recoverJournal(path: string) {
  const content = await FileSystem.readAsStringAsync(path);
  const parsed = parseJournal(content);
  if (!parsed.header) {
    throw new Error("The pending debug journal does not contain a valid header.");
  }
  if (parsed.malformedLines > 0) {
    const sequence = (parsed.entries.at(-1)?.sequence ?? 0) + 1;
    parsed.entries.push({
      category: "app",
      elapsedMs: Math.max(0, Date.now() - Date.parse(parsed.header.startedAt)),
      event: "capture-journal-tail-truncated",
      level: "warn",
      payload: { malformedLines: parsed.malformedLines },
      sequence,
      timestamp: new Date().toISOString(),
    });
  }
  const startedAtMs = Date.parse(parsed.header.startedAt);
  const endedAtMs = Date.now();
  const session = {
    context: parsed.header.context,
    droppedEntries: parsed.malformedLines,
    entries: parsed.entries,
    id: parsed.header.sessionId,
    startedAtIso: parsed.header.startedAt,
    startedAtMs: Number.isFinite(startedAtMs) ? startedAtMs : endedAtMs,
    truncated: parsed.malformedLines > 0,
  };
  return {
    content: formatDebugLogSession(
      session,
      new Date(endedAtMs).toISOString(),
      endedAtMs,
      "recovered",
    ),
    entryCount: parsed.entries.length,
    sessionId: parsed.header.sessionId,
  };
}

export async function recoverPendingDebugLogCapture(): Promise<RecoveredDebugLogCaptureResult | null> {
  if (activeSession) return null;
  const livePath = getActiveCapturePath();
  const legacyPath = getLegacyActiveCapturePath();
  const [journalInfo, legacyInfo] = await Promise.all([
    FileSystem.getInfoAsync(livePath),
    FileSystem.getInfoAsync(legacyPath),
  ]);
  if (!journalInfo.exists && !legacyInfo.exists) return null;

  let content: string;
  let entryCount = 0;
  let sessionId: string | null = null;
  const sourcePath = journalInfo.exists ? livePath : legacyPath;
  if (journalInfo.exists) {
    const recovered = await recoverJournal(livePath);
    content = recovered.content;
    entryCount = recovered.entryCount;
    sessionId = recovered.sessionId;
  } else {
    const legacyContent = await FileSystem.readAsStringAsync(legacyPath);
    content = sanitizeRecoveredLegacyLog(legacyContent);
    entryCount = Number(content.match(/^entryCount: (\d+)/m)?.[1] ?? 0);
    sessionId = content.match(/^sessionId: (.+)$/m)?.[1]?.trim() ?? null;
  }

  const recoveredPath = `${ensureLogsDirectory()}recovered-${Date.now()}.log`;
  await queueDebugLogWrite(async () => {
    await FileSystem.makeDirectoryAsync(ensureLogsDirectory(), {
      intermediates: true,
    });
    await writeAtomic(recoveredPath, content);
    await FileSystem.deleteAsync(sourcePath, { idempotent: true });
  });

  let copiedToClipboard = false;
  try {
    await Clipboard.setStringAsync(content);
    copiedToClipboard = true;
  } catch {
    copiedToClipboard = false;
  }
  lastExportPath = recoveredPath;
  notifyListeners();
  await pruneCompletedLogs().catch(() => undefined);
  return { copiedToClipboard, entryCount, path: recoveredPath, sessionId };
}
