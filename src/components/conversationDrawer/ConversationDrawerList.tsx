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
  const branchRows = React.useMemo(
    () => buildConversationBranchRows(conversations),
    [conversations],
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
        />
      )}
    />
  );
}
