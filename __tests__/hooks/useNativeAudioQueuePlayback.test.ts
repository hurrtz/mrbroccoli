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
