import { Conversation, ConversationMeta, Message, Provider } from "../../types";

export const MAX_CONVERSATION_TITLE_LENGTH = 160;
const LEGACY_CONVERSATION_TITLE_LENGTH_WITH_ELLIPSIS = 43;

export function truncateConversationTitle(
  text: string,
  max = MAX_CONVERSATION_TITLE_LENGTH,
): string {
  if (text.length <= max) {
    return text;
  }

  const truncated = text.slice(0, max);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export function restoreLegacyConversationTitle(
  conversation: Conversation,
): Conversation {
  const currentTitle = conversation.title.trim();
  if (
    !currentTitle.endsWith("...") ||
    currentTitle.length > LEGACY_CONVERSATION_TITLE_LENGTH_WITH_ELLIPSIS
  ) {
    return conversation;
  }

  const legacyPrefix = currentTitle.slice(0, -3);
  const firstUserMessage = conversation.messages
    .find((message) => message.role === "user" && message.content.trim())
    ?.content.trim();

  if (
    !firstUserMessage ||
    firstUserMessage.length <= currentTitle.length ||
    !firstUserMessage.startsWith(legacyPrefix)
  ) {
    return conversation;
  }

  return {
    ...conversation,
    title: truncateConversationTitle(firstUserMessage),
  };
}

export function restoreLegacyConversationBranch(
  conversation: Conversation,
  parent: Conversation | null,
): Conversation {
  if (conversation.branch || !parent) {
    return conversation;
  }

  const excludedIds = conversation.knowledgeExcludedConversationIds ?? [];
  const parentConversationId = excludedIds.at(-1);
  let checkpointIndex = -1;
  const comparableMessageCount = Math.min(
    conversation.messages.length,
    parent.messages.length,
  );
  for (let index = 0; index < comparableMessageCount; index += 1) {
    const branchCandidate = conversation.messages[index];
    const parentCandidate = parent.messages[index];
    if (
      branchCandidate.role !== parentCandidate.role ||
      branchCandidate.content !== parentCandidate.content ||
      branchCandidate.timestamp !== parentCandidate.timestamp
    ) {
      break;
    }
    checkpointIndex = index;
  }
  const branchMessage = conversation.messages[checkpointIndex];
  const parentMessage = parent.messages[checkpointIndex];

  if (
    parentConversationId !== parent.id ||
    checkpointIndex < 0 ||
    !branchMessage ||
    !parentMessage
  ) {
    return conversation;
  }

  return {
    ...conversation,
    branch: {
      rootConversationId: excludedIds[0] ?? parent.id,
      parentConversationId: parent.id,
      parentMessageId: parentMessage.id,
      branchMessageId: branchMessage.id,
      kind:
        branchMessage.role === "user" && branchMessage.editedAt
          ? "edited-prompt"
          : branchMessage.role === "user"
            ? "alternative-response"
            : "continue-from-message",
      createdAt: conversation.createdAt,
    },
  };
}

function inferConversationState(messages: Message[]) {
  let lastModel: string | null = null;
  let lastProvider: Provider | null = null;
  const providers: Provider[] = [];
  const seenProviders = new Set<Provider>();
  const providerModels: Partial<Record<Provider, string[]>> = {};
  const seenProviderModels = new Map<Provider, Set<string>>();

  for (const message of messages) {
    if (message.provider && !seenProviders.has(message.provider)) {
      seenProviders.add(message.provider);
      providers.push(message.provider);
    }

    if (message.provider && message.model) {
      const seenModels =
        seenProviderModels.get(message.provider) ?? new Set<string>();
      if (!seenModels.has(message.model)) {
        seenModels.add(message.model);
        seenProviderModels.set(message.provider, seenModels);
        providerModels[message.provider] = [
          ...(providerModels[message.provider] ?? []),
          message.model,
        ];
      }
    }
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const candidate = messages[index];

    if (!lastModel && candidate.model) {
      lastModel = candidate.model;
    }

    if (!lastProvider && candidate.provider) {
      lastProvider = candidate.provider;
    }

    if (lastModel && lastProvider) {
      break;
    }
  }

  return {
    lastModel,
    lastProvider,
    providers,
    providerModels,
  };
}

export function getVisibleConversationMessageCount(
  conversation: Pick<Conversation, "branch" | "messages">,
) {
  if (!conversation.branch) {
    return conversation.messages.length;
  }

  const checkpointIndex = conversation.messages.findIndex(
    ({ id }) => id === conversation.branch?.branchMessageId,
  );
  return checkpointIndex >= 0
    ? conversation.messages.length - checkpointIndex
    : conversation.messages.length;
}

function compareConversationMeta(
  left: ConversationMeta,
  right: ConversationMeta,
) {
  if (left.pinned !== right.pinned) {
    return left.pinned ? -1 : 1;
  }

  return (
    new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  );
}

export function sortConversationMeta(conversations: ConversationMeta[]) {
  return [...conversations].sort(compareConversationMeta);
}

export function normalizeConversationMeta(meta: Partial<ConversationMeta>) {
  return {
    ...meta,
    id: meta.id ?? "",
    title: meta.title ?? "",
    createdAt: meta.createdAt ?? meta.updatedAt ?? new Date(0).toISOString(),
    updatedAt: meta.updatedAt ?? new Date(0).toISOString(),
    messageCount: meta.messageCount ?? 0,
    providers: meta.providers ?? (meta.lastProvider ? [meta.lastProvider] : []),
    providerModels: meta.providerModels ?? {},
    lastModel: meta.lastModel ?? null,
    lastProvider: meta.lastProvider ?? null,
    pinned: meta.pinned ?? false,
    branchSchemaVersion: 2 as const,
    isPrivate: meta.isPrivate ?? false,
  };
}

export function conversationMetaNeedsHydration(
  meta: Partial<ConversationMeta>,
) {
  return (
    !meta.createdAt ||
    typeof meta.messageCount !== "number" ||
    !Array.isArray(meta.providers) ||
    typeof meta.providerModels !== "object" ||
    meta.providerModels === null ||
    meta.branchSchemaVersion !== 2 ||
    typeof meta.isPrivate !== "boolean"
  );
}

export function normalizeConversationTitle(title: string, fallback: string) {
  const trimmed = title.trim();

  if (!trimmed) {
    return fallback;
  }

  return truncateConversationTitle(trimmed);
}

export function buildConversationMetaFromConversation(
  conversation: Conversation,
  existingMeta?: ConversationMeta | null,
): ConversationMeta {
  const inferredState = inferConversationState(conversation.messages);

  return normalizeConversationMeta({
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messageCount: getVisibleConversationMessageCount(conversation),
    providers:
      inferredState.providers.length > 0
        ? inferredState.providers
        : (existingMeta?.providers ?? []),
    providerModels:
      Object.keys(inferredState.providerModels).length > 0
        ? inferredState.providerModels
        : (existingMeta?.providerModels ?? {}),
    lastModel: inferredState.lastModel ?? existingMeta?.lastModel ?? null,
    lastProvider:
      inferredState.lastProvider ?? existingMeta?.lastProvider ?? null,
    pinned: existingMeta?.pinned ?? false,
    branch: conversation.branch,
    branchSchemaVersion: 2,
    isPrivate: conversation.isPrivate ?? existingMeta?.isPrivate ?? false,
  });
}
