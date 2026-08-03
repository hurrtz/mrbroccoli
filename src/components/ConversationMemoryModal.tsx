import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { Input } from "../design-system/NativeControls";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
import { useLocalization } from "../i18n";
import type { TranslationKey } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import type {
  ConversationArtifact,
  ConversationArtifactKind,
  Message,
} from "../types";

const ARTIFACT_TRANSLATION_KEYS = {
  decision: "artifactDecision",
  idea: "artifactIdea",
  assumption: "artifactAssumption",
  counterargument: "artifactCounterargument",
  question: "artifactQuestion",
  hypothesis: "artifactHypothesis",
  action: "artifactAction",
} satisfies Record<ConversationArtifactKind, TranslationKey>;

interface ConversationMemoryModalProps {
  visible: boolean;
  title: string;
  summary?: string;
  summarizedMessageCount?: number;
  artifacts?: ConversationArtifact[];
  messages?: Message[];
  onCopy: () => void;
  onClear: () => void;
  onSave: (summary: string) => Promise<boolean>;
  onRemoveArtifact: (artifactId: string) => Promise<boolean>;
  onClose: () => void;
}

export const ConversationMemoryModal = React.memo(
  function ConversationMemoryModal({
    visible,
    title,
    summary,
    summarizedMessageCount,
    artifacts = [],
    messages = [],
    onCopy,
    onClear,
    onSave,
    onRemoveArtifact,
    onClose,
  }: ConversationMemoryModalProps) {
    const { colors } = useTheme();
    const { t } = useLocalization();
    const insets = useSafeAreaInsets();
    const { height, width } = useWindowDimensions();
    const isLandscape = width > height;
    const cardMaxWidth = isLandscape ? Math.min(width - 40, 720) : 440;
    const trimmedSummary = summary?.trim() ?? "";
    const hasSummary = trimmedSummary.length > 0;
    const [draft, setDraft] = React.useState(trimmedSummary);
    const [saving, setSaving] = React.useState(false);
    const [removingArtifactId, setRemovingArtifactId] = React.useState<
      string | null
    >(null);
    const messagesById = React.useMemo(
      () => new Map(messages.map((message) => [message.id, message] as const)),
      [messages],
    );

    React.useEffect(() => {
      if (visible) {
        setDraft(trimmedSummary);
      }
    }, [trimmedSummary, visible]);

    const normalizedDraft = draft.trim();
    const canSave =
      hasSummary &&
      normalizedDraft.length > 0 &&
      normalizedDraft !== trimmedSummary &&
      !saving;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        supportedOrientations={APP_MODAL_ORIENTATIONS}
      >
        <View
          style={[
            styles.overlay,
            {
              paddingTop: Math.max(insets.top + 24, 36),
              paddingBottom: Math.max(insets.bottom + 24, 36),
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.backdrop, { backgroundColor: colors.overlay }]}
            activeOpacity={1}
            onPress={onClose}
            accessible={false}
          />
          <View
            accessibilityViewIsModal
            style={[
              styles.card,
              { maxWidth: cardMaxWidth },
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.glow,
              },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text style={[styles.eyebrow, { color: colors.accent }]}>
                  {t("memory")}
                </Text>
                <Text style={[styles.title, { color: colors.text }]}>
                  {t("memoryModalTitle")}
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  {title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.85}
                accessibilityLabel={t("dismiss")}
                accessibilityRole="button"
              >
                <PhosphorIcon
                  name="close"
                  size="control"
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={[styles.description, { color: colors.textSecondary }]}
              >
                {t("memoryModalDescription")}
              </Text>

              {hasSummary ? (
                <Text
                  style={[styles.editHint, { color: colors.textSecondary }]}
                >
                  {t("memoryEditHint")}
                </Text>
              ) : null}

              <View
                style={[
                  styles.summaryCard,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.summaryLabel, { color: colors.textMuted }]}
                >
                  {hasSummary
                    ? t("summarizedTurnsCount", {
                        count: summarizedMessageCount ?? 0,
                      })
                    : t("memorySummary")}
                </Text>
                {hasSummary ? (
                  <Input.TextArea
                    testID="conversation-memory-input"
                    rows={7}
                    value={draft}
                    disabled={saving}
                    onChangeText={setDraft}
                    inputStyle={styles.summaryInput}
                  />
                ) : (
                  <Text style={[styles.summaryText, { color: colors.text }]}>
                    {t("memorySummaryEmpty")}
                  </Text>
                )}
              </View>

              {artifacts.length > 0 ? (
                <View style={styles.artifactsSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {t("savedInsights")}
                  </Text>
                  {artifacts.map((artifact) => {
                    const source = messagesById.get(artifact.sourceMessageId);
                    return (
                      <View
                        key={artifact.id}
                        testID={`saved-insight-${artifact.id}`}
                        style={[
                          styles.artifactCard,
                          {
                            backgroundColor: colors.surfaceElevated,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <View style={styles.artifactCopy}>
                          <Text
                            style={[
                              styles.artifactKind,
                              { color: colors.accent },
                            ]}
                          >
                            {t(ARTIFACT_TRANSLATION_KEYS[artifact.kind])}
                          </Text>
                          <Text
                            style={[
                              styles.artifactText,
                              { color: colors.text },
                            ]}
                          >
                            {artifact.text}
                          </Text>
                          {source ? (
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.artifactSource,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {source.role === "user"
                                ? t("you")
                                : t("assistant")}
                              : {source.content}
                            </Text>
                          ) : null}
                        </View>
                        <TouchableOpacity
                          testID={`remove-saved-insight-${artifact.id}`}
                          style={[
                            styles.removeArtifact,
                            {
                              borderColor: colors.border,
                              opacity:
                                removingArtifactId === artifact.id ? 0.45 : 1,
                            },
                          ]}
                          disabled={removingArtifactId !== null}
                          onPress={() => {
                            setRemovingArtifactId(artifact.id);
                            void onRemoveArtifact(artifact.id)
                              .catch(() => false)
                              .finally(() => setRemovingArtifactId(null));
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={t("removeInsight")}
                          accessibilityState={{
                            busy: removingArtifactId === artifact.id,
                            disabled: removingArtifactId !== null,
                          }}
                        >
                          <PhosphorIcon
                            name="delete"
                            size="control"
                            color={colors.danger}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      opacity: hasSummary || artifacts.length > 0 ? 1 : 0.45,
                    },
                  ]}
                  onPress={onCopy}
                  activeOpacity={0.88}
                  disabled={!hasSummary && artifacts.length === 0}
                  accessibilityLabel={t("copyMemory")}
                  accessibilityRole="button"
                  accessibilityState={{
                    disabled: !hasSummary && artifacts.length === 0,
                  }}
                >
                  <Text style={[styles.actionText, { color: colors.text }]}>
                    {t("copyMemory")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="save-memory-action"
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      opacity: canSave ? 1 : 0.45,
                    },
                  ]}
                  onPress={() => {
                    if (!canSave) {
                      return;
                    }
                    setSaving(true);
                    void onSave(normalizedDraft)
                      .then((saved) => {
                        if (saved) {
                          setDraft(normalizedDraft);
                        }
                      })
                      .catch(() => undefined)
                      .finally(() => setSaving(false));
                  }}
                  activeOpacity={0.88}
                  disabled={!canSave}
                  accessibilityLabel={t("save")}
                  accessibilityRole="button"
                  accessibilityState={{ busy: saving, disabled: !canSave }}
                >
                  <Text style={[styles.actionText, { color: colors.accent }]}>
                    {t("save")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      opacity: hasSummary ? 1 : 0.45,
                    },
                  ]}
                  onPress={onClear}
                  activeOpacity={0.88}
                  disabled={!hasSummary}
                  accessibilityLabel={t("forgetMemory")}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !hasSummary }}
                >
                  <Text style={[styles.actionText, { color: colors.danger }]}>
                    {t("forgetMemory")}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
    maxHeight: "100%",
  },
  header: {
    flexDirection: "row",
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    fontFamily: fonts.mono,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.display,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.body,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: fonts.body,
  },
  content: { marginTop: 14 },
  contentContainer: { paddingBottom: 2 },
  editHint: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.body,
  },
  summaryCard: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  summaryLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: fonts.mono,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
  summaryInput: {
    minHeight: 132,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    flexBasis: 112,
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 13,
    fontFamily: fonts.display,
  },
  artifactsSection: { gap: 10, marginTop: 18 },
  sectionTitle: { fontFamily: fonts.display, fontSize: 16, lineHeight: 22 },
  artifactCard: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },
  artifactCopy: { flex: 1, gap: 5 },
  artifactKind: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  artifactText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  artifactSource: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  removeArtifact: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
});
