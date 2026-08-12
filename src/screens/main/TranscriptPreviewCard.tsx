import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { ChatTranscript } from "../../components/ChatTranscript";
import { IconButton } from "../../design-system/IconButton";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { Input, Modal } from "../../design-system/NativeControls";
import { Colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import type {
  ConversationBranchOrigin,
  ConversationMeta,
  Message,
} from "../../types";
import { getConversationBranchesByMessageId } from "../../utils/conversationBranches";

import { TranslateFn } from "./shared";
import { styles } from "./styles";

interface TranscriptPreviewCardProps {
  activeConversationId?: string | null;
  activeConversationTitle?: string;
  activeConversationBranch?: ConversationBranchOrigin;
  conversationBranches?: ConversationMeta[];
  colors: Colors;
  imageAttachmentDisabled?: boolean;
  layout?: "portrait" | "landscape";
  messages: Message[];
  activeReplayMessageId?: string | null;
  onAddImage?: () => void;
  onCopyMessage: (message: Message) => Promise<boolean>;
  onEditMessage?: (message: Message, content: string) => Promise<boolean>;
  onBranchMessage?: (message: Message) => Promise<boolean> | void;
  onSelectBranchConversation?: (conversationId: string) => Promise<void> | void;
  onRepeatMessage?: (message: Message) => void;
  onRetryMessage: (message: Message) => void;
  onRemoveMessage?: (message: Message) => void;
  onOpenStyleSheet?: () => void;
  onOpenSpeakingSettings?: () => void;
  onShareMessage?: (message: Message) => void;
  onReportMessage?: (message: Message) => void;
  presentation?: "card" | "canvas";
  preferredHeight?: number;
  scrollEnabled?: boolean;
  replayPhase?: "idle" | "preparing" | "speaking";
  showUsageStats: boolean;
  showStyleControl?: boolean;
  showWhenEmpty?: boolean;
  style?: StyleProp<ViewStyle>;
  t: TranslateFn;
}

export function TranscriptPreviewCard({
  activeConversationId,
  activeConversationTitle,
  activeConversationBranch,
  conversationBranches = [],
  colors,
  imageAttachmentDisabled = false,
  layout = "portrait",
  messages,
  activeReplayMessageId = null,
  onAddImage,
  onCopyMessage,
  onEditMessage,
  onBranchMessage,
  onSelectBranchConversation,
  onRepeatMessage,
  onRetryMessage,
  onRemoveMessage,
  onOpenStyleSheet,
  onOpenSpeakingSettings,
  onShareMessage,
  onReportMessage,
  presentation = "card",
  preferredHeight,
  scrollEnabled = false,
  replayPhase = "idle",
  showUsageStats,
  showStyleControl = false,
  showWhenEmpty = false,
  style,
  t,
}: TranscriptPreviewCardProps) {
  const [isAtTranscriptTail, setIsAtTranscriptTail] = useState(true);
  const [scrollToLatestRequest, setScrollToLatestRequest] = useState(0);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editingText, setEditingText] = useState("");
  const [savingCorrection, setSavingCorrection] = useState<
    "save" | "send" | null
  >(null);
  const [branchChoices, setBranchChoices] = useState<ConversationMeta[]>([]);
  const [branchNavigationTarget, setBranchNavigationTarget] = useState<{
    conversationId: string;
    messageId: string;
    request: number;
  } | null>(null);
  const branchChildrenByMessageId = React.useMemo(
    () =>
      getConversationBranchesByMessageId(
        conversationBranches,
        activeConversationId ?? null,
      ),
    [activeConversationId, conversationBranches],
  );
  const branchParent = React.useMemo(
    () =>
      activeConversationBranch
        ? (conversationBranches.find(
            ({ id }) => id === activeConversationBranch.parentConversationId,
          ) ?? null)
        : null,
    [activeConversationBranch, conversationBranches],
  );
  const visibleMessages = React.useMemo(() => {
    if (!activeConversationBranch) {
      return messages;
    }

    const checkpointIndex = messages.findIndex(
      ({ id }) => id === activeConversationBranch.branchMessageId,
    );
    return checkpointIndex >= 0 ? messages.slice(checkpointIndex) : messages;
  }, [activeConversationBranch, messages]);

  const requestBranch = (message: Message) => {
    if (!onBranchMessage) {
      return;
    }

    Alert.alert(t("createForkTitle"), t("createForkConfirmation"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("createFork"),
        onPress: () => {
          void onBranchMessage(message);
        },
      },
    ]);
  };

  useEffect(() => {
    setIsAtTranscriptTail(true);
    setEditingMessage(null);
    setEditingText("");
    setSavingCorrection(null);
    setBranchChoices([]);
  }, [activeConversationId]);

  const openBranchConversation = (
    conversationId: string,
    messageId: string,
  ) => {
    setBranchChoices([]);
    setBranchNavigationTarget((current) => ({
      conversationId,
      messageId,
      request: (current?.request ?? 0) + 1,
    }));
    void onSelectBranchConversation?.(conversationId);
  };

  if (!showWhenEmpty && messages.length === 0) {
    return null;
  }

  const usesCanvasPresentation =
    layout === "landscape" || presentation === "canvas";
  const usesPortraitCanvas = layout === "portrait" && presentation === "canvas";
  const showScrollToLatest =
    scrollEnabled && messages.length > 0 && !isAtTranscriptTail;
  const showHeaderControls =
    Boolean(onAddImage) ||
    (showStyleControl && Boolean(onOpenStyleSheet)) ||
    showScrollToLatest;

  return (
    <View
      testID="transcript-preview-card"
      style={[
        styles.transcriptShell,
        usesCanvasPresentation ? styles.transcriptShellCanvas : null,
        usesPortraitCanvas ? styles.transcriptShellPortraitCanvas : null,
        // transcriptShell's flex: 1 means flexBasis: 0, and in a flex parent
        // Yoga lets flexBasis beat height on the main axis. Inside an
        // auto-height parent (the sheet dialog body) there is no free space
        // to grow into, so a plain height here resolves to zero and the
        // transcript vanishes. Setting the basis itself keeps the requested
        // height while still letting the capped sheet shrink the card.
        preferredHeight
          ? { flexBasis: preferredHeight, flexGrow: 0, flexShrink: 1 }
          : null,
        style,
        {
          backgroundColor: usesCanvasPresentation
            ? "transparent"
            : colors.surface,
          borderColor: colors.border,
          shadowColor: colors.glow,
        },
      ]}
    >
      <View
        testID="transcript-preview-header"
        style={[
          styles.transcriptHeader,
          usesPortraitCanvas ? styles.transcriptHeaderPortraitCanvas : null,
          {
            borderBottomColor: colors.border,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View
          testID="transcript-header-copy"
          style={styles.transcriptHeaderCopy}
        >
          <Text
            testID="transcript-title"
            numberOfLines={1}
            style={[styles.transcriptTitle, { color: colors.text }]}
          >
            {activeConversationTitle ?? t("freshSession")}
          </Text>
        </View>

        {showHeaderControls ? (
          <View style={styles.transcriptHeaderControls}>
            {onAddImage ? (
              <IconButton
                testID="attach-image-control"
                icon="image"
                iconSize="control"
                style={styles.transcriptStyleControl}
                disabled={imageAttachmentDisabled}
                onPress={onAddImage}
                accessibilityLabel={t("addImage")}
              />
            ) : null}
            {showStyleControl && onOpenStyleSheet ? (
              <IconButton
                testID="conversation-style-control"
                icon="control"
                iconSize="control"
                style={styles.transcriptStyleControl}
                onPress={onOpenStyleSheet}
                accessibilityLabel={t("openStyleSheet")}
              />
            ) : null}
            {showScrollToLatest ? (
              <IconButton
                testID="scroll-to-latest-control"
                icon="down"
                iconSize="control"
                style={styles.transcriptStyleControl}
                onPress={() => {
                  setIsAtTranscriptTail(true);
                  setScrollToLatestRequest((request) => request + 1);
                }}
                accessibilityLabel={t("scrollToLatest")}
              />
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={styles.transcriptBody}>
        <ChatTranscript
          conversationId={activeConversationId}
          messages={visibleMessages}
          emptyTitle={t("noTranscriptYet")}
          emptyDescription={t("previewTranscriptEmptyDescription")}
          contentContainerStyle={styles.previewTranscriptContent}
          messageSelectionEnabled
          scrollEnabled={scrollEnabled}
          showUsageStats={showUsageStats}
          activeRepeatMessageId={activeReplayMessageId}
          onCopyMessage={onCopyMessage}
          onEditMessage={
            onEditMessage
              ? (message) => {
                  setEditingMessage(message);
                  setEditingText(message.content);
                }
              : undefined
          }
          branchChildrenByMessageId={branchChildrenByMessageId}
          branchOrigin={activeConversationBranch}
          branchParent={branchParent}
          onBranchMessage={onBranchMessage ? requestBranch : undefined}
          onOpenBranches={
            onSelectBranchConversation ? setBranchChoices : undefined
          }
          onOpenBranchSource={
            onSelectBranchConversation ? openBranchConversation : undefined
          }
          onRepeatMessage={onRepeatMessage}
          onRetryMessage={onRetryMessage}
          onRemoveMessage={onRemoveMessage}
          onOpenSpeakingSettings={onOpenSpeakingSettings}
          onShareMessage={onShareMessage}
          onReportMessage={onReportMessage}
          repeatPlaybackStatus={replayPhase}
          onTailStateChange={setIsAtTranscriptTail}
          scrollToLatestRequest={scrollToLatestRequest}
          scrollToMessageRequest={
            branchNavigationTarget?.conversationId === activeConversationId
              ? branchNavigationTarget
              : null
          }
        />
      </View>

      <Modal
        visible={editingMessage !== null}
        title={t("correctTranscriptTitle")}
        maskClosable={savingCorrection === null}
        onClose={() => {
          if (savingCorrection === null) {
            setEditingMessage(null);
            setEditingText("");
          }
        }}
        footer={[
          {
            text: t("cancel"),
            disabled: savingCorrection !== null,
            onPress: () => {
              setEditingMessage(null);
              setEditingText("");
            },
          },
          {
            text: t("save"),
            loading: savingCorrection === "save",
            disabled:
              savingCorrection !== null ||
              !editingText.trim() ||
              editingText.trim() === editingMessage?.content,
            onPress: () => {
              if (!editingMessage || !onEditMessage) {
                return;
              }
              setSavingCorrection("save");
              void onEditMessage(editingMessage, editingText)
                .then((saved) => {
                  if (saved) {
                    setEditingMessage(null);
                    setEditingText("");
                  }
                })
                .catch(() => undefined)
                .finally(() => setSavingCorrection(null));
            },
          },
          {
            text: t("saveAndSend"),
            tone: "success",
            loading: savingCorrection === "send",
            disabled:
              savingCorrection !== null ||
              !onBranchMessage ||
              !editingText.trim() ||
              editingText.trim() === editingMessage?.content,
            onPress: () => {
              if (!editingMessage || !onEditMessage || !onBranchMessage) {
                return;
              }
              setSavingCorrection("send");
              void onEditMessage(editingMessage, editingText)
                .then(async (saved) => {
                  if (!saved) {
                    return;
                  }
                  const branched = await onBranchMessage(editingMessage);
                  if (branched !== false) {
                    setEditingMessage(null);
                    setEditingText("");
                  }
                })
                .catch(() => undefined)
                .finally(() => setSavingCorrection(null));
            },
          },
        ]}
      >
        <View style={correctionStyles.body}>
          <Text
            style={[correctionStyles.hint, { color: colors.textSecondary }]}
          >
            {t("correctTranscriptHint")}
          </Text>
          <Input.TextArea
            testID="transcript-correction-input"
            autoFocus
            rows={8}
            value={editingText}
            disabled={savingCorrection !== null}
            onChangeText={setEditingText}
          />
        </View>
      </Modal>

      <Modal
        visible={branchChoices.length > 0}
        title={t("branchesFromMessage")}
        onClose={() => setBranchChoices([])}
        footer={[
          {
            text: t("done"),
            onPress: () => setBranchChoices([]),
          },
        ]}
      >
        <View style={correctionStyles.branchList}>
          {branchChoices.map((branch) => (
            <Pressable
              key={branch.id}
              testID={`message-branch-choice-${branch.id}`}
              style={({ pressed }) => [
                correctionStyles.branchChoice,
                {
                  backgroundColor: pressed
                    ? colors.accentSoft
                    : colors.surfaceAlt,
                  borderColor: colors.border,
                },
              ]}
              onPress={() =>
                openBranchConversation(
                  branch.id,
                  branch.branch?.branchMessageId ?? "",
                )
              }
              accessibilityRole="button"
              accessibilityLabel={branch.title}
            >
              <PhosphorIcon
                name="branch"
                size="control"
                color={colors.accent}
              />
              <Text
                style={[
                  correctionStyles.branchChoiceText,
                  { color: colors.text },
                ]}
                numberOfLines={2}
              >
                {branch.title}
              </Text>
              <PhosphorIcon
                name="right"
                size="compact"
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const correctionStyles = StyleSheet.create({
  body: { gap: 12 },
  hint: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  branchList: { gap: 8 },
  branchChoice: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  branchChoiceText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
  },
});
