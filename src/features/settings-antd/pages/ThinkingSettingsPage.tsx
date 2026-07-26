import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Button,
  Collapse,
  Icon,
} from "@ant-design/react-native";

import { antButtonTypography } from "../../../design-system/antTypography";
import { PROVIDER_MODELS } from "../../../constants/models";
import {
  MAX_RESPONSE_MODES,
  MIN_RESPONSE_MODES,
} from "../../../constants/providers/defaults";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
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
  isValidModelForProvider,
} from "../../../utils/responseModes";
import { renderProviderPickerOptions } from "../../settings-core/helpers";

import {
  AntButtonLabel,
  AntPickerRow,
  AntSettingsCard,
  AntTextArea,
} from "../AntSettingsPrimitives";
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
  const canAdd = settings.responseModes.length < MAX_RESPONSE_MODES;
  const canRemove = settings.responseModes.length > MIN_RESPONSE_MODES;

  return (
    <View style={styles.pageStack}>
      <AntSettingsCard>
        <View style={styles.responseModeHeader}>
          <Text
            accessibilityRole="header"
            style={[styles.sectionTitle, { color: colors.text }]}
          >
            {t("responseModes")}
          </Text>
          {canAdd ? (
            <Button
              size="small"
              type="ghost"
              style={StyleSheet.flatten([
                styles.compactButton,
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

        {llmProviders.length === 0 ? (
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("responseModesNoConfiguredProviders")}
          </Text>
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
              <View
                key={mode.id}
                style={[
                  styles.responseModeItem,
                  index === 0 ? styles.responseModeItemFirst : null,
                  { borderTopColor: colors.border },
                ]}
              >
                <View style={styles.responseModeTitleRow}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>
                    {t("responseModeItemTitle", { index: index + 1 })}
                  </Text>
                  {canRemove ? (
                    <Button
                      size="small"
                      type="ghost"
                      style={StyleSheet.flatten([
                        styles.compactButton,
                        { borderColor: colors.border },
                      ])}
                      onPress={() => onRemoveResponseMode(mode.id)}
                      accessibilityLabel={t("removeResponseMode")}
                      styles={antButtonTypography}
                    >
                      <Icon
                        name="delete"
                        size={15}
                        color={colors.textSecondary}
                      />
                    </Button>
                  ) : null}
                </View>
                <AntPickerRow
                  label={t("provider")}
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
                  options={PROVIDER_MODELS[route.provider].map((model) => ({
                    value: model.id,
                    label: model.name,
                  }))}
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
              </View>
            );
          })
        )}
      </AntSettingsCard>

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
          <Collapse.Panel key="system-prompt" title={t("systemPrompt")}>
            <View style={styles.accordionBody}>
              <Text
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {t("assistantInstructionsIntro")}
              </Text>
              <AntTextArea
                value={settings.assistantInstructions}
                placeholder={t("assistantInstructionsPlaceholder")}
                onChange={(value) =>
                  onUpdate({ assistantInstructions: value })
                }
              />
            </View>
          </Collapse.Panel>
        </Collapse>
      </AntSettingsCard>
    </View>
  );
}
