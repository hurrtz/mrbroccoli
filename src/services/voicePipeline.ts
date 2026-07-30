import type { Message, UsageEstimate } from "../types";
import { translate } from "../i18n";
import { recordDebugLogEvent } from "./debugLogCapture";
import {
  getUlraModeFailureParticipants,
  runUlraModeDeliberation,
} from "./ulraMode";
import { cleanupCapturedAudio } from "./voicePipeline/cleanup";
import { resolveContextualMessages } from "./voicePipeline/context";
import { runPipelineResponse } from "./voicePipeline/response";
import { createVoicePipelineTtsQueue } from "./voicePipeline/ttsQueue";
import { resolvePipelineTranscription } from "./voicePipeline/transcription";
import type { RunVoicePipelineParams } from "./voicePipeline/types";
import { resolvePipelineWebSearch } from "./voicePipeline/webSearch";
import { createTurnReceipt } from "./turnReceipt";

export async function runVoicePipeline(
  params: RunVoicePipelineParams,
): Promise<string | null> {
  const {
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

  let transcription: string | null = null;
  let retainCapturedAudio = false;
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
    recordDebugLogEvent({
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
      recordDebugLogEvent({
        event: "voice-pipeline-run-empty-transcription",
        level: "warn",
        payload: {
          retainedCapturedAudio: retainCapturedAudio,
        },
      });
      return null;
    }
    if (abortSignal?.aborted) {
      recordDebugLogEvent({
        event: "voice-pipeline-run-aborted-after-transcription",
      });
      return transcription;
    }

    callbacks.onTranscription(transcription);
    if (abortSignal?.aborted) {
      recordDebugLogEvent({
        event: "voice-pipeline-run-aborted-after-onTranscription",
      });
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
      recordDebugLogEvent({
        event: "voice-pipeline-run-context-aborted",
      });
      return transcription;
    }

    const webSearchResult = await resolvePipelineWebSearch({
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
    let responseMetadata = webSearchResult.responseMetadata;
    let synthesisContext: string | undefined;

    if (ulraMode) {
      callbacks.onLlmStart?.();
      const deliberation = await runUlraModeDeliberation({
        abortSignal,
        assistantInstructions,
        config: ulraMode,
        language,
        messages: allMessages,
        webSearchContext: webSearchResult.context,
      });

      if (abortSignal?.aborted) {
        recordDebugLogEvent({
          event: "voice-pipeline-ulra-mode-aborted",
        });
        return transcription;
      }

      additionalUsage = deliberation.estimatedUsage;
      synthesisContext = deliberation.synthesisPrompt;
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
      abortSignal,
      additionalUsage,
      assistantInstructions,
      callbacks,
      conversationSummary: contextResult.effectiveSummary || undefined,
      language,
      llmAlreadyStarted: Boolean(ulraMode),
      messages: allMessages,
      model,
      modelStartedAtMs,
      modelEffort,
      provider,
      providerApiKey,
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
      recordDebugLogEvent({
        event: abortSignal?.aborted
          ? "voice-pipeline-llm-cancelled"
          : "voice-pipeline-llm-failed",
        payload: {
          model,
          provider,
        },
      });
      return transcription;
    }
    recordDebugLogEvent({
      event: "voice-pipeline-llm-complete",
      payload: {
        model,
        provider,
      },
    });
    recordDebugLogEvent({
      event: "voice-pipeline-run-complete",
      payload: {
        textLength: transcription.trim().length,
      },
    });
    return transcription;
  } finally {
    recordDebugLogEvent({
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
