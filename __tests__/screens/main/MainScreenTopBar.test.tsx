import React from "react";
import { StyleSheet } from "react-native";
import { render } from "@testing-library/react-native";

import { MainScreenTopBar } from "../../../src/screens/main/MainScreenTopBar";
import { lightColors } from "../../../src/theme/colors";

describe("MainScreenTopBar", () => {
  it.each([false, true])("shows the localized brand when compact is %s", (compact) => {
    const screen = render(
      <MainScreenTopBar
        brandName="Mr. Brokkoli"
        colors={lightColors}
        compact={compact}
        drawerLabel="Conversations"
        onOpenDrawer={jest.fn()}
        onOpenSettings={jest.fn()}
        onToggleDebugLog={jest.fn()}
        settingsLabel="Settings"
      />,
    );

    expect(screen.getByText("Mr. Brokkoli")).toBeTruthy();
    expect(
      screen.getByLabelText("Conversations").props.accessibilityRole,
    ).toBe("button");
    expect(screen.getByLabelText("Settings").props.accessibilityRole).toBe(
      "button",
    );
    expect(screen.getByText("LOG")).toBeTruthy();

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
  });
});
