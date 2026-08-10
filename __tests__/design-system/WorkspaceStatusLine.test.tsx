import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { WorkspaceStatusLine } from "../../src/design-system/WorkspaceStatusLine";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { darkColors, lightColors } from "../../src/theme/colors";

function renderLine(
  props: Partial<React.ComponentProps<typeof WorkspaceStatusLine>> = {},
  mode: "light" | "dark" = "light",
) {
  return render(
    <ThemeProvider mode={mode}>
      <WorkspaceStatusLine title="Tap to speak" {...props} />
    </ThemeProvider>,
  );
}

describe("WorkspaceStatusLine", () => {
  it("shows what is happening and what the conversation is", () => {
    const screen = renderLine({
      detail: "Tide tables · 12 messages · 2 min ago",
    });

    expect(screen.getByText("Tap to speak")).toBeTruthy();
    expect(
      screen.getByText("Tide tables · 12 messages · 2 min ago"),
    ).toBeTruthy();
  });

  it("repeats the orb's phase colour in the dot", () => {
    const screen = renderLine({ phase: "speaking" }, "dark");
    const dot = StyleSheet.flatten(
      screen.getByTestId("workspace-status-dot").props.style,
    );

    expect(dot.backgroundColor).toBe(darkColors.phaseSpeaking);
  });

  it("rests on the accent when no turn is running", () => {
    const screen = renderLine();
    const dot = StyleSheet.flatten(
      screen.getByTestId("workspace-status-dot").props.style,
    );

    expect(dot.backgroundColor).toBe(lightColors.accent);
  });

  it("hides the info control entirely when not wired", () => {
    const screen = renderLine();

    expect(screen.queryByTestId("workspace-status-info")).toBeNull();
  });

  it("labels and fires the info control when wired", () => {
    const onPress = jest.fn();
    const screen = renderLine({
      info: { accessibilityLabel: "Session details", onPress },
    });
    const info = screen.getByTestId("workspace-status-info");

    expect(info.props.accessibilityLabel).toBe("Session details");
    fireEvent.press(info);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
