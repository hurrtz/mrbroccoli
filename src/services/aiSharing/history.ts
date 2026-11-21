import AsyncStorage from "@react-native-async-storage/async-storage";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";

import { isRuntimeProviderId } from "../../constants/providers/runtimeState";
import { getOpenRouterHosts } from "../../constants/providers/openRouterHosts";
import type { Conversation, Message, Provider } from "../../types";
import {
  getPolicy,
  hasAiSharingPermission,
  hydrateAiSharing,
  publishAiSharing,
} from "./policy";
import { requestAiSharing } from "./requests";

type Models = string | readonly string[];
type Receipts = Record<string, string[]>;
function recipientIds(
  providers: readonly Provider[],
  models?: Models,
): string[] {
  const hosts = getOpenRouterHosts(models);
  if (providers.includes("openrouter") && !hosts.length) return [];
  return providers.flatMap((provider) =>
    provider === "openrouter"
      ? hosts.map((host) => "openrouter@" + host.slugs[0])
      : [provider],
  );
}
const ledgers = new Map<string, Receipts>();
const loading = new Map<string, Promise<void>>();
const writing = new Map<string, Promise<void>>();
const removed = new Map<string, number>();

function digest(value: string) {
  return bytesToHex(sha256(utf8ToBytes(value)));
}
function storageKey(id: string) {
  return (
    "@mrbroccoli/ai-sharing/history/" +
    digest(getPolicy().installation + "/" + id)
  );
}
function fingerprint(message: Message) {
  return digest(
    JSON.stringify([
      getPolicy().installation,
      message.id,
      message.role,
      message.content,
      message.provider,
      message.model,
    ]),
  );
}
export function aiSharingTextMessage(message: Message): Message {
  const { id, role, content, model, provider, timestamp } = message;
  return { id, role, content, model, provider, timestamp };
}

async function readLedger(id: string) {
  const raw = await AsyncStorage.getItem(storageKey(id));
  let receipts: Receipts = {};
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        receipts = Object.fromEntries(
          Object.entries(parsed).filter(
            ([hash, providers]) =>
              /^[0-9a-f]{64}$/.test(hash) &&
              Array.isArray(providers) &&
              providers.every(
                (provider) =>
                  isRuntimeProviderId(provider) ||
                  (typeof provider === "string" &&
                    /^openrouter@[a-z0-9-]+$/.test(provider)),
              ),
          ),
        );
      }
    } catch {
      /* Damaged provenance grants no access to earlier text. */
    }
  }
  ledgers.set(id, receipts);
  publishAiSharing();
}

export async function loadAiSharingHistory(id: string): Promise<void> {
  await hydrateAiSharing();
  if (ledgers.has(id)) return;
  let read = loading.get(id);
  if (!read) {
    read = readLedger(id).finally(() => {
      loading.delete(id);
    });
    loading.set(id, read);
  }
  return read;
}

function seenBy(
  message: Message,
  receipts: Receipts,
  recipients: readonly string[],
) {
  const seen = receipts[fingerprint(message)];
  return (
    recipients.length > 0 &&
    recipients.every((provider) => seen?.includes(provider))
  );
}

export function getAiSharingHistory(
  id: string,
  messages: readonly Message[],
  recipients: readonly Provider[],
  models?: Models,
): Message[] {
  const receipts = ledgers.get(id);
  if (
    !receipts ||
    !recipients.every((provider) =>
      hasAiSharingPermission(provider, "history", models),
    )
  )
    return [];
  const ids = recipientIds(recipients, models);
  return messages
    .filter((message) => seenBy(message, receipts, ids))
    .map(aiSharingTextMessage);
}

/** Manual titles can use a first prompt already disclosed to this same recipient. */
export function getAiSharingFirstPrompt(
  id: string,
  messages: readonly Message[],
  provider: Provider,
  model?: string,
) {
  const first = messages.find(
    (message) => message.role === "user" && message.content.trim(),
  );
  const receipts = ledgers.get(id);
  return first &&
    receipts &&
    seenBy(first, receipts, recipientIds([provider], model))
    ? aiSharingTextMessage(first)
    : undefined;
}

export function hasUnsharedAiHistory(
  id: string,
  messages: readonly Message[],
  provider: Provider,
  models?: Models,
) {
  const receipts = ledgers.get(id) ?? {};
  const ids = recipientIds([provider], models);
  return messages.some(
    (message) => message.content.trim() && !seenBy(message, receipts, ids),
  );
}

function serialize(id: string, operation: () => Promise<void>) {
  const pending = (writing.get(id) ?? Promise.resolve()).then(operation);
  const tail = pending.catch(() => {});
  writing.set(id, tail);
  void tail.then(() => {
    if (writing.get(id) === tail) writing.delete(id);
  });
  return pending;
}

async function addReceipts(
  id: string,
  additions: readonly { message: Message; recipients: readonly string[] }[],
) {
  if (!additions.length) return;
  const generation = removed.get(id);
  await loadAiSharingHistory(id);
  return serialize(id, async () => {
    if (generation !== removed.get(id)) return;
    const receipts = { ...ledgers.get(id) };
    let changed = false;
    for (const { message, recipients } of additions) {
      const key = fingerprint(message);
      const previous = receipts[key] ?? [];
      const next = [...new Set([...previous, ...recipients])];
      if (next.length !== previous.length) {
        receipts[key] = next;
        changed = true;
      }
    }
    if (!changed) return;
    await AsyncStorage.setItem(storageKey(id), JSON.stringify(receipts));
    ledgers.set(id, receipts);
    publishAiSharing();
  });
}

export async function recordAiSharingMessages(
  id: string,
  messages: readonly Message[],
  recipients: readonly Provider[],
  models?: Models,
) {
  const ids = recipientIds(recipients, models);
  if (!ids.length) return;
  return addReceipts(
    id,
    messages.map((message) => ({ message, recipients: ids })),
  );
}

function canInheritReceipt(recipient: string) {
  if (isRuntimeProviderId(recipient)) {
    return (
      recipient !== "openrouter" && hasAiSharingPermission(recipient, "history")
    );
  }
  const host = recipient.match(/^openrouter@([a-z0-9-]+)$/)?.[1];
  return Boolean(
    host &&
      hasAiSharingPermission("openrouter", "history") &&
      getPolicy().hostGrants.includes(host + "/history"),
  );
}

/** A local branch changes IDs while retaining the same ordered prefix of text. */
export async function inheritAiSharingHistory(
  source: Pick<Conversation, "id" | "messages">,
  cloned: Pick<Conversation, "id" | "messages" | "branch">,
) {
  const origin = cloned.branch;
  const checkpoint = cloned.messages.length - 1;
  if (
    !origin ||
    source.id === cloned.id ||
    origin.parentConversationId !== source.id ||
    checkpoint < 0 ||
    source.messages[checkpoint]?.id !== origin.parentMessageId ||
    cloned.messages[checkpoint].id !== origin.branchMessageId
  )
    return;

  await loadAiSharingHistory(source.id);
  await writing.get(source.id);
  const receipts = ledgers.get(source.id) ?? {};
  const additions = cloned.messages.flatMap((message, index) => {
    const original = source.messages[index];
    if (
      original.role !== message.role ||
      original.content !== message.content ||
      original.model !== message.model ||
      original.provider !== message.provider
    )
      return [];
    const recipients =
      receipts[fingerprint(original)]?.filter(canInheritReceipt) ?? [];
    return recipients.length ? [{ message, recipients }] : [];
  });
  await addReceipts(cloned.id, additions);
}

export async function shareAiSharingHistory(
  id: string,
  messages: readonly Message[],
  provider: Provider,
  models?: Models,
) {
  const authorization = await requestAiSharing({
    required: [{ provider, purpose: "history" }],
    shareEarlier: true,
    openRouterModels:
      provider === "openrouter" && typeof models === "string"
        ? [models]
        : provider === "openrouter" && Array.isArray(models)
          ? models
          : undefined,
  });
  if (!authorization?.allows(provider, "history")) return false;
  await recordAiSharingMessages(id, messages, [provider], models);
  return authorization.allows(provider, "history");
}

export async function forgetAiSharingHistory(id: string) {
  removed.set(id, (removed.get(id) ?? 0) + 1);
  ledgers.set(id, {});
  publishAiSharing();
  await hydrateAiSharing();
  await serialize(id, async () => {
    // An older read or write may have completed after the initial eviction.
    await loading.get(id)?.catch(() => {});
    ledgers.set(id, {});
    publishAiSharing();
    await AsyncStorage.removeItem(storageKey(id));
    ledgers.delete(id);
  });
}
