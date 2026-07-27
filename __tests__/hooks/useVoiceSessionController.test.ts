import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AppState } from "react-native";

import { useVoiceSessionController } from "../../src/screens/main/useVoiceSessionController";

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../src/services/voicePipeline/cleanup", () => ({
  cleanupCapturedAudio: jest.fn(async () => undefined),
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

  it("stops the complete interaction from the explicit speaking stop control", async () => {
    const abortController = new AbortController();
    const { result, params } = renderController({
      abortRef: { current: abortController },
      isBusy: true,
    });

    await act(async () => {
      await result.current.handleStopInteraction();
    });

    expect(abortController.signal.aborted).toBe(true);
    expect(params.setPipelinePhase).toHaveBeenCalledWith("idle");
    expect(params.setStreamingText).toHaveBeenCalledWith("");
    expect(params.player.stopPlayback).toHaveBeenCalledTimes(1);
  });

  it("starts Drive Session with an audible cue and arms recording", async () => {
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
      expect(result.current.driveSessionActive).toBe(true);
      expect(params.player.speakText).toHaveBeenCalledWith(
        "driveSessionListeningCue",
      );
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1);
    });
  });

  it("uses the Drive Session primary action to interrupt and re-arm", async () => {
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
      await result.current.handleContinueDriveSession();
    });
    expect(result.current.driveSessionActive).toBe(true);

    await act(async () => {
      await result.current.handleTogglePress();
    });

    expect(abortController.signal.aborted).toBe(true);
    expect(params.stopReplay).toHaveBeenCalledTimes(1);
    expect(params.player.stopPlayback).toHaveBeenCalledTimes(1);
  });

  it("stops Drive Session, cancels capture, and announces the stop", async () => {
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
      await result.current.handleContinueDriveSession();
    });
    await waitFor(() =>
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1),
    );

    await act(async () => {
      await result.current.handleStopDriveSession();
    });

    expect(result.current.driveSessionActive).toBe(false);
    expect(params.recorder.stopRecording).toHaveBeenCalledTimes(1);
    expect(params.player.speakText).toHaveBeenLastCalledWith(
      "driveSessionStoppedCue",
    );
  });

  it("repeats the last reply and resumes an active Drive Session", async () => {
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
      await result.current.handleContinueDriveSession();
    });
    await waitFor(() =>
      expect(params.recorder.startRecording).toHaveBeenCalledTimes(1),
    );

    await act(async () => {
      await result.current.handleRepeatDriveReply();
    });

    expect(params.playReplyText).toHaveBeenCalledWith("Last answer");
    expect(result.current.driveSessionActive).toBe(true);
  });
});
