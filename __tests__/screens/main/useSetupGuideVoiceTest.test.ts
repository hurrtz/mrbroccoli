import { act, renderHook } from "@testing-library/react-native";

import { useSetupGuideVoiceTest } from "../../../src/screens/main/useSetupGuideVoiceTest";
import type { Settings } from "../../../src/types";

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

jest.mock("../../../src/services/whisper", () => ({
  transcribeAudio: jest.fn(async () => "transcript"),
}));

const baseSettings = {
  apiKeys: {
    groq: "gsk-test",
  },
  assistantInstructions: "",
  language: "en",
  responseLength: "normal",
  responseTone: "professional",
} as unknown as Settings;

describe("useSetupGuideVoiceTest", () => {
  function createParams(
    overrides: Partial<Parameters<typeof useSetupGuideVoiceTest>[0]> = {},
  ) {
    return {
      visible: false,
      settings: baseSettings,
      routes: {
        llm: { provider: "groq" as const, model: "llama-3.3-70b-versatile" },
        stt: {
          enabled: true,
          kind: "provider" as const,
          provider: "groq" as const,
          model: "whisper-large-v3-turbo",
        },
        tts: {
          enabled: false,
          kind: "off" as const,
        },
        webSearch: {
          available: false,
          provider: null,
        },
      },
      provider: "groq" as const,
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
});
