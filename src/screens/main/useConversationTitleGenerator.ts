import { useCallback, useEffect, useRef, useState } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import { generateConversationTitle } from "../../services/llm";
import { aiSharingTextMessage, hasAiSharingPermission, subscribeAiSharing } from "../../services/aiSharing";
import { authorizeConversationTitle } from "../../services/aiSharing/titles";
import type { AppLanguage, Conversation, Message, Provider } from "../../types";
import type { useConversations } from "../../hooks/useConversations";
import type { ShowToastFn, TranslateFn } from "./shared";

type RenameConversation = ReturnType<
  typeof useConversations
>["renameConversation"];
type GetConversationById = ReturnType<
  typeof useConversations
>["getConversationById"];

const CONVERSATION_TITLE_TIMEOUT_MS = 45_000;

interface UseConversationTitleGeneratorParams {
  activeConversation: Conversation | null;
  apiKey: string;
  autoNameConversations?: boolean;
  claimFirstPrompt?: (id: string) => Promise<string | null>;
  language: AppLanguage;
  model: string;
  modelEffort?: string;
  provider: Provider;
  providerReady: boolean;
  getConversationById: GetConversationById;
  renameConversation: RenameConversation;
  showToast: ShowToastFn;
  t: TranslateFn;
}

export function useConversationTitleGenerator({
  activeConversation,
  apiKey,
  autoNameConversations = true,
  claimFirstPrompt,
  language,
  model,
  modelEffort,
  provider,
  providerReady,
  getConversationById,
  renameConversation,
  showToast,
  t,
}: UseConversationTitleGeneratorParams) {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const automaticRequests = useRef(new Map<string, AbortController>());
  const requestRef = useRef<AbortController | null>(null);
  const activeConversationIdRef = useRef(activeConversation?.id ?? null);

  useEffect(() => {
    activeConversationIdRef.current = activeConversation?.id ?? null;
    requestRef.current?.abort();
    requestRef.current = null;
    setIsGeneratingTitle(false);
  }, [activeConversation?.id]);

  useEffect(() => {
    const requests = automaticRequests.current;
    return () => {
      for (const request of requests.values()) {
        request.abort();
      }
      requests.clear();
    };
  }, [autoNameConversations]);

  useEffect(
    () => () => {
      requestRef.current?.abort();
      requestRef.current = null;
    },
    [],
  );

  const hasConversationContent =
    activeConversation?.messages.some((message) => message.content.trim()) ??
    false;
  const canGenerateTitle =
    providerReady && hasConversationContent && !isGeneratingTitle;

  const handleGenerateTitleForConversation = useCallback(
    async (conversationId?: string) => {
      const conversation = conversationId
        ? activeConversation?.id === conversationId
          ? activeConversation
          : await getConversationById(conversationId)
        : activeConversation;
      const conversationHasContent =
        conversation?.messages.some((message) => message.content.trim()) ??
        false;

      if (!conversation || !conversationHasContent) {
        showToast(t("conversationTitleNeedsContent"));
        return;
      }

      if (!providerReady) {
        showToast(t("conversationTitleNeedsProvider"));
        return;
      }

      automaticRequests.current.get(conversation.id)?.abort();
      requestRef.current?.abort();
      const request = new AbortController();
      let timedOut = false;
      let timeout: ReturnType<typeof setTimeout> | undefined;
      let unsubscribe: (() => void) | undefined;
      requestRef.current = request;
      setIsGeneratingTitle(true);

      recordDebugLogEvent({
        event: "conversation-title-generation-started",
        payload: {
          conversationId: conversation.id,
          messageCount: conversation.messages.length,
          model,
          provider,
        },
      });

      try {
        const sharing = await authorizeConversationTitle(conversation, provider, model, request.signal);
        if (!sharing || request.signal.aborted) return;
        const checkPermission = () => {
          if (!sharing.authorization.allows(provider, "titles") ||
            (sharing.usesHistory && !hasAiSharingPermission(provider, "history", model))) request.abort();
        };
        unsubscribe = subscribeAiSharing(checkPermission);
        checkPermission();
        if (request.signal.aborted) return;
        timeout = setTimeout(() => { timedOut = true; request.abort(); }, CONVERSATION_TITLE_TIMEOUT_MS);
        const title = await generateConversationTitle({
          messages: sharing.messages,
          model,
          modelEffort,
          provider,
          apiKey,
          language,
          abortSignal: request.signal,
        });

        if (
          request.signal.aborted ||
          (!conversationId &&
            activeConversationIdRef.current !== conversation.id)
        ) {
          return;
        }

        await renameConversation(conversation.id, title);
        showToast(t("conversationTitleGenerated"), undefined, "success");
        recordDebugLogEvent({
          event: "conversation-title-generation-completed",
          payload: {
            conversationId: conversation.id,
            model,
            provider,
          },
        });
      } catch (error) {
        const aborted =
          request.signal.aborted ||
          (error instanceof Error && error.name === "AbortError");

        if (aborted && !timedOut) {
          return;
        }

        recordDebugLogEvent({
          event: "conversation-title-generation-failed",
          level: "error",
          payload: {
            conversationId: conversation.id,
            error,
            model,
            provider,
          },
        });
        showToast(
          t(
            timedOut
              ? "conversationTitleGenerationTimedOut"
              : "conversationTitleGenerationFailed",
          ),
          undefined,
          "danger",
        );
      } finally {
        unsubscribe?.();
        clearTimeout(timeout);
        if (requestRef.current === request) {
          requestRef.current = null;
          setIsGeneratingTitle(false);
        }
      }
    },
    [
      activeConversation,
      apiKey,
      getConversationById,
      language,
      model,
      modelEffort,
      provider,
      providerReady,
      renameConversation,
      showToast,
      t,
    ],
  );

  const handlePromptSubmitted = useCallback(
    async (id: string, prompt: Message) => {
      if (!claimFirstPrompt) return;
      const request = new AbortController();
      try {
        // Consume the first dispatch even when naming is disabled for this session.
        // A later prompt must leave an in-flight title request alone.
        const titleClaim = claimFirstPrompt(id);
        if (
          !autoNameConversations ||
          !providerReady ||
          !hasAiSharingPermission(provider, "titles", model) ||
          !hasAiSharingPermission(provider, "prompt", model) ||
          !prompt.content.trim() ||
          automaticRequests.current.has(id)
        ) {
          await titleClaim;
          return;
        }

        automaticRequests.current.set(id, request);
        const expectedTitle = await titleClaim;
        if (expectedTitle === null || request.signal.aborted) return;
        const checkPermission = () => {
          if (!hasAiSharingPermission(provider, "titles", model) || !hasAiSharingPermission(provider, "prompt", model)) request.abort();
        };
        const unsubscribe = subscribeAiSharing(checkPermission);
        const timeout = setTimeout(
          () => request.abort(),
          CONVERSATION_TITLE_TIMEOUT_MS,
        );
        try {
          checkPermission();
          if (request.signal.aborted) return;
          const title = await generateConversationTitle({
            messages: [aiSharingTextMessage(prompt)],
            model,
            modelEffort,
            provider,
            apiKey,
            language,
            abortSignal: request.signal,
          });
          if (!request.signal.aborted && title.trim()) {
            await renameConversation(id, title, expectedTitle);
          }
        } finally {
          unsubscribe();
          clearTimeout(timeout);
        }
      } catch (error) {
        if (!request.signal.aborted) {
          recordDebugLogEvent({
            event: "conversation-title-generation-failed",
            level: "warn",
            payload: { conversationId: id, error, model, provider },
          });
        }
      } finally {
        if (automaticRequests.current.get(id) === request) {
          automaticRequests.current.delete(id);
        }
      }
    },
    [
      apiKey,
      autoNameConversations,
      claimFirstPrompt,
      language,
      model,
      modelEffort,
      provider,
      providerReady,
      renameConversation,
    ],
  );

  const handleGenerateTitle = useCallback(
    () => handleGenerateTitleForConversation(),
    [handleGenerateTitleForConversation],
  );

  return {
    canGenerateTitle,
    handlePromptSubmitted,
    handleGenerateTitle,
    handleGenerateTitleForConversation,
    isGeneratingTitle,
  };
}
