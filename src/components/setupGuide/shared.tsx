import React from "react";
import { Text, View } from "react-native";

import { PROVIDER_LABELS } from "../../constants/models";
import { useLocalization } from "../../i18n";
import type { SetupGuideResolvedRoutes } from "../../screens/main/setupGuideSupport";
import type { SetupGuideVoiceTestPhase } from "../../screens/main/useSetupGuideVoiceTest";
import { useTheme } from "../../theme/ThemeContext";
import { styles } from "./styles";

export function RouteRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.routeRow,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.routeLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.routeValue,
          { color: muted ? colors.textMuted : colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

type Translate = ReturnType<typeof useLocalization>["t"];

export function getSttRouteCopy(
  t: Translate,
  routes: SetupGuideResolvedRoutes,
) {
  if (routes.stt.kind === "system") {
    return t("setupGuideRouteOnDeviceStt");
  }

  if (routes.stt.kind === "provider") {
    return t("setupGuideRouteProviderStt", {
      provider: PROVIDER_LABELS[routes.stt.provider],
    });
  }

  return t("setupGuideRouteUnavailable");
}

export function getTtsRouteCopy(
  t: Translate,
  routes: SetupGuideResolvedRoutes,
) {
  if (routes.tts.kind === "kokoro") {
    return t("setupGuideRouteKokoroTts");
  }

  if (routes.tts.kind === "provider") {
    return t("setupGuideRouteProviderTts", {
      provider: PROVIDER_LABELS[routes.tts.provider],
    });
  }

  return t("setupGuideRouteOff");
}

export function getVoiceTestActionLabel(
  t: Translate,
  phase: SetupGuideVoiceTestPhase,
) {
  switch (phase) {
    case "recording":
      return t("setupGuideVoiceTestStop");
    case "transcribing":
      return t("setupGuideVoiceTestTranscribing");
    case "thinking":
      return t("setupGuideVoiceTestThinking");
    case "synthesizing":
      return t("setupGuideVoiceTestSynthesizing");
    case "speaking":
      return t("setupGuideVoiceTestSpeaking");
    case "error":
    case "success":
      return t("setupGuideVoiceTestRetry");
    case "idle":
    default:
      return t("setupGuideVoiceTestStart");
  }
}
