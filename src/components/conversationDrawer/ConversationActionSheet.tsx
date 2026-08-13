import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { IconButton } from "../../design-system/IconButton";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { ConversationMeta } from "../../types";

import { styles } from "./styles";

interface ConversationActionSheetProps {
  conversation: ConversationMeta | null;
  onClose: () => void;
  onCopyThread: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onManageMemory: (conversationId: string) => void;
  onReviewIntegrity: (conversation: ConversationMeta) => void;
  onOpenRenameModal: (conversation: ConversationMeta) => void;
  onShareThread: (conversationId: string) => void;
  onTogglePinned: (conversationId: string) => void;
  onTogglePrivate: (conversationId: string) => void;
  onToggleArchived: (conversationId: string) => void;
  onAutoName: (conversationId: string) => void;
}

export function ConversationActionSheet({
  conversation,
  onClose,
  onCopyThread,
  onDelete,
  onManageMemory,
  onReviewIntegrity,
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

        <TouchableOpacity
          testID="conversation-action-toggle-pin"
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            onTogglePinned(conversation.id);
            onClose();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={conversation.pinned ? t("unpin") : t("pin")}
        >
          <PhosphorIcon
            name="pushpin"
            size="compact"
            color={colors.textSecondary}
          />
          <Text
            style={[styles.actionSheetRowText, { color: colors.textSecondary }]}
          >
            {conversation.pinned ? t("unpin") : t("pin")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="conversation-action-toggle-private"
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            onTogglePrivate(conversation.id);
            onClose();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={
            conversation.isPrivate
              ? t("includeConversationInKnowledge")
              : t("markConversationPrivate")
          }
          accessibilityHint={t("privateConversationDescription")}
        >
          <PhosphorIcon
            name={conversation.isPrivate ? "global" : "lock"}
            size="compact"
            color={colors.textSecondary}
          />
          <Text
            style={[styles.actionSheetRowText, { color: colors.textSecondary }]}
          >
            {conversation.isPrivate
              ? t("includeConversationInKnowledge")
              : t("markConversationPrivate")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="conversation-action-rename"
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onOpenRenameModal(conversation)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("rename")}
        >
          <PhosphorIcon
            name="edit"
            size="compact"
            color={colors.textSecondary}
          />
          <Text
            style={[styles.actionSheetRowText, { color: colors.textSecondary }]}
          >
            {t("rename")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="conversation-action-auto-name"
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            onAutoName(conversation.id);
            onClose();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("nameConversationAutomatically")}
        >
          <PhosphorIcon
            name="thunderbolt"
            size="compact"
            color={colors.textSecondary}
          />
          <Text style={[styles.actionSheetRowText, { color: colors.text }]}>
            {t("nameConversationAutomatically")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="conversation-action-toggle-archive"
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            onToggleArchived(conversation.id);
            onClose();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={
            conversation.archived ? t("unarchiveSession") : t("archiveSession")
          }
        >
          <PhosphorIcon
            name="inbox"
            size="compact"
            color={colors.textSecondary}
          />
          <Text style={[styles.actionSheetRowText, { color: colors.text }]}>
            {conversation.archived
              ? t("unarchiveSession")
              : t("archiveSession")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="conversation-action-review-integrity"
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onReviewIntegrity(conversation)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("reviewConversationIntegrity")}
        >
          <PhosphorIcon
            name="safety-certificate"
            size="compact"
            color={colors.textSecondary}
          />
          <Text
            style={[styles.actionSheetRowText, { color: colors.textSecondary }]}
          >
            {t("reviewConversationIntegrity")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            onManageMemory(conversation.id);
            onClose();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("memory")}
        >
          <PhosphorIcon
            name="brain"
            size="compact"
            color={colors.textSecondary}
          />
          <Text
            style={[styles.actionSheetRowText, { color: colors.textSecondary }]}
          >
            {t("memory")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            onShareThread(conversation.id);
            onClose();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("share")}
        >
          <PhosphorIcon
            name="share-alt"
            size="compact"
            color={colors.textSecondary}
          />
          <Text
            style={[styles.actionSheetRowText, { color: colors.textSecondary }]}
          >
            {t("share")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionSheetRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            onCopyThread(conversation.id);
            onClose();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("copy")}
        >
          <PhosphorIcon
            name="copy"
            size="compact"
            color={colors.textSecondary}
          />
          <Text
            style={[styles.actionSheetRowText, { color: colors.textSecondary }]}
          >
            {t("copy")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="conversation-action-delete"
          style={[
            styles.actionSheetRow,
            styles.actionSheetDeleteRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            onDelete(conversation.id);
            onClose();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("delete")}
        >
          <PhosphorIcon name="delete" size="compact" color={colors.danger} />
          <Text style={[styles.actionSheetRowText, { color: colors.danger }]}>
            {t("delete")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
