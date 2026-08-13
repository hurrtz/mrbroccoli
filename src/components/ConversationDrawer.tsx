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
import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { ConversationActionSheet } from "./conversationDrawer/ConversationActionSheet";
import { ConversationIntegrityModal } from "./conversationDrawer/ConversationIntegrityModal";
import {
  ConversationDrawerHeader,
  ConversationDrawerSearch,
} from "./conversationDrawer/ConversationDrawerHeader";
import { ConversationDrawerList } from "./conversationDrawer/ConversationDrawerList";
import { ConversationRenameModal } from "./conversationDrawer/ConversationRenameModal";
import { styles } from "./conversationDrawer/styles";
import { ConversationDrawerProps } from "./conversationDrawer/types";
import { useConversationDrawerController } from "./conversationDrawer/useConversationDrawerController";
import { useConversationIntegrityController } from "./conversationDrawer/useConversationIntegrityController";

export const ConversationDrawer = React.memo(function ConversationDrawer({
  visible,
  archivedInitiallyExpanded = false,
  conversations,
  activeId,
  onSearchConversations,
  onSelect,
  onCopyThread,
  onShareThread,
  onManageMemory,
  onInspectIntegrity,
  onRepairIntegrity,
  onUndoIntegrityRepair,
  onExportIntegrityOriginals,
  onRenameThread,
  onTogglePinned,
  onTogglePrivate,
  onToggleArchived,
  onAutoName,
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
  const integrityController = useConversationIntegrityController({
    onInspect: onInspectIntegrity,
    onRepair: onRepairIntegrity,
    onUndo: onUndoIntegrityRepair,
  });
  const closeIntegrity = integrityController.close;
  React.useEffect(() => {
    if (!visible) {
      closeIntegrity();
    }
  }, [closeIntegrity, visible]);
  const handleReviewIntegrity = React.useCallback(
    (conversation: (typeof conversations)[number]) => {
      controller.closeActionModal();
      integrityController.open(conversation);
    },
    [controller, integrityController],
  );
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

        <ConversationActionSheet
          conversation={controller.actionConversation}
          onClose={controller.closeActionModal}
          onOpenRoot={controller.handleSelectConversation}
          onCopyThread={onCopyThread}
          onDelete={handleDelete}
          onManageMemory={onManageMemory}
          onReviewIntegrity={handleReviewIntegrity}
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
        <ConversationIntegrityModal
          busy={integrityController.busy}
          conversation={integrityController.conversation}
          failed={integrityController.failed}
          inspection={integrityController.inspection}
          loading={integrityController.loading}
          onClose={integrityController.close}
          onExportOriginals={onExportIntegrityOriginals}
          onRepair={integrityController.repair}
          onUndo={integrityController.undo}
        />
      </View>
    </Modal>
  );
});
