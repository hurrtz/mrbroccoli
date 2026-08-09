import React from "react";
import { render } from "@testing-library/react-native";

import { TranscriptHandle } from "../../src/design-system/TranscriptHandle";
import { ThemeProvider } from "../../src/theme/ThemeContext";

const copy = {
  accessibilityLabel: "Show transcript. 12 messages",
  empty: "No messages yet",
  emptyAccessibilityLabel: "Show transcript. No messages yet.",
};

function renderHandle(
  props: Partial<React.ComponentProps<typeof TranscriptHandle>> = {},
) {
  return render(
    <ThemeProvider mode="light">
      <TranscriptHandle copy={copy} {...props} />
    </ThemeProvider>,
  );
}

describe("TranscriptHandle", () => {
  it("collapses to the empty state and drops the preview at zero", () => {
    const screen = renderHandle({
      messageCount: 0,
      meta: "GPT-5 · 2 min ago",
      preview: "A reply that should not be shown.",
    });

    expect(screen.getByText("No messages yet")).toBeTruthy();
    // A fresh session should not look like it is hiding something.
    expect(screen.queryByText("A reply that should not be shown.")).toBeNull();
    expect(screen.queryByText("GPT-5 · 2 min ago")).toBeNull();
  });

  it("shows the provenance and one line of the reply once there are messages", () => {
    const screen = renderHandle({
      messageCount: 12,
      meta: "GPT-5 · 2 min ago",
      preview: "The reply.",
    });

    expect(screen.getByText("GPT-5 · 2 min ago")).toBeTruthy();
    expect(screen.getByText("The reply.").props.numberOfLines).toBe(1);
  });

  it.each([
    [0, copy.emptyAccessibilityLabel],
    [12, copy.accessibilityLabel],
  ])(
    "announces the state it is actually showing at %i messages",
    (messageCount, expected) => {
      // The failure this guards: a handle reading "no messages" while
      // announcing twelve, because the two came from different values.
      const screen = renderHandle({ messageCount });

      expect(screen.getByLabelText(expected)).toBeTruthy();
    },
  );

  it("rounds only its top corners so it reads as a drawer", () => {
    const screen = renderHandle({ messageCount: 1, preview: "Reply." });
    const style = screen.getByTestId("transcript-handle").props.style;
    const flattened = Array.isArray(style) ? Object.assign({}, ...style) : style;

    expect(flattened.borderTopLeftRadius).toBe(20);
    expect(flattened.borderTopRightRadius).toBe(20);
    expect(flattened.borderBottomWidth).toBe(0);
  });
});
