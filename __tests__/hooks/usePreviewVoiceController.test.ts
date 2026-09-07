import { act, renderHook } from "@testing-library/react-native";

import { usePreviewVoiceController } from "../../src/screens/main/usePreviewVoiceController";

const mockSynthesizeSpeech = jest.fn();

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

jest.mock("../../src/services/tts", () => ({
  synthesizeSpeech: (...args: unknown[]) => mockSynthesizeSpeech(...args),
}));

describe("usePreviewVoiceController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSynthesizeSpeech.mockResolvedValue("file://preview.m4a");
  });

  it("blocks provider previews when the provider key is missing", async () => {
    const showToast = jest.fn();
    const player = {
      enqueueAudio: jest.fn(),
      isPlaybackPaused: false,
      isPlaying: false,
      resetCancellation: jest.fn(),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
    };
    const { result } = renderHook(() =>
      usePreviewVoiceController({
        isRecording: false,
        language: "en",
        pipelinePhase: "idle",
        player,
        settings: {
          apiKeys: { openai: "" } as never,
          providerTtsModels: { openai: "gpt-4o-mini-tts-2025-12-15" } as never,
        },
        showToast,
        stopVoiceSession: jest.fn(async () => undefined),
        t: (key) =>
          ({
            chooseTtsToPreviewVoices: "Choose TTS first",
          }[key] ?? key),
      }),
    );

    await act(async () => {
      await result.current.handlePreviewVoice({
        mode: "provider",
        provider: "openai",
        previewLanguage: "en",
        text: "Hello there",
        voice: "alloy",
      });
    });

    expect(showToast).toHaveBeenCalledWith("Choose TTS first");
    expect(mockSynthesizeSpeech).not.toHaveBeenCalled();
  });

  it("plays native previews immediately through the player", async () => {
    const onPlaybackStarted = jest.fn();
    const player = {
      enqueueAudio: jest.fn(),
      isPlaybackPaused: false,
      isPlaying: false,
      resetCancellation: jest.fn(),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
    };
    const { result } = renderHook(() =>
      usePreviewVoiceController({
        isRecording: false,
        language: "en",
        pipelinePhase: "idle",
        player,
        settings: {
          apiKeys: {} as never,
          providerTtsModels: {} as never,
        },
        showToast: jest.fn(),
        stopVoiceSession: jest.fn(async () => undefined),
        t: (key) => key,
      }),
    );

    await act(async () => {
      await result.current.handlePreviewVoice(
        {
          mode: "native",
          nativeVoice: "Samantha",
          previewLanguage: "en",
          text: "Hello there",
        },
        { onPlaybackStarted },
      );
    });

    expect(player.speakText).toHaveBeenCalledWith(
      "Hello there",
      expect.objectContaining({
        language: "en-US",
        voice: "Samantha",
      }),
    );
    expect(onPlaybackStarted).toHaveBeenCalledTimes(1);
  });

  it("aborts pending synthesis without enqueueing late preview audio", async () => {
    let requestSignal: AbortSignal | undefined;
    mockSynthesizeSpeech.mockImplementationOnce(
      ({ abortSignal }: { abortSignal?: AbortSignal }) =>
        new Promise<string>((_resolve, reject) => {
          requestSignal = abortSignal;
          abortSignal?.addEventListener(
            "abort",
            () => {
              const error = new Error("Voice preview cancelled.");
              error.name = "AbortError";
              reject(error);
            },
            { once: true },
          );
        }),
    );
    const player = {
      enqueueAudio: jest.fn(),
      isPlaybackPaused: false,
      isPlaying: false,
      resetCancellation: jest.fn(),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
    };
    const showToast = jest.fn();
    const { result } = renderHook(() =>
      usePreviewVoiceController({
        isRecording: false,
        language: "en",
        pipelinePhase: "idle",
        player,
        settings: {
          apiKeys: {} as never,
          providerTtsModels: {} as never,
        },
        showToast,
        stopVoiceSession: jest.fn(async () => undefined),
        t: (key) => key,
      }),
    );

    let previewPromise: Promise<void> = Promise.resolve();
    await act(async () => {
      previewPromise = result.current.handlePreviewVoice({
        mode: "kokoro",
        language: "en",
        text: "Cancel this slow preview",
        voice: "af_maple",
      });
      await Promise.resolve();
    });

    expect(requestSignal?.aborted).toBe(false);

    await act(async () => {
      await result.current.stopPreviewVoice();
      await previewPromise;
    });

    expect(requestSignal?.aborted).toBe(true);
    expect(player.enqueueAudio).not.toHaveBeenCalled();
    expect(showToast).not.toHaveBeenCalled();
  });

  it("replaces a paused reply with a provider voice preview", async () => {
    const stopVoiceSession = jest.fn(async () => undefined);
    const showToast = jest.fn();
    const player = {
      enqueueAudio: jest.fn(),
      isPlaybackPaused: true,
      isPlaying: true,
      resetCancellation: jest.fn(),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
    };
    const { result } = renderHook(() =>
      usePreviewVoiceController({
        isRecording: false,
        language: "en",
        pipelinePhase: "speaking",
        player,
        settings: {
          apiKeys: { xai: "configured-key" } as never,
          providerTtsModels: { xai: "text-to-speech" } as never,
        },
        showToast,
        stopVoiceSession,
        t: (key) => key,
      }),
    );

    await act(async () => {
      await result.current.handlePreviewVoice({
        mode: "provider",
        previewLanguage: "en",
        provider: "xai",
        text: "Hello there",
        voice: "eve",
      });
    });

    expect(stopVoiceSession).toHaveBeenCalledTimes(1);
    expect(mockSynthesizeSpeech).toHaveBeenCalledTimes(1);
    expect(stopVoiceSession.mock.invocationCallOrder[0]).toBeLessThan(
      mockSynthesizeSpeech.mock.invocationCallOrder[0],
    );
    expect(player.stopPlayback).not.toHaveBeenCalled();
    expect(player.enqueueAudio).toHaveBeenCalledWith(
      "file://preview.m4a",
      expect.objectContaining({ mode: "provider", provider: "xai" }),
    );
    expect(showToast).not.toHaveBeenCalled();
  });

  it("still blocks previews while an unpaused reply is speaking", async () => {
    const stopVoiceSession = jest.fn(async () => undefined);
    const showToast = jest.fn();
    const player = {
      enqueueAudio: jest.fn(),
      isPlaybackPaused: false,
      isPlaying: true,
      resetCancellation: jest.fn(),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
    };
    const { result } = renderHook(() =>
      usePreviewVoiceController({
        isRecording: false,
        language: "en",
        pipelinePhase: "speaking",
        player,
        settings: {
          apiKeys: { xai: "configured-key" } as never,
          providerTtsModels: { xai: "text-to-speech" } as never,
        },
        showToast,
        stopVoiceSession,
        t: (key) => key,
      }),
    );

    await act(async () => {
      await result.current.handlePreviewVoice({
        mode: "provider",
        previewLanguage: "en",
        provider: "xai",
        text: "Hello there",
        voice: "eve",
      });
    });

    expect(showToast).toHaveBeenCalledWith("stopSessionBeforePreview");
    expect(stopVoiceSession).not.toHaveBeenCalled();
    expect(mockSynthesizeSpeech).not.toHaveBeenCalled();
  });
});
