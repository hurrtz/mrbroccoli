import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import type { ImagePickerAsset } from "expo-image-picker";

import type {
  MessageImageAttachment,
  MessageImageMimeType,
  Provider,
} from "../types";
import { createImageAttachmentUri } from "./imageAttachmentFiles";

export const MAX_MESSAGE_IMAGE_ATTACHMENTS = 4;
export const MAX_MESSAGE_IMAGE_LONG_EDGE = 2000;
export const MAX_MESSAGE_IMAGE_BYTES = 12 * 1024 * 1024;

function getOutputFormat(asset: ImagePickerAsset) {
  return asset.mimeType === "image/png"
    ? {
        format: SaveFormat.PNG,
        mimeType: "image/png" as MessageImageMimeType,
        compress: 1,
      }
    : {
        format: SaveFormat.JPEG,
        mimeType: "image/jpeg" as MessageImageMimeType,
        compress: 0.85,
      };
}

function resizeContext(asset: ImagePickerAsset) {
  const context = ImageManipulator.manipulate(asset.uri);
  const longEdge = Math.max(asset.width, asset.height);

  if (longEdge <= MAX_MESSAGE_IMAGE_LONG_EDGE) {
    return context;
  }

  return asset.width >= asset.height
    ? context.resize({ width: MAX_MESSAGE_IMAGE_LONG_EDGE })
    : context.resize({ height: MAX_MESSAGE_IMAGE_LONG_EDGE });
}

export async function createMessageImageAttachment(
  asset: ImagePickerAsset,
  sharedWithProviders: Provider[] = [],
): Promise<MessageImageAttachment> {
  if (
    asset.type === "video" ||
    asset.type === "pairedVideo" ||
    asset.width <= 0 ||
    asset.height <= 0
  ) {
    throw new Error("The selected item is not a supported image.");
  }

  const id = randomUUID();
  const output = getOutputFormat(asset);
  const rendered = await resizeContext(asset).renderAsync();
  const saved = await rendered.saveAsync({
    format: output.format,
    compress: output.compress,
  });
  const uri = await createImageAttachmentUri(id, output.mimeType);

  try {
    await FileSystem.copyAsync({ from: saved.uri, to: uri });
    const info = await FileSystem.getInfoAsync(uri);
    const byteSize = info.exists && !info.isDirectory ? (info.size ?? 0) : 0;

    if (byteSize <= 0 || byteSize > MAX_MESSAGE_IMAGE_BYTES) {
      throw new Error("The processed image is too large.");
    }

    return {
      id,
      kind: "image",
      uri,
      mimeType: output.mimeType,
      width: saved.width,
      height: saved.height,
      byteSize,
      sharedWithProviders: [...new Set(sharedWithProviders)],
    };
  } catch (error) {
    await FileSystem.deleteAsync(uri, { idempotent: true }).catch(
      () => undefined,
    );
    throw error;
  } finally {
    await FileSystem.deleteAsync(saved.uri, { idempotent: true }).catch(
      () => undefined,
    );
  }
}

export async function createMessageImageAttachments(
  assets: ImagePickerAsset[],
  sharedWithProviders: Provider[] = [],
) {
  const attachments: MessageImageAttachment[] = [];

  try {
    for (const asset of assets.slice(0, MAX_MESSAGE_IMAGE_ATTACHMENTS)) {
      attachments.push(
        await createMessageImageAttachment(asset, sharedWithProviders),
      );
    }
    return attachments;
  } catch (error) {
    await Promise.all(
      attachments.map((attachment) =>
        FileSystem.deleteAsync(attachment.uri, { idempotent: true }),
      ),
    );
    throw error;
  }
}
