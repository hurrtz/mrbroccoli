import { useCallback, useEffect, useRef, useState } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import { generateConversationTitle } from "../../services/llm";
import type { AppLanguage, Conversation, Provider } from "../../types";
import type { useConversations } from "../../hooks/useConversations";
import type { ShowToastFn, TranslateFn } from "./shared";

type RenameConversation = ReturnType<
  typeof useConversations
>["renameConversation"];

const CONVERSATION_TITLE_TIMEOUT_MS = 45_000;

interface UseConversationTitleGeneratorParams {
  activeConversation: Conversation | null;
  apiKey: string;
  language: AppLanguage;
  model: string;
  modelEffort?: string;
  provider: Provider;
  providerReady: boolean;
  renameConversation: RenameConversation;
  showToast: ShowToastFn;
  t: TranslateFn;
}

export function useConversationTitleGenerator({
  activeConversation,
  apiKey,
  language,
  model,
  modelEffort,
  provider,
  providerReady,
  renameConversation,
  showToast,
  t,
}: UseConversationTitleGeneratorParams) {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const activeConversationIdRef = useRef(activeConversation?.id ?? null);

  useEffect(() => {
    activeConversationIdRef.current = activeConversation?.id ?? null;
    requestRef.current?.abort();
    requestRef.current = null;
    setIsGeneratingTitle(false);
  }, [activeConversation?.id]);

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

  const handleGenerateTitle = useCallback(async () => {
    const conversation = activeConversation;

    if (!conversation || !hasConversationContent) {
      showToast(t("conversationTitleNeedsContent"));
      return;
    }

    if (!providerReady) {
      showToast(t("conversationTitleNeedsProvider"));
      return;
    }

    requestRef.current?.abort();
    const request = new AbortController();
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      request.abort();
    }, CONVERSATION_TITLE_TIMEOUT_MS);
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
      const title = await generateConversationTitle({
        messages: conversation.messages,
        contextSummary: conversation.contextSummary,
        summarizedMessageCount: conversation.summarizedMessageCount,
        model,
        modelEffort,
        provider,
        apiKey,
        language,
        abortSignal: request.signal,
      });

      if (
        request.signal.aborted ||
        activeConversationIdRef.current !== conversation.id
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
      clearTimeout(timeout);
      if (requestRef.current === request) {
        requestRef.current = null;
        setIsGeneratingTitle(false);
      }
    }
  }, [
    activeConversation,
    apiKey,
    hasConversationContent,
    language,
    model,
    modelEffort,
    provider,
    providerReady,
    renameConversation,
    showToast,
    t,
  ]);

  return {
    canGenerateTitle,
    handleGenerateTitle,
    isGeneratingTitle,
  };
}
