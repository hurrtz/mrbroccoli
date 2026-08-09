import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { MIN_ICON_TOUCH_TARGET } from "../../../src/design-system/PhosphorIcon";
import { RuntimeReadiness } from "../../../src/features/settings/settings-primitives/RuntimeReadiness";
import type {
  SettingsReadiness,
  SettingsReadinessState,
} from "../../../src/features/settings-core/readiness";
import { ThemeProvider } from "../../../src/theme/ThemeContext";
import { darkColors, lightColors } from "../../../src/theme/colors";
import { en } from "../../../src/i18n/locales/en";

const SUMMARY_KEY = {
  attention: "settingsReadinessNeedsAttention",
  broken: "settingsReadinessBroken",
  off: "settingsReadinessOff",
  ready: "settingsReadinessReady",
} as const;

function readiness(
  states: Partial<Record<keyof SettingsReadiness, SettingsReadinessState>>,
): SettingsReadiness {
  const build = (state: SettingsReadinessState) => ({
    state,
    summaryKey: SUMMARY_KEY[state],
  });

  return {
    listen: build(states.listen ?? "off"),
    search: build(states.search ?? "off"),
    speak: build(states.speak ?? "off"),
    think: build(states.think ?? "off"),
  };
}

const t = ((key: keyof typeof en) => en[key]) as never;

function renderReadiness(
  props: Partial<React.ComponentProps<typeof RuntimeReadiness>> = {},
  isDark = false,
) {
  return render(
    <ThemeProvider mode={isDark ? "dark" : "light"}>
      <RuntimeReadiness
        readiness={readiness({
          listen: "attention",
          search: "off",
          speak: "broken",
          think: "ready",
        })}
        t={t}
        {...props}
      />
    </ThemeProvider>,
  );
}

describe("RuntimeReadiness", () => {
  it("shows the four capabilities on one line", () => {
    const screen = renderReadiness();

    for (const label of ["Think", "Listen", "Speak", "Search"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it("is not a stepper: nothing connects the four", () => {
    // The chain of circles joined by hairlines promised a sequence. These are
    // independent capabilities, so there are no connectors to find.
    const screen = renderReadiness();
    const line = screen.getByTestId("runtime-readiness");

    expect(line.props.children).toHaveLength(4);
  });

  it.each([
    ["ready", true],
    ["broken", true],
    ["attention", false],
    ["off", false],
  ] as const)(
    "separates %s from the others without colour",
    (state, expectedFill) => {
      // Filled versus hollow is the second channel, so the four states are
      // distinguishable for anyone who cannot separate the hues.
      const screen = renderReadiness({ readiness: readiness({ think: state }) });
      const dot = StyleSheet.flatten(
        screen.getByTestId("runtime-readiness-dot-think").props.style,
      );

      expect(dot.backgroundColor === "transparent").toBe(!expectedFill);
      expect(dot.borderWidth).toBe(1.5);
    },
  );

  it.each([
    ["light", false, lightColors],
    ["dark", true, darkColors],
  ] as const)("tints each state in %s", (_mode, isDark, colors) => {
    const screen = renderReadiness({}, isDark);
    const colourOf = (step: string) =>
      StyleSheet.flatten(
        screen.getByTestId(`runtime-readiness-dot-${step}`).props.style,
      ).borderColor;

    expect(colourOf("think")).toBe(colors.success);
    expect(colourOf("listen")).toBe(colors.premium);
    expect(colourOf("speak")).toBe(colors.danger);
    expect(colourOf("search")).toBe(colors.textMuted);
  });

  it("keeps every label in body ink, never tinted to match its dot", () => {
    const screen = renderReadiness();

    for (const label of ["Think", "Listen", "Speak", "Search"]) {
      expect(StyleSheet.flatten(screen.getByText(label).props.style).color).toBe(
        lightColors.text,
      );
    }
  });

  it("speaks the state it draws", () => {
    const screen = renderReadiness();

    // Both halves come from one status, so they cannot disagree.
    expect(screen.getByLabelText("Think. Ready.")).toBeTruthy();
    expect(screen.getByLabelText("Listen. Attention.")).toBeTruthy();
    expect(screen.getByLabelText("Speak. Broken.")).toBeTruthy();
    expect(screen.getByLabelText("Search. Off.")).toBeTruthy();
  });

  it("gives every capability a 44pt target", () => {
    const screen = renderReadiness();

    for (const step of ["think", "listen", "speak", "search"]) {
      expect(
        StyleSheet.flatten(
          screen.getByTestId(`runtime-readiness-${step}`).props.style,
        ).height,
      ).toBe(MIN_ICON_TOUCH_TARGET);
    }
  });

  it("opens the setting behind a capability", () => {
    const onSelect = jest.fn();
    const screen = renderReadiness({ onSelect });

    fireEvent.press(screen.getByTestId("runtime-readiness-speak"));

    expect(onSelect).toHaveBeenCalledWith("speak");
  });

  it("keeps the targets when there is nothing behind them", () => {
    // Inert, but the layout must not move between the two states.
    const screen = renderReadiness({ onSelect: undefined });

    expect(
      StyleSheet.flatten(
        screen.getByTestId("runtime-readiness-think").props.style,
      ).height,
    ).toBe(MIN_ICON_TOUCH_TARGET);
  });
});
