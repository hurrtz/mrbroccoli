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
  MessageMetadata,
  Provider,
  ReplyPlayback,
  SttBackendMode,
  TtsBackendMode,
  TtsListenLanguage,
  UsageEstimate,
} from "../../types";
import type { SpeechDiagnosticsContext } from "../speech/diagnostics";

export interface PipelineCallbacks {
  onTranscription: (text: string) => void;
  onContextSummary?: (
    summary: string,
    summarizedMessageCount: number,
    usage?: UsageEstimate,
  ) => void;
  onWebSearchStart?: () => void;
  onWebSearchComplete?: () => void;
  onWebSearchFallback?: (error: Error) => void;
  onLlmStart?: () => void;
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
  onSpeechTextReady: (
    text: string,
    voice?: string,
    diagnostics?: SpeechDiagnosticsContext,
  ) => void;
  onTtsFallback?: (error: Error) => void;
  onError: (error: Error) => void | Promise<void>;
}

export interface RunVoicePipelineParams {
  turnStartedAtMs?: number;
  audioUri?: string;
  transcriptionOverride?: string;
  messages: Message[];
  model: string;
  modelEffort?: string;
  provider: Provider;
  providerApiKey: string;
  sttMode: SttBackendMode;
  sttProvider?: Provider | null;
  sttApiKey?: string;
  sttModel?: string;
  ttsMode: TtsBackendMode;
  ttsProvider?: Provider | null;
  ttsApiKey?: string;
  ttsModel?: string;
  ttsVoice: string;
  kokoroVoices?: KokoroVoiceSelections;
  ttsInstructions?: string;
  ttsListenLanguages?: TtsListenLanguage[];
  replyPlayback: ReplyPlayback;
  spokenRepliesEnabled?: boolean;
  contextSummary?: string;
  summarizedMessageCount?: number;
  assistantInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  language: AppLanguage;
  webSearchMode?: WebSearchMode;
  webSearchProvider?: WebSearchProvider | null;
  webSearchApiKey?: string;
  webSearchOptions?: WebSearchProviderSettings;
  callbacks: PipelineCallbacks;
  abortSignal?: AbortSignal;
}
