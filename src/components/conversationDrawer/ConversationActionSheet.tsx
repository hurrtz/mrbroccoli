import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../../design-system/PhosphorIcon";
import { IconButton } from "../../design-system/IconButton";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { Colors } from "../../theme/colors";
import { ConversationMeta } from "../../types";

import { styles } from "./styles";

interface ConversationActionSheetProps {
  conversation: ConversationMeta | null;
  onClose: () => void;
  onCopyThread: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onOpenRoot?: (conversationId: string) => void;
  onOpenRenameModal: (conversation: ConversationMeta) => void;
  onShareThread: (conversationId: string) => void;
  onTogglePinned: (conversationId: string) => void;
  onTogglePrivate: (conversationId: string) => void;
  onToggleArchived: (conversationId: string) => void;
  onAutoName: (conversationId: string) => void;
}

function ActionRow({
  accessibilityHint,
  colors,
  danger = false,
  icon,
  label,
  last = false,
  onPress,
  testID,
}: {
  accessibilityHint?: string;
  colors: Colors;
  danger?: boolean;
  icon: PhosphorIconName;
  label: string;
  last?: boolean;
  onPress: () => void;
  testID?: string;
}) {
  const ink = danger ? colors.danger : colors.textSecondary;
  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.actionSheetRow,
        last ? null : [styles.actionSheetRowDivider, { borderBottomColor: colors.border }],
      ]}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
    >
      <PhosphorIcon name={icon} size="compact" color={ink} />
      <Text style={[styles.actionSheetRowText, { color: ink }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function ConversationActionSheet({
  conversation,
  onClose,
  onCopyThread,
  onDelete,
  onOpenRoot,
  onOpenRenameModal,
  onShareThread,
  onTogglePinned,
  onTogglePrivate,
  onToggleArchived,
  onAutoName,
}: ConversationActionSheetProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  if (!conversation) {
    return null;
  }

  const rootConversationId = conversation.branch?.rootConversationId;

  return (
    <View style={styles.inlineActionOverlay} pointerEvents="box-none">
      <TouchableOpacity
        testID="conversation-action-backdrop"
        style={[
          styles.inlineActionBackdrop,
          { backgroundColor: colors.overlay },
        ]}
        activeOpacity={1}
        onPress={onClose}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <ScrollView
        accessibilityViewIsModal
        contentContainerStyle={styles.actionSheetContent}
        showsVerticalScrollIndicator
        style={[
          styles.actionSheet,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.glow,
          },
        ]}
      >
        <View style={styles.actionSheetHeader}>
          <View style={styles.actionSheetHeaderCopy}>
            <Text style={[styles.actionSheetTitle, { color: colors.text }]}>
              {conversation.title}
            </Text>
            <Text
              style={[styles.actionSheetMeta, { color: colors.textSecondary }]}
            >
              {t("messageCount", {
                count: conversation.messageCount ?? 0,
              })}
            </Text>
          </View>
          <IconButton
            accessibilityLabel={t("dismiss")}
            icon="close"
            onPress={onClose}
            testID="conversation-action-close"
          />
        </View>

        {/* One grouped card with hairline dividers; each action is a row,
            not its own outlined island. */}
        <View
          style={[
            styles.actionSheetGroup,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
        >
          {rootConversationId && onOpenRoot ? (
            <ActionRow
              colors={colors}
              icon="branch"
              label={t("showRootConversation")}
              onPress={() => {
                onOpenRoot(rootConversationId);
                onClose();
              }}
              testID="conversation-action-show-root"
            />
          ) : null}
          <ActionRow
            colors={colors}
            icon="pushpin"
            label={conversation.pinned ? t("unpin") : t("pin")}
            onPress={() => {
              onTogglePinned(conversation.id);
              onClose();
            }}
            testID="conversation-action-toggle-pin"
          />
          <ActionRow
            accessibilityHint={t("privateConversationDescription")}
            colors={colors}
            icon={conversation.isPrivate ? "global" : "lock"}
            label={
              conversation.isPrivate
                ? t("includeConversationInKnowledge")
                : t("markConversationPrivate")
            }
            onPress={() => {
              onTogglePrivate(conversation.id);
              onClose();
            }}
            testID="conversation-action-toggle-private"
          />
          <ActionRow
            colors={colors}
            icon="edit"
            label={t("rename")}
            onPress={() => onOpenRenameModal(conversation)}
            testID="conversation-action-rename"
          />
          <ActionRow
            colors={colors}
            icon="thunderbolt"
            label={t("nameConversationAutomatically")}
            onPress={() => {
              onAutoName(conversation.id);
              onClose();
            }}
            testID="conversation-action-auto-name"
          />
          <ActionRow
            colors={colors}
            icon="inbox"
            label={
              conversation.archived
                ? t("unarchiveSession")
                : t("archiveSession")
            }
            onPress={() => {
              onToggleArchived(conversation.id);
              onClose();
            }}
            testID="conversation-action-toggle-archive"
          />
          <ActionRow
            colors={colors}
            icon="share-alt"
            label={t("share")}
            onPress={() => {
              onShareThread(conversation.id);
              onClose();
            }}
          />
          <ActionRow
            colors={colors}
            icon="copy"
            label={t("copy")}
            onPress={() => {
              onCopyThread(conversation.id);
              onClose();
            }}
          />
          <ActionRow
            colors={colors}
            danger
            icon="delete"
            label={t("delete")}
            last
            onPress={() => {
              onDelete(conversation.id);
              onClose();
            }}
            testID="conversation-action-delete"
          />
        </View>
      </ScrollView>
    </View>
  );
}
