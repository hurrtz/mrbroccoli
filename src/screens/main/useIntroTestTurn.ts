import React from "react";

import type { IntroTestTurnState } from "../../components/introFlow/introSteps";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { runVoicePipeline } from "../../services/voicePipeline";
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
>;

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
  /** The flow is open; leaving it aborts any in-flight test turn. */
  active: boolean;
  getRouteParams: () => IntroTestRouteParams;
  player: IntroTestTurnPlayer;
  t: TranslateFn;
}): IntroTestTurnState {
  const recorder = useAudioRecorder();
  const [phase, setPhase] = React.useState<IntroTestTurnState["phase"]>(
    "idle",
  );
  const [turn, setTurn] = React.useState<IntroTestTurnState["turn"]>(null);
  const [replaying, setReplaying] = React.useState(false);

  const abortRef = React.useRef<AbortController | null>(null);
  const runRef = React.useRef(0);
  const speechRef = React.useRef<
    { kind: "audio"; uris: string[] } | { kind: "text"; text: string } | null
  >(null);

  const abortActiveRun = React.useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    runRef.current += 1;
  }, []);

  React.useEffect(() => {
    if (!active) {
      abortActiveRun();
      setPhase("idle");
      setReplaying(false);
      setTurn(null);
      speechRef.current = null;
    }
  }, [abortActiveRun, active]);

  React.useEffect(() => () => abortActiveRun(), [abortActiveRun]);

  const onPressIn = React.useCallback(() => {
    if (phase !== "idle") {
      return;
    }
    abortActiveRun();
    setPhase("recording");
    void recorder.startRecording();
  }, [abortActiveRun, phase, recorder]);

  const onPressOut = React.useCallback(() => {
    if (phase !== "recording") {
      return;
    }
    const runId = (runRef.current += 1);
    const releasedAtMs = Date.now();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("running");

    void (async () => {
      const audioUri = await recorder.stopRecording();
      if (runRef.current !== runId) {
        return;
      }
      if (!audioUri) {
        setPhase("idle");
        return;
      }

      let question = "";
      let answer = "";
      let latencyLabel: string | null = null;
      const audioUris: string[] = [];

      const finishIfDone = () => {
        if (runRef.current !== runId) {
          return;
        }
        if (audioUris.length > 0) {
          speechRef.current = { kind: "audio", uris: audioUris };
        }
        setTurn(
          question && answer
            ? { answer, latencyLabel, question }
            : null,
        );
        setPhase("idle");
      };

      const markSpeechStart = () => {
        if (runRef.current !== runId || latencyLabel) {
          return;
        }
        latencyLabel = `${((Date.now() - releasedAtMs) / 1000).toFixed(1)} s`;
        setTurn((current) =>
          current ? { ...current, latencyLabel } : current,
        );
      };

      try {
        await runVoicePipeline({
          ...getRouteParams(),
          abortSignal: controller.signal,
          messages: [],
          turnId: `intro-test-${runId}`,
          audioUri,
          callbacks: {
            onTranscription: (text) => {
              if (runRef.current !== runId) {
                return null;
              }
              question = text;
              setTurn({ answer: "", latencyLabel: null, question: text });
              return null;
            },
            onChunk: () => {},
            onResponseDone: (fullText) => {
              if (runRef.current !== runId) {
                return;
              }
              answer = fullText;
              setTurn({ answer: fullText, latencyLabel, question });
            },
            onAudioReady: (uri) => {
              if (runRef.current !== runId) {
                return;
              }
              audioUris.push(uri);
              player.enqueueAudio(uri, undefined, markSpeechStart);
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
            },
            onError: () => {
              if (runRef.current !== runId) {
                return;
              }
              setTurn({
                answer: t("introTestTurnFailed"),
                latencyLabel: null,
                question,
              });
            },
          },
        });
      } finally {
        finishIfDone();
      }
    })();
  }, [getRouteParams, phase, player, recorder, t]);

  const onReplay = React.useCallback(() => {
    const speech = speechRef.current;
    if (!speech || replaying) {
      return;
    }
    setReplaying(true);
    const done = () => setReplaying(false);
    if (speech.kind === "audio") {
      speech.uris.forEach((uri, index) =>
        player.enqueueAudio(uri, undefined, index === 0 ? done : undefined),
      );
    } else {
      player.speakText(speech.text, { onPlaybackStarted: done });
    }
  }, [player, replaying]);

  return React.useMemo(
    () => ({ onPressIn, onPressOut, onReplay, phase, replaying, turn }),
    [onPressIn, onPressOut, onReplay, phase, replaying, turn],
  );
}
