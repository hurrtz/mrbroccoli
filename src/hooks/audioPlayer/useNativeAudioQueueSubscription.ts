import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
} from "react";

import {
  subscribeToNativeAudioQueue,
  type NativeAudioQueueEvent,
} from "../../services/nativeAudioQueue";
import {
  SpeechDiagnosticsContext,
  recordSpeechDiagnostic,
} from "../../services/speech/diagnostics";
import {
  type AudioQueueItem,
  type NativeAudioQueueContext,
  type NativeSpeechQueueItem,
} from "./types";

export function useNativeAudioQueueSubscription(params: {
  usingNativeAudioQueue: boolean;
  playNextNative: () => Promise<void>;
  finalizeDrainedState: () => void;
  updatePendingPlaybackState: () => void;
  setNativeAudioQueuePlaying: Dispatch<SetStateAction<boolean>>;
  currentAudioRef: MutableRefObject<AudioQueueItem | null>;
  cancelledRef: MutableRefObject<boolean>;
  playingRef: MutableRefObject<boolean>;
  hasSeenAudioPlayingRef: MutableRefObject<boolean>;
  nativeAudioQueueContextsRef: MutableRefObject<
    Map<string, NativeAudioQueueContext>
  >;
  nativeAudioQueuePendingCountRef: MutableRefObject<number>;
  nativeAudioQueuePlayingRef: MutableRefObject<boolean>;
  playbackPausedRef: MutableRefObject<boolean>;
  nativeQueueRef: MutableRefObject<NativeSpeechQueueItem[]>;
}) {
  const {
    usingNativeAudioQueue,
    playNextNative,
    finalizeDrainedState,
    updatePendingPlaybackState,
    setNativeAudioQueuePlaying,
    currentAudioRef,
    cancelledRef,
    playingRef,
    hasSeenAudioPlayingRef,
    nativeAudioQueueContextsRef,
    nativeAudioQueuePendingCountRef,
    nativeAudioQueuePlayingRef,
    playbackPausedRef,
    nativeQueueRef,
  } = params;

  useEffect(() => {
    if (!usingNativeAudioQueue) {
      return;
    }

    const handleNativeAudioQueueEvent = (event: NativeAudioQueueEvent) => {
      const itemId = event.itemId ?? "";
      const context = itemId
        ? nativeAudioQueueContextsRef.current.get(itemId)
        : undefined;

      switch (event.type) {
        case "started": {
          if (context) {
            currentAudioRef.current = {
              generation: context.generation,
              id: itemId,
              uri: context.uri,
              diagnostics: context.diagnostics,
            };
          }
          hasSeenAudioPlayingRef.current = true;
          playingRef.current = true;
          nativeAudioQueuePlayingRef.current = true;
          setNativeAudioQueuePlaying(true);
          context?.onPlaybackStarted?.();
          recordSpeechDiagnostic({
            requestId:
              context?.diagnostics?.requestId ?? event.requestId ?? undefined,
            source:
              context?.diagnostics?.source ??
              (event.source as SpeechDiagnosticsContext["source"] | null) ??
              "unknown",
            stage: "playback-started",
            provider: context?.diagnostics?.provider ?? null,
            providerModel: context?.diagnostics?.providerModel ?? null,
          });
          updatePendingPlaybackState();
          break;
        }
        case "finished":
        case "failed": {
          if (context) {
            recordSpeechDiagnostic({
              requestId:
                context.diagnostics?.requestId ?? event.requestId ?? undefined,
              source:
                context.diagnostics?.source ??
                (event.source as SpeechDiagnosticsContext["source"] | null) ??
                "unknown",
              stage:
                event.type === "finished"
                  ? "playback-finished"
                  : "playback-stopped",
              provider: context.diagnostics?.provider ?? null,
              providerModel: context.diagnostics?.providerModel ?? null,
              message:
                event.type === "failed"
                  ? (event.message ?? undefined)
                  : undefined,
            });
          }

          if (itemId) {
            nativeAudioQueueContextsRef.current.delete(itemId);
          }
          nativeAudioQueuePendingCountRef.current = Math.max(
            0,
            nativeAudioQueuePendingCountRef.current - 1,
          );
          if (nativeAudioQueuePendingCountRef.current === 0) {
            currentAudioRef.current = null;
            hasSeenAudioPlayingRef.current = false;
            playingRef.current = false;
            nativeAudioQueuePlayingRef.current = false;
            setNativeAudioQueuePlaying(false);
          }
          updatePendingPlaybackState();
          if (
            !cancelledRef.current &&
            !playbackPausedRef.current &&
            nativeAudioQueuePendingCountRef.current === 0 &&
            nativeQueueRef.current.length > 0
          ) {
            void playNextNative();
          }
          break;
        }
        case "stopped": {
          break;
        }
        case "drained": {
          currentAudioRef.current = null;
          hasSeenAudioPlayingRef.current = false;
          playingRef.current = false;
          nativeAudioQueuePlayingRef.current = false;
          setNativeAudioQueuePlaying(false);
          nativeAudioQueuePendingCountRef.current = 0;
          nativeAudioQueueContextsRef.current.clear();
          updatePendingPlaybackState();

          if (
            !cancelledRef.current &&
            !playbackPausedRef.current &&
            nativeQueueRef.current.length > 0
          ) {
            void playNextNative();
          } else if (!cancelledRef.current && !playbackPausedRef.current) {
            finalizeDrainedState();
          }
          break;
        }
      }
    };

    return subscribeToNativeAudioQueue(handleNativeAudioQueueEvent);
  }, [
    cancelledRef,
    currentAudioRef,
    finalizeDrainedState,
    hasSeenAudioPlayingRef,
    nativeAudioQueueContextsRef,
    nativeAudioQueuePendingCountRef,
    nativeAudioQueuePlayingRef,
    playbackPausedRef,
    nativeQueueRef,
    playNextNative,
    playingRef,
    setNativeAudioQueuePlaying,
    updatePendingPlaybackState,
    usingNativeAudioQueue,
  ]);
}
