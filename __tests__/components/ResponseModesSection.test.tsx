import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { ThinkingSettingsPage } from "../../src/features/settings/pages/ThinkingSettingsPage";
import type { LocalModelSettingsController } from "../../src/features/settings-core/useLocalModelSettings";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { DEFAULT_SETTINGS, type Settings } from "../../src/types";

const localModels = {
  benchmarks: {},
  busy: null,
  cancelDownload: jest.fn(),
  compatibleModels: [],
  downloadModel: jest.fn(),
  freeLanguageOptions: [],
  installs: {},
  isModelSelected: jest.fn(() => false),
  kokoroModel: { progress: 0 },
  nativeSpeechCapabilities: null,
  nativeVoiceOptions: [],
  probeError: null,
  probing: false,
  progress: {},
  refreshModelState: jest.fn(),
  removeModel: jest.fn(),
  runDeviceProbe: jest.fn(),
  selectModel: jest.fn(),
  selectNativeRoute: jest.fn(),
  selectNativeVoice: jest.fn(),
  selectedNativeVoice: "",
  snapshot: null,
  testModel: jest.fn(),
  toggleLanguage: jest.fn(),
} as unknown as LocalModelSettingsController;

function renderPage(
  settings: Settings,
  overrides: {
    onUpdate?: jest.Mock;
    onUpdateResponseModeRoute?: jest.Mock;
  } = {},
) {
  return render(
    <ThemeProvider mode="light">
      <LocalizationProvider language="en">
        <ThinkingSettingsPage
          allLlmProviders={["gemini", "openai"]}
          isPremium
          llmProviders={["gemini", "openai"]}
          localModels={localModels}
          settings={settings}
          onUpdate={overrides.onUpdate ?? jest.fn()}
          onUpdateResponseModeRoute={
            overrides.onUpdateResponseModeRoute ?? jest.fn()
          }
          onAddResponseMode={jest.fn()}
          onOpenPremium={jest.fn()}
          onRemoveResponseMode={jest.fn()}
        />
      </LocalizationProvider>
    </ThemeProvider>,
  );
}

describe("ThinkingSettingsPage response modes", () => {
  it("renders numbered coexisting slots and opens a model-specific effort sheet", () => {
    const screen = renderPage({
      ...DEFAULT_SETTINGS,
      responseModes: [
        {
          id: "mode-1",
          route: { provider: "gemini", model: "gemini-2.5-flash-lite" },
        },
        {
          id: "mode-2",
          route: {
            provider: "gemini",
            model: "gemini-3.5-flash",
            effort: "high",
          },
        },
      ],
    });

    expect(screen.getByTestId("thinking-slot-mode-1")).toBeTruthy();
    expect(screen.getByTestId("thinking-slot-mode-2")).toBeTruthy();
    expect(screen.queryByText("Effort")).toBeNull();

    fireEvent.press(screen.getByTestId("thinking-slot-mode-2"));

    expect(screen.getByText("Effort")).toBeTruthy();
    expect(screen.getByTestId("thinking-effort-high")).toBeTruthy();
    expect(
      screen.getByTestId("thinking-effort-high").props.accessibilityState,
    ).toEqual({ checked: true });
  });

  it("uses the selected model's documented effort ladder", () => {
    const screen = renderPage({
      ...DEFAULT_SETTINGS,
      responseModes: [
        {
          id: "mode-1",
          route: {
            provider: "gemini",
            model: "gemini-2.5-flash",
            effort: "dynamic",
          },
        },
      ],
    });

    fireEvent.press(screen.getByTestId("thinking-slot-mode-1"));

    expect(screen.getByText("Dynamic")).toBeTruthy();
    expect(screen.getByTestId("thinking-effort-dynamic")).toBeTruthy();
  });

  it("keeps Model Council configuration in its quiet sheet and warns for large runs", () => {
    const onUpdate = jest.fn();
    const responseModes = Array.from({ length: 4 }, (_, index) => ({
      id: `mode-${index + 1}`,
      route: {
        provider: "openai" as const,
        model: "gpt-5.5-2026-04-23",
        effort: "medium",
      },
    }));
    const screen = renderPage(
      {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "test-key",
        },
        responseModes,
        ulraModeEnabled: true,
        ulraModeRounds: 5,
      },
      { onUpdate },
    );

    expect(screen.queryByTestId("ulra-mode-threshold-warning")).toBeNull();
    fireEvent.press(screen.getByTestId("thinking-council-row"));

    expect(screen.getByTestId("ulra-mode-threshold-warning")).toBeTruthy();
    expect(
      screen.getByText(
        "Up to 25 model calls per message with the current setup.",
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByTestId("thinking-council-rounds-3"));
    expect(onUpdate).toHaveBeenCalledWith({ ulraModeRounds: 3 });
  });
});
