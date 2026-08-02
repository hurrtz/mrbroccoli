import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../design-system/NativeControls";

import {
  TTS_FALLBACK_OPTIONS,
  getTtsFallbackRoutes,
} from "../../constants/ttsFallback";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type {
  KokoroTtsFallbackRoute,
  LocalTtsFallbackRoute,
  ProviderTtsFallbackRoute,
  Settings,
  TtsFallbackRoute,
} from "../../types";
import type {
  PreviewButtonPhase,
  TextInputFocusHandler,
} from "../settings-core/types";

import { AntPreviewComposer } from "./AntPreviewComposer";
import { AntSettingsInfoButton } from "./AntSettingsInfoButton";
import {
  AntButtonLabel,
  AntPickerRow,
  AntPickerRows,
  AntSectionIntro,
  AntSettingsCard,
} from "./AntSettingsPrimitives";
import { styles } from "./styles";

function getFallbackRouteLabel(
  route: TtsFallbackRoute,
  t: ReturnType<typeof useLocalization>["t"],
) {
  if (route === "provider") {
    return t("provider");
  }
  if (route === "kokoro") {
    return "Kokoro";
  }
  return t("systemVoice");
}

export function AntTtsFallbackSection({
  settings,
  onUpdate,
}: {
  settings: Settings;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const primaryMode = settings.ttsMode;

  if (primaryMode === "native") {
    return null;
  }

  const routes = getTtsFallbackRoutes(settings.ttsFallbackPolicy, primaryMode);
  const addableRoutes = TTS_FALLBACK_OPTIONS[primaryMode].filter(
    (route) => !routes.includes(route),
  );
  const updateRoutes = (nextRoutes: TtsFallbackRoute[]) => {
    onUpdate({
      ttsFallbackPolicy:
        primaryMode === "provider"
          ? {
              ...settings.ttsFallbackPolicy,
              provider: nextRoutes as ProviderTtsFallbackRoute[],
            }
          : primaryMode === "kokoro"
            ? {
                ...settings.ttsFallbackPolicy,
                kokoro: nextRoutes as KokoroTtsFallbackRoute[],
              }
            : {
                ...settings.ttsFallbackPolicy,
                local: nextRoutes as LocalTtsFallbackRoute[],
              },
    });
  };

  return (
    <AntSettingsCard
      title={t("ttsFallbackRoutes")}
      headerExtra={
        <AntSettingsInfoButton
          accessibilityLabel={t("aboutSetting", {
            setting: t("ttsFallbackRoutes"),
          })}
          title={t("ttsFallbackRoutes")}
        >
          {t("ttsFallbackRoutesHint")}
        </AntSettingsInfoButton>
      }
    >
      {routes.length === 0 ? (
        <Text
          testID="tts-fallback-empty"
          style={[styles.helperText, { color: colors.textSecondary }]}
        >
          {t("ttsFallbackNone")}
        </Text>
      ) : (
        routes.map((route, index) => (
          <View
            key={route}
            testID={`tts-fallback-route-${route}`}
            style={styles.fallbackRow}
          >
            <Text style={[styles.fallbackLabel, { color: colors.text }]}>
              {t("ttsFallbackPosition", {
                position: index + 1,
                route: getFallbackRouteLabel(route, t),
              })}
            </Text>
            <Button
              size="small"
              type="ghost"
              disabled={index === 0}
              style={StyleSheet.flatten([
                styles.iconButton,
                { borderColor: colors.border },
              ])}
              onPress={() => {
                const nextRoutes = [...routes];
                [nextRoutes[index - 1], nextRoutes[index]] = [
                  nextRoutes[index],
                  nextRoutes[index - 1],
                ];
                updateRoutes(nextRoutes);
              }}
              accessibilityLabel={t("moveFallbackEarlier", {
                route: getFallbackRouteLabel(route, t),
              })}
            >
              <PhosphorIcon
                name="arrow-up"
                size="compact"
                color={colors.accent}
              />
            </Button>
            <Button
              size="small"
              type="ghost"
              disabled={index === routes.length - 1}
              style={StyleSheet.flatten([
                styles.iconButton,
                { borderColor: colors.border },
              ])}
              onPress={() => {
                const nextRoutes = [...routes];
                [nextRoutes[index], nextRoutes[index + 1]] = [
                  nextRoutes[index + 1],
                  nextRoutes[index],
                ];
                updateRoutes(nextRoutes);
              }}
              accessibilityLabel={t("moveFallbackLater", {
                route: getFallbackRouteLabel(route, t),
              })}
            >
              <PhosphorIcon
                name="arrow-down"
                size="compact"
                color={colors.accent}
              />
            </Button>
            <Button
              size="small"
              type="warning"
              style={styles.iconButton}
              onPress={() =>
                updateRoutes(routes.filter((candidate) => candidate !== route))
              }
              accessibilityLabel={t("removeFallbackRoute", {
                route: getFallbackRouteLabel(route, t),
              })}
            >
              <PhosphorIcon
                name="close"
                size="compact"
                color={colors.onDanger}
              />
            </Button>
          </View>
        ))
      )}

      {addableRoutes.length > 0 ? (
        <View style={styles.buttonRow}>
          {addableRoutes.map((route) => (
            <Button
              key={route}
              size="small"
              type="ghost"
              style={StyleSheet.flatten([
                styles.compactButton,
                { borderColor: colors.border },
              ])}
              onPress={() => updateRoutes([...routes, route])}
              accessibilityLabel={t("addFallbackRoute", {
                route: getFallbackRouteLabel(route, t),
              })}
            >
              <AntButtonLabel
                color={colors.accent}
                icon="plus"
                iconSize="inline"
                label={getFallbackRouteLabel(route, t)}
              />
            </Button>
          ))}
        </View>
      ) : null}
    </AntSettingsCard>
  );
}

export function AntNativeVoiceSection({
  voiceOptions,
  selectedVoice,
  previewText,
  activePreview,
  onSelectVoice,
  onSetPreviewText,
  onPreview,
  onStopPreview,
  onTextInputFocus,
}: {
  voiceOptions: { value: string; label: string }[];
  selectedVoice: string;
  previewText: string;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  onSelectVoice: (voiceId: string) => void;
  onSetPreviewText: (text: string) => void;
  onPreview: () => Promise<void>;
  onStopPreview: () => Promise<void>;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <View style={styles.sectionGroup}>
      <AntSectionIntro
        title={t("nativeVoicePreviewSection")}
        extra={
          <AntSettingsInfoButton
            accessibilityLabel={t("aboutSetting", {
              setting: t("nativeVoicePreviewSection"),
            })}
            title={t("nativeVoicePreviewSection")}
          >
            {t("nativeVoicePreviewSectionHint")}
          </AntSettingsInfoButton>
        }
      />
      <AntSettingsCard>
        {voiceOptions.length > 0 ? (
          <>
            <AntPickerRows>
              <AntPickerRow
                label={t("ttsVoice")}
                value={selectedVoice}
                options={voiceOptions}
                onChange={onSelectVoice}
              />
            </AntPickerRows>
            <AntPreviewComposer
              text={previewText}
              setText={onSetPreviewText}
              phase={
                activePreview?.id === "native" ? activePreview.phase : "idle"
              }
              interactionDisabled={
                activePreview !== null && activePreview.id !== "native"
              }
              onPreview={onPreview}
              onStop={onStopPreview}
              onTextInputFocus={onTextInputFocus}
            />
          </>
        ) : (
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("nativeVoiceUnavailable")}
          </Text>
        )}
      </AntSettingsCard>
    </View>
  );
}
