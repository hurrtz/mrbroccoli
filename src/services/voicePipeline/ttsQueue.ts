import {
  DEFAULT_KOKORO_VOICES,
  KOKORO_TTS_TARGET_CHUNK_CHARS,
  getKokoroLanguage,
  getKokoroVoiceConfig,
} from "../../constants/kokoro";
import type {
  SpeechLanguage,
  TtsBackendMode,
  TtsFallbackRoute,
} from "../../types";
import { providerSupportsTtsLanguage } from "../../constants/providerSpeechLanguages";
import { PROVIDER_LABELS } from "../../constants/models";
import { getTtsListenLanguageLabel } from "../../constants/localTts";
import { translate } from "../../i18n";
import { resolveTtsListenLanguage } from "../../utils/ttsRouting";
import {
  createSpeechRequestId,
  recordSpeechDiagnostic,
} from "../speech/diagnostics";
import type {
  SpeechDiagnosticSource,
  SpeechDiagnosticsContext,
} from "../speech/diagnostics";
import {
  getInterParagraphPauseAudioUri,
  INTER_PARAGRAPH_PAUSE_MS,
} from "../playbackCues";
import {
  getProviderTtsTargetChunkChars,
  PROVIDER_TTS_MAX_INPUT_CHARS,
  splitTextForTts,
  synthesizeSpeech,
} from "../tts";
import { extractCompleteParagraphs } from "./streaming";
import type { RunVoicePipelineParams } from "./types";

interface CreateVoicePipelineTtsQueueParams {
  turnId?: string;
  abortSignal?: AbortSignal;
  callbacks: RunVoicePipelineParams["callbacks"];
  diagnosticsSource?: SpeechDiagnosticSource;
  language: RunVoicePipelineParams["language"];
  replyPlayback: RunVoicePipelineParams["replyPlayback"];
  spokenRepliesEnabled?: RunVoicePipelineParams["spokenRepliesEnabled"];
  ttsApiKey?: string;
  kokoroVoices?: RunVoicePipelineParams["kokoroVoices"];
  ttsFallbackRoutes?: RunVoicePipelineParams["ttsFallbackRoutes"];
  ttsListenLanguages?: RunVoicePipelineParams["ttsListenLanguages"];
  ttsMode: RunVoicePipelineParams["ttsMode"];
  ttsModel?: string;
  ttsProvider?: RunVoicePipelineParams["ttsProvider"];
  ttsVoice: string;
  ttsInstructions?: string;
}

const TTS_PREFETCH_CONCURRENCY = 2;

type AudioDiagnostics = NonNullable<
  Parameters<RunVoicePipelineParams["callbacks"]["onAudioReady"]>[1]
>;

type TtsSynthesisResult =
  | {
      kind: "audio";
      route: "kokoro" | "provider";
      audio: string;
      diagnostics: AudioDiagnostics;
    }
  | {
      kind: "native";
      route: "native";
      diagnostics: SpeechDiagnosticsContext;
      voice?: string;
    };

type RouteAttemptResult =
  | { kind: "success"; result: TtsSynthesisResult }
  | { kind: "error"; error: Error };

function normalizeFallbackRoutes(
  primaryMode: TtsBackendMode,
  fallbackRoutes?: TtsFallbackRoute[],
) {
  if (primaryMode === "native") {
    return [];
  }

  const allowedRoutes =
    primaryMode === "provider"
      ? new Set<TtsBackendMode>(["kokoro", "native"])
      : new Set<TtsBackendMode>(["provider", "native"]);
  const normalized: TtsBackendMode[] = [];

  for (const route of fallbackRoutes ?? []) {
    if (allowedRoutes.has(route) && !normalized.includes(route)) {
      normalized.push(route);
    }
  }

  return normalized;
}

function getTtsChunkTargetChars(
  routes: TtsBackendMode[],
  provider: RunVoicePipelineParams["ttsProvider"],
) {
  const targetSizes = routes.flatMap((route) => {
    if (route === "kokoro") {
      return [KOKORO_TTS_TARGET_CHUNK_CHARS];
    }

    if (route === "provider") {
      return [
        Math.min(
          PROVIDER_TTS_MAX_INPUT_CHARS,
          getProviderTtsTargetChunkChars(provider),
        ),
      ];
    }

    return [];
  });

  return targetSizes.length > 0
    ? Math.min(...targetSizes)
    : PROVIDER_TTS_MAX_INPUT_CHARS;
}

export function createVoicePipelineTtsQueue({
  turnId,
  abortSignal,
  callbacks,
  diagnosticsSource = "conversation",
  language,
  replyPlayback,
  spokenRepliesEnabled = true,
  ttsApiKey,
  kokoroVoices,
  ttsFallbackRoutes,
  ttsListenLanguages,
  ttsMode,
  ttsModel,
  ttsProvider,
  ttsVoice,
  ttsInstructions,
}: CreateVoicePipelineTtsQueueParams) {
  const fallbackRoutes = normalizeFallbackRoutes(
    ttsMode,
    ttsFallbackRoutes,
  );
  const routeOrder: TtsBackendMode[] = [ttsMode, ...fallbackRoutes];
  const requestId = createSpeechRequestId(diagnosticsSource);
  const baseDiagnostics: SpeechDiagnosticsContext = {
    requestId,
    source: diagnosticsSource,
    mode: ttsMode,
    provider: ttsProvider ?? null,
    providerModel: ttsModel || null,
    turnId,
  };
  const bufferUntilComplete =
    ttsMode !== "native" && replyPlayback === "wait";
  const synthesisConcurrency =
    diagnosticsSource === "repeat" ? 1 : TTS_PREFETCH_CONCURRENCY;
  const synthesisSlots = Array.from(
    { length: synthesisConcurrency },
    () => Promise.resolve(),
  );
  const queuedTasks: Promise<void>[] = [];
  const bufferedResults: Array<{
    text: string;
    result: TtsSynthesisResult;
  }> = [];

  let paragraphBuffer = "";
  let paragraphCount = 0;
  let outputChain = Promise.resolve();
  let nextSynthesisSlot = 0;
  let previousProviderText = "";
  let fallbackNotified = false;
  let fatalTtsError = false;
  let fatalTtsSequence: number | null = null;
  let fatalTtsErrorNotified = false;
  let nextSynthesisSequence = 0;
  const selectedRoutes = new Map<SpeechLanguage, TtsBackendMode>();
  const routeSelectionPromises = new Map<
    SpeechLanguage,
    Promise<TtsSynthesisResult>
  >();

  const diagnosticsForRoute = (
    route: TtsBackendMode,
    text: string,
    speechLanguage: SpeechLanguage,
  ): SpeechDiagnosticsContext => {
    const kokoroLanguage =
      route === "kokoro"
        ? getKokoroLanguage(speechLanguage)
        : null;
    const kokoroVoice = kokoroLanguage
      ? getKokoroVoiceConfig(
          kokoroLanguage,
          kokoroVoices?.[kokoroLanguage] ??
            DEFAULT_KOKORO_VOICES[kokoroLanguage],
        ).id
      : null;

    return {
      ...baseDiagnostics,
      mode: route,
      provider: route === "provider" ? (ttsProvider ?? null) : null,
      providerModel: route === "provider" ? (ttsModel || null) : null,
      language: speechLanguage,
      voice:
        route === "provider"
          ? ttsVoice || null
          : route === "kokoro"
            ? kokoroVoice
            : null,
    };
  };

  const attemptRoute = async (
    route: TtsBackendMode,
    text: string,
    speechLanguage: SpeechLanguage,
    context?: { previousText?: string; nextText?: string },
  ): Promise<RouteAttemptResult> => {
    const diagnostics = diagnosticsForRoute(route, text, speechLanguage);

    if (route === "native") {
      return {
        kind: "success",
        result: {
          kind: "native",
          route,
          diagnostics,
        },
      };
    }

    if (
      route === "kokoro" &&
      getKokoroLanguage(speechLanguage) === null
    ) {
      return {
        kind: "error",
        error: new Error(
          translate(language, "speechLanguageUnsupportedByProvider", {
            provider: "Kokoro",
            language: getTtsListenLanguageLabel(
              speechLanguage,
              language,
            ),
          }),
        ),
      };
    }

    if (
      route === "provider" &&
      (!ttsProvider ||
        !providerSupportsTtsLanguage(ttsProvider, speechLanguage))
    ) {
      return {
        kind: "error",
        error: new Error(
          ttsProvider
            ? translate(language, "speechLanguageUnsupportedByProvider", {
                provider: PROVIDER_LABELS[ttsProvider],
                language: getTtsListenLanguageLabel(
                  speechLanguage,
                  language,
                ),
              })
            : translate(language, "chooseTextToSpeechProviderInSettings"),
        ),
      };
    }

    try {
      const audio = await synthesizeSpeech({
        text,
        voice:
          route === "kokoro"
            ? diagnostics.voice ?? ""
            : ttsVoice,
        mode: route,
        provider: route === "provider" ? ttsProvider : undefined,
        providerModel: route === "provider" ? ttsModel : undefined,
        apiKey: route === "provider" ? ttsApiKey : undefined,
        instructions: route === "provider" ? ttsInstructions : undefined,
        ...(route === "provider" && ttsProvider === "elevenlabs"
          ? {
              previousText: context?.previousText,
              nextText: context?.nextText,
            }
          : {}),
        language,
        listenLanguages: ttsListenLanguages,
        speechLanguage,
        kokoroVoices,
        diagnostics,
        abortSignal,
      });

      return {
        kind: "success",
        result: {
          kind: "audio",
          route,
          audio,
          diagnostics,
        },
      };
    } catch (error) {
      return {
        kind: "error",
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  };

  const notifyFallback = (
    error: Error,
    route: TtsFallbackRoute,
    text: string,
    speechLanguage: SpeechLanguage,
  ) => {
    if (fallbackNotified) {
      return;
    }

    fallbackNotified = true;
    recordSpeechDiagnostic({
      requestId,
      source: diagnosticsSource,
      stage: "tts-fallback",
      requestedRoute: ttsMode,
      actualRoute: route,
      mode: route,
      provider: route === "provider" ? (ttsProvider ?? null) : null,
      providerModel: route === "provider" ? (ttsModel || null) : null,
      language: speechLanguage,
      voice: route === "provider" ? ttsVoice || null : null,
      fallbackReason: error.message,
      textLength: text.trim().length,
    });
    callbacks.onTtsFallback?.(error, route);
  };

  const selectRoute = async (
    text: string,
    speechLanguage: SpeechLanguage,
    context?: { previousText?: string; nextText?: string },
  ) => {
    let firstError: Error | null = null;
    let latestError: Error | null = null;

    for (const route of routeOrder) {
      if (abortSignal?.aborted) {
        const abortError = new Error("Speech generation was cancelled.");
        abortError.name = "AbortError";
        throw abortError;
      }

      const attempt = await attemptRoute(
        route,
        text,
        speechLanguage,
        context,
      );

      if (attempt.kind === "success") {
        selectedRoutes.set(speechLanguage, route);

        if (route !== ttsMode && firstError) {
          notifyFallback(
            firstError,
            route as TtsFallbackRoute,
            text,
            speechLanguage,
          );
        }

        return attempt.result;
      }

      firstError ??= attempt.error;
      latestError = attempt.error;
    }

    throw latestError ?? new Error("No text-to-speech route is available.");
  };

  const synthesizeOnSelectedRoute = async (
    text: string,
    speechLanguage: SpeechLanguage,
    context?: { previousText?: string; nextText?: string },
  ) => {
    if (abortSignal?.aborted || fatalTtsError) {
      return null;
    }

    const selectedRoute = selectedRoutes.get(speechLanguage);

    if (selectedRoute === "native") {
      return {
        kind: "native",
        route: "native",
        diagnostics: diagnosticsForRoute(
          "native",
          text,
          speechLanguage,
        ),
      } satisfies TtsSynthesisResult;
    }

    if (fallbackRoutes.length === 0) {
      const attempt = await attemptRoute(
        ttsMode,
        text,
        speechLanguage,
        context,
      );

      if (attempt.kind === "error") {
        throw attempt.error;
      }

      selectedRoutes.set(speechLanguage, ttsMode);
      return attempt.result;
    }

    let routeSelectionPromise = routeSelectionPromises.get(speechLanguage);
    if (!routeSelectionPromise) {
      routeSelectionPromise = selectRoute(
        text,
        speechLanguage,
        context,
      );
      routeSelectionPromises.set(speechLanguage, routeSelectionPromise);
      return routeSelectionPromise;
    }

    const routeSelection = await routeSelectionPromise;

    if (routeSelection.route === "native") {
      return {
        kind: "native",
        route: "native",
        diagnostics: diagnosticsForRoute(
          "native",
          text,
          speechLanguage,
        ),
      } satisfies TtsSynthesisResult;
    }

    const attempt = await attemptRoute(
      routeSelection.route,
      text,
      speechLanguage,
      context,
    );

    if (attempt.kind === "error") {
      throw attempt.error;
    }

    return attempt.result;
  };

  const scheduleSynthesis = (
    text: string,
    context?: { previousText?: string; nextText?: string },
  ) => {
    const sequence = nextSynthesisSequence;
    nextSynthesisSequence += 1;
    const speechLanguage = resolveTtsListenLanguage({
      text,
      preferredLanguages: ttsListenLanguages,
      appLanguage: language,
    });
    const slotIndex = nextSynthesisSlot;
    nextSynthesisSlot =
      (nextSynthesisSlot + 1) % synthesisSlots.length;
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

    callbacks.onAudioPauseReady?.(
      await getInterParagraphPauseAudioUri(),
    );
  };

  const emitResult = (text: string, result: TtsSynthesisResult) => {
    if (result.kind === "native") {
      callbacks.onSpeechTextReady(
        text,
        result.voice,
        result.diagnostics,
      );
      return;
    }

    callbacks.onAudioReady(result.audio, result.diagnostics);
  };

  const enqueueTtsChunk = (
    text: string,
    context?: { previousText?: string; nextText?: string },
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
        diagnostics: diagnosticsForRoute(
          "native",
          trimmed,
          speechLanguage,
        ),
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
        (fatalTtsSequence !== null &&
          synthesis.sequence > fatalTtsSequence)
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
      const { completeParagraphs, remainder } =
        extractCompleteParagraphs(`${fullText.trim()}\n\n`);
      completeParagraphs.forEach(enqueueParagraph);
      if (remainder.trim()) {
        enqueueParagraph(remainder);
      }
    } else {
      enqueueTts(fullText);
    }

    await Promise.all(queuedTasks);
    await Promise.all(synthesisSlots);

    if (
      !bufferUntilComplete ||
      fatalTtsError ||
      abortSignal?.aborted
    ) {
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
