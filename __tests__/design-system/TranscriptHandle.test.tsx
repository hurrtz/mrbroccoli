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
        emptyLabel="No messages yet"
        onPress={jest.fn()}
        {...props}
      />
    </ThemeProvider>,
  );
}

describe("TranscriptHandle", () => {
  it("collapses to the empty state with no preview", () => {
    const screen = renderHandle({
      meta: "GPT-5 · 2 min ago",
      preview: "should not appear",
    });

    expect(screen.getByText("No messages yet")).toBeTruthy();
    expect(screen.queryByText("should not appear")).toBeNull();
  });

  it("shows the last reply's provenance and one line of it", () => {
    const screen = renderHandle({
      messageCount: 12,
      meta: "GPT-5 · 2 min ago",
      preview: "The tide turns at half past four.",
      accessibilityLabel: "Show transcript. 12 messages",
    });
    const preview = screen.getByText("The tide turns at half past four.");

    expect(screen.getByText("GPT-5 · 2 min ago")).toBeTruthy();
    expect(preview.props.numberOfLines).toBe(1);
  });

  it("always states the real count in the accessible name", () => {
    const screen = renderHandle({
      messageCount: 12,
      preview: "The tide turns.",
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
