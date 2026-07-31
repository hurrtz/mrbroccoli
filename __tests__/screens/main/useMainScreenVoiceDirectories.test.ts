import { renderHook } from "@testing-library/react-native";

import { useProviderVoiceDirectory } from "../../../src/hooks/useProviderVoiceDirectory";
import { useMainScreenVoiceDirectories } from "../../../src/screens/main/useMainScreenVoiceDirectories";
import { DEFAULT_SETTINGS } from "../../../src/types";

jest.mock("../../../src/hooks/useProviderVoiceDirectory", () => ({
  useProviderVoiceDirectory: jest.fn(),
}));

const mockUseProviderVoiceDirectory =
  useProviderVoiceDirectory as jest.MockedFunction<
    typeof useProviderVoiceDirectory
  >;

describe("useMainScreenVoiceDirectories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProviderVoiceDirectory.mockImplementation(
      ({ enabled, provider }) => ({
        error: null,
        refresh: jest.fn(async () => []),
        status: enabled ? "ready" : "idle",
        voices: enabled
          ? [
              {
                id: `${provider}-voice-1`,
                name: `${provider} first`,
                label: `${provider} first`,
                value: `${provider}-voice-1`,
                language: null,
                accent: null,
                gender: null,
                tone: null,
                description: null,
                isCustom: false,
              },
            ]
          : [],
      }),
    );
  });

  it("loads only configured directories and initializes an empty voice selection", () => {
    const updateProviderTtsVoice = jest.fn();
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        elevenlabs: "",
        mistral: "mistral-key",
        xai: "xai-key",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        mistral: "mistral-voice-1",
        xai: "",
      },
    };

    const { result } = renderHook(() =>
      useMainScreenVoiceDirectories({
        loaded: true,
        settings,
        updateProviderTtsVoice,
      }),
    );

    expect(mockUseProviderVoiceDirectory).toHaveBeenCalledWith({
      provider: "xai",
      apiKey: "xai-key",
      enabled: true,
    });
    expect(mockUseProviderVoiceDirectory).toHaveBeenCalledWith({
      provider: "mistral",
      apiKey: "mistral-key",
      enabled: true,
    });
    expect(mockUseProviderVoiceDirectory).toHaveBeenCalledWith({
      provider: "elevenlabs",
      apiKey: "",
      enabled: false,
    });
    expect(result.current.xai?.voices[0]?.value).toBe("xai-voice-1");
    expect(updateProviderTtsVoice).toHaveBeenCalledTimes(1);
    expect(updateProviderTtsVoice).toHaveBeenCalledWith(
      "xai",
      "xai-voice-1",
    );
  });

  it("replaces a stale voice after a different provider account is loaded", () => {
    const updateProviderTtsVoice = jest.fn();
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        elevenlabs: "new-elevenlabs-account-key",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        elevenlabs: "voice-from-old-account",
      },
    };

    renderHook(() =>
      useMainScreenVoiceDirectories({
        loaded: true,
        settings,
        updateProviderTtsVoice,
      }),
    );

    expect(updateProviderTtsVoice).toHaveBeenCalledWith(
      "elevenlabs",
      "elevenlabs-voice-1",
    );
  });
});
