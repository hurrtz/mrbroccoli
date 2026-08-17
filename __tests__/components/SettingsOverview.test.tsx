import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render, within } from "@testing-library/react-native";

import appConfig from "../../app.json";
import { AntSettingsOverview } from "../../src/features/settings/AntSettingsOverview";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";
import { DEFAULT_SETTINGS } from "../../src/types";

const hiddenIconQuery = { includeHiddenElements: true } as const;

function overviewProps() {
  return {
    getProviderHealthState: jest.fn(() => "healthy" as const),
    onOpenPage: jest.fn(),
    readiness: {
      think: { state: "ready", summaryKey: "settingsReadinessReady" },
      listen: {
        state: "attention",
        summaryKey: "settingsReadinessNeedsAttention",
      },
      speak: { state: "ready", summaryKey: "settingsReadinessReady" },
      search: { state: "off", summaryKey: "settingsReadinessOff" },
    } as const,
    settings: DEFAULT_SETTINGS,
  };
}

describe("AntSettingsOverview", () => {
  it("summarizes many connections as two named statuses plus a count", () => {
    // Three joined status phrases truncate mid-word in the row; the third
    // and later providers collapse into "+N".
    const props = overviewProps();
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview
            {...props}
            getProviderHealthState={jest.fn(() => "configured" as const)}
            settings={{
              ...DEFAULT_SETTINGS,
              apiKeys: {
                ...DEFAULT_SETTINGS.apiKeys,
                openai: "sk-a",
                anthropic: "sk-b",
                gemini: "sk-c",
                mistral: "sk-d",
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const connections = screen.getByTestId("settings-overview-row-connections");
    expect(
      within(connections).getByText(
        "OpenAI not tested · Anthropic not tested · +2",
      ),
    ).toBeTruthy();
  });

  it("leads with readiness and task-oriented groups", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview {...overviewProps()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getByText("Conversation")).toBeTruthy();
    expect(screen.getByText("Voice")).toBeTruthy();
    expect(screen.getByText("Privacy & app")).toBeTruthy();
    expect(screen.queryByTestId("settings-readiness-grid")).toBeNull();
    expect(screen.getByTestId("settings-readiness-line")).toBeTruthy();
  });

  it("opens the setting behind a readiness capability", () => {
    const props = overviewProps();
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview {...props} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByTestId("settings-readiness-listen"));

    expect(props.onOpenPage).toHaveBeenCalledWith("listening");
  });

  it("omits the retired guided setup card", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview {...overviewProps()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("settings-guided-setup")).toBeNull();
    expect(screen.queryByText("Guided setup")).toBeNull();
  });

  it("shows the current release version from the app config", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview {...overviewProps()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("settings-release-version").props.children).toBe(
      `Version ${appConfig.expo.version}`,
    );
  });

  it("uses equal live-state rows from the seven-page design", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview {...overviewProps()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const connections = screen.getByTestId("settings-overview-row-connections");
    const iconStyle = StyleSheet.flatten(
      screen.getByTestId("phosphor-icon-key", hiddenIconQuery).props.style,
    );

    expect(StyleSheet.flatten(connections.props.style).minHeight).toBe(64);
    expect(within(connections).getByText("Not set up")).toBeTruthy();
    expect(iconStyle.width).toBe(20);
    expect(iconStyle.height).toBe(20);
    expect(iconStyle.color).toBe(lightColors.textSecondary);
  });

  it("shows all seven BYOK settings sections", () => {
    const onOpenPage = jest.fn();
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview
            {...overviewProps()}
            onOpenPage={onOpenPage}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("settings-readiness-grid")).toBeNull();
    expect(screen.getByTestId("settings-readiness-line")).toBeTruthy();
    for (const page of [
      "connections",
      "thinking",
      "search",
      "listening",
      "speaking",
      "data",
      "app",
    ]) {
      expect(screen.getByTestId(`settings-overview-row-${page}`)).toBeTruthy();
    }
    expect(screen.queryByText("Unlock Premium")).toBeNull();
    fireEvent.press(screen.getByTestId("settings-overview-row-data"));
    expect(onOpenPage).toHaveBeenCalledWith("data");
  });
});
