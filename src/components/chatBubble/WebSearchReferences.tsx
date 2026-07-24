import React, { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { Message } from "../../types";
import { getWebSearchSourceDisplayTitle } from "../../utils/webSearchSources";
import { styles } from "./styles";

export function WebSearchReferences({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [expanded, setExpanded] = useState(false);
  const webSearch =
    message.role === "assistant" ? message.metadata?.webSearch : undefined;

  if (!webSearch) {
    return null;
  }

  return (
    <View
      testID={`web-search-references-${message.id}`}
      style={[
        styles.referenceCard,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        testID={`web-search-accordion-${message.id}`}
        style={styles.referenceToggle}
        onPress={() => setExpanded((current) => !current)}
        activeOpacity={0.76}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={
          expanded ? t("collapseWebSearchDetails") : t("expandWebSearchDetails")
        }
      >
        <View style={styles.referenceToggleTitleRow}>
          <Feather name="globe" size={14} color={colors.accent} />
          <Text style={[styles.referenceToggleTitle, { color: colors.text }]}>
            {t("webSearch")}
          </Text>
        </View>
        <View style={styles.referenceToggleMeta}>
          <Text
            style={[styles.referenceSourceCount, { color: colors.textMuted }]}
          >
            {t("webSearchSourceCount", {
              count: webSearch.sources.length,
            })}
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.referenceContent}>
          <Text style={[styles.referenceHeading, { color: colors.textMuted }]}>
            {t("searchQuery")}
          </Text>
          <Text style={[styles.referenceQuery, { color: colors.text }]}>
            {webSearch.query}
          </Text>
          <Text
            style={[styles.referenceSummary, { color: colors.textSecondary }]}
          >
            {webSearch.summary}
          </Text>
          {webSearch.sources.length > 0 ? (
            <>
              <Text
                style={[styles.referenceHeading, { color: colors.textMuted }]}
              >
                {t("sources")}
              </Text>
              <View style={styles.sourcesRow}>
                {webSearch.sources.map((source) => {
                  const sourceTitle = getWebSearchSourceDisplayTitle(
                    source.title,
                    source.url,
                  );

                  return (
                    <TouchableOpacity
                      key={source.url}
                      style={[
                        styles.sourceChip,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => {
                        void Linking.openURL(source.url);
                      }}
                      activeOpacity={0.86}
                      accessibilityRole="link"
                      accessibilityLabel={t("openSourceLink", {
                        source: sourceTitle,
                      })}
                    >
                      <Text
                        numberOfLines={1}
                        style={[styles.sourceLabel, { color: colors.text }]}
                      >
                        {sourceTitle}
                      </Text>
                      <Feather
                        name="arrow-up-right"
                        size={12}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
