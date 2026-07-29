import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AppState } from "react-native";

import { useVoiceSessionController } from "../../src/screens/main/useVoiceSessionController";

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../src/services/voicePipeline/cleanup", () => ({
  cleanupCapturedAudio: jest.fn(async () => undefined),
}));

jest.mock("../../src/services/playbackCues", () => ({
  getDriveCountdownCueAudioUri: jest.fn(async (urgency: number) =>
    `file:///tmp/drive-countdown-${urgency}.wav`
  ),
  getDriveReadyCueAudioUri: jest.fn(async () =>
    "file:///tmp/drive-ready.wav"
  ),
}));

const mockPlayNativeRecordingCue = jest.fn(async () => true);

jest.mock("../../src/services/nativeWaveform", () => ({
  playNativeRecordingCue: (...args: unknown[]) =>
    mockPlayNativeRecordingCue(...args),
}));

describe("useVoiceSessionController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(AppState, "addEventListener")
      .mockReturnValue({ remove: jest.fn() } as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderController(
    overrides: Partial<
      Parameters<typeof useVoiceSessionController>[0]
    > = {},
  ) {
    const params = {
      abortRef: { current: null as AbortController | null },
      availableSttProviders: ["openai"],
      availableTtsProviders: ["openai"],
      completedReplyVersion: 0,
      handleVoiceCaptureDone: jest.fn(async () => undefined),
      isBusy: false,
      isRecording: false,
      lastCompletedReplyRef: { current: "" },
      mainSurfaceVisible: true,
      nativeStt: {
        abortRecognition: jest.fn(async () => undefined),
        clearLastError: jest.fn(),
        ensurePermissions: jest.fn(async () => undefined),
        isAvailable: true,
        lastError: null,
        startRecognition: jest.fn(async () => undefined),
        stopRecognition: jest.fn(async () => null),
      },
      player: {
        enqueueAudio: jest.fn(),
        isPlaybackPaused: false,
        isPlaying: false,
        pausePlayback: jest.fn(async () => true),
        resetCancellation: jest.fn(),
        resumePlayback: jest.fn(async () => true),
        speakText: jest.fn(),
        stopPlayback: jest.fn(async () => undefined),
        waitForDrain: jest.fn(async () => undefined),
        waitForPlaybackRouteSettle: jest.fn(async () => undefined),
      },
      playReplyText: jest.fn(async () => undefined),
      providerApiKey: "provider-key",
      providerLabel: "OpenAI",
      recorder: {
        clearLastError: jest.fn(),
        ensurePermissions: jest.fn(async () => undefined),
        inputMetering: null as number | null,
        lastError: null,
        startRecording: jest.fn(async () => undefined),
        stopRecording: jest.fn(async () => "file://voice.m4a"),
      },
      replayPhase: "idle" as const,
      setPipelinePhase: jest.fn(),
      setStreamingText: jest.fn(),
      settings: {
        inputMode: "toggle-to-talk" as const,
        spokenRepliesEnabled: true,
        sttMode: "provider" as const,
        ttsMode: "provider" as const,
        providerSttModels: {} as Record<string, string>,
      },
      showToast: jest.fn(),
      sttApiKey: "stt-key",
      sttProvider: "openai" as const,
      t: (key, params) =>
        ({
          addProviderKeyToUseProvider: `missing ${params?.provider}`,
          configureCredentialsBeforeVoiceSession: "missing credentials",
          couldntProcessVoiceInput: "process failed",
          couldntStartVoiceInput: "start failed",
          pausePlaybackUnavailable: "pause unavailable",
        }[key] ?? key),
      ttsApiKey: "tts-key",
      ttsProvider: "openai" as const,
      stopReplay: jest.fn(async () => undefined),
      ...overrides,
    };

    const hook = renderHook(() => useVoiceSessionController(params));
    return { ...hook, params };
  }

  it("shows a provider-specific toast instead of starting when the provider key is missing", async () => {
    const { result, params } = renderController({ providerApiKey: "" });

    await act(async () => {
      await result.current.handlePressIn();
    });

    expect(params.showToast).toHaveBeenCalledWith(
      "missing OpenAI",
      undefined,
      "danger",
    );
    expect(params.recorder.startRecording).not.toHaveBeenCalled();
  });

  it("starts recording when idle and all routes are ready", async () => {
    const { result, params } = renderController();

    await act(async () => {
      await result.current.handleTogglePress();
    });

    expect(params.player.waitForPlaybackRouteSettle).toHaveBeenCalledTimes(1);
    expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
  });

  it("pauses active playback instead of cancelling the reply", async () => {
    const player = {
      isPlaybackPaused: false,
      isPlaying: true,
      pausePlayback: jest.fn(async () => true),
      resetCancellation: jest.fn(),
      resumePlayback: jest.fn(async () => true),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
      waitForPlaybackRouteSettle: jest.fn(async () => undefined),
    };
    const { result, params } = renderController({ player });

    await act(async () => {
      await result.current.handleTogglePress();
    });

    expect(player.pausePlayback).toHaveBeenCalledTimes(1);
    expect(player.stopPlayback).not.toHaveBeenCalled();
    expect(params.recorder.startRecording).not.toHaveBeenCalled();
  });

  it("resumes paused playback from the main voice control", async () => {
    const player = {
      isPlaybackPaused: true,
      isPlaying: true,
      pausePlayback: jest.fn(async () => true),
      resetCancellation: jest.fn(),
      resumePlayback: jest.fn(async () => true),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
      waitForPlaybackRouteSettle: jest.fn(async () => undefined),
    };
    const { result } = renderController({ player });

    await act(async () => {
      await result.current.handleTogglePress();
    });

    expect(player.resumePlayback).toHaveBeenCalledTimes(1);
    expect(player.pausePlayback).not.toHaveBeenCalled();
  });

  it("processes a completed recording through the voice pipeline", async () => {
    const { result, params } = renderController({ isRecording: true });

    await act(async () => {
      await result.current.handleTogglePress();
    });

    await waitFor(() => {
      expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
      expect(params.setPipelinePhase).toHaveBeenCalledWith("transcribing");
      expect(params.handleVoiceCaptureDone).toHaveBeenCalledWith({
        audioUri: "file://voice.m4a",
      });
    });
  });

  it("cancels generation without erasing the submitted user turn", async () => {
    const abortController = new AbortController();
    const { result, params } = renderController({
      abortRef: { current: abortController },
      isBusy: true,
    });

    await act(async () => {
      await result.current.handleTogglePress();
    });

    expect(abortController.signal.aborted).toBe(true);
    expect(params.setPipelinePhase).toHaveBeenCalledWith("idle");
    expect(params.player.stopPlayback).toHaveBeenCalledTimes(1);
  });

  it("clears pending playback while resetting even when rendered playback state lags", async () => {
    const player = {
      isPlaybackPaused: false,
      isPlaying: false,
      pausePlayback: jest.fn(async () => true),
      resetCancellation: jest.fn(),
      resumePlayback: jest.fn(async () => true),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
      waitForPlaybackRouteSettle: jest.fn(async () => undefined),
    };
    const { result } = renderController({ player });

    await act(async () => {
      await result.current.resetVoiceSessionState();
    });

    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
  });

  it("discards an active provider recording while resetting the conversation", async () => {
    const { result, params } = renderController({ isRecording: true });

    await act(async () => {
      await result.current.resetVoiceSessionState();
    });

    expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
    expect(params.handleVoiceCaptureDone).not.toHaveBeenCalled();
    expect(params.setPipelinePhase).toHaveBeenCalledWith("idle");
  });

  it("starts Drive Session without a synthetic cue and arms recording", async () => {
    const { result, params } = renderController({
      settings: {
        inputMode: "drive-session",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    await act(async () => {
      await result.current.handleTogglePress();
    });

    await waitFor(() => {
      expect(result.current.driveAutoContinueEnabled).toBe(true);
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
    });
    expect(params.player.speakText).not.toHaveBeenCalled();
    expect(params.player.enqueueAudio).not.toHaveBeenCalled();
  });

  it("does not auto-arm again when a Drive turn ends without a reply", async () => {
    const { result, params, rerender } = renderController({
      settings: {
        inputMode: "drive-session",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    await act(async () => {
      await result.current.handleTogglePress();
    });
    params.isRecording = true;
    act(() => rerender());
    await act(async () => {
      await result.current.handleTogglePress();
    });
    params.isRecording = false;
    act(() => rerender());

    expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
    expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
  });

  it("auto-arms after a completed Drive reply returns to idle", async () => {
    const { result, params, rerender } = renderController({
      settings: {
        inputMode: "drive-session",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });
    let finishReadyCue: () => void = () => undefined;
    params.player.waitForDrain.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishReadyCue = resolve;
        }),
    );

    await act(async () => {
      await result.current.handleTogglePress();
    });
    params.isRecording = true;
    act(() => rerender());
    await act(async () => {
      await result.current.handleTogglePress();
    });

    params.isRecording = false;
    params.isBusy = true;
    params.completedReplyVersion = 1;
    act(() => rerender());
    expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);

    params.isBusy = false;
    act(() => rerender());

    await waitFor(() =>
      expect(params.player.enqueueAudio).toHaveBeenCalledWith(
        "file:///tmp/drive-ready.wav",
      ),
    );
    expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);

    await act(async () => {
      finishReadyCue();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(2),
    );
    expect(params.player.waitForDrain).toHaveBeenCalledTimes(1);
  });

  it("auto-arms again when a failed Drive turn returns to idle", async () => {
    const { result, params, rerender } = renderController({
      settings: {
        inputMode: "drive-session",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    await act(async () => {
      await result.current.handleTogglePress();
    });
    params.isRecording = true;
    act(() => rerender());
    await act(async () => {
      await result.current.handleTogglePress();
    });

    params.isRecording = false;
    params.isBusy = true;
    act(() => rerender());
    params.isBusy = false;
    act(() => rerender());

    await waitFor(() =>
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(2),
    );
    expect(params.completedReplyVersion).toBe(0);
  });

  it("uses the Drive Session primary action to cancel processing without immediately re-arming", async () => {
    const abortController = new AbortController();
    const { result, params } = renderController({
      abortRef: { current: abortController },
      isBusy: true,
      settings: {
        inputMode: "drive-session",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    await act(async () => {
      await result.current.handleTogglePress();
    });

    expect(abortController.signal.aborted).toBe(true);
    expect(params.player.stopPlayback).toHaveBeenCalledTimes(1);
    expect(params.recorder.startRecording).not.toHaveBeenCalled();
    expect(result.current.driveAutoContinueEnabled).toBe(true);
  });

  it("pauses automatic continuation without cancelling the current turn", async () => {
    const { result, params } = renderController({
      settings: {
        inputMode: "drive-session",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    await act(async () => {
      await result.current.handleStopDriveSession();
    });

    expect(result.current.driveAutoContinueEnabled).toBe(false);
    expect(params.recorder.stopRecording).not.toHaveBeenCalled();
    expect(params.player.stopPlayback).not.toHaveBeenCalled();
    expect(params.player.speakText).not.toHaveBeenCalled();
  });

  it("resumes automatic continuation and arms recording when idle", async () => {
    const { result, params } = renderController({
      settings: {
        inputMode: "drive-session",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    act(() => {
      result.current.handleStopDriveSession();
    });
    expect(result.current.driveAutoContinueEnabled).toBe(false);

    await act(async () => {
      result.current.handleContinueDriveSession();
    });

    await waitFor(() => {
      expect(result.current.driveAutoContinueEnabled).toBe(true);
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
    });
  });

  it("repeats the last reply and resumes listening only while auto continuation is enabled", async () => {
    const { result, params } = renderController({
      lastCompletedReplyRef: { current: "Last answer" },
      settings: {
        inputMode: "drive-session",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    await act(async () => {
      await result.current.handleRepeatDriveReply();
    });

    expect(params.playReplyText).toHaveBeenCalledWith("Last answer");
    expect(result.current.driveAutoContinueEnabled).toBe(true);
    await waitFor(() =>
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1),
    );

    act(() => {
      result.current.handleStopDriveSession();
    });
    jest.clearAllMocks();

    await act(async () => {
      await result.current.handleRepeatDriveReply();
    });

    expect(params.playReplyText).toHaveBeenCalledWith("Last answer");
    expect(params.recorder.startRecording).not.toHaveBeenCalled();
  });

  it("auto-submits a Drive recording after ten seconds of silence", async () => {
    jest.useFakeTimers();
    try {
      const { result, params, rerender } = renderController({
        settings: {
          inputMode: "drive-session",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      await act(async () => {
        await result.current.handleTogglePress();
      });
      params.isRecording = true;
      act(() => rerender());

      await act(async () => {
        jest.advanceTimersByTime(10_200);
        await Promise.resolve();
      });

      expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
      expect(params.handleVoiceCaptureDone).toHaveBeenCalledWith({
        audioUri: "file://voice.m4a",
      });
    } finally {
      jest.useRealTimers();
    }
  });

  it("restarts the full Drive silence window after detected speech", async () => {
    jest.useFakeTimers();
    try {
      const { result, params, rerender } = renderController({
        settings: {
          inputMode: "drive-session",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      await act(async () => {
        await result.current.handleTogglePress();
      });
      params.isRecording = true;
      act(() => rerender());

      act(() => {
        jest.advanceTimersByTime(700);
        params.recorder.inputMetering = -20;
        rerender();
      });
      act(() => {
        jest.advanceTimersByTime(150);
        params.recorder.inputMetering = -19;
        rerender();
      });
      act(() => {
        params.recorder.inputMetering = -70;
        rerender();
      });
      act(() => {
        jest.advanceTimersByTime(150);
        params.recorder.inputMetering = -71;
        rerender();
      });
      act(() => {
        jest.advanceTimersByTime(150);
        params.recorder.inputMetering = -72;
        rerender();
      });
      act(() => {
        jest.advanceTimersByTime(9_300);
      });

      expect(params.recorder.stopRecording).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(900);
        await Promise.resolve();
      });

      expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not let brief background chatter keep a Drive turn open", async () => {
    jest.useFakeTimers();
    try {
      const { result, params, rerender } = renderController({
        settings: {
          inputMode: "drive-session",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      await act(async () => {
        await result.current.handleTogglePress();
      });
      params.isRecording = true;
      act(() => rerender());

      const advanceWithLevel = (durationMs: number, metering: number) => {
        act(() => {
          jest.advanceTimersByTime(durationMs);
          params.recorder.inputMetering = metering;
          rerender();
        });
      };

      advanceWithLevel(700, -20);
      advanceWithLevel(150, -19);
      advanceWithLevel(150, -70);
      advanceWithLevel(150, -71);
      advanceWithLevel(150, -72);

      for (const quietBeforeBurstMs of [1_800, 2_550, 2_550]) {
        advanceWithLevel(quietBeforeBurstMs, -36);
        advanceWithLevel(150, -35);
        advanceWithLevel(150, -52);
      }

      expect(params.recorder.stopRecording).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(2_100);
        await Promise.resolve();
      });

      expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
      expect(params.handleVoiceCaptureDone).toHaveBeenCalledWith({
        audioUri: "file://voice.m4a",
      });
    } finally {
      jest.useRealTimers();
    }
  });

  it("plays soft recording-safe cues for the final Drive countdown", async () => {
    jest.useFakeTimers();
    try {
      const { result, params, rerender } = renderController({
        settings: {
          inputMode: "drive-session",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      await act(async () => {
        await result.current.handleTogglePress();
      });
      params.isRecording = true;
      act(() => rerender());

      await act(async () => {
        jest.advanceTimersByTime(9_200);
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(mockPlayNativeRecordingCue).toHaveBeenCalledTimes(3);
      expect(mockPlayNativeRecordingCue).toHaveBeenNthCalledWith(
        1,
        "file:///tmp/drive-countdown-1.wav",
      );
      expect(mockPlayNativeRecordingCue).toHaveBeenNthCalledWith(
        3,
        "file:///tmp/drive-countdown-3.wav",
      );
    } finally {
      jest.useRealTimers();
    }
  });
});
