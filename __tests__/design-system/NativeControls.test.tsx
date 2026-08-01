import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import {
  Button,
  Modal,
} from "../../src/design-system/NativeControls";
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
});
