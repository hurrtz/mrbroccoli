import React from "react";
import { StyleSheet, Text } from "react-native";
import { render } from "@testing-library/react-native";

import { SettingsOverview } from "../../src/components/settings/SettingsOverview";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";
import type { SettingsReadiness } from "../../src/components/settings/readiness";

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, name);
  },
}));

const readiness: SettingsReadiness = {
  think: { state: "ready", summaryKey: "settingsReadinessReady" },
  listen: { state: "ready", summaryKey: "settingsReadinessReady" },
  speak: { state: "off", summaryKey: "settingsReadinessOff" },
  search: { state: "attention", summaryKey: "settingsReadinessNeedsAttention" },
};

describe("SettingsOverview", () => {
  it("renders readiness success as a color-coded one-line chip without success copy", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <SettingsOverview readiness={readiness} onOpenPage={jest.fn()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const thinkChip = screen.getByLabelText("Think: Ready");
    const speakChip = screen.getByLabelText("Speak: Off");

    expect(StyleSheet.flatten(thinkChip.props.style).backgroundColor).toBe(
      `${lightColors.success}22`,
    );
    expect(screen.getByText("Think").props.numberOfLines).toBe(1);
    expect(thinkChip.findAllByType(Text)).toHaveLength(1);
    expect(speakChip.findAllByType(Text)).toHaveLength(1);
    expect(screen.queryByText("Runtime Readiness")).toBeNull();
    expect(screen.queryByText("Ready")).toBeNull();
    expect(screen.queryByText("Off")).toBeNull();
    expect(screen.queryByText("Attention")).toBeNull();
    expect(screen.queryByText("Broken")).toBeNull();
  });

  it("shows one guided-setup icon and no trailing launch icon", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <SettingsOverview
            readiness={readiness}
            onOpenPage={jest.fn()}
            onOpenSetupGuide={jest.fn()}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getAllByText("icon:compass")).toHaveLength(1);
    expect(screen.queryByText("icon:arrow-up-right")).toBeNull();
  });

  it("shows larger section icons without bordered icon containers", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <SettingsOverview readiness={readiness} onOpenPage={jest.fn()} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("settings-overview-icon-connections").props.style,
      ),
    ).toEqual(expect.objectContaining({ borderWidth: 0 }));
    expect(
      StyleSheet.flatten(screen.getByTestId("icon-key").props.style).fontSize,
    ).toBe(24);
    expect(
      StyleSheet.flatten(screen.getByTestId("icon-key").props.style).color,
    ).toBe(lightColors.text);
  });
});
