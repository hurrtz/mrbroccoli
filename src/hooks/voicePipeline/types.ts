import type {
  WebSearchMode,
  WebSearchProvider,
  WebSearchProviderSettings,
} from "../../constants/webSearch";
import type { TranslationKey } from "../../i18n";
import type {
  AppLanguage,
  AssistantResponseLength,
  AssistantResponseTone,
  Conversation,
  ConversationSettings,
  KokoroVoiceSelections,
  Message,
  Provider,
  ReplyPlayback,
  SttBackendMode,
  TtsBackendMode,
  TtsFallbackRoute,
  TtsListenLanguage,
  ToastTone,
  UsageEstimate,
  VoicePhaseProgress,
} from "../../types";
import type { useAudioPlayer } from "../useAudioPlayer";

export type PipelinePhase =
  | "idle"
  | "transcribing"
  | "thinking-briefly"
  | "searching"
  | "thinking"
  | "synthesizing"
  | "speaking";

export type ReplayPhase = "idle" | "preparing" | "speaking";

export interface VoiceCaptureRequest {
  audioUri?: string;
  existingUserMessageId?: string;
  transcriptionOverride?: string;
}

export type AudioPlayer = ReturnType<typeof useAudioPlayer>;

export interface UseVoicePipelineParams {
  activeConversation: Conversation | null;
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => Message | null;
  createConversation: (
    firstMessage: string,
    initialModel?: string | null,
    initialProvider?: Provider | null,
    initialSettings?: ConversationSettings,
  ) => void;
  initialConversationSettings?: ConversationSettings;
  updateMessage: (
    messageId: string,
    updater: (message: Message) => Message,
  ) => Message | null;
  updateConversationContextSummary: (
    summary: string,
    summarizedCount: number,
    usage?: UsageEstimate,
    usageModel?: string | null,
    usageProvider?: Provider | null,
  ) => void;
  player: AudioPlayer;
  provider: Provider;
  providerApiKey: string;
  model: string;
  modelEffort?: string;
  sttMode: SttBackendMode;
  sttProvider: Provider | null;
  sttApiKey: string;
  selectedSttModel: string;
  ttsMode: TtsBackendMode;
  ttsProvider: Provider | null;
  ttsApiKey: string;
  selectedTtsModel: string;
  selectedTtsVoice: string;
  kokoroVoices: KokoroVoiceSelections;
  ttsFallbackRoutes: TtsFallbackRoute[];
  ttsInstructions?: string;
  ttsListenLanguages: TtsListenLanguage[];
  replyPlayback: ReplyPlayback;
  spokenRepliesEnabled: boolean;
  assistantInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  language: AppLanguage;
  webSearchMode?: WebSearchMode;
  webSearchProvider?: WebSearchProvider | null;
  webSearchApiKey?: string;
  webSearchOptions?: WebSearchProviderSettings;
  isRecording: boolean;
  showToast: (
    message: string,
    onRetry?: () => void,
    tone?: ToastTone,
    onDismiss?: () => void,
  ) => void;
  t: (
    key: TranslationKey,
    params?: Record<string, string | number | undefined>,
  ) => string;
}

export interface UseVoicePipelineResult {
  pipelinePhase: PipelinePhase;
  setPipelinePhase: (phase: PipelinePhase) => void;
  streamingText: string;
  setStreamingText: (text: string) => void;
  phaseProgress: VoicePhaseProgress | null;
  abortRef: React.MutableRefObject<AbortController | null>;
  lastCompletedReplyRef: React.MutableRefObject<string>;
  replayPhase: ReplayPhase;
  activeReplayMessageId: string | null;
  playReplyText: (text: string, messageId?: string) => Promise<void>;
  handleRepeatLastReply: (
    textOverride?: string,
    messageId?: string,
  ) => Promise<void>;
  stopReplay: () => Promise<void>;
  handleVoiceCaptureDone: (params: VoiceCaptureRequest) => Promise<void>;
}
