import * as FileSystem from "expo-file-system/legacy";

import type {
  Conversation,
  MessageImageAttachment,
  MessageImageMimeType,
  Provider,
} from "../types";

const IMAGE_DIRECTORY_NAME = "message-images";

export interface PreparedMessageImageAttachment
  extends MessageImageAttachment {
  data: string;
}

function imageDirectory() {
  if (!FileSystem.documentDirectory) {
    throw new Error("Image storage is unavailable on this device.");
  }

  return `${FileSystem.documentDirectory}${IMAGE_DIRECTORY_NAME}/`;
}

function extensionForMimeType(mimeType: MessageImageMimeType) {
  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function imageAttachmentRelativeUri(
  attachment: Pick<MessageImageAttachment, "id" | "mimeType">,
) {
  return `${IMAGE_DIRECTORY_NAME}/${attachment.id}.${extensionForMimeType(
    attachment.mimeType,
  )}`;
}

export function resolveImageAttachmentUri(
  attachment: Pick<MessageImageAttachment, "id" | "mimeType">,
) {
  return `${imageDirectory()}${attachment.id}.${extensionForMimeType(
    attachment.mimeType,
  )}`;
}

function mapConversationImageAttachmentUris(
  conversation: Conversation,
  mapUri: (
    attachment: Pick<MessageImageAttachment, "id" | "mimeType">,
  ) => string,
) {
  let changed = false;
  const messages = conversation.messages.map((message) => {
    if (!message.attachments?.length) {
      return message;
    }

    let messageChanged = false;
    const attachments = message.attachments.map((attachment) => {
      const uri = mapUri(attachment);
      if (uri === attachment.uri) {
        return attachment;
      }
      changed = true;
      messageChanged = true;
      return { ...attachment, uri };
    });

    return messageChanged ? { ...message, attachments } : message;
  });

  return changed ? { ...conversation, messages } : conversation;
}

export function resolveConversationImageAttachmentUris(
  conversation: Conversation,
) {
  return mapConversationImageAttachmentUris(
    conversation,
    resolveImageAttachmentUri,
  );
}

export function relativizeConversationImageAttachmentUris(
  conversation: Conversation,
) {
  return mapConversationImageAttachmentUris(
    conversation,
    imageAttachmentRelativeUri,
  );
}

export async function ensureImageAttachmentDirectory() {
  const directory = imageDirectory();
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  return directory;
}

export async function createImageAttachmentUri(
  id: string,
  mimeType: MessageImageMimeType,
) {
  const directory = await ensureImageAttachmentDirectory();
  return `${directory}${id}.${extensionForMimeType(mimeType)}`;
}

export async function readImageAttachmentData(
  attachment: MessageImageAttachment,
) {
  return FileSystem.readAsStringAsync(resolveImageAttachmentUri(attachment), {
    encoding: FileSystem.EncodingType.Base64,
  });
}

export async function prepareMessageImagesForRequest<
  T extends {
    attachments?: MessageImageAttachment[];
  },
>(messages: T[]): Promise<(Omit<T, "attachments"> & {
  attachments?: PreparedMessageImageAttachment[];
})[]> {
  const prepared = await Promise.all(
    messages.map(async (message) => {
      if (!message.attachments?.length) {
        return message;
      }

      return {
        ...message,
        attachments: await Promise.all(
          message.attachments.map(async (attachment) => ({
            ...attachment,
            uri: resolveImageAttachmentUri(attachment),
            data: await readImageAttachmentData(attachment),
          })),
        ),
      };
    }),
  );

  return prepared as unknown as (Omit<T, "attachments"> & {
    attachments?: PreparedMessageImageAttachment[];
  })[];
}

export async function deleteImageAttachments(
  attachments: MessageImageAttachment[],
) {
  await Promise.all(
    attachments.map((attachment) =>
      FileSystem.deleteAsync(resolveImageAttachmentUri(attachment), {
        idempotent: true,
      }).catch(() => undefined),
    ),
  );
}

export async function writeRestoredImageAttachment(params: {
  id: string;
  mimeType: MessageImageMimeType;
  width: number;
  height: number;
  byteSize: number;
  data: string;
  sharedWithProviders?: Provider[];
}): Promise<MessageImageAttachment> {
  const uri = await createImageAttachmentUri(params.id, params.mimeType);
  try {
    await FileSystem.writeAsStringAsync(uri, params.data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return {
      id: params.id,
      kind: "image",
      uri,
      mimeType: params.mimeType,
      width: params.width,
      height: params.height,
      byteSize: params.byteSize,
      sharedWithProviders: params.sharedWithProviders ?? [],
    };
  } catch (error) {
    await FileSystem.deleteAsync(uri, { idempotent: true }).catch(
      () => undefined,
    );
    throw error;
  }
}
