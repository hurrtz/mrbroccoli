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
  presentation = "modal",
  sidebarWidth,
  archivedRevealRequestId,
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
  onOpenSettings,
  onArchivedRevealHandled,
  onDismiss,
  toast,
  onDismissToast,
}: ConversationDrawerProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;
  const isSidebar = presentation === "sidebar";
  const drawerMaxWidth = isLandscape ? Math.min(width * 0.44, 520) : width;
  const controller = useConversationDrawerController({
    visible: isSidebar || visible,
    dismissAfterAction: !isSidebar,
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

  if (!visible && !isSidebar) {
    return null;
  }

  const drawerSurface = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      testID={isSidebar ? "conversation-sidebar-surface" : undefined}
      style={
        isSidebar
          ? [
              styles.drawer,
              {
                borderEndWidth: 1,
                maxWidth: "100%",
              },
              {
                backgroundColor: colors.surface,
                borderEndColor: colors.border,
              },
            ]
          : [
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
            ]
      }
    >
      <ConversationDrawerHeader
        onClose={onClose}
        onNewSession={controller.handleNewSession}
        onOpenSettings={onOpenSettings}
        presentation={presentation}
      />
      <ConversationDrawerList
        activeId={activeId}
        allConversations={conversations}
        archivedRevealRequestId={archivedRevealRequestId}
        compact={isLandscape && !isSidebar}
        conversations={controller.visibleConversations}
        presentation={presentation}
        searchQuery={controller.searchQuery}
        onDeleteConversation={handleDelete}
        onArchivedRevealHandled={onArchivedRevealHandled}
        onOpenActionConversation={controller.openActionConversation}
        onSelectConversation={controller.handleSelectConversation}
      />
      <ConversationDrawerSearch
        inline={isSidebar}
        searchQuery={controller.searchQuery}
        onChangeSearchQuery={controller.setSearchQuery}
        onClearSearch={controller.clearSearch}
      />
    </KeyboardAvoidingView>
  );

  const drawerOverlays = (
    <>
      <ConversationActionMenu
        anchorY={
          isSidebar
            ? Math.max(0, controller.actionAnchorY - insets.top)
            : controller.actionAnchorY
        }
        availableHeight={
          isSidebar ? Math.max(0, height - insets.top - insets.bottom) : height
        }
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
      {!isSidebar && onDismissToast ? (
        <View
          pointerEvents="box-none"
          style={[styles.toastHost, { top: isSidebar ? 0 : insets.top }]}
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
    </>
  );

  if (isSidebar) {
    return (
      <View
        style={[styles.sidebarRoot, { width: sidebarWidth ?? "100%" }]}
        testID="conversation-drawer-sidebar"
      >
        {drawerSurface}
        {drawerOverlays}
      </View>
    );
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
          {drawerSurface}
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
        {drawerOverlays}
      </View>
    </Modal>
  );
});
