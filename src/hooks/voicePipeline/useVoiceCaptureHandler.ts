import {
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import { setBackgroundVoiceTurnActive } from "../../services/backgroundVoiceTurn";
import type { LatencyRouteDescriptor } from "../../services/latencyStats";
import { runVoicePipeline } from "../../services/voicePipeline";
import type {
  MessageMetadata,
  MessagePipelineNotice,
  UsageEstimate,
  VoicePhaseProgress,
} from "../../types";
import type { PipelinePhase, UseVoicePipelineParams } from "./types";
import { useLatencyProgressController } from "./useLatencyProgressController";
import { useStreamingTextScheduler } from "./useStreamingTextScheduler";
import {
  formatNoticeToast,
  getUnexpectedIssueDetail,
  useVoiceTurnMessageState,
} from "./useVoiceTurnMessageState";

type VoiceCaptureHandlerParams = Omit<UseVoicePipelineParams, "isRecording"> & {
  abortRef: React.MutableRefObject<AbortController | null>;
  handleRepeatLastReply: (
    textOverride?: string,
    messageId?: string,
  ) => Promise<void>;
  lastCompletedReplyRef: React.MutableRefObject<string>;
  setPhaseProgress: Dispatch<SetStateAction<VoicePhaseProgress | null>>;
  setPipelinePhase: (phase: PipelinePhase) => void;
  setStreamingText: (text: string | ((prev: string) => string)) => void;
};

export function useVoiceCaptureHandler({
  abortRef,
  activeConversation,
  addMessage,
  assistantInstructions,
  createConversation,
  initialConversationSettings,
  handleRepeatLastReply,
  language,
  lastCompletedReplyRef,
  model,
  modelEffort,
  player,
  provider,
  providerApiKey,
  replyPlayback,
  responseLength,
  responseTone,
  selectedSttModel,
  selectedTtsModel,
  selectedTtsVoice,
  ttsInstructions,
  setPhaseProgress,
  setPipelinePhase,
  setStreamingText,
  showToast,
  spokenRepliesEnabled,
  sttApiKey,
  sttMode,
  sttProvider,
  t,
  ttsApiKey,
  ttsListenLanguages,
  ttsMode,
  ttsProvider,
  updateConversationContextSummary,
  updateMessage,
  webSearchApiKey,
  webSearchMode,
  webSearchOptions,
  webSearchProvider,
}: VoiceCaptureHandlerParams) {
  const producedAudioRef = useRef(false);
  const playbackStartedRef = useRef(false);
  const activeCaptureRunRef = useRef(0);
  const {
    clearLatencyProgress,
    finishLatencyProgress,
    finishSpeechStartProgress,
    startLatencyProgress,
  } = useLatencyProgressController({ setPhaseProgress });
  const {
    beginStreamingRender,
    cancelStreamingRender,
    queueStreamingRender,
  } = useStreamingTextScheduler({ abortRef, setStreamingText });
  const {
    consumeAssistantMetadata,
    lastAssistantMessageIdRef,
    lastUserMessageIdRef,
    markReplyFailure,
    persistPendingNoticesForUser,
    queueAssistantNotice,
    recordAssistantNotice,
    recordTtsFallbackNotice,
    resetTurnMessageState,
  } = useVoiceTurnMessageState(updateMessage);

  const handleVoiceCaptureDone = useCallback(
    async ({
      audioUri,
      existingUserMessageId,
      transcriptionOverride,
    }: {
      audioUri?: string;
      existingUserMessageId?: string;
      transcriptionOverride?: string;
    }) => {
      const previousAbortController = abortRef.current;
      const runId = activeCaptureRunRef.current + 1;
      activeCaptureRunRef.current = runId;
      previousAbortController?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;
      const isCurrentRun = () =>
        activeCaptureRunRef.current === runId &&
        abortRef.current === abortController;
      const isActiveRun = () =>
        isCurrentRun() && !abortController.signal.aborted;

      if (previousAbortController) {
        await player.stopPlayback();
        if (!isActiveRun()) {
          return;
        }
      }

      recordDebugLogEvent({
        event: "voice-pipeline-handle-capture-start",
        payload: {
          hasAudioUri: !!audioUri,
          hasTranscriptionOverride: !!transcriptionOverride,
          ttsMode,
        },
      });
      setPipelinePhase(
        transcriptionOverride ? "thinking-briefly" : "transcribing",
      );
      const streamingRenderRunId = beginStreamingRender();
      producedAudioRef.current = false;
      playbackStartedRef.current = false;
      resetTurnMessageState(existingUserMessageId);
      player.resetCancellation();
      const backgroundGraceAvailable = setBackgroundVoiceTurnActive(true);
      recordDebugLogEvent({
        event: "voice-pipeline-background-grace-armed",
        payload: {
          available: backgroundGraceAvailable,
        },
      });
      const turnLatencyDescriptor: Omit<LatencyRouteDescriptor, "phase"> = {
        provider,
        model,
        effort: modelEffort,
        responseLength,
        responseTone,
        inputSource: transcriptionOverride ? "text" : "voice",
        sttMode,
        sttProvider,
        sttModel: selectedSttModel,
        spokenRepliesEnabled,
        ttsMode,
        ttsProvider,
        ttsModel: selectedTtsModel,
        replyPlayback,
        webSearchMode,
        webSearchProvider,
      };
      if (spokenRepliesEnabled) {
        startLatencyProgress("turn", {
          ...turnLatencyDescriptor,
          phase: "turn-to-first-speech",
        });
      }
      startLatencyProgress("turn", {
        ...turnLatencyDescriptor,
        phase: "turn-to-completion",
      });
      const startBriefThinkingLatency = () =>
        startLatencyProgress("thinking-briefly", {
          phase: "request-preparation",
          provider,
          model,
          inputSource: transcriptionOverride ? "text" : "voice",
          webSearchMode,
          webSearchProvider,
        });
      const startThinkingLatency = () =>
        startLatencyProgress("thinking", {
          phase: "llm-response",
          provider,
          model,
          effort: modelEffort,
          responseLength,
          responseTone,
          webSearchMode,
          webSearchProvider,
        });
      const startSynthesisLatency = () =>
        startLatencyProgress("synthesizing", {
          phase: "tts-synthesis",
          provider: ttsProvider,
          ttsMode,
          ttsModel: selectedTtsModel,
          responseLength,
          replyPlayback,
        });
      const handleFirstPlaybackStartedForRun = () => {
        if (!isActiveRun() || playbackStartedRef.current) {
          return;
        }

        playbackStartedRef.current = true;
        recordDebugLogEvent({
          event: "voice-pipeline-first-playback-started",
        });
        finishLatencyProgress("synthesizing");
        finishSpeechStartProgress();
        setPipelinePhase("speaking");
      };
      let llmStarted = false;
      const handleLlmStarted = () => {
        if (!isActiveRun() || llmStarted) {
          return;
        }

        llmStarted = true;
        finishLatencyProgress("thinking-briefly");
        startThinkingLatency();
        setPipelinePhase(
          playbackStartedRef.current ? "speaking" : "thinking",
        );
      };

      if (transcriptionOverride) {
        startBriefThinkingLatency();
      } else {
        startLatencyProgress("transcribing", {
          phase: "stt-transcription",
          provider: sttProvider,
          sttMode,
          sttModel: selectedSttModel,
        });
      }

      try {
        const transcription = await runVoicePipeline({
          audioUri,
          transcriptionOverride,
          messages: activeConversation?.messages || [],
          contextSummary: activeConversation?.contextSummary,
          summarizedMessageCount: activeConversation?.summarizedMessageCount,
          model,
          modelEffort,
          provider,
          providerApiKey,
          sttMode,
          sttProvider,
          sttApiKey,
          sttModel: selectedSttModel,
          ttsMode,
          ttsProvider,
          ttsApiKey,
          ttsModel: selectedTtsModel,
          ttsVoice: selectedTtsVoice,
          ttsInstructions,
          ttsListenLanguages,
          replyPlayback,
          spokenRepliesEnabled,
          assistantInstructions,
          responseLength,
          responseTone,
          language,
          webSearchMode,
          webSearchProvider,
          webSearchApiKey,
          webSearchOptions,
          abortSignal: abortController.signal,
          callbacks: {
            onTranscription: (text) => {
              if (!isActiveRun()) {
                return;
              }

              recordDebugLogEvent({
                event: "voice-pipeline-transcription-ready",
                payload: {
                  textLength: text.trim().length,
                },
              });
              if (!transcriptionOverride) {
                finishLatencyProgress("transcribing");
                startBriefThinkingLatency();
              }
              setPipelinePhase("thinking-briefly");
              if (existingUserMessageId) {
                return;
              }
              if (!activeConversation) {
                if (initialConversationSettings) {
                  createConversation(
                    text,
                    model,
                    provider,
                    initialConversationSettings,
                  );
                } else {
                  createConversation(text, model, provider);
                }
              }
              const userMessage = addMessage({
                role: "user",
                content: text,
                model: null,
                provider: null,
              });
              lastUserMessageIdRef.current = userMessage?.id ?? null;
            },
            onContextSummary: (summary, summarizedCount, usage) => {
              if (!isActiveRun()) {
                return;
              }

              recordDebugLogEvent({
                event: "voice-pipeline-context-summary-updated",
                payload: {
                  summarizedCount,
                  summaryLength: summary.trim().length,
                  totalTokens: usage?.totalTokens ?? null,
                },
              });
              updateConversationContextSummary(
                summary,
                summarizedCount,
                usage,
                model,
                provider,
              );
            },
            onWebSearchStart: () => {
              if (!isActiveRun()) {
                return;
              }

              recordDebugLogEvent({
                event: "voice-pipeline-web-search-start",
              });
              finishLatencyProgress("thinking-briefly");
              startLatencyProgress("searching", {
                phase: "web-search",
                provider: webSearchProvider ?? null,
                webSearchMode,
              });
              setPipelinePhase("searching");
            },
            onWebSearchComplete: () => {
              if (!isActiveRun()) {
                return;
              }

              recordDebugLogEvent({
                event: "voice-pipeline-web-search-complete",
              });
              finishLatencyProgress("searching");
            },
            onWebSearchFallback: (error) => {
              if (!isActiveRun()) {
                return;
              }

              const notice: MessagePipelineNotice = {
                stage: "web-search",
                level: "warning",
                message: t("webSearchFallback"),
                detail: getUnexpectedIssueDetail(error, t("webSearchFallback")),
              };
              recordDebugLogEvent({
                event: "voice-pipeline-web-search-fallback",
                level: "warn",
                payload: {
                  message: error.message,
                },
              });
              queueAssistantNotice(notice);
              showToast(formatNoticeToast(notice), undefined, "danger");
            },
            onLlmStart: handleLlmStarted,
            onChunk: (text) => {
              if (!isActiveRun()) {
                return;
              }

              handleLlmStarted();
              recordDebugLogEvent({
                event: "voice-pipeline-stream-chunk",
                payload: {
                  chunkLength: text.length,
                },
              });
              setPipelinePhase(
                playbackStartedRef.current ? "speaking" : "thinking",
              );
              queueStreamingRender(text, streamingRenderRunId);
            },
            onResponseDone: (
              fullText,
              usage?: UsageEstimate,
              metadata?: MessageMetadata,
            ) => {
              if (!isActiveRun()) {
                return;
              }

              handleLlmStarted();
              recordDebugLogEvent({
                event: "voice-pipeline-response-done",
                payload: {
                  textLength: fullText.trim().length,
                  totalTokens: usage?.totalTokens ?? null,
                },
              });
              finishLatencyProgress("thinking");
              if (!spokenRepliesEnabled) {
                finishLatencyProgress("turn");
              } else if (!playbackStartedRef.current) {
                startSynthesisLatency();
              }
              cancelStreamingRender(streamingRenderRunId);
              setStreamingText("");
              setPipelinePhase(
                playbackStartedRef.current
                  ? "speaking"
                  : spokenRepliesEnabled
                    ? "synthesizing"
                    : "thinking",
              );
              lastCompletedReplyRef.current = fullText;
              const assistantMessage = addMessage({
                role: "assistant",
                content: fullText,
                model,
                provider,
                usage,
                metadata: consumeAssistantMetadata(metadata),
              });
              lastAssistantMessageIdRef.current = assistantMessage?.id ?? null;
            },
            onAudioReady: (audioData, diagnostics) => {
              if (!isActiveRun()) {
                return;
              }

              recordDebugLogEvent({
                event: "voice-pipeline-audio-ready",
                payload: {
                  requestId: diagnostics?.requestId ?? null,
                  uri: audioData,
                },
              });
              producedAudioRef.current = true;
              if (!playbackStartedRef.current) {
                setPipelinePhase("synthesizing");
              }
              player.enqueueAudio(
                audioData,
                diagnostics,
                handleFirstPlaybackStartedForRun,
              );
            },
            onSpeechTextReady: (text, _voice, diagnostics) => {
              if (!isActiveRun()) {
                return;
              }

              recordDebugLogEvent({
                event: "voice-pipeline-speech-text-ready",
                payload: {
                  requestId: diagnostics?.requestId ?? null,
                  textLength: text.trim().length,
                },
              });
              producedAudioRef.current = true;
              if (!playbackStartedRef.current) {
                setPipelinePhase("synthesizing");
              }
              player.speakText(text, {
                diagnostics,
                onPlaybackStarted: handleFirstPlaybackStartedForRun,
              });
            },
            onTtsFallback: (error) => {
              if (!isActiveRun()) {
                return;
              }

              const noticeMessage = t("providerVoiceFallback");
              const notice: MessagePipelineNotice = {
                stage: "tts",
                level: "warning",
                message: noticeMessage,
                detail: getUnexpectedIssueDetail(error, noticeMessage),
              };
              recordDebugLogEvent({
                event: "voice-pipeline-tts-fallback",
                level: "warn",
                payload: {
                  message: error.message,
                  ttsMode,
                },
              });
              if (!recordTtsFallbackNotice(notice)) {
                return;
              }

              showToast(formatNoticeToast(notice), undefined, "danger");
            },
            onError: async (error) => {
              if (!isActiveRun()) {
                return;
              }

              const preserveProducedAudio =
                producedAudioRef.current &&
                (player.isPlaying || player.hasPendingPlaybackNow());
              recordDebugLogEvent({
                event: "voice-pipeline-error",
                level: "error",
                payload: {
                  hasAudioUri: !!audioUri,
                  hasTranscriptionOverride: !!transcriptionOverride,
                  message: error.message,
                  preservedProducedAudio: preserveProducedAudio,
                },
              });
              if (!preserveProducedAudio) {
                await player.stopPlayback();
                if (!isActiveRun()) {
                  return;
                }
                clearLatencyProgress();
              }
              cancelStreamingRender(streamingRenderRunId);
              setPipelinePhase(
                preserveProducedAudio
                  ? playbackStartedRef.current
                    ? "speaking"
                    : "synthesizing"
                  : "idle",
              );
              const retryAction =
                lastAssistantMessageIdRef.current &&
                lastCompletedReplyRef.current.trim()
                ? () => {
                    void handleRepeatLastReply(lastCompletedReplyRef.current);
                  }
                : () => {
                    void handleVoiceCaptureDone({
                      audioUri,
                      existingUserMessageId:
                        lastUserMessageIdRef.current ?? undefined,
                      transcriptionOverride,
                    });
                  };

              const spokenReplyFailureNotice =
                lastAssistantMessageIdRef.current
                  ? {
                      stage: "tts" as const,
                      level: "error" as const,
                      message: t("spokenReplyFailed"),
                      detail: getUnexpectedIssueDetail(
                        error,
                        t("spokenReplyFailed"),
                      ),
                    }
                  : null;

              if (
                spokenReplyFailureNotice &&
                lastAssistantMessageIdRef.current
              ) {
                recordAssistantNotice(spokenReplyFailureNotice);
                return;
              }

              if (
                !lastAssistantMessageIdRef.current &&
                lastUserMessageIdRef.current
              ) {
                markReplyFailure(lastUserMessageIdRef.current, error);
                return;
              }

              showToast(
                spokenReplyFailureNotice
                  ? formatNoticeToast(spokenReplyFailureNotice)
                  : error.message,
                retryAction,
                "danger",
              );
            },
          },
        });

        if (!transcription && isActiveRun()) {
          recordDebugLogEvent({
            event: "voice-pipeline-no-transcription",
            level: "warn",
          });
          showToast(t("couldntCatchThatTryAgain"), undefined, "danger");
        }
      } catch (error) {
        if (abortController.signal.aborted || !isCurrentRun()) {
          if (isCurrentRun()) {
            clearLatencyProgress();
          }
          recordDebugLogEvent({
            event: "voice-pipeline-aborted",
            payload: {
              hasAudioUri: !!audioUri,
              hasTranscriptionOverride: !!transcriptionOverride,
            },
          });
          return;
        }

        recordDebugLogEvent({
          event: "voice-pipeline-catch-error",
          level: "error",
          payload: {
            message:
              error instanceof Error ? error.message : t("couldntProcessVoiceInput"),
          },
        });
        const errorMessage =
          error instanceof Error ? error.message : t("couldntProcessVoiceInput");
        const normalizedError =
          error instanceof Error ? error : new Error(errorMessage);

        let persistedError = false;

        if (!lastAssistantMessageIdRef.current && lastUserMessageIdRef.current) {
          markReplyFailure(lastUserMessageIdRef.current, normalizedError);
          persistedError = true;
          persistPendingNoticesForUser();
        }

        if (
          !transcriptionOverride &&
          !lastUserMessageIdRef.current &&
          activeConversation
        ) {
          addMessage({
            role: "assistant",
            content: "",
            model: null,
            provider: null,
            metadata: {
              notices: [
                {
                  stage: "stt",
                  level: "error",
                  message: errorMessage,
                },
              ],
            },
          });
          persistedError = true;
        }

        if (!persistedError) {
          showToast(errorMessage, undefined, "danger");
        }
      } finally {
        if (!isCurrentRun()) {
          recordDebugLogEvent({
            event: "voice-pipeline-stale-run-finished",
            payload: {
              runId,
            },
          });
          return;
        }

        setBackgroundVoiceTurnActive(false);
        recordDebugLogEvent({
          event: "voice-pipeline-finalizing",
          payload: {
            hasPendingPlayback: player.hasPendingPlaybackNow(),
          },
        });
        if (player.hasPendingPlaybackNow()) {
          setPipelinePhase(
            playbackStartedRef.current ? "speaking" : "synthesizing",
          );
        }

        if (player.hasPendingPlaybackNow()) {
          await player.waitForDrain();
        }
        if (!isCurrentRun()) {
          return;
        }
        if (!abortController.signal.aborted) {
          finishLatencyProgress("turn");
        }
        clearLatencyProgress();
        cancelStreamingRender(streamingRenderRunId);
        setStreamingText("");
        setPipelinePhase("idle");
        recordDebugLogEvent({
          event: "voice-pipeline-finished",
          payload: {
            finalPhase: "idle",
          },
        });
        if (abortRef.current === abortController) {
          abortRef.current = null;
        }
      }
    },
    [
      abortRef,
      activeConversation,
      addMessage,
      assistantInstructions,
      beginStreamingRender,
      clearLatencyProgress,
      cancelStreamingRender,
      consumeAssistantMetadata,
      createConversation,
      finishLatencyProgress,
      handleRepeatLastReply,
      language,
      lastCompletedReplyRef,
      markReplyFailure,
      model,
      persistPendingNoticesForUser,
      player,
      provider,
      providerApiKey,
      queueStreamingRender,
      queueAssistantNotice,
      recordAssistantNotice,
      recordTtsFallbackNotice,
      resetTurnMessageState,
      replyPlayback,
      responseLength,
      responseTone,
      selectedSttModel,
      selectedTtsModel,
      selectedTtsVoice,
      setPipelinePhase,
      setStreamingText,
      showToast,
      startLatencyProgress,
      spokenRepliesEnabled,
      sttApiKey,
      sttMode,
      sttProvider,
      t,
      ttsApiKey,
      ttsListenLanguages,
      ttsMode,
      ttsProvider,
      updateConversationContextSummary,
      webSearchApiKey,
      webSearchMode,
      webSearchOptions,
      webSearchProvider,
    ],
  );

  return {
    handleVoiceCaptureDone,
  };
}
