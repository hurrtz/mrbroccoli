import type { MutableRefObject } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import type { LatencyRouteDescriptor } from "../../services/latencyStats";
import type { PipelineCallbacks } from "../../services/voicePipeline/types";
import type { MessagePipelineNotice } from "../../types";
import { getSpeechLanguageDefinition } from "../../constants/speechLanguages";
import type { VoiceTurnRunState } from "./createVoicePipelineErrorHandlers";
import type { PipelinePhase, UseVoicePipelineParams } from "./types";
import type { useLatencyProgressController } from "./useLatencyProgressController";
import type { useStreamingTextScheduler } from "./useStreamingTextScheduler";
import {
  formatNoticeToast,
  getUnexpectedIssueDetail,
  type useVoiceTurnMessageState,
} from "./useVoiceTurnMessageState";

type EventAdapterParams = Pick<
  UseVoicePipelineParams,
  | "activeConversation"
  | "addMessage"
  | "createConversation"
  | "initialConversationSettings"
  | "model"
  | "modelEffort"
  | "player"
  | "provider"
  | "replyPlayback"
  | "responseLength"
  | "responseTone"
  | "selectedSttModel"
  | "selectedTtsModel"
  | "selectedTtsVoice"
  | "showToast"
  | "spokenRepliesEnabled"
  | "sttMode"
  | "sttProvider"
  | "t"
  | "ttsMode"
  | "ttsProvider"
  | "updateConversationContextSummary"
  | "webSearchMode"
  | "webSearchProvider"
> & {
  existingUserMessageId?: string;
  isActiveRun: () => boolean;
  lastCompletedReplyRef: MutableRefObject<string>;
  latency: ReturnType<typeof useLatencyProgressController>;
  messageState: Pick<
    ReturnType<typeof useVoiceTurnMessageState>,
    | "consumeAssistantMetadata"
    | "lastAssistantMessageIdRef"
    | "lastUserMessageIdRef"
    | "queueAssistantNotice"
    | "recordTtsFallbackNotice"
    | "updateAssistantTurnReceipt"
  >;
  onError: PipelineCallbacks["onError"];
  playbackStartedRef: MutableRefObject<boolean>;
  producedAudioRef: MutableRefObject<boolean>;
  setPipelinePhase: (phase: PipelinePhase) => void;
  setStreamingText: (text: string | ((previous: string) => string)) => void;
  state: VoiceTurnRunState;
  streaming: ReturnType<typeof useStreamingTextScheduler>;
  streamingRenderRunId: number;
  transcriptionOverride?: string;
  turnStartedAtMs: number;
};

export function createVoicePipelineEventAdapter({
  activeConversation,
  addMessage,
  createConversation,
  existingUserMessageId,
  initialConversationSettings,
  isActiveRun,
  lastCompletedReplyRef,
  latency,
  messageState,
  model,
  modelEffort,
  onError,
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
  streaming,
  streamingRenderRunId,
  t,
  transcriptionOverride,
  ttsMode,
  ttsProvider,
  turnStartedAtMs,
  updateConversationContextSummary,
  webSearchMode,
  webSearchProvider,
}: EventAdapterParams) {
  const startBriefThinkingLatency = () =>
    latency.startLatencyProgress("thinking-briefly", {
      phase: "request-preparation",
      provider,
      model,
      inputSource: transcriptionOverride ? "text" : "voice",
      webSearchMode,
      webSearchProvider,
    });
  const startThinkingLatency = () =>
    latency.startLatencyProgress("thinking", {
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
    latency.startLatencyProgress("synthesizing", {
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
    messageState.updateAssistantTurnReceipt((receipt) => ({
      ...receipt,
      timing: {
        ...receipt.timing,
        firstSpeechMs: Date.now() - turnStartedAtMs,
      },
    }));
    recordDebugLogEvent({
      event: "voice-pipeline-first-playback-started",
    });
    latency.finishLatencyProgress("synthesizing");
    latency.finishSpeechStartProgress();
    setPipelinePhase("speaking");
  };
  const handleLlmStarted = () => {
    if (!isActiveRun() || state.llmStarted) {
      return;
    }

    state.llmStarted = true;
    latency.finishLatencyProgress("thinking-briefly");
    startThinkingLatency();
    setPipelinePhase(playbackStartedRef.current ? "speaking" : "thinking");
  };

  const startLatencyTracking = () => {
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
      latency.startLatencyProgress("turn", {
        ...turnLatencyDescriptor,
        phase: "turn-to-first-speech",
      });
    }
    latency.startLatencyProgress("turn", {
      ...turnLatencyDescriptor,
      phase: "turn-to-completion",
    });

    if (transcriptionOverride) {
      startBriefThinkingLatency();
    } else {
      latency.startLatencyProgress("transcribing", {
        phase: "stt-transcription",
        provider: sttProvider,
        sttMode,
        sttModel: selectedSttModel,
      });
    }
  };

  const callbacks: PipelineCallbacks = {
    onTranscription: (text) => {
      if (!isActiveRun()) {
        return;
      }

      state.transcriptionReady = true;
      recordDebugLogEvent({
        event: "voice-pipeline-transcription-ready",
        payload: {
          textLength: text.trim().length,
        },
      });
      if (!transcriptionOverride) {
        latency.finishLatencyProgress("transcribing");
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
      messageState.lastUserMessageIdRef.current = userMessage?.id ?? null;
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
      latency.finishLatencyProgress("thinking-briefly");
      latency.startLatencyProgress("searching", {
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
      latency.finishLatencyProgress("searching");
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
      messageState.queueAssistantNotice(notice);
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
      setPipelinePhase(playbackStartedRef.current ? "speaking" : "thinking");
      streaming.queueStreamingRender(text, streamingRenderRunId);
    },
    onResponseDone: (fullText, usage, metadata) => {
      if (!isActiveRun()) {
        return;
      }

      state.replyCompleted = true;
      handleLlmStarted();
      recordDebugLogEvent({
        event: "voice-pipeline-response-done",
        payload: {
          textLength: fullText.trim().length,
          totalTokens: usage?.totalTokens ?? null,
        },
      });
      latency.finishLatencyProgress("thinking");
      if (!spokenRepliesEnabled) {
        latency.finishLatencyProgress("turn");
      } else if (!playbackStartedRef.current) {
        startSynthesisLatency();
      }
      streaming.cancelStreamingRender(streamingRenderRunId);
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
        metadata: messageState.consumeAssistantMetadata(metadata),
      });
      messageState.lastAssistantMessageIdRef.current =
        assistantMessage?.id ?? null;
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
      const actualMode =
        diagnostics?.mode === "kokoro" ||
        diagnostics?.mode === "provider"
          ? diagnostics.mode
          : ttsMode === "kokoro"
            ? "kokoro"
            : "provider";
      messageState.updateAssistantTurnReceipt((receipt) => ({
        ...receipt,
        speechOutput: {
          ...receipt.speechOutput,
          actualMode,
          provider: actualMode === "provider" ? ttsProvider : null,
          model: actualMode === "provider" ? selectedTtsModel : undefined,
          voice: diagnostics?.voice ?? selectedTtsVoice,
        },
      }));
      if (!playbackStartedRef.current) {
        setPipelinePhase("synthesizing");
      }
      player.enqueueAudio(
        audioData,
        diagnostics,
        handleFirstPlaybackStartedForRun,
      );
    },
    onAudioPauseReady: (audioData) => {
      if (!isActiveRun()) {
        return;
      }

      player.enqueueAudio(audioData);
    },
    onSpeechTextReady: (text, voice, diagnostics) => {
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
      messageState.updateAssistantTurnReceipt((receipt) => ({
        ...receipt,
        speechOutput: {
          ...receipt.speechOutput,
          actualMode: "native",
        },
      }));
      if (!playbackStartedRef.current) {
        setPipelinePhase("synthesizing");
      }
      player.speakText(text, {
        voice,
        ...(diagnostics?.language && diagnostics.language !== "app"
          ? {
              language:
                getSpeechLanguageDefinition(diagnostics.language)
                  .nativeLocale,
            }
          : {}),
        diagnostics,
        onPlaybackStarted: handleFirstPlaybackStartedForRun,
      });
    },
    onSpeechPauseReady: (durationMs) => {
      if (!isActiveRun()) {
        return;
      }

      player.enqueueSpeechPause(durationMs);
    },
    onTtsFallback: (error, route) => {
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
      if (!messageState.recordTtsFallbackNotice(notice)) {
        return;
      }

      messageState.updateAssistantTurnReceipt((receipt) => ({
        ...receipt,
        speechOutput: {
          ...receipt.speechOutput,
          actualMode: route,
          provider: route === "provider" ? ttsProvider : null,
          model:
            route === "provider" ? selectedTtsModel : undefined,
          voice:
            route === "provider" ? selectedTtsVoice : undefined,
          fellBack: true,
          fallbackReason: notice.detail ?? notice.message,
        },
      }));
      showToast(formatNoticeToast(notice), undefined, "danger");
    },
    onError,
  };

  return {
    callbacks,
    finishTurnReceipt: () => {
      messageState.updateAssistantTurnReceipt((receipt) => ({
        ...receipt,
        timing: {
          ...receipt.timing,
          totalMs: Date.now() - turnStartedAtMs,
        },
      }));
    },
    startLatencyTracking,
  };
}
