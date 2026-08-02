import React from "react";
import {
  Alert,
  Modal,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { ConversationActionSheet } from "./conversationDrawer/ConversationActionSheet";
import { ConversationDrawerHeader } from "./conversationDrawer/ConversationDrawerHeader";
import { ConversationDrawerList } from "./conversationDrawer/ConversationDrawerList";
import { ConversationRenameModal } from "./conversationDrawer/ConversationRenameModal";
import { styles } from "./conversationDrawer/styles";
import { ConversationDrawerProps } from "./conversationDrawer/types";
import { useConversationDrawerController } from "./conversationDrawer/useConversationDrawerController";

export const ConversationDrawer = React.memo(function ConversationDrawer({
  visible,
  conversations,
  activeId,
  onSearchConversations,
  onSelect,
  onCopyThread,
  onShareThread,
  onManageMemory,
  onRenameThread,
  onTogglePinned,
  onTogglePrivate,
  onNewSession,
  onDelete,
  onClose,
  onDismiss,
}: ConversationDrawerProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const drawerMaxWidth = isLandscape ? Math.min(width * 0.44, 520) : width;
  const controller = useConversationDrawerController({
    visible,
    conversations,
    onClose,
    onNewSession,
    onRenameThread,
    onSearchConversations,
    onSelect,
  });
  const handleDelete = React.useCallback(
    (conversationId: string) => {
      const conversation = conversations.find(
        (entry) => entry.id === conversationId,
      );

      if (!conversation) {
        return;
      }

      Alert.alert(
        t("deleteConversationConfirmationTitle", {
          title: conversation.title,
        }),
        t("deleteConversationConfirmationMessage"),
        [
          {
            text: t("cancel"),
            style: "cancel",
          },
          {
            text: t("delete"),
            style: "destructive",
            onPress: () => onDelete(conversationId),
          },
        ],
      );
    },
    [conversations, onDelete, t],
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onDismiss={onDismiss}
      supportedOrientations={APP_MODAL_ORIENTATIONS}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.drawer,
            {
              maxWidth: drawerMaxWidth,
              width: isLandscape ? "44%" : "100%",
              borderRightWidth: isLandscape ? 1 : 0,
            },
            {
              backgroundColor: colors.surface,
              borderRightColor: colors.border,
            },
          ]}
        >
          <ConversationDrawerHeader
            searchQuery={controller.searchQuery}
            onChangeSearchQuery={controller.setSearchQuery}
            onClearSearch={controller.clearSearch}
            onClose={onClose}
            onNewSession={controller.handleNewSession}
          />
          <ConversationDrawerList
            activeId={activeId}
            compact={isLandscape}
            conversations={controller.visibleConversations}
            searchQuery={controller.searchQuery}
            onDeleteConversation={handleDelete}
            onOpenActionConversation={controller.openActionConversation}
            onSelectConversation={controller.handleSelectConversation}
          />
        </View>
        {isLandscape ? (
          <TouchableOpacity
            style={[styles.backdrop, { backgroundColor: colors.overlay }]}
            activeOpacity={1}
            onPress={onClose}
            accessible={false}
          />
        ) : null}
      </View>

      <ConversationActionSheet
        conversation={controller.actionConversation}
        onClose={controller.closeActionModal}
        onCopyThread={onCopyThread}
        onDelete={handleDelete}
        onManageMemory={onManageMemory}
        onOpenRenameModal={controller.openRenameModal}
        onShareThread={onShareThread}
        onTogglePinned={onTogglePinned}
        onTogglePrivate={onTogglePrivate}
      />
      <ConversationRenameModal
        visible={controller.editingConversationId !== null}
        editingTitle={controller.editingTitle}
        onChangeEditingTitle={controller.setEditingTitle}
        onClose={controller.closeRenameModal}
        onSubmit={controller.submitRename}
      />
    </Modal>
  );
});
