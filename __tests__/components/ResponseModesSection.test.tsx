import React from "react";
import { render } from "@testing-library/react-native";

import { ResponseModesSection } from "../../src/components/settings/ResponseModesSection";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { DEFAULT_SETTINGS } from "../../src/types";

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, name);
  },
}));

describe("ResponseModesSection", () => {
  it("shows an effort picker for Gemini models with thinking levels", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ResponseModesSection
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
            enabledProviders={["gemini"]}
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
          <ResponseModesSection
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
            enabledProviders={["gemini"]}
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
});
