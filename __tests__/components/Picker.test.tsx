import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { Picker } from "../../src/components/Picker";
import { renderWithProviders } from "../test-utils/renderWithProviders";

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
});
