import { sanitizeDebugPayload } from "../debugLogSanitizer";
import type {
  ActiveDebugLogSession,
  DebugLogEntry,
  JournalRecord,
} from "./types";

export const DEBUG_LOG_SCHEMA_VERSION = 2;

export function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify("[UNSERIALIZABLE]");
  }
}

function formatLogEntry(entry: DebugLogEntry) {
  const payloadSuffix =
    entry.payload && Object.keys(entry.payload).length > 0
      ? ` ${safeStringify(entry.payload)}`
      : "";
  const elapsed =
    entry.elapsedMs < 0 ? `${entry.elapsedMs}ms` : `+${entry.elapsedMs}ms`;
  return `[${entry.timestamp}] ${elapsed} [seq=${entry.sequence}] [${entry.level}] [${entry.category}] ${entry.event}${payloadSuffix}`;
}

export function formatDebugLogSession(
  session: Pick<
    ActiveDebugLogSession,
    | "context"
    | "droppedEntries"
    | "entries"
    | "id"
    | "startedAtIso"
    | "startedAtMs"
    | "truncated"
  >,
  endedAtIso: string,
  endedAtMs: number,
  status: "complete" | "recovered",
) {
  const lines = [
    "# Mr Broccoli Debug Log Capture",
    `schemaVersion: ${DEBUG_LOG_SCHEMA_VERSION}`,
    `sessionId: ${session.id}`,
    `startedAt: ${session.startedAtIso}`,
    `endedAt: ${endedAtIso}`,
    `durationMs: ${Math.max(0, endedAtMs - session.startedAtMs)}`,
    `status: ${status}`,
    `entryCount: ${session.entries.length}`,
    `droppedEntries: ${session.droppedEntries}`,
    `truncated: ${session.truncated}`,
    `context: ${safeStringify(session.context)}`,
    "",
    ...session.entries.map(formatLogEntry),
  ];
  return `${lines.join("\n")}\n`;
}

export function encodeJournalRecord(record: JournalRecord) {
  return `${safeStringify(record)}\n`;
}

export function utf8Length(value: string) {
  return new TextEncoder().encode(value).byteLength;
}

export function parseJournal(content: string) {
  let header: Extract<JournalRecord, { type: "session" }> | null = null;
  const entries: DebugLogEntry[] = [];
  let malformedLines = 0;

  for (const line of content.split("\n")) {
    if (!line.trim()) {
      continue;
    }

    try {
      const record = JSON.parse(line) as JournalRecord;
      if (record.type === "session") {
        header = {
          ...record,
          context: sanitizeDebugPayload(record.context) ?? {},
        };
      } else if (
        record.type === "entry" &&
        typeof record.event === "string" &&
        typeof record.sequence === "number"
      ) {
        entries.push({
          ...record,
          payload: sanitizeDebugPayload(record.payload),
        });
      } else {
        malformedLines += 1;
      }
    } catch {
      malformedLines += 1;
    }
  }

  return { entries, header, malformedLines };
}
