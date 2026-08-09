import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import appConfig from "../../app.json";
import { AntSettingsOverview } from "../../src/features/settings/AntSettingsOverview";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

const hiddenIconQuery = { includeHiddenElements: true } as const;

function overviewProps() {
  return {
    isPremium: true,
    onOpenPage: jest.fn(),
    onOpenPremium: jest.fn(),
    readiness: {
      listen: {
        state: "ready",
        summaryKey: "settingsReadinessReady",
      },
      search: { state: "off", summaryKey: "settingsReadinessOff" },
      speak: {
        state: "attention",
        summaryKey: "settingsReadinessNeedsAttention",
      },
      think: { state: "ready", summaryKey: "settingsReadinessReady" },
    },
  } satisfies React.ComponentProps<typeof AntSettingsOverview>;
}

describe("AntSettingsOverview", () => {
  it("leads with the current edition and task-oriented groups", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview {...overviewProps()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(
      screen.getByTestId("phosphor-icon-check-circle", hiddenIconQuery),
    ).toBeTruthy();
    expect(screen.getByText("Premium is unlocked")).toBeTruthy();
    expect(screen.getByText("Conversation & tools")).toBeTruthy();
    expect(screen.getByText("Voice & models")).toBeTruthy();
    expect(screen.getByText("Privacy & app")).toBeTruthy();
    expect(screen.queryByTestId("settings-readiness-grid")).toBeNull();
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

  it("shows larger section icons without bordered icon containers", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview {...overviewProps()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const iconContainer = screen.getByTestId(
      "settings-overview-icon-connections",
    );
    const containerStyle = StyleSheet.flatten(iconContainer.props.style);
    const iconStyle = StyleSheet.flatten(
      screen.getByTestId("phosphor-icon-key", hiddenIconQuery).props.style,
    );

    expect(containerStyle.width).toBe(34);
    expect(containerStyle.borderWidth).toBeUndefined();
    expect(iconStyle.width).toBe(28);
    expect(iconStyle.height).toBe(28);
    expect(iconStyle.color).toBe(lightColors.text);
  });

  it("omits the redundant Free edition card", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview {...overviewProps()} isPremium={false} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("settings-edition-card")).toBeNull();
    expect(screen.queryByText("Private Offline · Free")).toBeNull();
    expect(screen.queryByText("Conversation & tools")).toBeNull();
    expect(screen.getByText("Voice & models")).toBeTruthy();
    expect(screen.getByText("Privacy & app")).toBeTruthy();
  });

  it("keeps Free focused on usable sections and routes upgrades through one action", () => {
    const onOpenPremium = jest.fn();
    const onOpenPage = jest.fn();
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <AntSettingsOverview
            {...overviewProps()}
            isPremium={false}
            onOpenPage={onOpenPage}
            onOpenPremium={onOpenPremium}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("settings-readiness-grid")).toBeNull();
    expect(
      screen.queryByTestId("settings-overview-row-connections"),
    ).toBeNull();
    fireEvent.press(screen.getByTestId("settings-premium-upgrade"));
    expect(onOpenPremium).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByTestId("settings-overview-row-data"));
    expect(onOpenPage).toHaveBeenCalledWith("data");
  });
});
