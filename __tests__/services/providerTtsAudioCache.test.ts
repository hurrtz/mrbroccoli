let mockStoredCache: string | null = null;

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(async () => mockStoredCache),
  removeItem: jest.fn(async () => {
    mockStoredCache = null;
  }),
  setItem: jest.fn(async (_key: string, value: string) => {
    mockStoredCache = value;
  }),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({
    exists: true,
    isDirectory: false,
    size: 4_096,
  })),
}));

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

import * as FileSystem from "expo-file-system/legacy";
import {
  clearProviderTtsAudioCache,
  getProviderTtsAudioCacheEntry,
  resetProviderTtsAudioCacheForTests,
  setProviderTtsAudioCacheEntry,
  simulateProviderTtsAudioCacheRestartForTests,
} from "../../src/services/providerTtsAudioCache";

describe("providerTtsAudioCache", () => {
  beforeEach(() => {
    mockStoredCache = null;
    jest.clearAllMocks();
    resetProviderTtsAudioCacheForTests();
  });

  it("rehydrates a cached speech file after an app restart", async () => {
    await setProviderTtsAudioCacheEntry("speech-key", {
      audioPath: "file:///cache/tts-reply.mp3",
      providerModel: "eleven_v3",
    });

    simulateProviderTtsAudioCacheRestartForTests();
    const cached = await getProviderTtsAudioCacheEntry("speech-key");

    expect(cached).toMatchObject({
      audioPath: "file:///cache/tts-reply.mp3",
      providerModel: "eleven_v3",
      sizeBytes: 4_096,
    });
  });

  it("removes cached files and the persistent index on clear", async () => {
    await setProviderTtsAudioCacheEntry("speech-key", {
      audioPath: "file:///cache/tts-reply.mp3",
      providerModel: "eleven_v3",
    });

    await expect(clearProviderTtsAudioCache()).resolves.toBe(1);
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///cache/tts-reply.mp3",
      { idempotent: true },
    );
    expect(mockStoredCache).toBeNull();
  });
});
