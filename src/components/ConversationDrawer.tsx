import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { Toast } from "./Toast";
import { ConversationActionMenu } from "./conversationDrawer/ConversationActionMenu";
import {
  ConversationDrawerHeader,
  ConversationDrawerSearch,
} from "./conversationDrawer/ConversationDrawerHeader";
import { ConversationDrawerList } from "./conversationDrawer/ConversationDrawerList";
import { ConversationRenameModal } from "./conversationDrawer/ConversationRenameModal";
import { styles } from "./conversationDrawer/styles";
import { ConversationDrawerProps } from "./conversationDrawer/types";
import { useConversationDrawerController } from "./conversationDrawer/useConversationDrawerController";

export const ConversationDrawer = React.memo(function ConversationDrawer({
  visible,
  archivedInitiallyExpanded = false,
  conversations,
  activeId,
  onSearchConversations,
  onSelect,
  onCopyThread,
  onShareThread,
  onRenameThread,
  onTogglePinned,
  onTogglePrivate,
  onToggleArchived,
  onAutoName,
  onNewSession,
  onDelete,
  onClose,
  onDismiss,
  toast,
  onDismissToast,
}: ConversationDrawerProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
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
      onRequestClose={onClose}
      supportedOrientations={APP_MODAL_ORIENTATIONS}
    >
      <View accessibilityViewIsModal style={styles.modalRoot}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[
              styles.drawer,
              {
                maxWidth: drawerMaxWidth,
                width: isLandscape ? "44%" : "100%",
                borderRightWidth: isLandscape ? 1 : 0,
              },
              {
                backgroundColor: colors.background,
                borderRightColor: colors.border,
              },
            ]}
          >
            <ConversationDrawerHeader
              onClose={onClose}
              onNewSession={controller.handleNewSession}
            />
            <ConversationDrawerList
              activeId={activeId}
              allConversations={conversations}
              archivedInitiallyExpanded={archivedInitiallyExpanded}
              compact={isLandscape}
              conversations={controller.visibleConversations}
              searchQuery={controller.searchQuery}
              onDeleteConversation={handleDelete}
              onOpenActionConversation={controller.openActionConversation}
              onSelectConversation={controller.handleSelectConversation}
            />
            <ConversationDrawerSearch
              searchQuery={controller.searchQuery}
              onChangeSearchQuery={controller.setSearchQuery}
              onClearSearch={controller.clearSearch}
            />
          </KeyboardAvoidingView>
          {isLandscape ? (
            <TouchableOpacity
              style={[styles.backdrop, { backgroundColor: colors.overlay }]}
              activeOpacity={1}
              onPress={onClose}
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          ) : null}
        </View>

        <ConversationActionMenu
          anchorY={controller.actionAnchorY}
          availableHeight={height}
          conversation={controller.actionConversation}
          onClose={controller.closeActionModal}
          onCopyThread={onCopyThread}
          onDelete={handleDelete}
          onOpenRenameModal={controller.openRenameModal}
          onShareThread={onShareThread}
          onTogglePinned={onTogglePinned}
          onTogglePrivate={onTogglePrivate}
          onToggleArchived={onToggleArchived}
          onAutoName={onAutoName}
        />
        <ConversationRenameModal
          visible={controller.editingConversationId !== null}
          editingTitle={controller.editingTitle}
          onChangeEditingTitle={controller.setEditingTitle}
          onClose={controller.closeRenameModal}
          onSubmit={controller.submitRename}
        />
        {onDismissToast ? (
          <View
            pointerEvents="box-none"
            style={[styles.toastHost, { top: insets.top }]}
          >
            <Toast
              message={toast?.message || ""}
              visible={Boolean(toast)}
              onDismiss={onDismissToast}
              onRetry={toast?.onRetry}
              tone={toast?.tone}
            />
          </View>
        ) : null}
      </View>
    </Modal>
  );
});
