import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { OrbSatellite } from "../../src/design-system/OrbSatellite";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

function renderSatellite(
  props: Partial<React.ComponentProps<typeof OrbSatellite>> = {},
) {
  return render(
    <ThemeProvider mode="light">
      <OrbSatellite icon="image" label="Image" {...props} />
    </ThemeProvider>,
  );
}

describe("OrbSatellite", () => {
  it("keeps a 44pt target under a smaller glyph", () => {
    const screen = renderSatellite();
    const well = StyleSheet.flatten(
      screen.getByTestId("orb-satellite-image").props.style,
    );

    expect(well.width).toBe(44);
    expect(well.height).toBe(44);
  });

  it("renders momentary actions borderless on a button role", () => {
    const screen = renderSatellite({ onPress: jest.fn() });
    const well = screen.getByTestId("orb-satellite-image");

    expect(well.props.accessibilityRole).toBe("button");
    expect(StyleSheet.flatten(well.props.style).borderColor).toBe(
      "transparent",
    );
  });

  it("gives toggles a squircle well that carries the state", () => {
    const screen = renderSatellite({
      icon: "council",
      label: "Council",
      kind: "toggle",
      active: true,
    });
    const well = screen.getByTestId("orb-satellite-council");
    const flat = StyleSheet.flatten(well.props.style);

    expect(well.props.accessibilityRole).toBe("switch");
    expect(well.props.accessibilityState).toEqual(
      expect.objectContaining({ checked: true, disabled: false }),
    );
    // Squircle like every other control: the state reads from the
    // border and fill, never from the shape.
    expect(flat.borderRadius).toBe(12);
    expect(flat.borderColor).toBe(lightColors.accent);
    expect(flat.backgroundColor).toBe(lightColors.accentSoft);
  });

  it("keeps the label neutral in both toggle states", () => {
    const screen = renderSatellite({
      icon: "council",
      label: "Council",
      kind: "toggle",
      active: true,
    });
    const label = screen.getByText("Council");

    expect(StyleSheet.flatten(label.props.style).color).toBe(
      lightColors.textSecondary,
    );
  });

  it("prefers the explicit accessible name over the terse label", () => {
    const screen = renderSatellite({
      accessibilityLabel: "Add image",
      onPress: jest.fn(),
    });

    expect(
      screen.getByTestId("orb-satellite-image").props.accessibilityLabel,
    ).toBe("Add image");
  });

  it("fires its action", () => {
    const onPress = jest.fn();
    const screen = renderSatellite({ onPress });

    fireEvent.press(screen.getByTestId("orb-satellite-image"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
