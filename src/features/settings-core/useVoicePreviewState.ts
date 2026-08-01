import { useCallback, useEffect, useRef, useState } from "react";

import {
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  getProviderTtsVoiceOptions,
} from "../../constants/models";
import {
  AppLanguage,
  KokoroLanguage,
  Provider,
  Settings,
  TtsListenLanguage,
} from "../../types";

import {
  PreviewButtonPhase,
  ProviderPreviewTexts,
  SettingsModalProps,
} from "./types";

export function useVoicePreviewState(params: {
  visible: boolean;
  settings: Settings;
  language: AppLanguage;
  providerPreviewTexts: ProviderPreviewTexts;
  kokoroPreviewTexts: Record<KokoroLanguage, string>;
  nativePreviewText: string;
  selectedNativeVoice: string;
  onPreviewVoice: SettingsModalProps["onPreviewVoice"];
  onStopPreviewVoice: SettingsModalProps["onStopPreviewVoice"];
}) {
  const {
    visible,
    settings,
    language,
    providerPreviewTexts,
    kokoroPreviewTexts,
    nativePreviewText,
    selectedNativeVoice,
    onPreviewVoice,
    onStopPreviewVoice,
  } = params;
  const [activePreview, setActivePreview] = useState<{
    id: string;
    phase: PreviewButtonPhase;
  } | null>(null);
  const activePreviewRef = useRef(activePreview);
  const previewOperationRef = useRef(0);

  const updateActivePreview = useCallback(
    (next: { id: string; phase: PreviewButtonPhase } | null) => {
      activePreviewRef.current = next;
      setActivePreview(next);
    },
    [],
  );

  useEffect(() => {
    if (!visible) {
      previewOperationRef.current += 1;
      updateActivePreview(null);
    }
  }, [updateActivePreview, visible]);

  const stopActivePreview = useCallback(async () => {
    if (!activePreviewRef.current) {
      return;
    }

    previewOperationRef.current += 1;
    updateActivePreview(null);
    await onStopPreviewVoice();
  }, [onStopPreviewVoice, updateActivePreview]);

  const handleExactPreview = useCallback(
    async (
      previewId: string,
      request: Parameters<SettingsModalProps["onPreviewVoice"]>[0],
    ) => {
      const trimmed = request.text.trim();

      if (!trimmed) {
        return;
      }

      if (activePreviewRef.current?.id === previewId) {
        await stopActivePreview();
        return;
      }

      if (activePreviewRef.current) {
        return;
      }

      const previewOperation = previewOperationRef.current + 1;
      previewOperationRef.current = previewOperation;
      updateActivePreview({ id: previewId, phase: "generating" });
      try {
        await onPreviewVoice(
          {
            ...request,
            text: trimmed,
          },
          {
            onPlaybackStarted: () => {
              if (
                previewOperationRef.current === previewOperation &&
                activePreviewRef.current?.id === previewId
              ) {
                updateActivePreview({ id: previewId, phase: "playing" });
              }
            },
          },
        );
      } finally {
        if (previewOperationRef.current === previewOperation) {
          updateActivePreview(null);
        }
      }
    },
    [onPreviewVoice, stopActivePreview, updateActivePreview],
  );

  const handlePreviewProviderVoice = useCallback(
    async (provider: Provider, previewLanguage: TtsListenLanguage) => {
      const selectedVoice =
        settings.providerTtsVoices[provider] ||
        PROVIDER_DEFAULT_TTS_VOICES[provider] ||
        getProviderTtsVoiceOptions(
          provider,
          language,
          settings.providerTtsModels[provider] ||
            PROVIDER_DEFAULT_TTS_MODELS[provider],
        )[0]?.id ||
        "";

      await handleExactPreview(`provider:${provider}:${previewLanguage}`, {
        text: providerPreviewTexts[provider][previewLanguage],
        mode: "provider",
        provider,
        voice: selectedVoice,
        instructions: settings.ttsInstructions,
        previewLanguage,
      });
    },
    [
      handleExactPreview,
      language,
      providerPreviewTexts,
      settings.providerTtsVoices,
      settings.providerTtsModels,
      settings.ttsInstructions,
    ],
  );

  const handlePreviewNativeVoice = useCallback(async () => {
    await handleExactPreview("native", {
      text: nativePreviewText,
      mode: "native",
      nativeVoice: selectedNativeVoice || undefined,
      previewLanguage: settings.ttsListenLanguages[0] ?? "en",
    });
  }, [
    handleExactPreview,
    nativePreviewText,
    selectedNativeVoice,
    settings.ttsListenLanguages,
  ]);

  const handlePreviewKokoroVoice = useCallback(
    async (previewLanguage: KokoroLanguage) => {
      await handleExactPreview(`kokoro:${previewLanguage}`, {
        text: kokoroPreviewTexts[previewLanguage],
        mode: "kokoro",
        language: previewLanguage,
        voice: settings.kokoroVoices[previewLanguage],
      });
    },
    [handleExactPreview, kokoroPreviewTexts, settings.kokoroVoices],
  );

  return {
    activePreview,
    handlePreviewProviderVoice,
    handlePreviewNativeVoice,
    handlePreviewKokoroVoice,
    stopActivePreview,
  };
}
