import React from "react";
import { Alert, StyleSheet } from "react-native";
import {
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react-native";

import { SettingsModal } from "../../src/components/SettingsModal";
import { PROVIDER_LABELS } from "../../src/constants/models";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";
import { DEFAULT_SETTINGS, type Provider } from "../../src/types";
import { clearSpeechDiagnostics } from "../../src/services/speech/diagnostics";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, name);
  },
}));

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: {
      View,
    },
    useSharedValue: (value: number) => ({ value }),
    useAnimatedStyle: (factory: () => unknown) => factory(),
    withDelay: (_delay: number, value: unknown) => value,
    withTiming: (value: number) => value,
    Easing: {
      out: (value: unknown) => value,
      ease: "ease",
    },
  };
});

jest.mock("expo-speech", () => ({
  getAvailableVoicesAsync: jest.fn(() => Promise.resolve([])),
}));

jest.mock("../../src/hooks/useSpeechDiagnostics", () => ({
  useSpeechDiagnostics: jest.fn(() => []),
}));

jest.mock("../../src/services/speech/diagnostics", () => ({
  clearSpeechDiagnostics: jest.fn(),
}));

jest.mock("../../src/components/ProviderIcon", () => ({
  ProviderIcon: ({
    label,
    provider,
  }: {
    label?: string;
    provider: string;
  }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, label ?? provider);
  },
}));

function renderSettingsModal(overrideProps: Partial<React.ComponentProps<typeof SettingsModal>> = {}) {
  return render(
    <ThemeProvider mode="light">
      <LocalizationProvider language="en">
        <SettingsModal
          visible
          settings={DEFAULT_SETTINGS}
          providerVoiceDirectories={{}}
          onUpdate={jest.fn()}
          onUpdateResponseModeRoute={jest.fn()}
          onUpdateProviderSttModel={jest.fn()}
          onUpdateProviderTtsModel={jest.fn()}
          onUpdateProviderTtsVoice={jest.fn()}
          onUpdateApiKey={jest.fn()}
          onPreviewVoice={jest.fn(async () => undefined)}
          onStopPreviewVoice={jest.fn(async () => undefined)}
          onValidateProviderCapability={jest.fn(async () => undefined)}
          onClose={jest.fn()}
          {...overrideProps}
        />
      </LocalizationProvider>
    </ThemeProvider>,
  );
}

describe("SettingsModal", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders readiness overview and drills into Connections", async () => {
    const screen = renderSettingsModal();

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeTruthy();
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Settings",
      );
      expect(
        StyleSheet.flatten(
          screen.getByTestId("settings-modal-title").props.style,
        ).textAlign,
      ).toBe("center");
      expect(screen.queryByTestId("settings-header-gradient")).toBeNull();
      expect(screen.queryByTestId("settings-modal-gradient")).toBeNull();
      expect(screen.queryByText("Runtime Readiness")).toBeNull();
      expect(screen.getByText("Connections")).toBeTruthy();
      expect(screen.getByText("Thinking")).toBeTruthy();
      expect(screen.getByText("Listening")).toBeTruthy();
      expect(screen.getByText("Speaking")).toBeTruthy();
      expect(screen.getAllByText("Search").length).toBeGreaterThan(0);
      expect(screen.getByText("App & diagnostics")).toBeTruthy();
      expect(screen.queryByPlaceholderText("Search services")).toBeNull();
      expect(screen.queryByText("System Prompt")).toBeNull();
      expect(screen.queryByText("Voice Input")).toBeNull();
      expect(screen.queryByText("Theme")).toBeNull();
    });

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.queryByText("Back to overview")).toBeNull();
      expect(screen.getByLabelText("Back to overview")).toBeTruthy();
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Connections",
      );
      expect(screen.getAllByText("Connections")).toHaveLength(1);
      expect(
        screen.getByText("Provider keys, validation, and capabilities."),
      ).toBeTruthy();
      expect(screen.queryByPlaceholderText("Search services")).toBeNull();
      expect(screen.queryByText("System Prompt")).toBeNull();
    });

    fireEvent.press(screen.getByLabelText("Back to overview"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Settings",
      );
      expect(screen.queryByText("Runtime Readiness")).toBeNull();
      expect(screen.queryByPlaceholderText("Search services")).toBeNull();
    });
  });

  it("sorts provider connections alphabetically", async () => {
    const screen = renderSettingsModal();

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByText("OpenAI")).toBeTruthy();
    });

    const renderedProviders = screen
      .getAllByTestId(/^provider-vault-row-/)
      .map((row) =>
        String(row.props.testID).replace("provider-vault-row-", ""),
      );
    const expectedProviders = (
      Object.keys(DEFAULT_SETTINGS.apiKeys) as Provider[]
    ).sort((left, right) =>
      PROVIDER_LABELS[left].localeCompare(PROVIDER_LABELS[right]),
    );

    expect(renderedProviders).toEqual(expectedProviders);
  });

  it("opens Connections when a focus provider is supplied", async () => {
    const screen = renderSettingsModal({ focusProvider: "openai" });

    await waitFor(() => {
      expect(screen.queryByText("Back to overview")).toBeNull();
      expect(screen.getByLabelText("Back to overview")).toBeTruthy();
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Connections",
      );
      expect(screen.getByText("OpenAI")).toBeTruthy();
      expect(screen.getByText("Test all")).toBeTruthy();
      expect(screen.getByLabelText("Test LLM")).toBeTruthy();
      expect(
        screen.queryByText(
          "Live validation is not wired for this provider yet. Save the key here and verify it during actual use.",
        ),
      ).toBeNull();
      expect(screen.queryByText("System Prompt")).toBeNull();
    });
  });

  it("explains the optional OpenRouter one-key route without hiding direct providers", async () => {
    const screen = renderSettingsModal({ focusProvider: "openrouter" });

    await waitFor(() => {
      expect(screen.getByText("One key, multiple providers")).toBeTruthy();
      expect(
        screen.getByText(
          "Request path: this device → OpenRouter → selected upstream provider",
        ),
      ).toBeTruthy();
      expect(screen.getByText("OpenRouter keys")).toBeTruthy();
      expect(screen.getByTestId("provider-vault-row-openai")).toBeTruthy();
      expect(screen.getByTestId("provider-vault-row-anthropic")).toBeTruthy();
    });
  });

  it("shows provider validation failures in a toast inside the modal", async () => {
    const errorMessage =
      "OpenAI rejected the credentials for reply generation. Check the API key and permissions.";
    const onValidateProviderCapability = jest.fn(async () => {
      throw new Error(errorMessage);
    });
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({
      focusProvider: "openai",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "invalid-key",
        },
      },
      onUpdate,
      onValidateProviderCapability,
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Test LLM")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Test LLM"));

    await waitFor(() => {
      expect(onValidateProviderCapability).toHaveBeenCalledWith(
        "openai",
        "llm",
      );
      expect(
        within(screen.getByTestId("toast")).getByText(errorMessage),
      ).toBeTruthy();
      expect(onUpdate).toHaveBeenCalledWith({
        providerValidationResults: {
          openai: expect.objectContaining({
            llm: expect.objectContaining({
              status: "error",
              message: errorMessage,
              model: expect.any(String),
            }),
          }),
        },
      });
    });

    fireEvent.press(
      within(screen.getByTestId("toast")).getByLabelText("Dismiss"),
    );

    await waitFor(() => {
      expect(screen.queryByTestId("toast")).toBeNull();
    });
  });

  it("keeps an untested stored provider neutral", async () => {
    const screen = renderSettingsModal({
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "test-key",
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByText("OpenAI")).toBeTruthy();
      const openAiRow = screen.getByTestId("provider-vault-row-openai");
      expect(StyleSheet.flatten(openAiRow.props.style).backgroundColor).toBe(
        lightColors.surfaceElevated,
      );
      expect(screen.queryByText("Configured")).toBeNull();
      expect(screen.queryByText("Configured 1")).toBeNull();
      expect(screen.queryByText("check")).toBeNull();
      expect(screen.queryByText("Not set up")).toBeNull();
      expect(screen.queryByText("minus")).toBeNull();
    });
  });

  it("shows a persisted validation success in green", async () => {
    const screen = renderSettingsModal({
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "working-key",
        },
        providerValidationResults: {
          openai: {
            llm: {
              status: "success",
              model: DEFAULT_SETTINGS.providerModels.openai,
            },
          },
        },
      },
    });

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      const llmPill = screen.getByTestId(
        "provider-capability-pill-openai-llm",
      );
      expect(StyleSheet.flatten(llmPill.props.style).backgroundColor).toBe(
        `${lightColors.success}22`,
      );
    });
  });

  it("restores a persisted validation failure after reload", async () => {
    const errorMessage = "OpenAI rejected the stored credentials.";
    const screen = renderSettingsModal({
      focusProvider: "openai",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "invalid-key",
        },
        providerValidationResults: {
          openai: {
            llm: {
              status: "error",
              message: errorMessage,
              model: DEFAULT_SETTINGS.providerModels.openai,
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Invalid")).toBeTruthy();
      expect(screen.getByText(errorMessage)).toBeTruthy();
      const llmPill = screen.getByTestId(
        "provider-capability-pill-openai-llm",
      );
      expect(StyleSheet.flatten(llmPill.props.style).backgroundColor).toBe(
        `${lightColors.danger}18`,
      );
    });
  });

  it("replaces a persisted failure after a successful retest", async () => {
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({
      focusProvider: "openai",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "replacement-key",
        },
        providerValidationResults: {
          openai: {
            llm: {
              status: "error",
              message: "Rejected credentials",
              model: DEFAULT_SETTINGS.providerModels.openai,
            },
          },
        },
      },
      onUpdate,
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Test LLM")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Test LLM"));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith({
        providerValidationResults: {
          openai: expect.objectContaining({
            llm: expect.objectContaining({
              status: "success",
              model: expect.any(String),
            }),
          }),
        },
      });
      const llmPill = screen.getByTestId(
        "provider-capability-pill-openai-llm",
      );
      expect(StyleSheet.flatten(llmPill.props.style).backgroundColor).toBe(
        `${lightColors.success}22`,
      );
      expect(screen.queryByText("Invalid")).toBeNull();
    });
  });

  it("opens Connections even when a catalog-only provider id is supplied", async () => {
    const screen = renderSettingsModal({
      focusCatalogProviderId: "ibm-watsonx",
    });

    await waitFor(() => {
      expect(screen.queryByText("Back to overview")).toBeNull();
      expect(screen.getByLabelText("Back to overview")).toBeTruthy();
      expect(screen.queryByPlaceholderText("Search services")).toBeNull();
      expect(screen.queryByText("System Prompt")).toBeNull();
    });
  });

  it("places Thinking, Search, and diagnostics controls in their drill-in pages", async () => {
    const screen = renderSettingsModal({
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "test-key",
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Open Thinking"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Thinking",
      );
      expect(screen.getByText("Response Modes")).toBeTruthy();
      expect(screen.getByText("System Prompt")).toBeTruthy();
      expect(screen.queryByText("Adaptive Length")).toBeNull();
      expect(screen.queryByText("Response Tone")).toBeNull();
    });

    fireEvent.press(screen.getByLabelText("Back to overview"));
    fireEvent.press(screen.getByLabelText("Open Search"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Search",
      );
      expect(screen.getByText("Web Search Provider")).toBeTruthy();
      expect(screen.queryByText("Response Modes")).toBeNull();
    });

    fireEvent.press(screen.getByLabelText("Back to overview"));
    fireEvent.press(screen.getByLabelText("Open App & diagnostics"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "App & diagnostics",
      );
      expect(screen.getByText("Theme")).toBeTruthy();
      expect(screen.getByText("Usage Stats")).toBeTruthy();
      expect(
        screen.getByText(
          "How to use the button: toggling it on will start capturing logs. Toggling it off will stop capturing logs and move the captured ones into the clipboard.",
        ),
      ).toBeTruthy();
      expect(screen.getByText("Recent Speech Activity")).toBeTruthy();
      expect(screen.queryByText("Web Search Provider")).toBeNull();
    });
  });

  it("offers discovered Mistral voice slugs and refreshes the directory", async () => {
    const onRefreshMistralVoices = jest.fn(async () => []);
    const onUpdateProviderTtsVoice = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          mistral: "configured-mistral-key",
        },
        ttsMode: "provider",
        ttsProvider: "mistral",
        providerTtsVoices: {
          ...DEFAULT_SETTINGS.providerTtsVoices,
          mistral: "calm-guide",
        },
      },
      providerVoiceDirectories: {
        mistral: {
          voices: [
            {
              id: "voice-1",
              name: "Calm Guide",
              slug: "calm-guide",
              value: "calm-guide",
              label: "Calm Guide · calm-guide",
              languages: ["en"],
              gender: null,
              isCustom: false,
            },
            {
              id: "voice-2",
              name: "Studio Voice",
              slug: "studio-voice",
              value: "studio-voice",
              label: "Studio Voice · studio-voice",
              languages: ["en", "de"],
              gender: null,
              isCustom: true,
            },
          ],
          status: "ready",
          error: null,
          refresh: onRefreshMistralVoices,
        },
      },
      onUpdateProviderTtsVoice,
    });

    await waitFor(() => {
      expect(screen.getByText("Mistral voice library")).toBeTruthy();
      expect(
        screen.getByText("2 voices available from Mistral."),
      ).toBeTruthy();
      expect(screen.getByText("Calm Guide · calm-guide")).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("mistral-voices-refresh"));
    expect(onRefreshMistralVoices).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText("Calm Guide · calm-guide"));
    fireEvent.press(screen.getByText("Studio Voice · studio-voice"));

    expect(onUpdateProviderTtsVoice).toHaveBeenCalledWith(
      "mistral",
      "studio-voice",
    );
  });

  it("keeps manual Mistral slug entry available after directory errors", async () => {
    const onUpdateProviderTtsVoice = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          mistral: "configured-mistral-key",
        },
        ttsMode: "provider",
        ttsProvider: "mistral",
      },
      providerVoiceDirectories: {
        mistral: {
          voices: [],
          status: "error",
          error: new Error("Network unavailable"),
          refresh: jest.fn(async () => []),
        },
      },
      onUpdateProviderTtsVoice,
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Voices could not be refreshed. Your current selection is unchanged; you can still enter a voice ID manually.",
        ),
      ).toBeTruthy();
      expect(
        screen.getByPlaceholderText("Enter a voice ID"),
      ).toBeTruthy();
    });

    fireEvent.changeText(
      screen.getByPlaceholderText("Enter a voice ID"),
      " custom-voice ",
    );

    expect(onUpdateProviderTtsVoice).toHaveBeenCalledWith(
      "mistral",
      "custom-voice",
    );
  });

  it("offers discovered ElevenLabs account voices and refreshes them", async () => {
    const refresh = jest.fn(async () => []);
    const onUpdateProviderTtsVoice = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          elevenlabs: "configured-elevenlabs-key",
        },
        ttsMode: "provider",
        ttsProvider: "elevenlabs",
        providerTtsVoices: {
          ...DEFAULT_SETTINGS.providerTtsVoices,
          elevenlabs: "voice-1",
        },
      },
      providerVoiceDirectories: {
        elevenlabs: {
          voices: [
            {
              id: "voice-1",
              name: "Alex",
              value: "voice-1",
              label: "Alex · British · male",
              category: "premade",
              accent: "British",
              gender: "male",
              description: null,
              previewUrl: null,
            },
            {
              id: "voice-2",
              name: "Sam",
              value: "voice-2",
              label: "Sam · American",
              category: "cloned",
              accent: "American",
              gender: null,
              description: null,
              previewUrl: null,
            },
          ],
          status: "ready",
          error: null,
          refresh,
        },
      },
      onUpdateProviderTtsVoice,
    });

    await waitFor(() => {
      expect(screen.getByText("ElevenLabs voice library")).toBeTruthy();
      expect(
        screen.getByText("2 voices available from ElevenLabs."),
      ).toBeTruthy();
      expect(screen.getByText("Alex · British · male")).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("elevenlabs-voices-refresh"));
    expect(refresh).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText("Alex · British · male"));
    fireEvent.press(screen.getByText("Sam · American"));

    expect(onUpdateProviderTtsVoice).toHaveBeenCalledWith(
      "elevenlabs",
      "voice-2",
    );
  });

  it("keeps ElevenLabs TTS usable when a restricted key cannot list voices", async () => {
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          elevenlabs: "restricted-elevenlabs-key",
        },
        ttsMode: "provider",
        ttsProvider: "elevenlabs",
        providerTtsVoices: {
          ...DEFAULT_SETTINGS.providerTtsVoices,
          elevenlabs: "",
        },
      },
      providerVoiceDirectories: {
        elevenlabs: {
          voices: [],
          status: "error",
          error: new Error("Missing voices_read permission"),
          refresh: jest.fn(async () => []),
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Rachel (built-in)")).toBeTruthy();
      expect(
        screen.getByText(
          "Account voices could not be loaded. The built-in voice remains available.",
        ),
      ).toBeTruthy();
      expect(screen.queryByPlaceholderText("Enter a voice ID")).toBeNull();
    });
  });

  it("shows partial ElevenLabs permissions per capability without failing usable speech", async () => {
    const screen = renderSettingsModal({
      focusProvider: "elevenlabs",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          elevenlabs: "restricted-elevenlabs-key",
        },
        providerValidationResults: {
          elevenlabs: {
            stt: {
              status: "success",
              model: DEFAULT_SETTINGS.providerSttModels.elevenlabs,
            },
            tts: {
              status: "success",
              model: DEFAULT_SETTINGS.providerTtsModels.elevenlabs,
              configKey: JSON.stringify({
                voice: DEFAULT_SETTINGS.providerTtsVoices.elevenlabs,
              }),
            },
            voices: {
              status: "error",
              message: "Missing voices_read permission",
              model: "",
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(
        StyleSheet.flatten(
          screen.getByTestId(
            "provider-capability-pill-elevenlabs-stt",
          ).props.style,
        ).backgroundColor,
      ).toBe(`${lightColors.success}22`);
      expect(
        StyleSheet.flatten(
          screen.getByTestId(
            "provider-capability-pill-elevenlabs-tts",
          ).props.style,
        ).backgroundColor,
      ).toBe(`${lightColors.success}22`);
      expect(
        StyleSheet.flatten(
          screen.getByTestId(
            "provider-capability-pill-elevenlabs-voices",
          ).props.style,
        ).backgroundColor,
      ).toBe(`${lightColors.danger}18`);
      expect(screen.getByText("Missing voices_read permission")).toBeTruthy();
      expect(screen.getAllByText("Working")).toHaveLength(2);
      expect(screen.getByText("Invalid")).toBeTruthy();
    });
  });

  it("styles speech diagnostics clearing as destructive and requires confirmation", async () => {
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined);
    const clearSpeechDiagnosticsMock = jest.mocked(clearSpeechDiagnostics);
    const screen = renderSettingsModal();

    fireEvent.press(screen.getByLabelText("Open App & diagnostics"));

    await waitFor(() => {
      expect(screen.getByText("Recent Speech Activity")).toBeTruthy();
    });

    const clearLabel = screen.getByText("Clear");
    expect(StyleSheet.flatten(clearLabel.props.style).color).toBe(
      lightColors.danger,
    );

    fireEvent.press(clearLabel);

    expect(clearSpeechDiagnosticsMock).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      "Clear recent speech activity?",
      "This removes all captured speech-routing diagnostics. This action cannot be undone.",
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel", style: "cancel" }),
        expect.objectContaining({ text: "Clear", style: "destructive" }),
      ]),
    );

    const cancelAction = alertSpy.mock.calls[0]?.[2]?.find(
      (action) => action.style === "cancel",
    );
    cancelAction?.onPress?.();
    expect(clearSpeechDiagnosticsMock).not.toHaveBeenCalled();

    fireEvent.press(clearLabel);
    const destructiveAction = alertSpy.mock.calls[1]?.[2]?.find(
      (action) => action.style === "destructive",
    );
    destructiveAction?.onPress?.();
    expect(clearSpeechDiagnosticsMock).toHaveBeenCalledTimes(1);
  });
});
