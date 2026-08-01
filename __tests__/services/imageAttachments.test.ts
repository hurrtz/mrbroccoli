import * as FileSystem from "expo-file-system/legacy";
import { ImageManipulator } from "expo-image-manipulator";

import {
  createMessageImageAttachment,
  MAX_MESSAGE_IMAGE_LONG_EDGE,
} from "../../src/services/imageAttachments";

const mockResize = jest.fn();
const mockRenderAsync = jest.fn();
const mockSaveAsync = jest.fn();

jest.mock("expo-crypto", () => ({ randomUUID: () => "image-uuid" }));
jest.mock("expo-file-system/legacy", () => ({
  documentDirectory: "file:///documents/",
  makeDirectoryAsync: jest.fn(async () => undefined),
  copyAsync: jest.fn(async () => undefined),
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({
    exists: true,
    isDirectory: false,
    size: 4321,
  })),
}));
jest.mock("expo-image-manipulator", () => ({
  SaveFormat: { JPEG: "jpeg", PNG: "png", WEBP: "webp" },
  ImageManipulator: {
    manipulate: jest.fn(() => ({
      resize: mockResize,
      renderAsync: mockRenderAsync,
    })),
  },
}));

describe("imageAttachments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockResize.mockReturnValue({
      resize: mockResize,
      renderAsync: mockRenderAsync,
    });
    mockRenderAsync.mockResolvedValue({
      saveAsync: mockSaveAsync,
    });
    mockSaveAsync.mockResolvedValue({
      uri: "file:///cache/processed.jpg",
      width: 2000,
      height: 1000,
    });
  });

  it("re-encodes, resizes, and moves a selected photo into durable storage", async () => {
    const attachment = await createMessageImageAttachment({
      uri: "file:///picker/original.heic",
      width: 4032,
      height: 2016,
      type: "image",
      mimeType: "image/heic",
    });

    expect(ImageManipulator.manipulate).toHaveBeenCalledWith(
      "file:///picker/original.heic",
    );
    expect(mockResize).toHaveBeenCalledWith({
      width: MAX_MESSAGE_IMAGE_LONG_EDGE,
    });
    expect(mockSaveAsync).toHaveBeenCalledWith({
      format: "jpeg",
      compress: 0.85,
    });
    expect(FileSystem.copyAsync).toHaveBeenCalledWith({
      from: "file:///cache/processed.jpg",
      to: "file:///documents/message-images/image-uuid.jpg",
    });
    expect(attachment).toEqual({
      id: "image-uuid",
      kind: "image",
      uri: "file:///documents/message-images/image-uuid.jpg",
      mimeType: "image/jpeg",
      width: 2000,
      height: 1000,
      byteSize: 4321,
      sharedWithProviders: [],
    });
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///cache/processed.jpg",
      { idempotent: true },
    );
  });
});
