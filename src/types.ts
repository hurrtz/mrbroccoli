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
import type {
  LocalLlmModelId,
  LocalSttModelId,
  LocalTtsCatalogModelId,
  LocalTtsModelId,
} from "./constants/localModels";
import type { SpeechLanguage, SttLanguage } from "./constants/speechLanguages";
import { DEFAULT_KOKORO_VOICES } from "./constants/kokoro";
import { DEFAULT_TTS_FALLBACK_POLICY } from "./constants/ttsFallback";
import {
  APP_LANGUAGES,
  getDefaultAssistantInstructionsForLocale,
  getDefaultTtsListenLanguageForLocale,
} from "./i18n/localeRegistry";
import type { AppLanguage } from "./i18n/localeRegistry";

export type { AppLanguage } from "./i18n/localeRegistry";
export type { SpeechLanguage, SttLanguage } from "./constants/speechLanguages";

export type Provider = RuntimeAppProviderId;
export type InputMode = "push-to-talk" | "toggle-to-talk" | "drive-session";
export type ReplyPlayback = "stream" | "wait";
export type TtsPlayback = ReplyPlayback;
export type ThemeMode = "light" | "dark" | "system";
export type ToastTone = "info" | "success" | "danger";
export type ResponseMode = string;
export type TtsListenLanguage = SpeechLanguage;
export type SttBackendMode = "native" | "local" | "provider";
export type TtsBackendMode = "native" | "kokoro" | "local" | "provider";
export type ProviderTtsFallbackRoute = "kokoro" | "native";
export type KokoroTtsFallbackRoute = "provider" | "native";
export type LocalTtsFallbackRoute = "provider" | "native";
export type TtsFallbackRoute =
  ProviderTtsFallbackRoute | KokoroTtsFallbackRoute | LocalTtsFallbackRoute;
export interface TtsFallbackPolicy {
  provider: ProviderTtsFallbackRoute[];
  kokoro: KokoroTtsFallbackRoute[];
  local: LocalTtsFallbackRoute[];
}
export type KokoroLanguage = "en" | "zh";
export type KokoroVoiceSelections = Record<KokoroLanguage, string>;
export interface FreeOfflineProfileOverrides {
  quickLlmModelId?: LocalLlmModelId;
  thoroughLlmModelId?: LocalLlmModelId | null;
  sttModelId?: LocalSttModelId | null;
  ttsModelId?: LocalTtsCatalogModelId | null;
}
export type ProviderCapability = "llm" | "stt" | "tts" | "search" | "voices";
export type AssistantResponseLength = "brief" | "normal" | "thorough";
export type AssistantResponseTone =
  "professional" | "casual" | "nerdy" | "concise" | "socratic" | "eli5";
export interface ResponseModeRoute {
  provider: Provider;
  model: string;
  effort?: string;
  runtime?: "provider" | "local";
  localModelId?: LocalLlmModelId;
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
      previewLanguage: TtsListenLanguage;
    }
  | {
      text: string;
      mode: "kokoro";
      language: KokoroLanguage;
      voice: string;
    }
  | {
      text: string;
      mode: "local";
      modelId: LocalTtsModelId;
      previewLanguage: TtsListenLanguage;
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
  introDismissed: boolean;
  freeOnboardingLanguageInitialized: boolean;
  freeOfflineSetupCompleted: boolean;
  freeOfflineProfileOverrides: FreeOfflineProfileOverrides;
  lastProvider: Provider;
  sttMode: SttBackendMode;
  nativeSttRequiresOnDevice: boolean;
  sttLanguage: SttLanguage;
  sttProvider: Provider | null;
  localLanguages: SpeechLanguage[];
  localSttModelId: LocalSttModelId | null;
  ttsMode: TtsBackendMode;
  nativeTtsVoiceId: string;
  ttsProvider: Provider | null;
  localTtsModelId: LocalTtsModelId | null;
  ttsListenLanguages: TtsListenLanguage[];
  ttsInstructions: string;
  assistantInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  showUsageStats: boolean;
  showDebugLogButton: boolean;
  pastConversationKnowledgeEnabled: boolean;
  ulraModeEnabled: boolean;
  ulraModeActive: boolean;
  ulraModeRounds: number;
  ulraModeWarningAcknowledged: boolean;
  webSearchMode: WebSearchMode;
  webSearchProvider: WebSearchProvider | null;
  webSearchProviderSettings: Record<
    WebSearchProvider,
    WebSearchProviderSettings
  >;
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

export interface MessageConversationKnowledgeSource {
  conversationId: string;
  match?: "strong" | "related";
  title: string;
  updatedAt: string;
}

export interface MessageConversationKnowledgeMetadata {
  contentPolicy?: "user-authored-only";
  engine:
    | "local-hybrid-v1"
    | "local-user-authored-v2"
    | "local-user-authored-v3"
    | "local-conversation-history-v4";
  sources: MessageConversationKnowledgeSource[];
}

export interface MessagePipelineNotice {
  stage: "stt" | "tts" | "ulra" | "web-search" | "interruption";
  level: "warning" | "error";
  message: string;
  detail?: string;
}

export interface MessageUlraModeCall {
  failureKind?: string;
  modeId: string;
  model: string;
  participant?: number;
  provider: Provider;
  round: number;
}

export interface MessageUlraModeContribution extends MessageUlraModeCall {
  reviewVerdict?: "challenge" | "converged";
  usage: UsageEstimate;
}

export interface MessageUlraModeMetadata {
  convergenceReached?: boolean;
  contributions: MessageUlraModeContribution[];
  estimatedIntermediateTokens: number;
  failedCalls: number;
  failures: MessageUlraModeCall[];
  retiredParticipants?: number;
  roundsCompleted: number;
  roundsRequested: number;
  successfulCalls: number;
  synthesisContract?: "evidence-ledger-v1";
  synthesisContributions?: number;
  synthesisEstimatedTokens?: number;
  synthesisOmittedContributions?: number;
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
  MistralTextContentChunk | MistralThinkingContentChunk;

export interface GeminiAssistantContentPart {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
}

export interface MessageProviderState {
  geminiAssistantContent?: GeminiAssistantContentPart[];
  mistralAssistantContent?: MistralAssistantContentChunk[];
  /** Retained so conversations created by the removed direct Moonshot route remain readable. */
  kimiReasoningContent?: string;
}

export interface MessageReplyFailureMetadata {
  message: string;
}

export interface MessageTurnReceiptRoute {
  provider: Provider | null;
  model: string;
  runtime?: "provider" | "local";
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

export interface MessageModelFailoverMetadata {
  actualModel: string;
  actualModelEffort?: string;
  attempts: number;
  requestedModel: string;
  requestedModelEffort?: string;
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
    pastKnowledgeRequested?: boolean;
    pastKnowledgeUsed?: boolean;
    pastKnowledgeSourceCount?: number;
    gatewayCompression?: {
      originalCount?: number;
      compressedCount?: number;
    };
  };
  timing: {
    transcriptionMs?: number;
    contextMs?: number;
    pastKnowledgeMs?: number;
    webSearchMs?: number;
    modelMs?: number;
    replyReadyMs?: number;
    firstSpeechMs?: number;
    totalMs?: number;
  };
}

export interface MessageMetadata {
  conversationKnowledge?: MessageConversationKnowledgeMetadata;
  webSearch?: MessageWebSearchMetadata;
  ulraMode?: MessageUlraModeMetadata;
  notices?: MessagePipelineNotice[];
  providerState?: MessageProviderState;
  replyFailure?: MessageReplyFailureMetadata;
  modelFailover?: MessageModelFailoverMetadata;
  router?: MessageRouterMetadata;
  turnReceipt?: MessageTurnReceipt;
}

export const DEFAULT_ASSISTANT_INSTRUCTIONS_BY_LANGUAGE = Object.freeze(
  Object.fromEntries(
    APP_LANGUAGES.map((language) => [
      language,
      getDefaultAssistantInstructionsForLocale(language),
    ]),
  ) as Record<AppLanguage, string>,
);

const LEGACY_DEFAULT_ASSISTANT_INSTRUCTIONS = [
  "Du bist ein Sprachassistent. Die Nutzerin oder der Nutzer spricht mit dir und wird deine Antwort vorgelesen bekommen. Antworte natuerlich und gespraechsnah, als waerest du in einem echten Gespraech. Verwende niemals Markdown, Aufzaehlungen, nummerierte Listen, Ueberschriften oder sonstige Formatierung. Halte Antworten knapp und gut vorlesbar.",
] as const;

export const DEFAULT_ASSISTANT_INSTRUCTIONS =
  DEFAULT_ASSISTANT_INSTRUCTIONS_BY_LANGUAGE.en;

export function getDefaultAssistantInstructions(language: AppLanguage) {
  return getDefaultAssistantInstructionsForLocale(language);
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
  return [getDefaultTtsListenLanguageForLocale(language)];
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
  introDismissed: false,
  freeOnboardingLanguageInitialized: false,
  freeOfflineSetupCompleted: false,
  freeOfflineProfileOverrides: {},
  lastProvider: DEFAULT_RUNTIME_PROVIDER_ID,
  sttMode: "native",
  nativeSttRequiresOnDevice: false,
  sttLanguage: "auto",
  sttProvider: null,
  localLanguages: getDefaultTtsListenLanguages("en"),
  localSttModelId: null,
  ttsMode: "native",
  nativeTtsVoiceId: "",
  ttsProvider: null,
  localTtsModelId: null,
  ttsListenLanguages: getDefaultTtsListenLanguages("en"),
  ttsInstructions: "",
  assistantInstructions: getDefaultAssistantInstructions("en"),
  responseLength: "normal",
  responseTone: "professional",
  showUsageStats: false,
  showDebugLogButton: false,
  pastConversationKnowledgeEnabled: false,
  ulraModeEnabled: true,
  ulraModeActive: false,
  ulraModeRounds: 2,
  ulraModeWarningAcknowledged: false,
  webSearchMode: DEFAULT_WEB_SEARCH_MODE,
  webSearchProvider: null,
  webSearchProviderSettings: createDefaultWebSearchProviderSettings(),
  apiKeys: createRuntimeProviderStringRecord(),
};

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  editedAt?: string;
  attachments?: MessageImageAttachment[];
  model: string | null;
  provider: Provider | null;
  usage?: UsageEstimate;
  metadata?: MessageMetadata;
  timestamp: string;
}

export type MessageImageMimeType = "image/jpeg" | "image/png" | "image/webp";

export interface MessageImageAttachment {
  id: string;
  kind: "image";
  uri: string;
  mimeType: MessageImageMimeType;
  width: number;
  height: number;
  byteSize: number;
  sharedWithProviders: Provider[];
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

/** @deprecated Retained only for restoring and exporting legacy app data. */
export type ConversationArtifactKind =
  | "decision"
  | "idea"
  | "assumption"
  | "counterargument"
  | "question"
  | "hypothesis"
  | "action";

/** @deprecated Retained only for restoring and exporting legacy app data. */
export interface ConversationArtifact {
  id: string;
  kind: ConversationArtifactKind;
  text: string;
  sourceMessageId: string;
  createdAt: string;
}

export type ConversationBranchKind =
  "edited-prompt" | "alternative-response" | "continue-from-message";

export interface ConversationBranchOrigin {
  rootConversationId: string;
  parentConversationId: string;
  parentMessageId: string;
  branchMessageId: string;
  kind: ConversationBranchKind;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  /** @deprecated Retained only for restoring and exporting legacy app data. */
  artifacts?: ConversationArtifact[];
  settings?: ConversationSettings;
  usageEvents?: ConversationUsageEvent[];
  contextSummary?: string;
  summarizedMessageCount?: number;
  knowledgeExcludedConversationIds?: string[];
  branch?: ConversationBranchOrigin;
  isPrivate?: boolean;
}

export interface ConversationBranchResult {
  conversation: Conversation;
  contextMessages: Message[];
  checkpointMessage: Message;
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
  branch?: ConversationBranchOrigin;
  branchSchemaVersion?: 2;
  isPrivate?: boolean;
}
