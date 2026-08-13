import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useMainScreenImageAttachments } from "../../../src/screens/main/useMainScreenImageAttachments";
import type { TranslateFn } from "../../../src/screens/main/shared";

const t = ((key: string) => key) as TranslateFn;

describe("useMainScreenImageAttachments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(ImagePicker.getPendingResultAsync).mockResolvedValue(null);
    jest.mocked(FileSystem.getInfoAsync).mockResolvedValue({
      exists: true,
      isDirectory: false,
      modificationTime: 0,
      size: 1000,
      uri: "file:///documents/message-images/mock-image-uuid.jpg",
    });
  });

  it("uses the platform photo picker and retains accepted image files", async () => {
    const onOpenSourcePicker = jest.fn();
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: "file:///picker/photo.heic",
          width: 1200,
          height: 800,
          type: "image",
          mimeType: "image/heic",
        },
      ],
    });
    const { result, unmount } = renderHook(() =>
      useMainScreenImageAttachments({
        disabled: false,
        onOpenSourcePicker,
        showError: jest.fn(),
        t,
      }),
    );

    act(() => result.current.handleAddImage());
    expect(onOpenSourcePicker).toHaveBeenCalledTimes(1);
    await act(async () => {
      await result.current.chooseFromPhotos();
    });
    await waitFor(() => expect(result.current.attachments).toHaveLength(1));

    expect(
      ImagePicker.requestMediaLibraryPermissionsAsync,
    ).not.toHaveBeenCalled();
    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        allowsMultipleSelection: true,
        exif: false,
        selectionLimit: 4,
      }),
    );

    act(() =>
      result.current.handleAttachmentsAccepted([
        result.current.attachments[0].id,
      ]),
    );
    unmount();

    expect(FileSystem.deleteAsync).not.toHaveBeenCalledWith(
      "file:///documents/message-images/mock-image-uuid.jpg",
      { idempotent: true },
    );
  });

  it("discards a pending picker result when image access becomes disabled", async () => {
    let resolvePending: (value: ImagePicker.ImagePickerResult) => void = () =>
      undefined;
    jest.mocked(ImagePicker.getPendingResultAsync).mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePending = resolve;
      }),
    );
    const props = {
      disabled: false,
      onOpenSourcePicker: jest.fn(),
      showError: jest.fn(),
      t,
    };
    const { result, rerender } = renderHook(
      ({ disabled }) => useMainScreenImageAttachments({ ...props, disabled }),
      { initialProps: { disabled: false } },
    );

    rerender({ disabled: true });
    await act(async () => {
      resolvePending({
        canceled: false,
        assets: [
          {
            uri: "file:///picker/pending.jpg",
            width: 800,
            height: 600,
            type: "image",
            mimeType: "image/jpeg",
          },
        ],
      });
    });

    expect(result.current.attachments).toEqual([]);
  });
});
