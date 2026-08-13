import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { DisclosureDialog } from "../../../src/screens/main/DisclosureDialog";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

describe("DisclosureDialog", () => {
  it("keeps explicit cancel and confirmation actions", () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    const screen = renderWithProviders(
      <DisclosureDialog
        cancelLabel="Not now"
        confirmLabel="Continue"
        message="This sends images to two providers."
        onCancel={onCancel}
        onConfirm={onConfirm}
        testID="disclosure-message"
        title="Share images"
        visible
      />,
    );

    expect(screen.getByTestId("disclosure-message").props.children).toBe(
      "This sends images to two providers.",
    );
    fireEvent.press(screen.getByText("Not now"));
    fireEvent.press(screen.getByText("Continue"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
