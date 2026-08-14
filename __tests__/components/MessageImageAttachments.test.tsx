import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { MessageImageAttachments } from "../../src/components/MessageImageAttachments";
import { lightColors } from "../../src/theme/colors";

describe("MessageImageAttachments", () => {
  it("keeps remove inside a 44pt target with the approved control shape", () => {
    const onRemove = jest.fn();
    const screen = render(
      <MessageImageAttachments
        attachments={[
          {
            byteSize: 128,
            height: 48,
            id: "image-1",
            kind: "image",
            mimeType: "image/jpeg",
            sharedWithProviders: [],
            uri: "file://image.jpg",
            width: 64,
          },
        ]}
        colors={lightColors}
        onRemove={onRemove}
        t={((key: string) => key) as never}
      />,
    );

    const remove = screen.getByRole("button");
    expect(StyleSheet.flatten(remove.props.style)).toMatchObject({
      height: 44,
      width: 44,
    });
    expect(
      StyleSheet.flatten(
        screen.getByTestId("message-image-remove-well-image-1").props.style,
      ),
    ).toMatchObject({ borderRadius: 10, height: 28, width: 28 });

    fireEvent.press(remove);
    expect(onRemove).toHaveBeenCalledWith("image-1");
  });
});
