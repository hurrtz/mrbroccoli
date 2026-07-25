import type { WebSearchProvider } from "../../constants/webSearch";
import {
  PROVIDER_DEFAULT_TTS_VOICES,
  providerRequiresTtsVoice,
} from "../../constants/models";
import type { Provider, Settings } from "../../types";
import { isKokoroLanguage } from "../../constants/kokoro";
import { getTtsFallbackRoutes } from "../../constants/ttsFallback";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";

export type SettingsReadinessState = "ready" | "attention" | "broken" | "off";

export interface SettingsReadinessStatus {
  state: SettingsReadinessState;
  summaryKey:
    | "settingsReadinessReady"
    | "settingsReadinessNeedsAttention"
    | "settingsReadinessBroken"
    | "settingsReadinessOff";
}

export interface SettingsReadiness {
  think: SettingsReadinessStatus;
  listen: SettingsReadinessStatus;
  speak: SettingsReadinessStatus;
  search: SettingsReadinessStatus;
}

export interface SettingsReadinessContext {
  llmProviders: Provider[];
  sttProviders: Provider[];
  ttsProviders: Provider[];
  searchProviders: WebSearchProvider[];
  kokoroInstalled?: boolean;
}

function status(state: SettingsReadinessState): SettingsReadinessStatus {
  switch (state) {
    case "ready":
      return { state, summaryKey: "settingsReadinessReady" };
    case "attention":
      return { state, summaryKey: "settingsReadinessNeedsAttention" };
    case "broken":
      return { state, summaryKey: "settingsReadinessBroken" };
    case "off":
      return { state, summaryKey: "settingsReadinessOff" };
  }
}

function hasConfiguredKey(
  settings: Settings,
  provider: Provider | null | undefined,
) {
  return !!provider && !!settings.apiKeys[provider]?.trim();
}

function getThinkReadiness(
  settings: Settings,
  context: SettingsReadinessContext,
) {
  const runnableModes = settings.responseModes.filter((mode) => {
    const provider = mode.route.provider;
    return (
      context.llmProviders.includes(provider) &&
      hasConfiguredKey(settings, provider)
    );
  });

  if (runnableModes.length === 0) {
    return status("broken");
  }

  return runnableModes.length === settings.responseModes.length
    ? status("ready")
    : status("attention");
}

function getListenReadiness(
  settings: Settings,
  context: SettingsReadinessContext,
) {
  if (settings.sttMode === "native") {
    return status("ready");
  }

  const provider = settings.sttProvider;
  if (
    !provider ||
    !context.sttProviders.includes(provider) ||
    !hasConfiguredKey(settings, provider)
  ) {
    return status("broken");
  }

  return status("ready");
}

function getSpeakReadiness(
  settings: Settings,
  context: SettingsReadinessContext,
) {
  if (!settings.spokenRepliesEnabled) {
    return status("off");
  }

  if (settings.ttsMode === "native") {
    return status("ready");
  }

  const provider = settings.ttsProvider;
  const providerReady =
    !!provider &&
    context.ttsProviders.includes(provider) &&
    hasConfiguredKey(settings, provider) &&
    (!providerRequiresTtsVoice(provider) ||
      !!(
        settings.providerTtsVoices[provider]?.trim() ||
        PROVIDER_DEFAULT_TTS_VOICES[provider]?.trim()
      ));
  const fallbackRoutes = getTtsFallbackRoutes(
    settings.ttsFallbackPolicy,
    settings.ttsMode,
  );
  const hasUnavailableFallback = fallbackRoutes.some((route) => {
    if (route === "provider") {
      return !providerReady;
    }

    if (route === "kokoro") {
      return !context.kokoroInstalled;
    }

    return false;
  });

  if (settings.ttsMode === "kokoro") {
    if (!context.kokoroInstalled) {
      return status("broken");
    }

    return settings.ttsListenLanguages.every(isKokoroLanguage) &&
      !hasUnavailableFallback
      ? status("ready")
      : status("attention");
  }

  if (!providerReady) {
    return status("broken");
  }

  return hasUnavailableFallback ? status("attention") : status("ready");
}

function getSearchReadiness(
  settings: Settings,
  context: SettingsReadinessContext,
) {
  const provider = settings.webSearchProvider;
  if (!provider) {
    return settings.webSearchMode === "off" ? status("off") : status("broken");
  }

  if (
    !context.searchProviders.includes(provider) ||
    !hasProviderCredentialForCapability(
      provider,
      settings.apiKeys[provider],
      "search",
    )
  ) {
    return status("broken");
  }

  return status("ready");
}

export function getSettingsReadiness(
  settings: Settings,
  context: SettingsReadinessContext,
): SettingsReadiness {
  return {
    think: getThinkReadiness(settings, context),
    listen: getListenReadiness(settings, context),
    speak: getSpeakReadiness(settings, context),
    search: getSearchReadiness(settings, context),
  };
}
