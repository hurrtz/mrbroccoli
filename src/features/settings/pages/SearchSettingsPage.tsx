import React from "react";
import { View } from "react-native";

import { PROVIDER_LABELS } from "../../../constants/models";
import {
  WEB_SEARCH_DEPTH_VALUES,
  WEB_SEARCH_RESULT_LIMIT_VALUES,
  WEB_SEARCH_SEARCH_MODE_VALUES,
  getWebSearchProviderControlSupport,
  normalizeWebSearchProviderSettings,
  type WebSearchProvider,
  type WebSearchProviderSettings,
} from "../../../constants/webSearch";
import { useLocalization } from "../../../i18n";
import type { Settings } from "../../../types";

import { PremiumBand } from "../settings-primitives/PremiumBand";
import { RouteOptionRow } from "../settings-primitives/RouteOptionRow";
import { SettingsChoiceRow } from "../settings-primitives/SettingsChoiceRow";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { styles } from "../styles";

export function SearchSettingsPage({
  allSearchProviders,
  isPremium,
  onOpenPremium,
  onUpdate,
  searchProviders,
  settings,
}: {
  allSearchProviders: readonly WebSearchProvider[];
  isPremium: boolean;
  onOpenPremium: () => void;
  settings: Settings;
  searchProviders: WebSearchProvider[];
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
}) {
  const { t } = useLocalization();
  const visibleProviders = isPremium ? searchProviders : allSearchProviders;
  const selectedWebSearchProvider =
    settings.webSearchMode === "on" ? settings.webSearchProvider : null;
  const selectedProviderSettings = selectedWebSearchProvider
    ? normalizeWebSearchProviderSettings(
        selectedWebSearchProvider,
        settings.webSearchProviderSettings[selectedWebSearchProvider],
      )
    : null;
  const controlSupport = selectedWebSearchProvider
    ? getWebSearchProviderControlSupport(selectedWebSearchProvider)
    : { resultLimit: false, depth: false, searchMode: false };

  const updateProviderSettings = React.useCallback(
    (partial: Partial<WebSearchProviderSettings>) => {
      if (!selectedWebSearchProvider || !selectedProviderSettings) {
        return;
      }
      onUpdate({
        webSearchProviderSettings: {
          ...settings.webSearchProviderSettings,
          [selectedWebSearchProvider]: {
            ...selectedProviderSettings,
            ...partial,
          },
        },
      });
    },
    [
      onUpdate,
      selectedProviderSettings,
      selectedWebSearchProvider,
      settings.webSearchProviderSettings,
    ],
  );

  return (
    <View testID="search-settings-page" style={styles.sectionPageStack}>
      <SettingsGroup
        title={t("whoSearches")}
        footer={t("whoSearchesFooter")}
      >
        <RouteOptionRow
          testID="settings-search-route-nobody"
          label={t("webSearchNobody")}
          last={visibleProviders.length === 0 && isPremium}
          description={t("webSearchNobodyDescription")}
          selected={settings.webSearchMode === "off"}
          onSelect={() => onUpdate({ webSearchMode: "off" })}
        />
        {visibleProviders.map((provider, index) => (
          <RouteOptionRow
            key={provider}
            testID={`settings-search-route-provider-${provider}`}
            label={PROVIDER_LABELS[provider]}
            locked={!isPremium}
            last={index === visibleProviders.length - 1 && isPremium}
            meta={`${t("provider")} · ${t("apiKey")}`}
            selected={selectedWebSearchProvider === provider}
            onSelect={() =>
              onUpdate({
                webSearchMode: "on",
                webSearchProvider: provider,
              })
            }
          />
        ))}
        {!isPremium ? (
          <PremiumBand
            actionLabel={t("upgradeToPremium")}
            copy={t("premiumBenefitTools")}
            onPress={onOpenPremium}
            premiumLabel={t("premium")}
          />
        ) : null}
      </SettingsGroup>

      {selectedWebSearchProvider && selectedProviderSettings ? (
        <SettingsGroup
          testID="settings-search-quality"
          title={t("webSearchQualityControls")}
          footer={t("webSearchQualityHint", {
            provider: PROVIDER_LABELS[selectedWebSearchProvider],
          })}
        >
          <SettingsChoiceRow
            testID="web-search-result-limit"
            icon="line-chart"
            label={t("webSearchResultCount")}
            options={WEB_SEARCH_RESULT_LIMIT_VALUES.map((value) => ({
              value: String(value),
              label: String(value),
            }))}
            value={String(selectedProviderSettings.resultLimit)}
            onChange={(value) =>
              updateProviderSettings({
                resultLimit: Number(value) as 3 | 5 | 8,
              })
            }
            last={!controlSupport.depth && !controlSupport.searchMode}
          />
          {controlSupport.depth ? (
            <SettingsChoiceRow
              testID="web-search-depth"
              icon="search"
              label={t("webSearchDepth")}
              options={WEB_SEARCH_DEPTH_VALUES.map((value) => ({
                value,
                label:
                  value === "deep"
                    ? t("webSearchDepthDeep")
                    : t("webSearchDepthStandard"),
              }))}
              value={selectedProviderSettings.depth}
              onChange={(depth) => updateProviderSettings({ depth })}
              last={!controlSupport.searchMode}
            />
          ) : null}
          {controlSupport.searchMode ? (
            <SettingsChoiceRow
              testID="web-search-search-mode"
              icon="sliders"
              label={t("webSearchSearchMode")}
              options={WEB_SEARCH_SEARCH_MODE_VALUES.map((value) => ({
                value,
                label:
                  value === "quick"
                    ? t("webSearchSearchModeQuick")
                    : value === "deep"
                      ? t("webSearchSearchModeDeep")
                      : t("webSearchSearchModeBalanced"),
              }))}
              value={selectedProviderSettings.searchMode}
              onChange={(searchMode) => updateProviderSettings({ searchMode })}
              last
            />
          ) : null}
        </SettingsGroup>
      ) : null}
    </View>
  );
}
