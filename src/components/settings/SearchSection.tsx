import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import {
  WEB_SEARCH_DEPTH_VALUES,
  WEB_SEARCH_RESULT_LIMIT_VALUES,
  WEB_SEARCH_SEARCH_MODE_VALUES,
  getWebSearchProviderControlSupport,
  normalizeWebSearchProviderSettings,
  type WebSearchProvider,
  type WebSearchProviderSettings,
} from "../../constants/webSearch";
import { useLocalization } from "../../i18n";
import type { Settings } from "../../types";
import { useTheme } from "../../theme/ThemeContext";
import { Picker } from "../Picker";

import { buildProviderPickerOptions } from "./providerPickerOptions";
import { styles } from "./styles";

export function SearchSection({
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
  const [advancedSearchOpen, setAdvancedSearchOpen] = React.useState(false);
  const selectableSearchProviders = searchProviders;
  const selectedWebSearchProvider =
    settings.webSearchProvider ?? selectableSearchProviders[0] ?? null;
  const webSearchPickerOptions = buildProviderPickerOptions(
    selectableSearchProviders,
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
    : {
        resultLimit: false,
        depth: false,
        searchMode: false,
      };

  const updateWebSearchProviderSettings = React.useCallback(
    (partial: Partial<WebSearchProviderSettings>) => {
      onUpdate({
        webSearchProviderSettings: {
          ...settings.webSearchProviderSettings,
          ...(selectedWebSearchProvider && selectedProviderSettings
            ? {
                [selectedWebSearchProvider]: {
                  ...selectedProviderSettings,
                  ...partial,
                },
              }
            : {}),
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
    <View style={styles.tabPane}>
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.inlineSwitchCopy}>
          <Text
            accessibilityRole="header"
            style={[styles.settingsSectionTitle, { color: colors.text }]}
          >
            {t("webSearch")}
          </Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            {t("settingsWebSearchCompactHint")}
          </Text>
        </View>

        {selectableSearchProviders.length > 0 ? (
          <>
            {selectedWebSearchProvider ? (
              <Picker
                label={t("webSearchProvider")}
                value={selectedWebSearchProvider}
                options={webSearchPickerOptions}
                disabled={webSearchPickerOptions.length === 0}
                containerStyle={styles.webSearchProviderPicker}
                onChange={(value) =>
                  onUpdate({ webSearchProvider: value as WebSearchProvider })
                }
              />
            ) : null}

            {webSearchPickerOptions.length === 0 ? (
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {t("webSearchProviderMissingHint")}
              </Text>
            ) : null}

            {controlSupport.resultLimit ||
            controlSupport.depth ||
            controlSupport.searchMode ? (
              <View style={styles.inlineAccordion}>
                <TouchableOpacity
                  style={[
                    styles.inlineAccordionButton,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setAdvancedSearchOpen((previous) => !previous)}
                >
                  <Text
                    style={[styles.inlineAccordionTitle, { color: colors.text }]}
                  >
                    {t("webSearchAdvanced")}
                  </Text>
                  <Feather
                    name={advancedSearchOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>

                {advancedSearchOpen && selectedProviderSettings ? (
                  <View
                    style={[
                      styles.inlineAccordionBody,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {controlSupport.resultLimit ? (
                      <Picker
                        label={t("webSearchResultCount")}
                        value={String(selectedProviderSettings.resultLimit)}
                        options={WEB_SEARCH_RESULT_LIMIT_VALUES.map((value) => ({
                          value: String(value),
                          label: `${value}`,
                        }))}
                        onChange={(value) =>
                          updateWebSearchProviderSettings({
                            resultLimit: Number(value) as 3 | 5 | 8,
                          })
                        }
                      />
                    ) : null}
                    {controlSupport.depth ? (
                      <Picker
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
                          updateWebSearchProviderSettings({
                            depth: value as WebSearchProviderSettings["depth"],
                          })
                        }
                      />
                    ) : null}
                    {controlSupport.searchMode ? (
                      <Picker
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
                          updateWebSearchProviderSettings({
                            searchMode:
                              value as WebSearchProviderSettings["searchMode"],
                          })
                        }
                      />
                    ) : null}
                  </View>
                ) : null}
              </View>
            ) : null}
          </>
        ) : (
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            {t("webSearchSetupNeeded")}
          </Text>
        )}
      </View>
    </View>
  );
}
