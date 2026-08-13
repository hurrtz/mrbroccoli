import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import type { ConversationIntegrityInspection } from "../../services/conversationIntegrity";
import { useTheme } from "../../theme/ThemeContext";
import type { ConversationMeta } from "../../types";

import { styles } from "./styles";

interface ConversationIntegrityModalProps {
  busy: boolean;
  conversation: ConversationMeta | null;
  failed: boolean;
  inspection: ConversationIntegrityInspection | null;
  loading: boolean;
  onClose: () => void;
  onExportOriginals: (text: string) => void;
  onRepair: () => void;
  onUndo: () => void;
}

function getOriginalResponses(inspection: ConversationIntegrityInspection) {
  const originals = [
    ...inspection.report.findings.map(({ originalContent }) => originalContent),
    ...(inspection.repairSnapshot?.messages.map(
      ({ originalContent }) => originalContent,
    ) ?? []),
  ];
  return [...new Set(originals)];
}

function truncatePreview(text: string) {
  const trimmed = text.trim();
  return trimmed.length > 900 ? `${trimmed.slice(0, 900)}…` : trimmed;
}

export function ConversationIntegrityModal({
  busy,
  conversation,
  failed,
  inspection,
  loading,
  onClose,
  onExportOriginals,
  onRepair,
  onUndo,
}: ConversationIntegrityModalProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  if (!conversation) {
    return null;
  }

  const findings = inspection?.report.findings ?? [];
  const repairableCount =
    inspection?.report.automaticallyRepairableCount ?? 0;
  const originals = inspection ? getOriginalResponses(inspection) : [];
  const canUndo = Boolean(inspection?.repairSnapshot);
  const hasFindings = findings.length > 0;

  return (
    <View style={styles.integrityOverlay} pointerEvents="box-none">
      <TouchableOpacity
        style={[
          styles.inlineRenameBackdrop,
          { backgroundColor: colors.overlay },
        ]}
        activeOpacity={1}
        onPress={busy ? undefined : onClose}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <View
        accessibilityViewIsModal
        style={[
          styles.integrityCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.glow,
          },
        ]}
      >
        <View style={styles.integrityHeader}>
          <View
            style={[
              styles.integrityIcon,
              {
                backgroundColor: colors.accentSoft,
                borderColor: colors.borderStrong,
              },
            ]}
          >
            <PhosphorIcon
              name="safety-certificate"
              size="control"
              color={colors.accent}
            />
          </View>
          <View style={styles.integrityHeaderCopy}>
            <Text style={[styles.integrityTitle, { color: colors.text }]}>
              {t("conversationIntegrity")}
            </Text>
            <Text
              style={[
                styles.integrityConversationTitle,
                { color: colors.textSecondary },
              ]}
            >
              {conversation.title}
            </Text>
          </View>
          <TouchableOpacity
            testID="conversation-integrity-close"
            onPress={onClose}
            disabled={busy}
            style={[
              styles.integrityClose,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                opacity: busy ? 0.5 : 1,
              },
            ]}
            activeOpacity={0.85}
            accessibilityLabel={t("dismiss")}
            accessibilityRole="button"
            accessibilityState={{ disabled: busy }}
          >
            <PhosphorIcon
              name="close"
              size="control"
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.integrityDescription, { color: colors.textSecondary }]}
        >
          {t("conversationIntegrityDescription")}
        </Text>

        {loading ? (
          <View
            testID="conversation-integrity-loading"
            accessibilityLiveRegion="polite"
            style={styles.integrityStatus}
          >
            <ActivityIndicator size="small" color={colors.accent} />
            <Text
              style={[styles.integrityStatusText, { color: colors.textSecondary }]}
            >
              {t("conversationIntegrityChecking")}
            </Text>
          </View>
        ) : failed || !inspection ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.integrityStatusText, { color: colors.danger }]}
          >
            {t("conversationIntegrityCouldNotLoad")}
          </Text>
        ) : (
          <>
            <Text
              accessibilityLiveRegion="polite"
              style={[
                styles.integrityResult,
                {
                  color: hasFindings
                    ? colors.danger
                    : colors.success,
                },
              ]}
            >
              {hasFindings
                ? t("conversationIntegrityIssueCount", {
                    count: findings.length,
                  })
                : canUndo
                  ? t("conversationIntegrityRepairComplete")
                  : t("conversationIntegrityNoIssues")}
            </Text>

            {hasFindings ? (
              <ScrollView
                style={styles.integrityFindings}
                contentContainerStyle={styles.integrityFindingsContent}
                showsVerticalScrollIndicator
              >
                {findings.map((finding, index) => (
                  <View
                    key={finding.messageId}
                    style={[
                      styles.integrityFinding,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.integrityFindingLabel,
                        { color: colors.textMuted },
                      ]}
                    >
                      {t("conversationIntegrityResponse", { count: index + 1 })}
                    </Text>
                    <Text
                      style={[
                        styles.integrityPreviewLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {t("conversationIntegrityOriginal")}
                    </Text>
                    <Text
                      selectable
                      style={[styles.integrityPreview, { color: colors.text }]}
                    >
                      {truncatePreview(finding.originalContent)}
                    </Text>
                    {finding.suggestedContent ? (
                      <>
                        <Text
                          style={[
                            styles.integrityPreviewLabel,
                            { color: colors.success },
                          ]}
                        >
                          {t("conversationIntegritySuggested")}
                        </Text>
                        <Text
                          selectable
                          style={[
                            styles.integrityPreview,
                            { color: colors.text },
                          ]}
                        >
                          {truncatePreview(finding.suggestedContent)}
                        </Text>
                      </>
                    ) : (
                      <Text
                        style={[
                          styles.integrityManualReview,
                          { color: colors.danger },
                        ]}
                      >
                        {t("conversationIntegrityManualReview")}
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : null}
          </>
        )}

        <View style={styles.integrityActions}>
          {originals.length > 0 ? (
            <TouchableOpacity
              testID="conversation-integrity-export"
              style={[
                styles.integrityAction,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => onExportOriginals(originals.join("\n\n---\n\n"))}
              disabled={busy}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={t("conversationIntegrityExportOriginals")}
              accessibilityState={{ disabled: busy }}
            >
              <PhosphorIcon
                name="export"
                size="compact"
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.integrityActionText,
                  { color: colors.textSecondary },
                ]}
              >
                {t("conversationIntegrityExportOriginals")}
              </Text>
            </TouchableOpacity>
          ) : null}
          {canUndo ? (
            <TouchableOpacity
              testID="conversation-integrity-undo"
              style={[
                styles.integrityAction,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
              onPress={onUndo}
              disabled={busy}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={t("conversationIntegrityUndo")}
              accessibilityState={{ busy, disabled: busy }}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <PhosphorIcon
                  name="reload"
                  size="compact"
                  color={colors.textSecondary}
                />
              )}
              <Text
                style={[
                  styles.integrityActionText,
                  { color: colors.textSecondary },
                ]}
              >
                {t("conversationIntegrityUndo")}
              </Text>
            </TouchableOpacity>
          ) : null}
          {repairableCount > 0 ? (
            <TouchableOpacity
              testID="conversation-integrity-repair"
              style={[
                styles.integrityAction,
                styles.integrityPrimaryAction,
                {
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.borderStrong,
                },
              ]}
              onPress={onRepair}
              disabled={busy}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={t("conversationIntegrityRepair", {
                count: repairableCount,
              })}
              accessibilityState={{ busy, disabled: busy }}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <PhosphorIcon
                  name="safety-certificate"
                  size="compact"
                  color={colors.accent}
                />
              )}
              <Text
                style={[styles.integrityActionText, { color: colors.accent }]}
              >
                {t("conversationIntegrityRepair", { count: repairableCount })}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
