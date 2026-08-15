import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { ConversationMeta } from "../../types";

import { styles } from "./styles";

interface MenuItem {
  danger?: boolean;
  icon: PhosphorIconName;
  label: string;
  onPress: () => void;
  testID?: string;
}

interface ConversationActionMenuProps {
  /** Window Y of the row's ellipsis button; the panel opens beneath it. */
  anchorY: number;
  availableHeight: number;
  conversation: ConversationMeta | null;
  onClose: () => void;
  onCopyThread: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onOpenRenameModal: (conversation: ConversationMeta) => void;
  onShareThread: (conversationId: string) => void;
  onTogglePinned: (conversationId: string) => void;
  onToggleArchived: (conversationId: string) => void;
  onToggleLocked: (conversation: ConversationMeta) => void;
  onAutoName: (conversationId: string) => void;
}

/**
 * Quick verbs anchored at the row's ellipsis, the light alternative to a
 * bottom sheet: no backdrop dim, a transparent click-away layer only. The
 * groups are the hierarchy — organize, identity, out, then delete alone in
 * danger ink. Bottom sheets stay reserved for configuration surfaces.
 *
 * There is deliberately no "show root conversation" verb: the root tag on the
 * row itself is the fork affordance.
 */
export function ConversationActionMenu({
  anchorY,
  availableHeight,
  conversation,
  onClose,
  onCopyThread,
  onDelete,
  onOpenRenameModal,
  onShareThread,
  onTogglePinned,
  onToggleArchived,
  onToggleLocked,
  onAutoName,
}: ConversationActionMenuProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  if (!conversation) {
    return null;
  }

  const unlockedGroups: MenuItem[][] = conversation.isLocked
    ? []
    : [
        [
          {
            icon: "edit",
            label: t("rename"),
            onPress: () => onOpenRenameModal(conversation),
            testID: "conversation-action-rename",
          },
          {
            icon: "thunderbolt",
            label: t("nameConversationAutomatically"),
            onPress: () => onAutoName(conversation.id),
            testID: "conversation-action-auto-name",
          },
        ],
        [
          {
            icon: "share-alt",
            label: t("share"),
            onPress: () => onShareThread(conversation.id),
          },
          {
            icon: "copy",
            label: t("copy"),
            onPress: () => onCopyThread(conversation.id),
          },
        ],
      ];
  const organizeGroups: MenuItem[][] = conversation.isLocked
    ? []
    : [
        [
          {
            icon: "pushpin",
            label: conversation.pinned ? t("unpin") : t("pin"),
            onPress: () => onTogglePinned(conversation.id),
            testID: "conversation-action-toggle-pin",
          },
          {
            icon: "inbox",
            label: conversation.archived
              ? t("unarchiveSession")
              : t("archiveSession"),
            onPress: () => onToggleArchived(conversation.id),
            testID: "conversation-action-toggle-archive",
          },
        ],
      ];
  const groups: MenuItem[][] = [
    ...organizeGroups,
    [
      {
        icon: "lock",
        label: conversation.isLocked
          ? t("removeSessionLock")
          : t("lockSession"),
        onPress: () => onToggleLocked(conversation),
        testID: "conversation-action-toggle-lock",
      },
    ],
    ...unlockedGroups,
    [
      {
        danger: true,
        icon: "delete",
        label: t("delete"),
        onPress: () => onDelete(conversation.id),
        testID: "conversation-action-delete",
      },
    ],
  ];

  // Rows plus the bands between groups; the panel never runs off the bottom.
  const estimatedHeight =
    groups.reduce((total, group) => total + group.length * 44, 0) +
    (groups.length - 1) * 6;
  const top = Math.max(
    8,
    Math.min(anchorY, Math.max(8, availableHeight - estimatedHeight - 8)),
  );

  return (
    <View style={styles.menuLayer}>
      <Pressable
        accessible={false}
        importantForAccessibility="no"
        onPress={onClose}
        style={StyleSheet.absoluteFill}
        testID="conversation-action-backdrop"
      />
      <View
        accessibilityViewIsModal
        style={[
          styles.menuPanel,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.surfaceRaisedBorder,
            shadowColor: colors.glow,
            top,
          },
        ]}
        testID="conversation-action-menu"
      >
        {groups.map((group, groupIndex) => (
          <React.Fragment key={group[0].label}>
            {groupIndex ? (
              <View
                style={[styles.menuBand, { backgroundColor: colors.border }]}
              />
            ) : null}
            {group.map((item, itemIndex) => (
              <Pressable
                accessibilityLabel={item.label}
                accessibilityRole="menuitem"
                key={item.label}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.menuRow,
                  itemIndex
                    ? [styles.menuRowDivider, { borderTopColor: colors.border }]
                    : null,
                  pressed ? styles.menuRowPressed : null,
                ]}
                testID={item.testID}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.menuRowLabel,
                    { color: item.danger ? colors.danger : colors.text },
                  ]}
                >
                  {item.label}
                </Text>
                <PhosphorIcon
                  color={item.danger ? colors.danger : colors.textSecondary}
                  name={item.icon}
                  size="compact"
                />
              </Pressable>
            ))}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
