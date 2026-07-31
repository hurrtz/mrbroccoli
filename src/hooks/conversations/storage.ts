import AsyncStorage from "@react-native-async-storage/async-storage";
import { Conversation, ConversationMeta } from "../../types";
import { reportPersistenceAlert } from "../../services/persistenceAlerts";
import { recordDebugLogEvent } from "../../services/debugLogCapture";
import {
  buildConversationMetaFromConversation,
  normalizeConversationMeta,
  sortConversationMeta,
} from "./meta";

export const META_KEY = "@mrbroccoli/conversations";
export const ACTIVE_CONVERSATION_KEY = "@mrbroccoli/active_conversation";

const mutationQueues = new Map<string, Promise<void>>();

function reportStorageFailure(key: string, operation: string, error: unknown) {
  const storageScope = key === META_KEY
    ? "metadata"
    : key === ACTIVE_CONVERSATION_KEY
      ? "active-conversation"
      : "conversation";
  recordDebugLogEvent({
    event: "persistence-operation-failed",
    level: "warn",
    payload: {
      domain: "conversations",
      error,
      operation,
      storageScope,
    },
  });
  console.error(`[conversation-storage] ${operation} failed for ${key}`, error);
  reportPersistenceAlert("conversations", operation);
}

function enqueueMutation(
  key: string,
  operationName: string,
  operation: () => Promise<void>,
) {
  const previous = mutationQueues.get(key) ?? Promise.resolve();
  const queued = previous
    .catch(() => undefined)
    .then(operation)
    .catch((error) => {
      reportStorageFailure(key, operationName, error);
    });

  mutationQueues.set(key, queued);
  void queued.then(() => {
    if (mutationQueues.get(key) === queued) {
      mutationQueues.delete(key);
    }
  });

  return queued;
}

async function awaitPendingMutation(key: string) {
  await mutationQueues.get(key);
}

export function conversationKey(id: string) {
  return `@mrbroccoli/conversation/${id}`;
}

export async function readConversation(id: string) {
  const key = conversationKey(id);
  try {
    await awaitPendingMutation(key);
    const raw = await AsyncStorage.getItem(key);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as Conversation;
  } catch (error) {
    reportStorageFailure(key, "read", error);
    return null;
  }
}

export async function readStoredConversationMetas() {
  try {
    await awaitPendingMutation(META_KEY);
    const raw = await AsyncStorage.getItem(META_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as ConversationMeta[];
  } catch (error) {
    reportStorageFailure(META_KEY, "read", error);
    return [];
  }
}

export async function readActiveConversationId() {
  try {
    await awaitPendingMutation(ACTIVE_CONVERSATION_KEY);
    const storedId = await AsyncStorage.getItem(ACTIVE_CONVERSATION_KEY);
    return storedId?.trim() || null;
  } catch (error) {
    reportStorageFailure(ACTIVE_CONVERSATION_KEY, "read active conversation", error);
    return null;
  }
}

export function saveConversation(conversation: Conversation) {
  const key = conversationKey(conversation.id);
  const serialized = JSON.stringify(conversation);
  return enqueueMutation(key, "save", () => AsyncStorage.setItem(key, serialized));
}

export function removeConversation(id: string) {
  const key = conversationKey(id);
  return enqueueMutation(key, "remove", () => AsyncStorage.removeItem(key));
}

export function persistActiveConversationId(id: string | null) {
  return enqueueMutation(ACTIVE_CONVERSATION_KEY, "save active conversation", () =>
    id
      ? AsyncStorage.setItem(ACTIVE_CONVERSATION_KEY, id)
      : AsyncStorage.removeItem(ACTIVE_CONVERSATION_KEY),
  );
}

export function persistConversationMeta(metas: ConversationMeta[]) {
  const sortedMetas = sortConversationMeta(
    metas.map(normalizeConversationMeta),
  );
  const serialized = JSON.stringify(sortedMetas);
  void enqueueMutation(META_KEY, "save metadata", () =>
    AsyncStorage.setItem(META_KEY, serialized),
  );
  return sortedMetas;
}

export async function hydrateConversationMeta(meta: ConversationMeta) {
  const conversation = await readConversation(meta.id);

  if (!conversation) {
    return meta;
  }

  return buildConversationMetaFromConversation(conversation, meta);
}
