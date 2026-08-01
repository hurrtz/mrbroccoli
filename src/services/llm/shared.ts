import { PROVIDER_LABELS } from "../../constants/models";
import { RUNTIME_PROVIDER_MANIFEST } from "../../constants/providers/runtimeManifest";
import { translate } from "../../i18n";
import {
  AppLanguage,
  MessageImageAttachment,
  MessageMetadata,
  Provider,
} from "../../types";
import type { PreparedMessageImageAttachment } from "../imageAttachmentFiles";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  model?: string | null;
  provider?: Provider | null;
  metadata?: MessageMetadata;
  attachments?: (
    | MessageImageAttachment
    | PreparedMessageImageAttachment
  )[];
}

function requirePreparedImages(message: ChatMessage) {
  return (message.attachments ?? []).map((attachment) => {
    if (!("data" in attachment) || !attachment.data) {
      throw new Error("An attached image could not be read.");
    }

    return attachment;
  });
}

type OpenAiCompatibleLlmConfig = {
  transport: "openai-compatible";
  endpoint: string;
};

type OpenAiRealtimeLlmConfig = {
  transport: "openai-realtime";
};

type GeminiGenerateContentLlmConfig = {
  transport: "gemini-generate-content";
  endpoint: string;
};

type AnthropicLlmConfig = {
  transport: "anthropic";
};

export type ProviderLlmConfig =
  | OpenAiCompatibleLlmConfig
  | OpenAiRealtimeLlmConfig
  | GeminiGenerateContentLlmConfig
  | AnthropicLlmConfig;

export function getProviderLlmConfig(
  provider: Provider,
  model: string,
): ProviderLlmConfig | null {
  const manifest = RUNTIME_PROVIDER_MANIFEST[provider];

  if (!manifest || manifest.llm.support !== "provider") {
    return null;
  }

  const isRealtimeModel =
    manifest.llm.realtimeModelIds?.includes(model) ?? false;
  const realtimeTransport = manifest.llm.realtimeTransport;

  if (isRealtimeModel && realtimeTransport === "openai-realtime") {
    return {
      transport: "openai-realtime",
    };
  }

  switch (manifest.llm.transport) {
    case "openai-compatible":
      if (!manifest.llm.endpoint) {
        return null;
      }

      return {
        transport: "openai-compatible",
        endpoint: manifest.llm.endpoint,
      };
    case "gemini-generate-content":
      if (!manifest.llm.endpoint) {
        return null;
      }

      return {
        transport: "gemini-generate-content",
        endpoint: manifest.llm.endpoint,
      };
    case "anthropic":
      return {
        transport: manifest.llm.transport,
      };
    default:
      return null;
  }
}

export function toAPIMessages(messages: ChatMessage[]) {
  return messages.map((message) => {
    const images = requirePreparedImages(message);

    return {
      role: message.role,
      content:
        message.role === "user" && images.length > 0
          ? [
              ...images.map((image) => ({
                type: "image" as const,
                source: {
                  type: "base64" as const,
                  media_type: image.mimeType,
                  data: image.data,
                },
              })),
              { type: "text" as const, text: message.content },
            ]
          : message.content,
    };
  });
}

export function toOpenAICompatibleMessages(
  provider: Provider,
  messages: ChatMessage[],
) {
  return messages.map((message) => {
    const images = requirePreparedImages(message);

    if (provider === "mistral" && message.role === "assistant") {
      return {
        role: message.role,
        content:
          message.metadata?.providerState?.mistralAssistantContent ??
          message.content,
      };
    }

    return {
      role: message.role,
      content:
        message.role === "user" && images.length > 0
          ? [
              { type: "text" as const, text: message.content },
              ...images.map((image) => ({
                type: "image_url" as const,
                image_url: {
                  url: `data:${image.mimeType};base64,${image.data}`,
                },
              })),
            ]
          : message.content,
    };
  });
}

export function requireProviderKey(
  provider: Provider,
  apiKey: string,
  language: AppLanguage,
) {
  if (!apiKey) {
    throw new Error(
      translate(language, "providerConfiguredInSettings", {
        provider: PROVIDER_LABELS[provider],
      }),
    );
  }

  return apiKey.split("|")[0].trim();
}
