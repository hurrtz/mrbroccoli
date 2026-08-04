import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { ChatBubble } from "./ChatBubble";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import type {
  ConversationBranchOrigin,
  ConversationMeta,
  Message,
} from "../types";

interface ChatTranscriptProps {
  messages: Message[];
  onTap?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  onCopyMessage?: (message: Message) => Promise<boolean>;
  onEditMessage?: (message: Message) => void;
  onBranchMessage?: (message: Message) => void;
  branchChildrenByMessageId?: ReadonlyMap<string, ConversationMeta[]>;
  branchOrigin?: ConversationBranchOrigin;
  branchParent?: ConversationMeta | null;
  onOpenBranches?: (branches: ConversationMeta[]) => void;
  onOpenBranchSource?: (
    conversationId: string,
    messageId: string,
  ) => void;
  onSaveInsightMessage?: (message: Message) => void;
  onShareMessage?: (message: Message) => void;
  onRepeatMessage?: (message: Message) => void;
  onRetryMessage?: (message: Message) => void;
  onOpenSpeakingSettings?: () => void;
  activeRepeatMessageId?: string | null;
  repeatPlaybackStatus?: "idle" | "preparing" | "speaking";
  messageSelectionEnabled?: boolean;
  showUsageStats?: boolean;
  conversationId?: string | null;
  onTailStateChange?: (isAtTail: boolean) => void;
  scrollToLatestRequest?: number;
  scrollToMessageRequest?: { messageId: string; request: number } | null;
}

const AT_TAIL_THRESHOLD_PX = 48;
const SCROLL_AWAY_DELTA_PX = 0.5;

export function getTranscriptDistanceFromBottom(event: NativeScrollEvent) {
  return Math.max(
    0,
    event.contentSize.height -
      event.layoutMeasurement.height -
      event.contentOffset.y,
  );
}

export function ChatTranscript({
  messages,
  onTap,
  emptyTitle,
  emptyDescription,
  contentContainerStyle,
  scrollEnabled = true,
  onCopyMessage,
  onEditMessage,
  onBranchMessage,
  branchChildrenByMessageId,
  branchOrigin,
  branchParent,
  onOpenBranches,
  onOpenBranchSource,
  onSaveInsightMessage,
  onShareMessage,
  onRepeatMessage,
  onRetryMessage,
  onOpenSpeakingSettings,
  activeRepeatMessageId = null,
  repeatPlaybackStatus = "idle",
  messageSelectionEnabled = false,
  showUsageStats = false,
  conversationId = null,
  onTailStateChange,
  scrollToLatestRequest = 0,
  scrollToMessageRequest = null,
}: ChatTranscriptProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const listRef = useRef<FlatList>(null);
  const followTailRef = useRef(true);
  const userScrollingRef = useRef(false);
  const userMovedAwayFromTailRef = useRef(false);
  const distanceFromBottomRef = useRef(0);
  const isAtTailRef = useRef(true);
  const tailScrollFrameRef = useRef<number | null>(null);
  const handledScrollRequestRef = useRef(scrollToLatestRequest);
  const handledMessageScrollRequestRef = useRef<number | null>(null);
  const conversationKey = useMemo(
    () => conversationId ?? messages[0]?.id ?? "empty-conversation",
    [conversationId, messages],
  );
  const latestUserMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === "user") {
        return messages[index].id;
      }
    }

    return null;
  }, [messages]);
  const submittedUserMessageRef = useRef({
    conversationKey,
    messageId: latestUserMessageId,
  });
  const resolvedEmptyTitle = emptyTitle ?? t("yourConversationAppearsHere");
  const resolvedEmptyDescription =
    emptyDescription ?? t("defaultTranscriptEmptyDescription");

  const setTailState = useCallback(
    (isAtTail: boolean) => {
      if (isAtTailRef.current === isAtTail) {
        return;
      }

      isAtTailRef.current = isAtTail;
      onTailStateChange?.(isAtTail);
    },
    [onTailStateChange],
  );

  const scrollToTail = useCallback(
    (animated: boolean) => {
      followTailRef.current = true;
      userMovedAwayFromTailRef.current = false;
      distanceFromBottomRef.current = 0;
      setTailState(true);
      listRef.current?.scrollToEnd({ animated });
    },
    [setTailState],
  );

  const scheduleScrollToTail = useCallback(
    (animated: boolean) => {
      if (tailScrollFrameRef.current !== null) {
        cancelAnimationFrame(tailScrollFrameRef.current);
      }

      tailScrollFrameRef.current = requestAnimationFrame(() => {
        tailScrollFrameRef.current = null;
        if (followTailRef.current && !userScrollingRef.current) {
          scrollToTail(animated);
        }
      });
    },
    [scrollToTail],
  );

  useEffect(
    () => () => {
      if (tailScrollFrameRef.current !== null) {
        cancelAnimationFrame(tailScrollFrameRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    followTailRef.current = true;
    userScrollingRef.current = false;
    userMovedAwayFromTailRef.current = false;
    distanceFromBottomRef.current = 0;
    setTailState(true);
    if (messages.length === 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
    // Message updates must not re-enable tail following after the user scrolls
    // away; this reset is intentionally scoped to conversation changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey, setTailState]);

  useEffect(() => {
    const previous = submittedUserMessageRef.current;

    if (previous.conversationKey !== conversationKey) {
      submittedUserMessageRef.current = {
        conversationKey,
        messageId: latestUserMessageId,
      };
      return;
    }

    if (!latestUserMessageId || previous.messageId === latestUserMessageId) {
      return;
    }

    submittedUserMessageRef.current = {
      conversationKey,
      messageId: latestUserMessageId,
    };

    // A newly submitted prompt starts a fresh exchange. Always bring it into
    // view and resume following, even if the reader had inspected an older
    // message immediately before sending.
    scrollToTail(false);
  }, [conversationKey, latestUserMessageId, scrollToTail]);

  useEffect(() => {
    if (handledScrollRequestRef.current === scrollToLatestRequest) {
      return;
    }

    handledScrollRequestRef.current = scrollToLatestRequest;
    scrollToTail(true);
  }, [scrollToLatestRequest, scrollToTail]);

  useEffect(() => {
    if (
      !scrollToMessageRequest ||
      handledMessageScrollRequestRef.current ===
        scrollToMessageRequest.request
    ) {
      return;
    }

    const index = messages.findIndex(
      (message) => message.id === scrollToMessageRequest.messageId,
    );
    if (index < 0) {
      return;
    }

    handledMessageScrollRequestRef.current = scrollToMessageRequest.request;
    followTailRef.current = false;
    listRef.current?.scrollToIndex({
      animated: true,
      index,
      viewPosition: 0.35,
    });
  }, [messages, scrollToMessageRequest]);

  const handleContentSizeChange = useCallback(() => {
    if (
      messages.length === 0 ||
      !followTailRef.current ||
      userScrollingRef.current
    ) {
      return;
    }

    // Streaming replies can resize the list many times per second. Keeping the
    // tail anchored without starting overlapping native scroll animations is
    // both smoother and more deterministic on iOS.
    scheduleScrollToTail(false);
  }, [messages.length, scheduleScrollToTail]);

  const handleLayout = useCallback(
    (_event: LayoutChangeEvent) => {
      if (
        messages.length === 0 ||
        !followTailRef.current ||
        userScrollingRef.current
      ) {
        return;
      }

      // A transcript inside a hidden Modal can receive its content size before
      // it has a visible viewport. Retry once the viewport is laid out so the
      // initial scroll does not become a no-op on iOS.
      scheduleScrollToTail(false);
    },
    [messages.length, scheduleScrollToTail],
  );

  const updateUserScrollPosition = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const distanceFromBottom = getTranscriptDistanceFromBottom(
        event.nativeEvent,
      );
      const previousDistanceFromBottom = distanceFromBottomRef.current;
      distanceFromBottomRef.current = distanceFromBottom;
      const isAtTail = distanceFromBottom <= AT_TAIL_THRESHOLD_PX;

      // Programmatic tail jumps can emit intermediate scroll positions on
      // iOS. They must not re-show the jump control after `scrollToTail`
      // already declared the transcript followed. Only a user interaction may
      // move the public tail state away from the end.
      if (!userScrollingRef.current) {
        if (isAtTail) {
          setTailState(true);
        }
        return;
      }

      setTailState(isAtTail);

      const movingAwayFromTail =
        distanceFromBottom > previousDistanceFromBottom + SCROLL_AWAY_DELTA_PX;

      if (movingAwayFromTail) {
        userMovedAwayFromTailRef.current = true;
        followTailRef.current = false;
      } else if (isAtTail) {
        userMovedAwayFromTailRef.current = false;
        followTailRef.current = true;
      }
    },
    [setTailState],
  );

  const handleScrollBeginDrag = useCallback(() => {
    if (tailScrollFrameRef.current !== null) {
      cancelAnimationFrame(tailScrollFrameRef.current);
      tailScrollFrameRef.current = null;
    }
    userScrollingRef.current = true;
    userMovedAwayFromTailRef.current = false;
  }, []);

  const handleScrollInteractionEnd = useCallback(() => {
    const isAtTail = distanceFromBottomRef.current <= AT_TAIL_THRESHOLD_PX;
    followTailRef.current = isAtTail && !userMovedAwayFromTailRef.current;
    userScrollingRef.current = false;
    userMovedAwayFromTailRef.current = false;
    setTailState(isAtTail);
  }, [setTailState]);

  const handleTouchStart = useCallback(() => {
    if (tailScrollFrameRef.current !== null) {
      cancelAnimationFrame(tailScrollFrameRef.current);
      tailScrollFrameRef.current = null;
    }

    // iOS does not report `onScrollBeginDrag` until the finger has already
    // moved. Pause auto-follow on touch-down so a streaming content-size
    // update cannot pull the list back to the tail during that dead zone.
    userScrollingRef.current = true;
    userMovedAwayFromTailRef.current = false;
    onTap?.();
  }, [onTap]);

  return (
    <FlatList
      ref={listRef}
      testID="chat-transcript-list"
      style={styles.listView}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatBubble
          message={item}
          branchChildren={branchChildrenByMessageId?.get(item.id)}
          branchOrigin={
            branchOrigin && branchOrigin.branchMessageId === item.id
              ? {
                  ...branchOrigin,
                  parentAvailable: Boolean(branchParent),
                  parentTitle: branchParent?.title,
                }
              : undefined
          }
          onCopy={onCopyMessage}
          onEdit={onEditMessage}
          onBranch={onBranchMessage}
          onOpenBranches={onOpenBranches}
          onOpenBranchSource={onOpenBranchSource}
          onSaveInsight={onSaveInsightMessage}
          onShare={onShareMessage}
          onRepeat={onRepeatMessage}
          onRetry={onRetryMessage}
          onOpenSpeakingSettings={onOpenSpeakingSettings}
          repeatState={
            activeRepeatMessageId === item.id ? repeatPlaybackStatus : "idle"
          }
          selectable={messageSelectionEnabled}
          showUsageStats={showUsageStats}
        />
      )}
      contentContainerStyle={[
        styles.list,
        messages.length === 0 ? styles.listEmpty : null,
        contentContainerStyle,
      ]}
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <PhosphorIcon
            testID="empty-transcript-icon"
            name="info-circle"
            size="navigation"
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {resolvedEmptyTitle}
          </Text>
          <Text
            style={[styles.emptyDescription, { color: colors.textSecondary }]}
          >
            {resolvedEmptyDescription}
          </Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      scrollEventThrottle={16}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
      onScrollToIndexFailed={({ averageItemLength, index }) => {
        listRef.current?.scrollToOffset({
          animated: false,
          offset: Math.max(0, averageItemLength * index),
        });
        requestAnimationFrame(() => {
          listRef.current?.scrollToIndex({
            animated: true,
            index,
            viewPosition: 0.35,
          });
        });
      }}
      onScroll={updateUserScrollPosition}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollInteractionEnd}
      onMomentumScrollBegin={handleScrollBeginDrag}
      onMomentumScrollEnd={handleScrollInteractionEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleScrollInteractionEnd}
      onTouchCancel={handleScrollInteractionEnd}
    />
  );
}

const styles = StyleSheet.create({
  listView: {
    flex: 1,
  },
  list: { paddingVertical: 10, paddingBottom: 24 },
  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  emptyCard: {
    paddingHorizontal: 26,
    paddingVertical: 22,
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  emptyTitle: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    fontFamily: fonts.display,
  },
  emptyDescription: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
