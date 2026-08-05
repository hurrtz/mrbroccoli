import { act, renderHook } from "@testing-library/react-native";

import { useNativeAudioQueuePlayback } from "../../src/hooks/audioPlayer/useNativeAudioQueuePlayback";
import {
  enqueueNativeAudioQueueItem,
  startNativeAudioQueue,
} from "../../src/services/nativeAudioQueue";
import { recordSpeechDiagnostic } from "../../src/services/speech/diagnostics";

jest.mock("../../src/services/nativeAudioQueue", () => ({
  enqueueNativeAudioQueueItem: jest.fn(),
  startNativeAudioQueue: jest.fn(),
}));

jest.mock("../../src/services/speech/diagnostics", () => ({
  recordSpeechDiagnostic: jest.fn(),
}));

function createParams() {
  return {
    cancelledRef: { current: false },
    ensureAudioQueuePlaybackSession: jest.fn().mockResolvedValue(undefined),
    finalizeDrainedStateRef: { current: jest.fn() },
    nativeAudioQueueContextsRef: {
      current: new Map([
        [
          "audio-1",
          {
            generation: 4,
            uri: "file://speech.wav",
          },
        ],
      ]),
    },
    nativeAudioQueuePendingCountRef: { current: 1 },
    nativeQueueRef: { current: [] },
    nativeSpeakingRef: { current: false },
    playbackPausedRef: { current: false },
    playbackGenerationRef: { current: 4 },
    updatePendingPlaybackState: jest.fn(),
  };
}

describe("useNativeAudioQueuePlayback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (enqueueNativeAudioQueueItem as jest.Mock).mockResolvedValue(true);
    (startNativeAudioQueue as jest.Mock).mockResolvedValue(true);
  });

  it("prepares, enqueues, and starts native audio with diagnostic context", async () => {
    const params = createParams();
    const { result } = renderHook(() => useNativeAudioQueuePlayback(params));

    await act(async () => {
      await result.current.playNativeAudio(
        "audio-1",
        "file://speech.wav",
        4,
        {
          requestId: "request-1",
          source: "conversation",
        },
      );
    });

    expect(params.ensureAudioQueuePlaybackSession).toHaveBeenCalledTimes(1);
    expect(enqueueNativeAudioQueueItem).toHaveBeenCalledWith({
      uri: "file://speech.wav",
      itemId: "audio-1",
      requestId: "request-1",
      source: "conversation",
    });
    expect(startNativeAudioQueue).toHaveBeenCalledTimes(1);
  });

  it("enqueues without starting while playback is paused", async () => {
    const params = createParams();
    params.playbackPausedRef.current = true;
    const { result } = renderHook(() => useNativeAudioQueuePlayback(params));

    await act(async () => {
      await result.current.playNativeAudio(
        "audio-1",
        "file://speech.wav",
        4,
      );
    });

    expect(enqueueNativeAudioQueueItem).toHaveBeenCalledTimes(1);
    expect(startNativeAudioQueue).not.toHaveBeenCalled();
  });

  it("drops stale audio after preparing the native playback session", async () => {
    const params = createParams();
    params.playbackGenerationRef.current = 5;
    const { result } = renderHook(() => useNativeAudioQueuePlayback(params));

    await act(async () => {
      await result.current.playNativeAudio(
        "audio-1",
        "file://speech.wav",
        4,
      );
    });

    expect(params.nativeAudioQueueContextsRef.current.has("audio-1")).toBe(
      false,
    );
    expect(params.nativeAudioQueuePendingCountRef.current).toBe(0);
    expect(params.updatePendingPlaybackState).toHaveBeenCalledTimes(1);
    expect(enqueueNativeAudioQueueItem).not.toHaveBeenCalled();
  });

  it("preserves source order when session preparation latency varies per clip", async () => {
    const params = createParams();
    params.nativeAudioQueuePendingCountRef.current = 2;
    // First caller pays a slow native round trip (ambient-monitor stop);
    // the second caller's session setup resolves immediately. Without
    // serialization the second clip reaches the native queue first.
    let releaseFirstSession: (() => void) | undefined;
    let sessionCalls = 0;
    params.ensureAudioQueuePlaybackSession = jest.fn(() => {
      sessionCalls += 1;
      if (sessionCalls === 1) {
        return new Promise<void>((resolve) => {
          releaseFirstSession = resolve;
        });
      }
      return Promise.resolve();
    });
    const { result } = renderHook(() => useNativeAudioQueuePlayback(params));

    await act(async () => {
      const first = result.current.playNativeAudio(
        "audio-1",
        "file://clip-1.wav",
        4,
      );
      const second = result.current.playNativeAudio(
        "audio-2",
        "file://clip-2.wav",
        4,
      );

      // Give an unserialized second clip every chance to run ahead.
      await Promise.resolve();
      await Promise.resolve();
      expect(enqueueNativeAudioQueueItem).not.toHaveBeenCalled();

      releaseFirstSession?.();
      await Promise.all([first, second]);
    });

    expect(
      (enqueueNativeAudioQueueItem as jest.Mock).mock.calls.map(
        ([item]) => item.itemId,
      ),
    ).toEqual(["audio-1", "audio-2"]);
  });

  it("continues enqueueing later clips after a failed clip", async () => {
    const params = createParams();
    (enqueueNativeAudioQueueItem as jest.Mock)
      .mockRejectedValueOnce(new Error("Native enqueue failed"))
      .mockResolvedValueOnce(true);
    const { result } = renderHook(() => useNativeAudioQueuePlayback(params));

    await act(async () => {
      await result.current.playNativeAudio("audio-1", "file://clip-1.wav", 4);
      await result.current.playNativeAudio("audio-2", "file://clip-2.wav", 4);
    });

    expect(enqueueNativeAudioQueueItem).toHaveBeenCalledTimes(2);
    expect(
      (enqueueNativeAudioQueueItem as jest.Mock).mock.calls[1][0].itemId,
    ).toBe("audio-2");
  });

  it("records playback failures, cleans queue state, and finalizes a drained queue", async () => {
    const params = createParams();
    (enqueueNativeAudioQueueItem as jest.Mock).mockRejectedValue(
      new Error("Native enqueue failed"),
    );
    const { result } = renderHook(() => useNativeAudioQueuePlayback(params));

    await act(async () => {
      await result.current.playNativeAudio(
        "audio-1",
        "file://speech.wav",
        4,
        {
          requestId: "request-1",
          source: "conversation",
          provider: "local",
          providerModel: "kokoro-v1",
        },
      );
    });

    expect(params.nativeAudioQueueContextsRef.current.has("audio-1")).toBe(
      false,
    );
    expect(params.nativeAudioQueuePendingCountRef.current).toBe(0);
    expect(recordSpeechDiagnostic).toHaveBeenCalledWith({
      requestId: "request-1",
      source: "conversation",
      stage: "playback-stopped",
      provider: "local",
      providerModel: "kokoro-v1",
      message: "Native enqueue failed",
    });
    expect(params.updatePendingPlaybackState).toHaveBeenCalledTimes(1);
    expect(params.finalizeDrainedStateRef.current).toHaveBeenCalledTimes(1);
  });
});
