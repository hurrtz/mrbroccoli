import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { IconAction } from "../../src/features/settings/settings-primitives/IconAction";
import { PremiumBand } from "../../src/features/settings/settings-primitives/PremiumBand";
import { RouteOptionRow } from "../../src/features/settings/settings-primitives/RouteOptionRow";
import { SettingsGroup } from "../../src/features/settings/settings-primitives/SettingsGroup";
import { SettingsRow } from "../../src/features/settings/settings-primitives/SettingsRow";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

jest.mock("../../src/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children, ...props }: React.PropsWithChildren<object>) =>
      React.createElement(View, props, children),
  };
});

jest.mock("react-native-gesture-handler", () => {
  const actual = jest.requireActual("react-native-gesture-handler");
  const React = require("react");
  const { View } = require("react-native");
  return {
    ...actual,
    Swipeable: ({
      children,
      renderRightActions,
    }: React.PropsWithChildren<{
      renderRightActions?: () => React.ReactNode;
    }>) =>
      React.createElement(View, null, children, renderRightActions?.() ?? null),
  };
});

function wrap(children: React.ReactNode) {
  return render(
    <ThemeProvider mode="light">
      <LocalizationProvider language="en">{children}</LocalizationProvider>
    </ThemeProvider>,
  );
}

describe("settings design primitives", () => {
  it("renders an inset group with its caption, rows, and footer", () => {
    const screen = wrap(
      <SettingsGroup
        testID="conversation-group"
        title="Conversation"
        footer="Choose how Mr Broccoli responds."
      >
        <SettingsRow label="Thinking" last />
      </SettingsGroup>,
    );

    expect(screen.getByText("Conversation")).toBeTruthy();
    expect(screen.getByText("Thinking")).toBeTruthy();
    expect(screen.getByText("Choose how Mr Broccoli responds.")).toBeTruthy();
    expect(screen.getByTestId("conversation-group")).toBeTruthy();
  });

  it("keeps a row action at 52pt while leaving nested controls interactive", () => {
    const onOpen = jest.fn();
    const onToggle = jest.fn();
    const screen = wrap(
      <>
        <SettingsRow
          testID="open-row"
          icon="robot"
          label="Thinking"
          value="2 models"
          onPress={onOpen}
        />
        <SettingsRow
          testID="control-row"
          label="Show transcript"
          last
          control={
            <Pressable testID="nested-control" onPress={onToggle}>
              <View />
            </Pressable>
          }
        />
      </>,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("open-row").props.style).minHeight,
    ).toBe(52);
    fireEvent.press(screen.getByTestId("open-row"));
    fireEvent.press(screen.getByTestId("nested-control"));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("expresses selected, locked, and removable route states accessibly", () => {
    const onSelect = jest.fn();
    const onRemove = jest.fn();
    const screen = wrap(
      <RouteOptionRow
        testID="local-route"
        label="On device"
        meta="Ready"
        selected
        onSelect={onSelect}
        onRemove={onRemove}
        removeLabel="Remove model"
      />,
    );

    const radio = screen.getByLabelText("On device");
    expect(radio.props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    fireEvent.press(radio);
    fireEvent.press(screen.getByLabelText("Remove model"));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("gives icon actions a 44pt target around a 36pt well", () => {
    const onPress = jest.fn();
    const screen = wrap(
      <IconAction
        testID="test-model"
        icon="egg"
        label="Test model"
        onPress={onPress}
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("test-model").props.style),
    ).toMatchObject({
      height: 44,
      width: 44,
    });
    expect(
      StyleSheet.flatten(screen.getByTestId("test-model-well").props.style),
    ).toMatchObject({ height: 36, width: 36 });
    fireEvent.press(screen.getByTestId("test-model"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("uses the premium gradient tokens and keeps its upgrade action operable", () => {
    const onPress = jest.fn();
    const screen = wrap(
      <PremiumBand
        testID="premium-band"
        premiumLabel="Premium"
        copy="Connect providers and add more routes."
        actionLabel="Upgrade"
        onPress={onPress}
      />,
    );

    expect(screen.getByTestId("premium-band").props.colors).toEqual([
      lightColors.premiumGradientSoftStart,
      lightColors.premiumGradientSoftMiddle,
      lightColors.premiumGradientSoftEnd,
    ]);
    fireEvent.press(screen.getByLabelText("Upgrade"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
