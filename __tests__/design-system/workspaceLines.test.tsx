import React from "react";
import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { ConversationSettingsSummary } from "../../src/design-system/ConversationSettingsSummary";
import { WorkspaceStatusLine } from "../../src/design-system/WorkspaceStatusLine";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { darkColors, lightColors } from "../../src/theme/colors";

describe("WorkspaceStatusLine", () => {
  function renderLine(
    props: Partial<React.ComponentProps<typeof WorkspaceStatusLine>> = {},
  ) {
    return render(
      <ThemeProvider mode="light">
        <WorkspaceStatusLine title="Tap to speak" {...props} />
      </ThemeProvider>,
    );
  }

  it("states the phase in words as well as in the dot", () => {
    // Colour is never the only carrier: the dot tints, the title says it.
    const screen = renderLine({ phase: "searching", title: "Searching" });

    expect(screen.getByText("Searching")).toBeTruthy();
  });

  it.each([
    ["light", false, lightColors],
    ["dark", true, darkColors],
  ] as const)("tints the dot with the phase in %s", (_mode, isDark, colors) => {
    const screen = render(
      <ThemeProvider mode={isDark ? "dark" : "light"}>
        <WorkspaceStatusLine phase="thinking" title="Thinking" />
      </ThemeProvider>,
    );
    const dot = StyleSheet.flatten(
      screen.getByTestId("workspace-status-dot").props.style,
    );

    expect(dot.backgroundColor).toBe(colors.phaseThinking);
    // Round because the shape is the indicator, not a style.
    expect(dot.borderRadius).toBe(dot.width / 2);
  });

  it("keeps a single line for the title and the detail", () => {
    const screen = renderLine({ detail: "Kitchen rebuild · 3 min ago" });

    expect(screen.getByText("Tap to speak").props.numberOfLines).toBe(1);
    expect(
      screen.getByText("Kitchen rebuild · 3 min ago").props.numberOfLines,
    ).toBe(1);
  });

  it("hides the info control entirely when there is nothing behind it", () => {
    expect(renderLine().queryByLabelText("Session details")).toBeNull();
    expect(
      renderLine({
        infoAccessibilityLabel: "Session details",
        onInfo: () => {},
      }).getByLabelText("Session details"),
    ).toBeTruthy();
  });
});

describe("ConversationSettingsSummary", () => {
  function renderSummary(
    props: Partial<
      React.ComponentProps<typeof ConversationSettingsSummary>
    > = {},
  ) {
    return render(
      <ThemeProvider mode="light">
        <ConversationSettingsSummary
          accessibilityLabel="Conversation settings"
          summary="Balanced · Brief · Heart"
          {...props}
        />
      </ThemeProvider>,
    );
  }

  it("states the settings as one muted line that truncates", () => {
    const screen = renderSummary();
    const text = screen.getByText("Balanced · Brief · Heart");

    expect(text.props.numberOfLines).toBe(1);
    expect(StyleSheet.flatten(text.props.style).color).toBe(
      lightColors.textSecondary,
    );
  });

  it("keeps a 44pt row so the control beside it stays reachable", () => {
    const screen = renderSummary({ onPress: () => {} });

    expect(screen.getByLabelText("Conversation settings")).toBeTruthy();
  });
});
