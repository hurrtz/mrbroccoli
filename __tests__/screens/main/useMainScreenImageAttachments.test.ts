import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
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
    jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
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
        showError: jest.fn(),
        t,
      }),
    );

    act(() => result.current.handleAddImage());
    const buttons = jest.mocked(Alert.alert).mock.calls[0][2];
    await act(async () => {
      buttons?.[1].onPress?.();
    });
    await waitFor(() => expect(result.current.attachments).toHaveLength(1));

    expect(ImagePicker.requestMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
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
});
