import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import {
  getTtsListenLanguageLabel,
} from "../../constants/localTts";
import { useLocalization } from "../../i18n";
import {
  clearSpeechDiagnostics,
  type SpeechDiagnosticRoute,
  type SpeechDiagnosticRequestSummary,
} from "../../services/speech/diagnostics";
import { useTheme } from "../../theme/ThemeContext";

import { PickerSection } from "./SettingsSectionPrimitives";
import { styles } from "./styles";

function getSpeechRouteLabel(
  route: SpeechDiagnosticRoute | null,
  t: ReturnType<typeof useLocalization>["t"],
) {
  if (route === "local" || route === "kokoro") {
    return t("localTts");
  }

  if (route === "provider") {
    return t("provider");
  }

  if (route === "native") {
    return t("appNative");
  }

  return "—";
}

function getSpeechSourceLabel(
  source: SpeechDiagnosticRequestSummary["source"],
  t: ReturnType<typeof useLocalization>["t"],
) {
  switch (source) {
    case "conversation":
      return t("speechDiagnosticSourceConversation");
    case "repeat":
      return t("speechDiagnosticSourceRepeat");
    case "preview":
      return t("speechDiagnosticSourcePreview");
    default:
      return t("speechDiagnosticSourceUnknown");
  }
}

function formatSpeechDiagnosticTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SpeechDiagnosticsSection({
  summaries,
}: {
  summaries: SpeechDiagnosticRequestSummary[];
}) {
  const { colors } = useTheme();
  const { t, language } = useLocalization();
  const handleClear = React.useCallback(() => {
    Alert.alert(
      t("clearSpeechDiagnosticsConfirmationTitle"),
      t("clearSpeechDiagnosticsConfirmationMessage"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("clear"),
          style: "destructive",
          onPress: clearSpeechDiagnostics,
        },
      ],
    );
  }, [t]);

  return (
    <PickerSection>
      <View style={styles.localPackHeader}>
        <View style={styles.localPackCopy}>
          <Text
            accessibilityRole="header"
            style={[styles.groupLabel, { color: colors.text }]}
          >
            {t("speechDiagnostics")}
          </Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            {t("speechDiagnosticsHint")}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t("clear")}
          onPress={handleClear}
        >
          <Text style={[styles.speechDiagnosticClear, { color: colors.danger }]}>
            {t("clear")}
          </Text>
        </TouchableOpacity>
      </View>

      {summaries.length === 0 ? (
        <View
          style={[
            styles.localPackCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.previewHint, { color: colors.textMuted }]}>
            {t("speechDiagnosticsEmpty")}
          </Text>
        </View>
      ) : (
        summaries.map((summary) => (
          <View
            key={summary.id}
            style={[
              styles.localPackCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.speechDiagnosticHeader}>
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                {getSpeechSourceLabel(summary.source, t)}
              </Text>
              <Text style={[styles.previewHint, { color: colors.textMuted }]}>
                {formatSpeechDiagnosticTime(summary.createdAt)}
              </Text>
            </View>
            <Text
              style={[
                styles.previewHint,
                { color: colors.textSecondary, marginTop: 8 },
              ]}
            >
              {t("speechDiagnosticRouteLine", {
                requested: getSpeechRouteLabel(summary.requestedRoute, t),
                actual: getSpeechRouteLabel(
                  summary.actualRoute ?? summary.requestedRoute,
                  t,
                ),
              })}
            </Text>
            <Text style={[styles.previewHint, { color: colors.textMuted }]}>
              {t("speechDiagnosticStageLine", {
                stage: summary.latestStage,
              })}
            </Text>
            {summary.language && summary.language !== "app" ? (
              <Text style={[styles.previewHint, { color: colors.textMuted }]}>
                {t("speechDiagnosticLanguageLine", {
                  languageLabel: getTtsListenLanguageLabel(
                    summary.language,
                    language,
                  ),
                })}
              </Text>
            ) : null}
            {summary.provider ? (
              <Text style={[styles.previewHint, { color: colors.textMuted }]}>
                {t("speechDiagnosticProviderLine", {
                  provider: summary.provider,
                })}
              </Text>
            ) : null}
            {summary.providerModel ? (
              <Text style={[styles.previewHint, { color: colors.textMuted }]}>
                {`${t("model")}: ${summary.providerModel}`}
              </Text>
            ) : null}
            {summary.voice ? (
              <Text style={[styles.previewHint, { color: colors.textMuted }]}>
                {t("speechDiagnosticVoiceLine", {
                  voice: summary.voice,
                })}
              </Text>
            ) : null}
            {summary.fallbackReason || summary.message ? (
              <Text
                style={[
                  styles.previewHint,
                  { color: colors.textMuted, marginTop: 6 },
                ]}
              >
                {summary.fallbackReason || summary.message}
              </Text>
            ) : null}
          </View>
        ))
      )}
    </PickerSection>
  );
}
