import React, { useEffect, useState } from "react";
import {
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
import type { TranslationKey } from "../../i18n";
import { Colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import type { ConversationArtifactKind, Message } from "../../types";

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
  onForkMessage?: (message: Message) => void;
  onSaveInsight?: (
    message: Message,
    kind: ConversationArtifactKind,
    text: string,
  ) => Promise<boolean>;
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

const ARTIFACT_CHOICES = [
  { kind: "decision", label: "artifactDecision" },
  { kind: "idea", label: "artifactIdea" },
  { kind: "assumption", label: "artifactAssumption" },
  { kind: "counterargument", label: "artifactCounterargument" },
  { kind: "question", label: "artifactQuestion" },
  { kind: "hypothesis", label: "artifactHypothesis" },
  { kind: "action", label: "artifactAction" },
] satisfies {
  kind: ConversationArtifactKind;
  label: TranslationKey;
}[];

export function TranscriptPreviewCard({
  activeConversationId,
  activeConversationTitle,
  colors,
  layout = "portrait",
  messages,
  activeReplayMessageId = null,
  onCopyMessage,
  onEditMessage,
  onForkMessage,
  onSaveInsight,
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
  const [insightMessage, setInsightMessage] = useState<Message | null>(null);
  const [insightKind, setInsightKind] =
    useState<ConversationArtifactKind>("decision");
  const [insightText, setInsightText] = useState("");
  const [savingInsight, setSavingInsight] = useState(false);

  useEffect(() => {
    setIsAtTranscriptTail(true);
    setEditingMessage(null);
    setEditingText("");
    setInsightMessage(null);
    setInsightText("");
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
          onForkMessage={onForkMessage}
          onSaveInsightMessage={
            onSaveInsight
              ? (message) => {
                  setInsightMessage(message);
                  setInsightKind("decision");
                  setInsightText(message.content);
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
            style={[correctionStyles.hint, { color: colors.textSecondary }]}
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

      <Modal
        visible={insightMessage !== null}
        title={t("saveInsightTitle")}
        maskClosable={!savingInsight}
        onClose={() => {
          if (!savingInsight) {
            setInsightMessage(null);
            setInsightText("");
          }
        }}
        footer={[
          {
            text: t("cancel"),
            disabled: savingInsight,
            onPress: () => {
              setInsightMessage(null);
              setInsightText("");
            },
          },
          {
            text: t("save"),
            loading: savingInsight,
            disabled: savingInsight || !insightText.trim(),
            onPress: () => {
              if (!insightMessage || !onSaveInsight) {
                return;
              }
              setSavingInsight(true);
              void onSaveInsight(insightMessage, insightKind, insightText)
                .then((saved) => {
                  if (saved) {
                    setInsightMessage(null);
                    setInsightText("");
                  }
                })
                .catch(() => undefined)
                .finally(() => setSavingInsight(false));
            },
          },
        ]}
      >
        <View style={correctionStyles.body}>
          <Text
            style={[correctionStyles.hint, { color: colors.textSecondary }]}
          >
            {t("saveInsightHint")}
          </Text>
          <Text style={[insightStyles.fieldLabel, { color: colors.text }]}>
            {t("artifactType")}
          </Text>
          <View style={insightStyles.choiceList}>
            {ARTIFACT_CHOICES.map((choice) => {
              const selected = choice.kind === insightKind;
              return (
                <Pressable
                  key={choice.kind}
                  testID={`insight-kind-${choice.kind}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  disabled={savingInsight}
                  onPress={() => setInsightKind(choice.kind)}
                  style={({ pressed }) => [
                    insightStyles.choice,
                    {
                      backgroundColor: selected
                        ? colors.accentSoft
                        : colors.surfaceElevated,
                      borderColor: selected ? colors.accent : colors.border,
                      opacity: pressed ? 0.76 : 1,
                    },
                  ]}
                >
                  <PhosphorIcon
                    name={selected ? "radio-selected" : "radio-unselected"}
                    size="control"
                    color={selected ? colors.accent : colors.textSecondary}
                  />
                  <Text
                    style={[insightStyles.choiceLabel, { color: colors.text }]}
                  >
                    {t(choice.label)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Input.TextArea
            testID="insight-text-input"
            rows={6}
            value={insightText}
            disabled={savingInsight}
            onChangeText={setInsightText}
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

const insightStyles = StyleSheet.create({
  fieldLabel: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  choiceList: { gap: 8 },
  choice: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  choiceLabel: { flex: 1, fontFamily: fonts.body, fontSize: 14 },
});
