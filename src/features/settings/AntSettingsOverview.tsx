import React from "react";
import { StyleSheet, Text, View } from "react-native";

import appConfig from "../../../app.json";
import { getLocalModel } from "../../constants/localModels";
import {
  getProviderModelName,
  PROVIDER_LABELS,
  PROVIDER_ORDER,
} from "../../constants/models";
import type { PhosphorIconName } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { APP_LANGUAGE_OPTIONS } from "../../i18n/localeRegistry";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { Settings } from "../../types";
import type { SettingsReadiness } from "../settings-core/readiness";
import type { ProviderHealthState, SettingsPage } from "../settings-core/types";

import {
  RuntimeReadiness,
  type ReadinessStep,
} from "./settings-primitives/RuntimeReadiness";
import { SettingsGroup } from "./settings-primitives/SettingsGroup";
import { SettingsRow } from "./settings-primitives/SettingsRow";

export type SettingsDetailPage = Exclude<SettingsPage, "overview">;

export type SettingsOverviewRow = {
  page: SettingsDetailPage;
  titleKey:
    | "settingsConnections"
    | "settingsThinking"
    | "settingsListening"
    | "settingsSpeaking"
    | "settingsSearch"
    | "settingsDataPrivacy"
    | "settingsAppDiagnostics";
  icon: PhosphorIconName;
};

export const SETTINGS_OVERVIEW_ROWS: Record<
  SettingsDetailPage,
  SettingsOverviewRow
> = {
  connections: {
    page: "connections",
    titleKey: "settingsConnections",
    icon: "key",
  },
  thinking: {
    page: "thinking",
    titleKey: "settingsThinking",
    icon: "robot",
  },
  search: {
    page: "search",
    titleKey: "settingsSearch",
    icon: "search",
  },
  listening: {
    page: "listening",
    titleKey: "settingsListening",
    icon: "audio",
  },
  speaking: {
    page: "speaking",
    titleKey: "settingsSpeaking",
    icon: "sound",
  },
  data: {
    page: "data",
    titleKey: "settingsDataPrivacy",
    icon: "safety-certificate",
  },
  app: {
    page: "app",
    titleKey: "settingsAppDiagnostics",
    icon: "sliders",
  },
};

export const SETTINGS_OVERVIEW_GROUPS = [
  {
    titleKey: "settingsGroupConversation" as const,
    pages: ["connections", "thinking", "search"] as const,
  },
  {
    titleKey: "settingsGroupVoiceModels" as const,
    pages: ["listening", "speaking"] as const,
  },
  {
    titleKey: "settingsGroupPrivacyApp" as const,
    pages: ["data", "app"] as const,
  },
];

/** Each capability opens the page that configures it. */
const READINESS_PAGE: Record<ReadinessStep, SettingsDetailPage> = {
  think: "thinking",
  listen: "listening",
  speak: "speaking",
  search: "search",
};

function getHealthLabel(
  state: ProviderHealthState,
  t: ReturnType<typeof useLocalization>["t"],
) {
  switch (state) {
    case "healthy":
      return t("providerStatusWorking");
    case "configured":
      return t("providerStatusNotTested");
    case "failing":
      return t("providerStatusInvalid");
    case "unconfigured":
    case "validating":
      return t("providerStatusTesting");
  }
}

function getInputModeLabel(
  settings: Settings,
  t: ReturnType<typeof useLocalization>["t"],
) {
  switch (settings.inputMode) {
    case "push-to-talk":
      return t("pushToTalk");
    case "toggle-to-talk":
      return t("toggleToTalk");
  }
}

function getThemeLabel(
  settings: Settings,
  t: ReturnType<typeof useLocalization>["t"],
) {
  switch (settings.theme) {
    case "light":
      return t("light");
    case "dark":
      return t("dark");
    case "system":
      return t("system");
  }
}

/**
 * Voice ids are stored lowercase ("cosmo"); echoes read as names, so the
 * first letter comes up. Opaque provider ids pass through unchanged.
 */
function displayVoiceName(voice: string | undefined) {
  return voice ? voice.charAt(0).toLocaleUpperCase() + voice.slice(1) : voice;
}

function getResponseModeLabel(settings: Settings) {
  return settings.responseModes
    .map(({ route }) => getProviderModelName(route.provider, route.model))
    .filter(Boolean)
    .slice(0, 3)
    .join(" · ");
}

function getListeningRouteLabel(
  settings: Settings,
  t: ReturnType<typeof useLocalization>["t"],
) {
  if (settings.sttMode === "local" && settings.localSttModelId) {
    return getLocalModel(settings.localSttModelId).name;
  }
  if (settings.sttMode === "provider" && settings.sttProvider) {
    return [
      PROVIDER_LABELS[settings.sttProvider],
      settings.providerSttModels[settings.sttProvider],
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return t("appNative");
}

function getSpeakingRouteLabel(
  settings: Settings,
  t: ReturnType<typeof useLocalization>["t"],
) {
  if (settings.ttsMode === "kokoro") {
    const language = settings.localLanguages.includes("zh-CN") ? "zh" : "en";
    return ["Kokoro", displayVoiceName(settings.kokoroVoices[language])]
      .filter(Boolean)
      .join(" · ");
  }
  if (settings.ttsMode === "local" && settings.localTtsModelId) {
    return getLocalModel(settings.localTtsModelId).name;
  }
  if (settings.ttsMode === "provider" && settings.ttsProvider) {
    return [
      PROVIDER_LABELS[settings.ttsProvider],
      displayVoiceName(settings.providerTtsVoices[settings.ttsProvider]),
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return t("systemVoice");
}

function getOverviewState({
  getProviderHealthState,
  page,
  settings,
  t,
}: {
  getProviderHealthState: (
    provider: keyof Settings["apiKeys"],
  ) => ProviderHealthState;
  page: SettingsDetailPage;
  settings: Settings;
  t: ReturnType<typeof useLocalization>["t"];
}) {
  switch (page) {
    case "connections": {
      const configured = PROVIDER_ORDER.filter(
        (provider) => settings.apiKeys[provider]?.trim().length > 0,
      );
      if (configured.length === 0) {
        return t("providerStatusNotSetup");
      }
      // Two named statuses stay legible; a third would truncate mid-word,
      // so everything past the second collapses into a count.
      const named = configured
        .slice(0, 2)
        .map(
          (provider) =>
            `${PROVIDER_LABELS[provider]} ${getHealthLabel(
              getProviderHealthState(provider),
              t,
            ).toLocaleLowerCase()}`,
        );
      const overflow = configured.length - named.length;
      return [...named, ...(overflow > 0 ? [`+${overflow}`] : [])].join(" · ");
    }
    case "thinking":
      return getResponseModeLabel(settings) || t("providerStatusNotSetup");
    case "search":
      return settings.webSearchMode === "on" && settings.webSearchProvider
        ? `${PROVIDER_LABELS[settings.webSearchProvider]} · ${
            settings.webSearchProviderSettings[settings.webSearchProvider]
              .resultLimit
          }`
        : t("settingsReadinessOff");
    case "listening":
      return `${getInputModeLabel(settings, t)} · ${getListeningRouteLabel(
        settings,
        t,
      )}`;
    case "speaking":
      return `${getSpeakingRouteLabel(settings, t)} · ${t(
        settings.replyPlayback === "stream"
          ? "sentencesArrive"
          : "fullReplyFirst",
      )}`;
    case "data":
      return `${t("pastConversationKnowledge")} · ${t(
        settings.pastConversationKnowledgeEnabled ? "show" : "hide",
      )}`;
    case "app": {
      const languageLabel =
        APP_LANGUAGE_OPTIONS.find(({ value }) => value === settings.language)
          ?.label ?? settings.language;
      return `${getThemeLabel(settings, t)} · ${languageLabel}`;
    }
  }
}

export function AntSettingsOverview({
  getProviderHealthState,
  onOpenPage,
  readiness,
  settings,
}: {
  getProviderHealthState: (
    provider: keyof Settings["apiKeys"],
  ) => ProviderHealthState;
  onOpenPage: (page: SettingsDetailPage) => void;
  readiness: SettingsReadiness;
  settings: Settings;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <View testID="settings-page-overview" style={localStyles.overview}>
      <RuntimeReadiness
        onSelect={(step) => onOpenPage(READINESS_PAGE[step])}
        readiness={readiness}
      />

      {SETTINGS_OVERVIEW_GROUPS.map((group) => (
        <SettingsGroup key={group.titleKey} title={t(group.titleKey)}>
          {group.pages.map((page, index) => {
            const row = SETTINGS_OVERVIEW_ROWS[page];
            return (
              <SettingsRow
                key={page}
                testID={`settings-overview-row-${page}`}
                accessibilityLabel={t("settingsOpenSection", {
                  section: t(row.titleKey),
                })}
                icon={row.icon}
                label={t(row.titleKey)}
                supporting={getOverviewState({
                  getProviderHealthState,
                  page,
                  settings,
                  t,
                })}
                last={index === group.pages.length - 1}
                onPress={() => onOpenPage(page)}
              />
            );
          })}
        </SettingsGroup>
      ))}

      <Text
        testID="settings-release-version"
        style={[localStyles.releaseVersion, { color: colors.textMuted }]}
      >
        {t("settingsReleaseVersion", {
          version: appConfig.expo.version,
        })}
      </Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  overview: {
    gap: 14,
  },
  releaseVersion: {
    paddingBottom: 4,
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
