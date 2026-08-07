import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Modal } from "../../design-system/NativeControls";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type { Colors } from "../../theme/colors";
import type { TranslateFn } from "../../screens/main/shared";
import { getIntroClip } from "./introClips";
import type { AppLanguage } from "../../i18n/localeRegistry";

export const INTRO_STEPS = ["what", "how", "hear", "start"] as const;
export type IntroStep = (typeof INTRO_STEPS)[number];

interface IntroFlowSheetProps {
  colors: Colors;
  language: AppLanguage;
  onClose: () => void;
  onConnectProvider: () => void;
  onInstallLocal: () => void;
  onStepChange: (step: IntroStep) => void;
  step: IntroStep;
  t: TranslateFn;
  visible: boolean;
}

/**
 * The four-step introduction the banner opens, and the same sheet a user gets
 * when they attempt a turn with nothing configured -- opened at "start" so the
 * microphone can never be a dead end.
 *
 * Built on the shared sheet layout rather than a dialog so it rises from the
 * bottom and leaves the page heading visible behind it.
 */
export function IntroFlowSheet({
  colors,
  language,
  onClose,
  onConnectProvider,
  onInstallLocal,
  onStepChange,
  step,
  t,
  visible,
}: IntroFlowSheetProps) {
  const stepIndex = Math.max(0, INTRO_STEPS.indexOf(step));
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === INTRO_STEPS.length - 1;

  const title = {
    what: t("introWhatTitle"),
    how: t("introHowTitle"),
    hear: t("introHearTitle"),
    start: t("introStartTitle"),
  }[step];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      layout="sheet"
      title={title}
      footer={
        isLastStep
          ? [{ text: t("introStartLater"), onPress: onClose }]
          : [
              ...(isFirstStep
                ? []
                : [
                    {
                      text: t("introBack"),
                      onPress: () => onStepChange(INTRO_STEPS[stepIndex - 1]),
                    },
                  ]),
              {
                text: t("introNext"),
                onPress: () => onStepChange(INTRO_STEPS[stepIndex + 1]),
              },
            ]
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        testID="intro-flow-content"
      >
        <Text style={[styles.progress, { color: colors.textMuted }]}>
          {t("introStepOfTotal", {
            step: stepIndex + 1,
            total: INTRO_STEPS.length,
          })}
        </Text>

        {step === "what" ? (
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("introWhatBody")}
          </Text>
        ) : null}

        {step === "how" ? (
          <View style={styles.list}>
            <IntroRow colors={colors} icon="key" label={t("introHowProvider")} />
            <IntroRow colors={colors} icon="cpu" label={t("introHowLocal")} />
            <IntroRow colors={colors} icon="audio" label={t("introHowSystem")} />
          </View>
        ) : null}

        {step === "hear" ? (
          <IntroHearStep colors={colors} language={language} t={t} />
        ) : null}

        {step === "start" ? (
          <View style={styles.list}>
            <IntroChoice
              colors={colors}
              hint={t("introStartProviderHint")}
              icon="key"
              label={t("introStartProvider")}
              onPress={onConnectProvider}
              testID="intro-start-provider"
            />
            <IntroChoice
              colors={colors}
              hint={t("introStartLocalHint")}
              icon="download"
              label={t("introStartLocal")}
              onPress={onInstallLocal}
              testID="intro-start-local"
            />
          </View>
        ) : null}
      </ScrollView>
    </Modal>
  );
}

function IntroHearStep({
  colors,
  language,
  t,
}: {
  colors: Colors;
  language: AppLanguage;
  t: TranslateFn;
}) {
  const clip = getIntroClip(language);

  return (
    <View style={styles.list}>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {t("introHearBody")}
      </Text>
      {clip ? null : (
        <Text
          style={[styles.disclaimer, { color: colors.textMuted }]}
          testID="intro-hear-unavailable"
        >
          {t("introHearUnavailable")}
        </Text>
      )}
      <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
        {t("introHearDisclaimer")}
      </Text>
    </View>
  );
}

function IntroRow({
  colors,
  icon,
  label,
}: {
  colors: Colors;
  icon: React.ComponentProps<typeof PhosphorIcon>["name"];
  label: string;
}) {
  return (
    <View style={styles.row}>
      <PhosphorIcon color={colors.accent} name={icon} size="control" />
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

function IntroChoice({
  colors,
  hint,
  icon,
  label,
  onPress,
  testID,
}: {
  colors: Colors;
  hint: string;
  icon: React.ComponentProps<typeof PhosphorIcon>["name"];
  label: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      accessibilityHint={hint}
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.choice,
        { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
      ]}
      testID={testID}
    >
      <PhosphorIcon color={colors.accent} name={icon} size="navigation" />
      <View style={styles.choiceText}>
        <Text style={[styles.choiceLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.choiceHint, { color: colors.textSecondary }]}>
          {hint}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  choice: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 14,
    minHeight: 64,
    padding: 14,
  },
  choiceHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  choiceLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  choiceText: {
    flex: 1,
    gap: 2,
  },
  content: {
    gap: 16,
    paddingBottom: 8,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 17,
  },
  list: {
    gap: 12,
  },
  progress: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    minHeight: 24,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
});
