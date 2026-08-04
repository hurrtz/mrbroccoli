import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { Swipeable } from "react-native-gesture-handler";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { ConversationBranchRow } from "../../utils/conversationBranches";
import { ProviderIcon } from "../ProviderIcon";

import { ConversationBranchRail } from "./ConversationBranchRail";
import { styles } from "./styles";

interface ConversationDrawerItemProps {
  row: ConversationBranchRow;
  active: boolean;
  formatDateTime: (iso: string) => string;
  onDelete: (conversationId: string) => void;
  onOpenActionConversation: (conversationId: string) => void;
  onSelectConversation: (conversationId: string) => void;
  onToggleBranchExpanded: (conversationId: string, isExpanded: boolean) => void;
}

export function ConversationDrawerItem({
  row,
  active,
  formatDateTime,
  onDelete,
  onOpenActionConversation,
  onSelectConversation,
  onToggleBranchExpanded,
}: ConversationDrawerItemProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { conversation } = row;
  const providers =
    conversation.providers && conversation.providers.length > 0
      ? conversation.providers
      : conversation.lastProvider
        ? [conversation.lastProvider]
        : [];
  const providerModelEntries = providers.map((provider) => ({
    provider,
    models: conversation.providerModels?.[provider] ?? [],
  }));

  const renderRightActions = () => (
    <TouchableOpacity
      testID={`conversation-drawer-delete-${conversation.id}`}
      style={[styles.deleteAction, { backgroundColor: colors.dangerFill }]}
      onPress={() => onDelete(conversation.id)}
      accessibilityRole="button"
      accessibilityLabel={t("delete")}
    >
      <PhosphorIcon name="delete" size="compact" color={colors.onDanger} />
      <Text style={[styles.deleteText, { color: colors.onDanger }]}>
        {t("delete")}
      </Text>
    </TouchableOpacity>
  );

  const cardBody = (
    <>
      {active ? (
        <View
          style={[styles.itemActiveRail, { backgroundColor: colors.accent }]}
        />
      ) : null}
      <TouchableOpacity
        testID={`conversation-drawer-menu-${conversation.id}`}
        style={[styles.itemMenuButton, styles.itemMenuButtonFloating]}
        onPress={() => onOpenActionConversation(conversation.id)}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel={t("conversationActions")}
      >
        <PhosphorIcon
          name="ellipsis-vertical"
          size="compact"
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      {row.hasChildren ? (
        <TouchableOpacity
          testID={`conversation-branch-toggle-${conversation.id}`}
          style={styles.branchToggleButton}
          onPress={() =>
            onToggleBranchExpanded(conversation.id, row.isExpanded)
          }
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityState={{ expanded: row.isExpanded }}
          accessibilityLabel={t("branchesFromMessage")}
        >
          <PhosphorIcon
            name={row.isExpanded ? "up" : "down"}
            size="compact"
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        testID={`conversation-drawer-item-${conversation.id}`}
        style={[
          styles.itemPressArea,
          row.hasChildren ? styles.itemPressAreaWithBranchToggle : null,
          { paddingLeft: Math.min(row.depth, 4) * 14 + 22 },
        ]}
        onPress={() => onSelectConversation(conversation.id)}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={[
          conversation.title,
          conversation.isPrivate ? t("privateConversation") : null,
          conversation.branch ? t("branchStartsHere") : null,
        ]
          .filter(Boolean)
          .join(". ")}
        accessibilityState={{ selected: active }}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemTitleRow}>
            {conversation.pinned ? (
              <PhosphorIcon
                name="pushpin"
                size="inline"
                color={colors.accent}
              />
            ) : null}
            {conversation.isPrivate ? (
              <PhosphorIcon
                name="lock"
                size="inline"
                color={colors.textSecondary}
              />
            ) : null}
            <Text
              style={[styles.itemTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {conversation.title}
            </Text>
          </View>
        </View>
        <View style={styles.itemMeta}>
          {row.depth > 0 ? (
            <Text
              style={[styles.branchParentText, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {row.parentTitle
                ? t("branchOfConversation", { title: row.parentTitle })
                : t("branchStartsHere")}
            </Text>
          ) : (
            <View style={styles.itemModelList}>
              {providerModelEntries.length > 0 ? (
                providerModelEntries.map(({ provider, models }) => (
                  <View
                    key={`${conversation.id}-${provider}-models`}
                    style={styles.itemModelRow}
                  >
                    <ProviderIcon
                      provider={provider}
                      color={active ? colors.accent : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.itemModelText,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {models.length > 0 ? models.join(" · ") : t("noModelYet")}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={[styles.itemModelText, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  {t("noProviderYet")}
                </Text>
              )}
            </View>
          )}
          <View style={styles.itemFooterRow}>
            <Text
              style={[styles.itemFooterText, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {formatDateTime(conversation.updatedAt)}
            </Text>
            <View
              style={[
                styles.itemFooterDot,
                { backgroundColor: colors.borderStrong },
              ]}
            />
            <View style={styles.itemFooterMessages}>
              <PhosphorIcon
                name="message"
                size="inline"
                color={active ? colors.accent : colors.textMuted}
              />
              <Text
                style={[
                  styles.itemFooterText,
                  { color: active ? colors.accent : colors.textMuted },
                ]}
              >
                {t("messageCount", {
                  count: conversation.messageCount ?? 0,
                })}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View
        style={[
          styles.itemFrame,
          {
            borderColor: active ? colors.borderStrong : colors.border,
            backgroundColor: active ? colors.accentSoft : colors.surface,
          },
        ]}
      >
        <View style={[styles.item, row.depth > 0 ? styles.itemBranch : null]}>
          <ConversationBranchRail row={row} active={active} />
          {cardBody}
        </View>
      </View>
    </Swipeable>
  );
}
