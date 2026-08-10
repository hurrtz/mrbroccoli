import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { RuntimeReadiness } from "../../src/features/settings/settings-primitives/RuntimeReadiness";
import type { SettingsReadiness } from "../../src/features/settings-core/readiness";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { darkColors, lightColors } from "../../src/theme/colors";

function readinessOf(
  think: SettingsReadiness["think"]["state"],
  listen: SettingsReadiness["listen"]["state"] = "ready",
  speak: SettingsReadiness["speak"]["state"] = "ready",
  search: SettingsReadiness["search"]["state"] = "ready",
): SettingsReadiness {
  const summaryKey = {
    ready: "settingsReadinessReady",
    attention: "settingsReadinessNeedsAttention",
    broken: "settingsReadinessBroken",
    off: "settingsReadinessOff",
  } as const;

  return {
    think: { state: think, summaryKey: summaryKey[think] },
    listen: { state: listen, summaryKey: summaryKey[listen] },
    speak: { state: speak, summaryKey: summaryKey[speak] },
    search: { state: search, summaryKey: summaryKey[search] },
  };
}

function renderLine(
  readiness: SettingsReadiness,
  onSelect = jest.fn(),
  mode: "light" | "dark" = "light",
) {
  const screen = render(
    <ThemeProvider mode={mode}>
      <LocalizationProvider language="en">
        <RuntimeReadiness onSelect={onSelect} readiness={readiness} />
      </LocalizationProvider>
    </ThemeProvider>,
  );
  return { onSelect, screen };
}

function dotStyle(
  screen: ReturnType<typeof renderLine>["screen"],
  step: string,
) {
  return StyleSheet.flatten(
    screen.getByTestId(`settings-readiness-dot-${step}`).props.style,
  );
}

describe("RuntimeReadiness", () => {
  it("shows the four capabilities as one line of dots and labels", () => {
    const { screen } = renderLine(readinessOf("ready"));

    for (const label of ["Think", "Listen", "Speak", "Search"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it("fills ready green and broken red; attention and off stay hollow", () => {
    const { screen } = renderLine(
      readinessOf("ready", "attention", "broken", "off"),
    );

    const think = dotStyle(screen, "think");
    expect(think.backgroundColor).toBe(lightColors.success);
    expect(think.borderColor).toBe(lightColors.success);

    const listen = dotStyle(screen, "listen");
    expect(listen.backgroundColor).toBe("transparent");
    expect(listen.borderColor).toBe(lightColors.premium);

    const speak = dotStyle(screen, "speak");
    expect(speak.backgroundColor).toBe(lightColors.danger);

    const search = dotStyle(screen, "search");
    expect(search.backgroundColor).toBe("transparent");
    expect(search.borderColor).toBe(lightColors.textMuted);
  });

  it("keeps every label in body ink, never tinted to match its dot", () => {
    const { screen } = renderLine(
      readinessOf("ready", "attention", "broken", "off"),
      jest.fn(),
      "dark",
    );

    for (const label of ["Think", "Listen", "Speak", "Search"]) {
      expect(
        StyleSheet.flatten(screen.getByText(label).props.style).color,
      ).toBe(darkColors.text);
    }
  });

  it("gives every capability a 44pt target that opens its setting", () => {
    const { onSelect, screen } = renderLine(readinessOf("ready"));
    const step = screen.getByTestId("settings-readiness-listen");

    expect(StyleSheet.flatten(step.props.style).minHeight).toBe(44);
    fireEvent.press(step);
    expect(onSelect).toHaveBeenCalledWith("listen");
  });

  it("carries the state word in the accessible name", () => {
    const { screen } = renderLine(readinessOf("ready", "attention"));
    const listen = screen.getByTestId("settings-readiness-listen");

    expect(listen.props.accessibilityLabel).toBe("Listen. Attention.");
    expect(listen.props.accessibilityHint).toBe("Open Listen");
  });
});
