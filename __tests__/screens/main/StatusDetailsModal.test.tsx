import React from "react";
import { StyleSheet } from "react-native";

import { StatusDetailsModal } from "../../../src/screens/main/StatusDetailsModal";
import { lightColors } from "../../../src/theme/colors";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

describe("StatusDetailsModal", () => {
  it("uses the theme overlay token for its backdrop scrim", () => {
    const { getByTestId } = renderWithProviders(
      <StatusDetailsModal
        colors={lightColors}
        fallbackTtsStatusLabel={null}
        isActive={false}
        messageCountLabel={null}
        onClose={jest.fn()}
        routeModelLabel="OpenAI · GPT-5"
        statusDetail="Untitled conversation"
        statusTitle="Tap to speak"
        sttStatusLabel="System recognition"
        t={(key: string) => key}
        ttsStatusLabel="System voice"
        visible
      />,
    );
    expect(
      StyleSheet.flatten(getByTestId("statusDetailsOverlay").props.style),
    ).toEqual(
      expect.objectContaining({ backgroundColor: lightColors.overlay }),
    );
  });
});
