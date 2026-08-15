import React from "react";
import { Modal as ReactNativeModal } from "react-native";
import { act, fireEvent } from "@testing-library/react-native";

import { ImageSourceSheet } from "../../../src/screens/main/ImageSourceSheet";
import type { TranslateFn } from "../../../src/screens/main/shared";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

const t = ((key: string) => key) as TranslateFn;

describe("ImageSourceSheet", () => {
  it("dismisses before opening a native image picker", () => {
    const onChooseFromPhotos = jest.fn();
    const onClose = jest.fn();
    const screen = renderWithProviders(
      <ImageSourceSheet
        onChooseFromPhotos={onChooseFromPhotos}
        onClose={onClose}
        onTakePhoto={jest.fn()}
        t={t}
        visible
      />,
    );

    fireEvent.press(screen.getByTestId("image-source-library"));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onChooseFromPhotos).not.toHaveBeenCalled();

    act(() => {
      screen.UNSAFE_getByType(ReactNativeModal).props.onDismiss();
    });
    expect(onChooseFromPhotos).toHaveBeenCalledTimes(1);
  });

  it("keeps a labelled dismissal action on the grabber", () => {
    const onClose = jest.fn();
    const screen = renderWithProviders(
      <ImageSourceSheet
        onChooseFromPhotos={jest.fn()}
        onClose={onClose}
        onTakePhoto={jest.fn()}
        t={t}
        visible
      />,
    );

    fireEvent.press(screen.getByTestId("image-source-header-handle"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
