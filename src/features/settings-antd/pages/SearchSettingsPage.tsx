import React from "react";
import { Text, View } from "react-native";

import { Collapse, List } from "@ant-design/react-native";

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
  AntPickerRow,
  AntPickerSection,
  AntSectionIntro,
  AntSettingsCard,
} from "../AntSettingsPrimitives";
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
  const selectedWebSearchProvider =
    settings.webSearchProvider ?? searchProviders[0] ?? null;
  const pickerOptions = buildProviderPickerOptions(
    searchProviders,
    selectedWebSearchProvider,
    t("providerNeedsAttention"),
  );
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
          description={t("settingsWebSearchCompactHint")}
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
        description={t("settingsWebSearchCompactHint")}
      />
      <AntPickerSection
        helperText={
          pickerOptions.length === 0
            ? t("webSearchProviderMissingHint")
            : undefined
        }
      >
        {selectedWebSearchProvider ? (
          <AntPickerRow
            label={t("webSearchProvider")}
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
              Content: {
                color: colors.textSecondary,
                fontFamily: fonts.body,
              },
            }}
          >
            {t("webSearchProviderMissingHint")}
          </List.Item>
        )}
      </AntPickerSection>

      {hasAdvancedControls && selectedProviderSettings ? (
        <AntSettingsCard contentStyle={styles.fullBleedCardContent}>
          <Collapse
            accordion
            styles={{
              Item: {
                backgroundColor: colors.surfaceElevated,
              },
              Content: {
                color: colors.text,
                fontFamily: fonts.bodyMedium,
                fontSize: 15,
                fontWeight: "600",
              },
            }}
          >
            <Collapse.Panel
              key="advanced"
              title={t("webSearchAdvanced")}
            >
              <View style={styles.accordionBody}>
                <View>
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
                </View>
              </View>
            </Collapse.Panel>
          </Collapse>
        </AntSettingsCard>
      ) : null}
    </View>
  );
}
