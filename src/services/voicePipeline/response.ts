import type {
  Message,
  MessageMetadata,
  MessageTurnReceipt,
  UsageEstimate,
} from "../../types";
import { recordDebugLogEvent } from "../debugLogCapture";
import { streamChat } from "../llm";
import type { createVoicePipelineTtsQueue } from "./ttsQueue";
import type { RunVoicePipelineParams } from "./types";

interface RunPipelineResponseParams {
  abortSignal?: AbortSignal;
  additionalUsage?: UsageEstimate;
  assistantInstructions: RunVoicePipelineParams["assistantInstructions"];
  callbacks: RunVoicePipelineParams["callbacks"];
  conversationSummary?: string;
  language: RunVoicePipelineParams["language"];
  llmAlreadyStarted?: boolean;
  messages: Message[];
  model: RunVoicePipelineParams["model"];
  modelStartedAtMs?: number;
  modelEffort?: RunVoicePipelineParams["modelEffort"];
  provider: RunVoicePipelineParams["provider"];
  providerApiKey: RunVoicePipelineParams["providerApiKey"];
  responseLength: RunVoicePipelineParams["responseLength"];
  responseMetadata: MessageMetadata;
  responseTone: RunVoicePipelineParams["responseTone"];
  replyPlayback: RunVoicePipelineParams["replyPlayback"];
  spokenRepliesEnabled: boolean;
  synthesisContext?: string;
  ttsQueue: ReturnType<typeof createVoicePipelineTtsQueue>;
  turnReceipt: MessageTurnReceipt;
  turnStartedAtMs: number;
  webSearchContext?: string;
}

export async function runPipelineResponse({
  abortSignal,
  additionalUsage,
  assistantInstructions,
  callbacks,
  conversationSummary,
  language,
  llmAlreadyStarted = false,
  messages,
  model,
  modelStartedAtMs,
  modelEffort,
  provider,
  providerApiKey,
  responseLength,
  responseMetadata,
  responseTone,
  replyPlayback,
  spokenRepliesEnabled,
  synthesisContext,
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
  if (!llmAlreadyStarted) {
    callbacks.onLlmStart?.();
  }

  let completed = false;
  const startedAtMs = modelStartedAtMs ?? Date.now();

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
    spokenParagraphStreaming:
      spokenRepliesEnabled && replyPlayback === "stream",
    synthesisContext,
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

      const combinedUsage =
        usage || additionalUsage
          ? {
              kind: "reply" as const,
              source: "estimated" as const,
              promptTokens:
                (usage?.promptTokens ?? 0) +
                (additionalUsage?.promptTokens ?? 0),
              completionTokens:
                (usage?.completionTokens ?? 0) +
                (additionalUsage?.completionTokens ?? 0),
              totalTokens:
                (usage?.totalTokens ?? 0) +
                (additionalUsage?.totalTokens ?? 0),
            }
          : undefined;

      callbacks.onResponseDone(fullText, combinedUsage, {
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
