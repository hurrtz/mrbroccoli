import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@ant-design/react-native";
import { PhosphorIcon } from "../../../design-system/PhosphorIcon";

import {
  MAX_RESPONSE_MODES,
  MIN_RESPONSE_MODES,
} from "../../../constants/providers/defaults";
import { antButtonTypography } from "../../../design-system/antTypography";
import { IconButton } from "../../../design-system/IconButton";
import { useLocalization } from "../../../i18n";
import { useRuntimeCapabilityOverrides } from "../../../hooks/useRuntimeCapabilityOverrides";
import { useTheme } from "../../../theme/ThemeContext";
import type {
  Provider,
  ResponseMode,
  ResponseModeRoute,
  Settings,
} from "../../../types";
import {
  getModelEffortOptionLabel,
  getModelEffortOptions,
  normalizeResponseModeRouteEffort,
} from "../../../utils/modelEffort";
import {
  getDefaultModelForProvider,
  getAvailableResponseModes,
  getProviderLlmModelOptions,
  isValidModelForProvider,
} from "../../../utils/responseModes";
import { renderProviderPickerOptions } from "../../settings-core/helpers";

import {
  AntButtonLabel,
  AntNumberInputRow,
  AntPickerRow,
  AntPickerRows,
  AntSectionIntro,
  AntSettingsCard,
  AntSwitchRow,
  AntTextArea,
} from "../AntSettingsPrimitives";
import { AntSettingsInfoButton } from "../AntSettingsInfoButton";
import { styles } from "../styles";

export function ThinkingSettingsPage({
  settings,
  llmProviders,
  onUpdate,
  onUpdateResponseModeRoute,
  onAddResponseMode,
  onRemoveResponseMode,
}: {
  settings: Settings;
  llmProviders: Provider[];
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateResponseModeRoute: (
    mode: ResponseMode,
    route: ResponseModeRoute,
  ) => void;
  onAddResponseMode: () => void;
  onRemoveResponseMode: (mode: ResponseMode) => void;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  useRuntimeCapabilityOverrides();
  const canAdd = settings.responseModes.length < MAX_RESPONSE_MODES;
  const canRemove = settings.responseModes.length > MIN_RESPONSE_MODES;
  const readyModelCount = getAvailableResponseModes(settings).length;

  return (
    <View testID="thinking-settings-page" style={styles.sectionPageStack}>
      <View testID="model-selection-section" style={styles.sectionGroup}>
        <AntSectionIntro
          title={t("responseModes")}
          extra={
            <AntSettingsInfoButton
              accessibilityLabel={t("aboutModelSelection")}
              title={t("responseModes")}
            >
              {t("modelSelectionInfo")}
            </AntSettingsInfoButton>
          }
        />

        {llmProviders.length === 0 ? (
          <AntSettingsCard>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {t("responseModesNoConfiguredProviders")}
            </Text>
          </AntSettingsCard>
        ) : (
          settings.responseModes.map((mode, index) => {
            const route = normalizeResponseModeRouteEffort(mode.route);
            const effortOptions = getModelEffortOptions(
              route.provider,
              route.model,
            );
            const showEffort =
              effortOptions.length > 0 && route.effort !== undefined;

            return (
              <AntSettingsCard
                key={mode.id}
                title={t("responseModeItemTitle", { index: index + 1 })}
                headerExtra={
                  canRemove ? (
                    <IconButton
                      accessibilityLabel={t("removeResponseMode")}
                      iconNode={
                        <PhosphorIcon
                          name="delete"
                          size="control"
                          color={colors.danger}
                        />
                      }
                      onPress={() => onRemoveResponseMode(mode.id)}
                    />
                  ) : null
                }
                contentStyle={styles.fullBleedCardContent}
              >
                <AntPickerRows>
                  <AntPickerRow
                    testID={`settings-model-provider-${mode.id}`}
                    label={llmProviders.length > 1 ? t("provider") : undefined}
                    value={route.provider}
                    options={renderProviderPickerOptions(llmProviders)}
                    onChange={(value) => {
                      const nextProvider = value as Provider;
                      const preferredModel =
                        settings.providerModels[nextProvider];
                      const nextModel = isValidModelForProvider(
                        nextProvider,
                        preferredModel,
                      )
                        ? preferredModel
                        : getDefaultModelForProvider(nextProvider);

                      onUpdateResponseModeRoute(
                        mode.id,
                        normalizeResponseModeRouteEffort({
                          provider: nextProvider,
                          model: nextModel,
                        }),
                      );
                    }}
                  />
                  <AntPickerRow
                    label={t("model")}
                    value={route.model}
                    options={getProviderLlmModelOptions(route.provider).map(
                      (model) => ({
                        value: model.id,
                        label: model.name,
                      }),
                    )}
                    onChange={(value) =>
                      onUpdateResponseModeRoute(
                        mode.id,
                        normalizeResponseModeRouteEffort({
                          ...route,
                          model: value,
                        }),
                      )
                    }
                  />
                  {showEffort ? (
                    <AntPickerRow
                      label={t("effort")}
                      value={route.effort ?? ""}
                      options={effortOptions.map((option) => ({
                        value: option.id,
                        label: getModelEffortOptionLabel(option, language),
                      }))}
                      onChange={(value) =>
                        onUpdateResponseModeRoute(
                          mode.id,
                          normalizeResponseModeRouteEffort({
                            ...route,
                            effort: value,
                          }),
                        )
                      }
                    />
                  ) : null}
                </AntPickerRows>
              </AntSettingsCard>
            );
          })
        )}

        {canAdd ? (
          <Button
            size="small"
            type="ghost"
            style={StyleSheet.flatten([
              styles.compactButton,
              styles.addModelButton,
              { borderColor: colors.border },
            ])}
            onPress={onAddResponseMode}
            accessibilityLabel={t("addResponseMode")}
            styles={antButtonTypography}
          >
            <AntButtonLabel
              color={colors.accent}
              icon="plus"
              label={t("addResponseMode")}
            />
          </Button>
        ) : null}
      </View>

      <View testID="ulra-mode-settings-section" style={styles.sectionGroup}>
        <AntSectionIntro
          title={t("ulraMode")}
          extra={
            <AntSettingsInfoButton
              accessibilityLabel={t("aboutSetting", {
                setting: t("ulraMode"),
              })}
              title={t("ulraMode")}
            >
              {t("ulraModeInfo")}
            </AntSettingsInfoButton>
          }
        />
        <AntSettingsCard>
          <AntSwitchRow
            label={t("ulraModeHomeLabel")}
            description={t("ulraModeSettingsDescription")}
            value={settings.ulraModeEnabled}
            onChange={(value) =>
              onUpdate({
                ulraModeEnabled: value,
                ...(value ? {} : { ulraModeActive: false }),
              })
            }
          />
          {settings.ulraModeEnabled ? (
            <>
              <AntNumberInputRow
                label={t("ulraModeRounds")}
                value={settings.ulraModeRounds}
                onChange={(value) => onUpdate({ ulraModeRounds: value })}
              />
              <Text
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {t("ulraModeCallEstimate", {
                  count: readyModelCount * (settings.ulraModeRounds + 1) + 1,
                })}
              </Text>
              {readyModelCount > 4 || settings.ulraModeRounds > 3 ? (
                <Text
                  testID="ulra-mode-threshold-warning"
                  accessibilityRole="alert"
                  style={[styles.warningText, { color: colors.danger }]}
                >
                  {t("ulraModeThresholdWarning")}
                </Text>
              ) : null}
            </>
          ) : null}
        </AntSettingsCard>
      </View>

      <View testID="system-prompt-section" style={styles.sectionGroup}>
        <AntSectionIntro
          title={t("systemPrompt")}
          extra={
            <AntSettingsInfoButton
              accessibilityLabel={t("aboutSystemPrompt")}
              title={t("systemPrompt")}
            >
              {t("assistantInstructionsIntro")}
            </AntSettingsInfoButton>
          }
        />
        <View testID="system-prompt-editor" style={styles.fullWidthField}>
          <AntTextArea
            value={settings.assistantInstructions}
            placeholder={t("assistantInstructionsPlaceholder")}
            onChange={(value) => onUpdate({ assistantInstructions: value })}
          />
        </View>
      </View>
    </View>
  );
}
