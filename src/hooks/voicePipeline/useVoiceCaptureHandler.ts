import { useCallback, useRef, type Dispatch, type SetStateAction } from "react";

import {
  createDebugTurnId,
  recordDebugLogEvent,
  registerDebugTurnSignal,
} from "../../services/debugLogCapture";
import { runVoicePipeline } from "../../services/voicePipeline";
import type { VoicePhaseProgress } from "../../types";
import { createVoicePipelineEventAdapter } from "./createVoicePipelineEventAdapter";
import {
  createVoicePipelineErrorHandlers,
  type VoiceTurnRunState,
} from "./createVoicePipelineErrorHandlers";
import type {
  PipelinePhase,
  UseVoicePipelineParams,
  VoiceCaptureRequest,
} from "./types";
import { useLatencyProgressController } from "./useLatencyProgressController";
import { useRetryableVoiceCapture } from "./useRetryableVoiceCapture";
import { useStreamingTextScheduler } from "./useStreamingTextScheduler";
import { useVoiceTurnMessageState } from "./useVoiceTurnMessageState";

type VoiceCaptureHandlerParams = Omit<UseVoicePipelineParams, "isRecording"> & {
  abortRef: React.MutableRefObject<AbortController | null>;
  handleRepeatLastReply: (
    textOverride?: string,
    messageId?: string,
  ) => Promise<void>;
  lastCompletedReplyRef: React.MutableRefObject<string>;
  onReplyCompleted: () => void;
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
  pastConversationKnowledgeEnabled = false,
  privateConversationIds = [],
  onReplyCompleted,
  player,
  provider,
  providerApiKey,
  replyPlayback,
  responseLength,
  responseTone,
  selectedSttModel,
  selectedTtsModel,
  selectedTtsVoice,
  kokoroVoices,
  ttsFallbackRoutes,
  ttsInstructions,
  setPhaseProgress,
  setPipelinePhase,
  setStreamingText,
  showToast,
  spokenRepliesEnabled,
  sttApiKey,
  sttLanguage,
  sttMode,
  sttProvider,
  t,
  ttsApiKey,
  ttsListenLanguages,
  ttsMode,
  ttsProvider,
  ulraMode,
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
    updateUlraLatencyOutcome,
  } = useLatencyProgressController({ setPhaseProgress });
  const { beginStreamingRender, cancelStreamingRender, queueStreamingRender } =
    useStreamingTextScheduler({ abortRef, setStreamingText });
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
    updateAssistantTurnReceipt,
  } = useVoiceTurnMessageState(updateMessage);
  const {
    discardRetainedCapture,
    prepareCaptureForTurn,
    retainCaptureForRetry,
  } = useRetryableVoiceCapture();

  const handleVoiceCaptureDone = useCallback(
    async ({
      audioUri,
      existingUserMessageId,
      transcriptionOverride,
      turnId: requestedTurnId,
    }: VoiceCaptureRequest) => {
      const previousAbortController = abortRef.current;
      const runId = activeCaptureRunRef.current + 1;
      activeCaptureRunRef.current = runId;
      previousAbortController?.abort();
      const abortController = new AbortController();
      const turnId = requestedTurnId ?? createDebugTurnId();
      registerDebugTurnSignal(abortController.signal, turnId);
      const turnStartedAtMs = Date.now();
      abortRef.current = abortController;
      const isCurrentRun = () =>
        activeCaptureRunRef.current === runId &&
        abortRef.current === abortController;
      const isActiveRun = () =>
        isCurrentRun() && !abortController.signal.aborted;

      prepareCaptureForTurn(audioUri);
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
          turnId,
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
      const state: VoiceTurnRunState = {
        llmStarted: false,
        replyCompleted: false,
        transcriptionReady: false,
        turnFailed: false,
      };
      const retryCapture = (request: VoiceCaptureRequest) => {
        void handleVoiceCaptureDone(request);
      };
      const errorHandlers = createVoicePipelineErrorHandlers({
        activeConversation,
        addMessage,
        audioUri,
        handleRepeatLastReply,
        isActiveRun,
        lastCompletedReplyRef,
        latency: {
          clearLatencyProgress,
        },
        messageState: {
          lastAssistantMessageIdRef,
          lastUserMessageIdRef,
          markReplyFailure,
          persistPendingNoticesForUser,
          recordAssistantNotice,
        },
        player,
        playbackStartedRef,
        producedAudioRef,
        retryCapture,
        retryableCapture: {
          discardRetainedCapture,
          retainCaptureForRetry,
        },
        setPipelinePhase,
        showToast,
        state,
        streaming: {
          cancelStreamingRender,
        },
        streamingRenderRunId,
        t,
        transcriptionOverride,
        turnId,
      });
      const eventAdapter = createVoicePipelineEventAdapter({
        activeConversation,
        addMessage,
        createConversation,
        existingUserMessageId,
        initialConversationSettings,
        isActiveRun,
        lastCompletedReplyRef,
        latency: {
          clearLatencyProgress,
          finishLatencyProgress,
          finishSpeechStartProgress,
          startLatencyProgress,
          updateUlraLatencyOutcome,
        },
        messageState: {
          consumeAssistantMetadata,
          lastAssistantMessageIdRef,
          lastUserMessageIdRef,
          queueAssistantNotice,
          recordTtsFallbackNotice,
          updateAssistantTurnReceipt,
        },
        model,
        modelEffort,
        onError: errorHandlers.handlePipelineError,
        player,
        playbackStartedRef,
        producedAudioRef,
        provider,
        replyPlayback,
        responseLength,
        responseTone,
        selectedSttModel,
        selectedTtsModel,
        selectedTtsVoice,
        setPipelinePhase,
        setStreamingText,
        showToast,
        spokenRepliesEnabled,
        state,
        sttMode,
        sttProvider,
        streaming: {
          beginStreamingRender,
          cancelStreamingRender,
          queueStreamingRender,
        },
        streamingRenderRunId,
        t,
        transcriptionOverride,
        ttsMode,
        ttsProvider,
        turnStartedAtMs,
        turnId,
        ulraMode,
        updateConversationContextSummary,
        webSearchMode,
        webSearchProvider,
      });
      eventAdapter.startLatencyTracking();

      try {
        const transcription = await runVoicePipeline({
          turnId,
          turnStartedAtMs,
          audioUri,
          transcriptionOverride,
          messages: activeConversation?.messages || [],
          contextSummary: activeConversation?.contextSummary,
          summarizedMessageCount: activeConversation?.summarizedMessageCount,
          currentConversationId: activeConversation?.id ?? null,
          privateConversationIds,
          pastConversationKnowledgeEnabled,
          model,
          modelEffort,
          provider,
          providerApiKey,
          sttMode,
          sttLanguage,
          sttProvider,
          sttApiKey,
          sttModel: selectedSttModel,
          ttsMode,
          ttsProvider,
          ttsApiKey,
          ttsModel: selectedTtsModel,
          ttsVoice: selectedTtsVoice,
          kokoroVoices,
          ttsFallbackRoutes,
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
          ulraMode,
          abortSignal: abortController.signal,
          callbacks: eventAdapter.callbacks,
        });

        if (!transcription && isActiveRun()) {
          errorHandlers.handleNoTranscription();
        }
      } catch (error) {
        if (abortController.signal.aborted || !isCurrentRun()) {
          if (isCurrentRun()) {
            clearLatencyProgress();
          }
          recordDebugLogEvent({
            event: "voice-pipeline-handler-aborted",
            payload: {
              hasAudioUri: !!audioUri,
              hasTranscriptionOverride: !!transcriptionOverride,
              turnId,
            },
          });
          return;
        }

        errorHandlers.handleCaughtException(error);
      } finally {
        if (!isCurrentRun()) {
          recordDebugLogEvent({
            event: "voice-pipeline-stale-run-finished",
            payload: {
              runId,
              turnId,
            },
          });
          return;
        }

        recordDebugLogEvent({
          event: "voice-pipeline-finalizing",
          payload: {
            hasPendingPlayback: player.hasPendingPlaybackNow(),
            turnId,
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
        const completedSuccessfully =
          !abortController.signal.aborted &&
          state.replyCompleted &&
          !state.turnFailed &&
          (!spokenRepliesEnabled || playbackStartedRef.current);
        if (completedSuccessfully) {
          finishLatencyProgress("turn");
        } else {
          recordDebugLogEvent({
            event: "adaptive-latency-turn-sample-discarded",
            payload: {
              aborted: abortController.signal.aborted,
              playbackStarted: playbackStartedRef.current,
              replyCompleted: state.replyCompleted,
              spokenRepliesEnabled,
              turnFailed: state.turnFailed,
            },
          });
        }
        if (state.replyCompleted) {
          eventAdapter.finishTurnReceipt();
        }
        clearLatencyProgress();
        cancelStreamingRender(streamingRenderRunId);
        setStreamingText("");
        setPipelinePhase("idle");
        if (completedSuccessfully) {
          onReplyCompleted();
        }
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
      discardRetainedCapture,
      finishLatencyProgress,
      finishSpeechStartProgress,
      handleRepeatLastReply,
      initialConversationSettings,
      kokoroVoices,
      language,
      lastAssistantMessageIdRef,
      lastCompletedReplyRef,
      lastUserMessageIdRef,
      markReplyFailure,
      model,
      modelEffort,
      pastConversationKnowledgeEnabled,
      privateConversationIds,
      onReplyCompleted,
      persistPendingNoticesForUser,
      player,
      provider,
      providerApiKey,
      prepareCaptureForTurn,
      queueAssistantNotice,
      queueStreamingRender,
      recordAssistantNotice,
      recordTtsFallbackNotice,
      replyPlayback,
      resetTurnMessageState,
      responseLength,
      responseTone,
      retainCaptureForRetry,
      selectedSttModel,
      selectedTtsModel,
      selectedTtsVoice,
      setPipelinePhase,
      setStreamingText,
      showToast,
      spokenRepliesEnabled,
      startLatencyProgress,
      sttApiKey,
      sttLanguage,
      sttMode,
      sttProvider,
      t,
      ttsApiKey,
      ttsFallbackRoutes,
      ttsInstructions,
      ttsListenLanguages,
      ttsMode,
      ttsProvider,
      ulraMode,
      updateUlraLatencyOutcome,
      updateConversationContextSummary,
      updateAssistantTurnReceipt,
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
