import { resolveTtsListenLanguage } from "../../utils/ttsRouting";
import { createSpeechRequestId } from "../speech/diagnostics";
import {
  getInterParagraphPauseAudioUri,
  INTER_PARAGRAPH_PAUSE_MS,
} from "../playbackCues";
import { splitTextForTts } from "../tts";
import { extractCompleteParagraphs } from "./streaming";
import {
  getTtsChunkTargetChars,
  normalizeFallbackRoutes,
} from "./ttsQueue/config";
import { createTtsRouteSelector } from "./ttsQueue/routeSelector";
import type {
  CreateVoicePipelineTtsQueueParams,
  TtsChunkContext,
  TtsSynthesisResult,
} from "./ttsQueue/types";

const TTS_PREFETCH_CONCURRENCY = 2;

export function createVoicePipelineTtsQueue(
  config: CreateVoicePipelineTtsQueueParams,
) {
  const {
    abortSignal,
    callbacks,
    diagnosticsSource = "conversation",
    language,
    replyPlayback,
    spokenRepliesEnabled = true,
    ttsFallbackRoutes,
    ttsListenLanguages,
    ttsMode,
    ttsProvider,
  } = config;
  const fallbackRoutes = normalizeFallbackRoutes(
    ttsMode,
    ttsFallbackRoutes,
  );
  const requestId = createSpeechRequestId(diagnosticsSource);
  const bufferUntilComplete = ttsMode !== "native" && replyPlayback === "wait";
  const synthesisConcurrency =
    diagnosticsSource === "repeat" ? 1 : TTS_PREFETCH_CONCURRENCY;
  const synthesisSlots = Array.from(
    { length: synthesisConcurrency },
    () => Promise.resolve(),
  );
  const queuedTasks: Promise<void>[] = [];
  const bufferedResults: {
    text: string;
    result: TtsSynthesisResult;
  }[] = [];

  let paragraphBuffer = "";
  let paragraphCount = 0;
  let outputChain = Promise.resolve();
  let nextSynthesisSlot = 0;
  let previousProviderText = "";
  let fatalTtsError = false;
  let fatalTtsSequence: number | null = null;
  let fatalTtsErrorNotified = false;
  let nextSynthesisSequence = 0;

  const {
    diagnosticsForRoute,
    routeOrder,
    synthesizeOnSelectedRoute,
  } = createTtsRouteSelector({
    config,
    diagnosticsSource,
    fallbackRoutes,
    requestId,
    shouldCancel: () => fatalTtsError,
  });

  const scheduleSynthesis = (
    text: string,
    context?: TtsChunkContext,
  ) => {
    const sequence = nextSynthesisSequence;
    nextSynthesisSequence += 1;
    const speechLanguage = resolveTtsListenLanguage({
      text,
      preferredLanguages: ttsListenLanguages,
      appLanguage: language,
    });
    const slotIndex = nextSynthesisSlot;
    nextSynthesisSlot = (nextSynthesisSlot + 1) % synthesisSlots.length;
    const task = synthesisSlots[slotIndex].then(async () => {
      if (abortSignal?.aborted || fatalTtsError) {
        return null;
      }

      try {
        return await synthesizeOnSelectedRoute(
          text,
          speechLanguage,
          context,
        );
      } catch (error) {
        fatalTtsError = true;
        fatalTtsSequence =
          fatalTtsSequence === null
            ? sequence
            : Math.min(fatalTtsSequence, sequence);
        throw error;
      }
    });

    synthesisSlots[slotIndex] = task.then(
      () => undefined,
      () => undefined,
    );
    return { sequence, task };
  };

  const emitParagraphPause = async (result: TtsSynthesisResult) => {
    if (result.kind === "native") {
      callbacks.onSpeechPauseReady?.(INTER_PARAGRAPH_PAUSE_MS);
      return;
    }

    callbacks.onAudioPauseReady?.(await getInterParagraphPauseAudioUri());
  };

  const emitResult = (text: string, result: TtsSynthesisResult) => {
    if (result.kind === "native") {
      callbacks.onSpeechTextReady(text, result.voice, result.diagnostics);
      return;
    }

    callbacks.onAudioReady(result.audio, result.diagnostics);
  };

  const enqueueTtsChunk = (
    text: string,
    context?: TtsChunkContext,
    startsParagraph = false,
  ) => {
    // Formatting whitespace helps the transcript remain readable but should
    // not turn into an engine-specific spoken pause. Paragraph cadence is
    // controlled explicitly below.
    const trimmed = text.replace(/\s+/g, " ").trim();

    if (!trimmed) {
      return;
    }

    if (ttsMode === "native") {
      const speechLanguage = resolveTtsListenLanguage({
        text: trimmed,
        preferredLanguages: ttsListenLanguages,
        appLanguage: language,
      });
      if (startsParagraph) {
        callbacks.onSpeechPauseReady?.(INTER_PARAGRAPH_PAUSE_MS);
      }
      emitResult(trimmed, {
        kind: "native",
        route: "native",
        diagnostics: diagnosticsForRoute("native", trimmed, speechLanguage),
      });
      return;
    }

    const synthesis = scheduleSynthesis(trimmed, context);
    const task = outputChain.then(async () => {
      if (abortSignal?.aborted || !spokenRepliesEnabled) {
        return;
      }

      const result = await synthesis.task;

      if (
        !result ||
        abortSignal?.aborted ||
        (fatalTtsSequence !== null && synthesis.sequence > fatalTtsSequence)
      ) {
        return;
      }

      if (bufferUntilComplete) {
        bufferedResults.push({ text: trimmed, result });
        return;
      }

      if (startsParagraph) {
        await emitParagraphPause(result);
      }
      emitResult(trimmed, result);
    });

    outputChain = task.catch(async (error) => {
      fatalTtsError = true;

      if (fatalTtsErrorNotified) {
        return;
      }

      fatalTtsErrorNotified = true;
      await callbacks.onError(
        error instanceof Error ? error : new Error(String(error)),
      );
    });
    queuedTasks.push(task.catch(() => undefined));
  };

  const enqueueTts = (text: string, startsParagraph = false) => {
    if (!spokenRepliesEnabled) {
      return;
    }

    if (ttsMode === "native") {
      enqueueTtsChunk(text, undefined, startsParagraph);
      return;
    }

    const segments = splitTextForTts(
      text,
      getTtsChunkTargetChars(routeOrder, ttsProvider),
    );

    segments.forEach((segment, index) => {
      const previousText = previousProviderText || undefined;
      const nextText = segments[index + 1];
      previousProviderText = segment;
      enqueueTtsChunk(
        segment,
        { previousText, nextText },
        startsParagraph && index === 0,
      );
    });
  };

  const enqueueParagraph = (text: string) => {
    const startsParagraph = paragraphCount > 0;
    paragraphCount += 1;
    enqueueTts(text, startsParagraph);
  };

  const handleStreamChunk = (text: string) => {
    callbacks.onChunk(text);

    if (replyPlayback !== "stream") {
      return;
    }

    paragraphBuffer += text;
    const { completeParagraphs, remainder } =
      extractCompleteParagraphs(paragraphBuffer);

    completeParagraphs.forEach(enqueueParagraph);
    paragraphBuffer = remainder;
  };

  const handleResponseDone = async (fullText: string) => {
    if (replyPlayback === "stream") {
      if (paragraphBuffer.trim()) {
        enqueueParagraph(paragraphBuffer);
      }
    } else if (diagnosticsSource === "repeat") {
      const { completeParagraphs, remainder } = extractCompleteParagraphs(
        `${fullText.trim()}\n\n`,
      );
      completeParagraphs.forEach(enqueueParagraph);
      if (remainder.trim()) {
        enqueueParagraph(remainder);
      }
    } else {
      enqueueTts(fullText);
    }

    await Promise.all(queuedTasks);
    await Promise.all(synthesisSlots);

    if (!bufferUntilComplete || fatalTtsError || abortSignal?.aborted) {
      return;
    }

    bufferedResults.forEach(({ text, result }) => {
      emitResult(text, result);
    });
  };

  return {
    handleResponseDone,
    handleStreamChunk,
  };
}
