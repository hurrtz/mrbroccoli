import {
  DEFAULT_KOKORO_VOICES,
  KOKORO_TTS_TARGET_CHUNK_CHARS,
  getKokoroVoiceConfig,
  getTtsListenLanguageForKokoro,
  resolveKokoroLanguage,
} from "../../constants/kokoro";
import type {
  TtsBackendMode,
  TtsFallbackRoute,
} from "../../types";
import {
  createSpeechRequestId,
  recordSpeechDiagnostic,
} from "../speech/diagnostics";
import type {
  SpeechDiagnosticSource,
  SpeechDiagnosticsContext,
} from "../speech/diagnostics";
import { getInterParagraphPauseAudioUri } from "../playbackCues";
import {
  getProviderTtsTargetChunkChars,
  PROVIDER_TTS_MAX_INPUT_CHARS,
  splitTextForTts,
  synthesizeSpeech,
} from "../tts";
import { extractCompleteParagraphs } from "./streaming";
import type { RunVoicePipelineParams } from "./types";

interface CreateVoicePipelineTtsQueueParams {
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
  };
  const bufferUntilComplete =
    ttsMode !== "native" && replyPlayback === "wait";
  const synthesisSlots = Array.from(
    { length: TTS_PREFETCH_CONCURRENCY },
    () => Promise.resolve(),
  );
  const queuedTasks: Promise<void>[] = [];
  const bufferedAudio: Array<
    Extract<TtsSynthesisResult, { kind: "audio" }>
  > = [];
  const bufferedNativeTexts: Array<{
    text: string;
    result: Extract<TtsSynthesisResult, { kind: "native" }>;
  }> = [];

  let paragraphBuffer = "";
  let paragraphCount = 0;
  let outputChain = Promise.resolve();
  let nextSynthesisSlot = 0;
  let previousProviderText = "";
  let fallbackNotified = false;
  let fatalTtsError = false;
  let fatalTtsErrorNotified = false;
  let selectedRoute: TtsBackendMode | null =
    ttsMode === "native" ? "native" : null;
  let routeSelectionPromise: Promise<TtsSynthesisResult> | null = null;

  const diagnosticsForRoute = (
    route: TtsBackendMode,
    text: string,
  ): SpeechDiagnosticsContext => {
    const kokoroLanguage =
      route === "kokoro"
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

    return {
      ...baseDiagnostics,
      mode: route,
      provider: route === "provider" ? (ttsProvider ?? null) : null,
      providerModel: route === "provider" ? (ttsModel || null) : null,
      language:
        (kokoroLanguage
          ? getTtsListenLanguageForKokoro(kokoroLanguage)
          : ttsListenLanguages?.[0]) ?? "app",
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
    context?: { previousText?: string; nextText?: string },
  ): Promise<RouteAttemptResult> => {
    const diagnostics = diagnosticsForRoute(route, text);

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
      language: ttsListenLanguages?.[0] ?? "app",
      voice: route === "provider" ? ttsVoice || null : null,
      fallbackReason: error.message,
      textLength: text.trim().length,
    });
    callbacks.onTtsFallback?.(error, route);
  };

  const selectRoute = async (
    text: string,
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

      const attempt = await attemptRoute(route, text, context);

      if (attempt.kind === "success") {
        selectedRoute = route;

        if (route !== ttsMode && firstError) {
          notifyFallback(firstError, route as TtsFallbackRoute, text);
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
    context?: { previousText?: string; nextText?: string },
  ) => {
    if (abortSignal?.aborted || fatalTtsError) {
      return null;
    }

    if (selectedRoute === "native") {
      return {
        kind: "native",
        route: "native",
        diagnostics: diagnosticsForRoute("native", text),
      } satisfies TtsSynthesisResult;
    }

    if (fallbackRoutes.length === 0) {
      selectedRoute = ttsMode;
      const attempt = await attemptRoute(ttsMode, text, context);

      if (attempt.kind === "error") {
        throw attempt.error;
      }

      return attempt.result;
    }

    if (!routeSelectionPromise) {
      routeSelectionPromise = selectRoute(text, context);
      return routeSelectionPromise;
    }

    const routeSelection = await routeSelectionPromise;

    if (routeSelection.route === "native") {
      return {
        kind: "native",
        route: "native",
        diagnostics: diagnosticsForRoute("native", text),
      } satisfies TtsSynthesisResult;
    }

    const attempt = await attemptRoute(routeSelection.route, text, context);

    if (attempt.kind === "error") {
      throw attempt.error;
    }

    return attempt.result;
  };

  const scheduleSynthesis = (
    text: string,
    context?: { previousText?: string; nextText?: string },
  ) => {
    const slotIndex = nextSynthesisSlot;
    nextSynthesisSlot =
      (nextSynthesisSlot + 1) % TTS_PREFETCH_CONCURRENCY;
    const task = synthesisSlots[slotIndex].then(() =>
      synthesizeOnSelectedRoute(text, context),
    );

    synthesisSlots[slotIndex] = task.then(
      () => undefined,
      () => undefined,
    );
    return task;
  };

  const emitParagraphPause = async (result: TtsSynthesisResult) => {
    if (result.kind === "native") {
      callbacks.onSpeechPauseReady?.(1_000);
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
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    if (ttsMode === "native") {
      if (startsParagraph) {
        callbacks.onSpeechPauseReady?.(1_000);
      }
      emitResult(trimmed, {
        kind: "native",
        route: "native",
        diagnostics: diagnosticsForRoute("native", trimmed),
      });
      return;
    }

    const synthesis = scheduleSynthesis(trimmed, context);
    const task = outputChain.then(async () => {
      if (
        abortSignal?.aborted ||
        fatalTtsError ||
        !spokenRepliesEnabled
      ) {
        return;
      }

      const result = await synthesis;

      if (!result || abortSignal?.aborted) {
        return;
      }

      if (bufferUntilComplete) {
        if (result.kind === "audio") {
          bufferedAudio.push(result);
        } else {
          bufferedNativeTexts.push({ text: trimmed, result });
        }
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

    if (selectedRoute === "native") {
      bufferedNativeTexts.forEach(({ text, result }) => {
        emitResult(text, result);
      });
      return;
    }

    bufferedAudio.forEach((result) => {
      emitResult("", result);
    });
  };

  return {
    handleResponseDone,
    handleStreamChunk,
  };
}
