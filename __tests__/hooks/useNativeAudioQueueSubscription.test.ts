import { act, renderHook } from "@testing-library/react-native";

import {
  useNativeAudioQueueSubscription,
} from "../../src/hooks/audioPlayer/useNativeAudioQueueSubscription";
import type { NativeAudioQueueEvent } from "../../src/services/nativeAudioQueue";

let nativeAudioQueueListener:
  | ((event: NativeAudioQueueEvent) => void)
  | null = null;

jest.mock("../../src/services/nativeAudioQueue", () => ({
  subscribeToNativeAudioQueue: jest.fn((listener) => {
    nativeAudioQueueListener = listener;
    return jest.fn();
  }),
}));

jest.mock("../../src/services/speech/diagnostics", () => ({
  recordSpeechDiagnostic: jest.fn(),
}));

describe("useNativeAudioQueueSubscription", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nativeAudioQueueListener = null;
  });

  it("tracks native queue playback without visualizer work", async () => {
    const setNativeAudioQueuePlaying = jest.fn();
    const onPlaybackStarted = jest.fn();
    const nativeAudioQueueContextsRef = {
      current: new Map([
        [
          "reply-1",
          {
            uri: "file:///tmp/reply-1.m4a",
            onPlaybackStarted,
            diagnostics: {
              requestId: "request-1",
              source: "llm",
            },
          },
        ],
      ]),
    };
    const nativeAudioQueuePlayingRef = { current: false };
    const currentAudioRef = { current: null };
    const nativeAudioQueuePendingCountRef = { current: 1 };

    renderHook(() =>
      useNativeAudioQueueSubscription({
        usingNativeAudioQueue: true,
        playNextNative: jest.fn(async () => undefined),
        finalizeDrainedState: jest.fn(),
        updatePendingPlaybackState: jest.fn(),
        setNativeAudioQueuePlaying,
        currentAudioRef,
        cancelledRef: { current: false },
        playingRef: { current: false },
        hasSeenAudioPlayingRef: { current: false },
        nativeAudioQueueContextsRef,
        nativeAudioQueuePendingCountRef,
        nativeAudioQueuePlayingRef,
        nativeQueueRef: { current: [] },
      }),
    );

    await act(async () => {
      nativeAudioQueueListener?.({
        type: "started",
        itemId: "reply-1",
        uri: "file:///tmp/reply-1.m4a",
        requestId: "request-1",
        source: "llm",
      });
    });

    expect(onPlaybackStarted).toHaveBeenCalledTimes(1);
    expect(currentAudioRef.current).toEqual(
      expect.objectContaining({ id: "reply-1" }),
    );
    expect(nativeAudioQueuePlayingRef.current).toBe(true);

    act(() => {
      nativeAudioQueueListener?.({
        type: "finished",
        itemId: "reply-1",
        uri: "file:///tmp/reply-1.m4a",
      });
    });

    expect(nativeAudioQueuePlayingRef.current).toBe(false);
    expect(nativeAudioQueuePendingCountRef.current).toBe(0);
    expect(nativeAudioQueueContextsRef.current.size).toBe(0);
  });

  it("recovers from a failed native item and drains after the next item", () => {
    const finalizeDrainedState = jest.fn();
    const playNextNative = jest.fn(async () => undefined);
    const nativeAudioQueueContextsRef = {
      current: new Map([
        [
          "broken",
          {
            uri: "file:///tmp/broken.m4a",
            diagnostics: {
              requestId: "request-broken",
              source: "llm" as const,
            },
          },
        ],
        [
          "next",
          {
            uri: "file:///tmp/next.m4a",
            diagnostics: {
              requestId: "request-next",
              source: "llm" as const,
            },
          },
        ],
      ]),
    };
    const nativeAudioQueuePendingCountRef = { current: 2 };
    const nativeAudioQueuePlayingRef = { current: false };
    const currentAudioRef = { current: null };

    renderHook(() =>
      useNativeAudioQueueSubscription({
        usingNativeAudioQueue: true,
        playNextNative,
        finalizeDrainedState,
        updatePendingPlaybackState: jest.fn(),
        setNativeAudioQueuePlaying: jest.fn(),
        currentAudioRef,
        cancelledRef: { current: false },
        playingRef: { current: false },
        hasSeenAudioPlayingRef: { current: false },
        nativeAudioQueueContextsRef,
        nativeAudioQueuePendingCountRef,
        nativeAudioQueuePlayingRef,
        nativeQueueRef: { current: [] },
      }),
    );

    act(() => {
      nativeAudioQueueListener?.({
        type: "started",
        itemId: "broken",
        uri: "file:///tmp/broken.m4a",
      });
      nativeAudioQueueListener?.({
        type: "failed",
        itemId: "broken",
        uri: "file:///tmp/broken.m4a",
        message: "Unsupported audio.",
      });
      nativeAudioQueueListener?.({
        type: "started",
        itemId: "next",
        uri: "file:///tmp/next.m4a",
      });
      nativeAudioQueueListener?.({
        type: "finished",
        itemId: "next",
        uri: "file:///tmp/next.m4a",
      });
      nativeAudioQueueListener?.({ type: "drained" });
    });

    expect(nativeAudioQueueContextsRef.current.size).toBe(0);
    expect(nativeAudioQueuePendingCountRef.current).toBe(0);
    expect(nativeAudioQueuePlayingRef.current).toBe(false);
    expect(finalizeDrainedState).toHaveBeenCalledTimes(1);
    expect(playNextNative).not.toHaveBeenCalled();
  });
});
