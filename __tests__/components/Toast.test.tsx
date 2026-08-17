import React from "react";
import { act, fireEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

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

    const toast = StyleSheet.flatten(screen.getByTestId("toast").props.style);
    expect(toast).toMatchObject({
      borderRadius: 14,
      gap: 12,
      padding: 14,
    });
    expect(toast.paddingLeft).toBeUndefined();
    expect(
      StyleSheet.flatten(screen.getByTestId("toast-icon").props.style),
    ).toMatchObject({
      borderRadius: 17,
      height: 34,
      width: 34,
    });
    expect(
      StyleSheet.flatten(screen.getByTestId("toast-icon").props.style)
        .marginRight,
    ).toBeUndefined();
    expect(
      StyleSheet.flatten(screen.getByTestId("toast-actions").props.style)
        .marginLeft,
    ).toBeUndefined();
  });

  it("stays visible above a focused sheet and keeps its dismissal clock", () => {
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

    expect(screen.getByTestId("toast")).toBeTruthy();
    act(() => jest.advanceTimersByTime(4_200));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
