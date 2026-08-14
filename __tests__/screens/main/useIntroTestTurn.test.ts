import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useAudioRecorder } from "../../../src/hooks/useAudioRecorder";
import { transcribeRecordedFile } from "../../../src/hooks/nativeSpeechRecognizer/transcribeRecordedFile";
import { useIntroTestTurn } from "../../../src/screens/main/useIntroTestTurn";
import { runVoicePipeline } from "../../../src/services/voicePipeline";
import { cleanupCapturedAudio } from "../../../src/services/voicePipeline/cleanup";

jest.mock("../../../src/hooks/useAudioRecorder", () => ({
  useAudioRecorder: jest.fn(),
}));

jest.mock(
  "../../../src/hooks/nativeSpeechRecognizer/transcribeRecordedFile",
  () => ({
    transcribeRecordedFile: jest.fn(),
  }),
);

jest.mock("../../../src/services/voicePipeline", () => ({
  runVoicePipeline: jest.fn(),
}));

jest.mock("../../../src/services/voicePipeline/cleanup", () => ({
  cleanupCapturedAudio: jest.fn(async () => undefined),
}));

const mockUseAudioRecorder = jest.mocked(useAudioRecorder);
const mockTranscribeRecordedFile = jest.mocked(transcribeRecordedFile);
const mockRunVoicePipeline = jest.mocked(runVoicePipeline);
const mockCleanupCapturedAudio = jest.mocked(cleanupCapturedAudio);

type IntroTestTurnParams = Parameters<typeof useIntroTestTurn>[0];
type IntroTestRouteParams = ReturnType<IntroTestTurnParams["getRouteParams"]>;
type IntroTestTurnPlayer = IntroTestTurnParams["player"];

const startRecording = jest.fn(async () => undefined);
const stopRecording = jest.fn(async () => "file://intro-recording.m4a");
const t = ((key: string) => key) as IntroTestTurnParams["t"];

function deferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

function createRouteParams(
  overrides: Partial<IntroTestRouteParams> = {},
): IntroTestRouteParams {
  return {
    assistantInstructions: "Be helpful.",
    kokoroVoices: { en: "af_maple", zh: "zf_001" },
    language: "en",
    localLlmModelId: undefined,
    localSttModelId: null,
    localTtsModelId: null,
    model: "gpt-5.4",
    modelEffort: undefined,
    nativeSttRequiresOnDevice: false,
    provider: "openai",
    providerApiKey: "provider-key",
    replyPlayback: "stream",
    responseLength: "normal",
    responseTone: "professional",
    spokenRepliesEnabled: true,
    sttApiKey: "",
    sttLanguage: "auto",
    sttMode: "provider",
    sttModel: "gpt-4o-mini-transcribe",
    sttProvider: "openai",
    ttsApiKey: "tts-key",
    ttsFallbackRoutes: ["kokoro", "native"],
    ttsInstructions: "Speak naturally.",
    ttsListenLanguages: ["en"],
    ttsMode: "provider",
    ttsModel: "gpt-4o-mini-tts",
    ttsProvider: "openai",
    ttsVoice: "alloy",
    ...overrides,
  };
}

function createPlayer(
  overrides: Partial<IntroTestTurnPlayer> = {},
): IntroTestTurnPlayer {
  return {
    enqueueAudio: jest.fn(),
    resetCancellation: jest.fn(),
    speakText: jest.fn(),
    stopPlayback: jest.fn(async () => undefined),
    waitForDrain: jest.fn(async () => undefined),
    ...overrides,
  };
}

function renderIntroTestTurn({
  active = true,
  player = createPlayer(),
  routeParams = createRouteParams(),
}: {
  active?: boolean;
  player?: IntroTestTurnPlayer;
  routeParams?: IntroTestRouteParams;
} = {}) {
  const getRouteParams = jest.fn(() => routeParams);
  const view = renderHook(
    ({ isActive }: { isActive: boolean }) =>
      useIntroTestTurn({
        active: isActive,
        getRouteParams,
        player,
        t,
      }),
    { initialProps: { isActive: active } },
  );
  return { ...view, getRouteParams, player };
}

async function recordTurn(
  result: ReturnType<typeof renderIntroTestTurn>["result"],
) {
  act(() => {
    result.current.onPressIn();
  });
  expect(result.current.phase).toBe("recording");

  act(() => {
    result.current.onPressOut();
  });

  await waitFor(() => {
    expect(result.current.phase).toBe("idle");
  });
}

describe("useIntroTestTurn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    startRecording.mockReset().mockResolvedValue(undefined);
    stopRecording.mockReset().mockResolvedValue("file://intro-recording.m4a");
    mockUseAudioRecorder.mockReturnValue({
      startRecording,
      stopRecording,
    } as unknown as ReturnType<typeof useAudioRecorder>);
    mockTranscribeRecordedFile.mockResolvedValue("What is chlorophyll?");
    mockRunVoicePipeline.mockImplementation(async (params) => {
      const transcription = params.transcriptionOverride ?? "Provider question";
      params.callbacks.onTranscription(transcription);
      params.callbacks.onResponseDone("It helps plants capture light.");
      return transcription;
    });
  });

  it("ignores capture gestures while the intro route is inactive", () => {
    const { getRouteParams, result } = renderIntroTestTurn({ active: false });

    act(() => {
      result.current.onPressIn();
      result.current.onPressOut();
    });

    expect(result.current.phase).toBe("idle");
    expect(startRecording).not.toHaveBeenCalled();
    expect(getRouteParams).not.toHaveBeenCalled();
  });

  it("transcribes native recordings before running the configured route", async () => {
    const routeParams = createRouteParams({
      nativeSttRequiresOnDevice: true,
      sttApiKey: "",
      sttMode: "native",
      sttModel: undefined,
      sttProvider: null,
    });
    const { result } = renderIntroTestTurn({ routeParams });

    await recordTurn(result);

    expect(mockTranscribeRecordedFile).toHaveBeenCalledWith({
      abortSignal: expect.any(AbortSignal),
      fileUri: "file://intro-recording.m4a",
      finalTranscriptRef: expect.objectContaining({ current: "" }),
      latestTranscriptRef: expect.objectContaining({ current: "" }),
      requiresOnDeviceRecognition: true,
      sttLanguage: "auto",
      t,
    });
    expect(mockRunVoicePipeline).toHaveBeenCalledWith(
      expect.objectContaining({
        audioUri: "file://intro-recording.m4a",
        sttMode: "native",
        transcriptionOverride: "What is chlorophyll?",
        ttsFallbackRoutes: ["kokoro", "native"],
      }),
    );
    expect(mockRunVoicePipeline.mock.calls[0]?.[0]).not.toHaveProperty(
      "nativeSttRequiresOnDevice",
    );
    expect(result.current.phase).toBe("idle");
    expect(result.current.turn).toEqual({
      answer: "It helps plants capture light.",
      latencyLabel: null,
      question: "What is chlorophyll?",
      successful: true,
    });
    expect(result.current.error).toBeNull();
  });

  it("surfaces a native recognition failure with no transcript", async () => {
    mockTranscribeRecordedFile.mockResolvedValueOnce(null);
    const routeParams = createRouteParams({
      nativeSttRequiresOnDevice: true,
      sttApiKey: "",
      sttMode: "native",
      sttModel: undefined,
      sttProvider: null,
    });
    const { result } = renderIntroTestTurn({ routeParams });

    await recordTurn(result);

    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
    expect(result.current.turn).toBeNull();
    expect(result.current.error).toBe("introTestTurnFailed");
  });

  it("resets a stopped shared player before a new test turn", async () => {
    const player = createPlayer();
    const { result } = renderIntroTestTurn({ player });

    await recordTurn(result);

    expect(player.resetCancellation).toHaveBeenCalledTimes(1);
    expect(
      (player.resetCancellation as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan(mockRunVoicePipeline.mock.invocationCallOrder[0]);
  });

  it("resets a stopped shared player before replaying", async () => {
    const player = createPlayer();
    mockRunVoicePipeline.mockImplementationOnce(async (params) => {
      params.callbacks.onTranscription("Question");
      params.callbacks.onResponseDone("Answer");
      params.callbacks.onAudioReady("file://intro-answer.m4a");
      return "Question";
    });
    const { result } = renderIntroTestTurn({ player });
    await recordTurn(result);
    (player.resetCancellation as jest.Mock).mockClear();
    (player.enqueueAudio as jest.Mock).mockClear();

    await act(async () => {
      result.current.onReplay();
      await Promise.resolve();
    });

    expect(player.resetCancellation).toHaveBeenCalledTimes(1);
    expect(
      (player.resetCancellation as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan(
      (player.enqueueAudio as jest.Mock).mock.invocationCallOrder[0],
    );
  });

  it("aborts native recorded-file recognition when the flow exits", async () => {
    let recognitionSignal: AbortSignal | undefined;
    mockTranscribeRecordedFile.mockImplementationOnce(
      ({ abortSignal }) =>
        new Promise((resolve) => {
          recognitionSignal = abortSignal;
          abortSignal?.addEventListener("abort", () => resolve(null), {
            once: true,
          });
        }),
    );
    const { rerender, result } = renderIntroTestTurn({
      routeParams: createRouteParams({
        sttMode: "native",
        sttModel: undefined,
        sttProvider: null,
      }),
    });

    act(() => {
      result.current.onPressIn();
    });
    await waitFor(() => {
      expect(startRecording).toHaveBeenCalledTimes(1);
    });
    act(() => {
      result.current.onPressOut();
    });
    await waitFor(() => {
      expect(mockTranscribeRecordedFile).toHaveBeenCalledTimes(1);
    });

    rerender({ isActive: false });

    expect(recognitionSignal?.aborted).toBe(true);
    await waitFor(() => {
      expect(mockCleanupCapturedAudio).toHaveBeenCalledWith(
        "file://intro-recording.m4a",
      );
    });
  });

  it("aborts native recorded-file recognition when the flow unmounts", async () => {
    let recognitionSignal: AbortSignal | undefined;
    mockTranscribeRecordedFile.mockImplementationOnce(
      ({ abortSignal }) =>
        new Promise((resolve) => {
          recognitionSignal = abortSignal;
          abortSignal?.addEventListener("abort", () => resolve(null), {
            once: true,
          });
        }),
    );
    const { result, unmount } = renderIntroTestTurn({
      routeParams: createRouteParams({
        sttMode: "native",
        sttModel: undefined,
        sttProvider: null,
      }),
    });

    act(() => {
      result.current.onPressIn();
    });
    act(() => {
      result.current.onPressOut();
    });
    await waitFor(() => {
      expect(mockTranscribeRecordedFile).toHaveBeenCalledTimes(1);
    });

    unmount();

    expect(recognitionSignal?.aborted).toBe(true);
  });

  it("returns to idle when recording fails to start", async () => {
    startRecording.mockRejectedValueOnce(new Error("Recorder start failed"));
    const { result } = renderIntroTestTurn();

    act(() => {
      result.current.onPressIn();
    });

    await waitFor(() => {
      expect(result.current.phase).toBe("idle");
    });
    expect(result.current.error).toBe("introTestTurnFailed");
    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
  });

  it("returns to idle when recording fails to stop", async () => {
    stopRecording.mockRejectedValueOnce(new Error("Recorder stop failed"));
    const { result } = renderIntroTestTurn();

    act(() => {
      result.current.onPressIn();
    });
    act(() => {
      result.current.onPressOut();
    });

    await waitFor(() => {
      expect(result.current.phase).toBe("idle");
    });
    expect(result.current.error).toBe("introTestTurnFailed");
    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
  });

  it("surfaces an empty recorder result", async () => {
    stopRecording.mockResolvedValueOnce(null);
    const { result } = renderIntroTestTurn();

    act(() => {
      result.current.onPressIn();
    });
    act(() => {
      result.current.onPressOut();
    });

    await waitFor(() => {
      expect(result.current.phase).toBe("idle");
    });
    expect(result.current.error).toBe("introTestTurnFailed");
    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
  });

  it("cleans a captured URI returned after the flow exits", async () => {
    const stopped = deferred<string | null>();
    stopRecording.mockReturnValueOnce(stopped.promise);
    const { rerender, result } = renderIntroTestTurn();

    act(() => {
      result.current.onPressIn();
    });
    await waitFor(() => {
      expect(startRecording).toHaveBeenCalledTimes(1);
    });
    act(() => {
      result.current.onPressOut();
    });
    expect(result.current.phase).toBe("running");

    rerender({ isActive: false });
    await act(async () => {
      stopped.resolve("file://stale-intro-recording.m4a");
      await stopped.promise;
    });

    expect(mockCleanupCapturedAudio).toHaveBeenCalledWith(
      "file://stale-intro-recording.m4a",
    );
    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
  });

  it("does not start a queued recording after the flow exits", async () => {
    const firstStop = deferred<string | null>();
    stopRecording.mockReturnValueOnce(firstStop.promise);
    const { rerender, result } = renderIntroTestTurn();

    act(() => {
      result.current.onPressIn();
    });
    await waitFor(() => {
      expect(startRecording).toHaveBeenCalledTimes(1);
    });
    rerender({ isActive: false });
    await waitFor(() => {
      expect(stopRecording).toHaveBeenCalledTimes(1);
    });

    rerender({ isActive: true });
    act(() => {
      result.current.onPressIn();
    });
    rerender({ isActive: false });

    await act(async () => {
      firstStop.resolve("file://first-intro-recording.m4a");
      await firstStop.promise;
      await Promise.resolve();
    });

    expect(startRecording).toHaveBeenCalledTimes(1);
    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
  });

  it("stops and cleans a native recording whose start finishes after exit", async () => {
    const start = deferred<void>();
    startRecording.mockReturnValueOnce(start.promise);
    const { rerender, result } = renderIntroTestTurn();

    act(() => {
      result.current.onPressIn();
    });
    await waitFor(() => {
      expect(startRecording).toHaveBeenCalledTimes(1);
    });

    rerender({ isActive: false });
    await act(async () => {
      start.resolve();
      await start.promise;
    });

    await waitFor(() => {
      expect(stopRecording).toHaveBeenCalledTimes(1);
      expect(mockCleanupCapturedAudio).toHaveBeenCalledWith(
        "file://intro-recording.m4a",
      );
    });
    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
  });

  it("stops and cleans an active intro recording when the flow exits", async () => {
    const { rerender, result } = renderIntroTestTurn();

    act(() => {
      result.current.onPressIn();
    });
    await waitFor(() => {
      expect(startRecording).toHaveBeenCalledTimes(1);
    });

    rerender({ isActive: false });

    await waitFor(() => {
      expect(stopRecording).toHaveBeenCalledTimes(1);
      expect(mockCleanupCapturedAudio).toHaveBeenCalledWith(
        "file://intro-recording.m4a",
      );
    });
    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
  });

  it("stops and cleans an active intro recording when the flow unmounts", async () => {
    const { result, unmount } = renderIntroTestTurn();

    act(() => {
      result.current.onPressIn();
    });
    await waitFor(() => {
      expect(startRecording).toHaveBeenCalledTimes(1);
    });

    unmount();

    await waitFor(() => {
      expect(stopRecording).toHaveBeenCalledTimes(1);
      expect(mockCleanupCapturedAudio).toHaveBeenCalledWith(
        "file://intro-recording.m4a",
      );
    });
    expect(mockRunVoicePipeline).not.toHaveBeenCalled();
  });

  it("stops owned reply playback before starting a new intro recording", async () => {
    const replyDrain = deferred();
    const player = createPlayer({
      waitForDrain: jest.fn(() => replyDrain.promise),
    });
    mockRunVoicePipeline.mockImplementationOnce(async (params) => {
      params.callbacks.onTranscription("Question");
      params.callbacks.onResponseDone("Answer");
      params.callbacks.onAudioReady("file://intro-answer.m4a");
      return "Question";
    });
    const { result } = renderIntroTestTurn({ player });
    await recordTurn(result);
    startRecording.mockClear();

    act(() => {
      result.current.onPressIn();
    });

    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(startRecording).toHaveBeenCalledTimes(1);
    });
    expect(
      (player.stopPlayback as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan(startRecording.mock.invocationCallOrder[0]);

    replyDrain.resolve();
  });

  it("ends an active replay when a new intro recording starts", async () => {
    const replayDrain = deferred();
    const waitForDrain = jest
      .fn<Promise<void>, []>()
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(replayDrain.promise);
    const player = createPlayer({ waitForDrain });
    mockRunVoicePipeline.mockImplementationOnce(async (params) => {
      params.callbacks.onTranscription("Question");
      params.callbacks.onResponseDone("Answer");
      params.callbacks.onAudioReady("file://intro-answer.m4a");
      return "Question";
    });
    const { result } = renderIntroTestTurn({ player });
    await recordTurn(result);

    act(() => {
      result.current.onReplay();
    });
    expect(result.current.replaying).toBe(true);

    act(() => {
      result.current.onPressIn();
    });

    expect(result.current.replaying).toBe(false);
    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
    replayDrain.resolve();
  });

  it("does not replay an earlier answer after a later test turn fails", async () => {
    const player = createPlayer({
      waitForDrain: jest.fn(async () => undefined),
    });
    mockRunVoicePipeline
      .mockImplementationOnce(async (params) => {
        params.callbacks.onTranscription("First question");
        params.callbacks.onResponseDone("First answer");
        params.callbacks.onAudioReady("file://first-answer.m4a");
        return "First question";
      })
      .mockImplementationOnce(async (params) => {
        params.callbacks.onTranscription("Second question");
        await params.callbacks.onError(new Error("Second turn failed"));
        return "Second question";
      });
    const { result } = renderIntroTestTurn({ player });

    await recordTurn(result);
    (player.enqueueAudio as jest.Mock).mockClear();
    await recordTurn(result);
    act(() => {
      result.current.onReplay();
    });

    expect(result.current.turn?.successful).toBe(false);
    expect(player.enqueueAudio).not.toHaveBeenCalled();
    expect(player.speakText).not.toHaveBeenCalled();
  });

  it("keeps a late TTS error from being finalized as success", async () => {
    mockRunVoicePipeline.mockImplementationOnce(async (params) => {
      params.callbacks.onTranscription("Will this be spoken?");
      params.callbacks.onResponseDone("This text response succeeded.");
      await params.callbacks.onError(new Error("TTS failed late"));
      return "Will this be spoken?";
    });
    const { result } = renderIntroTestTurn();

    await recordTurn(result);

    expect(result.current.turn).toEqual({
      answer: "introTestTurnFailed",
      latencyLabel: null,
      question: "Will this be spoken?",
      successful: false,
    });
  });

  it("deletes an Intro capture when provider transcription throws", async () => {
    mockRunVoicePipeline.mockRejectedValueOnce(new Error("STT failed"));
    const { result } = renderIntroTestTurn();

    await recordTurn(result);

    expect(result.current.error).toBe("introTestTurnFailed");
    expect(mockCleanupCapturedAudio).toHaveBeenCalledWith(
      "file://intro-recording.m4a",
    );
  });

  it("deletes an Intro capture when the pipeline returns no transcript", async () => {
    mockRunVoicePipeline.mockResolvedValueOnce("");
    const { result } = renderIntroTestTurn();

    await recordTurn(result);

    expect(result.current.error).toBe("introTestTurnFailed");
    expect(result.current.turn).toBeNull();
    expect(mockCleanupCapturedAudio).toHaveBeenCalledWith(
      "file://intro-recording.m4a",
    );
  });

  it("stops owned intro playback on flow exit without stopping on initial inactive mount", async () => {
    const playbackDrain = deferred();
    const player = createPlayer({
      waitForDrain: jest.fn(() => playbackDrain.promise),
    });
    mockRunVoicePipeline.mockImplementationOnce(async (params) => {
      params.callbacks.onTranscription("Question");
      params.callbacks.onResponseDone("Answer");
      params.callbacks.onAudioReady("file://intro-answer.m4a");
      return "Question";
    });
    const { rerender, result } = renderIntroTestTurn({
      active: false,
      player,
    });

    expect(player.stopPlayback).not.toHaveBeenCalled();
    expect(stopRecording).not.toHaveBeenCalled();

    rerender({ isActive: true });
    await recordTurn(result);
    expect(player.stopPlayback).not.toHaveBeenCalled();

    rerender({ isActive: false });

    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
    playbackDrain.resolve();
  });

  it("stops owned intro playback when the flow unmounts", async () => {
    const playbackDrain = deferred();
    const player = createPlayer({
      waitForDrain: jest.fn(() => playbackDrain.promise),
    });
    mockRunVoicePipeline.mockImplementationOnce(async (params) => {
      params.callbacks.onTranscription("Question");
      params.callbacks.onResponseDone("Answer");
      params.callbacks.onSpeechTextReady("Answer", "Samantha");
      return "Question";
    });
    const { result, unmount } = renderIntroTestTurn({ player });

    await recordTurn(result);
    unmount();

    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
    playbackDrain.resolve();
  });

  it("keeps replaying true until the player drains", async () => {
    const replayDrain = deferred();
    const waitForDrain = jest
      .fn<Promise<void>, []>()
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(replayDrain.promise);
    const player = createPlayer({
      enqueueAudio: jest.fn((_uri, _diagnostics, onPlaybackStarted) => {
        onPlaybackStarted?.();
      }),
      waitForDrain,
    });
    mockRunVoicePipeline.mockImplementationOnce(async (params) => {
      params.callbacks.onTranscription("Question");
      params.callbacks.onResponseDone("Answer");
      params.callbacks.onAudioReady("file://intro-answer.m4a");
      return "Question";
    });
    const { result } = renderIntroTestTurn({ player });
    await recordTurn(result);

    act(() => {
      result.current.onReplay();
    });

    expect(result.current.replaying).toBe(true);
    expect(waitForDrain).toHaveBeenCalledTimes(2);
    expect(player.resetCancellation).toHaveBeenCalledTimes(2);

    await act(async () => {
      replayDrain.resolve();
      await replayDrain.promise;
    });

    expect(result.current.replaying).toBe(false);
  });
});
