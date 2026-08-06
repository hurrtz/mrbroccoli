import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { Button, Modal } from "../../src/design-system/NativeControls";
import { ThemeProvider } from "../../src/theme/ThemeContext";

function renderControl(element: React.ReactElement) {
  return render(<ThemeProvider mode="light">{element}</ThemeProvider>);
}

describe("NativeControls", () => {
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
});
