import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { Toast } from "../../src/components/Toast";
import { renderWithProviders } from "../test-utils/renderWithProviders";

describe("Toast", () => {
  it("dismisses after starting a retry action", () => {
    const onDismiss = jest.fn();
    const onRetry = jest.fn();
    const screen = renderWithProviders(
      <Toast
        message="Speech transcription failed."
        onDismiss={onDismiss}
        onRetry={onRetry}
        visible
      />,
    );

    fireEvent.press(screen.getByText("Retry"));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onRetry.mock.invocationCallOrder[0]).toBeLessThan(
      onDismiss.mock.invocationCallOrder[0],
    );
  });
});
