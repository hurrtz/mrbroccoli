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
  getDriveCountdownCueAudioUri: jest.fn(
    async (urgency: number) => `file:///tmp/drive-countdown-${urgency}.wav`,
  ),
  getDriveReadyCueAudioUri: jest.fn(async () => "file:///tmp/drive-ready.wav"),
}));

const mockPlayNativeRecordingCue = jest.fn(async (_uri: string) => true);

jest.mock("../../src/services/nativeWaveform", () => ({
  playNativeRecordingCue: (uri: string) => mockPlayNativeRecordingCue(uri),
}));

async function flushAsyncWork() {
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
  }
}

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

  function renderController(overrides: Record<string, unknown> = {}) {
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
        ambientInputMetering: null as number | null,
        ambientMonitoring: false,
        audioRoute: "built-in",
        clearLastError: jest.fn(),
        ensurePermissions: jest.fn(async () => undefined),
        inputMetering: null as number | null,
        lastError: null,
        startAmbientMonitoring: jest.fn(async () => true),
        startRecording: jest.fn(async () => undefined),
        stopAmbientMonitoring: jest.fn(async () => true),
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
        })[key] ?? key,
      ttsApiKey: "tts-key",
      ttsProvider: "openai" as const,
      stopReplay: jest.fn(async () => undefined),
      ...overrides,
    };

    const hook = renderHook(() =>
      useVoiceSessionController(
        params as unknown as Parameters<typeof useVoiceSessionController>[0],
      ),
    );
    return {
      ...hook,
      params,
      rerender: () => hook.rerender(undefined),
    };
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

  it("does not start recording while the selected voice route is unavailable", async () => {
    const { result, params } = renderController({
      promptSubmissionBlockMessage: "Install Kokoro first.",
      settings: {
        inputMode: "toggle-to-talk",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "kokoro",
        providerSttModels: {},
      },
    });

    await act(async () => {
      await result.current.handleTogglePress();
    });

    expect(params.showToast).toHaveBeenCalledWith(
      "Install Kokoro first.",
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

  it("stops spoken playback, preserves a partial reply, and starts a barge-in recording", async () => {
    const abortController = new AbortController();
    const preserveInterruptedReply = jest.fn();
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
    const { result, params } = renderController({
      abortRef: { current: abortController },
      isBusy: true,
      player,
      preserveInterruptedReply,
    });

    await act(async () => {
      await result.current.handleInterruptPlayback();
    });

    expect(preserveInterruptedReply).toHaveBeenCalledTimes(1);
    expect(abortController.signal.aborted).toBe(true);
    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
    expect(player.pausePlayback).not.toHaveBeenCalled();
    expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
  });

  it("completely stops playback and cancels prefetched reply work", async () => {
    const abortController = new AbortController();
    const { result, params } = renderController({
      abortRef: { current: abortController },
      replayPhase: "speaking",
    });

    await act(async () => {
      await result.current.handleStopPlayback();
    });

    expect(abortController.signal.aborted).toBe(true);
    expect(params.stopReplay).toHaveBeenCalledTimes(1);
    expect(params.player.stopPlayback).toHaveBeenCalledTimes(1);
    expect(params.setPipelinePhase).toHaveBeenCalledWith("idle");
    expect(params.setStreamingText).toHaveBeenCalledWith("");
  });

  it("makes the small Stop action discard an active recording", async () => {
    const { result, params } = renderController({ isRecording: true });

    await act(async () => {
      await result.current.handleStopPlayback();
    });

    expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
    expect(params.handleVoiceCaptureDone).not.toHaveBeenCalled();
    expect(params.player.stopPlayback).toHaveBeenCalledTimes(1);
    expect(params.setPipelinePhase).toHaveBeenCalledWith("idle");
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

  it("starts Hands free without a synthetic cue and arms recording", async () => {
    const { result, params } = renderController({
      settings: {
        inputMode: "toggle-to-talk",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    act(() => {
      result.current.handleToggleHandsFree();
    });

    await waitFor(() => {
      expect(result.current.handsFreeEnabled).toBe(true);
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
    });
    expect(params.player.speakText).not.toHaveBeenCalled();
    expect(params.player.enqueueAudio).not.toHaveBeenCalled();
  });

  it("does not auto-arm again when a Hands-free turn ends without a reply", async () => {
    const { result, params, rerender } = renderController({
      settings: {
        inputMode: "toggle-to-talk",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    act(() => {
      result.current.handleToggleHandsFree();
    });
    await waitFor(() =>
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1),
    );
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

  it("auto-arms after a completed Hands-free reply returns to idle", async () => {
    const { result, params, rerender } = renderController({
      settings: {
        inputMode: "toggle-to-talk",
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

    act(() => {
      result.current.handleToggleHandsFree();
    });
    await waitFor(() =>
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1),
    );
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

  it("auto-arms again when a failed Hands-free turn returns to idle", async () => {
    const { result, params, rerender } = renderController({
      settings: {
        inputMode: "toggle-to-talk",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    act(() => {
      result.current.handleToggleHandsFree();
    });
    await waitFor(() =>
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1),
    );
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

  it("measures ambient levels while a Hands-free turn is processing but not during playback", async () => {
    const { result, params, rerender } = renderController({
      settings: {
        inputMode: "toggle-to-talk",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    act(() => {
      result.current.handleToggleHandsFree();
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    params.isRecording = true;
    act(() => rerender());

    await act(async () => {
      await result.current.handleTogglePress();
    });
    params.isRecording = false;
    params.isBusy = true;
    act(() => rerender());

    await waitFor(() =>
      expect(params.recorder.startAmbientMonitoring).toHaveBeenCalledTimes(1),
    );

    params.recorder.ambientMonitoring = true;
    params.recorder.ambientInputMetering = -52;
    act(() => rerender());

    const stopsBeforePlayback =
      params.recorder.stopAmbientMonitoring.mock.calls.length;
    params.player.isPlaying = true;
    act(() => rerender());

    await waitFor(() =>
      expect(
        params.recorder.stopAmbientMonitoring.mock.calls.length,
      ).toBeGreaterThan(stopsBeforePlayback),
    );
  });

  it("lets Stop abandon the current turn without disabling Hands free", async () => {
    const abortController = new AbortController();
    const { result, params } = renderController({
      abortRef: { current: abortController },
      isBusy: true,
      settings: {
        inputMode: "toggle-to-talk",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    act(() => {
      result.current.handleToggleHandsFree();
    });
    await act(async () => {
      await result.current.handleStopPlayback();
    });

    expect(abortController.signal.aborted).toBe(true);
    expect(params.player.stopPlayback).toHaveBeenCalledTimes(1);
    expect(params.recorder.startRecording).not.toHaveBeenCalled();
    expect(result.current.handsFreeEnabled).toBe(true);
  });

  it("turns Hands free off without cancelling the current turn", async () => {
    const { result, params } = renderController({
      settings: {
        inputMode: "toggle-to-talk",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    act(() => {
      result.current.handleToggleHandsFree();
      result.current.handleToggleHandsFree();
    });

    expect(result.current.handsFreeEnabled).toBe(false);
    expect(params.recorder.stopRecording).not.toHaveBeenCalled();
    expect(params.player.stopPlayback).not.toHaveBeenCalled();
    expect(params.player.speakText).not.toHaveBeenCalled();
  });

  it("turns Hands free on and arms recording when idle", async () => {
    const { result, params } = renderController({
      settings: {
        inputMode: "toggle-to-talk",
        spokenRepliesEnabled: true,
        sttMode: "provider",
        ttsMode: "provider",
        providerSttModels: {},
      },
    });

    act(() => {
      result.current.handleToggleHandsFree();
    });

    await waitFor(() => {
      expect(result.current.handsFreeEnabled).toBe(true);
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
    });
  });

  it("does not count down or auto-submit before the first Hands-free utterance", async () => {
    jest.useFakeTimers();
    try {
      const { result, params, rerender } = renderController({
        settings: {
          inputMode: "toggle-to-talk",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      act(() => {
        result.current.handleToggleHandsFree();
      });
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      params.isRecording = true;
      act(() => rerender());

      await act(async () => {
        jest.advanceTimersByTime(15_000);
        await Promise.resolve();
      });

      expect(result.current.handsFreeSilenceCountdownSeconds).toBeNull();
      expect(params.recorder.stopRecording).not.toHaveBeenCalled();
      expect(params.handleVoiceCaptureDone).not.toHaveBeenCalled();
    } finally {
      jest.useRealTimers();
    }
  });

  it("restarts the full Drive silence window after detected speech", async () => {
    jest.useFakeTimers();
    try {
      const { result, params, rerender } = renderController({
        settings: {
          inputMode: "toggle-to-talk",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      act(() => {
        result.current.handleToggleHandsFree();
      });
      await act(flushAsyncWork);
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

  it("cancels an expiring Drive countdown when moderate speech resumes", async () => {
    jest.useFakeTimers();
    try {
      const { result, params, rerender } = renderController({
        settings: {
          inputMode: "toggle-to-talk",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      act(() => {
        result.current.handleToggleHandsFree();
      });
      await act(flushAsyncWork);
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
      act(() => {
        jest.advanceTimersByTime(8_300);
      });

      expect(result.current.handsFreeSilenceCountdownSeconds).toBe(2);

      advanceWithLevel(150, -44);
      expect(result.current.handsFreeSilenceCountdownSeconds).toBeNull();

      for (const levelDb of [-41, -45, -39, -43]) {
        advanceWithLevel(150, levelDb);
      }

      expect(result.current.handsFreeVoiceActive).toBe(true);
      expect(result.current.handsFreeSilenceCountdownSeconds).toBeNull();

      for (let index = 0; index < 10; index += 1) {
        advanceWithLevel(150, index % 2 === 0 ? -42 : -38);
      }
      expect(params.recorder.stopRecording).not.toHaveBeenCalled();

      advanceWithLevel(150, -70);
      advanceWithLevel(150, -71);
      advanceWithLevel(150, -72);

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
          inputMode: "toggle-to-talk",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      act(() => {
        result.current.handleToggleHandsFree();
      });
      await act(flushAsyncWork);
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
        await flushAsyncWork();
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
          inputMode: "toggle-to-talk",
          spokenRepliesEnabled: true,
          sttMode: "provider",
          ttsMode: "provider",
          providerSttModels: {},
        },
      });

      act(() => {
        result.current.handleToggleHandsFree();
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
