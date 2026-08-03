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
        onRemoveArtifact={jest.fn()}
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

  it("shows source-linked insights and lets the user remove one", async () => {
    const onRemoveArtifact = jest.fn(async () => true);
    const screen = renderWithProviders(
      <ConversationMemoryModal
        visible
        title="Planning"
        artifacts={[
          {
            id: "artifact-1",
            kind: "decision",
            text: "Use the local route.",
            sourceMessageId: "message-1",
            createdAt: "2026-08-03T10:01:00.000Z",
          },
        ]}
        messages={[
          {
            id: "message-1",
            role: "assistant",
            content: "A local route protects privacy.",
            model: "gpt-5.4",
            provider: "openai",
            timestamp: "2026-08-03T10:00:00.000Z",
          },
        ]}
        onCopy={jest.fn()}
        onClear={jest.fn()}
        onSave={jest.fn(async () => true)}
        onRemoveArtifact={onRemoveArtifact}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText("Saved insights")).toBeTruthy();
    expect(screen.getByText("Use the local route.")).toBeTruthy();
    expect(
      screen.getByText("Assistant: A local route protects privacy."),
    ).toBeTruthy();
    fireEvent.press(screen.getByTestId("remove-saved-insight-artifact-1"));

    await waitFor(() =>
      expect(onRemoveArtifact).toHaveBeenCalledWith("artifact-1"),
    );
  });
});
