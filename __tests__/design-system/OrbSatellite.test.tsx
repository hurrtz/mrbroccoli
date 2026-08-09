import React from "react";
import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { MIN_ICON_TOUCH_TARGET } from "../../src/design-system/PhosphorIcon";
import { OrbSatellite } from "../../src/design-system/OrbSatellite";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

function renderSatellite(
  props: Partial<React.ComponentProps<typeof OrbSatellite>> = {},
) {
  return render(
    <ThemeProvider mode="light">
      <OrbSatellite icon="image" label="Image" testID="satellite" {...props} />
    </ThemeProvider>,
  );
}

describe("OrbSatellite", () => {
  it("keeps a 44pt target whatever the glyph measures", () => {
    const screen = renderSatellite();
    const style = StyleSheet.flatten(
      screen.getByTestId("satellite").props.style,
    );

    expect(style.width).toBe(MIN_ICON_TOUCH_TARGET);
    expect(style.height).toBe(MIN_ICON_TOUCH_TARGET);
  });

  it("reads as a button for a momentary action and a switch for a toggle", () => {
    expect(
      renderSatellite({ kind: "action" }).getByTestId("satellite").props
        .accessibilityRole,
    ).toBe("button");

    const toggle = renderSatellite({
      active: true,
      kind: "toggle",
    }).getByTestId("satellite");

    expect(toggle.props.accessibilityRole).toBe("switch");
    expect(toggle.props.accessibilityState.checked).toBe(true);
  });

  it("carries toggle state in the well, never in the label", () => {
    const off = renderSatellite({
      active: false,
      kind: "toggle",
      label: "Council",
    });
    const on = renderSatellite({
      active: true,
      kind: "toggle",
      label: "Council",
    });

    // The same word in both states: it sits under a 44pt target and has to
    // hold in nineteen languages, so the well is what changes. The label is
    // out of the accessibility tree because the control above it already
    // announces the word; announcing both would say it twice.
    expect(
      off.getByText("Council", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      on.getByText("Council", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      StyleSheet.flatten(on.getByTestId("satellite").props.style)
        .backgroundColor,
    ).toBe(lightColors.accentSoft);
    expect(
      StyleSheet.flatten(off.getByTestId("satellite").props.style)
        .backgroundColor,
    ).toBe("transparent");
  });

  it("rounds a toggle and squares an action so the two kinds differ", () => {
    const toggle = StyleSheet.flatten(
      renderSatellite({ kind: "toggle" }).getByTestId("satellite").props.style,
    );
    const action = StyleSheet.flatten(
      renderSatellite({ kind: "action" }).getByTestId("satellite").props.style,
    );

    expect(toggle.borderRadius).toBe(MIN_ICON_TOUCH_TARGET / 2);
    expect(action.borderRadius).toBe(12);
  });

  it("prefers an explicit accessible name over the terse visible label", () => {
    const screen = renderSatellite({
      accessibilityLabel: "Add image",
      label: "Image",
    });

    expect(screen.getByLabelText("Add image")).toBeTruthy();
  });
});
