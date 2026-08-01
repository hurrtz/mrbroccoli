import { networkFetch } from "../../networkFetch";
import {
  buildProviderHttpError,
  normalizeProviderTransportError,
} from "../../providerErrors";
import {
  AppLanguage,
  GeminiAssistantContentPart,
  Provider,
} from "../../../types";
import {
  getModelEffortTransportParam,
  getModelEffortTransportValue,
} from "../../../utils/modelEffort";
import { translate } from "../../../i18n";

import { readEventStream } from "../eventStream";
import { ChatMessage, requireProviderKey } from "../shared";

function buildGeminiModelPath(model: string) {
  const modelId = model.trim().replace(/^models\//, "");
  return `models/${encodeURIComponent(modelId)}`;
}

function buildGeminiGenerateContentUrl(params: {
  endpoint: string;
  model: string;
  stream?: boolean;
}) {
  const baseUrl = params.endpoint.replace(/\/$/, "");
  const method = params.stream
    ? "streamGenerateContent?alt=sse"
    : "generateContent";

  return `${baseUrl}/${buildGeminiModelPath(params.model)}:${method}`;
}

function toGeminiRole(role: ChatMessage["role"]) {
  return role === "assistant" ? "model" : "user";
}

export function toGeminiContents(messages: ChatMessage[]) {
  return messages.map((message) => {
    const preservedAssistantContent =
      message.role === "assistant" && message.provider === "gemini"
        ? message.metadata?.providerState?.geminiAssistantContent
        : undefined;

    const imageParts = (message.attachments ?? []).map((attachment) => {
      if (!("data" in attachment) || !attachment.data) {
        throw new Error("An attached image could not be read.");
      }

      return {
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data,
        },
      };
    });

    return {
      role: toGeminiRole(message.role),
      parts: preservedAssistantContent?.length
        ? preservedAssistantContent
        : message.role === "user" && imageParts.length > 0
          ? [...imageParts, { text: message.content }]
          : [{ text: message.content }],
    };
  });
}

function buildGeminiGenerateContentBody(params: {
  provider: Provider;
  model: string;
  modelEffort?: string;
  messages: ChatMessage[];
  systemPrompt: string;
}) {
  const body = {
    systemInstruction: {
      parts: [{ text: params.systemPrompt }],
    },
    contents: toGeminiContents(params.messages),
  };
  const thinkingTransport = getModelEffortTransportParam(
    params.provider,
    params.model,
  );
  const thinkingValue = getModelEffortTransportValue(
    params.provider,
    params.model,
    params.modelEffort,
  );
  const thinkingConfig =
    thinkingTransport === "gemini-thinking-level" && thinkingValue
      ? { thinkingLevel: thinkingValue }
      : thinkingTransport === "gemini-thinking-budget" && thinkingValue
        ? { thinkingBudget: Number(thinkingValue) }
        : undefined;

  return thinkingConfig
    ? {
        ...body,
        generationConfig: {
          thinkingConfig,
        },
      }
    : body;
}

function extractGeminiGenerateContentParts(
  payload: unknown,
): GeminiAssistantContentPart[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidates = (payload as { candidates?: unknown }).candidates;

  if (!Array.isArray(candidates)) {
    return [];
  }

  const firstCandidate = candidates[0];

  if (!firstCandidate || typeof firstCandidate !== "object") {
    return [];
  }

  const content = (firstCandidate as { content?: unknown }).content;

  if (!content || typeof content !== "object") {
    return [];
  }

  const parts = (content as { parts?: unknown }).parts;

  if (!Array.isArray(parts)) {
    return [];
  }

  return parts.flatMap((part) => {
    if (!part || typeof part !== "object") {
      return [];
    }

    const raw = part as {
      text?: unknown;
      thought?: unknown;
      thoughtSignature?: unknown;
    };
    const normalized: GeminiAssistantContentPart = {
      ...(typeof raw.text === "string" ? { text: raw.text } : {}),
      ...(typeof raw.thought === "boolean" ? { thought: raw.thought } : {}),
      ...(typeof raw.thoughtSignature === "string"
        ? { thoughtSignature: raw.thoughtSignature }
        : {}),
    };

    return Object.keys(normalized).length > 0 ? [normalized] : [];
  });
}

function getVisibleGeminiText(parts: GeminiAssistantContentPart[]) {
  return parts
    .filter((part) => part.thought !== true)
    .map((part) => part.text ?? "")
    .join("");
}

function extractGeminiGenerateContentText(payload: unknown): string {
  return getVisibleGeminiText(extractGeminiGenerateContentParts(payload));
}

function getGeminiFinishReason(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidates = (payload as { candidates?: unknown }).candidates;
  const candidate = Array.isArray(candidates) ? candidates[0] : null;
  const finishReason =
    candidate && typeof candidate === "object"
      ? (candidate as { finishReason?: unknown }).finishReason
      : null;

  return typeof finishReason === "string" ? finishReason : null;
}

function buildIncompleteGeminiReplyError(language: AppLanguage) {
  return new Error(
    translate(language, "providerIncompleteReplyError", {
      provider: "Google",
    }),
  );
}

export async function requestGeminiGenerateContentChat(params: {
  endpoint: string;
  provider: Provider;
  model: string;
  modelEffort?: string;
  messages: ChatMessage[];
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  abortSignal?: AbortSignal;
}) {
  let response: Awaited<ReturnType<typeof networkFetch>>;

  try {
    response = await networkFetch(
      buildGeminiGenerateContentUrl({
        endpoint: params.endpoint,
        model: params.model,
      }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": requireProviderKey(
            params.provider,
            params.apiKey,
            params.language,
          ),
        },
        body: JSON.stringify(
          buildGeminiGenerateContentBody({
            provider: params.provider,
            model: params.model,
            modelEffort: params.modelEffort,
            messages: params.messages,
            systemPrompt: params.systemPrompt,
          }),
        ),
        signal: params.abortSignal,
      },
    );
  } catch (error) {
    throw normalizeProviderTransportError({
      provider: params.provider,
      language: params.language,
      error,
      action: "reply",
    });
  }

  if (!response.ok) {
    const errText = await response.text();
    throw buildProviderHttpError({
      provider: params.provider,
      language: params.language,
      status: response.status,
      errorText: errText,
      action: "reply",
    });
  }

  return extractGeminiGenerateContentText(await response.json());
}

export async function requestGeminiGenerateContentChatStream(params: {
  endpoint: string;
  provider: Provider;
  model: string;
  modelEffort?: string;
  messages: ChatMessage[];
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  onChunk: (text: string) => void;
  onAssistantContent?: (parts: GeminiAssistantContentPart[]) => void;
  abortSignal?: AbortSignal;
}) {
  let response: Awaited<ReturnType<typeof networkFetch>>;

  try {
    response = await networkFetch(
      buildGeminiGenerateContentUrl({
        endpoint: params.endpoint,
        model: params.model,
        stream: true,
      }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": requireProviderKey(
            params.provider,
            params.apiKey,
            params.language,
          ),
        },
        body: JSON.stringify(
          buildGeminiGenerateContentBody({
            provider: params.provider,
            model: params.model,
            modelEffort: params.modelEffort,
            messages: params.messages,
            systemPrompt: params.systemPrompt,
          }),
        ),
        signal: params.abortSignal,
      },
    );
  } catch (error) {
    throw normalizeProviderTransportError({
      provider: params.provider,
      language: params.language,
      error,
      action: "reply",
    });
  }

  if (!response.ok) {
    const errText = await response.text();
    throw buildProviderHttpError({
      provider: params.provider,
      language: params.language,
      status: response.status,
      errorText: errText,
      action: "reply",
    });
  }

  if (!response.body) {
    const fullText = await requestGeminiGenerateContentChat(params);

    if (fullText) {
      params.onChunk(fullText);
    }

    return fullText;
  }

  let fullText = "";
  const assistantContent: GeminiAssistantContentPart[] = [];
  let finishReason: string | null = null;

  await readEventStream(response.body, async ({ data }) => {
    if (!data || data === "[DONE]") {
      return;
    }

    const payload = JSON.parse(data);
    finishReason = getGeminiFinishReason(payload) ?? finishReason;
    const chunkParts = extractGeminiGenerateContentParts(payload);
    assistantContent.push(...chunkParts);
    const chunkText = getVisibleGeminiText(chunkParts);

    if (!chunkText) {
      return;
    }

    fullText += chunkText;
    params.onChunk(chunkText);
  });

  if (finishReason !== "STOP") {
    throw buildIncompleteGeminiReplyError(params.language);
  }

  if (assistantContent.length > 0) {
    params.onAssistantContent?.(assistantContent);
  }

  return fullText;
}
