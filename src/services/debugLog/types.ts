export type DebugLogLevel = "log" | "info" | "warn" | "error";
export type DebugLogCategory = "app" | "console" | "speech" | "waveform";

export interface DebugLogEntry {
  category: DebugLogCategory;
  elapsedMs: number;
  event: string;
  level: DebugLogLevel;
  payload?: Record<string, unknown>;
  sequence: number;
  timestamp: string;
}

export interface PendingDebugLogEntry {
  category: DebugLogCategory;
  event: string;
  level: DebugLogLevel;
  payload?: Record<string, unknown>;
  timestamp: string;
}

export interface ActiveDebugLogSession {
  context: Record<string, unknown>;
  droppedEntries: number;
  entries: DebugLogEntry[];
  finalPath: string;
  id: string;
  journalBytes: number;
  livePath: string;
  nextSequence: number;
  pendingJournalLines: string[];
  startedAtIso: string;
  startedAtMs: number;
  storageError: Error | null;
  truncated: boolean;
}

export interface PendingDebugLogAggregate {
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
  storageHealthy: boolean;
  truncated: boolean;
}

export interface DebugLogCaptureResult {
  content: string;
  copiedToClipboard: boolean;
  entryCount: number;
  path: string;
  sessionId: string;
  validationIssueCount: number;
}

export interface RecoveredDebugLogCaptureResult {
  content: string;
  copiedToClipboard: boolean;
  entryCount: number;
  path: string;
  sessionId: string | null;
}

export type JournalRecord =
  | {
      context: Record<string, unknown>;
      schemaVersion: number;
      sessionId: string;
      startedAt: string;
      type: "session";
    }
  | ({ type: "entry" } & DebugLogEntry);
