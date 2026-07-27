import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { LocalizationProvider } from "../../src/i18n";
import { DEFAULT_SETTINGS } from "../../src/types";
import { useSetupGuideController } from "../../src/screens/main/useSetupGuideController";

jest.mock("../../src/services/llm", () => ({
  streamChat: jest.fn(),
  validateProviderConnection: jest.fn(),
}));

jest.mock("../../src/screens/main/useSetupGuideVoiceTest", () => ({
  useSetupGuideVoiceTest: jest.fn(() => ({
    phase: "idle",
    transcript: "",
    reply: "",
    errorMessage: null,
    isRecording: false,
    isBusy: false,
    hasCompleted: false,
    handleAction: jest.fn(),
    reset: jest.fn().mockResolvedValue(undefined),
  })),
}));

const { validateProviderConnection } = jest.requireMock("../../src/services/llm") as {
  validateProviderConnection: jest.Mock;
};

function createSettings() {
  return {
    ...DEFAULT_SETTINGS,
    lastProvider: "openai" as const,
    apiKeys: {
      ...DEFAULT_SETTINGS.apiKeys,
      openai: "test-openai-key",
    },
  };
}

function createAnthropicSettings() {
  return {
    ...DEFAULT_SETTINGS,
    lastProvider: "anthropic" as const,
    apiKeys: {
      ...DEFAULT_SETTINGS.apiKeys,
      anthropic: "test-anthropic-key",
    },
  };
}

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(LocalizationProvider, { language: "en" }, children);

function createControllerParams() {
  return {
    kokoroModel: {
      installed: false,
      verified: false,
      busy: null,
      phase: null,
      progress: 0,
      error: null,
      download: jest.fn().mockResolvedValue(true),
      refresh: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(true),
    },
    loaded: true,
    openSettings: jest.fn(),
    setSetupGuideVisible: jest.fn(),
    setupGuideVisible: false,
    setupGuideDismissed: true,
    settings: createSettings(),
    updateSettings: jest.fn(),
    updateApiKey: jest.fn(),
    player: {
      isPlaybackPaused: false,
      isPlaying: false,
      pausePlayback: jest.fn().mockResolvedValue(true),
      resumePlayback: jest.fn().mockResolvedValue(true),
      stopPlayback: jest.fn().mockResolvedValue(undefined),
      resetCancellation: jest.fn(),
      enqueueAudio: jest.fn(),
      waitForDrain: jest.fn().mockResolvedValue(undefined),
    } as never,
    recorder: {
      isRecording: false,
      startRecording: jest.fn().mockResolvedValue(undefined),
      stopRecording: jest.fn().mockResolvedValue(null),
    } as never,
    nativeStt: {
      ensurePermissions: jest.fn().mockResolvedValue(undefined),
      isAvailable: true,
      isRecording: false,
      startRecognition: jest.fn().mockResolvedValue(undefined),
      stopRecognition: jest.fn().mockResolvedValue(null),
      abortRecognition: jest.fn().mockResolvedValue(undefined),
    } as never,
  };
}

describe("useSetupGuideController", () => {
  beforeEach(() => {
    validateProviderConnection.mockReset();
    validateProviderConnection.mockResolvedValue(undefined);
  });

  it("shows the neutral intro once settings are loaded and not dismissed", async () => {
    const params = createControllerParams();
    params.setupGuideDismissed = false;

    renderHook(() => useSetupGuideController(params), { wrapper });

    await waitFor(() => {
      expect(params.setSetupGuideVisible).toHaveBeenCalledWith(true);
    });
    expect(params.updateSettings).not.toHaveBeenCalledWith({
      setupGuideDismissed: true,
    });
  });

  it("continues from the intro into provider setup", async () => {
    const params = createControllerParams();
    params.setupGuideDismissed = false;
    const { result } = renderHook(() => useSetupGuideController(params), {
      wrapper,
    });

    act(() => {
      result.current.handleContinueFromIntro();
    });

    expect(result.current.step).toBe("provider");
    expect(result.current.selectedProvider).toBeNull();
    expect(params.updateSettings).not.toHaveBeenCalledWith({
      setupGuideDismissed: true,
    });
    expect(params.openSettings).not.toHaveBeenCalled();
  });

  it("inserts the optional Kokoro step before the voice test", async () => {
    const params = createControllerParams();
    params.kokoroModel.installed = true;
    const { result } = renderHook(() => useSetupGuideController(params), {
      wrapper,
    });

    act(() => {
      result.current.handleOpenSetupGuide("provider");
      result.current.handleSelectProvider("openai");
    });
    await act(async () => {
      await result.current.handleValidateProviderKey();
    });
    act(() => {
      result.current.handleContinueFromProvider();
    });
    expect(result.current.step).toBe("kokoro");

    act(() => {
      result.current.handleToggleKokoro(true);
    });
    expect(result.current.resolvedRoutes.tts.kind).toBe("kokoro");

    act(() => {
      result.current.handleContinueFromKokoro();
    });
    expect(result.current.step).toBe("voice-test");
  });

  it("only exposes the Settings shortcut option for a Settings launch", () => {
    const params = createControllerParams();
    const { result } = renderHook(() => useSetupGuideController(params), {
      wrapper,
    });

    expect(result.current.openedFromSettings).toBe(false);

    act(() => {
      result.current.handleOpenSetupGuide("intro", "settings");
    });

    expect(result.current.openedFromSettings).toBe(true);
  });

  it("validates the selected provider key and saves the detected setup", async () => {
    const params = createControllerParams();
    const { result } = renderHook(() => useSetupGuideController(params), {
      wrapper,
    });

    act(() => {
      result.current.handleOpenSetupGuide("provider");
      result.current.handleSelectProvider("openai");
    });

    await act(async () => {
      await result.current.handleValidateProviderKey();
    });

    expect(validateProviderConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "openai",
        apiKey: "test-openai-key",
      }),
    );
    expect(result.current.currentValidationState.status).toBe("success");
    expect(params.updateSettings).toHaveBeenCalledWith({
      providerValidationResults: {
        openai: {
          llm: expect.objectContaining({
            status: "success",
            model: expect.any(String),
          }),
        },
      },
    });

    act(() => {
      result.current.handleContinueFromProvider();
      result.current.handleContinueFromVoiceTest();
    });

    await act(async () => {
      await result.current.handleFinishSetupGuide();
    });

    expect(params.updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        activeResponseMode: "mode-1",
        lastProvider: "openai",
        responseModes: expect.arrayContaining([
          expect.objectContaining({
            id: "mode-1",
            route: expect.objectContaining({
              provider: "openai",
              model: "gpt-5.6-sol",
            }),
          }),
        ]),
        setupGuideDismissed: true,
        spokenRepliesEnabled: true,
        sttMode: "provider",
        sttProvider: "openai",
        ttsMode: "provider",
        ttsProvider: "openai",
      }),
    );
  });

  it("does not validate when the selected provider key is missing", async () => {
    const params = createControllerParams();
    params.settings = {
      ...params.settings,
      apiKeys: {
        ...params.settings.apiKeys,
        openai: "",
      },
    };
    const { result } = renderHook(() => useSetupGuideController(params), {
      wrapper,
    });

    act(() => {
      result.current.handleOpenSetupGuide("provider");
      result.current.handleSelectProvider("openai");
    });

    await act(async () => {
      const didValidate = await result.current.handleValidateProviderKey();
      expect(didValidate).toBe(false);
    });

    expect(validateProviderConnection).not.toHaveBeenCalled();
    expect(result.current.currentValidationState).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Add an API key to continue, or cancel the setup guide.",
      }),
    );
  });

  it("persists a rejected provider validation", async () => {
    const errorMessage = "OpenAI rejected the stored credentials.";
    validateProviderConnection.mockRejectedValueOnce(new Error(errorMessage));
    const params = createControllerParams();
    const { result } = renderHook(() => useSetupGuideController(params), {
      wrapper,
    });

    act(() => {
      result.current.handleOpenSetupGuide("provider");
      result.current.handleSelectProvider("openai");
    });

    await act(async () => {
      await expect(result.current.handleValidateProviderKey()).resolves.toBe(
        false,
      );
    });

    expect(params.updateSettings).toHaveBeenCalledWith({
      providerValidationResults: {
        openai: {
          llm: expect.objectContaining({
            status: "error",
            message: errorMessage,
            model: expect.any(String),
          }),
        },
      },
    });
  });

  it("reports missing provider and key before validating", async () => {
    const params = createControllerParams();
    const { result } = renderHook(() => useSetupGuideController(params), {
      wrapper,
    });

    act(() => {
      result.current.handleOpenSetupGuide("provider");
    });

    await act(async () => {
      const didValidate = await result.current.handleValidateProviderKey();
      expect(didValidate).toBe(false);
    });

    expect(validateProviderConnection).not.toHaveBeenCalled();
    expect(result.current.currentValidationState).toEqual(
      expect.objectContaining({
        status: "error",
        message:
          "Choose a provider and add an API key to continue, or cancel the setup guide.",
      }),
    );
  });

  it("saves onboarding in text-only mode when no acceptable TTS route is available", async () => {
    const params = createControllerParams();
    params.settings = createAnthropicSettings();

    const { result } = renderHook(() => useSetupGuideController(params), {
      wrapper,
    });

    act(() => {
      result.current.handleOpenSetupGuide("provider");
      result.current.handleSelectProvider("anthropic");
    });

    await act(async () => {
      await result.current.handleValidateProviderKey();
    });

    act(() => {
      result.current.handleContinueFromProvider();
      result.current.handleContinueFromVoiceTest();
    });

    await act(async () => {
      await result.current.handleFinishSetupGuide();
    });

    expect(params.updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        lastProvider: "anthropic",
        spokenRepliesEnabled: false,
      }),
    );
  });
});
