import React from "react";
import {
  Alert,
  Modal as NativeModal,
  Platform,
  StyleSheet,
} from "react-native";
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react-native";
import {
  Button as AntButton,
  Card as AntCard,
  List,
  Modal as AntModal,
  Picker as AntPicker,
  Provider as AntProvider,
} from "@ant-design/react-native";

import { AntSettingsModal as SettingsModal } from "../../src/features/settings/AntSettingsModal";
import { PROVIDER_LABELS } from "../../src/constants/models";
import { LocalizationProvider, translate } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";
import {
  type AppLanguage,
  DEFAULT_SETTINGS,
  type Provider,
  type Settings,
} from "../../src/types";
import { useSpeechDiagnostics } from "../../src/hooks/useSpeechDiagnostics";
import { clearSpeechDiagnostics } from "../../src/services/speech/diagnostics";
import { getProviderValidationTarget } from "../../src/features/settings-core/providerSupport";
import { APP_LANGUAGE_OPTIONS } from "../../src/i18n/localeRegistry";

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children, ...props }: React.PropsWithChildren) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, props, children);
  },
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ color, name }: { color?: string; name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, { style: { color } }, name);
  },
}));

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    createAnimatedComponent: (component: unknown) => component,
    useSharedValue: (value: number) => ({ value }),
    useDerivedValue: (factory: () => unknown) => ({
      value: factory(),
    }),
    useAnimatedStyle: (factory: () => unknown) => factory(),
    withDelay: (_delay: number, value: unknown) => value,
    withTiming: (value: number) => value,
    withSpring: (value: number) => value,
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
  ProviderIcon: ({ label, provider }: { label?: string; provider: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, label ?? provider);
  },
}));

function renderSettingsModal(
  overrideProps: Partial<React.ComponentProps<typeof SettingsModal>> = {},
  language: AppLanguage = "en",
) {
  const kokoroModel = {
    installed: false,
    verified: false,
    busy: null,
    phase: null,
    progress: 0,
    error: null,
    download: jest.fn(async () => true),
    refresh: jest.fn(async () => undefined),
    remove: jest.fn(async () => true),
  } as const;

  return render(
    <ThemeProvider mode="light">
      <LocalizationProvider language={language}>
        <AntProvider>
          <SettingsModal
            visible
            settings={DEFAULT_SETTINGS}
            kokoroModel={kokoroModel}
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
        </AntProvider>
      </LocalizationProvider>
    </ThemeProvider>,
  );
}

describe("SettingsModal", () => {
  afterEach(() => {
    jest.mocked(useSpeechDiagnostics).mockReturnValue([]);
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
      expect(screen.getByTestId("icon-x")).toBeTruthy();
      expect(
        screen.getAllByTestId("icon-chevron-right").length,
      ).toBeGreaterThan(0);
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
      expect(screen.getByTestId("icon-arrow-left")).toBeTruthy();
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Connections",
      );
      expect(screen.getAllByText("Connections")).toHaveLength(1);
      expect(
        screen.queryByText("Provider keys, validation, and capabilities."),
      ).toBeNull();
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

  it("routes Android system back through settings navigation before closing", async () => {
    jest.replaceProperty(Platform, "OS", "android");
    const onClose = jest.fn();
    const screen = renderSettingsModal({ onClose });

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Connections",
      );
    });

    act(() => screen.UNSAFE_getByType(NativeModal).props.onRequestClose());

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Settings",
      );
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => screen.UNSAFE_getByType(NativeModal).props.onRequestClose());

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders App settings in Ukrainian", async () => {
    const screen = renderSettingsModal(
      {
        focusTab: "ui",
        settings: {
          ...DEFAULT_SETTINGS,
          language: "uk",
        },
      },
      "uk",
    );

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Застосунок і діагностика",
      );
      expect(screen.getByText("Тема")).toBeTruthy();
      expect(screen.getByText("Українська")).toBeTruthy();
      expect(screen.queryByText("Theme")).toBeNull();
    });
  });

  it("mirrors settings navigation icons for Arabic", async () => {
    const screen = renderSettingsModal(
      {
        settings: {
          ...DEFAULT_SETTINGS,
          language: "ar",
        },
      },
      "ar",
    );

    await waitFor(() => {
      expect(
        screen.getAllByTestId("icon-chevron-left").length,
      ).toBeGreaterThan(0);
      expect(screen.queryByTestId("icon-chevron-right")).toBeNull();
    });

    fireEvent.press(screen.getByText(translate("ar", "settingsConnections")));

    await waitFor(() => {
      expect(screen.getByTestId("icon-arrow-right")).toBeTruthy();
      expect(screen.queryByTestId("icon-arrow-left")).toBeNull();
    });
  });

  it("offers the optional Kokoro model and downloads it from Speaking settings", async () => {
    const download = jest.fn(async () => true);
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        ttsMode: "kokoro",
      },
      kokoroModel: {
        installed: false,
        verified: false,
        busy: null,
        phase: null,
        progress: 0,
        error: null,
        download,
        refresh: jest.fn(async () => undefined),
        remove: jest.fn(async () => true),
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Kokoro On-device Voices")).toBeTruthy();
      expect(
        screen.queryByText(
          "The multilingual model downloads about 140 MB and occupies about 211 MB after installation.",
        ),
      ).toBeNull();
      expect(
        screen.getByText(
          "Download and verify the model before selecting or using Kokoro. No provider key is required.",
        ),
      ).toBeTruthy();
      expect(screen.getByTestId("kokoro-language-card-en")).toBeTruthy();
      expect(screen.queryByText("TTS Voice")).toBeNull();
    });

    fireEvent.press(screen.getByLabelText("About Kokoro On-device Voices"));
    expect(
      screen.getByText(
        "The multilingual model downloads about 140 MB and occupies about 211 MB after installation.",
      ),
    ).toBeTruthy();
    act(() => screen.UNSAFE_getByType(AntModal).props.footer[0].onPress());

    fireEvent.press(screen.getByLabelText("Expand English voice settings"));
    expect(screen.getByText("TTS Voice")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Download the Kokoro model"));
    expect(download).toHaveBeenCalledTimes(1);
  });

  it("shows Kokoro removal above Settings and removes only after confirmation", async () => {
    const remove = jest.fn(async () => true);
    const alert = jest.spyOn(Alert, "alert");
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        ttsMode: "kokoro",
      },
      kokoroModel: {
        installed: true,
        verified: true,
        busy: null,
        phase: null,
        progress: 1,
        error: null,
        download: jest.fn(async () => true),
        refresh: jest.fn(async () => undefined),
        remove,
      },
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText("Remove the Kokoro model"),
      ).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Remove the Kokoro model"));

    expect(alert).toHaveBeenCalledWith(
      "Remove the Kokoro model?",
      "This frees about 211 MB. You can download the model again at any time.",
      expect.any(Array),
    );
    expect(remove).not.toHaveBeenCalled();

    const buttons = alert.mock.calls[0][2];
    const removeButton = buttons?.find((button) => button.text === "Remove");

    act(() => {
      removeButton?.onPress?.();
    });

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it("selects Kokoro before its async download completes", async () => {
    let finishDownload: (installed: boolean) => void = () => undefined;
    const download = jest.fn(
      () =>
        new Promise<boolean>((resolve) => {
          finishDownload = resolve;
        }),
    );
    const onUpdate = jest.fn();
    const alert = jest.spyOn(Alert, "alert");
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        ttsMode: "native",
      },
      kokoroModel: {
        installed: false,
        verified: false,
        busy: null,
        phase: null,
        progress: 0,
        error: null,
        download,
        refresh: jest.fn(async () => undefined),
        remove: jest.fn(async () => true),
      },
      onUpdate,
    });

    await waitFor(() => {
      expect(screen.getByText("Kokoro")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Kokoro"));

    expect(onUpdate).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      "Kokoro",
      "Download and verify the model before selecting or using Kokoro. No provider key is required.",
      expect.any(Array),
    );

    const buttons = alert.mock.calls[0][2];
    const downloadButton = buttons?.find((button) => button.text === "Download");

    act(() => {
      downloadButton?.onPress?.();
    });

    expect(download).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith({ ttsMode: "kokoro" });

    await act(async () => {
      finishDownload(true);
      await Promise.resolve();
    });
  });

  it("keeps provider fallbacks empty until the user adds one", async () => {
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        ttsMode: "provider",
      },
      onUpdate,
    });

    await waitFor(() => {
      expect(screen.getByText("Fallback routes")).toBeTruthy();
      expect(
        screen.getByText(
          "No fallback is configured. A voice failure will be shown instead.",
        ),
      ).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Add Kokoro fallback"));

    expect(onUpdate).toHaveBeenCalledWith({
      ttsFallbackPolicy: {
        provider: ["kokoro"],
        kokoro: [],
      },
    });
  });

  it("shows and reorders both explicit provider fallback routes", async () => {
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        ttsMode: "provider",
        ttsFallbackPolicy: {
          provider: ["kokoro", "native"],
          kokoro: [],
        },
      },
      onUpdate,
    });

    await waitFor(() => {
      expect(screen.getByText("1. Kokoro")).toBeTruthy();
      expect(screen.getByText("2. System voice")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Move System voice earlier"));

    expect(onUpdate).toHaveBeenCalledWith({
      ttsFallbackPolicy: {
        provider: ["native", "kokoro"],
        kokoro: [],
      },
    });
  });

  it("offers provider and native fallbacks for Kokoro but none for native speech", async () => {
    const kokoroScreen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        ttsMode: "kokoro",
      },
    });

    await waitFor(() => {
      expect(kokoroScreen.getByLabelText("Add Provider fallback")).toBeTruthy();
      expect(
        kokoroScreen.getByLabelText("Add System voice fallback"),
      ).toBeTruthy();
    });
    kokoroScreen.unmount();

    const nativeScreen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        ttsMode: "native",
      },
    });

    await waitFor(() => {
      expect(nativeScreen.queryByText("Fallback routes")).toBeNull();
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

  it("can restore the guided setup shortcut from Connections", async () => {
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({
      settings: {
        ...DEFAULT_SETTINGS,
        showSetupGuideShortcut: false,
      },
      onUpdate,
    });

    expect(screen.queryByLabelText("Guided setup")).toBeNull();
    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByTestId("setup-guide-shortcut-setting")).toBeTruthy();
    });

    fireEvent(
      screen.getByLabelText("Show guided setup in Settings"),
      "valueChange",
      true,
    );

    expect(onUpdate).toHaveBeenCalledWith({
      showSetupGuideShortcut: true,
    });
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

  it("keeps provider capabilities in the card footer", async () => {
    const screen = renderSettingsModal({ focusProvider: "openai" });

    await waitFor(() => {
      expect(screen.getByTestId("provider-vault-row-openai")).toBeTruthy();
    });

    const header = screen.getByTestId("provider-vault-row-openai");
    const headerControl = screen.getByTestId(
      "provider-card-openai-header-control",
    );
    const footer = screen.getByTestId("provider-capability-footer-openai");

    fireEvent(headerControl, "pressIn");
    expect(StyleSheet.flatten(headerControl.props.style).transform).toBeUndefined();
    fireEvent(headerControl, "pressOut");

    expect(
      within(header).queryByTestId("provider-capability-pill-openai-llm"),
    ).toBeNull();
    expect(
      within(footer).getByTestId("provider-capability-pill-openai-llm"),
    ).toBeTruthy();
    const capabilityPill = within(footer).getByTestId(
      "provider-capability-pill-openai-llm",
    );
    expect(capabilityPill.props.accessibilityRole).toBe("text");
    expect(
      capabilityPill.findAll(
        (node) => typeof node.props.onPress === "function",
      ),
    ).toHaveLength(0);
  });

  it("opens provider details from the card header info action", async () => {
    const screen = renderSettingsModal({ focusProvider: "openai" });

    await waitFor(() => {
      expect(screen.getByLabelText("About this provider: OpenAI")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("About this provider: OpenAI"));

    await waitFor(() => {
      expect(screen.getByText("OpenAI · About this provider")).toBeTruthy();
      const modal = screen.getByTestId("provider-about-modal");
      expect(modal).toBeTruthy();
      expect(within(modal).getByTestId("provider-about-scroll")).toBeTruthy();
      expect(within(modal).getByLabelText("Dismiss")).toBeTruthy();
    });
  });

  it("orders provider actions and sections around the disclosure content", async () => {
    const provider = "alibaba-qwen-dashscope";
    const screen = renderSettingsModal({ focusProvider: provider });

    await waitFor(() => {
      expect(screen.getByText("API key")).toBeTruthy();
      expect(screen.getByText("API test")).toBeTruthy();
    });
    expect(screen.queryByText("API region")).toBeNull();
    expect(screen.queryByText("Region")).toBeNull();
    expect(screen.getByText("Singapore")).toBeTruthy();

    const apiKeySection = screen.getByTestId(
      `provider-api-key-section-${provider}`,
    );
    expect(within(apiKeySection).getByText("Singapore")).toBeTruthy();
    const regionHint = within(apiKeySection).getByText(
      "The selected region must match the region in which this API key was created.",
    );
    expect(StyleSheet.flatten(regionHint.props.style).fontSize).toBe(12);

    const card = screen.getByTestId(`provider-card-${provider}`);
    const expectedActionLabels = [
      "Credentials: Alibaba / Qwen",
      "About this provider: Alibaba / Qwen",
      "Collapse Alibaba / Qwen",
    ];
    const actionLabels = [
      ...new Set(
        card
          .findAll(
            (node) =>
              typeof node.props.accessibilityLabel === "string" &&
              expectedActionLabels.includes(node.props.accessibilityLabel),
          )
          .map((node) => node.props.accessibilityLabel),
      ),
    ];

    expect(actionLabels).toEqual(expectedActionLabels);

    const apiTestHeader = screen.getByTestId(
      `provider-api-test-header-${provider}`,
    );
    expect(within(apiTestHeader).getByText("API test")).toBeTruthy();
    expect(
      within(apiTestHeader).getByTestId(`provider-test-all-${provider}`),
    ).toBeTruthy();
    expect(StyleSheet.flatten(apiTestHeader.props.style).justifyContent).toBe(
      "space-between",
    );

    const apiTestSection = screen.getByTestId(
      `provider-api-test-section-${provider}`,
    );
    const orderedTestControls = [
      ...new Set(
        apiTestSection
          .findAll(
            (node) =>
              node.props.testID === `provider-capability-list-${provider}` ||
              node.props.testID === `provider-test-all-${provider}`,
          )
          .map((node) => node.props.testID),
      ),
    ];

    expect(orderedTestControls).toEqual([
      `provider-test-all-${provider}`,
      `provider-capability-list-${provider}`,
    ]);

    const capabilityRows = screen
      .UNSAFE_getAllByType(List.Item)
      .filter(
        (item) =>
          typeof item.props.testID === "string" &&
          item.props.testID.startsWith(`provider-capability-row-${provider}-`),
      );
    expect(capabilityRows).not.toHaveLength(0);
    for (const row of capabilityRows) {
      expect(row.props.styles.Line.borderBottomWidth).toBe(0);
    }
    for (const statusText of within(apiTestSection).getAllByText(
      "Not set up",
    )) {
      expect(StyleSheet.flatten(statusText.props.style).fontSize).toBe(12);
    }
  });

  it("keeps a fully validated Google card healthy across model switches", async () => {
    const activeMode = DEFAULT_SETTINGS.responseModes[0];
    const baseSettings: Settings = {
      ...DEFAULT_SETTINGS,
      activeResponseMode: activeMode.id,
      responseModes: [
        {
          ...activeMode,
          route: {
            provider: "gemini",
            model: "gemini-2.5-flash-lite",
            effort: "disabled",
          },
        },
      ],
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "working-google-key",
      },
      providerTtsModels: {
        ...DEFAULT_SETTINGS.providerTtsModels,
        gemini: "gemini-2.5-pro-preview-tts",
      },
    };
    const llmTarget = getProviderValidationTarget(
      baseSettings,
      "gemini",
      "llm",
    );
    const sttTarget = getProviderValidationTarget(
      baseSettings,
      "gemini",
      "stt",
    );
    const ttsTarget = getProviderValidationTarget(
      baseSettings,
      "gemini",
      "tts",
    );
    const searchTarget = getProviderValidationTarget(
      baseSettings,
      "gemini",
      "search",
    );
    expect(llmTarget.model).toBe("gemini-3.6-flash");
    expect(ttsTarget.model).toBe("gemini-3.1-flash-tts-preview");
    expect(searchTarget.model).toBe("gemini-3.6-flash");
    const settings: Settings = {
      ...baseSettings,
      providerValidationResults: {
        gemini: {
          llm: {
            status: "success",
            model: "gemini-2.5-flash",
          },
          stt: {
            status: "success",
            model: sttTarget.model,
            configKey: sttTarget.configKey,
          },
          tts: {
            status: "success",
            model: ttsTarget.model,
            configKey: ttsTarget.configKey,
          },
          search: {
            status: "success",
            model: searchTarget.model,
            configKey: searchTarget.configKey,
          },
        },
      },
    };
    const screen = renderSettingsModal({
      focusProvider: "gemini",
      settings,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("provider-vault-row-gemini").props
          .accessibilityLabel,
      ).toContain("Working");
      expect(
        screen.queryByTestId("provider-capability-footer-gemini"),
      ).toBeNull();
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
      expect(screen.getByLabelText("OpenRouter keys: OpenRouter")).toBeTruthy();
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
        webSearchProvider: "openai",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByText("OpenAI")).toBeTruthy();
      const openAiRow = screen.getByTestId("provider-vault-row-openai");
      expect(openAiRow.props.accessibilityLabel).toContain("Not tested");
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
      const llmPill = screen.getByTestId("provider-capability-pill-openai-llm");
      expect(llmPill.props.accessibilityLabel).toBe("LLM: Working");
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
      expect(screen.getByText(new RegExp(errorMessage))).toBeTruthy();
      const llmPill = screen.getByTestId("provider-capability-pill-openai-llm");
      expect(llmPill.props.accessibilityLabel).toBe("LLM: Invalid");
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
      const llmPill = screen.getByTestId("provider-capability-pill-openai-llm");
      expect(llmPill.props.accessibilityLabel).toBe("LLM: Working");
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
      expect(screen.getByText("Model Selection")).toBeTruthy();
      expect(screen.getByText("System Prompt")).toBeTruthy();
      expect(screen.queryByText("Provider")).toBeNull();
      expect(screen.getAllByText("OpenAI").length).toBeGreaterThan(0);
      expect(screen.queryByText("Adaptive Length")).toBeNull();
      expect(screen.queryByText("Response Tone")).toBeNull();
    });

    expect(
      StyleSheet.flatten(
        screen.getByTestId("settings-model-provider-mode-1-value").props.style,
      ).textAlign,
    ).toBe("right");
    expect(
      StyleSheet.flatten(
        screen.getByTestId("thinking-settings-page").props.style,
      ).gap,
    ).toBe(24);
    expect(
      StyleSheet.flatten(screen.getByTestId("system-prompt-editor").props.style)
        .width,
    ).toBe("100%");
    expect(screen.queryByText("Remove model")).toBeNull();
    expect(screen.getAllByLabelText("Remove model").length).toBeGreaterThan(0);
    expect(
      screen.queryByText(
        "Shape the hidden guidance the model receives before every reply.",
      ),
    ).toBeNull();

    const modelSelectionInfoButton = screen
      .UNSAFE_getAllByType(AntButton)
      .find(
        (button) => button.props.accessibilityLabel === "About model selection",
      );
    expect(modelSelectionInfoButton).toBeDefined();
    act(() => modelSelectionInfoButton!.props.onPress());
    let infoModal = screen.UNSAFE_getByType(AntModal);
    expect(infoModal.props.visible).toBe(true);
    expect(infoModal.props.title).toBe("Model Selection");
    expect(
      screen.getByText(
        "Each model card becomes a choice on the home screen. Configure its provider, model, and optional effort level, then switch cards to choose which model answers next.",
      ),
    ).toBeTruthy();
    act(() => infoModal.props.footer[0].onPress());
    expect(screen.UNSAFE_queryByType(AntModal)).toBeNull();

    const systemPromptInfoButton = screen
      .UNSAFE_getAllByType(AntButton)
      .find(
        (button) =>
          button.props.accessibilityLabel === "About the system prompt",
      );
    expect(systemPromptInfoButton).toBeDefined();
    act(() => systemPromptInfoButton!.props.onPress());
    infoModal = screen.UNSAFE_getByType(AntModal);
    expect(infoModal.props.visible).toBe(true);
    expect(infoModal.props.title).toBe("System Prompt");
    expect(
      screen.getByText(
        "Shape the hidden guidance the model receives before every reply.",
      ),
    ).toBeTruthy();
    act(() => infoModal.props.footer[0].onPress());
    expect(screen.UNSAFE_queryByType(AntModal)).toBeNull();

    fireEvent.press(screen.getByLabelText("Back to overview"));
    fireEvent.press(screen.getByLabelText("Open Search"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Search",
      );
      expect(screen.getByText("Web Search Provider")).toBeTruthy();
      expect(screen.getByText("Advanced Search Controls")).toBeTruthy();
      expect(
        screen.queryByLabelText("About Web Search Provider"),
      ).toBeNull();
      expect(screen.queryByText("Model Selection")).toBeNull();
    });

    fireEvent.press(screen.getByText("Advanced Search Controls"));

    await waitFor(() => {
      expect(screen.getByText("Search Mode")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Back to overview"));
    fireEvent.press(screen.getByLabelText("Open App & diagnostics"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "App & diagnostics",
      );
      expect(screen.getByText("Theme")).toBeTruthy();
      expect(screen.getByTestId("app-language-picker")).toBeTruthy();
      expect(screen.getByText("Usage Stats")).toBeTruthy();
      expect(screen.getByLabelText("About Debug Log Button")).toBeTruthy();
      expect(
        screen.queryByText(
          "How to use the button: toggling it on will start capturing logs. Toggling it off will stop capturing logs and move the captured ones into the clipboard.",
        ),
      ).toBeNull();
      expect(screen.getByText("Recent Speech Activity")).toBeTruthy();
      expect(screen.queryByText("Web Search Provider")).toBeNull();
    });

    const languagePicker = screen
      .UNSAFE_getAllByType(List.Item)
      .find((item) => item.props.testID === "app-language-picker");
    expect(languagePicker).toBeDefined();
    expect(
      screen
        .UNSAFE_getAllByType(AntPicker)
        .find((picker) =>
          picker.props.data?.some(
            (option: { value: string }) => option.value === "uk",
          ),
        )?.props.data,
    ).toEqual(APP_LANGUAGE_OPTIONS);
    expect(StyleSheet.flatten(languagePicker!.props.style).marginHorizontal).toBe(
      0,
    );
    expect(
      screen
        .UNSAFE_getAllByType(AntCard)
        .some((card) => within(card).queryByTestId("app-language-picker")),
    ).toBe(false);
  });

  it("keeps Voice Input free of a redundant heading info action", async () => {
    const screen = renderSettingsModal({
      focusTab: "stt",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          gemini: "configured-google-key",
        },
        sttMode: "provider",
        sttProvider: "gemini",
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Listening",
      );
      expect(screen.getByText("Voice Input")).toBeTruthy();
      expect(screen.queryByLabelText("About Voice Input")).toBeNull();
      expect(screen.getByLabelText("About Input Mode")).toBeTruthy();
      expect(screen.getByLabelText("About Speech to Text")).toBeTruthy();
      expect(
        screen.getByTestId("stt-provider-picker-value").props.children,
      ).toBe("Google");
    });

    expect(
      StyleSheet.flatten(
        screen.getByTestId("stt-provider-picker-value").props.style,
      ).textAlign,
    ).toBe("right");

    fireEvent.press(screen.getByLabelText("About Input Mode"));
    expect(screen.UNSAFE_getByType(AntModal).props).toMatchObject({
      modalType: "modal",
      title: "Input Mode",
      visible: true,
    });
    expect(
      screen.getByText(
        "Hold the main button while speaking, then release to send.",
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByText("Done"));
    await waitFor(() => {
      expect(
        screen.queryByText(
          "Hold the main button while speaking, then release to send.",
        ),
      ).toBeNull();
    });

    fireEvent.press(screen.getByLabelText("About Speech to Text"));
    expect(screen.UNSAFE_getByType(AntModal).props).toMatchObject({
      modalType: "modal",
      title: "Speech to Text",
      visible: true,
    });
    expect(
      screen.getByText(
        "Use the operating system's speech recognizer. Depending on device settings, recognition may run on-device or through the system service. No provider key is required.",
      ),
    ).toBeTruthy();
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
      expect(screen.getAllByText("TTS Provider")).toHaveLength(1);
      expect(screen.getByText("Mistral voice library")).toBeTruthy();
      expect(screen.getByText("2 voices available from Mistral.")).toBeTruthy();
      expect(screen.getByText("Calm Guide · calm-guide")).toBeTruthy();
    });

    expect(
      StyleSheet.flatten(
        screen.getByTestId("tts-provider-picker-value").props.style,
      ).textAlign,
    ).toBe("right");
    const providerVoicePicker = screen
      .UNSAFE_getAllByType(List.Item)
      .find(
        (item) =>
          item.props.testID === "provider-tts-voice-picker-mistral",
      );
    expect(providerVoicePicker).toBeDefined();
    expect(
      StyleSheet.flatten(providerVoicePicker!.props.style).marginHorizontal,
    ).toBe(0);
    expect(
      screen
        .UNSAFE_getAllByType(AntCard)
        .some((card) =>
          within(card).queryByTestId("provider-tts-voice-picker-mistral"),
        ),
    ).toBe(false);

    fireEvent.press(screen.getByLabelText("Expand English voice settings"));
    expect(
      screen.getByLabelText("Collapse English voice settings"),
    ).toBeTruthy();

    fireEvent.press(screen.getByTestId("mistral-voices-refresh"));
    expect(onRefreshMistralVoices).toHaveBeenCalledTimes(1);

    const voicePicker = screen
      .UNSAFE_getAllByType(AntPicker)
      .find((picker) =>
        picker.props.data.some(
          (option: { value: string }) => option.value === "studio-voice",
        ),
      );
    expect(voicePicker).toBeTruthy();
    act(() => {
      voicePicker?.props.onOk?.(["studio-voice"]);
    });

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
      expect(screen.getByPlaceholderText("Enter a voice ID")).toBeTruthy();
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

    const voicePicker = screen
      .UNSAFE_getAllByType(AntPicker)
      .find((picker) =>
        picker.props.data.some(
          (option: { value: string }) => option.value === "voice-2",
        ),
      );
    expect(voicePicker).toBeTruthy();
    act(() => {
      voicePicker?.props.onOk?.(["voice-2"]);
    });

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
      expect(
        screen.getByText("Reason: Missing voices_read permission"),
      ).toBeTruthy();
      expect(
        screen.getByText(
          "In ElevenLabs, edit this API key and enable Voices → Read, then refresh here.",
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
        screen.getByTestId("provider-capability-pill-elevenlabs-stt").props
          .accessibilityLabel,
      ).toBe("STT: Working");
      expect(
        screen.getByTestId("provider-capability-pill-elevenlabs-tts").props
          .accessibilityLabel,
      ).toBe("TTS: Working");
      expect(
        screen.getByTestId("provider-capability-pill-elevenlabs-voices").props
          .accessibilityLabel,
      ).toBe("Voice library: Invalid");
      expect(screen.getByText(/Missing voices_read permission/)).toBeTruthy();
      expect(screen.getAllByText("Working").length).toBeGreaterThanOrEqual(2);
      expect(
        screen.getByText(/Invalid · Missing voices_read permission/),
      ).toBeTruthy();
    });
  });

  it("styles speech diagnostics clearing as destructive and requires confirmation", async () => {
    const clearSpeechDiagnosticsMock = jest.mocked(clearSpeechDiagnostics);
    jest.mocked(useSpeechDiagnostics).mockReturnValue([
      {
        id: "preview-1",
        requestId: "preview-1",
        createdAt: "2026-07-27T10:00:00.000Z",
        source: "preview",
        latestStage: "tts-succeeded",
        requestedRoute: "native",
        actualRoute: "native",
        language: "en",
        provider: null,
        providerModel: null,
        voice: null,
        fallbackReason: null,
        message: null,
        textLength: 12,
      },
    ]);
    const screen = renderSettingsModal();

    fireEvent.press(screen.getByLabelText("Open App & diagnostics"));

    await waitFor(() => {
      expect(screen.getByText("Recent Speech Activity")).toBeTruthy();
    });

    const clearAction = screen.getByLabelText("Clear recent speech activity");
    expect(
      StyleSheet.flatten(screen.getByTestId("icon-trash-2").props.style).color,
    ).toBe("#DC2626");

    fireEvent.press(clearAction);

    expect(clearSpeechDiagnosticsMock).not.toHaveBeenCalled();
    let confirmation = screen.UNSAFE_getByType(AntModal);
    expect(confirmation.props.visible).toBe(true);
    expect(confirmation.props.title).toBe("Clear recent speech activity?");
    expect(confirmation.props.children.props.children).toBe(
      "This removes all captured speech-routing diagnostics. This action cannot be undone.",
    );

    const cancelAction = confirmation.props.footer.find(
      (action: { text: string }) => action.text === "Cancel",
    );
    act(() => {
      cancelAction.onPress();
    });
    confirmation = screen.UNSAFE_getByType(AntModal);
    expect(confirmation.props.visible).toBe(false);
    expect(clearSpeechDiagnosticsMock).not.toHaveBeenCalled();

    fireEvent.press(clearAction);
    confirmation = screen.UNSAFE_getByType(AntModal);
    const destructiveAction = confirmation.props.footer.find(
      (action: { text: string }) => action.text === "Clear",
    );
    expect(StyleSheet.flatten(destructiveAction.style).color).toBe(
      lightColors.danger,
    );
    act(() => {
      destructiveAction.onPress();
    });
    expect(clearSpeechDiagnosticsMock).toHaveBeenCalledTimes(1);
  });
});
