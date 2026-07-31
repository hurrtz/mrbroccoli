import {
  buildProviderHttpError,
  normalizeProviderTransportError,
} from "../../providerErrors";
import { AppLanguage, Provider } from "../../../types";

import { ChatMessage, requireProviderKey } from "../shared";

export function buildOpenAiRealtimeUrl(model: string) {
  return `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`;
}

function buildRealtimePrompt(messages: ChatMessage[]) {
  return messages
    .map((message) =>
      message.role === "user"
        ? `User: ${message.content}`
        : `Assistant: ${message.content}`,
    )
    .join("\n\n");
}

function getWebSocketConstructor() {
  const WebSocketCtor = (globalThis as any).WebSocket;

  if (!WebSocketCtor) {
    throw new Error("WebSocket is not available in this runtime.");
  }

  return WebSocketCtor as any;
}

function extractRealtimeDelta(payload: any) {
  if (typeof payload?.delta === "string") {
    return payload.delta;
  }

  if (typeof payload?.text === "string") {
    return payload.text;
  }

  if (typeof payload?.response?.output_text === "string") {
    return payload.response.output_text;
  }

  return "";
}

export async function requestRealtimeChatViaWebSocket(params: {
  provider: Provider;
  model: string;
  language: AppLanguage;
  systemPrompt: string;
  messages: ChatMessage[];
  url: string;
  headers: Record<string, string>;
  onChunk?: (text: string) => void;
  abortSignal?: AbortSignal;
}) {
  const prompt = buildRealtimePrompt(params.messages);
  const WebSocketCtor = getWebSocketConstructor();

  return new Promise<string>((resolve, reject) => {
    let socket: any;
    let settled = false;
    let completed = false;
    let fullText = "";

    const cleanup = () => {
      params.abortSignal?.removeEventListener("abort", handleAbort);
    };

    const finish = (text: string) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve(text);
    };

    const fail = (error: unknown) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      reject(
        normalizeProviderTransportError({
          provider: params.provider,
          language: params.language,
          error,
          action: "reply",
        }),
      );
    };

    const closeSocket = () => {
      if (!socket) {
        return;
      }

      try {
        socket.close();
      } catch {
        // Ignore close failures during teardown.
      }
    };

    const finishAndClose = (text: string) => {
      finish(text);
      closeSocket();
    };

    const failAndClose = (error: unknown) => {
      fail(error);
      closeSocket();
    };

    const handleAbort = () => {
      failAndClose(new Error("The request was aborted."));
    };

    try {
      socket = new WebSocketCtor(params.url, undefined, {
        headers: params.headers,
      });
    } catch (error) {
      fail(error);
      return;
    }

    params.abortSignal?.addEventListener("abort", handleAbort);

    socket.onopen = () => {
      try {
        socket.send(
          JSON.stringify({
            type: "conversation.item.create",
            item: {
              type: "message",
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: prompt,
                },
              ],
            },
          }),
        );
        socket.send(
          JSON.stringify({
            type: "response.create",
            response: {
              output_modalities: ["text"],
              instructions: params.systemPrompt,
            },
          }),
        );
      } catch (error) {
        failAndClose(error);
      }
    };

    socket.onmessage = (event: { data?: string }) => {
      if (settled || typeof event?.data !== "string") {
        return;
      }

      let payload: any;

      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }

      if (payload?.type === "error") {
        failAndClose(
          buildProviderHttpError({
            provider: params.provider,
            language: params.language,
            status: 400,
            errorText:
              typeof payload?.error?.message === "string"
                ? payload.error.message
                : event.data,
            action: "reply",
          }),
        );
        return;
      }

      if (
        payload?.type === "response.text.delta" ||
        payload?.type === "response.output_text.delta"
      ) {
        const delta = extractRealtimeDelta(payload);

        if (!delta) {
          return;
        }

        fullText += delta;
        params.onChunk?.(delta);
        return;
      }

      if (
        payload?.type === "response.text.done" ||
        payload?.type === "response.output_text.done"
      ) {
        const delta = extractRealtimeDelta(payload);

        if (delta && !fullText.includes(delta)) {
          fullText += delta;
          params.onChunk?.(delta);
        }
      }

      if (payload?.type === "response.done") {
        completed = true;
        finishAndClose(fullText.trim());
      }
    };

    socket.onerror = (event: { message?: string }) => {
      failAndClose(new Error(event?.message || "Realtime socket error."));
    };

    socket.onclose = (event: { code?: number; reason?: string }) => {
      if (settled) {
        return;
      }

      if (completed) {
        finish(fullText.trim());
        return;
      }

      fail(
        new Error(
          `Realtime socket closed before completion (${event?.code ?? 1000}${event?.reason ? `: ${event.reason}` : ""}).`,
        ),
      );
    };
  });
}

export async function requestOpenAiRealtimeChat(params: {
  provider: Provider;
  model: string;
  messages: ChatMessage[];
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  abortSignal?: AbortSignal;
}) {
  return requestRealtimeChatViaWebSocket({
    provider: params.provider,
    model: params.model,
    language: params.language,
    systemPrompt: params.systemPrompt,
    messages: params.messages,
    url: buildOpenAiRealtimeUrl(params.model),
    headers: {
      Authorization: `Bearer ${requireProviderKey(
        params.provider,
        params.apiKey,
        params.language,
      )}`,
    },
    abortSignal: params.abortSignal,
  });
}

export async function requestOpenAiRealtimeChatStream(params: {
  provider: Provider;
  model: string;
  messages: ChatMessage[];
  apiKey: string;
  language: AppLanguage;
  systemPrompt: string;
  onChunk: (text: string) => void;
  abortSignal?: AbortSignal;
}) {
  return requestRealtimeChatViaWebSocket({
    provider: params.provider,
    model: params.model,
    language: params.language,
    systemPrompt: params.systemPrompt,
    messages: params.messages,
    url: buildOpenAiRealtimeUrl(params.model),
    headers: {
      Authorization: `Bearer ${requireProviderKey(
        params.provider,
        params.apiKey,
        params.language,
      )}`,
    },
    onChunk: params.onChunk,
    abortSignal: params.abortSignal,
  });
}
