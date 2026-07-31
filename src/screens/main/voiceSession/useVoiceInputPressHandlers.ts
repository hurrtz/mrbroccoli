import { useCallback, useRef } from "react";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { ShowToastFn, TranslateFn } from "../shared";
import { AudioPlayerController } from "./types";

interface UseVoiceInputPressHandlersParams {
  cancelCurrentInteraction: () => Promise<void>;
  ensureVoiceSessionReady: () => boolean;
  isBusy: boolean;
  isRecording: boolean;
  playbackCanPause: boolean;
  player: AudioPlayerController;
  showToast: ShowToastFn;
  startVoiceCapture: () => Promise<void>;
  stopVoiceCapture: () => Promise<void>;
  t: TranslateFn;
  togglePlaybackPause: () => Promise<void>;
}

export function useVoiceInputPressHandlers({
  cancelCurrentInteraction,
  ensureVoiceSessionReady,
  isBusy,
  isRecording,
  playbackCanPause,
  player,
  showToast,
  startVoiceCapture,
  stopVoiceCapture,
  t,
  togglePlaybackPause,
}: UseVoiceInputPressHandlersParams) {
  const suppressNextPressOutRef = useRef(false);
  const { isPlaybackPaused, isPlaying, stopPlayback } = player;

  const handlePressIn = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-session-press-in",
      payload: {
        isBusy,
        isRecording,
        playerIsPlaying: isPlaying,
      },
    });

    if (playbackCanPause || isPlaybackPaused) {
      suppressNextPressOutRef.current = true;
      await togglePlaybackPause();
      return;
    }
    if (isBusy) {
      await cancelCurrentInteraction();
      return;
    }
    if (isPlaying) {
      await stopPlayback();
      return;
    }
    if (!ensureVoiceSessionReady()) {
      return;
    }

    try {
      await startVoiceCapture();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("couldntStartVoiceInput");
      recordDebugLogEvent({
        event: "voice-session-start-failed",
        level: "error",
        payload: { message },
      });
      showToast(message, undefined, "danger");
    }
  }, [
    cancelCurrentInteraction,
    ensureVoiceSessionReady,
    isBusy,
    isRecording,
    playbackCanPause,
    isPlaybackPaused,
    isPlaying,
    showToast,
    startVoiceCapture,
    stopPlayback,
    t,
    togglePlaybackPause,
  ]);

  const handlePressOut = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-session-press-out",
      payload: { isRecording },
    });

    if (suppressNextPressOutRef.current) {
      suppressNextPressOutRef.current = false;
      return;
    }

    try {
      await stopVoiceCapture();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("couldntProcessVoiceInput");
      recordDebugLogEvent({
        event: "voice-session-stop-failed",
        level: "error",
        payload: { message },
      });
      showToast(message, undefined, "danger");
    }
  }, [isRecording, showToast, stopVoiceCapture, t]);

  const handleTogglePress = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-session-toggle-press",
      payload: {
        isBusy,
        isRecording,
        playerIsPlaying: isPlaying,
      },
    });

    if (
      !isRecording &&
      !isPlaying &&
      !isBusy &&
      !ensureVoiceSessionReady()
    ) {
      return;
    }
    if (playbackCanPause || isPlaybackPaused) {
      await togglePlaybackPause();
      return;
    }
    if (isBusy) {
      await cancelCurrentInteraction();
      return;
    }
    if (isPlaying) {
      await stopPlayback();
      return;
    }

    try {
      if (isRecording) {
        await stopVoiceCapture();
      } else {
        await startVoiceCapture();
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isRecording
            ? t("couldntProcessVoiceInput")
            : t("couldntStartVoiceInput");
      recordDebugLogEvent({
        event: "voice-session-toggle-failed",
        level: "error",
        payload: { isRecording, message },
      });
      showToast(message, undefined, "danger");
    }
  }, [
    cancelCurrentInteraction,
    ensureVoiceSessionReady,
    isBusy,
    isRecording,
    playbackCanPause,
    isPlaybackPaused,
    isPlaying,
    showToast,
    startVoiceCapture,
    stopVoiceCapture,
    stopPlayback,
    t,
    togglePlaybackPause,
  ]);

  return { handlePressIn, handlePressOut, handleTogglePress };
}
