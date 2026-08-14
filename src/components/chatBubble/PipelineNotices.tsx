import React from "react";
import { Pressable, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { styles } from "./styles";
import type { ChatBubbleProps } from "./types";

export function PipelineNotices({
  message,
  onRepeat,
  onOpenSpeakingSettings,
}: Pick<ChatBubbleProps, "message" | "onRepeat" | "onOpenSpeakingSettings">) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const notices =
    message.role === "assistant" ? (message.metadata?.notices ?? []) : [];

  if (notices.length === 0) {
    return null;
  }

  return (
    <View
      testID={`pipeline-notice-list-${message.id}`}
      style={styles.noticeList}
    >
      {notices.map((notice, index) => (
        <View
          key={`${notice.stage}:${notice.message}:${notice.detail ?? ""}:${index}`}
          testID={`pipeline-notice-${message.id}-${index}`}
          style={[
            styles.noticeCard,
            {
              borderTopColor:
                notice.level === "error" ? colors.danger : colors.border,
            },
          ]}
        >
          <View
            testID={`pipeline-notice-icon-${message.id}-${index}`}
            style={styles.noticeIcon}
          >
            <PhosphorIcon
              name={notice.level === "error" ? "warning" : "info-circle"}
              size="inline"
              color={notice.level === "error" ? colors.danger : colors.accent}
            />
          </View>
          <View style={styles.noticeCopy}>
            <Text
              style={[
                styles.noticeLabel,
                {
                  color: notice.level === "error" ? colors.danger : colors.text,
                },
              ]}
            >
              {notice.stage === "stt"
                ? t("speechToText")
                : notice.stage === "tts"
                  ? t("textToSpeech")
                  : notice.stage === "ulra"
                    ? t("ulraMode")
                    : notice.stage === "interruption"
                      ? t("interruptedReply")
                    : t("webSearch")}
            </Text>
            <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
              {notice.message}
            </Text>
            {notice.detail ? (
              <Text style={[styles.noticeDetail, { color: colors.textMuted }]}>
                {notice.detail}
              </Text>
            ) : null}
            {notice.stage === "tts" && notice.level === "error" ? (
              <View style={styles.noticeActions}>
                {onRepeat ? (
                  <Pressable
                    testID={`pipeline-notice-retry-speech-${message.id}-${index}`}
                    style={({ pressed }) => [
                      styles.noticeAction,
                      {
                        backgroundColor: colors.accentSoft,
                        borderColor: colors.accent,
                      },
                      pressed ? styles.subCardActionPressed : null,
                    ]}
                    onPress={() => onRepeat(message)}
                    accessibilityRole="button"
                    accessibilityLabel={t("retrySpeech")}
                  >
                    <PhosphorIcon
                      name="sound"
                      size="compact"
                      color={colors.accent}
                    />
                    <Text
                      style={[
                        styles.noticeActionText,
                        { color: colors.accent },
                      ]}
                    >
                      {t("retrySpeech")}
                    </Text>
                  </Pressable>
                ) : null}
                {onOpenSpeakingSettings ? (
                  <Pressable
                    testID={`pipeline-notice-speaking-settings-${message.id}-${index}`}
                    style={({ pressed }) => [
                      styles.noticeAction,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                      pressed ? styles.subCardActionPressed : null,
                    ]}
                    onPress={onOpenSpeakingSettings}
                    accessibilityRole="button"
                    accessibilityLabel={t("openSpeakingSettings")}
                  >
                    <PhosphorIcon
                      name="setting"
                      size="compact"
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.noticeActionText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {t("openSpeakingSettings")}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}
