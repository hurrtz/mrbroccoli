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
        hasOverrides
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
        onUseDefaults={jest.fn()}
        {...overrides}
      />,
    );
    return { ...utils, onAutoRenameConversation, onChange, onClose };
  }

  it("uses the theme overlay token for its backdrop scrim", () => {
    const { getByTestId } = setup();
    expect(
      StyleSheet.flatten(getByTestId("styleSheetOverlay").props.style),
    ).toEqual(
      expect.objectContaining({ backgroundColor: "rgba(13, 15, 18, 0.46)" }),
    );
  });

  it("renders title, subtitle, and active option descriptions", () => {
    const { getByText } = setup();
    expect(getByText("Conversation settings").props.numberOfLines).toBe(1);
    expect(getByText("Conversation settings").props.ellipsizeMode).toBe("tail");
    expect(
      StyleSheet.flatten(getByText("Conversation settings").props.style),
    ).toEqual(
      expect.objectContaining({
        fontFamily: "UnicaOne_400Regular",
        fontSize: 20,
        textAlign: "center",
      }),
    );
    expect(
      getByText("Shape replies and speech for this conversation only."),
    ).toBeTruthy();
    // brief description
    expect(getByText(/Keep the answer tight/)).toBeTruthy();
    // casual description
    expect(getByText(/Speak like a smart friend/)).toBeTruthy();
  });

  it("pins the close action to the top-right of the header", () => {
    const { getByTestId } = setup();

    expect(
      StyleSheet.flatten(
        getByTestId("conversation-settings-header").props.style,
      ),
    ).toEqual(expect.objectContaining({ position: "relative" }));
    expect(
      StyleSheet.flatten(
        getByTestId("conversation-settings-close").props.style,
      ),
    ).toEqual(
      expect.objectContaining({ position: "absolute", right: 12, top: 8 }),
    );
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
      "use-conversation-defaults",
      "auto-rename-conversation",
    ];
    const renderedOrder = UNSAFE_root.findAll((node) =>
      expectedOrder.includes(node.props.testID),
    )
      .map((node) => node.props.testID)
      .filter((testID, index, testIDs) => testID !== testIDs[index - 1]);

    expect(renderedOrder).toEqual(expectedOrder);
  });

  it("can discard session overrides and inherit the defaults again", () => {
    const onUseDefaults = jest.fn();
    const { getByTestId } = setup({ onUseDefaults });

    fireEvent.press(getByTestId("use-conversation-defaults"));

    expect(onUseDefaults).toHaveBeenCalledTimes(1);
  });

  it("hides the defaults action when the session has no overrides", () => {
    const { queryByTestId } = setup({ hasOverrides: false });

    expect(queryByTestId("use-conversation-defaults")).toBeNull();
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

  it("renders all length and tone choices", () => {
    const { getByText } = setup();
    ["Brief", "Normal", "Thorough"].forEach((label) =>
      expect(getByText(label)).toBeTruthy(),
    );
    ["Professional", "Casual", "Nerdy", "Concise", "Socratic", "ELI5"].forEach(
      (label) => expect(getByText(label)).toBeTruthy(),
    );
  });

  it("uses compact segmented choices instead of pills", () => {
    const { getByTestId } = setup();

    expect(
      StyleSheet.flatten(
        getByTestId("conversation-settings-length-control").props.style,
      ),
    ).toEqual(
      expect.objectContaining({ borderRadius: 8, borderWidth: 1, padding: 4 }),
    );
    expect(
      StyleSheet.flatten(
        getByTestId("conversation-settings-length-brief").props.style,
      ),
    ).toEqual(expect.objectContaining({ borderRadius: 6, minHeight: 44 }));
    expect(
      getByTestId("conversation-settings-length-brief").props.accessibilityRole,
    ).toBe("radio");
  });

  it("calls onChange with new responseLength when a length choice is pressed", () => {
    const { getByText, onChange } = setup();
    fireEvent.press(getByText("Thorough"));
    expect(onChange).toHaveBeenCalledWith({ responseLength: "thorough" });
  });

  it("calls onChange with new responseTone when a tone choice is pressed", () => {
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

  it("explains unsupported TTS instructions with a line, not a dead field", () => {
    // A ghost textarea invites typing into a field the route ignores; the
    // explanatory sentence carries the state alone.
    const { queryByTestId, getByText } = setup({
      ttsInstructionsSupported: false,
    });

    expect(queryByTestId("conversation-tts-instructions")).toBeNull();
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
