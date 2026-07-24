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
  updateProviderTtsVoice: (provider: Provider, voice: string) => void;
}

export function useMainScreenVoiceDirectories({
  loaded,
  settings,
  updateProviderTtsVoice,
}: UseMainScreenVoiceDirectoriesParams): ProviderVoiceDirectories {
  const xai = useProviderVoiceDirectory({
    provider: "xai",
    apiKey: settings.apiKeys.xai,
    enabled: loaded && Boolean(settings.apiKeys.xai.trim()),
  });
  const mistral = useProviderVoiceDirectory({
    provider: "mistral",
    apiKey: settings.apiKeys.mistral,
    enabled: loaded && Boolean(settings.apiKeys.mistral.trim()),
  });
  const elevenlabs = useProviderVoiceDirectory({
    provider: "elevenlabs",
    apiKey: settings.apiKeys.elevenlabs,
    enabled: loaded && Boolean(settings.apiKeys.elevenlabs.trim()),
  });
  const directories = useMemo(
    () => ({ elevenlabs, mistral, xai }),
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

  useEffect(() => {
    if (!loaded) {
      return;
    }

    for (const provider of PROVIDER_VOICE_DIRECTORY_PROVIDERS) {
      const firstVoice = directories[provider]?.voices[0]?.value;

      if (firstVoice && !settings.providerTtsVoices[provider]?.trim()) {
        updateProviderTtsVoice(provider, firstVoice);
      }
    }
  }, [
    directories,
    loaded,
    settings.providerTtsVoices.elevenlabs,
    settings.providerTtsVoices.mistral,
    settings.providerTtsVoices.xai,
    updateProviderTtsVoice,
  ]);

  return directories;
}
