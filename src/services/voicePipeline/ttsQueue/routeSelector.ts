import {
  DEFAULT_KOKORO_VOICES,
  getKokoroLanguage,
  getKokoroVoiceConfig,
} from "../../../constants/kokoro";
import { PROVIDER_LABELS } from "../../../constants/models";
import { getTtsListenLanguageLabel } from "../../../constants/localTts";
import { providerSupportsTtsLanguage } from "../../../constants/providerSpeechLanguages";
import { translate } from "../../../i18n";
import type {
  SpeechLanguage,
  TtsBackendMode,
  TtsFallbackRoute,
} from "../../../types";
import { recordSpeechDiagnostic } from "../../speech/diagnostics";
import { synthesizeSpeech } from "../../tts";
import type {
  CreateVoicePipelineTtsQueueParams,
  DiagnosticsForRoute,
  RouteAttemptResult,
  TtsChunkContext,
  TtsSynthesisResult,
} from "./types";

interface CreateTtsRouteSelectorParams {
  config: CreateVoicePipelineTtsQueueParams;
  diagnosticsSource: NonNullable<
    CreateVoicePipelineTtsQueueParams["diagnosticsSource"]
  >;
  fallbackRoutes: TtsBackendMode[];
  requestId: string;
  shouldCancel: () => boolean;
}

export function createTtsRouteSelector({
  config,
  diagnosticsSource,
  fallbackRoutes,
  requestId,
  shouldCancel,
}: CreateTtsRouteSelectorParams) {
  const {
    abortSignal,
    callbacks,
    kokoroVoices,
    language,
    ttsApiKey,
    ttsInstructions,
    ttsListenLanguages,
    ttsMode,
    ttsModel,
    ttsProvider,
    ttsVoice,
    turnId,
  } = config;
  const routeOrder: TtsBackendMode[] = [ttsMode, ...fallbackRoutes];
  const selectedRoutes = new Map<SpeechLanguage, TtsBackendMode>();
  const routeSelectionPromises = new Map<
    SpeechLanguage,
    Promise<TtsSynthesisResult>
  >();
  let fallbackNotified = false;

  const diagnosticsForRoute: DiagnosticsForRoute = (
    route,
    _text,
    speechLanguage,
  ) => {
    const kokoroLanguage =
      route === "kokoro" ? getKokoroLanguage(speechLanguage) : null;
    const kokoroVoice = kokoroLanguage
      ? getKokoroVoiceConfig(
          kokoroLanguage,
          kokoroVoices?.[kokoroLanguage] ??
            DEFAULT_KOKORO_VOICES[kokoroLanguage],
        ).id
      : null;

    return {
      requestId,
      source: diagnosticsSource,
      mode: route,
      provider: route === "provider" ? (ttsProvider ?? null) : null,
      providerModel: route === "provider" ? (ttsModel || null) : null,
      turnId,
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
    context?: TtsChunkContext,
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

    if (route === "kokoro" && getKokoroLanguage(speechLanguage) === null) {
      return {
        kind: "error",
        error: new Error(
          translate(language, "speechLanguageUnsupportedByProvider", {
            provider: "Kokoro",
            language: getTtsListenLanguageLabel(speechLanguage, language),
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
        voice: route === "kokoro" ? diagnostics.voice ?? "" : ttsVoice,
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
    context?: TtsChunkContext,
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
    context?: TtsChunkContext,
  ) => {
    if (abortSignal?.aborted || shouldCancel()) {
      return null;
    }

    const selectedRoute = selectedRoutes.get(speechLanguage);

    if (selectedRoute === "native") {
      return {
        kind: "native",
        route: "native",
        diagnostics: diagnosticsForRoute("native", text, speechLanguage),
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
      routeSelectionPromise = selectRoute(text, speechLanguage, context);
      routeSelectionPromises.set(speechLanguage, routeSelectionPromise);
      return routeSelectionPromise;
    }

    const routeSelection = await routeSelectionPromise;

    if (routeSelection.route === "native") {
      return {
        kind: "native",
        route: "native",
        diagnostics: diagnosticsForRoute("native", text, speechLanguage),
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

  return {
    diagnosticsForRoute,
    routeOrder,
    synthesizeOnSelectedRoute,
  };
}
