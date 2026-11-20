import { useCallback, useRef, useState } from "react";

import { createVoicePipelineTtsQueue } from "../../services/voicePipeline/ttsQueue";
import type { AudioPlayer, ReplayPhase, UseVoicePipelineParams } from "./types";
import { getSpeechLanguageDefinition } from "../../constants/speechLanguages";
import { PROVIDER_LABELS } from "../../constants/models";
import { getUnexpectedIssueDetail } from "./useVoiceTurnMessageState";
import type { MessagePipelineNotice } from "../../types";
import { getProviderFailureKind } from "../../services/providerResilience";

type ReplayControllerParams = Pick<
  UseVoicePipelineParams,
  | "activeConversation"
  | "updateMessage"
  | "isRecording"
  | "language"
  | "selectedTtsModel"
  | "selectedTtsVoice"
  | "localTtsModelId"
  | "kokoroVoices"
  | "ttsFallbackRoutes"
  | "ttsInstructions"
  | "showToast"
  | "t"
  | "ttsApiKey"
  | "ttsListenLanguages"
  | "ttsMode"
  | "spokenRepliesEnabled"
  | "ttsProvider"
> & {
  isBusy: boolean;
  lastCompletedReplyRef: React.MutableRefObject<string>;
  player: AudioPlayer;
};

function isSpeechError(notice: MessagePipelineNotice) {
  return notice.stage === "tts" && notice.level === "error";
}

export function useReplyReplayController({
  activeConversation,
  updateMessage,
  isBusy,
  isRecording,
  language,
  lastCompletedReplyRef,
  player,
  selectedTtsModel,
  selectedTtsVoice,
  localTtsModelId,
  kokoroVoices,
  ttsFallbackRoutes,
  ttsInstructions,
  showToast,
  t,
  ttsApiKey,
  ttsListenLanguages,
  ttsMode,
  spokenRepliesEnabled,
  ttsProvider,
}: ReplayControllerParams) {
  const conversationRef = useRef(activeConversation);
  conversationRef.current = activeConversation;
  const replayingRef = useRef(false);
  const replaySessionRef = useRef(0);
  const replayAbortRef = useRef<AbortController | null>(null);
  const [replayPhase, setReplayPhase] = useState<ReplayPhase>("idle");
  const [activeReplayMessageId, setActiveReplayMessageId] = useState<
    string | null
  >(null);

  const playReplyText = useCallback(
    async (text: string, messageId?: string) => {
      const trimmed = text.trim();

      if (!trimmed || replayingRef.current) {
        return;
      }

      if (!spokenRepliesEnabled) {
        showToast(t("spokenRepliesDisabled"));
        return;
      }

      replayingRef.current = true;
      const replaySession = replaySessionRef.current + 1;
      replaySessionRef.current = replaySession;
      replayAbortRef.current?.abort();
      const replayAbortController = new AbortController();
      replayAbortRef.current = replayAbortController;
      setActiveReplayMessageId(messageId ?? null);
      setReplayPhase("preparing");

      const conversation = conversationRef.current;
      const message =
        messageId &&
        conversation?.messages.find(
          (entry) => entry.id === messageId && entry.role === "assistant",
        );
      const setSpeechError = (error?: Error) => {
        if (!message || conversationRef.current?.id !== conversation?.id) {
          return;
        }
        const label = t("spokenReplyFailed");
        updateMessage(message.id, (current) => {
          const notices = (current.metadata?.notices ?? []).filter(
            (notice) => !isSpeechError(notice),
          );
          if (error)
            notices.push({
              stage: "tts",
              level: "error",
              message: label,
              detail: getUnexpectedIssueDetail(error, label),
            });
          return { ...current, metadata: { ...current.metadata, notices } };
        });
      };
      if (message && message.metadata?.notices?.some(isSpeechError)) {
        setSpeechError();
      }
      const handleReplayError = (error: Error) => {
        if (
          replaySessionRef.current !== replaySession ||
          error.name === "AbortError"
        )
          return;
        if (message) {
          setSpeechError(error);
          return;
        }
        const kind = getProviderFailureKind(error);
        const detail =
          ttsProvider && (kind === "credits" || kind === "quota")
            ? t("providerCreditsRequired", {
                provider: PROVIDER_LABELS[ttsProvider],
                action: t("speechSynthesisAction"),
              })
            : error.message;
        showToast(detail, undefined, "danger");
      };

      try {
        // Clear native or queued playback even when the rendered `isPlaying`
        // flag has not caught up with the underlying player yet.
        await player.stopPlayback();
        if (
          replaySessionRef.current !== replaySession ||
          replayAbortController.signal.aborted
        ) {
          return;
        }

        player.resetCancellation();
        const replayQueue = createVoicePipelineTtsQueue({
          abortSignal: replayAbortController.signal,
          callbacks: {
            onTranscription: () => undefined,
            onChunk: () => undefined,
            onResponseDone: () => undefined,
            onAudioReady: (audioUri, diagnostics, chunk) => {
              if (replaySessionRef.current !== replaySession) {
                return;
              }

              setReplayPhase("speaking");
              player.enqueueAudio(audioUri, diagnostics, undefined, chunk);
            },
            onAudioPauseReady: (audioUri) => {
              if (replaySessionRef.current !== replaySession) {
                return;
              }

              player.enqueueAudio(audioUri);
            },
            onSpeechTextReady: (
              segmentText,
              voice,
              diagnostics,
              startsParagraph,
            ) => {
              if (replaySessionRef.current !== replaySession) {
                return;
              }

              setReplayPhase("speaking");
              player.speakText(segmentText, {
                voice,
                ...(diagnostics?.language && diagnostics.language !== "app"
                  ? {
                      language: getSpeechLanguageDefinition(
                        diagnostics.language,
                      ).nativeLocale,
                    }
                  : {}),
                diagnostics,
                startsParagraph,
              });
            },
            onSpeechPauseReady: (durationMs) => {
              if (replaySessionRef.current !== replaySession) {
                return;
              }

              player.enqueueSpeechPause(durationMs);
            },
            onError: handleReplayError,
          },
          diagnosticsSource: "repeat",
          language,
          // A replay already has the complete text. Treat it as a completed
          // response instead of feeding it back through the live-stream buffer.
          replyPlayback: "wait",
          ttsApiKey,
          kokoroVoices,
          ttsFallbackRoutes,
          ttsListenLanguages,
          ttsMode,
          ttsModel: selectedTtsModel,
          localTtsModelId,
          ttsProvider,
          ttsVoice: selectedTtsVoice,
          ttsInstructions,
        });

        await replayQueue.handleResponseDone(trimmed);
        if (
          replaySessionRef.current !== replaySession ||
          replayAbortController.signal.aborted
        ) {
          return;
        }
        player.sealPlaybackReel?.();

        if (player.hasPendingPlaybackNow() || player.isPlaying) {
          setReplayPhase("speaking");
        }
        await player.waitForDrain();
      } catch (error) {
        handleReplayError(error instanceof Error ? error : new Error(t("couldntReplayReply")));
      } finally {
        if (replaySessionRef.current === replaySession) {
          replayingRef.current = false;
          replayAbortRef.current = null;
          setReplayPhase("idle");
          setActiveReplayMessageId(null);
        }
      }
    },
    [
      updateMessage,
      language,
      player,
      selectedTtsModel,
      selectedTtsVoice,
      localTtsModelId,
      kokoroVoices,
      ttsFallbackRoutes,
      ttsInstructions,
      showToast,
      t,
      ttsApiKey,
      ttsListenLanguages,
      ttsMode,
      spokenRepliesEnabled,
      ttsProvider,
    ],
  );

  const stopReplay = useCallback(async () => {
    replaySessionRef.current += 1;
    replayingRef.current = false;
    replayAbortRef.current?.abort();
    replayAbortRef.current = null;
    setReplayPhase("idle");
    setActiveReplayMessageId(null);
    await player.stopPlayback();
  }, [player]);

  const handleRepeatLastReply = useCallback(
    async (textOverride?: string, messageId?: string) => {
      const replyText =
        textOverride?.trim() || lastCompletedReplyRef.current.trim();

      if (!replyText) {
        showToast(t("noReplyToRepeatYet"));
        return;
      }

      if (isRecording || isBusy) {
        showToast(t("stopSessionBeforeReplay"));
        return;
      }

      try {
        await playReplyText(replyText, messageId);
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : t("couldntReplayReply"),
          undefined,
          "danger",
        );
      }
    },
    [isBusy, isRecording, lastCompletedReplyRef, playReplyText, showToast, t],
  );

  return {
    replayPhase,
    activeReplayMessageId,
    playReplyText,
    stopReplay,
    handleRepeatLastReply,
  };
}
