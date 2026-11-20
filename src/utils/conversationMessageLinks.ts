import type { Conversation } from "../types";

/** Keep the fork lineage and saved insights when their local source disappears. */
export function reconcileConversationMessageLinks(
  conversation: Conversation,
): Conversation {
  if (!conversation.branch && !conversation.artifacts?.length)
    return conversation;
  const messageIds = new Set(conversation.messages.map(({ id }) => id));
  const { branch, artifacts } = conversation;
  const missingCheckpoint =
    branch?.branchMessageId && !messageIds.has(branch.branchMessageId);
  const missingSource = artifacts?.some(
    ({ sourceMessageId }) =>
      sourceMessageId !== null && !messageIds.has(sourceMessageId),
  );
  if (!missingCheckpoint && !missingSource) return conversation;
  return {
    ...conversation,
    ...(missingCheckpoint
      ? { branch: { ...branch, branchMessageId: null } }
      : {}),
    ...(missingSource
      ? {
          artifacts: artifacts?.map((artifact) =>
            artifact.sourceMessageId &&
            !messageIds.has(artifact.sourceMessageId)
              ? { ...artifact, sourceMessageId: null }
              : artifact,
          ),
        }
      : {}),
  };
}
