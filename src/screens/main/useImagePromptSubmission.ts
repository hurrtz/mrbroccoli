import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

function getContextualMessages(
  conversation: Conversation | null,
  messages = conversation?.messages ?? [],
) {
  const canReuseSummary = hasCurrentConversationSummaryProvenance(
    conversation?.contextSummary,
  );
  return buildConversationContextPlan({
    messages,
    contextSummary: canReuseSummary
      ? getConversationSummaryBody(conversation?.contextSummary)
      : "",
    summarizedMessageCount: canReuseSummary
      ? conversation?.summarizedMessageCount
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
  const [consent, setConsent] = useState<{
    message: string;
    title: string;
  } | null>(null);
  const consentResolverRef = useRef<((confirmed: boolean) => void) | null>(
    null,
  );
  const settleConsent = useCallback((confirmed: boolean) => {
    const resolve = consentResolverRef.current;
    consentResolverRef.current = null;
    setConsent(null);
    resolve?.(confirmed);
  }, []);
  const requestConsent = useCallback((title: string, message: string) => {
    consentResolverRef.current?.(false);
    return new Promise<boolean>((resolve) => {
      consentResolverRef.current = resolve;
      setConsent({ message, title });
    });
  }, []);
  useEffect(
    () => () => {
      consentResolverRef.current?.(false);
      consentResolverRef.current = null;
    },
    [],
  );
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
      const conversationMessages =
        request.messagesOverride ?? conversation?.messages ?? [];
      const requestContextualMessages = getContextualMessages(
        conversation,
        conversationMessages,
      );
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
      const historicalIds = new Set(
        requestContextualMessages.flatMap((message) =>
          (message.attachments ?? []).map(({ id }) => id),
        ),
      );
      const checkpoint = request.existingUserMessageId
        ? conversation?.messages.find(
            ({ id }) => id === request.existingUserMessageId,
          )
        : undefined;
      for (const attachment of checkpoint?.attachments ?? []) {
        historicalIds.add(attachment.id);
      }
      const needsDisclosure = allAttachments.some(
        (attachment) =>
          (historicalIds.has(attachment.id) || recipientProviders.length > 1) &&
          recipientProviders.some(
            (recipient) => !attachment.sharedWithProviders.includes(recipient),
          ),
      );

      if (needsDisclosure) {
        const confirmed = await requestConsent(
          params.t("imageProviderConsentTitle"),
          params.t("imageProviderConsentMessage", {
            providers: recipientProviders
              .map((recipient) => PROVIDER_LABELS[recipient])
              .join(", "),
          }),
        );
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
      const outboundIds = new Set(allAttachments.map(({ id }) => id));
      const authorizeMessage = (message: Message): Message => ({
        ...message,
        attachments: message.attachments?.map((attachment) =>
          outboundIds.has(attachment.id) ? authorize(attachment) : attachment,
        ),
      });
      const messagesOverride = conversationMessages.map((message) => {
        if (
          !contextualMessageIds.has(message.id) ||
          !message.attachments?.length
        ) {
          return message;
        }
        params.updateMessage(message.id, authorizeMessage);
        return authorizeMessage(message);
      });
      if (
        checkpoint?.attachments?.some(({ id }) => outboundIds.has(id)) &&
        !contextualMessageIds.has(checkpoint.id)
      ) {
        params.updateMessage(checkpoint.id, authorizeMessage);
      }

      await params.runVoiceCapture({
        ...request,
        attachments: request.attachments?.map(authorize),
        messagesOverride,
      });
    },
    [params, requestConsent, unsupportedRoute],
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
    cancelConsent: () => settleConsent(false),
    confirmConsent: () => settleConsent(true),
    consent,
    handleAddImage,
    handleRecordedVoiceCaptureDone,
    handleVoiceCaptureDone,
    imageInputBlockMessage,
  };
}
