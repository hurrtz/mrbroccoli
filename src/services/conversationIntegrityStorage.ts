import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ConversationIntegrityRepairSnapshot } from "./conversationIntegrity";

const CONVERSATION_INTEGRITY_REPAIR_PREFIX =
  "@mrbroccoli/conversation-integrity-repair/";

function getSnapshotKey(conversationId: string) {
  return `${CONVERSATION_INTEGRITY_REPAIR_PREFIX}${conversationId}`;
}

function isRepairSnapshot(
  value: unknown,
): value is ConversationIntegrityRepairSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ConversationIntegrityRepairSnapshot>;
  return (
    typeof candidate.conversationId === "string" &&
    typeof candidate.repairedAt === "string" &&
    Array.isArray(candidate.messages) &&
    candidate.messages.every(
      (message) =>
        Boolean(message) &&
        typeof message.messageId === "string" &&
        typeof message.originalContent === "string" &&
        typeof message.repairedContent === "string",
    )
  );
}

export async function readConversationIntegrityRepairSnapshot(
  conversationId: string,
) {
  try {
    const raw = await AsyncStorage.getItem(getSnapshotKey(conversationId));
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isRepairSnapshot(parsed) && parsed.conversationId === conversationId
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function saveConversationIntegrityRepairSnapshot(
  snapshot: ConversationIntegrityRepairSnapshot,
) {
  return AsyncStorage.setItem(
    getSnapshotKey(snapshot.conversationId),
    JSON.stringify(snapshot),
  );
}

export function removeConversationIntegrityRepairSnapshot(
  conversationId: string,
) {
  return AsyncStorage.removeItem(getSnapshotKey(conversationId));
}
