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
      isPlaying: false,
      resetCancellation: jest.fn(),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
    };
    const { result } = renderHook(() =>
      usePreviewVoiceController({
        isBusy: false,
        isRecording: false,
        language: "en",
        player,
        settings: {
          apiKeys: { openai: "" } as never,
          providerTtsModels: { openai: "gpt-4o-mini-tts" } as never,
        },
        showToast,
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
      isPlaying: false,
      resetCancellation: jest.fn(),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
    };
    const { result } = renderHook(() =>
      usePreviewVoiceController({
        isBusy: false,
        isRecording: false,
        language: "en",
        player,
        settings: {
          apiKeys: {} as never,
          providerTtsModels: {} as never,
        },
        showToast: jest.fn(),
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
});
