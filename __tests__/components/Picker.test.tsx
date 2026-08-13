import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent } from "@testing-library/react-native";

import { Picker } from "../../src/components/Picker";
import { lightColors } from "../../src/theme/colors";
import { renderWithProviders } from "../test-utils/renderWithProviders";

describe("Picker theming", () => {
  it("uses the theme overlay token for the options scrim", () => {
    const screen = renderWithProviders(
      <Picker
        label="Provider"
        value="openai"
        options={[
          { label: "OpenAI", value: "openai" },
          { label: "Anthropic", value: "anthropic" },
        ]}
        onChange={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByLabelText("Provider. OpenAI"));
    expect(
      StyleSheet.flatten(screen.getByTestId("pickerOverlay").props.style),
    ).toEqual(
      expect.objectContaining({ backgroundColor: lightColors.overlay }),
    );
  });
});

describe("Picker accessibility", () => {
  it("exposes the trigger, modal, choices, and close action semantically", () => {
    const onChange = jest.fn();
    const screen = renderWithProviders(
      <Picker
        label="Provider"
        value="openai"
        options={[
          { label: "OpenAI", value: "openai" },
          { label: "Anthropic", value: "anthropic" },
        ]}
        onChange={onChange}
      />,
    );

    const trigger = screen.getByLabelText("Provider. OpenAI");
    expect(trigger.props.accessibilityRole).toBe("button");
    expect(trigger.props.accessibilityState).toEqual({
      disabled: false,
      expanded: false,
    });

    fireEvent.press(trigger);

    expect(
      screen.getByLabelText("Provider. OpenAI").props.accessibilityState,
    ).toEqual({ disabled: false, expanded: true });
    expect(screen.getByRole("header").props.children).toBe("Provider");
    expect(screen.getByLabelText("Dismiss").props.accessibilityRole).toBe(
      "button",
    );
    expect(screen.getByLabelText("Anthropic").props.accessibilityRole).toBe(
      "radio",
    );
    expect(screen.getByLabelText("Anthropic").props.accessibilityState).toEqual(
      { checked: false },
    );

    fireEvent.press(screen.getByLabelText("Anthropic"));

    expect(onChange).toHaveBeenCalledWith("anthropic");
  });

  it("reports a disabled trigger without opening the modal", () => {
    const screen = renderWithProviders(
      <Picker
        disabled
        label="Speech provider"
        value=""
        options={[]}
        onChange={jest.fn()}
      />,
    );

    const trigger = screen.getByRole("button");
    expect(trigger.props.accessibilityState).toEqual({
      disabled: true,
      expanded: false,
    });

    fireEvent.press(trigger);

    expect(screen.queryByLabelText("Dismiss")).toBeNull();
  });

  it("shows a non-selected placeholder without a separate field label", () => {
    const screen = renderWithProviders(
      <Picker
        hideDropdownLabel
        hideLabel
        label="Choose your language"
        placeholder="Choose your language"
        value=""
        options={[{ label: "English", value: "en" }]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText("Choose your language")).toBeTruthy();
    expect(
      screen.getByLabelText("Choose your language. Choose your language"),
    ).toBeTruthy();
    expect(screen.queryByText("Selection")).toBeNull();

    fireEvent.press(screen.getByRole("button"));
    expect(screen.getByLabelText("English").props.accessibilityState).toEqual({
      checked: false,
    });
  });
});
