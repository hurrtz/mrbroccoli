import type { Message, Provider, UsageEstimate } from "../../types";
import {
  getAiSharingHistory,
  loadAiSharingHistory,
  recordAiSharingMessages,
  requestAiSharing,
  subscribeAiSharing,
  type AiSharingAuthorization,
  type AiSharingNeed,
} from "../aiSharing";
import type { RunVoicePipelineParams } from "./types";

export function watchAiSharing(
  authorization: AiSharingAuthorization,
  needs: readonly AiSharingNeed[],
  parent?: AbortSignal,
) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const check = () => {
    if (
      needs.some(
        ({ provider, purpose }) => !authorization.allows(provider, purpose),
      )
    ) {
      abort();
    }
  };
  const unsubscribe = subscribeAiSharing(check);
  parent?.addEventListener("abort", abort);
  if (parent?.aborted) abort();
  check();
  return {
    signal: controller.signal,
    close: () => {
      unsubscribe();
      parent?.removeEventListener("abort", abort);
    },
  };
}

export async function authorizeTurn(params: RunVoicePipelineParams) {
  const { provider, ulraMode, webSearchProvider, ttsProvider, sttProvider } =
    params;
  const recipients = [
    ...new Set([
      provider,
      ...(ulraMode?.routes.map((route) => route.provider) ?? []),
    ]),
  ];
  const openRouterModels = [
    ...new Set([
      ...(provider === "openrouter" ? [params.model] : []),
      ...(ulraMode?.routes
        .filter((route) => route.provider === "openrouter")
        .map((route) => route.model) ?? []),
    ]),
  ];
  const required: AiSharingNeed[] = [];
  const optional: AiSharingNeed[] = [];
  const imageCount = params.attachments?.length ?? 0;
  if (params.autoTitleEligible) optional.push({ provider, purpose: "titles" });
  for (const recipient of recipients) {
    required.push({ provider: recipient, purpose: "prompt" });
    if (ulraMode) required.push({ provider: recipient, purpose: "council" });
    if (imageCount) required.push({ provider: recipient, purpose: "images" });
    optional.push({ provider: recipient, purpose: "history" });
    if (params.pastConversationKnowledgeEnabled) {
      optional.push({ provider: recipient, purpose: "knowledge" });
    }
  }
  if (
    params.audioUri &&
    !params.transcriptionOverride?.trim() &&
    params.sttMode === "provider" &&
    sttProvider
  ) {
    required.push({ provider: sttProvider, purpose: "transcription" });
  }
  if (
    params.webSearchMode === "on" &&
    webSearchProvider &&
    params.webSearchApiKey?.trim()
  ) {
    optional.push({ provider: webSearchProvider, purpose: "search" });
    if (params.messages.length && !recipients.includes(webSearchProvider)) {
      optional.push({ provider: webSearchProvider, purpose: "history" });
    }
  }
  if (
    params.spokenRepliesEnabled !== false &&
    params.ttsMode === "provider" &&
    ttsProvider
  ) {
    optional.push({ provider: ttsProvider, purpose: "speech" });
  }
  const authorization = await requestAiSharing(
    {
      required,
      optional,
      ...(imageCount ? { imageCount } : {}),
      ...(openRouterModels.length ? { openRouterModels } : {}),
      ...(ulraMode
        ? {
            council: {
              providers: recipients,
              synthesisProvider: provider,
              synthesisModel: params.model,
            },
          }
        : {}),
    },
    params.abortSignal,
  );
  if (
    !authorization ||
    required.some(
      ({ provider: target, purpose }) => !authorization.allows(target, purpose),
    )
  ) {
    return null;
  }
  const guard = watchAiSharing(
    authorization,
    [
      ...required,
      ...optional.filter(({ provider: target, purpose }) =>
        authorization.allows(target, purpose),
      ),
    ],
    params.abortSignal,
  );
  return { authorization, recipients, openRouterModels, guard };
}

// A rolling summary is generated text, separate from message history. Bind its
// local receipt to its exact inputs so edited or restored summaries cannot
// reintroduce unapproved text through the compaction shortcut.
function summaryReceipt(summary: string, sources: readonly Message[]): Message {
  return {
    id: "ai-sharing:conversation-summary",
    role: "assistant",
    content: JSON.stringify([
      summary,
      sources.map(({ id, role, content, model, provider }) => [
        id,
        role,
        content,
        model,
        provider,
      ]),
    ]),
    model: null,
    provider: null,
    timestamp: "",
  };
}

export function getPermittedTurnHistory(
  conversationId: string | null | undefined,
  messages: readonly Message[],
  recipients: readonly Provider[],
  authorization: AiSharingAuthorization,
  openRouterModels?: readonly string[],
) {
  if (
    !conversationId ||
    recipients.some((provider) => !authorization.allows(provider, "history"))
  ) {
    return [];
  }
  return getAiSharingHistory(
    conversationId,
    messages,
    recipients,
    openRouterModels,
  );
}

export async function prepareSharedContext(
  params: RunVoicePipelineParams,
  conversationId: string | null | undefined,
  recipients: readonly Provider[],
  authorization: AiSharingAuthorization,
  openRouterModels: readonly string[],
) {
  let history: Message[] = [];
  if (conversationId) {
    try {
      await loadAiSharingHistory(conversationId);
      history = getPermittedTurnHistory(
        conversationId,
        params.messages,
        recipients,
        authorization,
        openRouterModels,
      );
    } catch {
      // A receipt that cannot be read conveys no access to earlier text.
    }
  }
  const fullHistory =
    Boolean(conversationId) && history.length === params.messages.length;
  const covered = params.summarizedMessageCount ?? 0;
  const savedSummary = params.contextSummary;
  const reuse = Boolean(
    fullHistory &&
      savedSummary &&
      covered > 0 &&
      covered <= history.length &&
      getPermittedTurnHistory(
        conversationId,
        [summaryReceipt(savedSummary, history.slice(0, covered))],
        recipients,
        authorization,
        openRouterModels,
      ).length,
  );
  return {
    history,
    summary: reuse ? savedSummary : undefined,
    covered: reuse ? covered : undefined,
    saveSummary: async (
      summary: string,
      count: number,
      usage?: UsageEstimate,
    ) => {
      if (!fullHistory || !conversationId || !params.callbacks.onContextSummary)
        return;
      await params.callbacks.onContextSummary(summary, count, usage);
      await recordAiSharingMessages(
        conversationId,
        [summaryReceipt(summary, history.slice(0, count))],
        [params.provider],
        params.model,
      );
    },
  };
}
