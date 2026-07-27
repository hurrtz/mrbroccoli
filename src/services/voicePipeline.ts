import type { Message } from "../types";
import { recordDebugLogEvent } from "./debugLogCapture";
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
        sttApiKey,
        sttMode,
        sttModel,
        sttProvider,
        transcriptionOverride,
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
      assistantInstructions,
      callbacks,
      conversationSummary: contextResult.effectiveSummary || undefined,
      language,
      messages: allMessages,
      model,
      modelEffort,
      provider,
      providerApiKey,
      responseLength,
      responseMetadata: webSearchResult.responseMetadata,
      responseTone,
      spokenRepliesEnabled,
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
