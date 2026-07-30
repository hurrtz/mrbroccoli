jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  documentDirectory: "file:///documents/",
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: false }),
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
}));

import {
  recordDebugLogEvent,
  startDebugLogCapture,
  stopDebugLogCapture,
} from "../../src/services/debugLogCapture";

describe("debugLogCapture", () => {
  afterEach(async () => {
    await stopDebugLogCapture();
    jest.useRealTimers();
  });

  it("aggregates stream chunks instead of storing one entry per token fragment", async () => {
    jest.useFakeTimers();
    startDebugLogCapture();

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
});
