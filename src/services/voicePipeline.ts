import { streamChat } from "./llm";
import type { Message, MessageMetadata } from "../types";
import { recordDebugLogEvent } from "./debugLogCapture";
import { cleanupCapturedAudio } from "./voicePipeline/cleanup";
import { resolveContextualMessages } from "./voicePipeline/context";
import { createVoicePipelineTtsQueue } from "./voicePipeline/ttsQueue";
import { resolvePipelineTranscription } from "./voicePipeline/transcription";
import type { RunVoicePipelineParams } from "./voicePipeline/types";
import { searchWeb } from "./webSearch";
import { getWebSearchDecision } from "./webSearchHeuristics";

export async function runVoicePipeline(
  params: RunVoicePipelineParams,
): Promise<string | null> {
  const {
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

    if (contextResult.aborted) {
      recordDebugLogEvent({
        event: "voice-pipeline-run-context-aborted",
      });
      return transcription;
    }

    let webSearchContext: string | undefined;
    let responseMetadata: MessageMetadata | undefined;
    const normalizedWebSearchApiKey = webSearchApiKey?.trim();
    const effectiveWebSearchMode = webSearchMode ?? "off";
    const webSearchDecision = getWebSearchDecision({
      enabled: effectiveWebSearchMode !== "off",
      mode: effectiveWebSearchMode,
      ready: Boolean(webSearchProvider && normalizedWebSearchApiKey),
      language,
      query: transcription,
      messages,
    });

    recordDebugLogEvent({
      event: "web-search-decision",
      payload: {
        mode: effectiveWebSearchMode,
        provider: webSearchProvider ?? null,
        ready: Boolean(webSearchProvider && normalizedWebSearchApiKey),
        reason: webSearchDecision.reason,
        shouldSearch: webSearchDecision.shouldSearch,
        signals: webSearchDecision.matchedSignals,
      },
    });

    if (
      webSearchDecision.shouldSearch &&
      webSearchProvider &&
      normalizedWebSearchApiKey
    ) {
      callbacks.onWebSearchStart?.();

      try {
        const webSearchResult = await searchWeb({
          provider: webSearchProvider,
          apiKey: normalizedWebSearchApiKey,
          language,
          query: transcription,
          conversationSummary: contextResult.effectiveSummary || undefined,
          options: webSearchOptions,
          abortSignal,
        });

        if (abortSignal?.aborted) {
          return transcription;
        }

        webSearchContext = webSearchResult?.context;
        if (webSearchResult) {
          responseMetadata = {
            webSearch: {
              provider: webSearchResult.provider,
              model: webSearchResult.model,
              query: transcription,
              summary: webSearchResult.summary,
              sources: webSearchResult.sources,
            },
          };
        }
      } catch (error) {
        if (abortSignal?.aborted) {
          return transcription;
        }

        if (error instanceof Error) {
          callbacks.onWebSearchFallback?.(error);
        }
      } finally {
        callbacks.onWebSearchComplete?.();
      }
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
      ttsListenLanguages,
      ttsMode,
      ttsModel,
      ttsProvider,
      ttsVoice,
      ttsInstructions,
    });

    recordDebugLogEvent({
      event: "voice-pipeline-llm-requested",
      payload: {
        model,
        modelEffort: modelEffort ?? null,
        provider,
        hasWebSearchContext: !!webSearchContext,
        webSearchContextLength: webSearchContext?.length ?? 0,
      },
    });
    callbacks.onLlmStart?.();

    let llmCompleted = false;
    await streamChat({
      messages: allMessages,
      model,
      modelEffort,
      provider,
      apiKey: providerApiKey,
      assistantInstructions,
      responseLength,
      responseTone,
      language,
      conversationSummary: contextResult.effectiveSummary || undefined,
      webSearchContext,
      abortSignal,
      onChunk: (text) => {
        if (abortSignal?.aborted) return;
        ttsQueue.handleStreamChunk(text);
      },
      onDone: async (fullText, usage, llmMetadata) => {
        if (abortSignal?.aborted) return;
        const completedMetadata =
          responseMetadata || llmMetadata
            ? {
                ...responseMetadata,
                ...llmMetadata,
              }
            : undefined;
        callbacks.onResponseDone(fullText, usage, completedMetadata);
        await ttsQueue.handleResponseDone(fullText);
        llmCompleted = true;
      },
      onError: callbacks.onError,
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
