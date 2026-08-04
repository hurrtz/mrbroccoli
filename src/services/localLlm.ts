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
import { recordDebugLogEvent } from "./debugLogCapture";
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
let idleReleaseTimer: ReturnType<typeof setTimeout> | null = null;

export const LOCAL_LLM_IDLE_RELEASE_MS = 30_000;

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

const LOCAL_TARGET_LANGUAGE_INSTRUCTIONS: Partial<Record<AppLanguage, string>> =
  {
    en: "Answer exclusively in English. Start directly with the answer without repeating the topic or request as a heading. Do not add a title or introductory label. Only use another language when the user explicitly asks for a translation or a reply in that language. Keep private reasoning internal and return only the final answer.",
    de: "Antworte ausschließlich auf Deutsch. Beginne direkt mit der Antwort, ohne das Thema oder die Anfrage als Überschrift zu wiederholen. Verwende keine englischen Überschriften oder Einleitungen. Wechsle nur dann in eine andere Sprache, wenn die Person ausdrücklich um eine Übersetzung oder eine Antwort in dieser Sprache bittet. Behalte interne Überlegungen für dich und gib nur die endgültige Antwort aus.",
    es: "Responde exclusivamente en español. Empieza directamente con la respuesta, sin repetir el tema ni la petición como título. No añadas títulos ni introducciones en inglés. Usa otro idioma solo si la persona pide expresamente una traducción o una respuesta en ese idioma. Mantén privado el razonamiento interno y devuelve únicamente la respuesta final.",
    fr: "Réponds exclusivement en français. Commence directement par la réponse, sans répéter le sujet ni la demande sous forme de titre. N’ajoute aucun titre ni préambule en anglais. N’utilise une autre langue que si la personne demande explicitement une traduction ou une réponse dans cette langue. Garde le raisonnement interne privé et ne fournis que la réponse finale.",
    it: "Rispondi esclusivamente in italiano. Inizia direttamente con la risposta, senza ripetere l’argomento o la richiesta come titolo. Non aggiungere titoli o introduzioni in inglese. Usa un’altra lingua solo se la persona chiede esplicitamente una traduzione o una risposta in quella lingua. Mantieni privato il ragionamento interno e restituisci solo la risposta finale.",
    pt: "Responde exclusivamente em português europeu. Começa diretamente pela resposta, sem repetir o tema ou o pedido como título. Não acrescentes títulos nem introduções em inglês. Usa outra língua apenas se a pessoa pedir explicitamente uma tradução ou uma resposta nessa língua. Mantém o raciocínio interno privado e apresenta apenas a resposta final.",
    "pt-BR":
      "Responda exclusivamente em português brasileiro. Comece diretamente pela resposta, sem repetir o tema ou o pedido como título. Não acrescente títulos nem introduções em inglês. Use outro idioma apenas se a pessoa pedir explicitamente uma tradução ou uma resposta nesse idioma. Mantenha o raciocínio interno privado e apresente somente a resposta final.",
    ru: "Отвечай исключительно на русском языке. Начинай сразу с ответа, не повторяя тему или запрос в виде заголовка. Не добавляй заголовки или вступления на английском языке. Используй другой язык только по прямой просьбе о переводе или ответе на этом языке. Не раскрывай внутренние рассуждения и выдавай только окончательный ответ.",
  };

const LOCAL_LATEST_REQUEST_INSTRUCTIONS: Partial<Record<AppLanguage, string>> =
  {
    en: "Answer the final user message as the current task. Earlier turns are background context only. If the final message changes topic, follow the new topic completely and do not blend the earlier topic into the answer.",
    de: "Beantworte die letzte Nachricht der Person als aktuelle Aufgabe. Frühere Beiträge dienen nur als Hintergrund. Wenn die letzte Nachricht das Thema wechselt, folge vollständig dem neuen Thema und vermische es nicht mit dem früheren Thema.",
    es: "Responde al último mensaje de la persona como la tarea actual. Los turnos anteriores son solo contexto. Si el último mensaje cambia de tema, sigue por completo el tema nuevo y no lo mezcles con el anterior.",
    fr: "Réponds au dernier message de la personne comme à la tâche actuelle. Les échanges précédents ne sont qu’un contexte. Si le dernier message change de sujet, suis entièrement le nouveau sujet sans le mélanger avec l’ancien.",
    it: "Rispondi all’ultimo messaggio della persona come compito attuale. I turni precedenti sono solo contesto. Se l’ultimo messaggio cambia argomento, segui completamente il nuovo argomento senza mescolarlo con quello precedente.",
    pt: "Responde à última mensagem da pessoa como a tarefa atual. As mensagens anteriores servem apenas de contexto. Se a última mensagem mudar de tema, segue totalmente o novo tema sem o misturar com o anterior.",
    "pt-BR":
      "Responda à última mensagem da pessoa como a tarefa atual. As mensagens anteriores servem apenas de contexto. Se a última mensagem mudar de assunto, siga totalmente o novo assunto sem misturá-lo com o anterior.",
    ru: "Отвечай на последнее сообщение пользователя как на текущую задачу. Предыдущие сообщения служат только контекстом. Если последнее сообщение меняет тему, полностью следуй новой теме и не смешивай её с предыдущей.",
  };

function getLocalTargetLanguageInstruction(language: AppLanguage) {
  return (
    LOCAL_TARGET_LANGUAGE_INSTRUCTIONS[language] ??
    `Respond exclusively in the language identified by ${language}. Start directly with the answer, do not add a title, keep private reasoning internal, and return only the final answer.`
  );
}

function getLocalLatestRequestInstruction(language: AppLanguage) {
  return (
    LOCAL_LATEST_REQUEST_INSTRUCTIONS[language] ??
    "Answer the final user message as the current task. Earlier turns are background context only. If the final message changes topic, follow the new topic completely and do not blend the earlier topic into the answer."
  );
}

function stripLeadingMarkdownTitle(text: string, streaming: boolean) {
  const trimmed = text.trimStart();
  const atxTitle = trimmed.match(/^#{1,6}[^\S\r\n]+[^\r\n]+/u)?.[0];
  if (atxTitle) {
    const remainder = trimmed.slice(atxTitle.length);
    const lineBreak = remainder.match(/^[^\S\r\n]*(?:\r?\n)+/u)?.[0];
    if (lineBreak) {
      return remainder.slice(lineBreak.length).trimStart();
    }
    return streaming ? "" : text;
  }

  for (const marker of ["***", "___", "**", "__"] as const) {
    if (!trimmed.startsWith(marker)) {
      continue;
    }
    const closingIndex = trimmed.indexOf(marker, marker.length);
    if (closingIndex < 0) {
      return streaming ? "" : text;
    }
    const remainder = trimmed.slice(closingIndex + marker.length);
    const lineBreak = remainder.match(/^[^\S\r\n]*(?:\r?\n)+/u)?.[0];
    if (lineBreak) {
      return remainder.slice(lineBreak.length).trimStart();
    }
    if (!remainder) {
      return streaming ? "" : text;
    }
    return text;
  }

  return text;
}

export function sanitizeLocalResponseText(
  text: string,
  options: { streaming?: boolean } = {},
) {
  const withoutPrivateReasoning = text
    .replace(/<think\b[^>]*>[\s\S]*?<\/think\s*>/giu, " ")
    .replace(/<think\b[^>]*>[\s\S]*$/giu, " ")
    .replace(/<\/?think\b[^>]*>/giu, " ");
  return renderTextForSpeech(
    stripLeadingMarkdownTitle(
      withoutPrivateReasoning,
      options.streaming === true,
    ),
  );
}

function getLlamaModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Jest and unsupported builds import-safe
  return require("llama.rn") as typeof import("llama.rn");
}

function maxReplyTokens(
  responseLength: AssistantResponseLength,
  thinkingEnabled: boolean,
) {
  if (thinkingEnabled) {
    switch (responseLength) {
      case "brief":
        return 512;
      case "thorough":
        return 1_536;
      default:
        return 1_024;
    }
  }

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

function cancelIdleRelease() {
  if (!idleReleaseTimer) {
    return;
  }
  clearTimeout(idleReleaseTimer);
  idleReleaseTimer = null;
}

function scheduleIdleRelease() {
  cancelIdleRelease();
  if (!activeContext) {
    return;
  }
  const modelId = activeContext.modelId;
  idleReleaseTimer = setTimeout(() => {
    idleReleaseTimer = null;
    recordDebugLogEvent({
      event: "local-llm-idle-release-triggered",
      payload: { idleMs: LOCAL_LLM_IDLE_RELEASE_MS, modelId },
    });
    void releaseLocalLlmResources();
  }, LOCAL_LLM_IDLE_RELEASE_MS);
  recordDebugLogEvent({
    event: "local-llm-idle-release-scheduled",
    payload: { idleMs: LOCAL_LLM_IDLE_RELEASE_MS, modelId },
  });
}

async function destroyActiveContext() {
  cancelIdleRelease();
  const current = activeContext;
  activeContext = null;
  if (current) {
    await current.context.release().catch(() => undefined);
    recordDebugLogEvent({
      event: "local-llm-context-released",
      payload: { modelId: current.modelId },
    });
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
  cancelIdleRelease();
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
    recordDebugLogEvent({
      event: "local-llm-context-created",
      payload: { modelId: model.id },
    });
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
  const systemPrompt = [
    buildSystemPrompt({
      assistantInstructions: params.assistantInstructions,
      responseLength: params.responseLength,
      responseTone: params.responseTone,
      language: params.language,
      currentModel: model.name,
      conversationSummary: params.conversationSummary,
      pastConversationKnowledge: params.pastConversationKnowledge,
      spokenParagraphStreaming: params.spokenParagraphStreaming,
      webSearchContext: params.webSearchContext,
    }),
    getLocalLatestRequestInstruction(params.language),
    getLocalTargetLanguageInstruction(params.language),
  ].join("\n\n");
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
      const completionTokenLimit = maxReplyTokens(
        params.responseLength,
        thinkingEnabled,
      );
      let streamedVisibleText = "";
      const streamParsedContent = (content: string) => {
        const nextVisibleText = sanitizeLocalResponseText(content, {
          streaming: true,
        });
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
          n_predict: completionTokenLimit,
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
      const fullText = sanitizeLocalResponseText(result.content || result.text);
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
      return {
        fullText,
        usage,
        timings: result.timings,
        termination: {
          completionTokenLimit,
          contextFull: result.context_full === true,
          limitReached:
            Boolean(result.stopped_limit) ||
            result.tokens_predicted >= completionTokenLimit,
          stoppedEos: result.stopped_eos === true,
          stoppedWord: Boolean(result.stopped_word),
        },
      };
    } finally {
      params.abortSignal?.removeEventListener("abort", abort);
    }
  });
  completionTask = task.then(
    () => {
      scheduleIdleRelease();
    },
    () => {
      scheduleIdleRelease();
    },
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
