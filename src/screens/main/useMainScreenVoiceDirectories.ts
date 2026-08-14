import { useEffect, useMemo } from "react";

import { useProviderVoiceDirectory } from "../../hooks/useProviderVoiceDirectory";
import {
  PROVIDER_VOICE_DIRECTORY_PROVIDERS,
  type ProviderVoiceDirectories,
} from "../../services/providerVoiceDirectory";
import type { Provider, Settings } from "../../types";

interface UseMainScreenVoiceDirectoriesParams {
  loaded: boolean;
  settings: Settings;
  suspended?: boolean;
  updateProviderTtsVoice: (provider: Provider, voice: string) => void;
}

export function useMainScreenVoiceDirectories({
  loaded,
  settings,
  suspended = false,
  updateProviderTtsVoice,
}: UseMainScreenVoiceDirectoriesParams): ProviderVoiceDirectories {
  const enabled = loaded && !suspended;
  const xai = useProviderVoiceDirectory({
    provider: "xai",
    apiKey: settings.apiKeys.xai,
    enabled: enabled && Boolean(settings.apiKeys.xai.trim()),
  });
  const mistral = useProviderVoiceDirectory({
    provider: "mistral",
    apiKey: settings.apiKeys.mistral,
    enabled: enabled && Boolean(settings.apiKeys.mistral.trim()),
  });
  const elevenlabs = useProviderVoiceDirectory({
    provider: "elevenlabs",
    apiKey: settings.apiKeys.elevenlabs,
    enabled: enabled && Boolean(settings.apiKeys.elevenlabs.trim()),
  });
  const directories = useMemo(
    () => ({
      elevenlabs: {
        error: elevenlabs.error,
        refresh: elevenlabs.refresh,
        status: elevenlabs.status,
        voices: elevenlabs.voices,
      },
      mistral: {
        error: mistral.error,
        refresh: mistral.refresh,
        status: mistral.status,
        voices: mistral.voices,
      },
      xai: {
        error: xai.error,
        refresh: xai.refresh,
        status: xai.status,
        voices: xai.voices,
      },
    }),
    [
      elevenlabs.error,
      elevenlabs.refresh,
      elevenlabs.status,
      elevenlabs.voices,
      mistral.error,
      mistral.refresh,
      mistral.status,
      mistral.voices,
      xai.error,
      xai.refresh,
      xai.status,
      xai.voices,
    ],
  );
  const selectedProviderVoices = useMemo(
    () => ({
      elevenlabs: settings.providerTtsVoices.elevenlabs,
      mistral: settings.providerTtsVoices.mistral,
      xai: settings.providerTtsVoices.xai,
    }),
    [
      settings.providerTtsVoices.elevenlabs,
      settings.providerTtsVoices.mistral,
      settings.providerTtsVoices.xai,
    ],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    for (const provider of PROVIDER_VOICE_DIRECTORY_PROVIDERS) {
      const voices = directories[provider]?.voices ?? [];
      const firstVoice = voices[0]?.value;
      const selectedVoice = selectedProviderVoices[provider]?.trim();
      const selectionAvailable = voices.some(
        (voice) => voice.value === selectedVoice,
      );

      if (firstVoice && !selectionAvailable) {
        updateProviderTtsVoice(provider, firstVoice);
      }
    }
  }, [directories, enabled, selectedProviderVoices, updateProviderTtsVoice]);

  return directories;
}
