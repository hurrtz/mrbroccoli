import React from "react";
import { act, fireEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { Toast } from "../../src/components/Toast";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
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

  it("announces its message and keeps actions at least 44 points tall", () => {
    const screen = renderWithProviders(
      <Toast
        message="Connection failed."
        onDismiss={jest.fn()}
        onRetry={jest.fn()}
        tone="danger"
        visible
      />,
    );

    expect(screen.getByText("Connection failed.").props).toEqual(
      expect.objectContaining({
        accessibilityLiveRegion: "assertive",
        accessibilityRole: "alert",
      }),
    );
    expect(
      StyleSheet.flatten(screen.getByLabelText("Retry").props.style).minHeight,
    ).toBe(44);
    expect(
      StyleSheet.flatten(screen.getByLabelText("Dismiss").props.style),
    ).toEqual(expect.objectContaining({ height: 44, width: 44 }));
  });

  it("waits behind a focused sheet before starting its dismissal clock", () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    const screen = renderWithProviders(
      <Toast
        message="Export finished."
        onDismiss={onDismiss}
        suspended
        visible
      />,
    );

    expect(screen.queryByTestId("toast")).toBeNull();
    act(() => jest.advanceTimersByTime(10_000));
    expect(onDismiss).not.toHaveBeenCalled();

    screen.rerender(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <Toast message="Export finished." onDismiss={onDismiss} visible />
        </LocalizationProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("toast")).toBeTruthy();
    act(() => jest.advanceTimersByTime(4_200));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
