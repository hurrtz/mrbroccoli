import { useCallback, useEffect, useState } from "react";

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

  useEffect(() => {
    if (!visible) {
      setActivePreview(null);
    }
  }, [visible]);

  const handleExactPreview = useCallback(
    async (
      previewId: string,
      request: Parameters<SettingsModalProps["onPreviewVoice"]>[0],
    ) => {
      const trimmed = request.text.trim();

      if (!trimmed) {
        return;
      }

      if (activePreview?.id === previewId) {
        setActivePreview(null);
        await onStopPreviewVoice();
        return;
      }

      if (activePreview) {
        return;
      }

      setActivePreview({ id: previewId, phase: "generating" });
      try {
        await onPreviewVoice(
          {
            ...request,
            text: trimmed,
          },
          {
            onPlaybackStarted: () => {
              setActivePreview((current) =>
                current?.id === previewId
                  ? { id: previewId, phase: "playing" }
                  : current,
              );
            },
          },
        );
      } finally {
        setActivePreview((current) =>
          current?.id === previewId ? null : current,
        );
      }
    },
    [activePreview, onPreviewVoice, onStopPreviewVoice],
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
    });
  }, [handleExactPreview, nativePreviewText, selectedNativeVoice]);

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
  };
}
