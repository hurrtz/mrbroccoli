import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { MainScreenTopBar } from "../../../src/screens/main/MainScreenTopBar";
import { lightColors } from "../../../src/theme/colors";

describe("MainScreenTopBar", () => {
  it.each([false, true])(
    "shows the canonical brand when compact is %s",
    (compact) => {
      const onOpenDrawer = jest.fn();
      const onOpenSettings = jest.fn();
      const screen = render(
        <MainScreenTopBar
          brandName="Mr Broccoli"
          colors={lightColors}
          compact={compact}
          drawerLabel="Conversations"
          onOpenDrawer={onOpenDrawer}
          onOpenSettings={onOpenSettings}
          onToggleDebugLog={jest.fn()}
          settingsLabel="Settings"
        />,
      );

      expect(screen.getByText("Mr Broccoli")).toBeTruthy();
      expect(
        StyleSheet.flatten(screen.getByText("Mr Broccoli").props.style)
          .fontSize,
      ).toBe(compact ? 14 : 26);
      expect(
        screen.getByLabelText("Conversations").props.accessibilityRole,
      ).toBe("button");
      expect(screen.getByLabelText("Settings").props.accessibilityRole).toBe(
        "button",
      );
      expect(screen.getByText("LOG")).toBeTruthy();

      const drawerButton = screen.getByLabelText("Conversations");
      const settingsButton = screen.getByLabelText("Settings");
      fireEvent.press(drawerButton);
      fireEvent.press(settingsButton);
      expect(onOpenDrawer).toHaveBeenCalledTimes(1);
      expect(onOpenSettings).toHaveBeenCalledTimes(1);

      expect(
        StyleSheet.flatten(
          screen.getByTestId("main-screen-title-slot").props.style,
        ),
      ).toEqual(
        expect.objectContaining({
          position: "absolute",
          left: 0,
          right: 0,
          alignItems: "center",
        }),
      );
    },
  );
});
