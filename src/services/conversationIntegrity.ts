import type { Conversation, Message } from "../types";
import { locateSerializedInternalContextLeak } from "./llm/contextLeakGuard";

export type ConversationIntegrityFindingKind = "assistant-internal-context";

export interface ConversationIntegrityFinding {
  kind: ConversationIntegrityFindingKind;
  markerIds: string[];
  messageId: string;
  originalContent: string;
  removedContent: string;
  suggestedContent: string | null;
}

export interface ConversationIntegrityReport {
  automaticallyRepairableCount: number;
  conversationId: string;
  findings: ConversationIntegrityFinding[];
}

export interface ConversationIntegrityRepairSnapshotMessage {
  messageId: string;
  originalContent: string;
  repairedContent: string;
}

export interface ConversationIntegrityRepairSnapshot {
  conversationId: string;
  repairedAt: string;
  messages: ConversationIntegrityRepairSnapshotMessage[];
}

export interface ConversationIntegrityRepairApplication {
  conversation: Conversation;
  repairedMessageIds: string[];
  snapshot: ConversationIntegrityRepairSnapshot | null;
}

function inspectAssistantMessage(
  message: Message,
): ConversationIntegrityFinding | null {
  if (message.role !== "assistant") {
    return null;
  }

  const location = locateSerializedInternalContextLeak(message.content);
  if (!location) {
    return null;
  }

  const safePrefix = message.content.slice(0, location.start).trimEnd();
  return {
    kind: "assistant-internal-context",
    markerIds: location.markerIds,
    messageId: message.id,
    originalContent: message.content,
    removedContent: message.content.slice(location.start).trimStart(),
    suggestedContent: safePrefix || null,
  };
}

export function scanConversationIntegrity(
  conversation: Conversation,
): ConversationIntegrityReport {
  const findings = conversation.messages.flatMap((message) => {
    const finding = inspectAssistantMessage(message);
    return finding ? [finding] : [];
  });

  return {
    automaticallyRepairableCount: findings.filter(
      ({ suggestedContent }) => suggestedContent !== null,
    ).length,
    conversationId: conversation.id,
    findings,
  };
}

export function applyConversationIntegrityRepairs(
  conversation: Conversation,
  repairedAt = new Date().toISOString(),
): ConversationIntegrityRepairApplication {
  const report = scanConversationIntegrity(conversation);
  const repairsByMessageId = new Map(
    report.findings.flatMap((finding) =>
      finding.suggestedContent
        ? [[finding.messageId, finding.suggestedContent] as const]
        : [],
    ),
  );

  if (repairsByMessageId.size === 0) {
    return {
      conversation,
      repairedMessageIds: [],
      snapshot: null,
    };
  }

  const snapshotMessages: ConversationIntegrityRepairSnapshotMessage[] = [];
  const messages = conversation.messages.map((message) => {
    const repairedContent = repairsByMessageId.get(message.id);
    if (!repairedContent) {
      return message;
    }

    snapshotMessages.push({
      messageId: message.id,
      originalContent: message.content,
      repairedContent,
    });
    return { ...message, content: repairedContent };
  });

  return {
    conversation: { ...conversation, messages, updatedAt: repairedAt },
    repairedMessageIds: snapshotMessages.map(({ messageId }) => messageId),
    snapshot: {
      conversationId: conversation.id,
      repairedAt,
      messages: snapshotMessages,
    },
  };
}

export function undoConversationIntegrityRepairs(
  conversation: Conversation,
  snapshot: ConversationIntegrityRepairSnapshot,
  restoredAt = new Date().toISOString(),
): ConversationIntegrityRepairApplication | null {
  if (snapshot.conversationId !== conversation.id) {
    return null;
  }

  const snapshotByMessageId = new Map(
    snapshot.messages.map((message) => [message.messageId, message] as const),
  );
  const currentMessagesById = new Map(
    conversation.messages.map((message) => [message.id, message] as const),
  );
  const canRestore = snapshot.messages.every((snapshotMessage) => {
    const currentMessage = currentMessagesById.get(snapshotMessage.messageId);
    return currentMessage?.content === snapshotMessage.repairedContent;
  });

  if (!canRestore) {
    return null;
  }

  return {
    conversation: {
      ...conversation,
      updatedAt: restoredAt,
      messages: conversation.messages.map((message) => {
        const snapshotMessage = snapshotByMessageId.get(message.id);
        return snapshotMessage
          ? { ...message, content: snapshotMessage.originalContent }
          : message;
      }),
    },
    repairedMessageIds: snapshot.messages.map(({ messageId }) => messageId),
    snapshot,
  };
}
