import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useCallback,
} from "react";

import * as Speech from "expo-speech";

import {
  SpeechDiagnosticsContext,
  recordSpeechDiagnostic,
} from "../../services/speech/diagnostics";
import { nextPlaybackJobId } from "./shared";
import { type AudioQueueItem, type NativeSpeechQueueItem } from "./types";

const NATIVE_SPEECH_STATE_POLL_MS = 750;
const NATIVE_SPEECH_START_TIMEOUT_MS = 6_000;
const NATIVE_SPEECH_MAX_RUNTIME_MS = 180_000;

function getNativeSpeechRuntimeTimeoutMs(text: string) {
  // System speech normally renders well below 100 ms per character. Keep a
  // generous ceiling so slow accessibility rates are not interrupted while
  // still guaranteeing that a missed callback/probe cannot hold the pipeline
  // forever.
  return Math.min(
    NATIVE_SPEECH_MAX_RUNTIME_MS,
    Math.max(15_000, text.trim().length * 200),
  );
}

export function useNativeSpeechPlayback(params: {
  setNativeSpeaking: Dispatch<SetStateAction<boolean>>;
  setNativeSpeechPlaying: Dispatch<SetStateAction<boolean>>;
  nativeQueueRef: MutableRefObject<NativeSpeechQueueItem[]>;
  queueRef: MutableRefObject<AudioQueueItem[]>;
  currentAudioRef: MutableRefObject<{
    id: string;
    uri: string;
    diagnostics?: SpeechDiagnosticsContext;
  } | null>;
  nativeSpeakingRef: MutableRefObject<boolean>;
  playingRef: MutableRefObject<boolean>;
  playbackGenerationRef: MutableRefObject<number>;
  playbackPausedRef: MutableRefObject<boolean>;
  startingRef: MutableRefObject<boolean>;
  cancelledRef: MutableRefObject<boolean>;
  ensurePlaybackSession: () => Promise<void>;
  finalizeDrainedState: () => void;
  playNextAudio: () => Promise<void>;
  updatePendingPlaybackState: () => void;
}) {
  const {
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
  } = params;

  const playNextNative = useCallback(async () => {
    if (
      nativeSpeakingRef.current ||
      playingRef.current ||
      startingRef.current ||
      playbackPausedRef.current ||
      cancelledRef.current
    ) {
      return;
    }

    const next = nativeQueueRef.current.shift();

    if (!next) {
      finalizeDrainedState();
      return;
    }

    currentAudioRef.current = null;
    startingRef.current = true;
    updatePendingPlaybackState();

    try {
      await ensurePlaybackSession();

      if (
        cancelledRef.current ||
        next.generation !== playbackGenerationRef.current
      ) {
        return;
      }

      nativeSpeakingRef.current = true;
      setNativeSpeaking(true);
      updatePendingPlaybackState();

      const continuePlayback = () => {
        updatePendingPlaybackState();
        if (cancelledRef.current) {
          finalizeDrainedState();
        } else if (queueRef.current.length > 0) {
          void playNextAudio();
        } else {
          void playNextNative();
        }
      };

      if (next.kind === "pause") {
        setNativeSpeechPlaying(false);
        setTimeout(() => {
          if (next.generation !== playbackGenerationRef.current) {
            return;
          }

          nativeSpeakingRef.current = false;
          setNativeSpeaking(false);
          continuePlayback();
        }, next.durationMs);
        return;
      }

      let completionHandled = false;
      let speechStateTimer: ReturnType<typeof setTimeout> | null = null;
      let speechStartTimer: ReturnType<typeof setTimeout> | null = null;
      let speechRuntimeTimer: ReturnType<typeof setTimeout> | null = null;
      let speechStarted = false;
      let consecutiveSilentPolls = 0;
      const speechRequestedAt = Date.now();

      const clearSpeechStateTimer = () => {
        if (speechStateTimer) {
          clearTimeout(speechStateTimer);
          speechStateTimer = null;
        }
      };
      const clearSpeechWatchdogs = () => {
        if (speechStartTimer) {
          clearTimeout(speechStartTimer);
          speechStartTimer = null;
        }
        if (speechRuntimeTimer) {
          clearTimeout(speechRuntimeTimer);
          speechRuntimeTimer = null;
        }
      };
      const completeSpeech = (
        stage: "playback-finished" | "playback-stopped",
        message?: string,
      ) => {
        if (completionHandled) {
          return;
        }

        if (next.generation !== playbackGenerationRef.current) {
          completionHandled = true;
          clearSpeechStateTimer();
          clearSpeechWatchdogs();
          return;
        }

        completionHandled = true;
        clearSpeechStateTimer();
        clearSpeechWatchdogs();
        setNativeSpeechPlaying(false);
        nativeSpeakingRef.current = false;
        setNativeSpeaking(false);
        recordSpeechDiagnostic({
          requestId: next.diagnostics?.requestId,
          source: next.diagnostics?.source ?? "unknown",
          stage,
          actualRoute: "native",
          provider: next.diagnostics?.provider ?? null,
          providerModel: next.diagnostics?.providerModel ?? null,
          voice: next.voice ?? null,
          textLength: next.text.trim().length,
          message,
        });
        continuePlayback();
      };
      const markSpeechStarted = () => {
        if (completionHandled || speechStarted) {
          return;
        }

        if (next.generation !== playbackGenerationRef.current) {
          completionHandled = true;
          clearSpeechStateTimer();
          clearSpeechWatchdogs();
          return;
        }

        speechStarted = true;
        if (speechStartTimer) {
          clearTimeout(speechStartTimer);
          speechStartTimer = null;
        }
        speechRuntimeTimer = setTimeout(() => {
          if (completionHandled) {
            return;
          }

          void Speech.stop().catch(() => undefined);
          completeSpeech(
            "playback-stopped",
            "Native speech exceeded its playback watchdog.",
          );
        }, getNativeSpeechRuntimeTimeoutMs(next.text));
        setNativeSpeechPlaying(true);
        recordSpeechDiagnostic({
          requestId: next.diagnostics?.requestId,
          source: next.diagnostics?.source ?? "unknown",
          stage: "playback-started",
          actualRoute: "native",
          provider: next.diagnostics?.provider ?? null,
          providerModel: next.diagnostics?.providerModel ?? null,
          voice: next.voice ?? null,
          textLength: next.text.trim().length,
        });
        next.onPlaybackStarted?.();
      };
      const scheduleSpeechStatePoll = () => {
        clearSpeechStateTimer();
        speechStateTimer = setTimeout(() => {
          void Speech.isSpeakingAsync()
            .then((isSpeaking) => {
              if (completionHandled) {
                return;
              }

              if (cancelledRef.current) {
                completeSpeech("playback-stopped");
                return;
              }

              if (isSpeaking) {
                consecutiveSilentPolls = 0;
                markSpeechStarted();
              } else if (speechStarted) {
                consecutiveSilentPolls += 1;
                if (consecutiveSilentPolls >= 2) {
                  completeSpeech(
                    "playback-finished",
                    "Recovered after the native speech completion callback was missed.",
                  );
                  return;
                }
              } else if (
                Date.now() - speechRequestedAt >=
                NATIVE_SPEECH_START_TIMEOUT_MS
              ) {
                completeSpeech(
                  "playback-stopped",
                  "Native speech did not start before the playback timeout.",
                );
                return;
              }

              scheduleSpeechStatePoll();
            })
            .catch(() => {
              if (completionHandled) {
                return;
              }

              if (
                !speechStarted &&
                Date.now() - speechRequestedAt >= NATIVE_SPEECH_START_TIMEOUT_MS
              ) {
                completeSpeech(
                  "playback-stopped",
                  "Native speech state could not be confirmed before the playback timeout.",
                );
                return;
              }

              scheduleSpeechStatePoll();
            });
        }, NATIVE_SPEECH_STATE_POLL_MS);
      };

      Speech.speak(next.text, {
        voice: next.voice,
        language: next.language,
        rate: 0.96,
        useApplicationAudioSession: true,
        onStart: () => {
          markSpeechStarted();
        },
        onDone: () => {
          completeSpeech("playback-finished");
        },
        onStopped: () => {
          completeSpeech("playback-stopped");
        },
        onError: (error) => {
          completeSpeech(
            "playback-stopped",
            error instanceof Error
              ? error.message
              : "Native speech playback failed.",
          );
        },
      });
      speechStartTimer = setTimeout(() => {
        if (completionHandled || speechStarted) {
          return;
        }

        void Speech.stop().catch(() => undefined);
        completeSpeech(
          "playback-stopped",
          "Native speech did not start before the playback timeout.",
        );
      }, NATIVE_SPEECH_START_TIMEOUT_MS);
      scheduleSpeechStatePoll();
    } catch (error) {
      setNativeSpeechPlaying(false);
      nativeSpeakingRef.current = false;
      setNativeSpeaking(false);
      recordSpeechDiagnostic({
        requestId:
          next.kind === "speech"
            ? next.diagnostics?.requestId
            : undefined,
        source:
          next.kind === "speech"
            ? next.diagnostics?.source ?? "unknown"
            : "unknown",
        stage: "playback-stopped",
        actualRoute: "native",
        provider:
          next.kind === "speech"
            ? next.diagnostics?.provider ?? null
            : null,
        providerModel:
          next.kind === "speech"
            ? next.diagnostics?.providerModel ?? null
            : null,
        voice: next.kind === "speech" ? next.voice ?? null : null,
        textLength:
          next.kind === "speech" ? next.text.trim().length : undefined,
        message:
          error instanceof Error
            ? error.message
            : "Native playback session could not be started.",
      });
      updatePendingPlaybackState();
      finalizeDrainedState();
    } finally {
      startingRef.current = false;
      updatePendingPlaybackState();
    }
  }, [
    cancelledRef,
    currentAudioRef,
    ensurePlaybackSession,
    finalizeDrainedState,
    nativeQueueRef,
    nativeSpeakingRef,
    playbackGenerationRef,
    playbackPausedRef,
    playNextAudio,
    playingRef,
    queueRef,
    setNativeSpeaking,
    setNativeSpeechPlaying,
    startingRef,
    updatePendingPlaybackState,
  ]);

  const speakText = useCallback(
    (
      text: string,
      options?: {
        voice?: string;
        language?: string;
        diagnostics?: SpeechDiagnosticsContext;
        onPlaybackStarted?: () => void;
      },
    ) => {
      if (cancelledRef.current) {
        return;
      }

      nativeQueueRef.current.push({
        generation: playbackGenerationRef.current,
        id: nextPlaybackJobId("native"),
        kind: "speech",
        text,
        voice: options?.voice,
        language: options?.language,
        diagnostics: options?.diagnostics,
        onPlaybackStarted: options?.onPlaybackStarted,
      });
      recordSpeechDiagnostic({
        requestId: options?.diagnostics?.requestId,
        source: options?.diagnostics?.source ?? "unknown",
        stage: "playback-enqueued",
        actualRoute: "native",
        provider: options?.diagnostics?.provider ?? null,
        voice: options?.voice ?? null,
        textLength: text.trim().length,
      });
      updatePendingPlaybackState();

      if (
        !nativeSpeakingRef.current &&
        !playingRef.current &&
        !startingRef.current &&
        !playbackPausedRef.current
      ) {
        void playNextNative();
      }
    },
    [
      cancelledRef,
      nativeQueueRef,
      nativeSpeakingRef,
      playbackGenerationRef,
      playbackPausedRef,
      playNextNative,
      playingRef,
      startingRef,
      updatePendingPlaybackState,
    ],
  );

  const enqueueSpeechPause = useCallback(
    (durationMs: number) => {
      if (cancelledRef.current || durationMs <= 0) {
        return;
      }

      nativeQueueRef.current.push({
        generation: playbackGenerationRef.current,
        id: nextPlaybackJobId("native"),
        kind: "pause",
        durationMs,
      });
      updatePendingPlaybackState();

      if (
        !nativeSpeakingRef.current &&
        !playingRef.current &&
        !startingRef.current &&
        !playbackPausedRef.current
      ) {
        void playNextNative();
      }
    },
    [
      cancelledRef,
      nativeQueueRef,
      nativeSpeakingRef,
      playbackGenerationRef,
      playbackPausedRef,
      playNextNative,
      playingRef,
      startingRef,
      updatePendingPlaybackState,
    ],
  );

  return {
    enqueueSpeechPause,
    playNextNative,
    speakText,
  };
}
