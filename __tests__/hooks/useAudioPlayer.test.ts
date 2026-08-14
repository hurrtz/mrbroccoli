import { act, renderHook } from "@testing-library/react-native";
import * as Audio from "expo-audio";
import * as Speech from "expo-speech";
import {
  clearSpeechDiagnostics,
  getSpeechDiagnostics,
} from "../../src/services/speech/diagnostics";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///tmp/",
  documentDirectory: "file:///tmp/",
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({ exists: false, isDirectory: false })),
  makeDirectoryAsync: jest.fn(async () => undefined),
  moveAsync: jest.fn(async () => undefined),
  readAsStringAsync: jest.fn(async () => ""),
  writeAsStringAsync: jest.fn(async () => undefined),
}));

const mockPlayer = {
  id: "player-1",
  currentTime: 0,
  isAudioSamplingSupported: false,
  pause: jest.fn(),
  remove: jest.fn(),
  replace: jest.fn(),
  play: jest.fn(),
  clearLockScreenControls: jest.fn(),
  setActiveForLockScreen: jest.fn(),
};

let mockStatus: any;

jest.mock("expo-speech", () => ({
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),
  pause: jest.fn(() => Promise.resolve()),
  resume: jest.fn(() => Promise.resolve()),
  speak: jest.fn(),
  stop: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-speech-recognition", () => ({
  ExpoSpeechRecognitionModule: {
    setCategoryIOS: jest.fn(),
  },
}));

jest.mock("expo-audio", () => ({
  setAudioModeAsync: jest.fn(() => Promise.resolve()),
  setIsAudioActiveAsync: jest.fn(() => Promise.resolve()),
  useAudioPlayer: jest.fn(() => mockPlayer),
  useAudioSampleListener: jest.fn(),
  useAudioPlayerStatus: jest.fn(() => mockStatus),
}));

import { useAudioPlayer } from "../../src/hooks/useAudioPlayer";

describe("useAudioPlayer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearSpeechDiagnostics();
    mockStatus = {
      id: "player-1",
      currentTime: 0,
      playbackState: "idle",
      timeControlStatus: "paused",
      reasonForWaitingToPlay: "",
      mute: false,
      duration: 0,
      playing: false,
      loop: false,
      didJustFinish: false,
      isBuffering: false,
      isLoaded: true,
      playbackRate: 1,
      shouldCorrectPitch: true,
    };
  });

  it("releases ambient monitoring before activating playback", async () => {
    const beforePlayback = jest.fn(async () => undefined);
    const { result } = renderHook(() =>
      useAudioPlayer({ beforePlayback }),
    );

    await act(async () => {
      result.current.enqueueAudio("reply.mp3");
      await Promise.resolve();
    });

    expect(beforePlayback).toHaveBeenCalledTimes(1);
    expect(Audio.setIsAudioActiveAsync).toHaveBeenCalledWith(true);
    const activateCallIndex = (
      Audio.setIsAudioActiveAsync as jest.Mock
    ).mock.calls.findIndex(([active]) => active === true);
    expect(beforePlayback.mock.invocationCallOrder[0]).toBeLessThan(
      (Audio.setIsAudioActiveAsync as jest.Mock).mock
        .invocationCallOrder[activateCallIndex],
    );
  });

  it("advances queued clips when playback becomes idle", async () => {
    const { result, rerender } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.enqueueAudio("first.mp3");
      await Promise.resolve();
    });

    expect(mockPlayer.replace).toHaveBeenNthCalledWith(1, "first.mp3");
    expect(mockPlayer.play).toHaveBeenCalledTimes(1);
    expect(mockPlayer.setActiveForLockScreen).toHaveBeenCalledWith(
      true,
      {
        artist: "Mr Broccoli",
        title: "Spoken reply",
      },
      {
        showSeekBackward: false,
        showSeekForward: false,
      },
    );

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: true,
        playbackState: "playing",
        timeControlStatus: "playing",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    await act(async () => {
      result.current.enqueueAudio("second.mp3");
      await Promise.resolve();
    });

    expect(mockPlayer.replace).toHaveBeenCalledTimes(1);

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: false,
        playbackState: "idle",
        timeControlStatus: "paused",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    expect(mockPlayer.replace).toHaveBeenNthCalledWith(2, "second.mp3");
    expect(mockPlayer.play).toHaveBeenCalledTimes(2);
  });

  it("keeps request diagnostics attached to playback events", async () => {
    const { result, rerender } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.enqueueAudio("preview.wav", {
        requestId: "preview-1",
        source: "preview",
      });
      await Promise.resolve();
    });

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: true,
        playbackState: "playing",
        timeControlStatus: "playing",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: false,
        playbackState: "idle",
        timeControlStatus: "paused",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    const diagnostics = getSpeechDiagnostics().filter(
      (event) => event.requestId === "preview-1",
    );

    expect(diagnostics.map((event) => event.stage)).toEqual([
      "playback-finished",
      "playback-started",
      "playback-enqueued",
    ]);
    expect(diagnostics.every((event) => event.source === "preview")).toBe(true);
  });

  it("reports when queued clip playback actually starts", async () => {
    const onPlaybackStarted = jest.fn();
    const { result, rerender } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.enqueueAudio("reply.wav", undefined, onPlaybackStarted);
      await Promise.resolve();
    });

    expect(onPlaybackStarted).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.isActivelyPlaying).toBe(false);

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: true,
        playbackState: "playing",
        timeControlStatus: "playing",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    expect(onPlaybackStarted).toHaveBeenCalledTimes(1);
    expect(result.current.isActivelyPlaying).toBe(true);
  });

  it("reports when system speech actually starts", async () => {
    const onPlaybackStarted = jest.fn();
    const { result } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.speakText("Hello there", {
        language: "uk-UA",
        onPlaybackStarted,
      });
      await Promise.resolve();
    });

    expect(onPlaybackStarted).not.toHaveBeenCalled();
    expect(result.current.isActivelyPlaying).toBe(false);

    const speechOptions = (Speech.speak as jest.Mock).mock.calls[0][1];
    expect(speechOptions.language).toBe("uk-UA");
    act(() => {
      speechOptions.onStart();
    });

    expect(onPlaybackStarted).toHaveBeenCalledTimes(1);
    expect(result.current.isActivelyPlaying).toBe(true);
    act(() => {
      speechOptions.onDone();
    });
  });

  it("keeps system speech pending while the audio session starts", async () => {
    let finishAudioSessionStart: () => void = () => undefined;
    (Audio.setIsAudioActiveAsync as jest.Mock).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishAudioSessionStart = resolve;
        }),
    );
    const { result } = renderHook(() => useAudioPlayer());
    let drained = false;
    let drainPromise: Promise<void> = Promise.resolve();

    act(() => {
      result.current.speakText("Speech waiting for its audio session");
      drainPromise = result.current.waitForDrain().then(() => {
        drained = true;
      });
    });

    expect(result.current.isPlaying).toBe(true);
    expect(drained).toBe(false);
    expect(Speech.speak).not.toHaveBeenCalled();

    await act(async () => {
      finishAudioSessionStart();
      await Promise.resolve();
      await Promise.resolve();
    });

    const speechOptions = (Speech.speak as jest.Mock).mock.calls[0][1];
    act(() => {
      speechOptions.onStart();
      speechOptions.onDone();
    });
    await act(async () => {
      await drainPromise;
    });

    expect(drained).toBe(true);
    expect(result.current.isPlaying).toBe(false);
  });

  it("does not revive a system speech job cancelled during session setup", async () => {
    let finishAudioSessionStart: () => void = () => undefined;
    (Audio.setIsAudioActiveAsync as jest.Mock).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishAudioSessionStart = resolve;
        }),
    );
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.speakText("This speech should stay cancelled");
    });
    expect(result.current.isPlaying).toBe(true);

    await act(async () => {
      await result.current.stopPlayback();
    });
    expect(result.current.isPlaying).toBe(false);

    await act(async () => {
      finishAudioSessionStart();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(Speech.speak).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it("releases pending playback before native stop teardown finishes", async () => {
    let finishNativeStop: () => void = () => undefined;
    (Speech.stop as jest.Mock).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishNativeStop = resolve;
        }),
    );
    const { result } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.speakText("A reply that is still playing");
      await Promise.resolve();
    });

    expect(result.current.isPlaying).toBe(true);

    let stopPromise: Promise<void> = Promise.resolve();
    act(() => {
      stopPromise = result.current.stopPlayback();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isActivelyPlaying).toBe(false);

    finishNativeStop();
    await act(async () => {
      await stopPromise;
    });
    const speechOptions = (Speech.speak as jest.Mock).mock.calls[0][1];
    act(() => {
      speechOptions.onStopped();
    });
  });

  it("keeps provider diagnostics attached to an explicit audio stop", async () => {
    const { result } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.enqueueAudio("reply.wav", {
        requestId: "reply-stop-1",
        source: "repeat",
        provider: "xai",
        providerModel: "text-to-speech",
      });
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.stopPlayback();
    });

    expect(getSpeechDiagnostics()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          requestId: "reply-stop-1",
          source: "repeat",
          stage: "playback-stopped",
          provider: "xai",
          providerModel: "text-to-speech",
        }),
      ]),
    );
  });

  it("recovers when native speech finishes without delivering onDone", async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.speakText("A reply with a missed completion callback");
      await Promise.resolve();
    });

    const speechOptions = (Speech.speak as jest.Mock).mock.calls[0][1];
    act(() => {
      speechOptions.onStart();
    });
    expect(result.current.isActivelyPlaying).toBe(true);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1_600);
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isActivelyPlaying).toBe(false);
    expect(getSpeechDiagnostics()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stage: "playback-finished",
          message: expect.stringContaining("callback was missed"),
        }),
      ]),
    );
    jest.useRealTimers();
  });

  it("releases native speech when the system state probe keeps failing", async () => {
    jest.useFakeTimers();
    (Speech.isSpeakingAsync as jest.Mock).mockRejectedValue(
      new Error("Speech state unavailable"),
    );
    const { result } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.speakText("A reply that never starts");
      await Promise.resolve();
    });

    expect(result.current.isPlaying).toBe(true);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(6_100);
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isActivelyPlaying).toBe(false);
    expect(Speech.stop).toHaveBeenCalled();
    expect(getSpeechDiagnostics()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stage: "playback-stopped",
          message: expect.stringContaining("playback timeout"),
        }),
      ]),
    );
    jest.useRealTimers();
  });

  it("pauses and resumes the current clip without draining playback", async () => {
    const { result, rerender } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.enqueueAudio("reply.mp3");
      await Promise.resolve();
    });

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: true,
        playbackState: "playing",
        timeControlStatus: "playing",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    await act(async () => {
      await expect(result.current.pausePlayback()).resolves.toBe(true);
    });

    expect(mockPlayer.pause).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaybackPaused).toBe(true);
    expect(result.current.isPlaying).toBe(true);

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: false,
        playbackState: "paused",
        timeControlStatus: "paused",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    await act(async () => {
      await expect(result.current.resumePlayback()).resolves.toBe(true);
    });

    expect(mockPlayer.play).toHaveBeenCalledTimes(2);
    expect(result.current.isPlaybackPaused).toBe(false);
  });

  it("does not publish a sealed drain when sealing during paragraph seek teardown", async () => {
    let finishNativeStop!: () => void;
    (Speech.stop as jest.Mock).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishNativeStop = resolve;
        }),
    );
    const { result, rerender } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.enqueueAudio("one.mp3", undefined, undefined, {
        startsParagraph: true,
        text: "x".repeat(10),
      });
      result.current.enqueueAudio("two.mp3", undefined, undefined, {
        startsParagraph: true,
        text: "x".repeat(30),
      });
      result.current.enqueueAudio("three.mp3", undefined, undefined, {
        startsParagraph: true,
        text: "x".repeat(60),
      });
      await Promise.resolve();
    });
    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: true,
        playbackState: "playing",
        timeControlStatus: "playing",
      };
      rerender(undefined);
      await Promise.resolve();
    });
    expect(result.current.readingProgress).toBe(0);

    let seekPromise!: Promise<void>;
    act(() => {
      seekPromise = result.current.seekParagraph("forward");
    });
    await act(async () => {
      await Promise.resolve();
      result.current.sealPlaybackReel();
      mockStatus = {
        ...mockStatus,
        playing: false,
        playbackState: "idle",
        timeControlStatus: "paused",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    expect(result.current.readingProgress).not.toBe(1);

    await act(async () => {
      finishNativeStop();
      await seekPromise;
    });
    expect(result.current.readingProgress).toBeCloseTo(0.1);
  });

  it("tracks pause and resume commands issued by lock-screen controls", async () => {
    const { result, rerender } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.enqueueAudio("reply.mp3");
      await Promise.resolve();
      mockStatus = {
        ...mockStatus,
        playing: true,
        playbackState: "playing",
        timeControlStatus: "playing",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: false,
        playbackState: "paused",
        timeControlStatus: "paused",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    expect(result.current.isPlaybackPaused).toBe(true);
    expect(result.current.isPlaying).toBe(true);

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: true,
        playbackState: "playing",
        timeControlStatus: "playing",
      };
      rerender(undefined);
      await Promise.resolve();
    });

    expect(result.current.isPlaybackPaused).toBe(false);
  });

  it("does not let a newly prefetched clip restart a paused stream", async () => {
    const { result, rerender } = renderHook(() => useAudioPlayer());

    await act(async () => {
      result.current.enqueueAudio("paragraph-one.mp3");
      await Promise.resolve();
    });

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: true,
        playbackState: "playing",
        timeControlStatus: "playing",
      };
      rerender(undefined);
      await Promise.resolve();
      await result.current.pausePlayback();
    });

    await act(async () => {
      mockStatus = {
        ...mockStatus,
        playing: false,
        playbackState: "paused",
        timeControlStatus: "paused",
      };
      rerender(undefined);
      result.current.enqueueAudio("paragraph-two.mp3");
      await Promise.resolve();
    });

    expect(mockPlayer.replace).toHaveBeenCalledTimes(1);
    expect(mockPlayer.play).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaybackPaused).toBe(true);
    expect(result.current.isPlaying).toBe(true);
  });
});
