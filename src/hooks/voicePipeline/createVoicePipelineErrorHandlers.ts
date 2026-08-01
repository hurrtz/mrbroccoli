import type { MutableRefObject } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import type {
  Message,
  MessageImageAttachment,
  MessagePipelineNotice,
} from "../../types";
import type {
  PipelinePhase,
  UseVoicePipelineParams,
  VoiceCaptureRequest,
} from "./types";
import type { useLatencyProgressController } from "./useLatencyProgressController";
import type { useRetryableVoiceCapture } from "./useRetryableVoiceCapture";
import type { useStreamingTextScheduler } from "./useStreamingTextScheduler";
import {
  formatNoticeToast,
  getUnexpectedIssueDetail,
  type useVoiceTurnMessageState,
} from "./useVoiceTurnMessageState";

export interface VoiceTurnRunState {
  llmStarted: boolean;
  replyCompleted: boolean;
  transcriptionReady: boolean;
  turnFailed: boolean;
}

type ErrorHandlerParams = Pick<
  UseVoicePipelineParams,
  | "activeConversation"
  | "addMessage"
  | "player"
  | "showToast"
  | "t"
> & {
  attachments?: MessageImageAttachment[];
  audioUri?: string;
  messagesOverride?: Message[];
  handleRepeatLastReply: (
    textOverride?: string,
    messageId?: string,
  ) => Promise<void>;
  isActiveRun: () => boolean;
  lastCompletedReplyRef: MutableRefObject<string>;
  latency: Pick<
    ReturnType<typeof useLatencyProgressController>,
    "clearLatencyProgress"
  >;
  messageState: Pick<
    ReturnType<typeof useVoiceTurnMessageState>,
    | "lastAssistantMessageIdRef"
    | "lastUserMessageIdRef"
    | "markReplyFailure"
    | "persistPendingNoticesForUser"
    | "recordAssistantNotice"
  >;
  producedAudioRef: MutableRefObject<boolean>;
  retryCapture: (request: VoiceCaptureRequest) => void;
  retryableCapture: Pick<
    ReturnType<typeof useRetryableVoiceCapture>,
    "discardRetainedCapture" | "retainCaptureForRetry"
  >;
  setPipelinePhase: (phase: PipelinePhase) => void;
  state: VoiceTurnRunState;
  streaming: Pick<
    ReturnType<typeof useStreamingTextScheduler>,
    "cancelStreamingRender"
  >;
  streamingRenderRunId: number;
  transcriptionOverride?: string;
  playbackStartedRef: MutableRefObject<boolean>;
  turnId: string;
};

export function createVoicePipelineErrorHandlers({
  activeConversation,
  addMessage,
  attachments,
  audioUri,
  handleRepeatLastReply,
  isActiveRun,
  lastCompletedReplyRef,
  latency,
  messagesOverride,
  messageState,
  player,
  playbackStartedRef,
  producedAudioRef,
  retryCapture,
  retryableCapture,
  setPipelinePhase,
  showToast,
  state,
  streaming,
  streamingRenderRunId,
  t,
  transcriptionOverride,
  turnId,
}: ErrorHandlerParams) {
  const recordTurnEvent = (
    event: Parameters<typeof recordDebugLogEvent>[0],
  ) =>
    recordDebugLogEvent({
      ...event,
      payload: { ...event.payload, turnId },
    });
  const handlePipelineError = async (error: Error) => {
    if (!isActiveRun()) {
      return;
    }

    state.turnFailed = true;
    const preserveProducedAudio =
      producedAudioRef.current &&
      (player.isPlaying || player.hasPendingPlaybackNow());
    recordTurnEvent({
      event: "voice-pipeline-error",
      level: "error",
      payload: {
        hasAudioUri: !!audioUri,
        hasTranscriptionOverride: !!transcriptionOverride,
        error,
        preservedProducedAudio: preserveProducedAudio,
      },
    });
    if (!preserveProducedAudio) {
      await player.stopPlayback();
      if (!isActiveRun()) {
        return;
      }
      latency.clearLatencyProgress();
    }
    streaming.cancelStreamingRender(streamingRenderRunId);
    setPipelinePhase(
      preserveProducedAudio
        ? playbackStartedRef.current
          ? "speaking"
          : "synthesizing"
        : "idle",
    );
    const retryAction =
      messageState.lastAssistantMessageIdRef.current &&
      lastCompletedReplyRef.current.trim()
        ? () => {
            void handleRepeatLastReply(lastCompletedReplyRef.current);
          }
        : () => {
            retryCapture({
              attachments,
              audioUri,
              existingUserMessageId:
                messageState.lastUserMessageIdRef.current ?? undefined,
              messagesOverride,
              transcriptionOverride,
            });
          };

    const spokenReplyFailureNotice =
      messageState.lastAssistantMessageIdRef.current
        ? {
            stage: "tts" as const,
            level: "error" as const,
            message: t("spokenReplyFailed"),
            detail: getUnexpectedIssueDetail(error, t("spokenReplyFailed")),
          }
        : null;

    if (
      spokenReplyFailureNotice &&
      messageState.lastAssistantMessageIdRef.current
    ) {
      messageState.recordAssistantNotice(spokenReplyFailureNotice);
      return;
    }

    if (
      !messageState.lastAssistantMessageIdRef.current &&
      messageState.lastUserMessageIdRef.current
    ) {
      messageState.markReplyFailure(
        messageState.lastUserMessageIdRef.current,
        error,
      );
      return;
    }

    showToast(
      spokenReplyFailureNotice
        ? formatNoticeToast(spokenReplyFailureNotice)
        : error.message,
      retryAction,
      "danger",
    );
  };

  const handleNoTranscription = () => {
    retryableCapture.retainCaptureForRetry(audioUri);
    recordTurnEvent({
      event: "voice-pipeline-no-transcription",
      level: "warn",
    });
    showToast(
      t("couldntCatchThatTryAgain"),
      audioUri
        ? () => {
            retryCapture({ attachments, audioUri, messagesOverride });
          }
        : undefined,
      "danger",
      audioUri
        ? () => {
            retryableCapture.discardRetainedCapture(audioUri);
          }
        : undefined,
    );
  };

  const handleCaughtException = (error: unknown) => {
    state.turnFailed = true;
    recordTurnEvent({
      event: "voice-pipeline-catch-error",
      level: "error",
      payload: { error },
    });
    const errorMessage =
      error instanceof Error ? error.message : t("couldntProcessVoiceInput");
    const normalizedError =
      error instanceof Error ? error : new Error(errorMessage);
    const retryableAudioUri =
      !state.transcriptionReady && audioUri ? audioUri : undefined;
    const retryAction = retryableAudioUri
      ? () => {
          retryCapture({
            attachments,
            audioUri: retryableAudioUri,
            messagesOverride,
          });
        }
      : undefined;

    retryableCapture.retainCaptureForRetry(retryableAudioUri);

    let persistedError = false;

    if (
      !messageState.lastAssistantMessageIdRef.current &&
      messageState.lastUserMessageIdRef.current
    ) {
      messageState.markReplyFailure(
        messageState.lastUserMessageIdRef.current,
        normalizedError,
      );
      persistedError = true;
      messageState.persistPendingNoticesForUser();
    }

    if (
      !transcriptionOverride &&
      !messageState.lastUserMessageIdRef.current &&
      activeConversation
    ) {
      const notice: MessagePipelineNotice = {
        stage: "stt",
        level: "error",
        message: errorMessage,
      };
      addMessage({
        role: "assistant",
        content: "",
        model: null,
        provider: null,
        metadata: {
          notices: [notice],
        },
      });
      persistedError = true;
    }

    if (!persistedError || retryAction) {
      showToast(
        errorMessage,
        retryAction,
        "danger",
        retryableAudioUri
          ? () => {
              retryableCapture.discardRetainedCapture(retryableAudioUri);
            }
          : undefined,
      );
    }
  };

  return {
    handleCaughtException,
    handleNoTranscription,
    handlePipelineError,
  };
}
