import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getProviderLabel, getProviderModelName } from "../../constants/models";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { Message } from "../../types";

export function CouncilAuditCard({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [expanded, setExpanded] = useState(false);
  const audit =
    message.role === "assistant" ? message.metadata?.ulraMode : undefined;
  const routes = useMemo(() => {
    if (!audit) {
      return [];
    }
    const unique = new Map<string, string>();
    audit.contributions.forEach((entry, index) => {
      const key = entry.participant
        ? `participant:${entry.participant}`
        : entry.modeId;
      if (!unique.has(key)) {
        unique.set(
          key,
          `#${entry.participant ?? index + 1} · ${getProviderLabel(
            entry.provider,
          )} · ${getProviderModelName(entry.provider, entry.model)}`,
        );
      }
    });
    return [...unique.values()];
  }, [audit]);

  if (!audit) {
    return null;
  }

  const reviews = audit.contributions.filter((entry) => entry.round > 0);
  const challenges = reviews.filter(
    (entry) => entry.reviewVerdict === "challenge",
  ).length;
  const converged = reviews.filter(
    (entry) => entry.reviewVerdict === "converged",
  ).length;
  const unmarked = reviews.length - challenges - converged;
  const retained = audit.synthesisContributions ?? audit.contributions.length;
  const omitted = audit.synthesisOmittedContributions ?? 0;
  const synthesisTokens =
    audit.synthesisEstimatedTokens ?? audit.estimatedIntermediateTokens;

  return (
    <View
      testID={`council-audit-${message.id}`}
      style={[
        styles.card,
        { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity
        testID={`council-audit-toggle-${message.id}`}
        onPress={() => setExpanded((current) => !current)}
        activeOpacity={0.76}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={
          expanded ? t("collapseCouncilAudit") : t("expandCouncilAudit")
        }
        style={styles.toggle}
      >
        <View style={styles.titleRow}>
          <PhosphorIcon
            name="safety-certificate"
            size="inline"
            color={colors.accent}
          />
          <View style={styles.titleCopy}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("councilAuditTitle")}
            </Text>
            <Text style={[styles.summary, { color: colors.textMuted }]}>
              {t("councilAuditSummary", {
                failed: audit.failedCalls,
                rounds: audit.roundsCompleted,
                successful: audit.successfulCalls,
              })}
            </Text>
          </View>
        </View>
        <PhosphorIcon
          name={expanded ? "up" : "down"}
          size="compact"
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded ? (
        <View style={[styles.details, { borderTopColor: colors.border }]}>
          <Text style={[styles.outcome, { color: colors.text }]}>
            {audit.convergenceReached
              ? t("councilAuditConverged")
              : t("councilAuditUnresolved")}
          </Text>
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            {t("councilAuditCalls", {
              failed: audit.failedCalls,
              retired: audit.retiredParticipants ?? 0,
              successful: audit.successfulCalls,
            })}
          </Text>
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            {t("councilAuditReviews", {
              challenges,
              converged,
              unmarked,
            })}
          </Text>
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            {t("councilAuditHistory", {
              omitted,
              retained,
              tokens: synthesisTokens.toLocaleString(),
            })}
          </Text>
          {audit.synthesisContract ? (
            <Text style={[styles.detail, { color: colors.textSecondary }]}>
              {t("councilAuditContract", {
                contract: audit.synthesisContract,
              })}
            </Text>
          ) : null}
          {routes.length > 0 ? (
            <View style={styles.routes}>
              <Text style={[styles.routeLabel, { color: colors.textMuted }]}>
                {t("councilAuditRoutes")}
              </Text>
              {routes.map((route) => (
                <Text
                  key={route}
                  style={[styles.route, { color: colors.textSecondary }]}
                >
                  {route}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, marginTop: 10, overflow: "hidden" },
  toggle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  titleRow: { alignItems: "center", flex: 1, flexDirection: "row", gap: 8 },
  titleCopy: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.display, fontSize: 13, lineHeight: 18 },
  summary: { fontFamily: fonts.body, fontSize: 11, lineHeight: 15 },
  details: { borderTopWidth: StyleSheet.hairlineWidth, gap: 7, padding: 12 },
  outcome: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  detail: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  routes: { gap: 4, marginTop: 3 },
  routeLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  route: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
});
