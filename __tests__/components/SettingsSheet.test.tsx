import React from "react";
import { Modal as RNModal, StyleSheet, Text } from "react-native";
import { fireEvent } from "@testing-library/react-native";

import { SettingsSheet } from "../../src/features/settings/settings-primitives/SettingsSheet";
import { lightColors } from "../../src/theme/colors";
import { renderWithProviders } from "../test-utils/renderWithProviders";

describe("SettingsSheet", () => {
  function renderSheet(onClose = jest.fn()) {
    const screen = renderWithProviders(
      <SettingsSheet
        onClose={onClose}
        testID="settings-sheet"
        title="Voice settings"
        visible
      >
        <Text>Content</Text>
      </SettingsSheet>,
    );
    return { onClose, screen };
  }

  it("mounts a completed backdrop and animates only the sheet card", () => {
    const { screen } = renderSheet();
    const overlay = StyleSheet.flatten(
      screen.getByTestId("native-dialog-overlay").props.style,
    );

    expect(screen.UNSAFE_getByType(RNModal).props.animationType).toBe("none");
    expect(overlay.backgroundColor).toBe(lightColors.overlay);
    expect(overlay.opacity).toBeUndefined();
  });

  it("uses a centred transcript-style headline and a 44pt pull target", () => {
    const { onClose, screen } = renderSheet();
    const headline = StyleSheet.flatten(
      screen.getByText("Voice settings").props.style,
    );
    const handle = screen.getByTestId("settings-sheet-header-handle");

    expect(headline).toEqual(
      expect.objectContaining({
        fontFamily: "UnicaOne_400Regular",
        fontSize: 17,
        lineHeight: 22,
        textAlign: "center",
      }),
    );
    expect(StyleSheet.flatten(handle.props.style).minHeight).toBe(44);
    expect(handle.props.accessibilityRole).toBe("button");

    fireEvent.press(handle);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
