import React from "react";

import type { IntroTestTurnState } from "../../components/introFlow/introSteps";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { transcribeRecordedFile } from "../../hooks/nativeSpeechRecognizer/transcribeRecordedFile";
import { runVoicePipeline } from "../../services/voicePipeline";
import { cleanupCapturedAudio } from "../../services/voicePipeline/cleanup";
import type { RunVoicePipelineParams } from "../../services/voicePipeline/types";
import type { SpeechDiagnosticsContext } from "../../services/speech/diagnostics";
import type { TranslateFn } from "./shared";

type IntroTestRouteParams = Pick<
  RunVoicePipelineParams,
  | "assistantInstructions"
  | "kokoroVoices"
  | "language"
  | "localLlmModelId"
  | "localSttModelId"
  | "localTtsModelId"
  | "model"
  | "modelEffort"
  | "provider"
  | "providerApiKey"
  | "replyPlayback"
  | "responseLength"
  | "responseTone"
  | "spokenRepliesEnabled"
  | "sttApiKey"
  | "sttLanguage"
  | "sttMode"
  | "sttModel"
  | "sttProvider"
  | "ttsApiKey"
  | "ttsInstructions"
  | "ttsListenLanguages"
  | "ttsMode"
  | "ttsModel"
  | "ttsProvider"
  | "ttsVoice"
> &
  Required<Pick<RunVoicePipelineParams, "ttsFallbackRoutes">> & {
    nativeSttRequiresOnDevice: boolean;
  };

interface IntroTestTurnPlayer {
  enqueueAudio: (
    audioUri: string,
    diagnostics?: SpeechDiagnosticsContext,
    onPlaybackStarted?: () => void,
  ) => void;
  speakText: (
    text: string,
    options?: {
      voice?: string;
      language?: string;
      diagnostics?: SpeechDiagnosticsContext;
      onPlaybackStarted?: () => void;
    },
  ) => void;
  resetCancellation: () => void;
  stopPlayback: () => Promise<void> | void;
  waitForDrain?: () => Promise<void>;
}

interface IntroRecordingRequest {
  cancelled: boolean;
  start: Promise<boolean>;
  stop: Promise<string | null> | null;
}

/**
 * The introduction's ephemeral test turn.
 *
 * A hold-to-talk press runs one real turn through the voice pipeline on the
 * user's configured routes, with an empty history and callbacks that hold
 * only local state -- nothing reaches the conversation store, so nothing is
 * saved by construction. The number shown is release-to-speech latency: the
 * figure that improves when routes change.
 */
export function useIntroTestTurn({
  active,
  getRouteParams,
  player,
  t,
}: {
  /** The flow is open and its reasoning route is runnable. */
  active: boolean;
  getRouteParams: () => IntroTestRouteParams;
  player: IntroTestTurnPlayer;
  t: TranslateFn;
}): IntroTestTurnState {
  const recorder = useAudioRecorder();
  const [error, setError] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<IntroTestTurnState["phase"]>("idle");
  const [turn, setTurn] = React.useState<IntroTestTurnState["turn"]>(null);
  const [replaying, setReplaying] = React.useState(false);

  const activeRef = React.useRef(active);
  const abortRef = React.useRef<AbortController | null>(null);
  const finalTranscriptRef = React.useRef("");
  const latestTranscriptRef = React.useRef("");
  const ownsPlaybackRef = React.useRef(false);
  const playbackOwnershipRef = React.useRef(0);
  const playerRef = React.useRef(player);
  const recorderRef = React.useRef(recorder);
  const recordingRequestRef = React.useRef<IntroRecordingRequest | null>(null);
  const recordingTeardownRef = React.useRef<Promise<void>>(Promise.resolve());
  const replayRunRef = React.useRef(0);
  const runRef = React.useRef(0);
  const speechRef = React.useRef<
    { kind: "audio"; uris: string[] } | { kind: "text"; text: string } | null
  >(null);
  playerRef.current = player;
  recorderRef.current = recorder;
  activeRef.current = active;

  const abortActiveRun = React.useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    runRef.current += 1;
  }, []);

  const trackIntroPlayback = React.useCallback(() => {
    ownsPlaybackRef.current = true;
    const ownership = (playbackOwnershipRef.current += 1);
    const waitForDrain = playerRef.current.waitForDrain;
    if (!waitForDrain) {
      return null;
    }

    const drained = waitForDrain();
    const clearOwnership = () => {
      if (playbackOwnershipRef.current === ownership) {
        ownsPlaybackRef.current = false;
      }
    };
    void drained.then(clearOwnership, clearOwnership);
    return drained;
  }, []);

  const stopIntroPlayback = React.useCallback(() => {
    playbackOwnershipRef.current += 1;
    replayRunRef.current += 1;
    if (!ownsPlaybackRef.current) {
      return Promise.resolve();
    }

    ownsPlaybackRef.current = false;
    try {
      return Promise.resolve(playerRef.current.stopPlayback()).then(
        () => undefined,
        () => undefined,
      );
    } catch {
      // Teardown must remain safe if the native player is already gone.
      return Promise.resolve();
    }
  }, []);

  const stopRecordingRequest = React.useCallback(
    (request: IntroRecordingRequest) => {
      request.stop ??= request.start.then((started) =>
        started ? recorderRef.current.stopRecording() : null,
      );
      recordingTeardownRef.current = request.stop.then(
        () => undefined,
        () => undefined,
      );
      return request.stop;
    },
    [],
  );

  const stopIntroRecording = React.useCallback(() => {
    const request = recordingRequestRef.current;
    if (!request) {
      return;
    }

    recordingRequestRef.current = null;
    request.cancelled = true;
    const teardown = stopRecordingRequest(request)
      .then(async (audioUri) => {
        await cleanupCapturedAudio(audioUri ?? undefined);
      })
      .catch(() => undefined);
    recordingTeardownRef.current = teardown;
  }, [stopRecordingRequest]);

  React.useEffect(() => {
    if (!active) {
      abortActiveRun();
      stopIntroRecording();
      void stopIntroPlayback();
      setPhase("idle");
      setReplaying(false);
      setTurn(null);
      setError(null);
      speechRef.current = null;
    }
  }, [abortActiveRun, active, stopIntroPlayback, stopIntroRecording]);

  React.useEffect(
    () => () => {
      abortActiveRun();
      stopIntroRecording();
      void stopIntroPlayback();
    },
    [abortActiveRun, stopIntroPlayback, stopIntroRecording],
  );

  const onPressIn = React.useCallback(() => {
    if (!activeRef.current || phase !== "idle") {
      return;
    }
    abortActiveRun();
    // A new capture supersedes replay as well as the owned audio itself.
    // Invalidate the replay's drain callback and release its disabled UI state
    // before recording begins.
    setReplaying(false);
    speechRef.current = null;
    setError(null);
    // stopPlayback dispatches native teardown synchronously; recording can
    // prepare immediately while that best-effort native promise settles.
    void stopIntroPlayback();
    const startRun = runRef.current;
    setPhase("recording");
    const request: IntroRecordingRequest = {
      cancelled: false,
      start: Promise.resolve(false),
      stop: null,
    };
    request.start = recordingTeardownRef.current.then(async () => {
      if (request.cancelled || !activeRef.current) {
        return false;
      }
      await recorder.startRecording();
      return true;
    });
    recordingRequestRef.current = request;
    void request.start.catch(() => {
      if (recordingRequestRef.current === request) {
        recordingRequestRef.current = null;
      }
      if (runRef.current === startRun) {
        setError(t("introTestTurnFailed"));
        setPhase("idle");
      }
    });
  }, [abortActiveRun, phase, recorder, stopIntroPlayback, t]);

  const onPressOut = React.useCallback(() => {
    if (!activeRef.current) {
      stopIntroRecording();
      setPhase("idle");
      return;
    }
    if (phase !== "recording") {
      return;
    }
    const runId = (runRef.current += 1);
    const releasedAtMs = Date.now();
    const controller = new AbortController();
    abortRef.current = controller;
    const recordingRequest = recordingRequestRef.current;
    setPhase("running");

    const stopTask = recordingRequest
      ? stopRecordingRequest(recordingRequest)
      : Promise.resolve(null);

    void (async () => {
      let audioUri: string | null;
      try {
        audioUri = await stopTask;
      } catch {
        if (runRef.current === runId) {
          abortRef.current = null;
          setError(t("introTestTurnFailed"));
          setPhase("idle");
        }
        return;
      }
      if (recordingRequestRef.current === recordingRequest) {
        recordingRequestRef.current = null;
      }
      if (runRef.current !== runId) {
        await cleanupCapturedAudio(audioUri ?? undefined);
        return;
      }
      if (!audioUri) {
        abortRef.current = null;
        setError(t("introTestTurnFailed"));
        setPhase("idle");
        return;
      }

      player.resetCancellation();

      let question = "";
      let answer = "";
      let failed = false;
      let latencyLabel: string | null = null;
      const audioUris: string[] = [];

      const finishIfDone = () => {
        if (runRef.current !== runId) {
          return;
        }
        if (audioUris.length > 0) {
          speechRef.current = { kind: "audio", uris: audioUris };
        }
        if (!failed) {
          setError(null);
          setTurn(
            question && answer
              ? { answer, latencyLabel, question, successful: true }
              : null,
          );
        }
        setPhase("idle");
      };

      const markFailed = () => {
        if (runRef.current !== runId || controller.signal.aborted) {
          return;
        }
        failed = true;
        const message = t("introTestTurnFailed");
        setError(message);
        if (question) {
          setTurn({
            answer: message,
            latencyLabel: null,
            question,
            successful: false,
          });
        } else {
          setTurn(null);
        }
      };

      const markSpeechStart = () => {
        if (runRef.current !== runId || failed || latencyLabel) {
          return;
        }
        latencyLabel = `${((Date.now() - releasedAtMs) / 1000).toFixed(1)} s`;
        setTurn((current) =>
          current ? { ...current, latencyLabel } : current,
        );
      };

      try {
        const { nativeSttRequiresOnDevice, ...routeParams } = getRouteParams();
        let transcriptionOverride: string | undefined;
        if (routeParams.sttMode === "native") {
          const transcription = await transcribeRecordedFile({
            abortSignal: controller.signal,
            fileUri: audioUri,
            finalTranscriptRef,
            latestTranscriptRef,
            requiresOnDeviceRecognition: nativeSttRequiresOnDevice,
            sttLanguage: routeParams.sttLanguage,
            t,
          });
          if (runRef.current !== runId || controller.signal.aborted) {
            return;
          }
          if (!transcription) {
            markFailed();
            return;
          }
          transcriptionOverride = transcription;
        }

        const pipelineTranscript = await runVoicePipeline({
          ...routeParams,
          abortSignal: controller.signal,
          messages: [],
          turnId: `intro-test-${runId}`,
          audioUri,
          transcriptionOverride,
          callbacks: {
            onTranscription: (text) => {
              if (runRef.current !== runId) {
                return null;
              }
              question = text;
              setTurn({
                answer: "",
                latencyLabel: null,
                question: text,
                successful: false,
              });
              return null;
            },
            onChunk: () => {},
            onResponseDone: (fullText) => {
              if (runRef.current !== runId) {
                return;
              }
              answer = fullText;
              if (!failed) {
                setTurn({
                  answer: fullText,
                  latencyLabel,
                  question,
                  successful: false,
                });
              }
            },
            onAudioReady: (uri) => {
              if (runRef.current !== runId) {
                return;
              }
              audioUris.push(uri);
              player.enqueueAudio(uri, undefined, markSpeechStart);
              trackIntroPlayback();
            },
            onSpeechTextReady: (text, voice) => {
              if (runRef.current !== runId) {
                return;
              }
              speechRef.current = { kind: "text", text };
              player.speakText(text, {
                onPlaybackStarted: markSpeechStart,
                voice,
              });
              trackIntroPlayback();
            },
            onError: () => {
              if (runRef.current !== runId) {
                return;
              }
              markFailed();
            },
          },
        });
        if (!pipelineTranscript?.trim()) {
          markFailed();
        }
      } catch {
        if (runRef.current === runId && !controller.signal.aborted) {
          markFailed();
        }
      } finally {
        // The normal conversation flow retains failed STT captures for Retry.
        // Intro has no retry owner, so it must always release its ephemeral
        // recording; the cleanup helper is idempotent after successful runs.
        await cleanupCapturedAudio(audioUri);
        finishIfDone();
      }
    })();
  }, [
    getRouteParams,
    phase,
    player,
    stopIntroRecording,
    stopRecordingRequest,
    t,
    trackIntroPlayback,
  ]);

  const onReplay = React.useCallback(() => {
    const speech = speechRef.current;
    if (!activeRef.current || !speech || replaying) {
      return;
    }
    const replayRun = (replayRunRef.current += 1);
    player.resetCancellation();
    setReplaying(true);
    const done = () => {
      if (replayRunRef.current === replayRun) {
        setReplaying(false);
      }
    };
    const playbackStartedFallback = player.waitForDrain ? undefined : done;
    if (speech.kind === "audio") {
      speech.uris.forEach((uri, index) =>
        player.enqueueAudio(
          uri,
          undefined,
          index === 0 ? playbackStartedFallback : undefined,
        ),
      );
    } else {
      player.speakText(speech.text, {
        onPlaybackStarted: playbackStartedFallback,
      });
    }
    const drained = trackIntroPlayback();
    if (drained) {
      void drained.then(done, done);
    }
  }, [player, replaying, trackIntroPlayback]);

  return React.useMemo(
    () => ({ error, onPressIn, onPressOut, onReplay, phase, replaying, turn }),
    [error, onPressIn, onPressOut, onReplay, phase, replaying, turn],
  );
}
