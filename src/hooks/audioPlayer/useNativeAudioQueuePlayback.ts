import { type MutableRefObject, useCallback, useRef } from "react";
import {
  enqueueNativeAudioQueueItem,
  startNativeAudioQueue,
} from "../../services/nativeAudioQueue";
import {
  recordSpeechDiagnostic,
  type SpeechDiagnosticsContext,
} from "../../services/speech/diagnostics";
import { type NativeAudioQueueContext, type NativeSpeechQueueItem } from "./types";

export function useNativeAudioQueuePlayback(params: {
  cancelledRef: MutableRefObject<boolean>;
  ensureAudioQueuePlaybackSession: () => Promise<void>;
  finalizeDrainedStateRef: MutableRefObject<() => void>;
  nativeAudioQueueContextsRef: MutableRefObject<Map<string, NativeAudioQueueContext>>;
  nativeAudioQueuePendingCountRef: MutableRefObject<number>;
  nativeQueueRef: MutableRefObject<NativeSpeechQueueItem[]>;
  nativeSpeakingRef: MutableRefObject<boolean>;
  playbackPausedRef: MutableRefObject<boolean>;
  playbackGenerationRef: MutableRefObject<number>;
  updatePendingPlaybackState: () => void;
}) {
  const {
    cancelledRef,
    ensureAudioQueuePlaybackSession,
    finalizeDrainedStateRef,
    nativeAudioQueueContextsRef,
    nativeAudioQueuePendingCountRef,
    nativeQueueRef,
    nativeSpeakingRef,
    playbackPausedRef,
    playbackGenerationRef,
    updatePendingPlaybackState,
  } = params;

  // Serializes native enqueue order. Each clip awaits session preparation
  // (including the variable-latency ambient-monitor stop) before reaching the
  // native queue, so two concurrent playNativeAudio calls could otherwise
  // race and enqueue out of source order.
  const enqueueChainRef = useRef<Promise<void>>(Promise.resolve());

  const playNativeAudioInner = useCallback(
    async (
      itemId: string,
      audioUri: string,
      generation: number,
      diagnostics?: SpeechDiagnosticsContext,
    ) => {
      try {
        await ensureAudioQueuePlaybackSession();

        if (
          cancelledRef.current ||
          generation !== playbackGenerationRef.current
        ) {
          nativeAudioQueueContextsRef.current.delete(itemId);
          nativeAudioQueuePendingCountRef.current = Math.max(
            0,
            nativeAudioQueuePendingCountRef.current - 1,
          );
          updatePendingPlaybackState();
          return;
        }

        await enqueueNativeAudioQueueItem({
          uri: audioUri,
          itemId,
          requestId: diagnostics?.requestId,
          source: diagnostics?.source ?? "unknown",
        });
        if (!playbackPausedRef.current) {
          await startNativeAudioQueue();
        }
      } catch (error) {
        nativeAudioQueueContextsRef.current.delete(itemId);
        nativeAudioQueuePendingCountRef.current = Math.max(
          0,
          nativeAudioQueuePendingCountRef.current - 1,
        );
        recordSpeechDiagnostic({
          requestId: diagnostics?.requestId,
          source: diagnostics?.source ?? "unknown",
          stage: "playback-stopped",
          provider: diagnostics?.provider ?? null,
          providerModel: diagnostics?.providerModel ?? null,
          message:
            error instanceof Error
              ? error.message
              : "Native audio queue playback could not be started.",
        });
        updatePendingPlaybackState();
        if (
          generation === playbackGenerationRef.current &&
          nativeAudioQueuePendingCountRef.current === 0 &&
          !nativeSpeakingRef.current &&
          nativeQueueRef.current.length === 0
        ) {
          finalizeDrainedStateRef.current();
        }
      }
    },
    [
      cancelledRef,
      ensureAudioQueuePlaybackSession,
      finalizeDrainedStateRef,
      nativeAudioQueueContextsRef,
      nativeAudioQueuePendingCountRef,
      nativeQueueRef,
      nativeSpeakingRef,
      playbackPausedRef,
      playbackGenerationRef,
      updatePendingPlaybackState,
    ],
  );

  const playNativeAudio = useCallback(
    (
      itemId: string,
      audioUri: string,
      generation: number,
      diagnostics?: SpeechDiagnosticsContext,
    ) => {
      const run = () =>
        playNativeAudioInner(itemId, audioUri, generation, diagnostics);
      const chained = enqueueChainRef.current.then(run, run);
      enqueueChainRef.current = chained;
      return chained;
    },
    [playNativeAudioInner],
  );

  return {
    playNativeAudio,
  };
}
