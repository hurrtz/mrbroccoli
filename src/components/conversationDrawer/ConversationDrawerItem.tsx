import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { Swipeable } from "react-native-gesture-handler";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { ConversationMeta } from "../../types";
import { ProviderIcon } from "../ProviderIcon";

import { styles } from "./styles";

interface ConversationDrawerItemProps {
  conversation: ConversationMeta;
  active: boolean;
  formatDateTime: (iso: string) => string;
  onDelete: (conversationId: string) => void;
  onOpenActionConversation: (conversationId: string) => void;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationDrawerItem({
  conversation,
  active,
  formatDateTime,
  onDelete,
  onOpenActionConversation,
  onSelectConversation,
}: ConversationDrawerItemProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
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
        style={[
          styles.itemMenuButton,
          styles.itemMenuButtonFloating,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
          },
        ]}
        onPress={() => onOpenActionConversation(conversation.id)}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel={t("conversationActions")}
      >
        <PhosphorIcon
          name="ellipsis"
          size="compact"
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        testID={`conversation-drawer-item-${conversation.id}`}
        style={styles.itemPressArea}
        onPress={() => onSelectConversation(conversation.id)}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={conversation.title}
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
            <Text
              style={[styles.itemTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {conversation.title}
            </Text>
          </View>
        </View>
        <View style={styles.itemMeta}>
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
        <View style={styles.item}>{cardBody}</View>
      </View>
    </Swipeable>
  );
}
