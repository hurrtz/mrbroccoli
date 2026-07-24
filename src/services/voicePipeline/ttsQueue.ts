import { createSpeechRequestId } from "../speech/diagnostics";
import type { SpeechDiagnosticSource } from "../speech/diagnostics";
import {
  getProviderTtsTargetChunkChars,
  PROVIDER_TTS_MAX_INPUT_CHARS,
  splitTextForTts,
  synthesizeSpeech,
} from "../tts";
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
  ttsListenLanguages?: RunVoicePipelineParams["ttsListenLanguages"];
  ttsMode: RunVoicePipelineParams["ttsMode"];
  ttsModel?: string;
  ttsProvider?: RunVoicePipelineParams["ttsProvider"];
  ttsVoice: string;
  ttsInstructions?: string;
}

const PROVIDER_TTS_PREFETCH_CONCURRENCY = 2;

type ProviderSynthesisResult =
  | { kind: "audio"; audio: string }
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
  let fallbackNotified = false;
  let fatalProviderError = false;
  let fatalProviderErrorNotified = false;
  let playbackRoute: "native" | "provider" | null =
    ttsMode === "native" ? "native" : null;
  const effectiveReplyPlayback = replyPlayback;
  const bufferProviderAudioUntilComplete =
    ttsMode === "provider" && effectiveReplyPlayback === "wait";
  const bufferedProviderAudio: string[] = [];
  const bufferedTtsTexts: string[] = [];
  const speechDiagnostics = {
    requestId: createSpeechRequestId(diagnosticsSource),
    source: diagnosticsSource,
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

  const startProviderSynthesis = (text: string) => {
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
          const audio = await synthesizeSpeech({
            text,
            voice: ttsVoice,
            mode: "provider",
            provider: ttsProvider,
            providerModel: ttsModel,
            apiKey: ttsApiKey,
            instructions: ttsInstructions,
            language,
            listenLanguages: ttsListenLanguages,
            diagnostics: speechDiagnostics,
            abortSignal,
          });
          return { kind: "audio", audio };
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

  const enqueueTtsChunk = (text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    if (bufferProviderAudioUntilComplete) {
      bufferedTtsTexts.push(trimmed);
    }

    const providerSynthesis =
      ttsMode === "provider" ? startProviderSynthesis(trimmed) : null;
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
          bufferedProviderAudio.push(synthesisResult.audio);
          return;
        }

        playbackRoute = "provider";
        callbacks.onAudioReady(synthesisResult.audio, speechDiagnostics);
        return;
      }

      if (
        fallbackToNativeOnProviderError &&
        playbackRoute !== "provider"
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
      Math.min(
        PROVIDER_TTS_MAX_INPUT_CHARS,
        getProviderTtsTargetChunkChars(ttsProvider),
      ),
    );

    if (segments.length === 0) {
      return;
    }

    segments.forEach(enqueueTtsChunk);
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

    playbackRoute = "provider";
    bufferedProviderAudio.forEach((audio) => {
      callbacks.onAudioReady(audio, speechDiagnostics);
    });
  };

  return {
    handleResponseDone,
    handleStreamChunk,
  };
}
