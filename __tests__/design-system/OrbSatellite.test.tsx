import React from "react";
import { Image, StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { OrbSatellite } from "../../src/design-system/OrbSatellite";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

jest.mock("../../src/design-system/PhosphorIcon", () => ({
  MIN_ICON_TOUCH_TARGET: 44,
  PhosphorIcon: ({
    color,
    name,
    weight = "regular",
  }: {
    color: string;
    name: string;
    weight?: string;
  }) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, {
      color,
      testID: `phosphor-icon-${name}`,
      weight,
    });
  },
}));

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
    expect(StyleSheet.flatten(well.props.style).borderWidth).toBeUndefined();
    expect(
      StyleSheet.flatten(well.props.style).backgroundColor,
    ).toBeUndefined();
  });

  it("gives active toggles a filled accent glyph and matching label", () => {
    const screen = renderSatellite({
      icon: "council",
      label: "Council",
      kind: "toggle",
      active: true,
    });
    const well = screen.getByTestId("orb-satellite-council");
    const icon = screen.getByTestId("phosphor-icon-council", {
      includeHiddenElements: true,
    });

    expect(well.props.accessibilityRole).toBe("switch");
    expect(well.props.accessibilityState).toEqual(
      expect.objectContaining({ checked: true, disabled: false }),
    );
    expect(icon.props.weight).toBe("fill");
    expect(icon.props.color).toBe(lightColors.accent);
    expect(
      StyleSheet.flatten(screen.getByText("Council").props.style).color,
    ).toBe(lightColors.accent);
  });

  it("keeps inactive toggles borderless and neutral", () => {
    const screen = renderSatellite({
      icon: "council",
      label: "Council",
      kind: "toggle",
      onPress: jest.fn(),
    });
    expect(
      StyleSheet.flatten(
        screen.getByTestId("orb-satellite-council").props.style,
      ).backgroundColor,
    ).toBeUndefined();
    expect(
      screen.getByTestId("phosphor-icon-council", {
        includeHiddenElements: true,
      }).props.color,
    ).toBe(lightColors.textSecondary);
    expect(
      StyleSheet.flatten(screen.getByText("Council").props.style).color,
    ).toBe(lightColors.textSecondary);
  });

  it("replaces the Image glyph with a three-layer attachment deck", () => {
    const screen = renderSatellite({
      label: "4 images",
      thumbnails: [
        "file://1.jpg",
        "file://2.jpg",
        "file://3.jpg",
        "file://4.jpg",
      ],
    });

    expect(screen.getByTestId("orb-satellite-image-deck")).toBeTruthy();
    expect(
      screen.queryByTestId("phosphor-icon-image", {
        includeHiddenElements: true,
      }),
    ).toBeNull();
    expect(screen.UNSAFE_getAllByType(Image)).toHaveLength(3);
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
