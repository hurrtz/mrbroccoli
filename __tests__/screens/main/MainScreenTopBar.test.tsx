import React from "react";
import { StyleSheet } from "react-native";
import { render } from "@testing-library/react-native";

import { MainScreenTopBar } from "../../../src/screens/main/MainScreenTopBar";
import { lightColors } from "../../../src/theme/colors";

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, `icon:${name}`);
  },
}));

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
    expect(screen.getByLabelText("Conversations")).toBeTruthy();
    expect(screen.getByLabelText("Settings")).toBeTruthy();
    expect(screen.getByText("icon:sidebar")).toBeTruthy();
    expect(screen.getByText("icon:settings")).toBeTruthy();
    expect(screen.getByText("LOG")).toBeTruthy();
    expect(screen.queryByText("icon:sliders")).toBeNull();

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
