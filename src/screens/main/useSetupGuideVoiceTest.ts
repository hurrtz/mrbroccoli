import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createSpeechRequestId } from "../../services/speech/diagnostics";
import { streamChat } from "../../services/llm";
import { synthesizeSpeech } from "../../services/tts";
import { transcribeAudio } from "../../services/whisper";
import type { Settings } from "../../types";
import type { useLocalization } from "../../i18n";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { useNativeSpeechRecognizer } from "../../hooks/useNativeSpeechRecognizer";

import type { SetupGuideResolvedRoutes } from "./setupGuideSupport";

export type SetupGuideVoiceTestPhase =
  | "idle"
  | "recording"
  | "transcribing"
  | "thinking"
  | "synthesizing"
  | "speaking"
  | "success"
  | "error";

function buildAbortError() {
  const error = new Error("Aborted");
  error.name = "AbortError";
  return error;
}

async function requestSetupGuideReply(params: {
  transcript: string;
  settings: Settings;
  provider: SetupGuideResolvedRoutes["llm"]["provider"];
  model: string;
  apiKey: string;
  abortSignal?: AbortSignal;
}) {
  const { abortSignal, apiKey, model, provider, settings, transcript } = params;

  return new Promise<string>((resolve, reject) => {
    let settled = false;

    const finish = (callback: (value: string | Error) => void, value: string | Error) => {
      if (settled) {
        return;
      }

      settled = true;
      abortSignal?.removeEventListener("abort", handleAbort);
      callback(value);
    };

    const handleAbort = () => {
      finish((value) => reject(value as Error), buildAbortError());
    };

    abortSignal?.addEventListener("abort", handleAbort);

    void streamChat({
      messages: [
        {
          id: "setup-guide-user-message",
          role: "user",
          content: transcript,
          model: null,
          provider: null,
          timestamp: new Date().toISOString(),
        },
      ],
      model,
      provider,
      apiKey,
      assistantInstructions: settings.assistantInstructions,
      responseLength: settings.responseLength,
      responseTone: settings.responseTone,
      language: settings.language,
      onChunk: () => undefined,
      onDone: async (fullText) => {
        finish((value) => resolve(String(value).trim()), fullText);
      },
      onError: async (error) => {
        finish((value) => reject(value as Error), error);
      },
      abortSignal,
    }).then(() => {
      if (!settled && abortSignal?.aborted) {
        handleAbort();
      }
    });
  });
}

export function useSetupGuideVoiceTest(params: {
  visible: boolean;
  settings: Settings;
  routes: SetupGuideResolvedRoutes;
  provider: SetupGuideResolvedRoutes["llm"]["provider"];
  player: ReturnType<typeof useAudioPlayer>;
  recorder: ReturnType<typeof useAudioRecorder>;
  nativeStt: ReturnType<typeof useNativeSpeechRecognizer>;
  t: ReturnType<typeof useLocalization>["t"];
}) {
  const {
    nativeStt,
    player,
    provider,
    recorder,
    routes,
    settings,
    t,
    visible,
  } = params;
  const [phase, setPhase] = useState<SetupGuideVoiceTestPhase>("idle");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const routeResetKey = useMemo(
    () =>
      JSON.stringify({
        llmModel: routes.llm.model,
        provider,
        stt: routes.stt,
        tts: routes.tts,
      }),
    [provider, routes.llm.model, routes.stt, routes.tts],
  );

  const isRecording = phase === "recording";
  const isBusy = useMemo(
    () =>
      phase === "transcribing" ||
      phase === "thinking" ||
      phase === "synthesizing" ||
      phase === "speaking",
    [phase],
  );
  const hasCompleted = phase === "success";

  const cleanupActiveTest = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    if (player.isPlaying) {
      await player.stopPlayback();
    }

    if (nativeStt.isRecording) {
      await nativeStt.abortRecognition();
    }

    if (recorder.isRecording) {
      await recorder.stopRecording().catch(() => null);
    }
  }, [nativeStt, player, recorder]);

  const reset = useCallback(
    async (clearResults = false) => {
      await cleanupActiveTest();
      setPhase("idle");
      setErrorMessage(null);

      if (clearResults) {
        setTranscript("");
        setReply("");
      }
    },
    [cleanupActiveTest],
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    void reset(true);
  }, [provider, routeResetKey, visible]);

  const startRecording = useCallback(async () => {
    setErrorMessage(null);
    setTranscript("");
    setReply("");

    if (!routes.stt.enabled) {
      setPhase("error");
      setErrorMessage(t("setupGuideVoiceInputUnavailable"));
      return;
    }

    if (player.isPlaying) {
      await player.stopPlayback();
    }

    if (routes.stt.kind === "system") {
      await nativeStt.startRecognition();
    } else {
      await recorder.startRecording();
    }

    setPhase("recording");
  }, [nativeStt, player, recorder, routes.stt, t]);

  const stopRecording = useCallback(async () => {
    let nextTranscript = "";

    if (routes.stt.kind === "system") {
      setPhase("transcribing");
      nextTranscript = (await nativeStt.stopRecognition())?.trim() ?? "";
    } else if (routes.stt.kind === "provider") {
      const audioUri = await recorder.stopRecording();

      if (!audioUri) {
        throw new Error(t("couldntCatchThatTryAgain"));
      }

      setPhase("transcribing");
      nextTranscript =
        (await transcribeAudio({
          fileUri: audioUri,
          mode: "provider",
          provider: routes.stt.provider,
          providerModel: routes.stt.model,
          apiKey: settings.apiKeys[routes.stt.provider].trim(),
          language: settings.language,
        }))?.trim() ?? "";
    }

    if (!nextTranscript) {
      throw new Error(t("couldntCatchThatTryAgain"));
    }

    setTranscript(nextTranscript);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setPhase("thinking");

    const replyText = await requestSetupGuideReply({
      transcript: nextTranscript,
      settings,
      provider,
      model: routes.llm.model,
      apiKey: settings.apiKeys[provider].trim(),
      abortSignal: abortController.signal,
    });

    const trimmedReply = replyText.trim();

    if (!trimmedReply) {
      throw new Error(t("providerValidationFailed"));
    }

    setReply(trimmedReply);

    if (!routes.tts.enabled) {
      abortControllerRef.current = null;
      setPhase("success");
      return;
    }

    setPhase("synthesizing");

    const diagnostics = {
      requestId: createSpeechRequestId("setup"),
      source: "preview" as const,
      mode: routes.tts.kind === "kokoro" ? "kokoro" as const : "provider" as const,
      provider:
        routes.tts.kind === "provider" ? routes.tts.provider : null,
      providerModel:
        routes.tts.kind === "provider" ? routes.tts.model : null,
    };

    const audioUri = await synthesizeSpeech({
      text: trimmedReply,
      voice: routes.tts.voice,
      mode: routes.tts.kind,
      provider:
        routes.tts.kind === "provider" ? routes.tts.provider : null,
      providerModel:
        routes.tts.kind === "provider" ? routes.tts.model : undefined,
      apiKey:
        routes.tts.kind === "provider"
          ? settings.apiKeys[routes.tts.provider].trim()
          : undefined,
      language: settings.language,
      listenLanguages: settings.ttsListenLanguages,
      kokoroVoices: settings.kokoroVoices,
      diagnostics,
      abortSignal: abortController.signal,
    });

    if (abortController.signal.aborted) {
      throw buildAbortError();
    }

    player.resetCancellation();
    player.enqueueAudio(audioUri, diagnostics);
    setPhase("speaking");
    await player.waitForDrain();
    abortControllerRef.current = null;
    setPhase("success");
  }, [nativeStt, player, provider, recorder, routes, settings, t]);

  const handleAction = useCallback(async () => {
    try {
      if (!isRecording) {
        await startRecording();
        return;
      }

      await stopRecording();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setPhase("idle");
        return;
      }

      setPhase("error");
      setErrorMessage(
        error instanceof Error ? error.message : t("couldntProcessVoiceInput"),
      );
    }
  }, [isRecording, startRecording, stopRecording, t]);

  return {
    phase,
    transcript,
    reply,
    errorMessage,
    isRecording,
    isBusy,
    hasCompleted,
    handleAction,
    reset,
  };
}
