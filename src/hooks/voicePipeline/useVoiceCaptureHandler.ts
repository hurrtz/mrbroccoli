import {
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import { setBackgroundVoiceTurnActive } from "../../services/backgroundVoiceTurn";
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

function getUnexpectedIssueDetail(
  error: unknown,
  fallbackMessage: string,
): string | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const detail = error.message.trim();

  if (!detail) {
    return undefined;
  }

  return detail === fallbackMessage ? undefined : detail;
}

function formatNoticeToast(notice: MessagePipelineNotice) {
  return notice.detail ? `${notice.message} ${notice.detail}` : notice.message;
}

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
  const ttsFallbackToastShownRef = useRef(false);
  const producedAudioRef = useRef(false);
  const playbackStartedRef = useRef(false);
  const lastUserMessageIdRef = useRef<string | null>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);
  const pendingAssistantNoticesRef = useRef<MessagePipelineNotice[]>([]);
  const {
    clearLatencyProgress,
    finishLatencyProgress,
    startLatencyProgress,
  } = useLatencyProgressController({ setPhaseProgress });
  const {
    beginStreamingRender,
    cancelStreamingRender,
    queueStreamingRender,
  } = useStreamingTextScheduler({ abortRef, setStreamingText });

  const appendNoticeMetadata = useCallback(
    (
      metadata: MessageMetadata | undefined,
      notice: MessagePipelineNotice,
    ): MessageMetadata => {
      const notices = metadata?.notices ?? [];
      const alreadyPresent = notices.some(
        (entry) =>
          entry.stage === notice.stage &&
          entry.message === notice.message &&
          entry.detail === notice.detail,
      );

      return {
        ...metadata,
        notices: alreadyPresent ? notices : [...notices, notice],
      };
    },
    [],
  );

  const clearReplyFailure = useCallback(
    (messageId: string) => {
      updateMessage(messageId, (message) => {
        if (!message.metadata?.replyFailure) {
          return message;
        }

        const { replyFailure: _replyFailure, ...remainingMetadata } =
          message.metadata;

        return {
          ...message,
          metadata:
            Object.keys(remainingMetadata).length > 0
              ? remainingMetadata
              : undefined,
        };
      });
    },
    [updateMessage],
  );

  const markReplyFailure = useCallback(
    (messageId: string, error: Error) => {
      updateMessage(messageId, (message) => ({
        ...message,
        metadata: {
          ...message.metadata,
          replyFailure: {
            message: error.message,
          },
        },
      }));
    },
    [updateMessage],
  );

  const handleFirstPlaybackStarted = useCallback(() => {
    if (playbackStartedRef.current) {
      return;
    }

    playbackStartedRef.current = true;
    recordDebugLogEvent({
      event: "voice-pipeline-first-playback-started",
    });
    finishLatencyProgress("synthesizing");
    finishLatencyProgress("turn");
    setPipelinePhase("speaking");
  }, [finishLatencyProgress, setPipelinePhase]);

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
      ttsFallbackToastShownRef.current = false;
      producedAudioRef.current = false;
      playbackStartedRef.current = false;
      lastUserMessageIdRef.current = existingUserMessageId ?? null;
      lastAssistantMessageIdRef.current = null;
      pendingAssistantNoticesRef.current = [];
      if (existingUserMessageId) {
        clearReplyFailure(existingUserMessageId);
      }
      abortRef.current = new AbortController();
      player.resetCancellation();
      const backgroundGraceAvailable = setBackgroundVoiceTurnActive(true);
      recordDebugLogEvent({
        event: "voice-pipeline-background-grace-armed",
        payload: {
          available: backgroundGraceAvailable,
        },
      });
      startLatencyProgress("turn", {
        phase: "turn-to-first-speech",
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
      let llmStarted = false;
      const handleLlmStarted = () => {
        if (llmStarted) {
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
          abortSignal: abortRef.current!.signal,
          callbacks: {
            onTranscription: (text) => {
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
              recordDebugLogEvent({
                event: "voice-pipeline-web-search-complete",
              });
              finishLatencyProgress("searching");
            },
            onWebSearchFallback: (error) => {
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
              pendingAssistantNoticesRef.current = [
                ...pendingAssistantNoticesRef.current,
                notice,
              ];
              showToast(formatNoticeToast(notice), undefined, "danger");
            },
            onLlmStart: handleLlmStarted,
            onChunk: (text) => {
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
              const assistantNotices = pendingAssistantNoticesRef.current;
              const assistantMessage = addMessage({
                role: "assistant",
                content: fullText,
                model,
                provider,
                usage,
                metadata:
                  assistantNotices.length > 0
                    ? {
                        ...metadata,
                        notices: assistantNotices.reduce(
                          (allNotices, notice) =>
                            appendNoticeMetadata(
                              { notices: allNotices },
                              notice,
                            ).notices ?? allNotices,
                          metadata?.notices ?? [],
                        ),
                      }
                    : metadata,
              });
              lastAssistantMessageIdRef.current = assistantMessage?.id ?? null;
              pendingAssistantNoticesRef.current = [];
            },
            onAudioReady: (audioData, diagnostics) => {
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
                handleFirstPlaybackStarted,
              );
            },
            onSpeechTextReady: (text, _voice, diagnostics) => {
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
                onPlaybackStarted: handleFirstPlaybackStarted,
              });
            },
            onTtsFallback: (error) => {
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
              if (ttsFallbackToastShownRef.current) {
                return;
              }

              if (lastAssistantMessageIdRef.current) {
                updateMessage(lastAssistantMessageIdRef.current, (message) => ({
                  ...message,
                  metadata: appendNoticeMetadata(message.metadata, notice),
                }));
              } else {
                pendingAssistantNoticesRef.current = [
                  ...pendingAssistantNoticesRef.current,
                  notice,
                ];
              }

              ttsFallbackToastShownRef.current = true;
              showToast(formatNoticeToast(notice), undefined, "danger");
            },
            onError: async (error) => {
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
                updateMessage(lastAssistantMessageIdRef.current, (message) => ({
                  ...message,
                  metadata: appendNoticeMetadata(
                    message.metadata,
                    spokenReplyFailureNotice,
                  ),
                }));
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

        if (!transcription) {
          recordDebugLogEvent({
            event: "voice-pipeline-no-transcription",
            level: "warn",
          });
          showToast(t("couldntCatchThatTryAgain"), undefined, "danger");
        }
      } catch (error) {
        if (abortRef.current?.signal.aborted) {
          clearLatencyProgress();
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
          const pendingNotices = pendingAssistantNoticesRef.current;

          if (pendingNotices.length > 0) {
            updateMessage(lastUserMessageIdRef.current, (message) => ({
              ...message,
              metadata: {
                ...message.metadata,
                notices: pendingNotices.reduce(
                  (allNotices, notice) =>
                    appendNoticeMetadata(
                      { notices: allNotices },
                      notice,
                    ).notices ?? allNotices,
                  message.metadata?.notices ?? [],
                ),
              },
            }));
            pendingAssistantNoticesRef.current = [];
          }
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
      }
    },
    [
      abortRef,
      activeConversation,
      addMessage,
      appendNoticeMetadata,
      assistantInstructions,
      beginStreamingRender,
      clearLatencyProgress,
      clearReplyFailure,
      cancelStreamingRender,
      createConversation,
      finishLatencyProgress,
      handleFirstPlaybackStarted,
      handleRepeatLastReply,
      language,
      lastCompletedReplyRef,
      markReplyFailure,
      model,
      player,
      provider,
      providerApiKey,
      queueStreamingRender,
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
      updateMessage,
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
