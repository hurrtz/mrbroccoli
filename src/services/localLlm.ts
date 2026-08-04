import { AppState, type AppStateStatus, Platform } from "react-native";

import {
  LOCAL_MODEL_CATALOG_VERSION,
  getLocalModel,
  type LocalLlmModelDefinition,
  type LocalLlmModelId,
} from "../constants/localModels";
import type {
  AppLanguage,
  AssistantResponseLength,
  AssistantResponseTone,
  Message,
  UsageEstimate,
} from "../types";
import { buildSystemPrompt } from "./llm/prompts";
import { getLocalModelInstallStatus } from "./localModelManager";
import { renderTextForSpeech } from "./speechTextRenderer";
import {
  probeLocalDeviceCapabilities,
  saveLocalModelBenchmarkResult,
  type LocalModelBenchmarkResult,
} from "./localDeviceCapabilities";

type LlamaContext = Awaited<
  ReturnType<(typeof import("llama.rn"))["initLlama"]>
>;

let activeContext: { modelId: LocalLlmModelId; context: LlamaContext } | null =
  null;
let contextTask = Promise.resolve();
let completionTask = Promise.resolve();
let appStateSubscription: { remove: () => void } | null = null;

const STOP_WORDS = [
  "</s>",
  "<|end|>",
  "<|eot_id|>",
  "<|end_of_text|>",
  "<|im_end|>",
  "<|END_OF_TURN_TOKEN|>",
  "<|end_of_turn|>",
  "<|endoftext|>",
];

const LOCAL_RESPONSE_LANGUAGE_NAMES: Partial<Record<AppLanguage, string>> = {
  en: "English",
  de: "German",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  pt: "European Portuguese",
  "pt-BR": "Brazilian Portuguese",
  ru: "Russian",
};

function getLocalAssistantInstructions(
  assistantInstructions: string,
  language: AppLanguage,
) {
  const languageName = LOCAL_RESPONSE_LANGUAGE_NAMES[language] ?? language;
  return [
    assistantInstructions.trim(),
    `The offline profile's single target language is ${languageName}. Respond in ${languageName}. Do not switch to English because internal reasoning or other system text is in English. Only use another language when the user explicitly asks for a translation or a reply in that language. Keep private reasoning internal and return only the final answer.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function sanitizeLocalResponseText(text: string) {
  const withoutPrivateReasoning = text
    .replace(/<think\b[^>]*>[\s\S]*?<\/think\s*>/giu, " ")
    .replace(/<think\b[^>]*>[\s\S]*$/giu, " ")
    .replace(/<\/?think\b[^>]*>/giu, " ");
  return renderTextForSpeech(withoutPrivateReasoning);
}

function getLlamaModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Jest and unsupported builds import-safe
  return require("llama.rn") as typeof import("llama.rn");
}

function maxReplyTokens(responseLength: AssistantResponseLength) {
  switch (responseLength) {
    case "brief":
      return 192;
    case "thorough":
      return 768;
    default:
      return 384;
  }
}

function enablesThinking(model: LocalLlmModelDefinition) {
  return model.responseProfile === "thorough";
}

async function destroyActiveContext() {
  const current = activeContext;
  activeContext = null;
  if (current) {
    await current.context.release().catch(() => undefined);
  }
}

function registerAppStateRelease() {
  if (appStateSubscription) {
    return;
  }
  appStateSubscription = AppState.addEventListener(
    "change",
    (state: AppStateStatus) => {
      if (state !== "active") {
        void releaseLocalLlmResources();
      }
    },
  );
}

async function getContext(model: LocalLlmModelDefinition) {
  const task = contextTask.then(async () => {
    if (activeContext?.modelId === model.id) {
      return activeContext.context;
    }

    await destroyActiveContext();
    const status = await getLocalModelInstallStatus(model.id);
    if (!status.path || !status.verified) {
      throw new Error(`Download and verify ${model.name} before using it.`);
    }
    const { initLlama } = getLlamaModule();
    const context = await initLlama({
      model: status.path,
      n_ctx: model.contextTokens,
      n_batch: 256,
      n_threads: Math.max(2, Math.min(6, 4)),
      n_gpu_layers: Platform.OS === "ios" ? 99 : 0,
      flash_attn_type: Platform.OS === "ios" ? "on" : "off",
      cache_type_k: "q8_0",
      cache_type_v: "q8_0",
      use_mmap: true,
      use_mlock: false,
      no_extra_bufts: true,
    });
    activeContext = { modelId: model.id, context };
    registerAppStateRelease();
    return context;
  });
  contextTask = task.then(
    () => undefined,
    () => undefined,
  );
  return task;
}

function toLocalMessages(systemPrompt: string, messages: Message[]) {
  return [
    { role: "system", content: systemPrompt },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

export async function streamLocalChat(params: {
  messages: Message[];
  modelId: LocalLlmModelId;
  assistantInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  language: AppLanguage;
  conversationSummary?: string;
  pastConversationKnowledge?: string;
  spokenParagraphStreaming?: boolean;
  webSearchContext?: string;
  onChunk: (text: string) => void;
  abortSignal?: AbortSignal;
}) {
  const model = getLocalModel(params.modelId) as LocalLlmModelDefinition;
  const thinkingEnabled = enablesThinking(model);
  const systemPrompt = buildSystemPrompt({
    assistantInstructions: getLocalAssistantInstructions(
      params.assistantInstructions,
      params.language,
    ),
    responseLength: params.responseLength,
    responseTone: params.responseTone,
    language: params.language,
    currentModel: model.name,
    conversationSummary: params.conversationSummary,
    pastConversationKnowledge: params.pastConversationKnowledge,
    spokenParagraphStreaming: params.spokenParagraphStreaming,
    webSearchContext: params.webSearchContext,
  });
  const task = completionTask.then(async () => {
    const context = await getContext(model);
    const abort = () => {
      void context.stopCompletion();
    };
    params.abortSignal?.addEventListener("abort", abort, { once: true });

    try {
      if (params.abortSignal?.aborted) {
        const error = new Error("Local response generation was cancelled.");
        error.name = "AbortError";
        throw error;
      }
      let streamedVisibleText = "";
      const streamParsedContent = (content: string) => {
        const nextVisibleText = sanitizeLocalResponseText(content);
        if (
          !nextVisibleText ||
          nextVisibleText === streamedVisibleText ||
          !nextVisibleText.startsWith(streamedVisibleText)
        ) {
          return;
        }
        const nextChunk = nextVisibleText.slice(streamedVisibleText.length);
        streamedVisibleText = nextVisibleText;
        if (nextChunk) {
          params.onChunk(nextChunk);
        }
      };
      const result = await context.completion(
        {
          messages: toLocalMessages(systemPrompt, params.messages),
          n_predict: maxReplyTokens(params.responseLength),
          stop: STOP_WORDS,
          temperature: 0.65,
          top_p: 0.9,
          min_p: 0.05,
          enable_thinking: thinkingEnabled,
          reasoning_format: thinkingEnabled ? "auto" : "none",
        },
        ({ content, token }) => {
          if (params.abortSignal?.aborted) {
            return;
          }
          if (thinkingEnabled) {
            if (typeof content === "string") {
              streamParsedContent(content);
            }
          } else if (token) {
            params.onChunk(token);
          }
        },
      );
      if (params.abortSignal?.aborted || result.interrupted) {
        const error = new Error("Local response generation was cancelled.");
        error.name = "AbortError";
        throw error;
      }
      const fullText = sanitizeLocalResponseText(
        result.content || result.text,
      );
      if (!fullText) {
        throw new Error(`${model.name} returned an empty response.`);
      }
      const usage: UsageEstimate = {
        kind: "reply",
        source: "estimated",
        promptTokens: result.tokens_evaluated,
        completionTokens: result.tokens_predicted,
        totalTokens: result.tokens_evaluated + result.tokens_predicted,
      };
      return { fullText, usage, timings: result.timings };
    } finally {
      params.abortSignal?.removeEventListener("abort", abort);
    }
  });
  completionTask = task.then(
    () => undefined,
    () => undefined,
  );
  return task;
}

export async function benchmarkLocalLlm(
  modelId: LocalLlmModelId,
): Promise<LocalModelBenchmarkResult> {
  const model = getLocalModel(modelId) as LocalLlmModelDefinition;
  const device = await probeLocalDeviceCapabilities();
  const startedAt = Date.now();
  let loadMs = 0;

  try {
    await releaseLocalLlmResources();
    const loadStartedAt = Date.now();
    const context = await getContext(model);
    loadMs = Date.now() - loadStartedAt;
    const generationStartedAt = Date.now();
    const result = await context.completion({
      messages: [
        { role: "system", content: "Answer briefly and plainly." },
        {
          role: "user",
          content: "Reply with one sentence about green plants.",
        },
      ],
      n_predict: enablesThinking(model) ? 96 : 32,
      stop: STOP_WORDS,
      temperature: 0,
      enable_thinking: enablesThinking(model),
    });
    const durationMs = Date.now() - generationStartedAt;
    const tokensPerSecond =
      result.timings.predicted_per_second ||
      (result.tokens_predicted / Math.max(1, durationMs)) * 1000;
    const status =
      loadMs <= model.benchmark.maximumLoadMs &&
      tokensPerSecond >= (model.benchmark.minimumTokensPerSecond ?? 0)
        ? "viable"
        : "below-target";
    const benchmark: LocalModelBenchmarkResult = {
      modelId,
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: new Date().toISOString(),
      status,
      loadMs,
      durationMs,
      tokensPerSecond,
      device,
    };
    await saveLocalModelBenchmarkResult(benchmark);
    return benchmark;
  } catch (error) {
    const benchmark: LocalModelBenchmarkResult = {
      modelId,
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: new Date().toISOString(),
      status: "failed",
      loadMs,
      durationMs: Date.now() - startedAt,
      detail: error instanceof Error ? error.message : String(error),
      device,
    };
    await saveLocalModelBenchmarkResult(benchmark);
    return benchmark;
  } finally {
    await releaseLocalLlmResources().catch(() => undefined);
  }
}

export async function releaseLocalLlmResources() {
  const task = contextTask.then(destroyActiveContext);
  contextTask = task.then(
    () => undefined,
    () => undefined,
  );
  await task;
}
