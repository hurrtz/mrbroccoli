import React from "react";
import { Text, View } from "react-native";

import {
  getProviderLabel,
  getProviderModelName,
} from "../../constants/models";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { Message } from "../../types";
import { ProviderIcon } from "../ProviderIcon";
import { styles } from "./styles";

const messageTimestampFormatters = new Map<string, Intl.DateTimeFormat>();

function formatMessageTimestamp(timestamp: string, locale: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  let formatter = messageTimestampFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    messageTimestampFormatters.set(locale, formatter);
  }

  return formatter.format(date).replace(/,\s*/, " · ");
}

export function MessageHeader({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { locale, t } = useLocalization();
  const isUser = message.role === "user";
  const providerLabel = message.provider
    ? getProviderLabel(message.provider)
    : null;
  const modelLabel =
    message.provider && message.model
      ? getProviderModelName(message.provider, message.model)
      : message.model;
  const timestampLabel = formatMessageTimestamp(message.timestamp, locale);

  return (
    <View testID={`message-header-${message.id}`} style={styles.metaRow}>
      {isUser ? (
        <>
          <Text
            testID={`message-timestamp-${message.id}`}
            numberOfLines={1}
            style={[styles.timestampLabel, { color: colors.textMuted }]}
          >
            {timestampLabel}
          </Text>
          <Text style={[styles.roleLabel, { color: colors.accent }]}>
            {t("you")}
          </Text>
        </>
      ) : (
        <>
          <View style={styles.modelChip}>
            {message.provider ? (
              <View style={styles.providerIcon}>
                <ProviderIcon
                  provider={message.provider}
                  label={providerLabel ?? undefined}
                  color={colors.accent}
                  size={16}
                />
              </View>
            ) : null}
            {modelLabel ? (
              <Text
                numberOfLines={1}
                style={[styles.modelLabel, { color: colors.textSecondary }]}
              >
                {modelLabel}
              </Text>
            ) : !message.provider ? (
              <Text style={[styles.roleLabel, { color: colors.accent }]}>
                {t("assistant")}
              </Text>
            ) : null}
          </View>
          <Text
            testID={`message-timestamp-${message.id}`}
            numberOfLines={1}
            style={[styles.timestampLabel, { color: colors.textMuted }]}
          >
            {timestampLabel}
          </Text>
        </>
      )}
    </View>
  );
}
