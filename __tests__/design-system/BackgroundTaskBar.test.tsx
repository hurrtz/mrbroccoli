import React from "react";
import { StyleSheet } from "react-native";

import { BackgroundTaskBar } from "../../src/design-system/BackgroundTaskBar";
import { lightColors, withAlpha } from "../../src/theme/colors";
import { renderWithProviders } from "../test-utils/renderWithProviders";

describe("BackgroundTaskBar", () => {
  it("tints its border and end-state background from the tone ink", () => {
    const { getByTestId } = renderWithProviders(
      <BackgroundTaskBar
        accessibilityLabel="On-device install stopped"
        onPress={jest.fn()}
        title="On-device install stopped"
        tone="danger"
      />,
    );

    const bar = StyleSheet.flatten(
      getByTestId("background-task-bar").props.style,
    );
    expect(bar.borderColor).toBe(withAlpha(lightColors.danger, 0.3));
    expect(bar.backgroundColor).toBe(withAlpha(lightColors.danger, 0.09));
  });

  it("keeps the progress tone on the accent-soft surface with a tinted track", () => {
    const { getByTestId } = renderWithProviders(
      <BackgroundTaskBar
        accessibilityLabel="Installing"
        fraction={0.42}
        onPress={jest.fn()}
        title="Installing"
        tone="progress"
      />,
    );

    const bar = StyleSheet.flatten(
      getByTestId("background-task-bar").props.style,
    );
    expect(bar.backgroundColor).toBe(lightColors.accentSoft);
    expect(
      StyleSheet.flatten(getByTestId("background-task-bar-fill").props.style)
        .width,
    ).toBe("42%");
  });
});
