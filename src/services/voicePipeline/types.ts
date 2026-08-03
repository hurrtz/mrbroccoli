import type {
  WebSearchMode,
  WebSearchProvider,
  WebSearchProviderSettings,
} from "../../constants/webSearch";
import type {
  AppLanguage,
  AssistantResponseLength,
  AssistantResponseTone,
  KokoroVoiceSelections,
  Message,
  MessageImageAttachment,
  MessageMetadata,
  Provider,
  ReplyPlayback,
  SttBackendMode,
  SttLanguage,
  TtsBackendMode,
  TtsFallbackRoute,
  TtsListenLanguage,
  UsageEstimate,
} from "../../types";
import type { SpeechDiagnosticsContext } from "../speech/diagnostics";
import type { UlraModeConfig } from "../ulraMode";
import type {
  LocalLlmModelId,
  LocalSttModelId,
  LocalTtsModelId,
} from "../../constants/localModels";

export interface PipelineCallbacks {
  onTranscription: (text: string) => string | null | void;
  onContextSummary?: (
    summary: string,
    summarizedMessageCount: number,
    usage?: UsageEstimate,
  ) => void;
  onWebSearchStart?: () => void;
  onWebSearchComplete?: () => void;
  onWebSearchFallback?: (error: Error) => void;
  onLlmStart?: () => void;
  onUlraModeComplete?: (summary: {
    failedCalls: number;
    outcome: "degraded" | "full" | "retired";
    retiredParticipants: number;
    successfulCalls: number;
  }) => void;
  onChunk: (text: string) => void;
  onResponseDone: (
    fullText: string,
    usage?: UsageEstimate,
    metadata?: MessageMetadata,
  ) => void;
  onAudioReady: (
    audioUri: string,
    diagnostics?: SpeechDiagnosticsContext,
  ) => void;
  onAudioPauseReady?: (audioUri: string) => void;
  onSpeechTextReady: (
    text: string,
    voice?: string,
    diagnostics?: SpeechDiagnosticsContext,
  ) => void;
  onSpeechPauseReady?: (durationMs: number) => void;
  onTtsFallback?: (error: Error, route: TtsFallbackRoute) => void;
  onError: (error: Error) => void | Promise<void>;
}

export interface RunVoicePipelineParams {
  turnId: string;
  turnStartedAtMs?: number;
  audioUri?: string;
  transcriptionOverride?: string;
  attachments?: MessageImageAttachment[];
  messages: Message[];
  model: string;
  modelEffort?: string;
  localLlmModelId?: LocalLlmModelId;
  provider: Provider;
  providerApiKey: string;
  sttMode: SttBackendMode;
  sttLanguage: SttLanguage;
  sttProvider?: Provider | null;
  sttApiKey?: string;
  sttModel?: string;
  localSttModelId?: LocalSttModelId | null;
  ttsMode: TtsBackendMode;
  ttsProvider?: Provider | null;
  ttsApiKey?: string;
  ttsModel?: string;
  localTtsModelId?: LocalTtsModelId | null;
  ttsVoice: string;
  kokoroVoices?: KokoroVoiceSelections;
  ttsFallbackRoutes?: TtsFallbackRoute[];
  ttsInstructions?: string;
  ttsListenLanguages?: TtsListenLanguage[];
  replyPlayback: ReplyPlayback;
  spokenRepliesEnabled?: boolean;
  contextSummary?: string;
  summarizedMessageCount?: number;
  currentConversationId?: string | null;
  privateConversationIds?: string[];
  pastConversationKnowledgeEnabled?: boolean;
  assistantInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  language: AppLanguage;
  webSearchMode?: WebSearchMode;
  webSearchProvider?: WebSearchProvider | null;
  webSearchApiKey?: string;
  webSearchOptions?: WebSearchProviderSettings;
  ulraMode?: UlraModeConfig;
  callbacks: PipelineCallbacks;
  abortSignal?: AbortSignal;
}
