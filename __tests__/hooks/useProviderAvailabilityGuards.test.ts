import { renderHook, waitFor } from "@testing-library/react-native";

import { useProviderAvailabilityGuards } from "../../src/screens/main/useProviderAvailabilityGuards";
import { DEFAULT_SETTINGS } from "../../src/types";

describe("useProviderAvailabilityGuards", () => {
  it("preserves native STT mode when provider STT becomes available", async () => {
    const updateSettings = jest.fn();
    const settings = {
      ...DEFAULT_SETTINGS,
      sttMode: "native" as const,
      sttProvider: null,
    };

    renderHook(() =>
      useProviderAvailabilityGuards({
        activeResponseMode: "mode-2",
        availableResponseModes: ["mode-2"],
        availableSttProviders: ["openai"],
        availableTtsProviders: [],
        loaded: true,
        providerApiKey: "key",
        settings,
        sttProvider: null,
        ttsProvider: null,
        updateActiveResponseMode: jest.fn(),
        updateSettings,
      }),
    );

    await waitFor(() => {
      expect(updateSettings).not.toHaveBeenCalled();
    });
  });

  it("preserves native TTS mode when provider TTS becomes available", async () => {
    const updateSettings = jest.fn();
    const settings = {
      ...DEFAULT_SETTINGS,
      ttsMode: "native" as const,
      ttsProvider: null,
    };

    renderHook(() =>
      useProviderAvailabilityGuards({
        activeResponseMode: "mode-2",
        availableResponseModes: ["mode-2"],
        availableSttProviders: [],
        availableTtsProviders: ["openai"],
        loaded: true,
        providerApiKey: "key",
        settings,
        sttProvider: null,
        ttsProvider: null,
        updateActiveResponseMode: jest.fn(),
        updateSettings,
      }),
    );

    await waitFor(() => {
      expect(updateSettings).not.toHaveBeenCalled();
    });
  });

  it("switches to the first ready response mode when the active provider has no key", async () => {
    const updateActiveResponseMode = jest.fn();

    renderHook(() =>
      useProviderAvailabilityGuards({
        activeResponseMode: "mode-2",
        availableResponseModes: ["mode-1", "mode-3"],
        availableSttProviders: ["openai"],
        availableTtsProviders: ["openai"],
        loaded: true,
        providerApiKey: "",
        settings: DEFAULT_SETTINGS,
        sttProvider: DEFAULT_SETTINGS.sttProvider,
        ttsProvider: DEFAULT_SETTINGS.ttsProvider,
        updateActiveResponseMode,
        updateSettings: jest.fn(),
      }),
    );

    await waitFor(() => {
      expect(updateActiveResponseMode).toHaveBeenCalledWith("mode-1");
    });
  });

  it("repairs unavailable STT and TTS provider selections", async () => {
    const updateSettings = jest.fn();
    const settings = {
      ...DEFAULT_SETTINGS,
      sttMode: "provider" as const,
      sttProvider: "openai" as const,
      ttsMode: "provider" as const,
      ttsProvider: "openai" as const,
    };

    renderHook(() =>
      useProviderAvailabilityGuards({
        activeResponseMode: "mode-2",
        availableResponseModes: ["mode-2"],
        availableSttProviders: ["mistral"],
        availableTtsProviders: ["xai"],
        loaded: true,
        providerApiKey: "key",
        settings,
        sttProvider: "openai",
        ttsProvider: "openai",
        updateActiveResponseMode: jest.fn(),
        updateSettings,
      }),
    );

    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledWith({ sttProvider: "mistral" });
      expect(updateSettings).toHaveBeenCalledWith({ ttsProvider: "xai" });
    });
  });
});
