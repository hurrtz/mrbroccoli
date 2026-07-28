import { type MutableRefObject, useCallback } from "react";
import { type AudioPlayer } from "expo-audio";
import {
  recordSpeechDiagnostic,
  type SpeechDiagnosticsContext,
} from "../../services/speech/diagnostics";
import { nextPlaybackJobId } from "./shared";
import { type AudioQueueItem, type NativeAudioQueueContext } from "./types";

export function useAudioClipPlayback(params: {
  player: AudioPlayer;
  cancelledRef: MutableRefObject<boolean>;
  currentAudioRef: MutableRefObject<AudioQueueItem | null>;
  ensurePlaybackSession: () => Promise<void>;
  finalizeDrainedStateRef: MutableRefObject<() => void>;
  hasSeenAudioPlayingRef: MutableRefObject<boolean>;
  loadedSourceRef: MutableRefObject<boolean>;
  nativeAudioQueueContextsRef: MutableRefObject<Map<string, NativeAudioQueueContext>>;
  nativeAudioQueuePendingCountRef: MutableRefObject<number>;
  nativeSpeakingRef: MutableRefObject<boolean>;
  playbackPausedRef: MutableRefObject<boolean>;
  playNativeAudio: (
    itemId: string,
    uri: string,
    generation: number,
    diagnostics?: SpeechDiagnosticsContext,
  ) => Promise<void>;
  playbackGenerationRef: MutableRefObject<number>;
  playingRef: MutableRefObject<boolean>;
  queueRef: MutableRefObject<AudioQueueItem[]>;
  startingRef: MutableRefObject<boolean>;
  updatePendingPlaybackState: () => void;
  usingNativeAudioQueue: boolean;
}) {
  const {
    player,
    cancelledRef,
    currentAudioRef,
    ensurePlaybackSession,
    finalizeDrainedStateRef,
    hasSeenAudioPlayingRef,
    loadedSourceRef,
    nativeAudioQueueContextsRef,
    nativeAudioQueuePendingCountRef,
    nativeSpeakingRef,
    playbackPausedRef,
    playNativeAudio,
    playbackGenerationRef,
    playingRef,
    queueRef,
    startingRef,
    updatePendingPlaybackState,
    usingNativeAudioQueue,
  } = params;

  const removeLoadedAudio = useCallback(() => {
    player.clearLockScreenControls?.();

    if (!loadedSourceRef.current) {
      return;
    }

    player.remove();
    loadedSourceRef.current = false;
  }, [player]);

  const playNextAudio = useCallback(async () => {
    if (usingNativeAudioQueue) {
      return;
    }

    if (
      playingRef.current ||
      startingRef.current ||
      nativeSpeakingRef.current ||
      playbackPausedRef.current ||
      cancelledRef.current
    ) {
      return;
    }

    const next = queueRef.current.shift();

    if (!next) {
      finalizeDrainedStateRef.current();
      return;
    }

    startingRef.current = true;
    currentAudioRef.current = next;
    updatePendingPlaybackState();

    try {
      await ensurePlaybackSession();

      if (
        cancelledRef.current ||
        next.generation !== playbackGenerationRef.current
      ) {
        currentAudioRef.current = null;
        return;
      }

      player.replace(next.uri);
      loadedSourceRef.current = true;
      player.setActiveForLockScreen?.(
        true,
        {
          artist: "Mr Broccoli",
          title: "Spoken reply",
        },
        {
          showSeekBackward: false,
          showSeekForward: false,
        },
      );
      player.play();
      playingRef.current = true;
    } catch (error) {
      currentAudioRef.current = null;
      playingRef.current = false;
      recordSpeechDiagnostic({
        requestId: next.diagnostics?.requestId,
        source: next.diagnostics?.source ?? "unknown",
        stage: "playback-stopped",
        message:
          error instanceof Error
            ? error.message
            : "Audio playback could not be started.",
      });
      finalizeDrainedStateRef.current();
    } finally {
      startingRef.current = false;
      updatePendingPlaybackState();
    }
  }, [
    cancelledRef,
    currentAudioRef,
    ensurePlaybackSession,
    finalizeDrainedStateRef,
    nativeSpeakingRef,
    playbackPausedRef,
    player,
    playingRef,
    playbackGenerationRef,
    startingRef,
    updatePendingPlaybackState,
    usingNativeAudioQueue,
  ]);

  const enqueueAudio = useCallback(
    (
      audioUri: string,
      diagnostics?: SpeechDiagnosticsContext,
      onPlaybackStarted?: () => void,
    ) => {
      if (cancelledRef.current) {
        return;
      }

      if (usingNativeAudioQueue) {
        const itemId = nextPlaybackJobId("audio");
        const generation = playbackGenerationRef.current;
        nativeAudioQueueContextsRef.current.set(itemId, {
          generation,
          uri: audioUri,
          diagnostics,
          onPlaybackStarted,
        });
        nativeAudioQueuePendingCountRef.current += 1;
        recordSpeechDiagnostic({
          requestId: diagnostics?.requestId,
          source: diagnostics?.source ?? "unknown",
          stage: "playback-enqueued",
          provider: diagnostics?.provider ?? null,
          providerModel: diagnostics?.providerModel ?? null,
        });
        updatePendingPlaybackState();
        void playNativeAudio(itemId, audioUri, generation, diagnostics);
        return;
      }

      queueRef.current.push({
        generation: playbackGenerationRef.current,
        id: nextPlaybackJobId("audio"),
        uri: audioUri,
        diagnostics,
        onPlaybackStarted,
      });
      recordSpeechDiagnostic({
        requestId: diagnostics?.requestId,
        source: diagnostics?.source ?? "unknown",
        stage: "playback-enqueued",
        provider: diagnostics?.provider ?? null,
        providerModel: diagnostics?.providerModel ?? null,
      });
      updatePendingPlaybackState();

      if (
        !playingRef.current &&
        !startingRef.current &&
        !nativeSpeakingRef.current &&
        !playbackPausedRef.current
      ) {
        void playNextAudio();
      }
    },
    [
      cancelledRef,
      nativeAudioQueueContextsRef,
      nativeAudioQueuePendingCountRef,
      nativeSpeakingRef,
      playbackPausedRef,
      playNativeAudio,
      playNextAudio,
      playbackGenerationRef,
      playingRef,
      startingRef,
      updatePendingPlaybackState,
      usingNativeAudioQueue,
    ],
  );

  return {
    enqueueAudio,
    playNextAudio,
    removeLoadedAudio,
  };
}
