import { useCallback, useRef } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import type { SpeechDiagnosticsContext } from "../../services/speech/diagnostics";
import { createSpeechRequestId } from "../../services/speech/diagnostics";
import { synthesizeSpeech } from "../../services/tts";
import {
  AppLanguage,
  Settings,
  VoicePreviewRequest,
} from "../../types";
import { PROVIDER_DEFAULT_TTS_MODELS } from "../../constants/models";

import { ShowToastFn, TranslateFn } from "./shared";

interface PreviewPlayer {
  enqueueAudio: (uri: string, diagnostics?: SpeechDiagnosticsContext) => void;
  isPlaying: boolean;
  resetCancellation: () => void;
  speakText: (
    text: string,
    options?: { diagnostics?: SpeechDiagnosticsContext; voice?: string },
  ) => void;
  stopPlayback: () => Promise<void>;
  waitForDrain: () => Promise<void>;
}

interface UsePreviewVoiceControllerParams {
  isBusy: boolean;
  isRecording: boolean;
  language: AppLanguage;
  player: PreviewPlayer;
  settings: Pick<Settings, "apiKeys" | "providerTtsModels">;
  showToast: ShowToastFn;
  t: TranslateFn;
}

export function usePreviewVoiceController({
  isBusy,
  isRecording,
  language,
  player,
  settings,
  showToast,
  t,
}: UsePreviewVoiceControllerParams) {
  const previewSessionRef = useRef(0);
  const previewAbortRef = useRef<AbortController | null>(null);

  const handlePreviewVoice = useCallback(
    async (
      request: VoicePreviewRequest,
      callbacks?: {
        onPlaybackStarted?: () => void;
      },
    ) => {
      if (isRecording || isBusy) {
        showToast(t("stopSessionBeforePreview"));
        return;
      }

      const trimmed = request.text.trim();

      if (!trimmed) {
        return;
      }

      const previewLanguage =
        request.mode === "provider" ? request.previewLanguage : null;

      recordDebugLogEvent({
        event: "voice-preview-requested",
        payload: {
          mode: request.mode,
          previewLanguage,
          textLength: trimmed.length,
        },
      });

      const previewSessionId = previewSessionRef.current + 1;
      previewSessionRef.current = previewSessionId;
      previewAbortRef.current?.abort();
      const previewAbortController = new AbortController();
      previewAbortRef.current = previewAbortController;
      const ensurePreviewActive = () => {
        if (
          previewAbortController.signal.aborted ||
          previewSessionRef.current !== previewSessionId
        ) {
          const abortError = new Error("Voice preview cancelled.");
          abortError.name = "AbortError";
          throw abortError;
        }
      };

      try {
        if (player.isPlaying) {
          await player.stopPlayback();
        }

        ensurePreviewActive();
        player.resetCancellation();
        const speechDiagnostics = {
          requestId: createSpeechRequestId("preview"),
          source: "preview" as const,
        };

        if (request.mode === "native") {
          ensurePreviewActive();
          player.speakText(trimmed, {
            voice: request.nativeVoice,
            diagnostics: speechDiagnostics,
          });
          callbacks?.onPlaybackStarted?.();
          await player.waitForDrain();
          recordDebugLogEvent({
            event: "voice-preview-finished",
            payload: {
              mode: request.mode,
            },
          });
          return;
        }

        if (request.mode === "provider") {
          const providerApiKey =
            settings.apiKeys[request.provider]?.trim() ?? "";
          const providerModel =
            settings.providerTtsModels[request.provider] ||
            PROVIDER_DEFAULT_TTS_MODELS[request.provider] ||
            "";
          const providerSpeechDiagnostics = {
            ...speechDiagnostics,
            provider: request.provider,
            providerModel: providerModel || null,
          };

          if (!providerApiKey) {
            showToast(t("chooseTtsToPreviewVoices"));
            return;
          }

          const audioUri = await synthesizeSpeech({
            text: trimmed,
            voice: request.voice,
            mode: "provider",
            provider: request.provider,
            providerModel,
            apiKey: providerApiKey,
            instructions: request.instructions,
            language,
            listenLanguages: [request.previewLanguage],
            diagnostics: providerSpeechDiagnostics,
            abortSignal: previewAbortController.signal,
          });

          ensurePreviewActive();
          player.enqueueAudio(audioUri, providerSpeechDiagnostics);
          callbacks?.onPlaybackStarted?.();
          await player.waitForDrain();
          recordDebugLogEvent({
            event: "voice-preview-finished",
            payload: {
              mode: request.mode,
              route: "provider-audio",
            },
          });
          return;
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        const message =
          error instanceof Error ? error.message : t("couldntPreviewVoice");
        recordDebugLogEvent({
          event: "voice-preview-failed",
          level: "error",
          payload: {
            message,
            mode: request.mode,
          },
        });
        showToast(message, undefined, "danger");
      } finally {
        if (previewAbortRef.current === previewAbortController) {
          previewAbortRef.current = null;
        }
      }
    },
    [
      isBusy,
      isRecording,
      language,
      player,
      settings.apiKeys,
      settings.providerTtsModels,
      showToast,
      t,
    ],
  );

  const stopPreviewVoice = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-preview-stop-requested",
    });
    previewSessionRef.current += 1;
    previewAbortRef.current?.abort();
    previewAbortRef.current = null;
    await player.stopPlayback();
  }, [player]);

  return {
    handlePreviewVoice,
    stopPreviewVoice,
  };
}
