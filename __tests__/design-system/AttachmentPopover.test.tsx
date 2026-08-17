import React from "react";
import { Modal as ReactNativeModal, StyleSheet } from "react-native";
import { act, fireEvent, render } from "@testing-library/react-native";

import { AttachmentPopover } from "../../src/design-system/AttachmentPopover";
import { ThemeProvider } from "../../src/theme/ThemeContext";

const anchor = { height: 44, width: 64, x: 40, y: 640 };
const attachments = [
  {
    id: "one",
    kind: "image" as const,
    uri: "file://one.jpg",
    mimeType: "image/jpeg" as const,
    width: 100,
    height: 100,
    byteSize: 100,
    sharedWithProviders: [],
  },
  {
    id: "two",
    kind: "image" as const,
    uri: "file://two.jpg",
    mimeType: "image/jpeg" as const,
    width: 100,
    height: 100,
    byteSize: 100,
    sharedWithProviders: [],
  },
];

function renderPopover(
  overrides: Partial<React.ComponentProps<typeof AttachmentPopover>> = {},
) {
  const onAdd = jest.fn();
  const onClose = jest.fn();
  const onRemove = jest.fn();
  const screen = render(
    <ThemeProvider mode="light">
      <AttachmentPopover
        addLabel="Add images"
        anchor={anchor}
        attachments={attachments}
        emptyLabel="No images in this conversation yet."
        imageLabel={(index, count) => `Attached image ${index} of ${count}`}
        onAdd={onAdd}
        onClose={onClose}
        onRemove={onRemove}
        removeLabel={(index, count) => `Remove image ${index} of ${count}`}
        visible
        {...overrides}
      />
    </ThemeProvider>,
  );
  return { onAdd, onClose, onRemove, screen };
}

describe("AttachmentPopover", () => {
  it("shows every attachment in a sideways scrolling row", () => {
    const { screen } = renderPopover();

    expect(screen.getByTestId("attachment-popover-list").props.horizontal).toBe(
      true,
    );
    expect(screen.getAllByLabelText("Remove image 1 of 2")).not.toHaveLength(0);
    expect(screen.getAllByLabelText("Remove image 2 of 2")).not.toHaveLength(0);
    expect(screen.getByLabelText("Attached image 1 of 2")).toBeTruthy();
    expect(screen.getByLabelText("Attached image 2 of 2")).toBeTruthy();
  });

  it("removes and dismisses without a dimming backdrop", () => {
    const { onAdd, onClose, onRemove, screen } = renderPopover();

    fireEvent.press(screen.getByTestId("attachment-popover-remove-one"));
    fireEvent.press(
      screen.getByTestId("attachment-popover-dismiss", {
        includeHiddenElements: true,
      }),
    );

    expect(onRemove).toHaveBeenCalledWith("one");
    expect(onAdd).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("attachment-popover-overlay").props.style,
      ),
    ).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("dismisses before handing off to the app-owned image source sheet", () => {
    const { onAdd, onClose, screen } = renderPopover();

    fireEvent.press(screen.getByTestId("attachment-popover-add"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onAdd).not.toHaveBeenCalled();

    act(() => {
      screen.UNSAFE_getByType(ReactNativeModal).props.onDismiss();
    });
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("uses the approved empty copy", () => {
    const { screen } = renderPopover({ attachments: [] });

    expect(
      screen.getByText("No images in this conversation yet."),
    ).toBeTruthy();
  });
});
