import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { AntPreviewComposer } from "../../src/features/settings/AntPreviewComposer";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";

describe("AntPreviewComposer", () => {
  it("keeps long preview text inside a scrollable field above the action", () => {
    const setText = jest.fn();
    const previewText =
      "This intentionally long voice preview spans several lines so its text must stay inside the editor instead of overlapping the preview button below it.";
    const screen = render(
      <LocalizationProvider language="en">
        <ThemeProvider mode="light">
          <AntPreviewComposer
            text={previewText}
            setText={setText}
            phase="idle"
            interactionDisabled={false}
            onPreview={jest.fn().mockResolvedValue(undefined)}
            onStop={jest.fn().mockResolvedValue(undefined)}
            onTextInputFocus={jest.fn()}
          />
        </ThemeProvider>
      </LocalizationProvider>,
    );

    const input = screen.getByTestId("voice-preview-text-input");
    const inputStyle = StyleSheet.flatten(input.props.style);

    expect(input.props.multiline).toBe(true);
    expect(input.props.scrollEnabled).toBe(true);
    expect(inputStyle).toEqual(
      expect.objectContaining({
        height: 126,
        textAlignVertical: "top",
      }),
    );
    expect(screen.getByText("Preview Voice")).toBeTruthy();

    fireEvent.changeText(input, "Updated preview text");
    expect(setText).toHaveBeenCalledWith("Updated preview text");
  });
});
