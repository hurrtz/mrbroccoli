import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { ConversationSettingsSummary } from "../../src/design-system/ConversationSettingsSummary";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

function renderSummary(
  props: Partial<
    React.ComponentProps<typeof ConversationSettingsSummary>
  > = {},
) {
  return render(
    <ThemeProvider mode="light">
      <ConversationSettingsSummary
        accessibilityLabel="Conversation settings"
        onPress={jest.fn()}
        summary="Balanced · Brief · Heart"
        testID="conversation-settings-summary"
        {...props}
      />
    </ThemeProvider>,
  );
}

describe("ConversationSettingsSummary", () => {
  it("states the settings as one muted line that truncates", () => {
    const screen = renderSummary();
    const summary = screen.getByText("Balanced · Brief · Heart");

    expect(summary.props.numberOfLines).toBe(1);
    expect(StyleSheet.flatten(summary.props.style).color).toBe(
      lightColors.textSecondary,
    );
  });

  it("keeps the row at least 44pt tall", () => {
    const screen = renderSummary();
    const row = StyleSheet.flatten(
      screen.getByTestId("conversation-settings-summary").props.style,
    );

    expect(row.minHeight).toBe(44);
  });

  it("opens the sheet from its one labelled control", () => {
    const onPress = jest.fn();
    const screen = renderSummary({ onPress });
    const control = screen.getByTestId(
      "conversation-settings-summary-control",
    );

    expect(control.props.accessibilityLabel).toBe("Conversation settings");
    fireEvent.press(control);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("keeps the labelled control while omitting the sentence when compact", () => {
    const screen = renderSummary({ compact: true });

    expect(screen.queryByText("Balanced · Brief · Heart")).toBeNull();
    expect(
      screen.getByTestId("conversation-settings-summary-control").props
        .accessibilityLabel,
    ).toBe("Conversation settings");
    expect(
      StyleSheet.flatten(
        screen.getByTestId("conversation-settings-summary").props.style,
      ).justifyContent,
    ).toBe("flex-end");
  });
});
