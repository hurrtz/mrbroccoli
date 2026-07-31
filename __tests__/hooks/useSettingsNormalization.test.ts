import { renderHook, waitFor } from "@testing-library/react-native";

import { useSettingsNormalization } from "../../src/features/settings-core/useSettingsNormalization";
import { DEFAULT_SETTINGS, type Settings } from "../../src/types";

describe("useSettingsNormalization", () => {
  it("preserves native STT mode when provider STT is also available", async () => {
    const onUpdate = jest.fn();
    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      sttMode: "native" as const,
      sttProvider: null,
    };

    renderHook(() =>
      useSettingsNormalization({
        visible: true,
        settings,
        enabledProviders: [],
        enabledSttProviders: ["openai"],
        enabledTtsProviders: [],
        language: "en",
        onUpdate,
      }),
    );

    await waitFor(() => {
      expect(onUpdate).not.toHaveBeenCalled();
    });
  });

  it("preserves native TTS mode when provider TTS is also available", async () => {
    const onUpdate = jest.fn();
    const settings = {
      ...DEFAULT_SETTINGS,
      ttsMode: "native" as const,
      ttsProvider: null,
    };

    renderHook(() =>
      useSettingsNormalization({
        visible: true,
        settings,
        enabledProviders: [],
        enabledSttProviders: [],
        enabledTtsProviders: ["openai"],
        language: "en",
        onUpdate,
      }),
    );

    await waitFor(() => {
      expect(onUpdate).not.toHaveBeenCalled();
    });
  });

  it("batches settings repair updates into one patch", async () => {
    const onUpdate = jest.fn();
    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      sttMode: "provider" as const,
      sttProvider: "anthropic",
      ttsMode: "provider" as const,
      ttsProvider: "anthropic",
      providerSttModels: {
        ...DEFAULT_SETTINGS.providerSttModels,
        openai: "invalid-stt-model",
      },
      providerTtsModels: {
        ...DEFAULT_SETTINGS.providerTtsModels,
        openai: "invalid-tts-model",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        openai: "invalid-voice",
      },
      responseModes: [
        {
          id: "mode-1",
          route: { provider: "anthropic", model: "claude-sonnet-4-6" },
        },
        {
          id: "mode-2",
          route: { provider: "anthropic", model: "claude-sonnet-4-6" },
        },
        {
          id: "mode-3",
          route: { provider: "anthropic", model: "claude-sonnet-4-6" },
        },
      ],
    };

    renderHook(() =>
      useSettingsNormalization({
        visible: true,
        settings,
        enabledProviders: ["openai"],
        enabledSttProviders: ["openai"],
        enabledTtsProviders: ["openai"],
        language: "en",
        onUpdate,
      }),
    );

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        sttProvider: "openai",
        ttsProvider: "openai",
        providerTtsModels: expect.objectContaining({
          openai: "gpt-4o-mini-tts",
        }),
        providerTtsVoices: expect.objectContaining({
          openai: "alloy",
        }),
        responseModes: [
          {
            id: "mode-1",
            route: {
              provider: "openai",
              model: "gpt-5.6-sol",
              effort: "medium",
            },
          },
          {
            id: "mode-2",
            route: {
              provider: "openai",
              model: "gpt-5.6-sol",
              effort: "medium",
            },
          },
          {
            id: "mode-3",
            route: {
              provider: "openai",
              model: "gpt-5.6-sol",
              effort: "medium",
            },
          },
        ],
      }),
    );
  });
});
