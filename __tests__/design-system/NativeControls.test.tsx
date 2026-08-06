import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { act, fireEvent, render } from "@testing-library/react-native";

const mockIsReduceMotionEnabled = jest.fn().mockResolvedValue(false);

jest.mock(
  "react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo",
  () => ({
    __esModule: true,
    default: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      isReduceMotionEnabled: () => mockIsReduceMotionEnabled(),
    },
  }),
);

jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  const mockedUseWindowDimensions = jest.fn(() => ({
    fontScale: 1,
    height: 844,
    scale: 3,
    width: 390,
  }));

  return new Proxy(actual, {
    get(target, property, receiver) {
      return property === "useWindowDimensions"
        ? mockedUseWindowDimensions
        : Reflect.get(target, property, receiver);
    },
  });
});

import { Button, Modal } from "../../src/design-system/NativeControls";
import { ThemeProvider } from "../../src/theme/ThemeContext";

const mockUseWindowDimensions = jest.mocked(useWindowDimensions);

function setViewport(width: number, height: number) {
  mockUseWindowDimensions.mockReturnValue({
    fontScale: 1,
    height,
    scale: 3,
    width,
  });
}

function renderControl(element: React.ReactElement) {
  return render(<ThemeProvider mode="light">{element}</ThemeProvider>);
}

describe("NativeControls", () => {
  afterEach(() => {
    // Reset safe area insets mock to default zero insets after each test
    const { useSafeAreaInsets } = require("react-native-safe-area-context");
    jest.mocked(useSafeAreaInsets).mockReturnValue({
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    });
  });
  it("exposes a disabled loading button with a progress indicator", () => {
    const onPress = jest.fn();
    const screen = renderControl(
      <Button loading onPress={onPress}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button.props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });
    expect(screen.getByTestId("native-control-loading")).toBeTruthy();
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders dialog actions and dispatches the selected action", () => {
    const onDone = jest.fn();
    const screen = renderControl(
      <Modal
        visible
        title="Details"
        footer={[{ text: "Done", onPress: onDone }]}
      >
        Content
      </Modal>,
    );

    expect(screen.getByRole("header").props.children).toBe("Details");
    fireEvent.press(screen.getByText("Done"));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("renders an inviting success action without changing its semantics", () => {
    const screen = renderControl(
      <Modal
        visible
        footer={[{ text: "Start", tone: "success", onPress: jest.fn() }]}
      >
        Ready
      </Modal>,
    );

    const action = screen.getByRole("button", { name: "Start" });
    expect(action.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: "#059669" }),
      ]),
    );
  });

  it("keeps footer actions reachable when dialog content exceeds the card cap", () => {
    // Regression: on small windows (iPad compatibility mode) an oversized body
    // used to push the footer actions off-screen instead of shrinking.
    const screen = renderControl(
      <Modal
        visible
        title="Tall dialog"
        footer={[{ text: "Buy", onPress: jest.fn() }]}
      >
        Content
      </Modal>,
    );

    const card = screen.getByTestId("native-dialog-card");
    expect(StyleSheet.flatten(card.props.style)).toMatchObject({
      overflow: "hidden",
    });
    const body = screen.getByTestId("native-dialog-body");
    expect(StyleSheet.flatten(body.props.style)).toMatchObject({
      flexShrink: 1,
    });
  });

  it("disables a loading dialog action while showing progress", () => {
    const onExport = jest.fn();
    const screen = renderControl(
      <Modal
        visible
        footer={[{ text: "Export", loading: true, onPress: onExport }]}
      >
        Content
      </Modal>,
    );

    const action = screen
      .getAllByRole("button")
      .find((button) => button.props.accessibilityState?.busy);
    expect(action).toBeDefined();
    expect(action!.props.accessibilityState).toEqual({
      busy: true,
      disabled: true,
    });
    expect(screen.getByTestId("native-dialog-action-loading")).toBeTruthy();
    fireEvent.press(action!);
    expect(onExport).not.toHaveBeenCalled();
  });

  it("pins the sheet layout to the bottom and caps it at 85% of the window", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxHeight).toBeCloseTo(844 * 0.85);
    expect(card.width).toBe("100%");
    expect(card.maxWidth).toBe("100%");
    expect(card.borderBottomLeftRadius).toBe(0);
    expect(card.borderBottomRightRadius).toBe(0);

    const overlay = StyleSheet.flatten(
      screen.getByTestId("native-dialog-overlay").props.style,
    );
    expect(overlay.justifyContent).toBe("flex-end");
    expect(overlay.padding).toBe(0);
  });

  it("keeps the centred dialog in landscape even when the sheet is requested", () => {
    setViewport(844, 390);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxWidth).toBe(560);
    expect(card.maxHeight).toBe("82%");

    const overlay = StyleSheet.flatten(
      screen.getByTestId("native-dialog-overlay").props.style,
    );
    expect(overlay.justifyContent).toBe("center");
  });

  it("leaves the default dialog layout untouched", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible title="Details">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxWidth).toBe(560);
    expect(card.maxHeight).toBe("82%");
  });

  it("keeps the sheet backdrop out of the accessibility tree", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const overlay = screen.getByTestId("native-dialog-overlay");
    expect(overlay.props.accessibilityViewIsModal).toBe(true);

    const backdrop = screen.getByTestId("native-dialog-backdrop");
    expect(backdrop.props.accessible).toBe(false);
    expect(backdrop.props.importantForAccessibility).toBe("no");
  });

  it("caps the sheet at window height minus top inset when insets exceed 85% threshold", () => {
    // With insets.top = 200 and height = 844:
    // Math.min(844 * 0.85, 844 - 200) => Math.min(717.4, 644) => 644
    const { useSafeAreaInsets } = require("react-native-safe-area-context");
    jest.mocked(useSafeAreaInsets).mockReturnValueOnce({
      bottom: 0,
      left: 0,
      right: 0,
      top: 200,
    });

    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxHeight).toBe(644);
  });

  it("keeps the sheet mounted until the closing animation finishes", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(false);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("native-dialog-card")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByTestId("native-dialog-card")).toBeNull();
    jest.useRealTimers();
  });

  it("keeps the sheet mounted when it is reopened mid-exit", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(false);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByTestId("native-dialog-card")).toBeTruthy();
    jest.useRealTimers();
  });

  it("unmounts the sheet immediately when reduce motion is enabled", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(true);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {});

    expect(screen.queryByTestId("native-dialog-card")).toBeNull();
    jest.useRealTimers();
  });
});
