import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getKokoroVoiceOptions } from "../constants/kokoro";
import {
  LOCAL_MODEL_CATALOG,
  localModelSupportsLanguages,
  type LocalModelDefinition,
} from "../constants/localModels";
import { LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE } from "../constants/voicePreviewSamples";
import { IconButton } from "../design-system/IconButton";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { AntPickerRow } from "../features/settings/AntSettingsPrimitives";
import { useLocalization } from "../i18n";
import type { FreeOfflineModeController } from "../screens/main/useFreeOfflineMode";
import { evaluateLocalModelEligibility } from "../services/localDeviceCapabilities";
import type { OfflineProfile } from "../services/offlineProfile";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import type { VoicePreviewRequest } from "../types";
import { formatBytes } from "../utils/formatBytes";

import { FreeOfflineProfileCard } from "./FreeOfflineProfileCard";
import { LocalModelPerformanceSummary } from "./LocalModelPerformanceSummary";

export function FreeOfflineAdvancedOptions({
  controller,
  onPreviewVoice,
  onStopPreviewVoice,
  profile,
}: {
  controller: FreeOfflineModeController;
  onPreviewVoice: (request: VoicePreviewRequest) => Promise<void>;
  onStopPreviewVoice: () => Promise<void>;
  profile: OfflineProfile;
}) {
  const { colors } = useTheme();
  const { language: appLanguage, t } = useLocalization();
  const snapshot = controller.snapshot;
  const visible = controller.advancedOptionsEnabled;
  const language = profile.languages[0] ?? "en";
  const [voicePreviewActive, setVoicePreviewActive] = React.useState(false);
  const voicePreviewActiveRef = React.useRef(false);
  const voicePreviewOperationRef = React.useRef(0);
  const onPreviewVoiceRef = React.useRef(onPreviewVoice);
  const onStopPreviewVoiceRef = React.useRef(onStopPreviewVoice);
  onPreviewVoiceRef.current = onPreviewVoice;
  onStopPreviewVoiceRef.current = onStopPreviewVoice;
  const candidates = React.useMemo(
    () =>
      language
        ? LOCAL_MODEL_CATALOG.filter((model) =>
            localModelSupportsLanguages(model, [language]),
          )
        : [],
    [language],
  );

  const stopActiveVoicePreview = React.useCallback(async () => {
    voicePreviewOperationRef.current += 1;
    const wasActive = voicePreviewActiveRef.current;
    voicePreviewActiveRef.current = false;
    setVoicePreviewActive(false);
    if (wasActive) {
      await onStopPreviewVoiceRef.current();
    }
  }, []);

  const startVoicePreview = React.useCallback(
    async (request: VoicePreviewRequest) => {
      if (voicePreviewActiveRef.current) {
        await stopActiveVoicePreview();
        return;
      }

      const operation = voicePreviewOperationRef.current + 1;
      voicePreviewOperationRef.current = operation;
      voicePreviewActiveRef.current = true;
      setVoicePreviewActive(true);
      try {
        await onPreviewVoiceRef.current(request);
      } finally {
        if (voicePreviewOperationRef.current === operation) {
          voicePreviewActiveRef.current = false;
          setVoicePreviewActive(false);
        }
      }
    },
    [stopActiveVoicePreview],
  );

  React.useEffect(() => {
    if ((!visible || controller.preparing) && voicePreviewActiveRef.current) {
      void stopActiveVoicePreview();
    }
  }, [controller.preparing, stopActiveVoicePreview, visible]);

  React.useEffect(
    () => () => {
      voicePreviewOperationRef.current += 1;
      if (voicePreviewActiveRef.current) {
        voicePreviewActiveRef.current = false;
        void onStopPreviewVoiceRef.current();
      }
    },
    [],
  );

  const renderVoicePicker = (params: {
    onChange: (voiceId: string) => void;
    options: { value: string; label: string }[];
    request: () => VoicePreviewRequest;
    testID: string;
    value: string;
  }) => (
    <View style={styles.voicePickerRow}>
      <View style={styles.voicePicker}>
        <AntPickerRow
          testID={params.testID}
          label={t("ttsVoice")}
          value={params.value}
          options={params.options}
          onChange={(voiceId) => {
            if (voicePreviewActiveRef.current) {
              void stopActiveVoicePreview();
            }
            params.onChange(voiceId);
          }}
        />
      </View>
      <IconButton
        testID={`${params.testID}-preview`}
        accessibilityLabel={
          voicePreviewActive ? t("stop") : t("previewVoice")
        }
        active={voicePreviewActive}
        disabled={controller.preparing || !params.value}
        icon={voicePreviewActive ? "stop" : "sound"}
        onPress={() => {
          void (voicePreviewActive
            ? stopActiveVoicePreview()
            : startVoicePreview(params.request()));
        }}
        style={{
          borderColor: voicePreviewActive ? colors.accent : colors.border,
        }}
      />
    </View>
  );

  const kokoroVoicePicker = renderVoicePicker({
    testID: "onboarding-kokoro-voice",
    value: controller.selectedKokoroVoice,
    options: getKokoroVoiceOptions("en", appLanguage),
    onChange: controller.selectKokoroVoice,
    request: () => ({
      text: LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE[language],
      mode: "kokoro",
      language: language === "zh-CN" ? "zh" : "en",
      voice: controller.selectedKokoroVoice,
    }),
  });
  const nativeVoicePicker = controller.nativeVoiceOptions.length
    ? renderVoicePicker({
        testID: "onboarding-native-voice",
        value: controller.selectedNativeVoice,
        options: controller.nativeVoiceOptions,
        onChange: controller.selectNativeVoice,
        request: () => ({
          text: LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE[language],
          mode: "native",
          nativeVoice: controller.selectedNativeVoice,
          previewLanguage: language,
        }),
      })
    : null;

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
    const embeddedVoicePicker =
      selected &&
      model.capability === "tts" &&
      model.id === "kokoro-multilingual"
        ? kokoroVoicePicker
        : null;

    return (
      <View
        key={model.id}
        testID={`onboarding-model-${model.id}-card`}
        style={[
          styles.option,
          {
            backgroundColor: selected ? colors.accentSoft : colors.surface,
            borderColor: selected ? colors.accent : colors.border,
          },
          disabled ? styles.disabled : null,
        ]}
      >
        <Pressable
          testID={`onboarding-model-${model.id}`}
          accessibilityRole="radio"
          accessibilityState={{ checked: selected, disabled, selected }}
          disabled={disabled}
          onPress={onPress}
          style={({ pressed }) => [
            styles.optionSelection,
            pressed ? styles.pressed : null,
          ]}
        >
          <View style={styles.optionCopy}>
            <Text style={[styles.optionName, { color: colors.text }]}>
              {model.name}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {model.catalogTier === "advanced"
                ? `${t("onboardingAdvancedOptions")} · `
                : ""}
              {formatBytes(model.downloadBytes)} · {model.license}
            </Text>
            <LocalModelPerformanceSummary
              model={model}
              snapshot={snapshot!}
              benchmark={controller.benchmarks[model.id]}
              benchmarks={controller.benchmarks}
            />
          </View>
          <PhosphorIcon
            name={selected ? "radio-selected" : "radio-unselected"}
            size="compact"
            color={selected ? colors.accent : colors.textMuted}
          />
        </Pressable>
        {embeddedVoicePicker ? (
          <View
            testID={`onboarding-model-${model.id}-voice`}
            style={[styles.embeddedControl, { borderTopColor: colors.border }]}
          >
            {embeddedVoicePicker}
          </View>
        ) : null}
      </View>
    );
  };

  const renderSystemOption = (params: {
    label: string;
    selected: boolean;
    onPress: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
    testID?: string;
  }) => {
    const disabled = controller.preparing || params.disabled;

    return (
      <View
        testID={params.testID ? `${params.testID}-card` : undefined}
        style={[
          styles.option,
          {
            backgroundColor: params.selected
              ? colors.accentSoft
              : colors.surface,
            borderColor: params.selected ? colors.accent : colors.border,
          },
          disabled ? styles.disabled : null,
        ]}
      >
        <Pressable
          testID={params.testID}
          accessibilityRole="radio"
          accessibilityState={{
            checked: params.selected,
            disabled,
            selected: params.selected,
          }}
          disabled={disabled}
          onPress={params.onPress}
          style={({ pressed }) => [
            styles.optionSelection,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={[styles.optionName, { color: colors.text }]}>
            {params.label}
          </Text>
          <PhosphorIcon
            name={params.selected ? "radio-selected" : "radio-unselected"}
            size="compact"
            color={params.selected ? colors.accent : colors.textMuted}
          />
        </Pressable>
        {params.selected && params.children ? (
          <View
            style={[styles.embeddedControl, { borderTopColor: colors.border }]}
          >
            {params.children}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View>
      <Pressable
        testID="onboarding-advanced-toggle"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: visible, disabled: controller.preparing }}
        disabled={controller.preparing}
        onPress={() => controller.setAdvancedOptionsEnabled(!visible)}
        style={({ pressed }) => [
          styles.toggle,
          { borderColor: colors.border },
          pressed ? styles.pressed : null,
        ]}
      >
        <PhosphorIcon
          name={visible ? "checkbox-checked" : "checkbox-unchecked"}
          size="control"
          color={visible ? colors.success : colors.textMuted}
        />
        <Text style={[styles.body, { color: colors.text }]}>
          {t("onboardingAdvancedOptions")}
        </Text>
      </Pressable>

      {visible && snapshot ? (
        <View testID="onboarding-advanced-panel" style={styles.panel}>
          <View style={styles.group}>
            <Text
              testID="onboarding-heading-phone"
              style={[styles.title, { color: colors.text }]}
            >
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
            {!controller.hasCustomSelections ? (
              <Text style={[styles.meta, { color: colors.success }]}>
                {t("onboardingSelectedAutomatically")}
              </Text>
            ) : null}
          </View>

          <View style={styles.group}>
            <Text
              testID="onboarding-heading-quick"
              style={[styles.title, { color: colors.text }]}
            >
              {t("onboardingQuickModel")}
            </Text>
            {candidates
              .filter(
                (model) =>
                  model.capability === "llm" &&
                  model.responseProfile === "quick",
              )
              .map((model) =>
                renderOption(model, profile.llm.id === model.id),
              )}
          </View>

          <View style={styles.group}>
            <Text
              testID="onboarding-heading-thorough"
              style={[styles.title, { color: colors.text }]}
            >
              {t("onboardingThoroughModel")}
            </Text>
            {renderSystemOption({
              label: t("onboardingQuickOnly"),
              selected: profile.thoroughLlm === null,
              onPress: () => controller.selectThoroughLlm(null),
            })}
            {candidates
              .filter(
                (model) =>
                  model.capability === "llm" &&
                  model.responseProfile === "thorough",
              )
              .map((model) =>
                renderOption(model, profile.thoroughLlm?.id === model.id),
              )}
          </View>

          <View style={styles.group}>
            <Text
              testID="onboarding-heading-listening"
              style={[styles.title, { color: colors.text }]}
            >
              {t("onDeviceListeningModels")}
            </Text>
            {renderSystemOption({
              label: `${t("appNative")} · ${t("speechToText")}`,
              selected: profile.stt === null,
              disabled:
                controller.nativeSpeechCapabilities?.nativeSttEligible !== true,
              onPress: () => controller.selectStt(null),
              testID: "onboarding-native-stt",
            })}
            {candidates
              .filter((model) => model.capability === "stt")
              .map((model) =>
                renderOption(model, profile.stt?.id === model.id),
              )}
          </View>

          <View style={styles.group}>
            <Text
              testID="onboarding-heading-speaking"
              style={[styles.title, { color: colors.text }]}
            >
              {t("onDeviceSpeakingModels")}
            </Text>
            {renderSystemOption({
              label: t("systemVoice"),
              selected: profile.tts === null,
              onPress: () => controller.selectTts(null),
              testID: "onboarding-native-tts",
              children: nativeVoicePicker,
            })}
            {candidates
              .filter((model) => model.capability === "tts")
              .map((model) =>
                renderOption(model, profile.tts?.id === model.id),
              )}
          </View>

          <View style={styles.cautions}>
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              {t("onboardingModelCaution")}
            </Text>
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              {t("onDevicePerformanceCaution")}
            </Text>
          </View>

          <FreeOfflineProfileCard
            estimatedSetupSeconds={controller.customEstimatedSetupSeconds}
            profile={profile}
            ready={controller.customReadiness?.ready === true}
            testID="onboarding-custom-setup-card"
            title={t("onboardingSelectedSetup")}
            tone="custom"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  cautions: { gap: 8 },
  disabled: { opacity: 0.45 },
  embeddedControl: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  group: { gap: 8 },
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  meta: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  option: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionCopy: { flex: 1, gap: 2 },
  optionName: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  optionSelection: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  panel: { gap: 18, paddingTop: 10 },
  pressed: { opacity: 0.72 },
  title: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  toggle: {
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
    minHeight: 44,
    paddingHorizontal: 2,
  },
  voicePicker: { flex: 1, minWidth: 0 },
  voicePickerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
