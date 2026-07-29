import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { ThinkingSettingsPage } from "../../src/features/settings/pages/ThinkingSettingsPage";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { DEFAULT_SETTINGS } from "../../src/types";

describe("ThinkingSettingsPage response modes", () => {
  it("shows an effort picker for Gemini models with thinking levels", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ThinkingSettingsPage
            settings={{
              ...DEFAULT_SETTINGS,
              responseModes: [
                {
                  id: "mode-1",
                  route: {
                    provider: "gemini",
                    model: "gemini-2.5-flash-lite",
                  },
                },
                {
                  id: "mode-2",
                  route: {
                    provider: "gemini",
                    model: "gemini-3.5-flash",
                    effort: "high",
                  },
                },
                {
                  id: "mode-3",
                  route: {
                    provider: "gemini",
                    model: "gemini-3.1-pro-preview",
                    effort: "high",
                  },
                },
              ],
            }}
            llmProviders={["gemini"]}
            onUpdate={jest.fn()}
            onUpdateResponseModeRoute={jest.fn()}
            onAddResponseMode={jest.fn()}
            onRemoveResponseMode={jest.fn()}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getAllByText("Effort").length).toBeGreaterThan(0);
    expect(screen.getAllByText("High").length).toBeGreaterThan(0);
  });

  it("shows the documented thinking controls for Gemini 2.5 models", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ThinkingSettingsPage
            settings={{
              ...DEFAULT_SETTINGS,
              responseModes: [
                {
                  id: "mode-1",
                  route: { provider: "gemini", model: "gemini-2.5-flash" },
                },
                {
                  id: "mode-2",
                  route: { provider: "gemini", model: "gemini-2.5-flash" },
                },
              ],
            }}
            llmProviders={["gemini"]}
            onUpdate={jest.fn()}
            onUpdateResponseModeRoute={jest.fn()}
            onAddResponseMode={jest.fn()}
            onRemoveResponseMode={jest.fn()}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getAllByText("Effort")).toHaveLength(2);
    expect(screen.getAllByText("Dynamic")).toHaveLength(2);
  });

  it("warns without capping a large Ulra Mode configuration", () => {
    const onUpdate = jest.fn();
    const responseModes = Array.from({ length: 5 }, (_, index) => ({
      id: `mode-${index + 1}`,
      route: {
        provider: "openai" as const,
        model: "gpt-5.5-2026-04-23",
        effort: "medium",
      },
    }));
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ThinkingSettingsPage
            settings={{
              ...DEFAULT_SETTINGS,
              apiKeys: {
                ...DEFAULT_SETTINGS.apiKeys,
                openai: "test-key",
              },
              responseModes,
              ulraModeRounds: 10,
            }}
            llmProviders={["openai"]}
            onUpdate={onUpdate}
            onUpdateResponseModeRoute={jest.fn()}
            onAddResponseMode={jest.fn()}
            onRemoveResponseMode={jest.fn()}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("ulra-mode-threshold-warning")).toBeTruthy();
    expect(
      screen.getByText(
        "About 56 model calls per message with the current setup.",
      ),
    ).toBeTruthy();

    const roundsInput = screen.getByTestId("settings-number-input");
    fireEvent.changeText(roundsInput, "7");
    fireEvent(roundsInput, "blur");
    expect(onUpdate).toHaveBeenCalledWith({ ulraModeRounds: 7 });
  });
});
