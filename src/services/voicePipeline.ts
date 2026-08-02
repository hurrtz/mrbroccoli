import type { Message, UsageEstimate } from "../types";
import { translate } from "../i18n";
import { recordDebugLogEvent } from "./debugLogCapture";
import {
  getUlraModeFailureParticipants,
  runUlraModeDeliberation,
} from "./ulraMode";
import { getProviderCircuitState } from "./providerResilience";
import { cleanupCapturedAudio } from "./voicePipeline/cleanup";
import { resolveContextualMessages } from "./voicePipeline/context";
import { runPipelineResponse } from "./voicePipeline/response";
import { createVoicePipelineTtsQueue } from "./voicePipeline/ttsQueue";
import { resolvePipelineTranscription } from "./voicePipeline/transcription";
import type { RunVoicePipelineParams } from "./voicePipeline/types";
import { resolvePipelineWebSearch } from "./voicePipeline/webSearch";
import { createTurnReceipt } from "./turnReceipt";
import { retrieveConversationKnowledge } from "./conversationKnowledge";

export async function runVoicePipeline(
  params: RunVoicePipelineParams,
): Promise<string | null> {
  const {
    turnId,
    turnStartedAtMs = Date.now(),
    audioUri,
    transcriptionOverride,
    messages,
    model,
    provider,
    providerApiKey,
    sttMode,
    sttLanguage,
    sttProvider,
    sttApiKey,
    sttModel,
    ttsMode,
    ttsProvider,
    ttsApiKey,
    ttsModel,
    ttsVoice,
    kokoroVoices,
    ttsFallbackRoutes,
    ttsInstructions,
    ttsListenLanguages,
    replyPlayback,
    spokenRepliesEnabled = true,
    contextSummary,
    summarizedMessageCount,
    currentConversationId,
    privateConversationIds,
    pastConversationKnowledgeEnabled = false,
    assistantInstructions,
    responseLength,
    responseTone,
    modelEffort,
    language,
    webSearchMode,
    webSearchProvider,
    webSearchApiKey,
    webSearchOptions,
    ulraMode,
    callbacks,
    abortSignal,
  } = params;

  const recordTurnEvent = (
    event: Parameters<typeof recordDebugLogEvent>[0],
  ) =>
    recordDebugLogEvent({
      ...event,
      payload: { ...event.payload, turnId },
    });

  let transcription: string | null = null;
  let retainCapturedAudio = false;
  let terminalRecorded = false;
  const recordRunTerminal = (
    status: "aborted" | "complete" | "failed",
    payload: Record<string, unknown> = {},
  ) => {
    if (terminalRecorded) return;
    terminalRecorded = true;
    recordTurnEvent({
      event:
        status === "complete"
          ? "voice-pipeline-run-complete"
          : status === "aborted"
            ? "voice-pipeline-aborted"
            : "voice-pipeline-run-failed",
      level: status === "failed" ? "error" : "info",
      payload,
    });
  };
  const effectiveWebSearchMode = webSearchMode ?? "off";
  const turnReceipt = createTurnReceipt({
    startedAtMs: turnStartedAtMs,
    inputSource: transcriptionOverride ? "text" : "voice",
    sttMode,
    sttProvider,
    sttModel,
    provider,
    model,
    modelEffort,
    language,
    spokenRepliesEnabled,
    ttsMode,
    ttsProvider,
    ttsModel,
    ttsVoice,
    webSearchMode: effectiveWebSearchMode,
    webSearchProvider,
  });

  try {
    recordTurnEvent({
      event: "voice-pipeline-run-start",
      payload: {
        hasAudioUri: !!audioUri,
        hasTranscriptionOverride: !!transcriptionOverride,
        replyPlayback,
        sttMode,
        ttsMode,
      },
    });

    const transcriptionStartedAtMs = Date.now();
    try {
      transcription = await resolvePipelineTranscription({
        abortSignal,
        audioUri,
        language,
        speechLanguage: sttLanguage,
        sttApiKey,
        sttMode,
        sttModel,
        sttProvider,
        transcriptionOverride,
        onModelResolved: (actualModel) => {
          turnReceipt.input.model = actualModel;
        },
      });
    } catch (error) {
      retainCapturedAudio = Boolean(audioUri && !abortSignal?.aborted);
      throw error;
    } finally {
      turnReceipt.timing.transcriptionMs =
        Date.now() - transcriptionStartedAtMs;
    }

    if (!transcription) {
      retainCapturedAudio = Boolean(audioUri && !abortSignal?.aborted);
      recordTurnEvent({
        event: "voice-pipeline-run-empty-transcription",
        level: "warn",
        payload: {
          retainedCapturedAudio: retainCapturedAudio,
        },
      });
      recordRunTerminal("failed", { reason: "empty-transcription" });
      return null;
    }
    if (abortSignal?.aborted) {
      recordTurnEvent({
        event: "voice-pipeline-run-aborted-after-transcription",
      });
      recordRunTerminal("aborted", { reason: "after-transcription" });
      return transcription;
    }

    callbacks.onTranscription(transcription);
    if (abortSignal?.aborted) {
      recordTurnEvent({
        event: "voice-pipeline-run-aborted-after-onTranscription",
      });
      recordRunTerminal("aborted", { reason: "after-transcription-callback" });
      return transcription;
    }

    const contextStartedAtMs = Date.now();
    const contextResult = await resolveContextualMessages({
      abortSignal,
      callbacks,
      contextSummary,
      language,
      messages,
      model,
      provider,
      providerApiKey,
      summarizedMessageCount,
    });
    turnReceipt.timing.contextMs = Date.now() - contextStartedAtMs;
    turnReceipt.context = contextResult.receipt;

    if (contextResult.aborted) {
      recordTurnEvent({
        event: "voice-pipeline-run-context-aborted",
      });
      recordRunTerminal("aborted", { reason: "context" });
      return transcription;
    }

    turnReceipt.context.pastKnowledgeRequested =
      pastConversationKnowledgeEnabled;
    const pastKnowledgeStartedAtMs = pastConversationKnowledgeEnabled
      ? Date.now()
      : null;
    const pastKnowledgeQuery = [
      transcription,
      ...contextResult.contextualMessages
        .slice(-4)
        .map((message) => message.content),
    ].join("\n\n");
    const pastKnowledgeResult = pastConversationKnowledgeEnabled
      ? await retrieveConversationKnowledge({
          currentConversationId,
          privateConversationIds,
          query: pastKnowledgeQuery,
        })
      : null;
    if (pastKnowledgeStartedAtMs !== null) {
      turnReceipt.timing.pastKnowledgeMs =
        Date.now() - pastKnowledgeStartedAtMs;
    }
    turnReceipt.context.pastKnowledgeUsed = Boolean(pastKnowledgeResult);
    turnReceipt.context.pastKnowledgeSourceCount =
      pastKnowledgeResult?.metadata.sources.length ?? 0;

    if (abortSignal?.aborted) {
      recordRunTerminal("aborted", { reason: "past-conversation-knowledge" });
      return transcription;
    }

    const webSearchResult = await resolvePipelineWebSearch({
      turnId,
      abortSignal,
      callbacks,
      conversationSummary: contextResult.effectiveSummary || undefined,
      language,
      messages,
      mode: effectiveWebSearchMode,
      provider: webSearchProvider,
      apiKey: webSearchApiKey,
      options: webSearchOptions,
      transcription,
      turnReceipt,
    });

    if (webSearchResult.aborted) {
      recordRunTerminal("aborted", { reason: "web-search" });
      return transcription;
    }

    const allMessages: Message[] = [
      ...contextResult.contextualMessages,
      {
        id: "pending",
        role: "user",
        content: transcription,
        model: null,
        provider: null,
        timestamp: new Date().toISOString(),
      },
    ];
    const modelStartedAtMs = Date.now();
    let additionalUsage: UsageEstimate | undefined;
    let responseMetadata = {
      ...webSearchResult.responseMetadata,
      ...(pastKnowledgeResult
        ? { conversationKnowledge: pastKnowledgeResult.metadata }
        : {}),
    };
    let synthesisContext: string | undefined;
    let synthesisModel = model;
    let synthesisModelEffort = modelEffort;
    let synthesisProvider = provider;
    let synthesisProviderApiKey = providerApiKey;

    if (ulraMode) {
      callbacks.onLlmStart?.();
      const deliberation = await runUlraModeDeliberation({
        abortSignal,
        assistantInstructions,
        config: ulraMode,
        conversationSummary: contextResult.effectiveSummary || undefined,
        pastConversationKnowledge: pastKnowledgeResult?.context,
        language,
        messages: allMessages,
        webSearchContext: webSearchResult.context,
      });

      if (abortSignal?.aborted) {
        recordTurnEvent({
          event: "voice-pipeline-ulra-mode-aborted",
        });
        recordRunTerminal("aborted", { reason: "ulra-mode" });
        return transcription;
      }

      additionalUsage = deliberation.estimatedUsage;
      synthesisContext = deliberation.synthesisPrompt;
      if (getProviderCircuitState(provider, "llm")) {
        const successfulModeIds = new Set(
          deliberation.entries.map(({ modeId }) => modeId),
        );
        const fallbackRoute = ulraMode.routes.find(
          (route) =>
            successfulModeIds.has(route.modeId) &&
            !getProviderCircuitState(route.provider, "llm"),
        );

        if (fallbackRoute) {
          synthesisModel = fallbackRoute.model;
          synthesisModelEffort = fallbackRoute.modelEffort;
          synthesisProvider = fallbackRoute.provider;
          synthesisProviderApiKey = fallbackRoute.apiKey;
          recordTurnEvent({
            event: "ulra-mode-synthesis-route-fallback",
            level: "warn",
            payload: {
              fallbackModel: synthesisModel,
              fallbackProvider: synthesisProvider,
              requestedModel: model,
              requestedProvider: provider,
            },
          });
        }
      }
      const retiredParticipants = deliberation.retiredParticipants ?? 0;
      callbacks.onUlraModeComplete?.({
        failedCalls: deliberation.failures.length,
        outcome:
          retiredParticipants > 0
            ? "retired"
            : deliberation.failures.length > 0
              ? "degraded"
              : "full",
        retiredParticipants,
        successfulCalls: deliberation.entries.length,
      });
      const partialFailureNotice =
        deliberation.failures.length > 0
          ? {
              stage: "ulra" as const,
              level: "warning" as const,
              message: translate(
                language,
                "ulraModePartialFailureNotice",
                {
                  failed: deliberation.failures.length,
                  succeeded: deliberation.entries.length,
                },
              ),
              detail: getUlraModeFailureParticipants(
                deliberation.failures,
              ).join(", "),
            }
          : null;

      responseMetadata = {
        ...responseMetadata,
        notices: [
          ...(responseMetadata.notices ?? []),
          ...(partialFailureNotice ? [partialFailureNotice] : []),
        ],
        ulraMode: {
          convergenceReached: deliberation.convergenceReached,
          contributions: deliberation.entries.map(
            ({
              modeId,
              model: entryModel,
              provider: entryProvider,
              round,
              usage,
            }) => ({
              modeId,
              model: entryModel,
              provider: entryProvider,
              round,
              usage,
            }),
          ),
          estimatedIntermediateTokens:
            deliberation.estimatedUsage.totalTokens,
          failedCalls: deliberation.failures.length,
          failures: deliberation.failures.map(
            ({
              modeId,
              model: failedModel,
              provider: failedProvider,
              round,
            }) => ({
              modeId,
              model: failedModel,
              provider: failedProvider,
              round,
            }),
          ),
          retiredParticipants,
          roundsCompleted: deliberation.roundsCompleted,
          roundsRequested: ulraMode.rounds,
          successfulCalls: deliberation.entries.length,
        },
      };
    }

    const ttsQueue = createVoicePipelineTtsQueue({
      turnId,
      abortSignal,
      callbacks,
      language,
      replyPlayback,
      spokenRepliesEnabled,
      ttsApiKey,
      kokoroVoices,
      ttsFallbackRoutes,
      ttsListenLanguages,
      ttsMode,
      ttsModel,
      ttsProvider,
      ttsVoice,
      ttsInstructions,
    });

    const llmCompleted = await runPipelineResponse({
      turnId,
      abortSignal,
      additionalUsage,
      assistantInstructions,
      callbacks,
      conversationSummary: contextResult.effectiveSummary || undefined,
      pastConversationKnowledge: pastKnowledgeResult?.context,
      language,
      llmAlreadyStarted: Boolean(ulraMode),
      messages: allMessages,
      model: synthesisModel,
      modelStartedAtMs,
      modelEffort: synthesisModelEffort,
      provider: synthesisProvider,
      providerApiKey: synthesisProviderApiKey,
      responseLength,
      responseMetadata,
      responseTone,
      replyPlayback,
      spokenRepliesEnabled,
      synthesisContext,
      ttsQueue,
      turnReceipt,
      turnStartedAtMs,
      webSearchContext: webSearchResult.context,
    });
    if (!llmCompleted) {
      recordTurnEvent({
        event: abortSignal?.aborted
          ? "voice-pipeline-llm-cancelled"
          : "voice-pipeline-llm-failed",
        payload: {
          model: synthesisModel,
          provider: synthesisProvider,
        },
      });
      recordRunTerminal(abortSignal?.aborted ? "aborted" : "failed", {
        model: synthesisModel,
        provider: synthesisProvider,
        reason: "llm",
      });
      return transcription;
    }
    recordTurnEvent({
      event: "voice-pipeline-llm-complete",
      payload: {
        model: synthesisModel,
        provider: synthesisProvider,
      },
    });
    recordRunTerminal("complete", {
      textLength: transcription.trim().length,
    });
    return transcription;
  } catch (error) {
    recordRunTerminal(abortSignal?.aborted ? "aborted" : "failed", {
      error,
      reason: abortSignal?.aborted ? "abort-signal" : "exception",
    });
    throw error;
  } finally {
    recordTurnEvent({
      event: "voice-pipeline-run-cleanup",
      payload: {
        hadAudioUri: !!audioUri,
        retainedCapturedAudio: retainCapturedAudio,
      },
    });
    if (!retainCapturedAudio) {
      await cleanupCapturedAudio(audioUri);
    }
  }
}
