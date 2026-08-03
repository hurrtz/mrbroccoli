import React, { useEffect, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { ChatTranscript } from "../../components/ChatTranscript";
import { IconButton } from "../../design-system/IconButton";
import { Input, Modal } from "../../design-system/NativeControls";
import { Colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { Message } from "../../types";

import { TranslateFn } from "./shared";
import { styles } from "./styles";

interface TranscriptPreviewCardProps {
  activeConversationId?: string | null;
  activeConversationTitle?: string;
  colors: Colors;
  layout?: "portrait" | "landscape";
  messages: Message[];
  activeReplayMessageId?: string | null;
  onCopyMessage: (message: Message) => Promise<boolean>;
  onEditMessage?: (message: Message, content: string) => Promise<boolean>;
  onRepeatMessage?: (message: Message) => void;
  onRetryMessage: (message: Message) => void;
  onOpenStyleSheet?: () => void;
  onOpenSpeakingSettings?: () => void;
  onShareMessage?: (message: Message) => void;
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
  colors,
  layout = "portrait",
  messages,
  activeReplayMessageId = null,
  onCopyMessage,
  onEditMessage,
  onRepeatMessage,
  onRetryMessage,
  onOpenStyleSheet,
  onOpenSpeakingSettings,
  onShareMessage,
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
  const [savingCorrection, setSavingCorrection] = useState(false);

  useEffect(() => {
    setIsAtTranscriptTail(true);
    setEditingMessage(null);
    setEditingText("");
  }, [activeConversationId]);

  if (!showWhenEmpty && messages.length === 0) {
    return null;
  }

  const usesCanvasPresentation =
    layout === "landscape" || presentation === "canvas";
  const usesPortraitCanvas = layout === "portrait" && presentation === "canvas";
  const showScrollToLatest =
    scrollEnabled && messages.length > 0 && !isAtTranscriptTail;
  const showHeaderControls =
    (showStyleControl && Boolean(onOpenStyleSheet)) || showScrollToLatest;

  return (
    <View
      testID="transcript-preview-card"
      style={[
        styles.transcriptShell,
        usesCanvasPresentation ? styles.transcriptShellCanvas : null,
        usesPortraitCanvas ? styles.transcriptShellPortraitCanvas : null,
        preferredHeight ? { height: preferredHeight } : null,
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
          messages={messages}
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
          onRepeatMessage={onRepeatMessage}
          onRetryMessage={onRetryMessage}
          onOpenSpeakingSettings={onOpenSpeakingSettings}
          onShareMessage={onShareMessage}
          repeatPlaybackStatus={replayPhase}
          onTailStateChange={setIsAtTranscriptTail}
          scrollToLatestRequest={scrollToLatestRequest}
        />
      </View>

      <Modal
        visible={editingMessage !== null}
        title={t("correctTranscriptTitle")}
        maskClosable={!savingCorrection}
        onClose={() => {
          if (!savingCorrection) {
            setEditingMessage(null);
            setEditingText("");
          }
        }}
        footer={[
          {
            text: t("cancel"),
            disabled: savingCorrection,
            onPress: () => {
              setEditingMessage(null);
              setEditingText("");
            },
          },
          {
            text: t("save"),
            loading: savingCorrection,
            disabled:
              savingCorrection ||
              !editingText.trim() ||
              editingText.trim() === editingMessage?.content,
            onPress: () => {
              if (!editingMessage || !onEditMessage) {
                return;
              }
              setSavingCorrection(true);
              void onEditMessage(editingMessage, editingText)
                .then((saved) => {
                  if (saved) {
                    setEditingMessage(null);
                    setEditingText("");
                  }
                })
                .catch(() => undefined)
                .finally(() => setSavingCorrection(false));
            },
          },
        ]}
      >
        <View style={correctionStyles.body}>
          <Text
            style={[
              correctionStyles.hint,
              { color: colors.textSecondary },
            ]}
          >
            {t("correctTranscriptHint")}
          </Text>
          <Input.TextArea
            testID="transcript-correction-input"
            autoFocus
            rows={8}
            value={editingText}
            disabled={savingCorrection}
            onChangeText={setEditingText}
          />
        </View>
      </Modal>
    </View>
  );
}

const correctionStyles = StyleSheet.create({
  body: { gap: 12 },
  hint: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
});
