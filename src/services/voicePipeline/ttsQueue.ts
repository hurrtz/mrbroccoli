import { createSpeechRequestId } from "../speech/diagnostics";
import type { SpeechDiagnosticSource } from "../speech/diagnostics";
import {
  getProviderTtsTargetChunkChars,
  PROVIDER_TTS_MAX_INPUT_CHARS,
  splitTextForTts,
  synthesizeSpeech,
} from "../tts";
import {
  DEFAULT_KOKORO_VOICES,
  KOKORO_TTS_TARGET_CHUNK_CHARS,
  getKokoroVoiceConfig,
  resolveKokoroLanguage,
} from "../../constants/kokoro";
import { extractCompleteSentences } from "./streaming";
import type { RunVoicePipelineParams } from "./types";

interface CreateVoicePipelineTtsQueueParams {
  abortSignal?: AbortSignal;
  callbacks: RunVoicePipelineParams["callbacks"];
  diagnosticsSource?: SpeechDiagnosticSource;
  fallbackToNativeOnProviderError?: boolean;
  language: RunVoicePipelineParams["language"];
  replyPlayback: RunVoicePipelineParams["replyPlayback"];
  spokenRepliesEnabled?: RunVoicePipelineParams["spokenRepliesEnabled"];
  ttsApiKey?: string;
  kokoroVoices?: RunVoicePipelineParams["kokoroVoices"];
  ttsListenLanguages?: RunVoicePipelineParams["ttsListenLanguages"];
  ttsMode: RunVoicePipelineParams["ttsMode"];
  ttsModel?: string;
  ttsProvider?: RunVoicePipelineParams["ttsProvider"];
  ttsVoice: string;
  ttsInstructions?: string;
}

const PROVIDER_TTS_PREFETCH_CONCURRENCY = 2;

type AudioDiagnostics = NonNullable<
  Parameters<RunVoicePipelineParams["callbacks"]["onAudioReady"]>[1]
>;

type ProviderSynthesisResult =
  | {
      kind: "audio";
      audio: string;
      diagnostics: AudioDiagnostics;
    }
  | { kind: "error"; error: Error }
  | null;

export function createVoicePipelineTtsQueue({
  abortSignal,
  callbacks,
  diagnosticsSource = "conversation",
  fallbackToNativeOnProviderError = true,
  language,
  replyPlayback,
  spokenRepliesEnabled = true,
  ttsApiKey,
  kokoroVoices,
  ttsListenLanguages,
  ttsMode,
  ttsModel,
  ttsProvider,
  ttsVoice,
  ttsInstructions,
}: CreateVoicePipelineTtsQueueParams) {
  let sentenceBuffer = "";
  let ttsChain = Promise.resolve();
  const ttsQueue: Promise<void>[] = [];
  const providerSynthesisSlots = Array.from(
    { length: PROVIDER_TTS_PREFETCH_CONCURRENCY },
    () => Promise.resolve(),
  );
  let nextProviderSynthesisSlot = 0;
  let previousProviderText = "";
  let fallbackNotified = false;
  let fatalProviderError = false;
  let fatalProviderErrorNotified = false;
  let playbackRoute: "native" | "kokoro" | "provider" | null =
    ttsMode === "native" ? "native" : null;
  const effectiveReplyPlayback = replyPlayback;
  const bufferProviderAudioUntilComplete =
    ttsMode !== "native" && effectiveReplyPlayback === "wait";
  const bufferedProviderAudio: Array<
    Extract<ProviderSynthesisResult, { kind: "audio" }>
  > = [];
  const bufferedTtsTexts: string[] = [];
  const speechDiagnostics = {
    requestId: createSpeechRequestId(diagnosticsSource),
    source: diagnosticsSource,
    mode: ttsMode,
    provider: ttsProvider ?? null,
    providerModel: ttsModel || null,
  };

  const notifyTtsFallback = (error: Error) => {
    if (fallbackNotified) {
      return;
    }

    fallbackNotified = true;
    callbacks.onTtsFallback?.(error);
  };

  const startProviderSynthesis = (
    text: string,
    context?: { previousText?: string; nextText?: string },
  ) => {
    const slotIndex = nextProviderSynthesisSlot;
    nextProviderSynthesisSlot =
      (nextProviderSynthesisSlot + 1) % PROVIDER_TTS_PREFETCH_CONCURRENCY;

    const synthesisTask: Promise<ProviderSynthesisResult> =
      providerSynthesisSlots[slotIndex].then(async () => {
        if (
          abortSignal?.aborted ||
          fatalProviderError ||
          playbackRoute === "native"
        ) {
          return null;
        }

        try {
          const kokoroLanguage =
            ttsMode === "kokoro"
              ? resolveKokoroLanguage({
                  text,
                  listenLanguages: ttsListenLanguages,
                })
              : null;
          const kokoroVoice = kokoroLanguage
            ? getKokoroVoiceConfig(
                kokoroLanguage,
                kokoroVoices?.[kokoroLanguage] ??
                  DEFAULT_KOKORO_VOICES[kokoroLanguage],
              ).id
            : null;
          const synthesisDiagnostics: AudioDiagnostics = {
            ...speechDiagnostics,
            language: kokoroLanguage ?? ttsListenLanguages?.[0] ?? "app",
            voice: kokoroVoice ?? (ttsVoice || null),
          };
          const audio = await synthesizeSpeech({
            text,
            voice: ttsVoice,
            mode: ttsMode,
            provider: ttsProvider,
            providerModel: ttsModel,
            apiKey: ttsApiKey,
            instructions: ttsInstructions,
            ...(ttsProvider === "elevenlabs"
              ? {
                  previousText: context?.previousText,
                  nextText: context?.nextText,
                }
              : {}),
            language,
            listenLanguages: ttsListenLanguages,
            kokoroVoices,
            diagnostics: synthesisDiagnostics,
            abortSignal,
          });
          return {
            kind: "audio",
            audio,
            diagnostics: synthesisDiagnostics,
          };
        } catch (error) {
          return {
            kind: "error",
            error: error instanceof Error ? error : new Error(String(error)),
          };
        }
      });

    providerSynthesisSlots[slotIndex] = synthesisTask.then(() => undefined);
    return synthesisTask;
  };

  const enqueueTtsChunk = (
    text: string,
    context?: { previousText?: string; nextText?: string },
  ) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    if (bufferProviderAudioUntilComplete) {
      bufferedTtsTexts.push(trimmed);
    }

    const providerSynthesis =
      ttsMode !== "native"
        ? startProviderSynthesis(trimmed, context)
        : null;
    const task = ttsChain.then(async () => {
      if (abortSignal?.aborted) {
        return;
      }

      if (fatalProviderError) {
        return;
      }

      if (!spokenRepliesEnabled) {
        return;
      }

      if (playbackRoute === "native") {
        if (!bufferProviderAudioUntilComplete) {
          callbacks.onSpeechTextReady(trimmed, undefined, speechDiagnostics);
        }
        return;
      }

      const synthesisResult = await providerSynthesis;

      if (!synthesisResult || abortSignal?.aborted) {
        return;
      }

      if (synthesisResult.kind === "audio") {
        if (bufferProviderAudioUntilComplete) {
          bufferedProviderAudio.push(synthesisResult);
          return;
        }

        playbackRoute = ttsMode;
        callbacks.onAudioReady(
          synthesisResult.audio,
          synthesisResult.diagnostics,
        );
        return;
      }

      if (
        fallbackToNativeOnProviderError &&
        playbackRoute !== ttsMode
      ) {
        playbackRoute = "native";
        notifyTtsFallback(synthesisResult.error);
        if (!bufferProviderAudioUntilComplete) {
          callbacks.onSpeechTextReady(trimmed, undefined, speechDiagnostics);
        }
        return;
      }

      fatalProviderError = true;
      throw synthesisResult.error;
    });

    ttsChain = task.catch(async (error) => {
      if (fatalProviderErrorNotified) {
        return;
      }

      fatalProviderErrorNotified = true;
      await callbacks.onError(
        error instanceof Error ? error : new Error(String(error)),
      );
    });
    ttsQueue.push(task.catch(() => undefined));
  };

  const enqueueTts = (text: string) => {
    if (!spokenRepliesEnabled) {
      return;
    }

    if (ttsMode === "native") {
      enqueueTtsChunk(text);
      return;
    }

    const segments = splitTextForTts(
      text,
      ttsMode === "kokoro"
        ? KOKORO_TTS_TARGET_CHUNK_CHARS
        : Math.min(
            PROVIDER_TTS_MAX_INPUT_CHARS,
            getProviderTtsTargetChunkChars(ttsProvider),
          ),
    );

    if (segments.length === 0) {
      return;
    }

    segments.forEach((segment, index) => {
      const previousText = previousProviderText || undefined;
      const nextText = segments[index + 1];
      previousProviderText = segment;
      enqueueTtsChunk(segment, { previousText, nextText });
    });
  };

  const handleStreamChunk = (text: string) => {
    callbacks.onChunk(text);

    if (effectiveReplyPlayback !== "stream") {
      return;
    }

    sentenceBuffer += text;
    const { completeSentences, remainder } =
      extractCompleteSentences(sentenceBuffer);

    if (completeSentences.length > 0) {
      enqueueTts(completeSentences.join(""));
    }
    sentenceBuffer = remainder;
  };

  const handleResponseDone = async (fullText: string) => {
    if (effectiveReplyPlayback === "stream") {
      if (sentenceBuffer.trim()) {
        enqueueTts(sentenceBuffer);
      }
    } else {
      enqueueTts(fullText);
    }

    await Promise.all(ttsQueue);
    await Promise.all(providerSynthesisSlots);

    if (
      !bufferProviderAudioUntilComplete ||
      fatalProviderError ||
      abortSignal?.aborted
    ) {
      return;
    }

    if (playbackRoute === "native") {
      bufferedTtsTexts.forEach((text) => {
        callbacks.onSpeechTextReady(text, undefined, speechDiagnostics);
      });
      return;
    }

    playbackRoute = ttsMode;
    bufferedProviderAudio.forEach((result) => {
      callbacks.onAudioReady(result.audio, result.diagnostics);
    });
  };

  return {
    handleResponseDone,
    handleStreamChunk,
  };
}
