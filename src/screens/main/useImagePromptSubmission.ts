import { useCallback } from "react";

import { PROVIDER_LABELS } from "../../constants/models";
import type { VoiceCaptureRequest } from "../../hooks/useVoicePipeline";
import { cleanupCapturedAudio } from "../../services/voicePipeline/cleanup";
import type { MessageImageAttachment, Provider } from "../../types";
import { modelSupportsImageInput } from "../../utils/imageInputCapabilities";
import type { ShowToastFn, TranslateFn } from "./shared";

export function useImagePromptSubmission({
  imageRoutes,
  imageSharingBlockedMessage,
  onAddImage,
  pendingAttachments,
  runVoiceCapture,
  showToast,
  t,
}: {
  imageRoutes: readonly { model: string; provider: Provider }[];
  imageSharingBlockedMessage?: string | null;
  onAddImage: () => void;
  pendingAttachments: MessageImageAttachment[];
  runVoiceCapture: (request: VoiceCaptureRequest) => Promise<void>;
  showToast: ShowToastFn;
  t: TranslateFn;
}) {
  const unsupported = imageRoutes.find(
    ({ provider, model }) => !modelSupportsImageInput(provider, model),
  );
  const unsupportedMessage = unsupported
    ? t("imageInputUnsupported", {
        provider: PROVIDER_LABELS[unsupported.provider],
        model: unsupported.model,
      })
    : null;

  const handleAddImage = useCallback(() => {
    if (unsupportedMessage) {
      showToast(unsupportedMessage, undefined, "danger");
      return;
    }
    onAddImage();
  }, [onAddImage, showToast, unsupportedMessage]);

  const outboundBlock =
    unsupportedMessage ?? imageSharingBlockedMessage ?? null;
  const handleVoiceCaptureDone = useCallback(
    async (request: VoiceCaptureRequest) => {
      if (request.attachments?.length && outboundBlock) {
        showToast(outboundBlock, undefined, "danger");
        await cleanupCapturedAudio(request.audioUri);
        return;
      }
      // Only the outbound pipeline can determine who will receive an image.
      // Picking or submitting one locally never records permission to share it.
      await runVoiceCapture(request);
    },
    [outboundBlock, runVoiceCapture, showToast],
  );

  const handleRecordedVoiceCaptureDone = useCallback(
    (request: VoiceCaptureRequest) =>
      handleVoiceCaptureDone({
        ...request,
        ...(pendingAttachments.length
          ? { attachments: pendingAttachments }
          : {}),
      }),
    [handleVoiceCaptureDone, pendingAttachments],
  );

  return {
    handleAddImage,
    handleRecordedVoiceCaptureDone,
    handleVoiceCaptureDone,
    imageInputBlockMessage: pendingAttachments.length ? outboundBlock : null,
  };
}
