import { useCallback, useMemo } from "react";
import { Alert } from "react-native";

import { PROVIDER_LABELS } from "../../constants/models";
import type { VoiceCaptureRequest } from "../../hooks/useVoicePipeline";
import {
  buildConversationContextPlan,
  getConversationSummaryBody,
  hasCurrentConversationSummaryProvenance,
} from "../../services/conversationContext";
import { cleanupCapturedAudio } from "../../services/voicePipeline/cleanup";
import type {
  Conversation,
  Message,
  MessageImageAttachment,
  Provider,
} from "../../types";
import { modelSupportsImageInput } from "../../utils/imageInputCapabilities";
import type { ShowToastFn, TranslateFn } from "./shared";

interface ImagePromptRoute {
  model: string;
  provider: Provider;
}

function getContextualMessages(conversation: Conversation | null) {
  if (!conversation) {
    return [];
  }

  const canReuseSummary = hasCurrentConversationSummaryProvenance(
    conversation.contextSummary,
  );
  return buildConversationContextPlan({
    messages: conversation.messages,
    contextSummary: canReuseSummary
      ? getConversationSummaryBody(conversation.contextSummary)
      : "",
    summarizedMessageCount: canReuseSummary
      ? conversation.summarizedMessageCount
      : 0,
  }).recentMessages;
}

export function useImagePromptSubmission(params: {
  activeConversation: Conversation | null;
  imagesEnabled: boolean;
  imageRoutes: ImagePromptRoute[];
  onAddImage: () => void;
  pendingAttachments: MessageImageAttachment[];
  runVoiceCapture: (request: VoiceCaptureRequest) => Promise<void>;
  showToast: ShowToastFn;
  t: TranslateFn;
  updateMessage: (
    messageId: string,
    updater: (message: Message) => Message,
  ) => Message | null;
}) {
  const unsupportedRoute = useMemo(
    () =>
      !params.imagesEnabled
        ? null
        : (params.imageRoutes.find(
            (route) => !modelSupportsImageInput(route.provider, route.model),
          ) ?? null),
    [params.imageRoutes, params.imagesEnabled],
  );
  const contextualMessages = useMemo(
    () => getContextualMessages(params.activeConversation),
    [params.activeConversation],
  );
  const hasConversationImages =
    params.imagesEnabled &&
    Boolean(
      contextualMessages.some(
        (message) => (message.attachments?.length ?? 0) > 0,
      ),
    );
  const imageInputBlockMessage =
    unsupportedRoute &&
    (params.pendingAttachments.length > 0 || hasConversationImages)
      ? params.t("imageInputUnsupported", {
          provider: PROVIDER_LABELS[unsupportedRoute.provider],
          model: unsupportedRoute.model,
        })
      : null;

  const handleAddImage = useCallback(() => {
    if (!params.imagesEnabled) {
      return;
    }
    if (unsupportedRoute) {
      params.showToast(
        params.t("imageInputUnsupported", {
          provider: PROVIDER_LABELS[unsupportedRoute.provider],
          model: unsupportedRoute.model,
        }),
        undefined,
        "danger",
      );
      return;
    }
    params.onAddImage();
  }, [params, unsupportedRoute]);

  const handleVoiceCaptureDone = useCallback(
    async (request: VoiceCaptureRequest) => {
      const conversation =
        request.conversationOverride ?? params.activeConversation;
      const requestContextualMessages = getContextualMessages(conversation);
      const conversationMessages =
        request.messagesOverride ?? conversation?.messages ?? [];
      const contextualMessageIds = new Set(
        requestContextualMessages.map((message) => message.id),
      );
      const allAttachments = params.imagesEnabled
        ? [
            ...requestContextualMessages.flatMap(
              (message) => message.attachments ?? [],
            ),
            ...(request.attachments ?? []),
          ]
        : [];
      if (allAttachments.length === 0) {
        await params.runVoiceCapture(request);
        return;
      }

      if (unsupportedRoute) {
        params.showToast(
          params.t("imageInputUnsupported", {
            provider: PROVIDER_LABELS[unsupportedRoute.provider],
            model: unsupportedRoute.model,
          }),
          undefined,
          "danger",
        );
        await cleanupCapturedAudio(request.audioUri);
        return;
      }

      const recipientProviders = [
        ...new Set(params.imageRoutes.map((route) => route.provider)),
      ];
      const pendingIds = new Set(
        (request.attachments ?? []).map((attachment) => attachment.id),
      );
      const hasHistoricalImage = allAttachments.some(
        (attachment) => !pendingIds.has(attachment.id),
      );
      const hasNewRecipient = allAttachments.some((attachment) =>
        recipientProviders.some(
          (recipient) => !attachment.sharedWithProviders.includes(recipient),
        ),
      );

      if (
        hasNewRecipient &&
        (hasHistoricalImage || recipientProviders.length > 1)
      ) {
        const confirmed = await new Promise<boolean>((resolve) => {
          Alert.alert(
            params.t("imageProviderConsentTitle"),
            params.t("imageProviderConsentMessage", {
              providers: recipientProviders
                .map((recipient) => PROVIDER_LABELS[recipient])
                .join(", "),
            }),
            [
              {
                text: params.t("dismiss"),
                style: "cancel",
                onPress: () => resolve(false),
              },
              {
                text: params.t("imageProviderConsentConfirm"),
                onPress: () => resolve(true),
              },
            ],
            { cancelable: false },
          );
        });
        if (!confirmed) {
          await cleanupCapturedAudio(request.audioUri);
          return;
        }
      }

      const authorize = (attachment: MessageImageAttachment) => ({
        ...attachment,
        sharedWithProviders: [
          ...new Set([
            ...attachment.sharedWithProviders,
            ...recipientProviders,
          ]),
        ],
      });
      const messagesOverride = conversationMessages.map((message) => {
        if (
          !contextualMessageIds.has(message.id) ||
          !message.attachments?.length
        ) {
          return message;
        }
        const nextMessage = {
          ...message,
          attachments: message.attachments.map(authorize),
        };
        params.updateMessage(message.id, () => nextMessage);
        return nextMessage;
      });

      await params.runVoiceCapture({
        ...request,
        attachments: request.attachments?.map(authorize),
        messagesOverride,
      });
    },
    [params, unsupportedRoute],
  );

  const handleRecordedVoiceCaptureDone = useCallback(
    (request: VoiceCaptureRequest) =>
      handleVoiceCaptureDone({
        ...request,
        ...(params.pendingAttachments.length > 0
          ? { attachments: params.pendingAttachments }
          : {}),
      }),
    [handleVoiceCaptureDone, params.pendingAttachments],
  );

  return {
    handleAddImage,
    handleRecordedVoiceCaptureDone,
    handleVoiceCaptureDone,
    imageInputBlockMessage,
  };
}
