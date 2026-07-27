import React from "react";
import { Text, View } from "react-native";

import { List } from "@ant-design/react-native";

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
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type { Settings } from "../../../types";
import { buildProviderPickerOptions } from "../../settings-core/providerPickerOptions";

import {
  AntDisclosureCard,
  AntPickerRow,
  AntPickerRows,
  AntPickerSection,
  AntSectionIntro,
  AntSettingsCard,
} from "../AntSettingsPrimitives";
import { AntSettingsInfoButton } from "../AntSettingsInfoButton";
import { styles } from "../styles";

export function SearchSettingsPage({
  settings,
  searchProviders,
  onUpdate,
}: {
  settings: Settings;
  searchProviders: WebSearchProvider[];
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [advancedExpanded, setAdvancedExpanded] = React.useState(false);
  const selectedWebSearchProvider =
    settings.webSearchProvider ?? searchProviders[0] ?? null;
  const pickerOptions = buildProviderPickerOptions(
    searchProviders,
    selectedWebSearchProvider,
    t("providerNeedsAttention"),
  );
  const selectedProviderLabel =
    pickerOptions.find((option) => option.value === selectedWebSearchProvider)
      ?.label ?? selectedWebSearchProvider;
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

  if (searchProviders.length === 0) {
    return (
      <View style={styles.pageStack}>
        <AntSectionIntro
          title={t("webSearch")}
          extra={
            <AntSettingsInfoButton
              accessibilityLabel={t("aboutSetting", {
                setting: t("webSearch"),
              })}
              title={t("webSearch")}
            >
              {t("settingsWebSearchCompactHint")}
            </AntSettingsInfoButton>
          }
        />
        <AntSettingsCard>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("webSearchSetupNeeded")}
          </Text>
        </AntSettingsCard>
      </View>
    );
  }

  const hasAdvancedControls =
    controlSupport.resultLimit ||
    controlSupport.depth ||
    controlSupport.searchMode;

  return (
    <View style={styles.pageStack}>
      <AntSectionIntro
        title={t("webSearch")}
        extra={
          <AntSettingsInfoButton
            accessibilityLabel={t("aboutSetting", {
              setting: t("webSearch"),
            })}
            title={t("webSearch")}
          >
            <View style={styles.infoModalContent}>
              <Text
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {t("settingsWebSearchCompactHint")}
              </Text>
              <Text
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {t("webSearchHomeHint")}
              </Text>
            </View>
          </AntSettingsInfoButton>
        }
      />
      <AntPickerSection
        title={t("webSearchProvider")}
        description={t("webSearchProviderHint")}
        helperText={
          pickerOptions.length === 0
            ? t("webSearchProviderMissingHint")
            : undefined
        }
      >
        {selectedWebSearchProvider ? (
          <AntPickerRow
            label={t("provider")}
            value={selectedWebSearchProvider}
            options={pickerOptions}
            disabled={pickerOptions.length === 0}
            onChange={(value) =>
              onUpdate({ webSearchProvider: value as WebSearchProvider })
            }
          />
        ) : (
          <List.Item
            styles={{
              Line: {
                borderBottomWidth: 0,
              },
              Content: {
                color: colors.textSecondary,
                fontFamily: fonts.body,
                fontSize: 15,
              },
            }}
          >
            {t("webSearchProviderMissingHint")}
          </List.Item>
        )}
      </AntPickerSection>

      {hasAdvancedControls && selectedProviderSettings ? (
        <AntDisclosureCard
          expanded={advancedExpanded}
          onToggle={() => setAdvancedExpanded((current) => !current)}
          header={
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              {t("webSearchAdvanced")}
            </Text>
          }
          headerExtra={
            <AntSettingsInfoButton
              accessibilityLabel={t("aboutSetting", {
                setting: t("webSearchAdvanced"),
              })}
              title={t("webSearchAdvanced")}
            >
              {t("webSearchQualityHint", {
                provider: selectedProviderLabel,
              })}
            </AntSettingsInfoButton>
          }
          toggleAccessibilityLabel={t(
            advancedExpanded
              ? "collapseAdvancedSearch"
              : "expandAdvancedSearch",
          )}
          contentStyle={styles.fullBleedCardContent}
        >
          <AntPickerRows>
            {controlSupport.resultLimit ? (
              <AntPickerRow
                label={t("webSearchResultCount")}
                value={String(selectedProviderSettings.resultLimit)}
                options={WEB_SEARCH_RESULT_LIMIT_VALUES.map((value) => ({
                  value: String(value),
                  label: String(value),
                }))}
                onChange={(value) =>
                  updateProviderSettings({
                    resultLimit: Number(value) as 3 | 5 | 8,
                  })
                }
              />
            ) : null}
            {controlSupport.depth ? (
              <AntPickerRow
                label={t("webSearchDepth")}
                value={selectedProviderSettings.depth}
                options={WEB_SEARCH_DEPTH_VALUES.map((value) => ({
                  value,
                  label:
                    value === "deep"
                      ? t("webSearchDepthDeep")
                      : t("webSearchDepthStandard"),
                }))}
                onChange={(value) =>
                  updateProviderSettings({
                    depth: value as WebSearchProviderSettings["depth"],
                  })
                }
              />
            ) : null}
            {controlSupport.searchMode ? (
              <AntPickerRow
                label={t("webSearchSearchMode")}
                value={selectedProviderSettings.searchMode}
                options={WEB_SEARCH_SEARCH_MODE_VALUES.map((value) => ({
                  value,
                  label:
                    value === "quick"
                      ? t("webSearchSearchModeQuick")
                      : value === "deep"
                        ? t("webSearchSearchModeDeep")
                        : t("webSearchSearchModeBalanced"),
                }))}
                onChange={(value) =>
                  updateProviderSettings({
                    searchMode:
                      value as WebSearchProviderSettings["searchMode"],
                  })
                }
              />
            ) : null}
          </AntPickerRows>
        </AntDisclosureCard>
      ) : null}
    </View>
  );
}
