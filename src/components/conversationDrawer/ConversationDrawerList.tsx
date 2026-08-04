import React from "react";
import { FlatList, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { ConversationMeta } from "../../types";

import { formatConversationDateTime } from "./formatConversationDateTime";
import { ConversationDrawerItem } from "./ConversationDrawerItem";
import { styles } from "./styles";
import { buildConversationBranchRows } from "../../utils/conversationBranches";

interface ConversationDrawerListProps {
  activeId: string | null;
  compact?: boolean;
  conversations: ConversationMeta[];
  searchQuery: string;
  onDeleteConversation: (conversationId: string) => void;
  onOpenActionConversation: (conversationId: string) => void;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationDrawerList({
  activeId,
  compact = false,
  conversations,
  searchQuery,
  onDeleteConversation,
  onOpenActionConversation,
  onSelectConversation,
}: ConversationDrawerListProps) {
  const { colors } = useTheme();
  const { locale, t } = useLocalization();
  const [expansionOverrides, setExpansionOverrides] = React.useState<
    ReadonlyMap<string, boolean>
  >(new Map());
  const expandedConversationIds = React.useMemo(() => {
    if (searchQuery.trim()) {
      return new Set(conversations.map(({ id }) => id));
    }

    const byId = new Map(
      conversations.map((conversation) => [conversation.id, conversation]),
    );
    const activeAncestors = new Set<string>();
    let current = activeId ? byId.get(activeId) : undefined;
    const visited = new Set<string>();
    while (current?.branch?.parentConversationId && !visited.has(current.id)) {
      visited.add(current.id);
      const parentId = current.branch.parentConversationId;
      activeAncestors.add(parentId);
      current = byId.get(parentId);
    }

    const expanded = new Set<string>();
    for (const conversation of conversations) {
      const override = expansionOverrides.get(conversation.id);
      if (override ?? activeAncestors.has(conversation.id)) {
        expanded.add(conversation.id);
      }
    }
    return expanded;
  }, [activeId, conversations, expansionOverrides, searchQuery]);
  const branchRows = React.useMemo(
    () => buildConversationBranchRows(conversations, expandedConversationIds),
    [conversations, expandedConversationIds],
  );

  const toggleBranchExpanded = React.useCallback(
    (conversationId: string, isExpanded: boolean) => {
      setExpansionOverrides((current) => {
        const next = new Map(current);
        next.set(conversationId, !isExpanded);
        return next;
      });
    },
    [],
  );

  return (
    <FlatList
      data={branchRows}
      keyExtractor={(item) => item.conversation.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View
          testID="conversation-drawer-empty-state"
          style={[
            styles.emptyState,
            compact ? styles.emptyStateCompact : null,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.emptyIcon,
              compact ? styles.emptyIconCompact : null,
              {
                backgroundColor: colors.accentSoft,
                borderColor: colors.border,
              },
            ]}
          >
            <PhosphorIcon name="message" size="control" color={colors.accent} />
          </View>
          <Text
            style={[
              styles.emptyTitle,
              compact ? styles.emptyTitleCompact : null,
              { color: colors.text },
            ]}
          >
            {searchQuery.trim()
              ? t("noMatchingConversations")
              : t("noSavedConversationsYet")}
          </Text>
          <Text
            style={[
              styles.emptyDescription,
              compact ? styles.emptyDescriptionCompact : null,
              { color: colors.textSecondary },
            ]}
          >
            {searchQuery.trim()
              ? t("noMatchingConversationsDescription")
              : t("drawerEmptyDescription")}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <ConversationDrawerItem
          row={item}
          active={item.conversation.id === activeId}
          formatDateTime={(iso) => formatConversationDateTime(iso, locale)}
          onDelete={onDeleteConversation}
          onOpenActionConversation={onOpenActionConversation}
          onSelectConversation={onSelectConversation}
          onToggleBranchExpanded={toggleBranchExpanded}
        />
      )}
    />
  );
}
