import { useCallback, useRef, useState } from "react";

import { createSpeechRequestId } from "../../services/speech/diagnostics";
import { createVoicePipelineTtsQueue } from "../../services/voicePipeline/ttsQueue";
import type {
  AudioPlayer,
  ReplayPhase,
  UseVoicePipelineParams,
} from "./types";

type ReplayControllerParams = Pick<
  UseVoicePipelineParams,
  | "isRecording"
  | "language"
  | "selectedTtsModel"
  | "selectedTtsVoice"
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

export function useReplyReplayController({
  isBusy,
  isRecording,
  language,
  lastCompletedReplyRef,
  player,
  selectedTtsModel,
  selectedTtsVoice,
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
  const replayingRef = useRef(false);
  const replaySessionRef = useRef(0);
  const replayAbortRef = useRef<AbortController | null>(null);
  const [replayPhase, setReplayPhase] = useState<ReplayPhase>("idle");
  const [activeReplayMessageId, setActiveReplayMessageId] = useState<string | null>(
    null,
  );

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
      replayAbortRef.current = new AbortController();
      setActiveReplayMessageId(messageId ?? null);
      setReplayPhase("preparing");

      try {
        // Clear native or queued playback even when the rendered `isPlaying`
        // flag has not caught up with the underlying player yet.
        await player.stopPlayback();
        player.resetCancellation();
        const speechDiagnostics = {
          requestId: createSpeechRequestId("repeat"),
          source: "repeat" as const,
          provider: ttsProvider ?? null,
          providerModel: selectedTtsModel || null,
        };

        if (ttsMode === "native") {
          if (replaySessionRef.current !== replaySession) {
            return;
          }

          setReplayPhase("speaking");
          player.speakText(trimmed, {
            diagnostics: speechDiagnostics,
          });
          await player.waitForDrain();
          return;
        }

        const replayQueue = createVoicePipelineTtsQueue({
          abortSignal: replayAbortRef.current.signal,
          callbacks: {
            onTranscription: () => undefined,
            onChunk: () => undefined,
            onResponseDone: () => undefined,
            onAudioReady: (audioUri, diagnostics) => {
              if (replaySessionRef.current !== replaySession) {
                return;
              }

              setReplayPhase("speaking");
              player.enqueueAudio(audioUri, diagnostics);
            },
            onAudioPauseReady: (audioUri) => {
              if (replaySessionRef.current !== replaySession) {
                return;
              }

              player.enqueueAudio(audioUri);
            },
            onSpeechTextReady: (segmentText, voice, diagnostics) => {
              if (replaySessionRef.current !== replaySession) {
                return;
              }

              setReplayPhase("speaking");
              player.speakText(segmentText, {
                voice,
                diagnostics,
              });
            },
            onSpeechPauseReady: (durationMs) => {
              if (replaySessionRef.current !== replaySession) {
                return;
              }

              player.enqueueSpeechPause(durationMs);
            },
            onError: (error) => {
              if (
                replaySessionRef.current !== replaySession ||
                error.name === "AbortError"
              ) {
                return;
              }

              showToast(error.message, undefined, "danger");
            },
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
          ttsProvider,
          ttsVoice: selectedTtsVoice,
          ttsInstructions,
        });

        await replayQueue.handleResponseDone(trimmed);

        if (replaySessionRef.current !== replaySession) {
          return;
        }

        if (player.hasPendingPlaybackNow() || player.isPlaying) {
          setReplayPhase("speaking");
        }
        await player.waitForDrain();
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
      language,
      player,
      selectedTtsModel,
      selectedTtsVoice,
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
      const replyText = textOverride?.trim() || lastCompletedReplyRef.current.trim();

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
