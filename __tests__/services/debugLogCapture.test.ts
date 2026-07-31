jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  documentDirectory: "file:///documents/",
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: false }),
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  moveAsync: jest.fn().mockResolvedValue(undefined),
  readDirectoryAsync: jest.fn().mockResolvedValue([]),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../src/services/debugLogFileStorage", () => ({
  appendDebugLogFile: jest.fn().mockResolvedValue(undefined),
}));

import {
  recoverPendingDebugLogCapture,
  recordDebugLogEvent,
  startDebugLogCapture,
  stopDebugLogCapture,
} from "../../src/services/debugLogCapture";
import * as FileSystem from "expo-file-system/legacy";
import { appendDebugLogFile } from "../../src/services/debugLogFileStorage";

describe("debugLogCapture", () => {
  afterEach(async () => {
    jest.mocked(appendDebugLogFile).mockResolvedValue(undefined);
    jest.mocked(FileSystem.moveAsync).mockResolvedValue(undefined);
    await stopDebugLogCapture();
    jest.clearAllMocks();
    jest.mocked(FileSystem.getInfoAsync).mockResolvedValue({
      exists: false,
    } as Awaited<ReturnType<typeof FileSystem.getInfoAsync>>);
    jest.useRealTimers();
  });

  it("aggregates stream chunks instead of storing one entry per token fragment", async () => {
    jest.useFakeTimers();
    await startDebugLogCapture();

    recordDebugLogEvent({
      event: "voice-pipeline-stream-chunk",
      payload: { chunkLength: 3 },
    });
    recordDebugLogEvent({
      event: "voice-pipeline-stream-chunk",
      payload: { chunkLength: 7 },
    });
    recordDebugLogEvent({
      event: "voice-pipeline-stream-chunk",
      payload: { chunkLength: 5 },
    });

    const resultPromise = stopDebugLogCapture();
    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result?.content).toContain("voice-pipeline-stream-chunks");
    expect(result?.content).toContain('"chunks":3');
    expect(result?.content).toContain('"totalLength":15');
    expect(result?.content).not.toContain("voice-pipeline-stream-chunk {");
  });

  it("redacts credentials and user-authored text before persisting a capture", async () => {
    await startDebugLogCapture({
      apiKey: "secret-start-key",
      prompt: "private start prompt",
    });

    recordDebugLogEvent({
      event: "privacy-check",
      payload: {
        accessToken: "access-secret",
        openaiApiKey: "compound-secret",
        title: "private conversation title",
        transcript: "private spoken words",
        nested: {
          authorization: "Bearer secret-authorization",
          message:
            "Request failed with token=secret-token and api_key=secret-key",
        },
      },
    });

    const result = await stopDebugLogCapture();

    expect(result?.content).not.toContain("secret-start-key");
    expect(result?.content).not.toContain("private start prompt");
    expect(result?.content).not.toContain("private spoken words");
    expect(result?.content).not.toContain("secret-authorization");
    expect(result?.content).not.toContain("secret-token");
    expect(result?.content).not.toContain("secret-key");
    expect(result?.content).not.toContain("access-secret");
    expect(result?.content).not.toContain("compound-secret");
    expect(result?.content).not.toContain("private conversation title");
    expect(result?.content).toContain("[REDACTED]");
    expect(result?.content).toContain("[REDACTED_TEXT length=");
  });

  it("does not claim success when the final atomic move fails", async () => {
    await startDebugLogCapture();
    jest.mocked(FileSystem.moveAsync).mockRejectedValueOnce(new Error("disk full"));

    await expect(stopDebugLogCapture()).rejects.toThrow("disk full");
    jest.mocked(FileSystem.moveAsync).mockResolvedValue(undefined);
    await expect(stopDebugLogCapture()).resolves.not.toBeNull();
  });

  it("re-sanitizes a legacy interrupted capture before exporting it", async () => {
    jest
      .mocked(FileSystem.getInfoAsync)
      .mockResolvedValueOnce({ exists: false } as any)
      .mockResolvedValueOnce({ exists: true } as any);
    jest.mocked(FileSystem.readAsStringAsync).mockResolvedValueOnce(
      '# Mr Broccoli Debug Log Capture\nsessionId: old\nentryCount: 1\n{"openaiApiKey":"secret-value","title":"private title"}\n',
    );

    const result = await recoverPendingDebugLogCapture();
    const written = jest.mocked(FileSystem.writeAsStringAsync).mock.calls.at(-1)?.[1];

    expect(result?.sessionId).toBe("old");
    expect(written).not.toContain("secret-value");
    expect(written).not.toContain("private title");
    expect(written).toContain("[REDACTED]");
    expect(written).toContain("[REDACTED_TEXT");
  });

  it("coalesces concurrent stop requests into one export", async () => {
    await startDebugLogCapture();
    const [first, second] = await Promise.all([
      stopDebugLogCapture(),
      stopDebugLogCapture(),
    ]);

    expect(first?.path).toBe(second?.path);
    expect(FileSystem.moveAsync).toHaveBeenCalledTimes(1);
  });

  it("bounds oversized captures and marks the exported log as truncated", async () => {
    await startDebugLogCapture();
    for (let index = 0; index < 5_100; index += 1) {
      recordDebugLogEvent({ event: "bounded-event", payload: { index } });
    }

    const result = await stopDebugLogCapture();

    expect(result?.content).toContain("truncated: true");
    expect(result?.content).toContain("capture-limit-reached");
    expect(result?.entryCount).toBeLessThanOrEqual(5_003);
  });

  it("recovers valid journal entries when the final JSONL line is malformed", async () => {
    jest
      .mocked(FileSystem.getInfoAsync)
      .mockResolvedValueOnce({ exists: true } as any)
      .mockResolvedValueOnce({ exists: false } as any);
    jest.mocked(FileSystem.readAsStringAsync).mockResolvedValueOnce(
      [
        JSON.stringify({
          context: {},
          schemaVersion: 2,
          sessionId: "journal-session",
          startedAt: "2026-07-31T10:00:00.000Z",
          type: "session",
        }),
        JSON.stringify({
          category: "app",
          elapsedMs: 10,
          event: "safe-event",
          level: "info",
          sequence: 1,
          timestamp: "2026-07-31T10:00:00.010Z",
          type: "entry",
        }),
        '{"type":"entry"',
      ].join("\n"),
    );

    const result = await recoverPendingDebugLogCapture();
    const written = jest.mocked(FileSystem.writeAsStringAsync).mock.calls.at(-1)?.[1];

    expect(result?.sessionId).toBe("journal-session");
    expect(written).toContain("safe-event");
    expect(written).toContain("capture-journal-tail-truncated");
    expect(written).toContain("status: recovered");
  });

  it("retains only the five newest completed captures", async () => {
    await startDebugLogCapture();
    jest.mocked(FileSystem.readDirectoryAsync).mockResolvedValueOnce([
      "debug-log-100-a.log",
      "debug-log-200-b.log",
      "debug-log-300-c.log",
      "debug-log-400-d.log",
      "debug-log-500-e.log",
      "debug-log-600-f.log",
      "debug-log-700-g.log",
      "debug-log-active.jsonl",
    ]);

    await stopDebugLogCapture();

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///documents/debug-logs/debug-log-200-b.log",
      { idempotent: true },
    );
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///documents/debug-logs/debug-log-100-a.log",
      { idempotent: true },
    );
  });
});
