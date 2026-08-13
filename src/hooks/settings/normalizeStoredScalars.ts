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
  type FreeOfflineProfileOverrides,
  type Provider,
  type ReplyPlayback,
  type Settings,
  type ThemeMode,
  type TtsListenLanguage,
  DEFAULT_SETTINGS,
  getDefaultAssistantInstructions,
  getDefaultTtsListenLanguages,
  isDefaultAssistantInstructions,
} from "../../types";
import { isAppLanguage } from "../../i18n/localeRegistry";
import {
  SPEECH_LANGUAGE_OPTIONS,
  normalizeSpeechLanguage,
  normalizeSttLanguage,
} from "../../constants/speechLanguages";
import type { LegacyStoredSettings } from "./types";
import {
  getLocalModel,
  isLocalModelId,
  type LocalSttModelId,
  type LocalLlmModelId,
  type LocalTtsCatalogModelId,
  type LocalTtsModelId,
} from "../../constants/localModels";

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

const INPUT_MODES = [
  "push-to-talk",
  "toggle-to-talk",
  "drive-session",
] as const satisfies readonly InputMode[];
const REPLY_PLAYBACK_OPTIONS = [
  "stream",
  "wait",
] as const satisfies readonly ReplyPlayback[];
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
function getStoredBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function getStoredFreeOfflineProfileOverrides(
  value: unknown,
): FreeOfflineProfileOverrides {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const stored = value as Record<string, unknown>;
  const result: FreeOfflineProfileOverrides = {};
  const quick = stored.quickLlmModelId;
  if (isLocalModelId(quick)) {
    const model = getLocalModel(quick);
    if (model.capability === "llm" && model.responseProfile === "quick") {
      result.quickLlmModelId = quick as LocalLlmModelId;
    }
  }
  const thorough = stored.thoroughLlmModelId;
  if (thorough === null) {
    result.thoroughLlmModelId = null;
  } else if (isLocalModelId(thorough)) {
    const model = getLocalModel(thorough);
    if (model.capability === "llm" && model.responseProfile === "thorough") {
      result.thoroughLlmModelId = thorough as LocalLlmModelId;
    }
  }
  const stt = stored.sttModelId;
  if (stt === null) {
    result.sttModelId = null;
  } else if (isLocalModelId(stt) && getLocalModel(stt).capability === "stt") {
    result.sttModelId = stt as LocalSttModelId;
  }
  const tts = stored.ttsModelId;
  if (tts === null) {
    result.ttsModelId = null;
  } else if (isLocalModelId(tts) && getLocalModel(tts).capability === "tts") {
    result.ttsModelId = tts as LocalTtsCatalogModelId;
  }
  return result;
}

function getStoredPositiveInteger(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 1
    ? value
    : fallback;
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
      value
        .map(normalizeSpeechLanguage)
        .filter(
          (candidate): candidate is TtsListenLanguage =>
            candidate !== null && SPEECH_LANGUAGE_OPTIONS.includes(candidate),
        ),
    ),
  );

  return languages.length > 0
    ? languages
    : getDefaultTtsListenLanguages(language);
}

function getStoredLocalModelId<T extends "stt" | "tts">(
  value: unknown,
  capability: T,
): T extends "stt" ? LocalSttModelId | null : LocalTtsModelId | null {
  if (
    !isLocalModelId(value) ||
    getLocalModel(value).capability !== capability ||
    (capability === "tts" && value === "kokoro-multilingual")
  ) {
    return null as T extends "stt"
      ? LocalSttModelId | null
      : LocalTtsModelId | null;
  }

  return value as T extends "stt" ? LocalSttModelId : LocalTtsModelId;
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
  | "sttLanguage"
  | "lastProvider"
  | "responseLength"
  | "responseTone"
  | "replyPlayback"
  | "spokenRepliesEnabled"
  | "ttsListenLanguages"
  | "localLanguages"
  | "localSttModelId"
  | "localTtsModelId"
  | "introDismissed"
  | "introOpened"
  | "introCompleted"
  | "freeOnboardingLanguageInitialized"
  | "freeOfflineSetupCompleted"
  | "freeOfflineProfileOverrides"
  | "nativeSttRequiresOnDevice"
  | "nativeTtsVoiceId"
  | "showUsageStats"
  | "showDebugLogButton"
  | "pastConversationKnowledgeEnabled"
  | "ulraModeEnabled"
  | "ulraModeActive"
  | "ulraModeRounds"
  | "ulraModeWarningAcknowledged"
  | "assistantInstructions"
  | "ttsInstructions"
  | "webSearchMode"
  | "sttProvider"
  | "ttsProvider"
  | "webSearchProvider"
> {
  const language = isAppLanguage(storedSettings?.language)
    ? storedSettings.language
    : DEFAULT_SETTINGS.language;
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
  const ulraModeEnabled = getStoredBoolean(
    storedSettings?.ulraModeEnabled,
    DEFAULT_SETTINGS.ulraModeEnabled,
  );

  return {
    inputMode: getAllowedValue(
      storedSettings?.inputMode,
      INPUT_MODES,
      DEFAULT_SETTINGS.inputMode,
    ),
    ttsMode:
      storedSettings?.ttsMode === "provider"
        ? "provider"
        : storedSettings?.ttsMode === "local" &&
            getStoredLocalModelId(storedSettings?.localTtsModelId, "tts")
          ? "local"
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
    sttMode:
      storedSettings?.sttMode === "provider"
        ? "provider"
        : storedSettings?.sttMode === "local" &&
            getStoredLocalModelId(storedSettings?.localSttModelId, "stt")
          ? "local"
          : "native",
    sttLanguage: normalizeSttLanguage(
      storedSettings?.sttLanguage,
      DEFAULT_SETTINGS.sttLanguage,
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
    // Speaking always has exactly one route in the current product model.
    // Migrate the retired text-only toggle forward instead of leaving users
    // silently stuck with a hidden false value.
    spokenRepliesEnabled: true,
    ttsListenLanguages: getStoredTtsListenLanguages(
      storedSettings?.ttsListenLanguages,
      language,
    ),
    localLanguages: getStoredTtsListenLanguages(
      storedSettings?.localLanguages,
      language,
    ),
    localSttModelId: getStoredLocalModelId(
      storedSettings?.localSttModelId,
      "stt",
    ),
    localTtsModelId: getStoredLocalModelId(
      storedSettings?.localTtsModelId,
      "tts",
    ),
    introDismissed: getStoredBoolean(
      storedSettings?.introDismissed,
      hasConfiguredKeys,
    ),
    // An install that arrives with keys has effectively been through setup, so
    // it may dismiss the banner without first being asked to read it.
    introOpened: getStoredBoolean(
      storedSettings?.introOpened,
      hasConfiguredKeys,
    ),
    introCompleted: getStoredBoolean(
      storedSettings?.introCompleted,
      hasConfiguredKeys,
    ),
    freeOnboardingLanguageInitialized: getStoredBoolean(
      storedSettings?.freeOnboardingLanguageInitialized,
      DEFAULT_SETTINGS.freeOnboardingLanguageInitialized,
    ),
    freeOfflineSetupCompleted: getStoredBoolean(
      storedSettings?.freeOfflineSetupCompleted,
      DEFAULT_SETTINGS.freeOfflineSetupCompleted,
    ),
    freeOfflineProfileOverrides: getStoredFreeOfflineProfileOverrides(
      storedSettings?.freeOfflineProfileOverrides,
    ),
    nativeSttRequiresOnDevice: getStoredBoolean(
      storedSettings?.nativeSttRequiresOnDevice,
      DEFAULT_SETTINGS.nativeSttRequiresOnDevice,
    ),
    nativeTtsVoiceId:
      typeof storedSettings?.nativeTtsVoiceId === "string"
        ? storedSettings.nativeTtsVoiceId
        : DEFAULT_SETTINGS.nativeTtsVoiceId,
    showUsageStats: getStoredBoolean(
      storedSettings?.showUsageStats,
      DEFAULT_SETTINGS.showUsageStats,
    ),
    showDebugLogButton: getStoredBoolean(
      storedSettings?.showDebugLogButton,
      DEFAULT_SETTINGS.showDebugLogButton,
    ),
    pastConversationKnowledgeEnabled: getStoredBoolean(
      storedSettings?.pastConversationKnowledgeEnabled,
      DEFAULT_SETTINGS.pastConversationKnowledgeEnabled,
    ),
    ulraModeEnabled,
    ulraModeActive:
      ulraModeEnabled &&
      getStoredBoolean(
        storedSettings?.ulraModeActive,
        DEFAULT_SETTINGS.ulraModeActive,
      ),
    ulraModeRounds: getStoredPositiveInteger(
      storedSettings?.ulraModeRounds,
      DEFAULT_SETTINGS.ulraModeRounds,
    ),
    ulraModeWarningAcknowledged: getStoredBoolean(
      storedSettings?.ulraModeWarningAcknowledged,
      DEFAULT_SETTINGS.ulraModeWarningAcknowledged,
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
    webSearchProvider: isWebSearchProvider(storedSettings?.webSearchProvider)
      ? storedSettings.webSearchProvider
      : DEFAULT_SETTINGS.webSearchProvider,
  };
}
