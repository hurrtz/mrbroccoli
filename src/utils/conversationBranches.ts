import type { ConversationMeta } from "../types";

export interface ConversationBranchRow {
  conversation: ConversationMeta;
  depth: number;
  ancestorHasNextSibling: boolean[];
  hasChildren: boolean;
  isLastSibling: boolean;
}

export function getConversationBranchesByMessageId(
  conversations: ConversationMeta[],
  parentConversationId: string | null,
) {
  const branches = new Map<string, ConversationMeta[]>();
  if (!parentConversationId) {
    return branches;
  }

  for (const conversation of conversations) {
    if (conversation.branch?.parentConversationId !== parentConversationId) {
      continue;
    }

    const existing = branches.get(conversation.branch.parentMessageId) ?? [];
    existing.push(conversation);
    branches.set(conversation.branch.parentMessageId, existing);
  }

  for (const children of branches.values()) {
    children.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() -
        new Date(right.createdAt).getTime(),
    );
  }

  return branches;
}

export function buildConversationBranchRows(
  conversations: ConversationMeta[],
): ConversationBranchRow[] {
  const byId = new Map(
    conversations.map((conversation) => [conversation.id, conversation] as const),
  );
  const rankById = new Map(
    conversations.map((conversation, index) => [conversation.id, index] as const),
  );
  const childrenByParentId = new Map<string, ConversationMeta[]>();
  const roots: ConversationMeta[] = [];

  for (const conversation of conversations) {
    const parentId = conversation.branch?.parentConversationId;
    if (!parentId || !byId.has(parentId) || parentId === conversation.id) {
      roots.push(conversation);
      continue;
    }

    const children = childrenByParentId.get(parentId) ?? [];
    children.push(conversation);
    childrenByParentId.set(parentId, children);
  }

  const subtreeRankCache = new Map<string, number>();
  const resolving = new Set<string>();
  const subtreeRank = (conversation: ConversationMeta): number => {
    const cached = subtreeRankCache.get(conversation.id);
    if (cached !== undefined) {
      return cached;
    }
    if (resolving.has(conversation.id)) {
      return rankById.get(conversation.id) ?? Number.MAX_SAFE_INTEGER;
    }

    resolving.add(conversation.id);
    const ownRank = rankById.get(conversation.id) ?? Number.MAX_SAFE_INTEGER;
    const childRanks = (childrenByParentId.get(conversation.id) ?? []).map(
      subtreeRank,
    );
    resolving.delete(conversation.id);
    const rank = Math.min(ownRank, ...childRanks);
    subtreeRankCache.set(conversation.id, rank);
    return rank;
  };
  const sortByRank = (items: ConversationMeta[]) =>
    [...items].sort((left, right) => subtreeRank(left) - subtreeRank(right));

  const rows: ConversationBranchRow[] = [];
  const visited = new Set<string>();
  const visit = (
    conversation: ConversationMeta,
    depth: number,
    ancestorHasNextSibling: boolean[],
    isLastSibling: boolean,
  ) => {
    if (visited.has(conversation.id)) {
      return;
    }
    visited.add(conversation.id);
    const children = sortByRank(childrenByParentId.get(conversation.id) ?? []);
    rows.push({
      conversation,
      depth,
      ancestorHasNextSibling,
      hasChildren: children.length > 0,
      isLastSibling,
    });

    children.forEach((child, index) => {
      visit(
        child,
        depth + 1,
        [...ancestorHasNextSibling, index < children.length - 1],
        index === children.length - 1,
      );
    });
  };

  const sortedRoots = sortByRank(roots);
  sortedRoots.forEach((root, index) => {
    visit(root, 0, [], index === sortedRoots.length - 1);
  });

  for (const conversation of conversations) {
    if (!visited.has(conversation.id)) {
      visit(conversation, 0, [], true);
    }
  }

  return rows;
}
