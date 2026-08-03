import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { ConversationMemoryModal } from "../../src/components/ConversationMemoryModal";
import { renderWithProviders } from "../test-utils/renderWithProviders";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe("ConversationMemoryModal", () => {
  it("lets the user correct compact memory before future turns use it", async () => {
    const onSave = jest.fn(async () => true);
    const screen = renderWithProviders(
      <ConversationMemoryModal
        visible
        title="Planning"
        summary="The launch is in May."
        summarizedMessageCount={8}
        onCopy={jest.fn()}
        onClear={jest.fn()}
        onSave={onSave}
        onClose={jest.fn()}
      />,
    );

    expect(
      screen.getByText(
        "You can correct this compact memory before it is used in future turns.",
      ),
    ).toBeTruthy();
    fireEvent.changeText(
      screen.getByTestId("conversation-memory-input"),
      "The launch is in June.",
    );
    fireEvent.press(screen.getByTestId("save-memory-action"));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith("The launch is in June."),
    );
  });
});
