import React from "react";
import { Modal, StyleSheet } from "react-native";
import { fireEvent } from "@testing-library/react-native";

import { StyleSheetModal } from "../../../src/screens/main/StyleSheetModal";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

describe("StyleSheetModal", () => {
  function setup(
    overrides: Partial<React.ComponentProps<typeof StyleSheetModal>> = {},
  ) {
    const onChange = jest.fn();
    const onClose = jest.fn();
    const onAutoRenameConversation = jest.fn();
    const utils = renderWithProviders(
      <StyleSheetModal
        canAutoRenameConversation
        isAutoRenamingConversation={false}
        visible
        llmInstructions=""
        responseLength="brief"
        responseTone="casual"
        ttsInstructions=""
        ttsInstructionsSupported
        ttsRouteLabel="OpenAI · GPT-4o Mini TTS"
        ttsVoice="alloy"
        ttsVoiceOptions={[
          { value: "alloy", label: "Alloy" },
          { value: "nova", label: "Nova" },
        ]}
        onAutoRenameConversation={onAutoRenameConversation}
        onChange={onChange}
        onLlmInstructionsChange={jest.fn()}
        onTtsInstructionsChange={jest.fn()}
        onTtsVoiceChange={jest.fn()}
        onClose={onClose}
        {...overrides}
      />,
    );
    return { ...utils, onAutoRenameConversation, onChange, onClose };
  }

  it("renders title, subtitle, and active option descriptions", () => {
    const { getByText } = setup();
    expect(getByText("Conversation settings")).toBeTruthy();
    expect(
      getByText("Shape replies and speech for this conversation only."),
    ).toBeTruthy();
    // brief description
    expect(getByText(/Keep the answer tight/)).toBeTruthy();
    // casual description
    expect(getByText(/Speak like a smart friend/)).toBeTruthy();
  });

  it("renders as a full-width bottom drawer", () => {
    const { getByTestId, UNSAFE_getByType } = setup();
    const drawer = getByTestId("conversation-settings-drawer");
    const drawerStyle = StyleSheet.flatten(drawer.props.style);

    expect(UNSAFE_getByType(Modal).props.animationType).toBe("slide");
    expect(drawerStyle.width).toBe("100%");
    expect(drawerStyle.borderTopLeftRadius).toBe(24);
    expect(drawerStyle.borderTopRightRadius).toBe(24);
    expect(drawer.props.edges).toEqual({
      top: "off",
      bottom: "additive",
      left: "additive",
      right: "additive",
    });
  });

  it("offers a one-off title generation action", () => {
    const { getByTestId, getByText, queryByText, onAutoRenameConversation } =
      setup();

    expect(getByText("Auto-generate title")).toBeTruthy();
    expect(queryByText("Conversation Title")).toBeNull();
    expect(
      queryByText(
        "Run the selected model once to create a short title from the current conversation.",
      ),
    ).toBeNull();
    fireEvent.press(getByTestId("auto-rename-conversation"));

    expect(onAutoRenameConversation).toHaveBeenCalledTimes(1);
  });

  it("orders settings from response controls through title generation", () => {
    const { UNSAFE_root } = setup();
    const expectedOrder = [
      "conversation-settings-length",
      "conversation-settings-tone",
      "conversation-settings-voice",
      "conversation-settings-tts-instructions",
      "conversation-settings-thinking-instructions",
      "auto-rename-conversation",
    ];
    const renderedOrder = UNSAFE_root.findAll((node) =>
      expectedOrder.includes(node.props.testID),
    )
      .map((node) => node.props.testID)
      .filter((testID, index, testIDs) => testID !== testIDs[index - 1]);

    expect(renderedOrder).toEqual(expectedOrder);
  });

  it("disables title generation without conversation content", () => {
    const { getByTestId, onAutoRenameConversation } = setup({
      canAutoRenameConversation: false,
    });
    const button = getByTestId("auto-rename-conversation");

    expect(button.props.accessibilityState).toEqual({ disabled: true });
    fireEvent.press(button);
    expect(onAutoRenameConversation).not.toHaveBeenCalled();
  });

  it("renders all length and tone pills", () => {
    const { getByText } = setup();
    ["Brief", "Normal", "Thorough"].forEach((label) =>
      expect(getByText(label)).toBeTruthy(),
    );
    ["Professional", "Casual", "Nerdy", "Concise", "Socratic", "ELI5"].forEach(
      (label) => expect(getByText(label)).toBeTruthy(),
    );
  });

  it("calls onChange with new responseLength when a length pill is pressed", () => {
    const { getByText, onChange } = setup();
    fireEvent.press(getByText("Thorough"));
    expect(onChange).toHaveBeenCalledWith({ responseLength: "thorough" });
  });

  it("calls onChange with new responseTone when a tone pill is pressed", () => {
    const { getByText, onChange } = setup();
    fireEvent.press(getByText("Nerdy"));
    expect(onChange).toHaveBeenCalledWith({ responseTone: "nerdy" });
  });

  it("edits conversation-specific LLM and TTS instructions", () => {
    const onLlmInstructionsChange = jest.fn();
    const onTtsInstructionsChange = jest.fn();
    const { getByTestId } = setup({
      onLlmInstructionsChange,
      onTtsInstructionsChange,
    });

    fireEvent.changeText(
      getByTestId("conversation-llm-instructions"),
      "Challenge my assumptions.",
    );
    fireEvent.changeText(
      getByTestId("conversation-tts-instructions"),
      "Speak slowly and warmly.",
    );

    expect(onLlmInstructionsChange).toHaveBeenCalledWith(
      "Challenge my assumptions.",
    );
    expect(onTtsInstructionsChange).toHaveBeenCalledWith(
      "Speak slowly and warmly.",
    );
  });

  it("offers quick voice switching for the active TTS route", () => {
    const onTtsVoiceChange = jest.fn();
    const { getByText } = setup({ onTtsVoiceChange });

    fireEvent.press(getByText("Alloy"));
    fireEvent.press(getByText("Nova"));

    expect(onTtsVoiceChange).toHaveBeenCalledWith("nova");
  });

  it("disables TTS instructions for unsupported speech models", () => {
    const { getByTestId, getByText } = setup({
      ttsInstructionsSupported: false,
    });

    expect(getByTestId("conversation-tts-instructions").props.editable).toBe(
      false,
    );
    expect(
      getByText(
        "The current speech route does not support delivery instructions.",
      ),
    ).toBeTruthy();
  });

  it("calls onClose when Done button is pressed", () => {
    const { getByText, onClose } = setup();
    fireEvent.press(getByText("Done"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose from the fixed drawer header", () => {
    const { getByTestId, onClose } = setup();
    fireEvent.press(getByTestId("conversation-settings-close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is tapped", () => {
    const { getByTestId, onClose } = setup();
    fireEvent.press(
      getByTestId("styleSheetBackdrop", { includeHiddenElements: true }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
