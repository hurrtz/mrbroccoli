import type {
  AppLanguage,
  AssistantResponseLength,
  AssistantResponseTone,
  Message,
  MessageMetadata,
  Provider,
  UsageEstimate,
} from "../../types";

export interface StreamChatParams {
  messages: Message[];
  model: string;
  modelEffort?: string;
  provider: Provider;
  apiKey: string;
  assistantInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  language: AppLanguage;
  conversationSummary?: string;
  pastConversationKnowledge?: string;
  spokenParagraphStreaming?: boolean;
  synthesisContext?: string;
  webSearchContext?: string;
  onChunk: (text: string) => void;
  onDone: (
    fullText: string,
    usage?: UsageEstimate,
    metadata?: MessageMetadata,
  ) => void | Promise<void>;
  onError: (error: Error) => void | Promise<void>;
  abortSignal?: AbortSignal;
}
