import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { Message } from "../../types";
import { styles } from "./styles";

function formatKnowledgeSourceDate(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ConversationKnowledgeReferences({
  message,
}: {
  message: Message;
}) {
  const { colors } = useTheme();
  const { locale, t } = useLocalization();
  const [expanded, setExpanded] = useState(false);
  const knowledge = message.role === "assistant"
    ? message.metadata?.conversationKnowledge
    : undefined;

  if (!knowledge || knowledge.sources.length === 0) {
    return null;
  }

  return (
    <View
      testID={`conversation-knowledge-references-${message.id}`}
      style={[
        styles.referenceCard,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        testID={`conversation-knowledge-accordion-${message.id}`}
        style={styles.referenceToggle}
        onPress={() => setExpanded((current) => !current)}
        activeOpacity={0.76}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={
          expanded
            ? t("collapseKnowledgeDetails")
            : t("expandKnowledgeDetails")
        }
      >
        <View style={styles.referenceToggleTitleRow}>
          <PhosphorIcon name="inbox" size="inline" color={colors.accent} />
          <Text style={[styles.referenceToggleTitle, { color: colors.text }]}>
            {t("knowledgeReferences")}
          </Text>
        </View>
        <View style={styles.referenceToggleMeta}>
          <Text
            style={[styles.referenceSourceCount, { color: colors.textMuted }]}
          >
            {t("knowledgeSourceCount", { count: knowledge.sources.length })}
          </Text>
          <PhosphorIcon
            name={expanded ? "up" : "down"}
            size="compact"
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.referenceContent}>
          {knowledge.contentPolicy === "user-authored-only" ? (
            <View style={styles.knowledgePolicyRow}>
              <PhosphorIcon
                name="safety-certificate"
                size="inline"
                color={colors.accent}
              />
              <Text
                style={[
                  styles.knowledgePolicyText,
                  { color: colors.textSecondary },
                ]}
              >
                {t("knowledgeUserAuthoredOnly")}
              </Text>
            </View>
          ) : null}
          <View style={styles.sourcesRow}>
            {knowledge.sources.map((source) => (
              <View
                key={source.conversationId}
                style={[
                  styles.sourceChip,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.sourceLabel, { color: colors.text }]}
                >
                  {source.title}
                </Text>
                <Text
                  style={[styles.referenceHeading, { color: colors.textMuted }]}
                >
                  {formatKnowledgeSourceDate(source.updatedAt, locale)}
                  {source.match
                    ? ` · ${
                        source.match === "strong"
                          ? t("knowledgeMatchStrong")
                          : t("knowledgeMatchRelated")
                      }`
                    : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}
