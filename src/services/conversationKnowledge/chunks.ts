import type { Conversation } from "../../types";
import {
  createLocalKnowledgeEmbedding,
  LOCAL_KNOWLEDGE_EMBEDDING,
} from "./embedding";

const MAX_CHUNK_CHARACTERS = 1_600;
const CHUNK_FORMAT_VERSION = "conversation-message-history-v4";

export interface ConversationKnowledgeChunk {
  content: string;
  id: string;
  ordinal: number;
  vector: Uint8Array;
}

function splitLongText(text: string) {
  if (text.length <= MAX_CHUNK_CHARACTERS) {
    return [text];
  }

  const chunks: string[] = [];
  let remainder = text;

  while (remainder.length > MAX_CHUNK_CHARACTERS) {
    const candidate = remainder.slice(0, MAX_CHUNK_CHARACTERS);
    const boundary = Math.max(
      candidate.lastIndexOf("\n"),
      candidate.lastIndexOf(" "),
    );
    const splitAt =
      boundary > MAX_CHUNK_CHARACTERS / 2 ? boundary : MAX_CHUNK_CHARACTERS;
    chunks.push(remainder.slice(0, splitAt).trim());
    remainder = remainder.slice(splitAt).trim();
  }

  if (remainder) {
    chunks.push(remainder);
  }

  return chunks;
}

export function buildConversationKnowledgeChunks(
  conversation: Conversation,
): ConversationKnowledgeChunk[] {
  const messageHistory = conversation.messages.flatMap((message) => {
    const content = message.content.trim();
    if (!content) {
      return [];
    }

    const speaker = message.role === "user" ? "User" : "Assistant";
    return splitLongText(`${speaker}: ${content}`);
  });

  return messageHistory.map((content, ordinal) => ({
    content,
    id: `${conversation.id}:${ordinal}`,
    ordinal,
    vector: createLocalKnowledgeEmbedding(`${conversation.title}\n${content}`),
  }));
}

export function getConversationKnowledgeRevision(conversation: Conversation) {
  const source = [
    CHUNK_FORMAT_VERSION,
    LOCAL_KNOWLEDGE_EMBEDDING.id,
    conversation.title,
    conversation.updatedAt,
    conversation.messages.length,
    conversation.messages.at(-1)?.id ?? "",
    conversation.messages.at(-1)?.content.length ?? 0,
  ].join("|");
  let hash = 0x811c9dc5;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16);
}
