import { isRuntimeProviderId } from "../../constants/providers/runtimeState";
import {
  isWebSearchMode,
  isWebSearchProvider,
} from "../../constants/webSearch";
import {
  type AppLanguage,
  type AssistantResponseLength,
  type AssistantResponseTone,
  type InputMode,
  type Provider,
  type ReplyPlayback,
  type Settings,
  type SttBackendMode,
  type ThemeMode,
  type TtsListenLanguage,
  DEFAULT_SETTINGS,
  getDefaultAssistantInstructions,
  getDefaultTtsListenLanguages,
  isDefaultAssistantInstructions,
} from "../../types";
import type { LegacyStoredSettings } from "./types";

function isAllowedValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
): value is T {
  return typeof value === "string" && allowedValues.includes(value as T);
}

function getAllowedValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fallback: T,
): T {
  return isAllowedValue(value, allowedValues) ? value : fallback;
}

const APP_LANGUAGES = [
  "en",
  "de",
  "uk",
  "hi",
  "es",
  "fr",
  "it",
  "pt",
  "pt-BR",
  "ru",
] as const satisfies readonly AppLanguage[];
const INPUT_MODES = [
  "push-to-talk",
  "toggle-to-talk",
  "drive-session",
] as const satisfies readonly InputMode[];
const REPLY_PLAYBACK_OPTIONS = [
  "stream",
  "wait",
] as const satisfies readonly ReplyPlayback[];
const STT_MODES = [
  "native",
  "provider",
] as const satisfies readonly SttBackendMode[];
const THEME_MODES = [
  "light",
  "dark",
  "system",
] as const satisfies readonly ThemeMode[];
const RESPONSE_LENGTHS = [
  "brief",
  "normal",
  "thorough",
] as const satisfies readonly AssistantResponseLength[];
const RESPONSE_TONES = [
  "professional",
  "casual",
  "nerdy",
  "concise",
  "socratic",
  "eli5",
] as const satisfies readonly AssistantResponseTone[];
const TTS_LISTEN_LANGUAGES = [
  "en",
  "de",
  "zh",
  "es",
  "pt",
  "hi",
  "fr",
  "it",
  "ja",
] as const satisfies readonly TtsListenLanguage[];

function getStoredBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function getStoredProvider(
  value: unknown,
  fallback: Provider | null,
): Provider | null {
  return isRuntimeProviderId(value) ? value : fallback;
}

function getStoredTtsListenLanguages(
  value: unknown,
  language: AppLanguage,
): TtsListenLanguage[] {
  if (!Array.isArray(value)) {
    return getDefaultTtsListenLanguages(language);
  }

  const languages = Array.from(
    new Set(
      value.filter((candidate): candidate is TtsListenLanguage =>
        isAllowedValue(candidate, TTS_LISTEN_LANGUAGES),
      ),
    ),
  );

  return languages.length > 0
    ? languages
    : getDefaultTtsListenLanguages(language);
}

export function normalizeStoredScalarSettings(
  storedSettings: LegacyStoredSettings | undefined,
  hasConfiguredKeys: boolean,
): Pick<
  Settings,
  | "inputMode"
  | "ttsMode"
  | "language"
  | "theme"
  | "sttMode"
  | "lastProvider"
  | "responseLength"
  | "responseTone"
  | "replyPlayback"
  | "spokenRepliesEnabled"
  | "ttsListenLanguages"
  | "setupGuideDismissed"
  | "showSetupGuideShortcut"
  | "showUsageStats"
  | "showDebugLogButton"
  | "assistantInstructions"
  | "ttsInstructions"
  | "webSearchMode"
  | "sttProvider"
  | "ttsProvider"
  | "webSearchProvider"
> {
  const language = getAllowedValue(
    storedSettings?.language,
    APP_LANGUAGES,
    DEFAULT_SETTINGS.language,
  );
  const storedAssistantInstructions = storedSettings?.assistantInstructions;
  const assistantInstructions =
    typeof storedAssistantInstructions === "string" &&
    storedAssistantInstructions.trim()
      ? isDefaultAssistantInstructions(storedAssistantInstructions)
        ? getDefaultAssistantInstructions(language)
        : storedAssistantInstructions
      : getDefaultAssistantInstructions(language);
  const rawWebSearchMode =
    storedSettings?.webSearchMode === "auto"
      ? "on"
      : storedSettings?.webSearchMode;

  return {
    inputMode: getAllowedValue(
      storedSettings?.inputMode,
      INPUT_MODES,
      DEFAULT_SETTINGS.inputMode,
    ),
    ttsMode:
      storedSettings?.ttsMode === "provider"
        ? "provider"
        : storedSettings?.ttsMode === "kokoro" ||
            storedSettings?.ttsMode === "local"
          ? "kokoro"
          : "native",
    language,
    theme: getAllowedValue(
      storedSettings?.theme,
      THEME_MODES,
      DEFAULT_SETTINGS.theme,
    ),
    sttMode: getAllowedValue(
      storedSettings?.sttMode,
      STT_MODES,
      DEFAULT_SETTINGS.sttMode,
    ),
    lastProvider: getStoredProvider(
      storedSettings?.lastProvider,
      DEFAULT_SETTINGS.lastProvider,
    ) as Provider,
    responseLength: getAllowedValue(
      storedSettings?.responseLength,
      RESPONSE_LENGTHS,
      DEFAULT_SETTINGS.responseLength,
    ),
    responseTone: getAllowedValue(
      storedSettings?.responseTone,
      RESPONSE_TONES,
      DEFAULT_SETTINGS.responseTone,
    ),
    replyPlayback: getAllowedValue(
      storedSettings?.replyPlayback ?? storedSettings?.ttsPlayback,
      REPLY_PLAYBACK_OPTIONS,
      DEFAULT_SETTINGS.replyPlayback,
    ),
    spokenRepliesEnabled: getStoredBoolean(
      storedSettings?.spokenRepliesEnabled,
      DEFAULT_SETTINGS.spokenRepliesEnabled,
    ),
    ttsListenLanguages: getStoredTtsListenLanguages(
      storedSettings?.ttsListenLanguages,
      language,
    ),
    setupGuideDismissed: getStoredBoolean(
      storedSettings?.setupGuideDismissed,
      hasConfiguredKeys,
    ),
    showSetupGuideShortcut: getStoredBoolean(
      storedSettings?.showSetupGuideShortcut,
      DEFAULT_SETTINGS.showSetupGuideShortcut,
    ),
    showUsageStats: getStoredBoolean(
      storedSettings?.showUsageStats,
      DEFAULT_SETTINGS.showUsageStats,
    ),
    showDebugLogButton: getStoredBoolean(
      storedSettings?.showDebugLogButton,
      DEFAULT_SETTINGS.showDebugLogButton,
    ),
    assistantInstructions,
    ttsInstructions:
      typeof storedSettings?.ttsInstructions === "string"
        ? storedSettings.ttsInstructions
        : DEFAULT_SETTINGS.ttsInstructions,
    webSearchMode: isWebSearchMode(rawWebSearchMode)
      ? rawWebSearchMode
      : typeof storedSettings?.webSearchEnabled === "boolean"
        ? storedSettings.webSearchEnabled
          ? "on"
          : "off"
        : DEFAULT_SETTINGS.webSearchMode,
    sttProvider: getStoredProvider(
      storedSettings?.sttProvider,
      DEFAULT_SETTINGS.sttProvider,
    ),
    ttsProvider: getStoredProvider(
      storedSettings?.ttsProvider,
      DEFAULT_SETTINGS.ttsProvider,
    ),
    webSearchProvider: isWebSearchProvider(
      storedSettings?.webSearchProvider,
    )
      ? storedSettings.webSearchProvider
      : DEFAULT_SETTINGS.webSearchProvider,
  };
}
