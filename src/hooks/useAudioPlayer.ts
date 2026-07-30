import { useState, useRef, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import {
  useAudioPlayer as useExpoAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import * as Speech from "expo-speech";
import {
  isNativeAudioQueueAvailable,
  pauseNativeAudioQueue,
  prepareNativeAudioQueue,
  resumeNativeAudioQueue,
  startNativeAudioQueue,
} from "../services/nativeAudioQueue";
import { PLAYER_STATUS_INTERVAL_MS } from "./audioPlayer/shared";
import { useAudioClipPlayback } from "./audioPlayer/useAudioClipPlayback";
import { useNativeAudioQueuePlayback } from "./audioPlayer/useNativeAudioQueuePlayback";
import { useNativeAudioQueueSubscription } from "./audioPlayer/useNativeAudioQueueSubscription";
import { useNativeSpeechPlayback } from "./audioPlayer/useNativeSpeechPlayback";
import { usePendingPlaybackState } from "./audioPlayer/usePendingPlaybackState";
import { usePlaybackLifecycle } from "./audioPlayer/usePlaybackLifecycle";
import { usePlaybackSession } from "./audioPlayer/usePlaybackSession";
import { useStopPlaybackController } from "./audioPlayer/useStopPlaybackController";
import {
  type AudioQueueItem,
  type NativeAudioQueueContext,
  type NativeSpeechQueueItem,
} from "./audioPlayer/types";

interface UseAudioPlayerOptions {
  beforePlayback?: () => Promise<unknown>;
}

export function useAudioPlayer(
  options: UseAudioPlayerOptions = {},
) {
  const usingNativeAudioQueue = isNativeAudioQueueAvailable();
  const player = useExpoAudioPlayer(null, {
    updateInterval: PLAYER_STATUS_INTERVAL_MS,
    keepAudioSessionActive: false,
  });
  const status = useAudioPlayerStatus(player);
  const queueRef = useRef<AudioQueueItem[]>([]);
  const currentAudioRef = useRef<AudioQueueItem | null>(null);
  const playingRef = useRef(false);
  const startingRef = useRef(false);
  const cancelledRef = useRef(false);
  const playbackGenerationRef = useRef(0);
  const loadedSourceRef = useRef(false);
  const hasSeenAudioPlayingRef = useRef(false);
  const nativeAudioQueueContextsRef = useRef<Map<string, NativeAudioQueueContext>>(
    new Map(),
  );
  const nativeAudioQueuePendingCountRef = useRef(0);
  const nativeAudioQueuePlayingRef = useRef(false);
  const nativeQueueRef = useRef<NativeSpeechQueueItem[]>([]);
  const nativeSpeakingRef = useRef(false);
  const playbackPausedRef = useRef(false);
  const [nativeAudioQueuePlaying, setNativeAudioQueuePlaying] =
    useState(false);
  const [nativeSpeaking, setNativeSpeaking] = useState(false);
  const [nativeSpeechPlaying, setNativeSpeechPlaying] = useState(false);
  const [isPlaybackPaused, setPlaybackPaused] = useState(false);
  const {
    ensurePlaybackSession: ensurePlaybackSessionInternal,
    resetPlaybackSession,
  } =
    usePlaybackSession();
  const ensurePlaybackSession = useCallback(async () => {
    await options.beforePlayback?.();
    await ensurePlaybackSessionInternal();
  }, [ensurePlaybackSessionInternal, options.beforePlayback]);
  const clearNativeAudioQueueState = useCallback(() => {
    nativeAudioQueueContextsRef.current.clear();
    nativeAudioQueuePendingCountRef.current = 0;
    nativeAudioQueuePlayingRef.current = false;
    setNativeAudioQueuePlaying(false);
  }, []);
  const {
    hasPendingPlayback,
    hasPendingPlaybackNow,
    markPlaybackEnded,
    resolveDrainWaiters,
    updatePendingPlaybackState,
    waitForDrain,
    waitForPlaybackRouteSettle: waitForPlaybackRouteSettleInternal,
  } = usePendingPlaybackState({
    currentAudioRef,
    nativeAudioQueuePendingCountRef,
    nativeAudioQueuePlayingRef,
    nativeQueueRef,
    nativeSpeakingRef,
    playingRef,
    queueRef,
    startingRef,
    usingNativeAudioQueue,
  });
  const finalizeDrainedStateRef = useRef<() => void>(() => undefined);

  const ensureAudioQueuePlaybackSession = useCallback(async () => {
    if (!usingNativeAudioQueue) {
      await ensurePlaybackSession();
      return;
    }

    await ensurePlaybackSession();
    await prepareNativeAudioQueue();
  }, [ensurePlaybackSession, usingNativeAudioQueue]);

  const { playNativeAudio } = useNativeAudioQueuePlayback({
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
  });

  const { enqueueAudio, playNextAudio, removeLoadedAudio } =
    useAudioClipPlayback({
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
    });

  const finalizeDrainedState = useCallback(() => {
    playbackPausedRef.current = false;
    setPlaybackPaused(false);
    markPlaybackEnded();
    removeLoadedAudio();
    clearNativeAudioQueueState();
    resetPlaybackSession();
    updatePendingPlaybackState();
  }, [
    clearNativeAudioQueueState,
    markPlaybackEnded,
    removeLoadedAudio,
    resetPlaybackSession,
    updatePendingPlaybackState,
  ]);

  finalizeDrainedStateRef.current = finalizeDrainedState;

  const { enqueueSpeechPause, playNextNative, speakText } =
    useNativeSpeechPlayback({
      nativeSpeaking,
      setNativeSpeaking,
      setNativeSpeechPlaying,
      nativeQueueRef,
      queueRef,
      currentAudioRef,
      nativeSpeakingRef,
      playingRef,
      playbackGenerationRef,
      playbackPausedRef,
      startingRef,
      cancelledRef,
      ensurePlaybackSession,
      finalizeDrainedState,
      playNextAudio,
      updatePendingPlaybackState,
    });

  useNativeAudioQueueSubscription({
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
  });

  usePlaybackLifecycle({
    cancelledRef,
    currentAudioRef,
    finalizeDrainedState,
    hasSeenAudioPlayingRef,
    nativeAudioQueuePendingCountRef,
    nativeAudioQueuePlayingRef,
    nativeQueueRef,
    nativeSpeakingRef,
    playbackPausedRef,
    playNextAudio,
    playNextNative,
    playingRef,
    queueRef,
    resolveDrainWaiters,
    setNativeAudioQueuePlaying,
    statusPlaybackState: status.playbackState,
    statusPlaying: status.playing,
    updatePendingPlaybackState,
    usingNativeAudioQueue,
  });

  const { stopPlayback, resetCancellation } = useStopPlaybackController({
    cancelledRef,
    clearNativeAudioQueueState,
    currentAudioRef,
    hasPendingPlaybackNow,
    hasSeenAudioPlayingRef,
    markPlaybackEnded,
    nativeQueueRef,
    nativeSpeakingRef,
    playbackGenerationRef,
    playbackPausedRef,
    player,
    playingRef,
    removeLoadedAudio,
    resetPlaybackSession,
    setNativeSpeaking,
    setNativeSpeechPlaying,
    setPlaybackPaused,
    startingRef,
    updatePendingPlaybackState,
    usingNativeAudioQueue,
    queueRef,
  });

  const pausePlayback = useCallback(async () => {
    if (playbackPausedRef.current) {
      return true;
    }

    const hasNativeSpeech = nativeSpeakingRef.current;
    const hasNativeAudioQueue =
      usingNativeAudioQueue && nativeAudioQueuePlayingRef.current;
    const hasAudioClip =
      !usingNativeAudioQueue &&
      (playingRef.current || currentAudioRef.current !== null);

    if (!hasNativeSpeech && !hasNativeAudioQueue && !hasAudioClip) {
      return false;
    }

    try {
      if (hasNativeSpeech) {
        await Speech.pause();
        setNativeSpeechPlaying(false);
      } else if (hasNativeAudioQueue) {
        await pauseNativeAudioQueue();
        nativeAudioQueuePlayingRef.current = false;
        setNativeAudioQueuePlaying(false);
      } else {
        player.pause();
      }

      playbackPausedRef.current = true;
      setPlaybackPaused(true);
      playingRef.current = false;
      updatePendingPlaybackState();
      return true;
    } catch {
      return false;
    }
  }, [
    currentAudioRef,
    nativeSpeakingRef,
    nativeAudioQueuePlayingRef,
    player,
    playingRef,
    setNativeAudioQueuePlaying,
    updatePendingPlaybackState,
    usingNativeAudioQueue,
  ]);

  const resumePlayback = useCallback(async () => {
    if (!playbackPausedRef.current) {
      return true;
    }

    try {
      if (nativeSpeakingRef.current) {
        await ensurePlaybackSession();
        await Speech.resume();
        setNativeSpeechPlaying(true);
      } else if (
        usingNativeAudioQueue &&
        nativeAudioQueuePendingCountRef.current > 0
      ) {
        await ensureAudioQueuePlaybackSession();
        const resumed = currentAudioRef.current
          ? await resumeNativeAudioQueue()
          : await startNativeAudioQueue();

        if (!resumed) {
          return false;
        }

        nativeAudioQueuePlayingRef.current = true;
        setNativeAudioQueuePlaying(true);
        playingRef.current = true;
      } else if (currentAudioRef.current) {
        await ensurePlaybackSession();
        player.play();
        playingRef.current = true;
      } else if (queueRef.current.length > 0) {
        playbackPausedRef.current = false;
        setPlaybackPaused(false);
        void playNextAudio();
        updatePendingPlaybackState();
        return true;
      } else if (nativeQueueRef.current.length > 0) {
        playbackPausedRef.current = false;
        setPlaybackPaused(false);
        void playNextNative();
        updatePendingPlaybackState();
        return true;
      } else {
        playbackPausedRef.current = false;
        setPlaybackPaused(false);
        updatePendingPlaybackState();
        return false;
      }

      playbackPausedRef.current = false;
      setPlaybackPaused(false);
      updatePendingPlaybackState();
      return true;
    } catch {
      return false;
    }
  }, [
    currentAudioRef,
    ensureAudioQueuePlaybackSession,
    ensurePlaybackSession,
    nativeAudioQueuePlayingRef,
    nativeAudioQueuePendingCountRef,
    nativeQueueRef,
    nativeSpeakingRef,
    playNextAudio,
    playNextNative,
    player,
    playingRef,
    queueRef,
    setNativeAudioQueuePlaying,
    updatePendingPlaybackState,
    usingNativeAudioQueue,
  ]);

  const waitForPlaybackRouteSettle = useCallback(async () => {
    if (Platform.OS !== "ios") {
      return;
    }

    await waitForPlaybackRouteSettleInternal();
  }, [waitForPlaybackRouteSettleInternal]);

  useEffect(() => {
    if (
      usingNativeAudioQueue ||
      !currentAudioRef.current ||
      !hasSeenAudioPlayingRef.current
    ) {
      return;
    }

    if (
      status.playbackState === "paused" &&
      !playbackPausedRef.current
    ) {
      playbackPausedRef.current = true;
      setPlaybackPaused(true);
      playingRef.current = false;
      updatePendingPlaybackState();
      return;
    }

    if (status.playing && playbackPausedRef.current) {
      playbackPausedRef.current = false;
      setPlaybackPaused(false);
      playingRef.current = true;
      updatePendingPlaybackState();
    }
  }, [
    currentAudioRef,
    hasSeenAudioPlayingRef,
    playbackPausedRef,
    playingRef,
    status.playbackState,
    status.playing,
    updatePendingPlaybackState,
    usingNativeAudioQueue,
  ]);

  return {
    isPlaying: hasPendingPlayback,
    isActivelyPlaying:
      nativeSpeechPlaying ||
      nativeAudioQueuePlaying ||
      (!usingNativeAudioQueue && status.playing),
    hasPendingPlayback,
    isPlaybackPaused,
    enqueueAudio,
    enqueueSpeechPause,
    speakText,
    pausePlayback,
    resumePlayback,
    stopPlayback,
    resetCancellation,
    hasPendingPlaybackNow,
    waitForDrain,
    waitForPlaybackRouteSettle,
    usesNativeAudioQueue: usingNativeAudioQueue,
  };
}
