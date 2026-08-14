import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { getProviderLabel, getProviderModelName } from "../constants/models";
import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../design-system/PhosphorIcon";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import type { Message, Provider } from "../types";
import { formatTokenCount } from "../utils/usageStats";
import { MessageImageAttachments } from "./MessageImageAttachments";
import { ProviderIcon } from "./ProviderIcon";
import { ConversationKnowledgeReferences } from "./chatBubble/ConversationKnowledgeReferences";
import { MessageBranchIndicator } from "./chatBubble/MessageBranchIndicator";
import { PipelineNotices } from "./chatBubble/PipelineNotices";
import { ReplyFailureCard } from "./chatBubble/ReplyFailureCard";
import type { ChatBubbleProps, RepeatState } from "./chatBubble/types";

interface TranscriptMessageProps extends Pick<
  ChatBubbleProps,
  | "branchChildren"
  | "branchOrigin"
  | "message"
  | "onBranch"
  | "onCopy"
  | "onOpenBranches"
  | "onOpenBranchSource"
  | "onOpenSpeakingSettings"
  | "onRepeat"
  | "onRetry"
  | "onShare"
  | "selectable"
  | "showUsageStats"
> {
  expanded: boolean;
  last: boolean;
  onRemove?: (message: Message) => void;
  onToggle: () => void;
  repeatState?: RepeatState;
}

interface MetricRow {
  label: string;
  value: string;
}

const messageTimestampFormatters = new Map<string, Intl.DateTimeFormat>();

// The transcript's name line carries the time alone — the drawer row and
// status line own the date and age of a conversation.
function formatTimestamp(timestamp: string, locale: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  let formatter = messageTimestampFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    messageTimestampFormatters.set(locale, formatter);
  }

  return formatter.format(date);
}

function formatDuration(durationMs?: number) {
  if (durationMs === undefined) {
    return null;
  }
  return durationMs < 1_000
    ? `${Math.round(durationMs)} ms`
    : `${(durationMs / 1_000).toFixed(durationMs < 10_000 ? 1 : 0)} s`;
}

function getCouncilProviders(message: Message) {
  const contributions = message.metadata?.ulraMode?.contributions ?? [];
  const providersByParticipant = new Map<string, Provider>();

  contributions.forEach((entry, index) => {
    const participantKey = entry.participant
      ? `participant:${entry.participant}`
      : `${entry.modeId}:${index}`;
    if (!providersByParticipant.has(participantKey)) {
      providersByParticipant.set(participantKey, entry.provider);
    }
  });

  return [...providersByParticipant.values()];
}

function formatRoute(
  provider: Provider | null,
  model: string,
  gateway?: string,
  upstreamProvider?: string,
) {
  const route = provider
    ? `${getProviderLabel(provider)} · ${getProviderModelName(provider, model)}`
    : model;
  const execution = upstreamProvider
    ? `${gateway ?? (provider ? getProviderLabel(provider) : "")} → ${upstreamProvider}`
    : gateway;
  return [route, execution].filter(Boolean).join(" · ");
}

function getTranscriptMeta(
  message: Message,
  t: ReturnType<typeof useLocalization>["t"],
) {
  if (message.role !== "assistant") {
    return null;
  }

  const receipt = message.metadata?.turnReceipt;
  const search = message.metadata?.webSearch;
  const duration = formatDuration(
    receipt?.timing.totalMs ?? receipt?.timing.replyReadyMs,
  );
  const route = receipt?.actualRoute.gateway
    ? receipt.actualRoute.gateway
    : receipt?.actualRoute.provider
      ? getProviderLabel(receipt.actualRoute.provider)
      : message.provider
        ? getProviderLabel(message.provider)
        : null;

  return [
    search ? t("webSearchSourceCount", { count: search.sources.length }) : null,
    route,
    duration,
  ]
    .filter(Boolean)
    .join(" · ");
}

function getTranscriptMetrics(
  message: Message,
  t: ReturnType<typeof useLocalization>["t"],
): MetricRow[] {
  const rows: MetricRow[] = [];
  const receipt = message.metadata?.turnReceipt;
  const usage = message.usage;
  const search = message.metadata?.webSearch;
  const council = message.metadata?.ulraMode;

  if (receipt) {
    rows.push(
      {
        label: t("turnReceiptRequested"),
        value: formatRoute(
          receipt.requestedRoute.provider,
          receipt.requestedRoute.model,
          receipt.requestedRoute.gateway,
          receipt.requestedRoute.upstreamProvider,
        ),
      },
      {
        label: t("turnReceiptActual"),
        value: formatRoute(
          receipt.actualRoute.provider,
          receipt.actualRoute.model,
          receipt.actualRoute.gateway,
          receipt.actualRoute.upstreamProvider,
        ),
      },
    );
    if (receipt.effort) {
      rows.push({
        label: t("turnReceiptEffort"),
        value: receipt.effort.label,
      });
    }
    const timing = [
      receipt.timing.transcriptionMs !== undefined
        ? `${t("turnReceiptTimingStt")} ${formatDuration(receipt.timing.transcriptionMs)}`
        : null,
      receipt.timing.contextMs !== undefined
        ? `${t("turnReceiptTimingContext")} ${formatDuration(receipt.timing.contextMs)}`
        : null,
      receipt.timing.webSearchMs !== undefined
        ? `${t("turnReceiptTimingSearch")} ${formatDuration(receipt.timing.webSearchMs)}`
        : null,
      receipt.timing.modelMs !== undefined
        ? `${t("turnReceiptTimingModel")} ${formatDuration(receipt.timing.modelMs)}`
        : null,
      receipt.timing.firstSpeechMs !== undefined
        ? `${t("turnReceiptTimingFirstSpeech")} ${formatDuration(receipt.timing.firstSpeechMs)}`
        : null,
      receipt.timing.totalMs !== undefined
        ? `${t("turnReceiptTimingTotal")} ${formatDuration(receipt.timing.totalMs)}`
        : null,
    ].filter(Boolean);
    if (timing.length > 0) {
      rows.push({ label: t("turnReceiptTiming"), value: timing.join(" · ") });
    }
  }

  if (usage) {
    rows.push({
      label: t("estimatedUsageTitle"),
      value: t("estimatedUsageInline", {
        prompt: formatTokenCount(usage.promptTokens),
        completion: formatTokenCount(usage.completionTokens),
        total: formatTokenCount(usage.totalTokens),
      }),
    });
  }

  if (search) {
    rows.push({ label: t("searchQuery"), value: search.query });
    if (search.summary.trim()) {
      rows.push({ label: t("webSearch"), value: search.summary });
    }
    search.sources.forEach((source, index) => {
      rows.push({
        label: `${t("sources")} ${index + 1}`,
        value: `${source.title} · ${source.url}`,
      });
    });
  }

  if (council) {
    rows.push({
      label: t("uberAuditTitle"),
      value: t("uberAuditSummary", {
        failed: council.failedCalls,
        rounds: council.roundsCompleted,
        successful: council.successfulCalls,
      }),
    });
  }

  return rows;
}

function TranscriptAction({
  icon,
  label,
  onPress,
}: {
  icon: PhosphorIconName;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={styles.action}
      onPress={onPress}
      activeOpacity={0.72}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <PhosphorIcon name={icon} size="compact" color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export const TranscriptMessage = React.memo(function TranscriptMessage({
  branchChildren,
  branchOrigin,
  expanded,
  last,
  message,
  onBranch,
  onCopy,
  onOpenBranches,
  onOpenBranchSource,
  onOpenSpeakingSettings,
  onRemove,
  onRepeat,
  onRetry,
  onShare,
  onToggle,
  repeatState = "idle",
  selectable = false,
  showUsageStats = false,
}: TranscriptMessageProps) {
  const { colors } = useTheme();
  const { locale, t } = useLocalization();
  const [metricsOpen, setMetricsOpen] = React.useState(false);
  const isUser = message.role === "user";
  const paragraphs = message.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const canFold = paragraphs.length > 1 || message.content.trim().length > 150;
  const councilProviders = getCouncilProviders(message);
  const timestamp = formatTimestamp(message.timestamp, locale);
  const modelLabel =
    message.provider && message.model
      ? getProviderModelName(message.provider, message.model)
      : message.model;
  const meta = showUsageStats ? getTranscriptMeta(message, t) : null;
  const metrics = showUsageStats ? getTranscriptMetrics(message, t) : [];
  const actions = expanded
    ? [
        onBranch
          ? {
              icon: "branch" as const,
              label: t("branchFromHere"),
              onPress: () => void onBranch(message),
            }
          : null,
        onCopy
          ? {
              icon: "copy" as const,
              label: t("copy"),
              onPress: () => void onCopy(message),
            }
          : null,
        onShare
          ? {
              icon: "share-alt" as const,
              label: t("share"),
              onPress: () => onShare(message),
            }
          : null,
        onRepeat
          ? {
              icon: (repeatState === "speaking"
                ? "stop"
                : repeatState === "preparing"
                  ? "loading"
                  : "sound") as PhosphorIconName,
              label: repeatState === "speaking" ? t("stop") : t("repeatReply"),
              onPress: () => onRepeat(message),
            }
          : null,
      ].filter((action): action is NonNullable<typeof action> =>
        Boolean(action),
      )
    : [];

  const renderRightActions = onRemove
    ? () => (
        <TouchableOpacity
          testID={`transcript-remove-${message.id}`}
          style={[styles.removeAction, { backgroundColor: colors.dangerFill }]}
          onPress={() => onRemove(message)}
          accessibilityRole="button"
          accessibilityLabel={t("remove")}
        >
          <PhosphorIcon name="delete" size="compact" color={colors.onDanger} />
          <Text style={[styles.removeText, { color: colors.onDanger }]}>
            {t("remove")}
          </Text>
        </TouchableOpacity>
      )
    : undefined;

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View
        testID={`transcript-message-${message.id}`}
        style={[styles.row, { backgroundColor: colors.background }]}
      >
        <View
          testID={`transcript-speaker-${message.id}`}
          style={styles.speakerColumn}
          importantForAccessibility="no"
        >
          {isUser ? (
            <Text style={[styles.you, { color: colors.accent }]}>
              {t("you")}
            </Text>
          ) : message.provider ? (
            <ProviderIcon
              provider={message.provider}
              color={colors.textSecondary}
              size="compact"
            />
          ) : (
            <PhosphorIcon
              name="cpu"
              size="compact"
              color={colors.textSecondary}
            />
          )}
          <View
            style={[
              styles.threadLine,
              {
                backgroundColor: last ? "transparent" : colors.border,
              },
            ]}
          />
        </View>

        <View style={styles.messageContent}>
          {branchOrigin ? (
            <MessageBranchIndicator
              messageId={message.id}
              branchOrigin={branchOrigin}
              onOpenBranchSource={onOpenBranchSource}
            />
          ) : null}
          <TouchableOpacity
            testID={`transcript-toggle-${message.id}`}
            onPress={onToggle}
            activeOpacity={0.78}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
          >
            <View style={styles.nameLine}>
              {!isUser && councilProviders.length > 0 ? (
                <View style={styles.councilLine}>
                  <Text
                    style={[styles.modelLabel, { color: colors.textSecondary }]}
                  >
                    {t("workspaceCouncilLabel")}
                  </Text>
                  {councilProviders.map((provider, index) => (
                    <ProviderIcon
                      key={`${message.id}-council-${provider}-${index}`}
                      provider={provider}
                      color={colors.textSecondary}
                      size="inline"
                    />
                  ))}
                </View>
              ) : !isUser && modelLabel ? (
                <Text
                  numberOfLines={1}
                  style={[styles.modelLabel, { color: colors.textSecondary }]}
                >
                  {modelLabel}
                </Text>
              ) : null}
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                {message.editedAt
                  ? `${timestamp} · ${t("transcriptEdited")}`
                  : timestamp}
              </Text>
              {canFold ? (
                <View style={styles.foldIcon}>
                  <PhosphorIcon
                    name={expanded ? "up" : "down"}
                    size="inline"
                    color={colors.textMuted}
                  />
                </View>
              ) : null}
            </View>
            <MessageImageAttachments
              attachments={message.attachments ?? []}
              colors={colors}
              t={t}
            />
            {expanded ? (
              <View style={styles.paragraphs}>
                {paragraphs.map((paragraph, index) => (
                  <Text
                    key={`${message.id}-paragraph-${index}`}
                    selectable={selectable}
                    style={[
                      styles.body,
                      isUser ? styles.userBody : null,
                      {
                        color: isUser ? colors.textSecondary : colors.text,
                      },
                    ]}
                  >
                    {paragraph}
                  </Text>
                ))}
              </View>
            ) : (
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                selectable={selectable}
                style={[
                  styles.body,
                  isUser ? styles.userBody : null,
                  { color: isUser ? colors.textSecondary : colors.text },
                ]}
              >
                {paragraphs.join(" ")}
              </Text>
            )}
          </TouchableOpacity>

          <MessageBranchIndicator
            messageId={message.id}
            branchChildren={branchChildren}
            onOpenBranches={onOpenBranches}
          />

          {actions.length > 0 ? (
            <View style={styles.actions}>
              {actions.map((action) => (
                <TranscriptAction key={action.label} {...action} />
              ))}
            </View>
          ) : null}

          {meta ? (
            <TouchableOpacity
              testID={`transcript-meta-${message.id}`}
              disabled={metrics.length === 0}
              onPress={() => setMetricsOpen((current) => !current)}
              activeOpacity={0.72}
              style={styles.metaDisclosure}
              accessibilityRole={metrics.length > 0 ? "button" : undefined}
              accessibilityState={
                metrics.length > 0 ? { expanded: metricsOpen } : undefined
              }
            >
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {meta}
              </Text>
              {metrics.length > 0 ? (
                <PhosphorIcon
                  name={metricsOpen ? "up" : "down"}
                  size="inline"
                  color={colors.textMuted}
                />
              ) : null}
            </TouchableOpacity>
          ) : null}

          {metricsOpen && metrics.length > 0 ? (
            <View
              testID={`transcript-metrics-${message.id}`}
              style={[
                styles.metrics,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {metrics.map((metric, index) => (
                <View key={`${metric.label}-${index}`} style={styles.metricRow}>
                  <Text
                    style={[styles.metricLabel, { color: colors.textMuted }]}
                  >
                    {metric.label}
                  </Text>
                  <Text
                    selectable
                    style={[
                      styles.metricValue,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {metric.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <ReplyFailureCard message={message} onRetry={onRetry} />
          <PipelineNotices
            message={message}
            onRepeat={onRepeat}
            onOpenSpeakingSettings={onOpenSpeakingSettings}
          />
          <ConversationKnowledgeReferences message={message} />
        </View>
      </View>
    </Swipeable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  speakerColumn: {
    width: 34,
    flexShrink: 0,
    alignItems: "center",
    gap: 4,
    paddingTop: 2,
  },
  you: {
    fontFamily: fonts.display,
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  // The design system draws the thread at 1.5pt; a hairline all but
  // disappears against the canvas.
  threadLine: {
    width: 1.5,
    flex: 1,
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  nameLine: {
    minHeight: 18,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 2,
  },
  councilLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  modelLabel: {
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
  },
  timestamp: {
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 16,
  },
  foldIcon: {
    marginLeft: "auto",
    alignSelf: "center",
  },
  paragraphs: {
    gap: 8,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  userBody: {
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -6,
    marginLeft: -12,
  },
  action: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  metaDisclosure: {
    minHeight: 28,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.4,
  },
  metrics: {
    marginTop: 2,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  metricLabel: {
    width: 76,
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  metricValue: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
  },
  removeAction: {
    width: 96,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  removeText: {
    fontFamily: fonts.display,
    fontSize: 13,
  },
});
