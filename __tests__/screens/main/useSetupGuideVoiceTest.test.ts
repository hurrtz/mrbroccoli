import { act, renderHook } from "@testing-library/react-native";

import { useSetupGuideVoiceTest } from "../../../src/screens/main/useSetupGuideVoiceTest";
import { DEFAULT_SETTINGS, type Settings } from "../../../src/types";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///tmp/",
  documentDirectory: "file:///tmp/",
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({ exists: false })),
  makeDirectoryAsync: jest.fn(async () => undefined),
  readAsStringAsync: jest.fn(async () => ""),
  writeAsStringAsync: jest.fn(async () => undefined),
}));

jest.mock("../../../src/services/speech/diagnostics", () => ({
  createSpeechRequestId: jest.fn(() => "setup-request"),
}));

jest.mock("../../../src/services/llm", () => ({
  streamChat: jest.fn(),
}));

jest.mock("../../../src/services/tts/providerRoute", () => ({
  synthesizeProviderSpeech: jest.fn(async () => "file://speech.wav"),
}));

jest.mock("../../../src/services/tts", () => ({
  synthesizeSpeech: jest.fn(async () => "file://speech.wav"),
}));

jest.mock("../../../src/services/whisper", () => ({
  transcribeAudio: jest.fn(async () => "transcript"),
}));

import { streamChat } from "../../../src/services/llm";
import { synthesizeSpeech } from "../../../src/services/tts";
import { transcribeAudio } from "../../../src/services/whisper";

const baseSettings = {
  ...DEFAULT_SETTINGS,
  apiKeys: {
    ...DEFAULT_SETTINGS.apiKeys,
    openai: "sk-test",
  },
} satisfies Settings;

describe("useSetupGuideVoiceTest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (transcribeAudio as jest.Mock).mockResolvedValue("transcript");
    (synthesizeSpeech as jest.Mock).mockResolvedValue("file://speech.wav");
    (streamChat as jest.Mock).mockImplementation(async ({ onDone }) => {
      await onDone("A concise setup reply.");
    });
  });

  function createParams(
    overrides: Partial<Parameters<typeof useSetupGuideVoiceTest>[0]> = {},
  ) {
    return {
      visible: false,
      settings: baseSettings,
      routes: {
        llm: {
          enabled: true,
          provider: "openai" as const,
          model: "gpt-5.4",
        },
        stt: {
          enabled: true as const,
          kind: "provider" as const,
          provider: "openai" as const,
          model: "gpt-4o-mini-transcribe",
        },
        tts: {
          enabled: false as const,
          kind: "disabled" as const,
        },
        webSearch: {
          available: false as const,
          provider: null,
        },
      },
      provider: "openai" as const,
      player: {
        isPlaybackPaused: false,
        isPlaying: false,
        pausePlayback: jest.fn(async () => true),
        resumePlayback: jest.fn(async () => true),
        stopPlayback: jest.fn(async () => undefined),
        resetCancellation: jest.fn(),
        enqueueAudio: jest.fn(),
        waitForDrain: jest.fn(async () => undefined),
      } as any,
      recorder: {
        isRecording: false,
        startRecording: jest.fn(async () => undefined),
        stopRecording: jest.fn(async () => "file://voice.m4a"),
      } as any,
      nativeStt: {
        ensurePermissions: jest.fn(async () => undefined),
        isRecording: false,
        startRecognition: jest.fn(async () => undefined),
        stopRecognition: jest.fn(async () => null),
        abortRecognition: jest.fn(async () => undefined),
      } as any,
      t: (key: string) => key,
      ...overrides,
    };
  }

  it("does not reset the shared recorder while the setup guide is hidden", async () => {
    const initialParams = createParams();
    const { rerender } = renderHook(
      (params: Parameters<typeof useSetupGuideVoiceTest>[0]) =>
        useSetupGuideVoiceTest(params),
      { initialProps: initialParams },
    );

    const activeRecorder = {
      ...initialParams.recorder,
      isRecording: true,
      stopRecording: jest.fn(async () => "file://voice.m4a"),
    };

    await act(async () => {
      rerender(
        createParams({
          recorder: activeRecorder as any,
        }),
      );
    });

    expect(activeRecorder.stopRecording).not.toHaveBeenCalled();
  });

  it("completes a provider STT voice round trip in text-only mode", async () => {
    const params = createParams();
    const { result } = renderHook(() => useSetupGuideVoiceTest(params));

    await act(async () => {
      await result.current.handleAction();
    });
    expect(result.current.phase).toBe("recording");

    await act(async () => {
      await result.current.handleAction();
    });

    expect(transcribeAudio).toHaveBeenCalledWith(
      expect.objectContaining({
        fileUri: "file://voice.m4a",
        provider: "openai",
        providerModel: "gpt-4o-mini-transcribe",
      }),
    );
    expect(streamChat).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: "sk-test",
        model: "gpt-5.4",
        provider: "openai",
      }),
    );
    expect(result.current.transcript).toBe("transcript");
    expect(result.current.reply).toBe("A concise setup reply.");
    expect(result.current.phase).toBe("success");
  });

  it("synthesizes and drains the configured provider TTS route", async () => {
    const params = createParams({
      routes: {
        ...createParams().routes,
        tts: {
          enabled: true,
          kind: "provider",
          provider: "openai",
          model: "gpt-4o-mini-tts",
          voice: "alloy",
        },
      },
    });
    const { result } = renderHook(() => useSetupGuideVoiceTest(params));

    await act(async () => {
      await result.current.handleAction();
    });
    await act(async () => {
      await result.current.handleAction();
    });

    expect(synthesizeSpeech).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: "sk-test",
        mode: "provider",
        provider: "openai",
        providerModel: "gpt-4o-mini-tts",
        text: "A concise setup reply.",
        voice: "alloy",
      }),
    );
    expect(params.player.resetCancellation).toHaveBeenCalledTimes(1);
    expect(params.player.enqueueAudio).toHaveBeenCalledWith(
      "file://speech.wav",
      expect.objectContaining({ source: "preview" }),
    );
    expect(params.player.waitForDrain).toHaveBeenCalledTimes(1);
    expect(result.current.phase).toBe("success");
  });

  it("reports unavailable input without starting either recorder", async () => {
    const params = createParams({
      routes: {
        ...createParams().routes,
        stt: { enabled: false, kind: "disabled" },
      },
    });
    const { result } = renderHook(() => useSetupGuideVoiceTest(params));

    await act(async () => {
      await result.current.handleAction();
    });

    expect(result.current.phase).toBe("error");
    expect(result.current.errorMessage).toBe(
      "setupGuideVoiceInputUnavailable",
    );
    expect(params.recorder.startRecording).not.toHaveBeenCalled();
    expect(params.nativeStt.startRecognition).not.toHaveBeenCalled();
  });

  it("turns an empty provider transcript into a recoverable error", async () => {
    (transcribeAudio as jest.Mock).mockResolvedValue("  ");
    const params = createParams();
    const { result } = renderHook(() => useSetupGuideVoiceTest(params));

    await act(async () => {
      await result.current.handleAction();
    });
    await act(async () => {
      await result.current.handleAction();
    });

    expect(result.current.phase).toBe("error");
    expect(result.current.errorMessage).toBe("couldntCatchThatTryAgain");
    expect(streamChat).not.toHaveBeenCalled();
  });
});
