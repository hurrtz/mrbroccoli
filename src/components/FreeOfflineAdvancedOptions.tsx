import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  LOCAL_MODEL_CATALOG,
  localModelSupportsLanguages,
  type LocalModelDefinition,
} from "../constants/localModels";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { useLocalization } from "../i18n";
import type { FreeOfflineModeController } from "../screens/main/useFreeOfflineMode";
import {
  evaluateLocalModelEligibility,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "../services/localDeviceCapabilities";
import type { OfflineProfile } from "../services/offlineProfile";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import { formatBytes } from "../utils/formatBytes";

function benchmarkMatchesSnapshot(
  benchmark: LocalModelBenchmarkResult | undefined,
  snapshot: LocalDeviceSnapshot,
) {
  return (
    benchmark?.device.platform === snapshot.platform &&
    benchmark.device.architecture === snapshot.architecture &&
    benchmark.device.osVersion === snapshot.osVersion &&
    benchmark.device.physicalMemoryBytes === snapshot.physicalMemoryBytes
  );
}

export function FreeOfflineAdvancedOptions({
  controller,
  profile,
}: {
  controller: FreeOfflineModeController;
  profile: OfflineProfile;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [visible, setVisible] = React.useState(false);
  const snapshot = controller.snapshot;
  const language = profile.languages[0];
  const candidates = React.useMemo(
    () =>
      language
        ? LOCAL_MODEL_CATALOG.filter((model) =>
            localModelSupportsLanguages(model, [language]),
          )
        : [],
    [language],
  );

  const statusLabel = (model: LocalModelDefinition) => {
    if (!snapshot) {
      return t("onDeviceNotTested");
    }
    const benchmark = controller.benchmarks[model.id];
    if (benchmarkMatchesSnapshot(benchmark, snapshot)) {
      return t(
        benchmark?.status === "viable"
          ? "onDeviceViable"
          : benchmark?.status === "below-target"
            ? "onDeviceBelowTarget"
            : "onDeviceTestFailed",
      );
    }
    const eligibility = evaluateLocalModelEligibility(model, snapshot);
    return t(
      eligibility.eligible && !eligibility.retryLater
        ? "onboardingLikely"
        : "onboardingNotRecommended",
    );
  };

  const renderOption = (model: LocalModelDefinition, selected: boolean) => {
    const eligibility = snapshot
      ? evaluateLocalModelEligibility(model, snapshot)
      : null;
    const disabled =
      controller.preparing || !eligibility?.eligible || eligibility.retryLater;
    const onPress = () => {
      if (model.capability === "llm") {
        if (model.responseProfile === "thorough") {
          controller.selectThoroughLlm(model.id);
        } else {
          controller.selectQuickLlm(model.id);
        }
      } else if (model.capability === "stt") {
        controller.selectStt(model.id);
      } else {
        controller.selectTts(model.id);
      }
    };

    return (
      <Pressable
        key={model.id}
        testID={`onboarding-model-${model.id}`}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected, disabled, selected }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.option,
          {
            backgroundColor: selected ? colors.accentSoft : colors.surface,
            borderColor: selected ? colors.accent : colors.border,
          },
          disabled ? styles.disabled : null,
          pressed ? styles.pressed : null,
        ]}
      >
        <View style={styles.optionCopy}>
          <Text style={[styles.optionName, { color: colors.text }]}>
            {model.name}
          </Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {formatBytes(model.downloadBytes)} · {model.license} ·{" "}
            {statusLabel(model)}
          </Text>
        </View>
        <PhosphorIcon
          name={selected ? "radio-selected" : "radio-unselected"}
          size="compact"
          color={selected ? colors.accent : colors.textMuted}
        />
      </Pressable>
    );
  };

  const renderSystemOption = (
    label: string,
    selected: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, selected }}
      disabled={controller.preparing}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: selected ? colors.accentSoft : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
        },
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.optionName, { color: colors.text }]}>{label}</Text>
      <PhosphorIcon
        name={selected ? "radio-selected" : "radio-unselected"}
        size="compact"
        color={selected ? colors.accent : colors.textMuted}
      />
    </Pressable>
  );

  return (
    <View>
      <Pressable
        testID="onboarding-advanced-toggle"
        accessibilityRole="switch"
        accessibilityState={{ checked: visible }}
        disabled={controller.preparing}
        onPress={() => setVisible((value) => !value)}
        style={({ pressed }) => [
          styles.toggle,
          { borderColor: colors.border },
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={[styles.body, { color: colors.text }]}>
          {t("onboardingAdvancedOptions")}
        </Text>
        <PhosphorIcon
          name={visible ? "checkbox-checked" : "checkbox-unchecked"}
          size="feature"
          color={visible ? colors.success : colors.textMuted}
        />
      </Pressable>

      {visible && snapshot ? (
        <View style={styles.panel}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("onboardingDeviceDetails")}
          </Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {snapshot.platform.toUpperCase()} {snapshot.osVersion} ·{" "}
            {snapshot.architecture} · {snapshot.processorCount} CPU ·{" "}
            {t("onDeviceDeviceSummary", {
              memory: formatBytes(snapshot.physicalMemoryBytes),
              storage: formatBytes(snapshot.freeStorageBytes),
            })}
          </Text>
          {Object.keys(controller.overrides).length === 0 ? (
            <Text style={[styles.meta, { color: colors.success }]}>
              {t("onboardingSelectedAutomatically")}
            </Text>
          ) : null}

          <Text style={[styles.groupTitle, { color: colors.text }]}>
            {t("onboardingQuickModel")}
          </Text>
          {candidates
            .filter(
              (model) =>
                model.capability === "llm" && model.responseProfile === "quick",
            )
            .map((model) => renderOption(model, profile.llm.id === model.id))}

          <Text style={[styles.groupTitle, { color: colors.text }]}>
            {t("onboardingThoroughModel")}
          </Text>
          {renderSystemOption(
            t("onboardingQuickOnly"),
            profile.thoroughLlm === null,
            () => controller.selectThoroughLlm(null),
          )}
          {candidates
            .filter(
              (model) =>
                model.capability === "llm" &&
                model.responseProfile === "thorough",
            )
            .map((model) =>
              renderOption(model, profile.thoroughLlm?.id === model.id),
            )}

          <Text style={[styles.groupTitle, { color: colors.text }]}>
            {t("onDeviceListeningModels")}
          </Text>
          {candidates
            .filter((model) => model.capability === "stt")
            .map((model) => renderOption(model, profile.stt.id === model.id))}

          <Text style={[styles.groupTitle, { color: colors.text }]}>
            {t("onDeviceSpeakingModels")}
          </Text>
          {renderSystemOption(t("systemVoice"), profile.tts === null, () =>
            controller.selectTts(null),
          )}
          {candidates
            .filter((model) => model.capability === "tts")
            .map((model) => renderOption(model, profile.tts?.id === model.id))}

          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            {t("onboardingModelCaution")}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  disabled: { opacity: 0.45 },
  groupTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  meta: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  option: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionCopy: { flex: 1, gap: 2 },
  optionName: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  panel: { gap: 8, paddingTop: 10 },
  pressed: { opacity: 0.72 },
  title: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  toggle: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingTop: 10,
  },
});
