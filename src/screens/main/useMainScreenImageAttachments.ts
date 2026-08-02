import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

import {
  createMessageImageAttachments,
  MAX_MESSAGE_IMAGE_ATTACHMENTS,
} from "../../services/imageAttachments";
import { deleteImageAttachments } from "../../services/imageAttachmentFiles";
import type { MessageImageAttachment } from "../../types";
import type { TranslateFn } from "./shared";

export function useMainScreenImageAttachments(params: {
  disabled: boolean;
  showError: (message: string) => void;
  t: TranslateFn;
}) {
  const { disabled, showError, t } = params;
  const [attachments, setAttachments] = useState<MessageImageAttachment[]>([]);
  const attachmentsRef = useRef(attachments);
  const disabledRef = useRef(disabled);
  const mountedRef = useRef(true);
  attachmentsRef.current = attachments;
  disabledRef.current = disabled;

  const appendPickerResult = useCallback(
    async (result: ImagePicker.ImagePickerResult) => {
      if (disabledRef.current || result.canceled) {
        return;
      }

      const remaining =
        MAX_MESSAGE_IMAGE_ATTACHMENTS - attachmentsRef.current.length;
      if (remaining <= 0) {
        showError(
          t("imageLimitReached", {
            count: MAX_MESSAGE_IMAGE_ATTACHMENTS,
          }),
        );
        return;
      }

      try {
        const created = await createMessageImageAttachments(
          result.assets.slice(0, remaining),
        );
        if (!mountedRef.current) {
          await deleteImageAttachments(created);
          return;
        }
        const current = attachmentsRef.current;
        const accepted = created.slice(
          0,
          MAX_MESSAGE_IMAGE_ATTACHMENTS - current.length,
        );
        void deleteImageAttachments(created.slice(accepted.length));
        const next = [...current, ...accepted];
        attachmentsRef.current = next;
        setAttachments(next);
      } catch {
        showError(t("imageProcessingFailed"));
      }
    },
    [showError, t],
  );

  useEffect(() => {
    let active = true;
    void ImagePicker.getPendingResultAsync()
      .then((result) => {
        if (!active || !result || "code" in result) {
          return;
        }
        void appendPickerResult(result);
      })
      .catch(() => {
        if (active) {
          showError(t("imageProcessingFailed"));
        }
      });
    return () => {
      active = false;
    };
  }, [appendPickerResult, showError, t]);

  const chooseFromPhotos = useCallback(async () => {
    try {
      const remaining =
        MAX_MESSAGE_IMAGE_ATTACHMENTS - attachmentsRef.current.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        base64: false,
        exif: false,
        mediaTypes: ["images"],
        orderedSelection: true,
        selectionLimit: remaining,
      });
      await appendPickerResult(result);
    } catch {
      showError(t("imageProcessingFailed"));
    }
  }, [appendPickerResult, showError, t]);

  const takePhoto = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showError(t("cameraPermissionRequired"));
        return;
      }
      await appendPickerResult(
        await ImagePicker.launchCameraAsync({
          base64: false,
          exif: false,
          mediaTypes: ["images"],
          quality: 1,
        }),
      );
    } catch {
      showError(t("imageProcessingFailed"));
    }
  }, [appendPickerResult, showError, t]);

  const handleAddImage = useCallback(() => {
    if (disabledRef.current) {
      return;
    }
    if (attachmentsRef.current.length >= MAX_MESSAGE_IMAGE_ATTACHMENTS) {
      showError(
        t("imageLimitReached", {
          count: MAX_MESSAGE_IMAGE_ATTACHMENTS,
        }),
      );
      return;
    }
    Alert.alert(t("chooseImageSource"), undefined, [
      { text: t("takePhoto"), onPress: () => void takePhoto() },
      {
        text: t("chooseFromPhotos"),
        onPress: () => void chooseFromPhotos(),
      },
      { text: t("dismiss"), style: "cancel" },
    ]);
  }, [chooseFromPhotos, showError, t, takePhoto]);

  const handleRemoveImage = useCallback((attachmentId: string) => {
    const current = attachmentsRef.current;
    const removed = current.filter(
      (attachment) => attachment.id === attachmentId,
    );
    const next = current.filter((attachment) => attachment.id !== attachmentId);
    attachmentsRef.current = next;
    setAttachments(next);
    void deleteImageAttachments(removed);
  }, []);

  const handleAttachmentsAccepted = useCallback((attachmentIds: string[]) => {
    const accepted = new Set(attachmentIds);
    const next = attachmentsRef.current.filter(
      (attachment) => !accepted.has(attachment.id),
    );
    attachmentsRef.current = next;
    setAttachments(next);
  }, []);

  const clearAttachments = useCallback(() => {
    const current = attachmentsRef.current;
    attachmentsRef.current = [];
    setAttachments([]);
    void deleteImageAttachments(current);
  }, []);

  useEffect(() => {
    if (disabled && attachmentsRef.current.length > 0) {
      clearAttachments();
    }
  }, [clearAttachments, disabled]);

  useEffect(
    () => () => {
      mountedRef.current = false;
      void deleteImageAttachments(attachmentsRef.current);
    },
    [],
  );

  return {
    attachments,
    clearAttachments,
    handleAddImage,
    handleAttachmentsAccepted,
    handleRemoveImage,
  };
}
