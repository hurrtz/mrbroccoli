import {
  DEFAULT_PROVIDER_STT_MODELS,
  DEFAULT_PROVIDER_TTS_MODELS,
  DEFAULT_PROVIDER_TTS_VOICES,
  DEFAULT_RESPONSE_MODES,
  PROVIDER_DEFAULT_MODELS,
} from "./constants/providers/defaults";
import {
  DEFAULT_RUNTIME_PROVIDER_ID,
  createRuntimeProviderStringRecord,
} from "./constants/providers/runtimeState";
import {
  DEFAULT_WEB_SEARCH_MODE,
  createDefaultWebSearchProviderSettings,
  type WebSearchProvider,
  type WebSearchMode,
  type WebSearchProviderSettings,
} from "./constants/webSearch";
import type { RuntimeAppProviderId } from "./constants/providers/runtimeManifest";
import { DEFAULT_KOKORO_VOICES } from "./constants/kokoro";
import { DEFAULT_TTS_FALLBACK_POLICY } from "./constants/ttsFallback";

export type Provider = RuntimeAppProviderId;
export type InputMode =
  | "push-to-talk"
  | "toggle-to-talk"
  | "drive-session";
export type ReplyPlayback = "stream" | "wait";
export type TtsPlayback = ReplyPlayback;
export type ThemeMode = "light" | "dark" | "system";
export type ToastTone = "info" | "success" | "danger";
export type AppLanguage = "en" | "de" | "uk" | "hi" | "es" | "fr";
export type ResponseMode = string;
export type TtsListenLanguage =
  | "en"
  | "de"
  | "zh"
  | "es"
  | "pt"
  | "hi"
  | "fr"
  | "it"
  | "ja";
export type SttBackendMode = "native" | "provider";
export type TtsBackendMode = "native" | "kokoro" | "provider";
export type ProviderTtsFallbackRoute = "kokoro" | "native";
export type KokoroTtsFallbackRoute = "provider" | "native";
export type TtsFallbackRoute =
  | ProviderTtsFallbackRoute
  | KokoroTtsFallbackRoute;
export interface TtsFallbackPolicy {
  provider: ProviderTtsFallbackRoute[];
  kokoro: KokoroTtsFallbackRoute[];
}
export type KokoroLanguage = "en" | "zh";
export type KokoroVoiceSelections = Record<KokoroLanguage, string>;
export type ProviderCapability =
  | "llm"
  | "stt"
  | "tts"
  | "search"
  | "voices";
export type AssistantResponseLength = "brief" | "normal" | "thorough";
export type AssistantResponseTone =
  | "professional"
  | "casual"
  | "nerdy"
  | "concise"
  | "socratic"
  | "eli5";
export interface ResponseModeRoute {
  provider: Provider;
  model: string;
  effort?: string;
}
export interface ResponseModeConfig {
  id: ResponseMode;
  route: ResponseModeRoute;
}
export type ProviderApiKeys = Record<Provider, string>;
export interface ProviderValidationResult {
  status: "success" | "error";
  message?: string;
  model: string;
  configKey?: string;
}
export type ProviderCapabilityValidationResults = Partial<
  Record<ProviderCapability, ProviderValidationResult>
>;
export type ProviderValidationResults = Partial<
  Record<Provider, ProviderCapabilityValidationResults>
>;
export type ProviderModelSelections = Record<Provider, string>;
export type ProviderSttModelSelections = Record<Provider, string>;
export type ProviderTtsVoiceSelections = Record<Provider, string>;
export type ProviderTtsModelSelections = Record<Provider, string>;
export type ResponseModeSelections = ResponseModeConfig[];
export type UsageEstimateKind = "reply" | "summary";
export type VoicePreviewRequest =
  | {
      text: string;
      mode: "native";
      nativeVoice?: string;
    }
  | {
      text: string;
      mode: "kokoro";
      language: KokoroLanguage;
      voice: string;
    }
  | {
      text: string;
      mode: "provider";
      provider: Provider;
      voice: string;
      instructions?: string;
      previewLanguage: TtsListenLanguage;
    };
export type VoiceVisualPhase =
  | "idle"
  | "recording"
  | "transcribing"
  | "thinking-briefly"
  | "searching"
  | "thinking"
  | "synthesizing"
  | "speaking";
export type VoicePhaseProgressPhase =
  | "transcribing"
  | "thinking-briefly"
  | "searching"
  | "thinking"
  | "synthesizing"
  | "turn";
export interface VoiceTimingProgress {
  progress: number;
  elapsedMs: number;
  startedAt: number;
  estimatedMs: number;
  sampleCount: number;
  learned: boolean;
  overEstimate: boolean;
}
export interface VoicePhaseProgress extends VoiceTimingProgress {
  phase: VoicePhaseProgressPhase;
  overall?: VoiceTimingProgress;
  speechStart?: VoiceTimingProgress;
}

export interface Settings {
  inputMode: InputMode;
  replyPlayback: ReplyPlayback;
  spokenRepliesEnabled: boolean;
  activeResponseMode: ResponseMode;
  responseModes: ResponseModeSelections;
  providerModels: ProviderModelSelections;
  providerSttModels: ProviderSttModelSelections;
  providerTtsModels: ProviderTtsModelSelections;
  providerTtsVoices: ProviderTtsVoiceSelections;
  kokoroVoices: KokoroVoiceSelections;
  ttsFallbackPolicy: TtsFallbackPolicy;
  providerValidationResults: ProviderValidationResults;
  language: AppLanguage;
  theme: ThemeMode;
  setupGuideDismissed: boolean;
  showSetupGuideShortcut: boolean;
  lastProvider: Provider;
  sttMode: SttBackendMode;
  sttProvider: Provider | null;
  ttsMode: TtsBackendMode;
  ttsProvider: Provider | null;
  ttsListenLanguages: TtsListenLanguage[];
  ttsInstructions: string;
  assistantInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  showUsageStats: boolean;
  showDebugLogButton: boolean;
  webSearchMode: WebSearchMode;
  webSearchProvider: WebSearchProvider | null;
  webSearchProviderSettings: Record<WebSearchProvider, WebSearchProviderSettings>;
  apiKeys: ProviderApiKeys;
}

export interface UsageEstimate {
  kind: UsageEstimateKind;
  source: "estimated";
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface WebSearchSource {
  title: string;
  url: string;
}

export interface MessageWebSearchMetadata {
  provider: WebSearchProvider;
  model: string;
  query: string;
  summary: string;
  sources: WebSearchSource[];
}

export interface MessagePipelineNotice {
  stage: "stt" | "tts" | "web-search";
  level: "warning" | "error";
  message: string;
  detail?: string;
}

export interface MistralTextContentChunk {
  type: "text";
  text: string;
}

export interface MistralThinkingContentChunk {
  type: "thinking";
  thinking: MistralTextContentChunk[];
}

export type MistralAssistantContentChunk =
  | MistralTextContentChunk
  | MistralThinkingContentChunk;

export interface GeminiAssistantContentPart {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
}

export interface MessageProviderState {
  geminiAssistantContent?: GeminiAssistantContentPart[];
  mistralAssistantContent?: MistralAssistantContentChunk[];
  kimiReasoningContent?: string;
}

export interface MessageReplyFailureMetadata {
  message: string;
}

export interface MessageTurnReceiptRoute {
  provider: Provider;
  model: string;
  gateway?: string;
  upstreamProvider?: string;
  strategy?: string;
  attempts?: number;
}

export interface MessageRouterMetadata {
  gateway: "OpenRouter";
  requestedModel: string;
  actualModel?: string;
  upstreamProvider?: string;
  strategy?: string;
  attempts?: number;
  contextCompression?: {
    originalCount?: number;
    compressedCount?: number;
  };
}

export interface MessageTurnReceipt {
  version: 1;
  startedAt: string;
  input: {
    source: "voice" | "text";
    mode: SttBackendMode;
    provider?: Provider | null;
    model?: string;
  };
  requestedRoute: MessageTurnReceiptRoute;
  actualRoute: MessageTurnReceiptRoute;
  effort?: {
    selected: string;
    label: string;
    transportParameter?: string;
    transportValue?: string;
    semantics: "provider-native";
  };
  webSearch: {
    mode: WebSearchMode;
    provider?: WebSearchProvider | null;
    requested: boolean;
    ready: boolean;
    used: boolean;
    fellBack: boolean;
    decisionReason: string;
    model?: string;
  };
  speechOutput: {
    enabled: boolean;
    requestedMode: TtsBackendMode | "off";
    actualMode: TtsBackendMode | "off";
    provider?: Provider | null;
    model?: string;
    voice?: string;
    fellBack: boolean;
    fallbackReason?: string;
  };
  context: {
    existingSummaryReused: boolean;
    summaryUpdateRequested: boolean;
    summaryUpdated: boolean;
    fallbackUsed: boolean;
    messagesAvailable: number;
    messagesSent: number;
    messagesSummarized: number;
    gatewayCompression?: {
      originalCount?: number;
      compressedCount?: number;
    };
  };
  timing: {
    transcriptionMs?: number;
    contextMs?: number;
    webSearchMs?: number;
    modelMs?: number;
    replyReadyMs?: number;
    firstSpeechMs?: number;
    totalMs?: number;
  };
}

export interface MessageMetadata {
  webSearch?: MessageWebSearchMetadata;
  notices?: MessagePipelineNotice[];
  providerState?: MessageProviderState;
  replyFailure?: MessageReplyFailureMetadata;
  router?: MessageRouterMetadata;
  turnReceipt?: MessageTurnReceipt;
}

const DEFAULT_ENGLISH_ASSISTANT_INSTRUCTIONS =
  "You are a voice assistant. The user is speaking to you and will hear your response read aloud. Respond naturally and conversationally as if talking. Never use markdown, bullet points, numbered lists, headers, or any formatting. Keep responses concise and spoken-friendly.";

export const DEFAULT_ASSISTANT_INSTRUCTIONS_BY_LANGUAGE: Record<
  AppLanguage,
  string
> = {
  en: DEFAULT_ENGLISH_ASSISTANT_INSTRUCTIONS,
  de: "Du bist ein Sprachassistent. Die Nutzerin oder der Nutzer spricht mit dir und wird deine Antwort vorgelesen bekommen. Antworte natürlich und gesprächsnah, als wärest du in einem echten Gespräch. Verwende niemals Markdown, Aufzählungen, nummerierte Listen, Überschriften oder sonstige Formatierung. Halte Antworten knapp und gut vorlesbar.",
  // Ukrainian currently localizes the app UI only. Keep assistant behavior and
  // speech-language defaults unchanged when the interface language changes.
  uk: DEFAULT_ENGLISH_ASSISTANT_INSTRUCTIONS,
  hi: DEFAULT_ENGLISH_ASSISTANT_INSTRUCTIONS,
  es: DEFAULT_ENGLISH_ASSISTANT_INSTRUCTIONS,
  fr: DEFAULT_ENGLISH_ASSISTANT_INSTRUCTIONS,
};

const LEGACY_DEFAULT_ASSISTANT_INSTRUCTIONS = [
  "Du bist ein Sprachassistent. Die Nutzerin oder der Nutzer spricht mit dir und wird deine Antwort vorgelesen bekommen. Antworte natuerlich und gespraechsnah, als waerest du in einem echten Gespraech. Verwende niemals Markdown, Aufzaehlungen, nummerierte Listen, Ueberschriften oder sonstige Formatierung. Halte Antworten knapp und gut vorlesbar.",
] as const;

export const DEFAULT_ASSISTANT_INSTRUCTIONS =
  DEFAULT_ASSISTANT_INSTRUCTIONS_BY_LANGUAGE.en;

export function getDefaultAssistantInstructions(language: AppLanguage) {
  return DEFAULT_ASSISTANT_INSTRUCTIONS_BY_LANGUAGE[language];
}

export function isDefaultAssistantInstructions(value: string) {
  return (
    Object.values(DEFAULT_ASSISTANT_INSTRUCTIONS_BY_LANGUAGE).includes(value) ||
    LEGACY_DEFAULT_ASSISTANT_INSTRUCTIONS.includes(
      value as (typeof LEGACY_DEFAULT_ASSISTANT_INSTRUCTIONS)[number],
    )
  );
}

export function getDefaultTtsListenLanguages(
  language: AppLanguage,
): TtsListenLanguage[] {
  return [language === "en" || language === "de" ? language : "en"];
}

export const DEFAULT_SETTINGS: Settings = {
  inputMode: "toggle-to-talk",
  replyPlayback: "stream",
  spokenRepliesEnabled: true,
  activeResponseMode: DEFAULT_RESPONSE_MODES[0]?.id ?? "mode-1",
  responseModes: DEFAULT_RESPONSE_MODES,
  providerModels: PROVIDER_DEFAULT_MODELS,
  providerSttModels: DEFAULT_PROVIDER_STT_MODELS,
  providerTtsModels: DEFAULT_PROVIDER_TTS_MODELS,
  providerTtsVoices: DEFAULT_PROVIDER_TTS_VOICES,
  kokoroVoices: DEFAULT_KOKORO_VOICES,
  ttsFallbackPolicy: DEFAULT_TTS_FALLBACK_POLICY,
  providerValidationResults: {},
  language: "en",
  theme: "system",
  setupGuideDismissed: false,
  showSetupGuideShortcut: true,
  lastProvider: DEFAULT_RUNTIME_PROVIDER_ID,
  sttMode: "native",
  sttProvider: null,
  ttsMode: "native",
  ttsProvider: null,
  ttsListenLanguages: getDefaultTtsListenLanguages("en"),
  ttsInstructions: "",
  assistantInstructions: getDefaultAssistantInstructions("en"),
  responseLength: "normal",
  responseTone: "professional",
  showUsageStats: false,
  showDebugLogButton: false,
  webSearchMode: DEFAULT_WEB_SEARCH_MODE,
  webSearchProvider: null,
  webSearchProviderSettings: createDefaultWebSearchProviderSettings(),
  apiKeys: createRuntimeProviderStringRecord(),
};

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model: string | null;
  provider: Provider | null;
  usage?: UsageEstimate;
  metadata?: MessageMetadata;
  timestamp: string;
}

export interface ConversationUsageEvent {
  id: string;
  kind: "context-summary";
  model: string | null;
  provider: Provider | null;
  timestamp: string;
  usage: UsageEstimate;
}

export interface ConversationTtsVoiceSetting {
  provider: Provider;
  model: string;
  voice: string;
}

export interface ConversationSettings {
  responseLength?: AssistantResponseLength;
  responseTone?: AssistantResponseTone;
  llmInstructions?: string;
  ttsInstructions?: string;
  ttsVoice?: ConversationTtsVoiceSetting;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  settings?: ConversationSettings;
  usageEvents?: ConversationUsageEvent[];
  contextSummary?: string;
  summarizedMessageCount?: number;
}

export interface ConversationMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  providers: Provider[];
  providerModels: Partial<Record<Provider, string[]>>;
  lastModel: string | null;
  lastProvider: Provider | null;
  pinned: boolean;
}
