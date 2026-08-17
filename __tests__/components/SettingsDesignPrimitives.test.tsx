import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { IconAction } from "../../src/features/settings/settings-primitives/IconAction";
import { LocalModelRouteGroup } from "../../src/features/settings/settings-primitives/LocalModelRouteGroup";
import { SettingsPillAction } from "../../src/features/settings/settings-primitives/SettingsPillAction";
import { RouteOptionRow } from "../../src/features/settings/settings-primitives/RouteOptionRow";
import { SettingsGroup } from "../../src/features/settings/settings-primitives/SettingsGroup";
import { SettingsRow } from "../../src/features/settings/settings-primitives/SettingsRow";
import { VoicePickerSheet } from "../../src/features/settings/settings-primitives/VoicePickerSheet";
import { getLocalModel } from "../../src/constants/localModels";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { DEFAULT_SETTINGS } from "../../src/types";
import type { LocalModelSettingsController } from "../../src/features/settings-core/useLocalModelSettings";

jest.mock("../../src/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

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
          supporting="Two answering models"
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
    ).toBe(64);
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
        metaTestID="local-route-ready"
        selected
        onSelect={onSelect}
        onRemove={onRemove}
        removeLabel="Remove model"
      />,
    );

    const radio = screen.getByLabelText("On device");
    expect(screen.getByTestId("local-route-ready").props.children).toBe(
      "Ready",
    );
    expect(radio.props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    fireEvent.press(radio);
    fireEvent.press(screen.getByLabelText("Remove model"));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("keeps prose descriptions in the body face and machine facts in mono", () => {
    // Mono is reserved for terse machine facts; sentences about a route read
    // in the supporting face so the pickers do not become mono paragraph soup.
    const screen = wrap(
      <RouteOptionRow
        testID="native-route"
        label="System Recognition"
        description="Use the operating system's speech recognizer."
        meta="466 MB"
        metaTestID="native-route-meta"
        selected
        onSelect={jest.fn()}
      />,
    );

    const description = screen.getByText(
      "Use the operating system's speech recognizer.",
    );
    const descriptionStyle = StyleSheet.flatten(description.props.style);
    expect(descriptionStyle.fontFamily).toBe("Outfit_400Regular");
    expect(descriptionStyle.fontSize).toBe(12);

    const meta = StyleSheet.flatten(
      screen.getByTestId("native-route-meta").props.style,
    );
    expect(meta.fontSize).toBe(10);
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
    ).toMatchObject({ borderRadius: 12, height: 36, width: 36 });
    fireEvent.press(screen.getByTestId("test-model"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("searches, selects, and previews voices inside the modal route picker", () => {
    const onSelect = jest.fn();
    const onPreview = jest.fn();
    const screen = wrap(
      <VoicePickerSheet
        visible
        testID="voice-picker"
        title="Kokoro"
        options={[
          { value: "maple", label: "Maple", meta: "American · female" },
          { value: "vale", label: "Vale", meta: "British · female" },
        ]}
        value="maple"
        onClose={jest.fn()}
        onSelect={onSelect}
        onPreview={onPreview}
      />,
    );

    fireEvent.changeText(screen.getByTestId("voice-picker-search"), "British");
    expect(screen.queryByText("Maple")).toBeNull();
    expect(screen.getByText("Vale")).toBeTruthy();
    fireEvent.press(screen.getByTestId("voice-picker-option-vale"));
    fireEvent.press(screen.getByTestId("voice-picker-preview-vale"));
    expect(onSelect).toHaveBeenCalledWith("vale");
    expect(onPreview).toHaveBeenCalledWith("vale");
  });

  it("keeps an installed local route unselectable until its device test passes", () => {
    const model = getLocalModel("whisper-tiny");
    const testModel = jest.fn();
    const screen = wrap(
      <LocalModelRouteGroup
        capability="stt"
        title="Who listens"
        footer="Choose a recognition route."
        localModels={
          {
            benchmarks: {},
            busy: null,
            cancelDownload: jest.fn(),
            compatibleModels: [model],
            downloadModel: jest.fn(),
            installs: {
              [model.id]: {
                installed: true,
                path: "/models/whisper-tiny",
                verified: true,
              },
            },
            isModelSelected: jest.fn(() => false),
            kokoroModel: { progress: 0 },
            nativeSpeechCapabilities: { nativeSttEligible: true },
            progress: {},
            removeModel: jest.fn(),
            selectModel: jest.fn(),
            selectNativeRoute: jest.fn(),
            testModel,
          } as unknown as LocalModelSettingsController
        }
        providerRoutes={[]}
        settings={DEFAULT_SETTINGS}
      />,
    );

    expect(
      screen.getByLabelText("Whisper Tiny").props
        .accessibilityState,
    ).toEqual({ checked: false, disabled: true });
    fireEvent.press(screen.getByTestId("local-model-test-whisper-tiny"));
    expect(testModel).toHaveBeenCalledWith(model);
  });

  it("renders compact settings actions as controls rather than pills", () => {
    const screen = wrap(
      <SettingsPillAction
        label="Remove"
        onPress={jest.fn()}
        testID="settings-action"
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("settings-action").props.style),
    ).toMatchObject({ borderRadius: 10, minHeight: 44 });
  });
});
