import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

import {
  getProviderModelName,
  PROVIDER_LABELS,
} from "../../constants/models";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type {
  Message,
  MessageTurnReceipt,
  Provider,
} from "../../types";
import { styles } from "./styles";

function formatDuration(durationMs?: number) {
  if (durationMs === undefined) {
    return "—";
  }

  return durationMs < 1_000
    ? `${Math.round(durationMs)} ms`
    : `${(durationMs / 1_000).toFixed(durationMs < 10_000 ? 1 : 0)} s`;
}

function formatRoute(
  provider: Provider,
  model: string,
  gateway?: string,
  upstreamProvider?: string,
  strategy?: string,
  attempts?: number,
) {
  const route = `${PROVIDER_LABELS[provider]} · ${getProviderModelName(
    provider,
    model,
  )}`;
  const execution = upstreamProvider
    ? `${gateway ?? PROVIDER_LABELS[provider]} → ${upstreamProvider}`
    : gateway;

  return [
    route,
    execution,
    strategy,
    attempts && attempts > 1 ? `×${attempts}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}

function ReceiptRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.turnReceiptRow}>
      <Text style={[styles.turnReceiptLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
      <Text
        selectable
        style={[
          styles.turnReceiptValue,
          mono ? styles.turnReceiptValueMono : null,
          { color: colors.textSecondary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function formatInput(
  receipt: MessageTurnReceipt,
  t: ReturnType<typeof useLocalization>["t"],
) {
  const source =
    receipt.input.source === "voice"
      ? t("turnReceiptVoiceInput")
      : t("turnReceiptTypedInput");

  if (receipt.input.mode === "native") {
    return `${source} · ${t("turnReceiptSystemSpeech")}`;
  }

  const provider = receipt.input.provider
    ? PROVIDER_LABELS[receipt.input.provider]
    : t("unavailable");
  return [source, provider, receipt.input.model].filter(Boolean).join(" · ");
}

function formatSearch(
  receipt: MessageTurnReceipt,
  t: ReturnType<typeof useLocalization>["t"],
) {
  const search = receipt.webSearch;

  if (search.mode === "off") {
    return t("turnReceiptOff");
  }
  if (!search.ready) {
    return t("turnReceiptNotConfigured");
  }
  if (search.fellBack) {
    return t("turnReceiptFallbackWithoutSearch");
  }
  if (!search.used) {
    return t("turnReceiptNotUsed");
  }

  return [
    search.provider ? PROVIDER_LABELS[search.provider] : undefined,
    search.model,
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatSpeech(
  receipt: MessageTurnReceipt,
  t: ReturnType<typeof useLocalization>["t"],
) {
  const speech = receipt.speechOutput;

  if (!speech.enabled || speech.actualMode === "off") {
    return t("turnReceiptOff");
  }
  if (speech.actualMode === "native") {
    return speech.fellBack
      ? t("turnReceiptSystemVoiceFallback")
      : `${t("turnReceiptSystemVoice")} · ${speech.voice ?? "—"}`;
  }
  if (speech.actualMode === "kokoro") {
    return ["Kokoro", speech.voice].filter(Boolean).join(" · ");
  }

  return [
    speech.provider ? PROVIDER_LABELS[speech.provider] : undefined,
    speech.model,
    speech.voice,
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatContext(
  receipt: MessageTurnReceipt,
  t: ReturnType<typeof useLocalization>["t"],
) {
  const context = receipt.context;
  const states = [
    context.existingSummaryReused
      ? t("turnReceiptSummaryReused")
      : undefined,
    context.summaryUpdated ? t("turnReceiptSummaryUpdated") : undefined,
    context.fallbackUsed ? t("turnReceiptContextFallback") : undefined,
    context.gatewayCompression
      ? t("turnReceiptGatewayCompression", {
          original:
            context.gatewayCompression.originalCount ?? "?",
          compressed:
            context.gatewayCompression.compressedCount ?? "?",
        })
      : undefined,
  ].filter(Boolean);

  return t("turnReceiptContextValue", {
    sent: context.messagesSent,
    total: context.messagesAvailable,
    summarized: context.messagesSummarized,
    state: states.length > 0 ? ` · ${states.join(" · ")}` : "",
  });
}

function formatTimings(
  receipt: MessageTurnReceipt,
  t: ReturnType<typeof useLocalization>["t"],
) {
  const timing = receipt.timing;
  return [
    timing.transcriptionMs !== undefined
      ? `${t("turnReceiptTimingStt")} ${formatDuration(timing.transcriptionMs)}`
      : undefined,
    timing.contextMs !== undefined
      ? `${t("turnReceiptTimingContext")} ${formatDuration(timing.contextMs)}`
      : undefined,
    timing.webSearchMs !== undefined
      ? `${t("turnReceiptTimingSearch")} ${formatDuration(timing.webSearchMs)}`
      : undefined,
    timing.modelMs !== undefined
      ? `${t("turnReceiptTimingModel")} ${formatDuration(timing.modelMs)}`
      : undefined,
    timing.firstSpeechMs !== undefined
      ? `${t("turnReceiptTimingFirstSpeech")} ${formatDuration(
          timing.firstSpeechMs,
        )}`
      : undefined,
    timing.totalMs !== undefined
      ? `${t("turnReceiptTimingTotal")} ${formatDuration(timing.totalMs)}`
      : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function TurnReceiptCard({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [expanded, setExpanded] = useState(false);
  const receipt =
    message.role === "assistant" ? message.metadata?.turnReceipt : undefined;

  if (!receipt) {
    return null;
  }

  const requestedRoute = formatRoute(
    receipt.requestedRoute.provider,
    receipt.requestedRoute.model,
    receipt.requestedRoute.gateway,
    receipt.requestedRoute.upstreamProvider,
    receipt.requestedRoute.strategy,
    receipt.requestedRoute.attempts,
  );
  const actualRoute = formatRoute(
    receipt.actualRoute.provider,
    receipt.actualRoute.model,
    receipt.actualRoute.gateway,
    receipt.actualRoute.upstreamProvider,
    receipt.actualRoute.strategy,
    receipt.actualRoute.attempts,
  );

  return (
    <View
      testID={`turn-receipt-${message.id}`}
      style={[
        styles.turnReceiptCard,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        testID={`turn-receipt-accordion-${message.id}`}
        style={styles.turnReceiptToggle}
        onPress={() => setExpanded((current) => !current)}
        activeOpacity={0.76}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={
          expanded
            ? t("collapseTurnReceipt")
            : t("expandTurnReceipt")
        }
      >
        <View style={styles.turnReceiptTitleRow}>
          <Feather name="activity" size={14} color={colors.accent} />
          <Text style={[styles.turnReceiptTitle, { color: colors.text }]}>
            {t("turnReceipt")}
          </Text>
        </View>
        <View style={styles.turnReceiptToggleMeta}>
          <Text
            style={[styles.turnReceiptSummary, { color: colors.textMuted }]}
          >
            {receipt.actualRoute.gateway ??
              t("turnReceiptDirect")}
            {" · "}
            {formatDuration(
              receipt.timing.totalMs ?? receipt.timing.replyReadyMs,
            )}
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.turnReceiptContent}>
          <ReceiptRow label={t("turnReceiptRequested")} value={requestedRoute} />
          <ReceiptRow label={t("turnReceiptActual")} value={actualRoute} />
          {receipt.effort ? (
            <ReceiptRow
              label={t("turnReceiptEffort")}
              value={[
                receipt.effort.label,
                receipt.effort.transportParameter &&
                receipt.effort.transportValue
                  ? `${receipt.effort.transportParameter}=${receipt.effort.transportValue}`
                  : undefined,
                t("turnReceiptProviderNative"),
              ]
                .filter(Boolean)
                .join(" · ")}
              mono
            />
          ) : null}
          <ReceiptRow
            label={t("turnReceiptInput")}
            value={formatInput(receipt, t)}
          />
          <ReceiptRow
            label={t("turnReceiptSearch")}
            value={formatSearch(receipt, t)}
          />
          <ReceiptRow
            label={t("turnReceiptVoice")}
            value={formatSpeech(receipt, t)}
          />
          <ReceiptRow
            label={t("turnReceiptContext")}
            value={formatContext(receipt, t)}
          />
          <ReceiptRow
            label={t("turnReceiptTiming")}
            value={formatTimings(receipt, t)}
            mono
          />
          {receipt.speechOutput.fallbackReason ? (
            <ReceiptRow
              label={t("turnReceiptFallback")}
              value={receipt.speechOutput.fallbackReason}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
