import React from "react";
import { StyleSheet } from "react-native";
import { render } from "@testing-library/react-native";

import appConfig from "../../app.json";
import { AntSettingsOverview } from "../../src/features/settings/AntSettingsOverview";
import type { SettingsReadiness } from "../../src/features/settings-core/readiness";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

const readiness: SettingsReadiness = {
  think: { state: "ready", summaryKey: "settingsReadinessReady" },
  listen: { state: "ready", summaryKey: "settingsReadinessReady" },
  speak: { state: "off", summaryKey: "settingsReadinessOff" },
  search: { state: "attention", summaryKey: "settingsReadinessNeedsAttention" },
};

describe("AntSettingsOverview", () => {
  it("renders readiness as a concise, accessible progression", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview readiness={readiness} onOpenPage={jest.fn()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const thinkChip = screen.getByLabelText("Think: Ready");
    const speakChip = screen.getByLabelText("Speak: Off");

    expect(screen.getAllByTestId("phosphor-icon-check")).toHaveLength(2);
    expect(
      StyleSheet.flatten(screen.getByText("Think").props.style).fontSize,
    ).toBe(12);
    expect(thinkChip).toBeTruthy();
    expect(speakChip).toBeTruthy();
    expect(screen.queryByText("Runtime Readiness")).toBeNull();
    expect(screen.queryByText("Ready")).toBeNull();
    expect(screen.queryByText("Off")).toBeNull();
    expect(screen.queryByText("Attention")).toBeNull();
    expect(screen.queryByText("Broken")).toBeNull();
  });

  it("exposes guided setup as one clear action", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview
            readiness={readiness}
            onOpenPage={jest.fn()}
            onOpenSetupGuide={jest.fn()}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getByLabelText("Guided setup")).toBeTruthy();
    expect(screen.getAllByText("Guided setup")).toHaveLength(1);
  });

  it("shows the current release version from the app config", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview readiness={readiness} onOpenPage={jest.fn()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("settings-release-version").props.children).toBe(
      `Version ${appConfig.expo.version}`,
    );
  });

  it("shows larger section icons without bordered icon containers", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview readiness={readiness} onOpenPage={jest.fn()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const iconContainer = screen.getByTestId(
      "settings-overview-icon-connections",
    );
    const containerStyle = StyleSheet.flatten(iconContainer.props.style);
    const iconStyle = StyleSheet.flatten(
      screen.getByTestId("phosphor-icon-key").props.style,
    );

    expect(containerStyle.width).toBe(34);
    expect(containerStyle.borderWidth).toBeUndefined();
    expect(iconStyle.width).toBe(28);
    expect(iconStyle.height).toBe(28);
    expect(iconStyle.color).toBe(lightColors.text);
  });
});
