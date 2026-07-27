import { act, renderHook } from "@testing-library/react-native";

import {
  MAX_RECORDING_MS,
  useVoiceCaptureLifecycle,
} from "../../../src/screens/main/voiceSession/useVoiceCaptureLifecycle";

jest.mock("../../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../../src/services/voicePipeline/cleanup", () => ({
  cleanupCapturedAudio: jest.fn(async () => undefined),
}));

import { cleanupCapturedAudio } from "../../../src/services/voicePipeline/cleanup";

function buildParams(overrides: Record<string, unknown> = {}) {
  const player = {
    isPlaybackPaused: false,
    isPlaying: false,
    pausePlayback: jest.fn(async () => true),
    resumePlayback: jest.fn(async () => true),
    stopPlayback: jest.fn(async () => undefined),
    waitForPlaybackRouteSettle: jest.fn(async () => undefined),
  };
  const recorder = {
    clearLastError: jest.fn(),
    lastError: null,
    startRecording: jest.fn(async () => undefined),
    stopRecording: jest.fn(async () => "file:///tmp/recording.wav"),
  };
  const nativeStt = {
    abortRecognition: jest.fn(async () => undefined),
    clearLastError: jest.fn(),
    ensurePermissions: jest.fn(async () => undefined),
    isAvailable: true,
    lastError: null,
    startRecognition: jest.fn(async () => undefined),
    stopRecognition: jest.fn(async () => "hello"),
  };
  const processCapturedVoiceTurn = jest.fn(async () => undefined);
  const onCaptureStopAbandoned = jest.fn();
  const onCaptureStopStarted = jest.fn();
  const showToast = jest.fn();
  const t = jest.fn((key: string) => key);

  return {
    nativeStt,
    onCaptureStopAbandoned,
    onCaptureStopStarted,
    player,
    processCapturedVoiceTurn,
    recorder,
    showToast,
    sttMode: "provider" as const,
    t,
    ...overrides,
  };
}

describe("useVoiceCaptureLifecycle auto-stop", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("auto-stops at the max duration and still transcribes the captured audio", async () => {
    const params = buildParams();
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));

    await act(async () => {
      await result.current.startVoiceCapture();
    });

    expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
    expect(params.processCapturedVoiceTurn).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(MAX_RECORDING_MS);
      // Let the auto-stop async chain settle.
      await Promise.resolve();
      await Promise.resolve();
    });

    // The heads-up toast was shown and the audio was NOT discarded.
    expect(params.showToast).toHaveBeenCalledWith("maxRecordingLengthReached");
    expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
    expect(params.onCaptureStopStarted).toHaveBeenCalledTimes(1);
    expect(params.onCaptureStopAbandoned).not.toHaveBeenCalled();
    expect(params.processCapturedVoiceTurn).toHaveBeenCalledWith({
      audioUri: "file:///tmp/recording.wav",
    });
  });

  it("clears the timer on a manual stop so it never auto-fires", async () => {
    const params = buildParams();
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));

    await act(async () => {
      await result.current.startVoiceCapture();
    });

    await act(async () => {
      await result.current.stopVoiceCapture();
    });

    params.showToast.mockClear();

    await act(async () => {
      jest.advanceTimersByTime(MAX_RECORDING_MS * 2);
      await Promise.resolve();
    });

    expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
    expect(params.showToast).not.toHaveBeenCalled();
  });

  it("cancels provider recording without submitting it or leaving the timer armed", async () => {
    const params = buildParams();
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));

    await act(async () => {
      await result.current.startVoiceCapture();
      await result.current.cancelVoiceCapture();
    });

    await act(async () => {
      jest.advanceTimersByTime(MAX_RECORDING_MS * 2);
      await Promise.resolve();
    });

    expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
    expect(cleanupCapturedAudio).toHaveBeenCalledWith(
      "file:///tmp/recording.wav",
    );
    expect(params.processCapturedVoiceTurn).not.toHaveBeenCalled();
    expect(params.onCaptureStopStarted).not.toHaveBeenCalled();
    expect(params.showToast).not.toHaveBeenCalled();
  });

  it("aborts native recognition without submitting a transcript", async () => {
    const params = buildParams({
      sttMode: "native" as const,
    });
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));

    await act(async () => {
      await result.current.startVoiceCapture();
      await result.current.cancelVoiceCapture();
    });

    expect(params.nativeStt.abortRecognition).toHaveBeenCalledTimes(1);
    expect(params.nativeStt.stopRecognition).not.toHaveBeenCalled();
    expect(params.processCapturedVoiceTurn).not.toHaveBeenCalled();
    expect(params.onCaptureStopStarted).not.toHaveBeenCalled();
  });

  it("does not expose native permission preparation as an active capture", async () => {
    let finishPermissionCheck: (() => void) | null = null;
    const nativeStt = {
      ...buildParams().nativeStt,
      ensurePermissions: jest.fn(
        () =>
          new Promise<void>((resolve) => {
            finishPermissionCheck = resolve;
          }),
      ),
    };
    const params = buildParams({
      nativeStt,
      sttMode: "native" as const,
    });
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));
    let start: Promise<void> | null = null;

    await act(async () => {
      start = result.current.startVoiceCapture();
      await Promise.resolve();
    });

    expect(result.current.hasActiveVoiceCaptureNow()).toBe(false);
    expect(nativeStt.startRecognition).not.toHaveBeenCalled();

    await act(async () => {
      finishPermissionCheck?.();
      await start;
    });

    expect(nativeStt.startRecognition).toHaveBeenCalledTimes(1);
    expect(result.current.hasActiveVoiceCaptureNow()).toBe(true);
  });

  it("honors a manual stop requested during native permission preparation", async () => {
    let finishPermissionCheck: (() => void) | null = null;
    const nativeStt = {
      ...buildParams().nativeStt,
      ensurePermissions: jest.fn(
        () =>
          new Promise<void>((resolve) => {
            finishPermissionCheck = resolve;
          }),
      ),
    };
    const params = buildParams({
      nativeStt,
      sttMode: "native" as const,
    });
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));
    let start: Promise<void> | null = null;
    let stop: Promise<void> | null = null;

    await act(async () => {
      start = result.current.startVoiceCapture();
      await Promise.resolve();
      stop = result.current.stopVoiceCapture();
      finishPermissionCheck?.();
      await Promise.all([start, stop]);
    });

    expect(nativeStt.startRecognition).toHaveBeenCalledTimes(1);
    expect(nativeStt.stopRecognition).toHaveBeenCalledTimes(1);
    expect(params.processCapturedVoiceTurn).toHaveBeenCalledWith({
      transcriptionOverride: "hello",
    });
  });

  it("cancels while the playback route is settling without starting capture", async () => {
    let finishRouteSettle: (() => void) | null = null;
    const player = {
      ...buildParams().player,
      waitForPlaybackRouteSettle: jest.fn(
        () =>
          new Promise<void>((resolve) => {
            finishRouteSettle = resolve;
          }),
      ),
    };
    const params = buildParams({ player });
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));
    let start: Promise<void> | null = null;
    let cancel: Promise<void> | null = null;

    await act(async () => {
      start = result.current.startVoiceCapture();
      await Promise.resolve();
      expect(result.current.hasActiveVoiceCaptureNow()).toBe(true);
      cancel = result.current.cancelVoiceCapture();
      finishRouteSettle?.();
      await Promise.all([start, cancel]);
    });

    expect(result.current.hasActiveVoiceCaptureNow()).toBe(false);
    expect(params.recorder.startRecording).not.toHaveBeenCalled();
    expect(params.recorder.stopRecording).not.toHaveBeenCalled();
    expect(params.processCapturedVoiceTurn).not.toHaveBeenCalled();
  });

  it("suppresses and cleans a capture cancelled while stop is in flight", async () => {
    let finishStopping: ((uri: string) => void) | null = null;
    const recorder = {
      ...buildParams().recorder,
      stopRecording: jest.fn(
        () =>
          new Promise<string>((resolve) => {
            finishStopping = resolve;
          }),
      ),
    };
    const params = buildParams({ recorder });
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));
    let stop: Promise<void> | null = null;
    let cancel: Promise<void> | null = null;

    await act(async () => {
      await result.current.startVoiceCapture();
      stop = result.current.stopVoiceCapture();
      await Promise.resolve();
      cancel = result.current.cancelVoiceCapture();
      finishStopping?.("file:///tmp/cancelled.wav");
      await Promise.all([stop, cancel]);
    });

    expect(recorder.stopRecording).toHaveBeenCalledTimes(1);
    expect(cleanupCapturedAudio).toHaveBeenCalledWith(
      "file:///tmp/cancelled.wav",
    );
    expect(params.processCapturedVoiceTurn).not.toHaveBeenCalled();
    expect(params.showToast).not.toHaveBeenCalled();
  });

  it("coalesces simultaneous stop requests into one submitted capture", async () => {
    let finishStopping: ((uri: string) => void) | null = null;
    const recorder = {
      ...buildParams().recorder,
      stopRecording: jest.fn(
        () =>
          new Promise<string>((resolve) => {
            finishStopping = resolve;
          }),
      ),
    };
    const params = buildParams({ recorder });
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));

    await act(async () => {
      await result.current.startVoiceCapture();
    });

    let firstStop: Promise<void> | undefined;
    let secondStop: Promise<void> | undefined;
    await act(async () => {
      firstStop = result.current.stopVoiceCapture();
      secondStop = result.current.stopVoiceCapture();
      finishStopping?.("file:///tmp/recording.wav");
      await Promise.all([firstStop, secondStop]);
    });

    expect(firstStop).toBe(secondStop);
    expect(recorder.stopRecording).toHaveBeenCalledTimes(1);
    expect(params.processCapturedVoiceTurn).toHaveBeenCalledTimes(1);
  });

  it("ignores a stop request when no capture was started", async () => {
    const params = buildParams();
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));

    await act(async () => {
      await result.current.stopVoiceCapture();
    });

    expect(params.recorder.stopRecording).not.toHaveBeenCalled();
    expect(params.processCapturedVoiceTurn).not.toHaveBeenCalled();
  });

  it("shows feedback when system speech recognition returns no transcript", async () => {
    const nativeStt = {
      ...buildParams().nativeStt,
      stopRecognition: jest.fn(async () => null),
    };
    const params = buildParams({
      nativeStt,
      sttMode: "native" as const,
    });
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));

    await act(async () => {
      await result.current.startVoiceCapture();
      await result.current.stopVoiceCapture();
    });

    expect(params.processCapturedVoiceTurn).not.toHaveBeenCalled();
    expect(params.onCaptureStopStarted).toHaveBeenCalledTimes(1);
    expect(params.onCaptureStopAbandoned).toHaveBeenCalledTimes(1);
    expect(params.showToast).toHaveBeenCalledWith("couldntCatchThatTryAgain");
  });

  it("shows feedback when provider recording produces no audio", async () => {
    const recorder = {
      ...buildParams().recorder,
      stopRecording: jest.fn(async () => null),
    };
    const params = buildParams({ recorder });
    const { result } = renderHook(() => useVoiceCaptureLifecycle(params));

    await act(async () => {
      await result.current.startVoiceCapture();
      await result.current.stopVoiceCapture();
    });

    expect(params.processCapturedVoiceTurn).not.toHaveBeenCalled();
    expect(params.onCaptureStopStarted).toHaveBeenCalledTimes(1);
    expect(params.onCaptureStopAbandoned).toHaveBeenCalledTimes(1);
    expect(params.showToast).toHaveBeenCalledWith("couldntCatchThatTryAgain");
  });
});
