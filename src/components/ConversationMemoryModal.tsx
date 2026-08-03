import React from "react";
import {
  Modal,
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
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";

interface ConversationMemoryModalProps {
  visible: boolean;
  title: string;
  summary?: string;
  summarizedMessageCount?: number;
  onCopy: () => void;
  onClear: () => void;
  onSave: (summary: string) => Promise<boolean>;
  onClose: () => void;
}

export const ConversationMemoryModal = React.memo(
  function ConversationMemoryModal({
    visible,
    title,
    summary,
    summarizedMessageCount,
    onCopy,
    onClear,
    onSave,
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
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
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
                <Text
                  style={[styles.summaryText, { color: colors.text }]}
                >
                  {t("memorySummaryEmpty")}
                </Text>
              )}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    opacity: hasSummary ? 1 : 0.45,
                  },
                ]}
                onPress={onCopy}
                activeOpacity={0.88}
                disabled={!hasSummary}
                accessibilityLabel={t("copyMemory")}
                accessibilityRole="button"
                accessibilityState={{ disabled: !hasSummary }}
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
                <Text
                  style={[styles.actionText, { color: colors.accent }]}
                >
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
    marginTop: 14,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: fonts.body,
  },
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
});
