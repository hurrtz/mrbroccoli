import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { TranscriptHandle } from "../../src/design-system/TranscriptHandle";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

function renderHandle(
  props: Partial<React.ComponentProps<typeof TranscriptHandle>> = {},
) {
  return render(
    <ThemeProvider mode="light">
      <TranscriptHandle
        accessibilityLabel="Show transcript. No messages yet."
        label="Transcript"
        onPress={jest.fn()}
        {...props}
      />
    </ThemeProvider>,
  );
}

describe("TranscriptHandle", () => {
  it("shows only the stable transcript label", () => {
    const screen = renderHandle();

    expect(screen.getByText("Transcript")).toBeTruthy();
    expect(screen.queryByText("No messages yet")).toBeNull();
  });

  it("always states the real count in the accessible name", () => {
    const screen = renderHandle({
      accessibilityLabel: "Show transcript. 12 messages",
    });
    const handle = screen.getByTestId("transcript-handle");

    expect(handle.props.accessibilityRole).toBe("button");
    expect(handle.props.accessibilityLabel).toBe(
      "Show transcript. 12 messages",
    );
  });

  it("rounds only its top corners and drops its bottom border", () => {
    const screen = renderHandle();
    const flat = StyleSheet.flatten(
      screen.getByTestId("transcript-handle").props.style,
    );

    expect(flat.borderTopLeftRadius).toBe(20);
    expect(flat.borderTopRightRadius).toBe(20);
    expect(flat.borderBottomLeftRadius).toBeUndefined();
    expect(flat.borderBottomWidth).toBe(0);
    expect(flat.backgroundColor).toBe(lightColors.surfaceRaised);
  });

  it("opens the transcript", () => {
    const onPress = jest.fn();
    const screen = renderHandle({ onPress });

    fireEvent.press(screen.getByTestId("transcript-handle"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
