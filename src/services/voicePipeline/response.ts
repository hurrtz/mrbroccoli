import type {
  Message,
  MessageMetadata,
  MessageTurnReceipt,
} from "../../types";
import { recordDebugLogEvent } from "../debugLogCapture";
import { streamChat } from "../llm";
import type { createVoicePipelineTtsQueue } from "./ttsQueue";
import type { RunVoicePipelineParams } from "./types";

interface RunPipelineResponseParams {
  abortSignal?: AbortSignal;
  assistantInstructions: RunVoicePipelineParams["assistantInstructions"];
  callbacks: RunVoicePipelineParams["callbacks"];
  conversationSummary?: string;
  language: RunVoicePipelineParams["language"];
  messages: Message[];
  model: RunVoicePipelineParams["model"];
  modelEffort?: RunVoicePipelineParams["modelEffort"];
  provider: RunVoicePipelineParams["provider"];
  providerApiKey: RunVoicePipelineParams["providerApiKey"];
  responseLength: RunVoicePipelineParams["responseLength"];
  responseMetadata: MessageMetadata;
  responseTone: RunVoicePipelineParams["responseTone"];
  spokenRepliesEnabled: boolean;
  ttsQueue: ReturnType<typeof createVoicePipelineTtsQueue>;
  turnReceipt: MessageTurnReceipt;
  turnStartedAtMs: number;
  webSearchContext?: string;
}

export async function runPipelineResponse({
  abortSignal,
  assistantInstructions,
  callbacks,
  conversationSummary,
  language,
  messages,
  model,
  modelEffort,
  provider,
  providerApiKey,
  responseLength,
  responseMetadata,
  responseTone,
  spokenRepliesEnabled,
  ttsQueue,
  turnReceipt,
  turnStartedAtMs,
  webSearchContext,
}: RunPipelineResponseParams): Promise<boolean> {
  recordDebugLogEvent({
    event: "voice-pipeline-llm-requested",
    payload: {
      model,
      modelEffort: modelEffort ?? null,
      provider,
      hasWebSearchContext: !!webSearchContext,
      webSearchContextLength: webSearchContext?.length ?? 0,
    },
  });
  callbacks.onLlmStart?.();

  let completed = false;
  const startedAtMs = Date.now();

  await streamChat({
    messages,
    model,
    modelEffort,
    provider,
    apiKey: providerApiKey,
    assistantInstructions,
    responseLength,
    responseTone,
    language,
    conversationSummary,
    webSearchContext,
    abortSignal,
    onChunk: (text) => {
      if (!abortSignal?.aborted) {
        ttsQueue.handleStreamChunk(text);
      }
    },
    onDone: async (fullText, usage, llmMetadata) => {
      if (abortSignal?.aborted) {
        return;
      }

      const completedAtMs = Date.now();
      turnReceipt.timing.modelMs = completedAtMs - startedAtMs;
      turnReceipt.timing.replyReadyMs = completedAtMs - turnStartedAtMs;
      if (!spokenRepliesEnabled) {
        turnReceipt.timing.totalMs = completedAtMs - turnStartedAtMs;
      }

      if (llmMetadata?.router) {
        turnReceipt.actualRoute = {
          provider,
          model: llmMetadata.router.actualModel ?? model,
          gateway: llmMetadata.router.gateway,
          upstreamProvider: llmMetadata.router.upstreamProvider,
          strategy: llmMetadata.router.strategy,
          attempts: llmMetadata.router.attempts,
        };
        if (llmMetadata.router.contextCompression) {
          turnReceipt.context.gatewayCompression =
            llmMetadata.router.contextCompression;
        }
      }

      callbacks.onResponseDone(fullText, usage, {
        ...responseMetadata,
        ...llmMetadata,
        turnReceipt: {
          ...turnReceipt,
          ...llmMetadata?.turnReceipt,
        },
      });
      await ttsQueue.handleResponseDone(fullText);
      completed = true;
    },
    onError: callbacks.onError,
  });

  return completed;
}
