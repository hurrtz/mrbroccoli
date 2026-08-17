import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { ThinkingSettingsPage } from "../../src/features/settings/pages/ThinkingSettingsPage";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { DEFAULT_SETTINGS, type Settings } from "../../src/types";

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
          llmProviders={["gemini", "openai"]}
          settings={settings}
          onUpdate={overrides.onUpdate ?? jest.fn()}
          onUpdateResponseModeRoute={
            overrides.onUpdateResponseModeRoute ?? jest.fn()
          }
          onAddResponseMode={jest.fn()}
          onRemoveResponseMode={jest.fn()}
        />
      </LocalizationProvider>
    </ThemeProvider>,
  );
}

describe("ThinkingSettingsPage response modes", () => {
  it("edits the defaults inherited by sessions without overrides", () => {
    const onUpdate = jest.fn();
    const screen = renderPage(
      {
        ...DEFAULT_SETTINGS,
        responseLength: "thorough",
        responseTone: "casual",
      },
      { onUpdate },
    );

    expect(screen.getByText("Conversation defaults")).toBeTruthy();
    expect(
      screen.getByText(
        "Used by new sessions and any session without its own overrides.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByTestId("thinking-default-response-length").props
        .accessibilityLabel,
    ).toBe("Adaptive Length. Thorough");
    expect(
      screen.getByTestId("thinking-default-response-tone").props
        .accessibilityLabel,
    ).toBe("Response Tone. Casual");

    fireEvent.press(screen.getByTestId("thinking-default-response-length"));
    fireEvent.press(
      screen.getByTestId("thinking-default-response-length-option-brief"),
    );

    expect(onUpdate).toHaveBeenCalledWith({ responseLength: "brief" });
  });

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
        ulraModeRounds: 4,
      },
      { onUpdate },
    );

    expect(screen.queryByTestId("ulra-mode-threshold-warning")).toBeNull();
    fireEvent.press(screen.getByTestId("thinking-council-row"));

    expect(screen.getByTestId("ulra-mode-threshold-warning")).toBeTruthy();
    expect(
      screen.getByText(
        "Up to 21 model calls per message with the current setup.",
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByTestId("thinking-council-rounds-3"));
    expect(onUpdate).toHaveBeenCalledWith({ ulraModeRounds: 2 });
  });
});
