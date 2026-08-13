import React from "react";
import { StyleSheet, Text, View } from "react-native";

import appConfig from "../../../app.json";
import { getLocalModel } from "../../constants/localModels";
import {
  getProviderModelName,
  PROVIDER_LABELS,
  PROVIDER_ORDER,
} from "../../constants/models";
import { IconButton } from "../../design-system/IconButton";
import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { APP_LANGUAGE_OPTIONS } from "../../i18n/localeRegistry";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { Settings } from "../../types";
import type { SettingsReadiness } from "../settings-core/readiness";
import type { ProviderHealthState, SettingsPage } from "../settings-core/types";

import { PremiumBand } from "./settings-primitives/PremiumBand";
import {
  RuntimeReadiness,
  type ReadinessStep,
} from "./settings-primitives/RuntimeReadiness";
import { SettingsGroup } from "./settings-primitives/SettingsGroup";
import { SettingsRow } from "./settings-primitives/SettingsRow";

type DrillInSettingsPage = Exclude<SettingsPage, "overview">;
type OverviewPage = DrillInSettingsPage;

type OverviewRow = {
  page: OverviewPage;
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

const overviewRows: Record<OverviewPage, OverviewRow> = {
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

const overviewGroups = [
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
const READINESS_PAGE: Record<ReadinessStep, OverviewPage> = {
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
    case "drive-session":
      return t("driveSession");
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

function getResponseModeLabel(settings: Settings, isPremium: boolean) {
  const modes = isPremium
    ? settings.responseModes
    : settings.responseModes.filter((mode) => mode.route.runtime === "local");
  return modes
    .map(({ route }) =>
      route.runtime === "local" && route.localModelId
        ? getLocalModel(route.localModelId).name
        : getProviderModelName(route.provider, route.model),
    )
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
    return ["Kokoro", settings.kokoroVoices[language]]
      .filter(Boolean)
      .join(" · ");
  }
  if (settings.ttsMode === "local" && settings.localTtsModelId) {
    return getLocalModel(settings.localTtsModelId).name;
  }
  if (settings.ttsMode === "provider" && settings.ttsProvider) {
    return [
      PROVIDER_LABELS[settings.ttsProvider],
      settings.providerTtsVoices[settings.ttsProvider],
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return t("systemVoice");
}

function getOverviewState({
  getProviderHealthState,
  isPremium,
  page,
  settings,
  t,
}: {
  getProviderHealthState: (
    provider: keyof Settings["apiKeys"],
  ) => ProviderHealthState;
  isPremium: boolean;
  page: OverviewPage;
  settings: Settings;
  t: ReturnType<typeof useLocalization>["t"];
}) {
  switch (page) {
    case "connections": {
      if (!isPremium) {
        return t("premium");
      }
      const configured = PROVIDER_ORDER.filter(
        (provider) => settings.apiKeys[provider]?.trim().length > 0,
      );
      return configured.length > 0
        ? configured
            .slice(0, 3)
            .map(
              (provider) =>
                `${PROVIDER_LABELS[provider]} ${getHealthLabel(
                  getProviderHealthState(provider),
                  t,
                ).toLocaleLowerCase()}`,
            )
            .join(" · ")
        : t("providerStatusNotSetup");
    }
    case "thinking":
      return (
        getResponseModeLabel(settings, isPremium) || t("providerStatusNotSetup")
      );
    case "search":
      if (!isPremium) {
        return t("premium");
      }
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
  isPremium,
  onOpenPage,
  onOpenPremium,
  readiness,
  settings,
}: {
  getProviderHealthState: (
    provider: keyof Settings["apiKeys"],
  ) => ProviderHealthState;
  isPremium: boolean;
  onOpenPage: (page: OverviewPage) => void;
  onOpenPremium: () => void;
  readiness: SettingsReadiness;
  settings: Settings;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [showPremiumCard, setShowPremiumCard] = React.useState(true);

  return (
    <View testID="settings-page-overview" style={localStyles.overview}>
      {isPremium && showPremiumCard ? (
        <View
          testID="settings-edition-card"
          style={[
            localStyles.premiumCard,
            {
              backgroundColor: colors.premiumSoft,
              borderColor: colors.premiumBorder,
            },
          ]}
        >
          <PhosphorIcon
            name="check-circle"
            size="prominent"
            color={colors.premium}
          />
          <View style={localStyles.premiumCopy}>
            <Text style={[localStyles.premiumTitle, { color: colors.text }]}>
              {t("premiumUnlocked")}
            </Text>
            <Text
              style={[
                localStyles.premiumSupporting,
                { color: colors.textSecondary },
              ]}
            >
              {t("premiumDescription")}
            </Text>
          </View>
          <IconButton
            icon="close"
            accessibilityLabel={t("dismiss")}
            onPress={() => setShowPremiumCard(false)}
          />
        </View>
      ) : null}

      <RuntimeReadiness
        onSelect={(step) => onOpenPage(READINESS_PAGE[step])}
        readiness={readiness}
      />

      {overviewGroups.map((group) => (
        <SettingsGroup key={group.titleKey} title={t(group.titleKey)}>
          {group.pages.map((page, index) => {
            const row = overviewRows[page];
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
                  isPremium,
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

      {!isPremium ? (
        <View
          testID="settings-premium-upgrade"
          style={[localStyles.bandClip, { borderColor: colors.premiumBorder }]}
        >
          <PremiumBand
            actionLabel={t("upgradeToPremium")}
            copy={t("premiumDescription")}
            onPress={onOpenPremium}
            premiumLabel={t("premium")}
          />
        </View>
      ) : null}

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
  premiumCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  premiumCopy: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  premiumTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 22,
  },
  premiumSupporting: {
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  bandClip: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  releaseVersion: {
    paddingBottom: 4,
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
