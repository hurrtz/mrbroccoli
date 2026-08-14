import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { ConversationMeta } from "../../types";

import { formatConversationDateTime } from "./formatConversationDateTime";
import { ConversationDrawerItem } from "./ConversationDrawerItem";
import { styles } from "./styles";

interface ConversationDrawerListProps {
  activeId: string | null;
  allConversations?: ConversationMeta[];
  archivedInitiallyExpanded?: boolean;
  compact?: boolean;
  conversations: ConversationMeta[];
  searchQuery: string;
  onDeleteConversation: (conversationId: string) => void;
  onOpenActionConversation: (conversationId: string, anchorY: number) => void;
  onSelectConversation: (conversationId: string) => void;
}

type DrawerListEntry =
  | {
      kind: "section";
      id: "pinned" | "earlier" | "archived";
      label: string;
      count?: number;
      expanded?: boolean;
      separated: boolean;
    }
  | {
      kind: "conversation";
      id: string;
      conversation: ConversationMeta;
      rootTitle?: string;
    };

export function buildConversationDrawerEntries(params: {
  conversations: ConversationMeta[];
  allConversations: ConversationMeta[];
  archivedExpanded: boolean;
  pinnedLabel: string;
  earlierLabel: string;
  archivedLabel: string;
}): DrawerListEntry[] {
  const {
    conversations,
    allConversations,
    archivedExpanded,
    pinnedLabel,
    earlierLabel,
    archivedLabel,
  } = params;
  const titleById = new Map(
    allConversations.map(({ id, title }) => [id, title] as const),
  );
  const pinned = conversations.filter(
    (conversation) => !conversation.archived && conversation.pinned,
  );
  const earlier = conversations.filter(
    (conversation) => !conversation.archived && !conversation.pinned,
  );
  const archived = conversations.filter(
    (conversation) => conversation.archived,
  );
  const entries: DrawerListEntry[] = [];
  const addRows = (rows: ConversationMeta[]) => {
    for (const conversation of rows) {
      entries.push({
        kind: "conversation",
        id: conversation.id,
        conversation,
        rootTitle: conversation.branch
          ? titleById.get(conversation.branch.rootConversationId)
          : undefined,
      });
    }
  };

  if (pinned.length > 0) {
    entries.push({
      kind: "section",
      id: "pinned",
      label: pinnedLabel,
      separated: false,
    });
    addRows(pinned);
  }
  if (earlier.length > 0) {
    entries.push({
      kind: "section",
      id: "earlier",
      label: earlierLabel,
      separated: pinned.length > 0,
    });
    addRows(earlier);
  }
  if (archived.length > 0) {
    entries.push({
      kind: "section",
      id: "archived",
      label: archivedLabel,
      count: archived.length,
      expanded: archivedExpanded,
      separated: pinned.length > 0 || earlier.length > 0,
    });
    if (archivedExpanded) {
      addRows(archived);
    }
  }

  return entries;
}

export function ConversationDrawerList({
  activeId,
  archivedInitiallyExpanded = false,
  compact = false,
  conversations,
  allConversations = conversations,
  searchQuery,
  onDeleteConversation,
  onOpenActionConversation,
  onSelectConversation,
}: ConversationDrawerListProps) {
  const { colors } = useTheme();
  const { locale, t } = useLocalization();
  const [archivedOpen, setArchivedOpen] = React.useState(
    archivedInitiallyExpanded,
  );
  const activeIsArchived = conversations.some(
    ({ archived, id }) => id === activeId && archived,
  );
  const archivedExpanded =
    archivedOpen || activeIsArchived || Boolean(searchQuery.trim());
  const entries = React.useMemo(
    () =>
      buildConversationDrawerEntries({
        conversations,
        allConversations,
        archivedExpanded,
        pinnedLabel: t("pinned"),
        earlierLabel: t("earlierSessions"),
        archivedLabel: t("archivedSessions"),
      }),
    [allConversations, archivedExpanded, conversations, t],
  );

  return (
    <FlatList
      testID="conversation-drawer-list"
      style={styles.listView}
      data={entries}
      keyExtractor={(item) => `${item.kind}-${item.id}`}
      contentContainerStyle={[
        styles.list,
        entries.length === 0 ? styles.listEmpty : null,
      ]}
      ListEmptyComponent={
        <View
          testID="conversation-drawer-empty-state"
          style={[styles.emptyState, compact ? styles.emptyStateCompact : null]}
        >
          <View
            style={[
              styles.emptyIcon,
              compact ? styles.emptyIconCompact : null,
              { borderColor: colors.border },
            ]}
            testID="conversation-drawer-empty-icon"
          >
            <PhosphorIcon
              name="inbox"
              size="navigation"
              color={colors.textSecondary}
            />
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
      renderItem={({ item }) => {
        if (item.kind === "section") {
          const isArchived = item.id === "archived";
          const label = isArchived
            ? `${item.label} · ${item.count ?? 0}`
            : item.label;
          return (
            <TouchableOpacity
              testID={`conversation-section-${item.id}`}
              disabled={!isArchived}
              activeOpacity={0.82}
              onPress={() => setArchivedOpen((current) => !current)}
              accessibilityRole={isArchived ? "button" : "header"}
              accessibilityState={
                isArchived ? { expanded: item.expanded } : undefined
              }
              style={[
                styles.sectionBand,
                item.separated ? styles.sectionBandSeparated : null,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionBandText,
                  { color: colors.textSecondary },
                ]}
              >
                {label}
              </Text>
              {isArchived ? (
                <View style={styles.sectionBandToggle}>
                  <PhosphorIcon
                    name={item.expanded ? "up" : "down"}
                    size="compact"
                    color={colors.textSecondary}
                  />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }

        return (
          <ConversationDrawerItem
            conversation={item.conversation}
            rootTitle={item.rootTitle}
            active={item.conversation.id === activeId}
            formatDate={(iso) => formatConversationDateTime(iso, locale)}
            onDelete={onDeleteConversation}
            onOpenActionConversation={onOpenActionConversation}
            onOpenRoot={onSelectConversation}
            onSelectConversation={onSelectConversation}
          />
        );
      }}
    />
  );
}
