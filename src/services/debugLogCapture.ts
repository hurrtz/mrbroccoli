import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system/legacy";

type DebugLogLevel = "log" | "info" | "warn" | "error";
type DebugLogCategory = "app" | "console" | "speech" | "waveform";

interface DebugLogEntry {
  category: DebugLogCategory;
  elapsedMs: number;
  event: string;
  level: DebugLogLevel;
  payload?: Record<string, unknown>;
  timestamp: string;
}

interface ActiveDebugLogSession {
  entries: DebugLogEntry[];
  finalPath: string;
  id: string;
  livePath: string;
  startedAtIso: string;
  startedAtMs: number;
}

interface PendingDebugLogAggregate {
  category: DebugLogCategory;
  count: number;
  firstAtMs: number;
  lastAtMs: number;
  level: DebugLogLevel;
  maxChunkLength: number;
  totalChunkLength: number;
}

export interface DebugLogCaptureState {
  active: boolean;
  entryCount: number;
  lastExportPath: string | null;
  sessionId: string | null;
  startedAt: string | null;
}

export interface DebugLogCaptureResult {
  content: string;
  copiedToClipboard: boolean;
  entryCount: number;
  path: string;
  sessionId: string;
}

export interface RecoveredDebugLogCaptureResult {
  copiedToClipboard: boolean;
  entryCount: number;
  path: string;
  sessionId: string | null;
}

const listeners = new Set<() => void>();
const ACTIVE_CAPTURE_FILE_NAME = "debug-log-active.log";
const FLUSH_DELAY_MS = 250;
const AGGREGATE_FLUSH_DELAY_MS = 1_000;
// Per-frame events that would flood a capture (tens of thousands of lines) and,
// because every recorded entry notifies listeners (re-rendering the screen),
// would perturb the very re-render/battery signal a capture is meant to measure.
// Dropped from capture entirely.
const HIGH_FREQUENCY_EVENTS = new Set<string>(["native-waveform-event"]);
const REDACTED_SECRET = "[REDACTED]";
const MAX_DEBUG_VALUE_DEPTH = 6;
const MAX_DEBUG_ARRAY_LENGTH = 50;
const SECRET_KEY_NAMES = new Set([
  "apikey",
  "authorization",
  "cookie",
  "credential",
  "credentials",
  "password",
  "passphrase",
  "secret",
  "token",
]);
const PRIVATE_TEXT_KEY_NAMES = new Set([
  "assistantinstructions",
  "content",
  "existingsummary",
  "instructions",
  "prompt",
  "query",
  "summary",
  "systemprompt",
  "text",
  "transcript",
  "webcontext",
]);

let activeSession: ActiveDebugLogSession | null = null;
let lastExportPath: string | null = null;
let consoleCaptureInstalled = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let aggregateFlushTimer: ReturnType<typeof setTimeout> | null = null;
const pendingAggregates = new Map<string, PendingDebugLogAggregate>();
let writeQueue = Promise.resolve();

const originalConsole = {
  error: console.error.bind(console),
  info: console.info.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
};

function notifyListeners() {
  listeners.forEach((listener) => {
    listener();
  });
}

function nextSessionId() {
  return `debug-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ensureLogsDirectory() {
  const baseDirectory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

  if (!baseDirectory) {
    throw new Error("No writable directory available for debug logs.");
  }

  return `${baseDirectory}debug-logs/`;
}

function getActiveCapturePath() {
  return `${ensureLogsDirectory()}${ACTIVE_CAPTURE_FILE_NAME}`;
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify(String(value));
  }
}

function normalizeDebugKey(key: string) {
  return key.toLowerCase().replace(/[^a-z]/g, "");
}

function redactSensitiveString(value: string) {
  return value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/\bsk-(?:ant-)?[A-Za-z0-9_-]{8,}\b/g, REDACTED_SECRET)
    .replace(/\bxai-[A-Za-z0-9_-]{8,}\b/gi, REDACTED_SECRET)
    .replace(/\bAIza[A-Za-z0-9_-]{16,}\b/g, REDACTED_SECRET)
    .replace(
      /([?&](?:api[_-]?key|authorization|credential|password|passphrase|secret|token)=)[^&#\s]*/gi,
      `$1${REDACTED_SECRET}`,
    )
    .replace(
      /((?:api[_ -]?key|authorization|credential|password|passphrase|secret|token)\s*[:=]\s*["']?)[^"',}\s]+/gi,
      `$1${REDACTED_SECRET}`,
    );
}

function sanitizeDebugValue(
  value: unknown,
  key = "",
  depth = 0,
  seen = new WeakSet<object>(),
): unknown {
  const normalizedKey = normalizeDebugKey(key);

  if (SECRET_KEY_NAMES.has(normalizedKey)) {
    return REDACTED_SECRET;
  }

  if (PRIVATE_TEXT_KEY_NAMES.has(normalizedKey) && typeof value === "string") {
    return `[REDACTED_TEXT length=${value.length}]`;
  }

  if (typeof value === "string") {
    return redactSensitiveString(value);
  }

  if (
    value === null ||
    value === undefined ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof Error) {
    return {
      message: redactSensitiveString(value.message),
      name: value.name,
    };
  }

  if (depth >= MAX_DEBUG_VALUE_DEPTH) {
    return "[TRUNCATED]";
  }

  if (typeof value !== "object") {
    return String(value);
  }

  if (seen.has(value)) {
    return "[CIRCULAR]";
  }
  seen.add(value);

  if (Array.isArray(value)) {
    const sanitized = value
      .slice(0, MAX_DEBUG_ARRAY_LENGTH)
      .map((entry) => sanitizeDebugValue(entry, key, depth + 1, seen));
    if (value.length > MAX_DEBUG_ARRAY_LENGTH) {
      sanitized.push(`[TRUNCATED ${value.length - MAX_DEBUG_ARRAY_LENGTH} items]`);
    }
    return sanitized;
  }

  return Object.fromEntries(
    Object.entries(value).map(([entryKey, entryValue]) => [
      entryKey,
      sanitizeDebugValue(entryValue, entryKey, depth + 1, seen),
    ]),
  );
}

function sanitizeDebugPayload(payload?: Record<string, unknown>) {
  if (!payload) {
    return undefined;
  }

  return sanitizeDebugValue(payload) as Record<string, unknown>;
}

function formatConsoleArgs(args: unknown[]) {
  return args
    .map((arg) => {
      if (typeof arg === "string") {
        return redactSensitiveString(arg);
      }

      return safeStringify(sanitizeDebugValue(arg));
    })
    .join(" ");
}

function formatLogEntry(entry: DebugLogEntry) {
  const payloadSuffix =
    entry.payload && Object.keys(entry.payload).length > 0
      ? ` ${safeStringify(entry.payload)}`
      : "";

  return `[${entry.timestamp}] +${entry.elapsedMs}ms [${entry.level}] [${entry.category}] ${entry.event}${payloadSuffix}`;
}

function formatDebugLogSession(
  session: ActiveDebugLogSession,
  endedAtIso: string,
  endedAtMs: number,
  status: "active" | "complete",
) {
  const lines = [
    "# Mr Broccoli Debug Log Capture",
    `sessionId: ${session.id}`,
    `startedAt: ${session.startedAtIso}`,
    `endedAt: ${endedAtIso}`,
    `durationMs: ${Math.max(0, endedAtMs - session.startedAtMs)}`,
    `status: ${status}`,
    `entryCount: ${session.entries.length}`,
    "",
    ...session.entries.map(formatLogEntry),
  ];

  return `${lines.join("\n")}\n`;
}

function appendEntry(
  entry: Omit<DebugLogEntry, "elapsedMs" | "timestamp">,
) {
  if (!activeSession) {
    return;
  }

  if (HIGH_FREQUENCY_EVENTS.has(entry.event)) {
    return;
  }

  activeSession.entries.push({
    ...entry,
    payload: sanitizeDebugPayload(entry.payload),
    elapsedMs: Date.now() - activeSession.startedAtMs,
    timestamp: new Date().toISOString(),
  });

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

function scheduleAggregateFlush() {
  if (!activeSession || aggregateFlushTimer) {
    return;
  }

  aggregateFlushTimer = setTimeout(() => {
    aggregateFlushTimer = null;
    flushAggregatedEntries();
  }, AGGREGATE_FLUSH_DELAY_MS);
}

function aggregateStreamChunk(
  entry: Omit<DebugLogEntry, "elapsedMs" | "timestamp">,
) {
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
  scheduleAggregateFlush();
}

function recordEntry(entry: Omit<DebugLogEntry, "elapsedMs" | "timestamp">) {
  if (!activeSession) {
    return;
  }

  if (entry.event === "voice-pipeline-stream-chunk") {
    aggregateStreamChunk(entry);
    return;
  }

  appendEntry(entry);
}

function queueWrite(task: () => Promise<void>) {
  writeQueue = writeQueue.then(task).catch(() => undefined);
  return writeQueue;
}

function scheduleFlush() {
  if (!activeSession || flushTimer) {
    return;
  }

  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushActiveSessionToDisk();
  }, FLUSH_DELAY_MS);
}

async function flushActiveSessionToDisk(sessionOverride?: ActiveDebugLogSession) {
  const session = sessionOverride ?? activeSession;

  if (!session) {
    return;
  }

  const content = formatDebugLogSession(
    session,
    new Date().toISOString(),
    Date.now(),
    "active",
  );

  await queueWrite(async () => {
    await FileSystem.makeDirectoryAsync(ensureLogsDirectory(), {
      intermediates: true,
    });
    await FileSystem.writeAsStringAsync(session.livePath, content);
  });
}

function parseSessionMetadata(content: string) {
  const entryCountMatch = content.match(/^entryCount: (\d+)/m);
  const sessionIdMatch = content.match(/^sessionId: (.+)$/m);

  return {
    entryCount: entryCountMatch ? Number(entryCountMatch[1]) : 0,
    sessionId: sessionIdMatch?.[1]?.trim() ?? null,
  };
}

export function getDebugLogCaptureState(): DebugLogCaptureState {
  return {
    active: activeSession !== null,
    entryCount: activeSession?.entries.length ?? 0,
    lastExportPath,
    sessionId: activeSession?.id ?? null,
    startedAt: activeSession?.startedAtIso ?? null,
  };
}

export function subscribeToDebugLogCapture(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function installDebugLogConsoleCapture() {
  if (consoleCaptureInstalled) {
    return;
  }

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
          message: formatConsoleArgs(args),
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

export function startDebugLogCapture(payload: Record<string, unknown> = {}) {
  installDebugLogConsoleCapture();

  if (activeSession) {
    return getDebugLogCaptureState();
  }

  const directory = ensureLogsDirectory();
  const sessionId = nextSessionId();

  const nextSession: ActiveDebugLogSession = {
    entries: [],
    finalPath: `${directory}${sessionId}.log`,
    id: sessionId,
    livePath: getActiveCapturePath(),
    startedAtIso: new Date().toISOString(),
    startedAtMs: Date.now(),
  };

  pendingAggregates.clear();
  clearAggregateFlushTimer();
  activeSession = nextSession;
  recordDebugLogEvent({
    event: "capture-started",
    payload,
  });
  notifyListeners();
  void flushActiveSessionToDisk(nextSession);

  return getDebugLogCaptureState();
}

export async function stopDebugLogCapture(
  payload: Record<string, unknown> = {},
): Promise<DebugLogCaptureResult | null> {
  if (!activeSession) {
    return null;
  }

  flushAggregatedEntries();
  recordDebugLogEvent({
    event: "capture-stopping",
    payload,
  });

  const session = activeSession;
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  await flushActiveSessionToDisk(session);
  const endedAtIso = new Date().toISOString();
  const endedAtMs = Date.now();
  const content = formatDebugLogSession(session, endedAtIso, endedAtMs, "complete");
  const path = session.finalPath;

  await queueWrite(async () => {
    await FileSystem.makeDirectoryAsync(ensureLogsDirectory(), {
      intermediates: true,
    });
    await FileSystem.writeAsStringAsync(path, content);
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
  lastExportPath = path;
  notifyListeners();

  return {
    content,
    copiedToClipboard,
    entryCount: session.entries.length,
    path,
    sessionId: session.id,
  };
}

export async function recoverPendingDebugLogCapture(): Promise<RecoveredDebugLogCaptureResult | null> {
  const livePath = getActiveCapturePath();
  const info = await FileSystem.getInfoAsync(livePath);

  if (!info.exists) {
    return null;
  }

  const content = await FileSystem.readAsStringAsync(livePath);
  const metadata = parseSessionMetadata(content);
  const recoveredPath = `${ensureLogsDirectory()}recovered-${Date.now()}.log`;

  await queueWrite(async () => {
    await FileSystem.makeDirectoryAsync(ensureLogsDirectory(), {
      intermediates: true,
    });
    await FileSystem.writeAsStringAsync(recoveredPath, content);
    await FileSystem.deleteAsync(livePath, { idempotent: true });
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

  return {
    copiedToClipboard,
    entryCount: metadata.entryCount,
    path: recoveredPath,
    sessionId: metadata.sessionId,
  };
}
