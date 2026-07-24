import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { PROVIDER_MODELS } from "../../constants/models";
import {
  MAX_RESPONSE_MODES,
  MIN_RESPONSE_MODES,
} from "../../constants/providers/defaults";
import { useLocalization } from "../../i18n";
import type {
  Provider,
  ResponseMode,
  ResponseModeRoute,
  Settings,
} from "../../types";
import { useTheme } from "../../theme/ThemeContext";
import {
  getDefaultModelForProvider,
  isValidModelForProvider,
} from "../../utils/responseModes";
import {
  getModelEffortOptionLabel,
  getModelEffortOptions,
  normalizeResponseModeRouteEffort,
} from "../../utils/modelEffort";
import { Picker } from "../Picker";

import { renderProviderPickerOptions } from "./helpers";
import { styles } from "./styles";

export function ResponseModesSection({
  settings,
  enabledProviders,
  onUpdateResponseModeRoute,
  onAddResponseMode,
  onRemoveResponseMode,
}: {
  settings: Settings;
  enabledProviders: Provider[];
  onUpdateResponseModeRoute: (
    mode: ResponseMode,
    route: ResponseModeRoute,
  ) => void;
  onAddResponseMode: () => void;
  onRemoveResponseMode: (mode: ResponseMode) => void;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const canAddResponseMode = settings.responseModes.length < MAX_RESPONSE_MODES;
  const canRemoveResponseMode =
    settings.responseModes.length > MIN_RESPONSE_MODES;

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
      ]}
    >
      <View style={styles.responseModesHeader}>
        <Text
          accessibilityRole="header"
          style={[
            styles.settingsSectionTitle,
            styles.responseModesHeaderLabel,
            { color: colors.text },
          ]}
        >
          {t("responseModes")}
        </Text>
        {canAddResponseMode ? (
          <TouchableOpacity
            style={[
              styles.responseModeHeaderButton,
              { borderColor: colors.border },
            ]}
            onPress={onAddResponseMode}
            accessibilityRole="button"
            accessibilityLabel={t("addResponseMode")}
          >
            <Feather name="plus" size={14} color={colors.accent} />
            <Text
              style={[
                styles.responseModeHeaderButtonText,
                { color: colors.accent },
              ]}
            >
              {t("addResponseMode")}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {enabledProviders.length === 0 ? (
        <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
          {t("responseModesNoConfiguredProviders")}
        </Text>
      ) : (
        <View style={styles.responseModeList}>
          {settings.responseModes.map((mode, index) => {
            const normalizedRoute = normalizeResponseModeRouteEffort(
              mode.route,
            );
            const effortOptions = getModelEffortOptions(
              normalizedRoute.provider,
              normalizedRoute.model,
            );
            const showEffortPicker =
              effortOptions.length > 0 && !!normalizedRoute.effort;

            return (
              <View
                key={mode.id}
                style={[
                  styles.responseModeItem,
                  {
                    borderTopColor: colors.border,
                    borderTopWidth: index === 0 ? 0 : 1,
                    paddingBottom:
                      index === settings.responseModes.length - 1 ? 4 : 18,
                    paddingTop: index === 0 ? 8 : 20,
                  },
                ]}
              >
                <View style={styles.responseModeHeaderRow}>
                  <Text
                    style={[styles.responseModeTitle, { color: colors.text }]}
                  >
                    {t("responseModeItemTitle", { index: index + 1 })}
                  </Text>
                  {canRemoveResponseMode ? (
                    <TouchableOpacity
                      style={[
                        styles.responseModeRemoveButton,
                        { borderColor: colors.border },
                      ]}
                      onPress={() => onRemoveResponseMode(mode.id)}
                      accessibilityRole="button"
                      accessibilityLabel={t("removeResponseMode")}
                    >
                      <Feather
                        name="trash-2"
                        size={14}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <Picker
                  label={t("provider")}
                  dropdownLabel={t("provider")}
                  hideLabel
                  containerStyle={styles.responseModePicker}
                  value={normalizedRoute.provider}
                  options={renderProviderPickerOptions(enabledProviders)}
                  onChange={(value) => {
                    const nextProvider = value as Provider;
                    const preferredModel = settings.providerModels[nextProvider];
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

                <Picker
                  label={t("model")}
                  dropdownLabel={t("model")}
                  hideLabel
                  containerStyle={
                    showEffortPicker
                      ? styles.responseModePicker
                      : styles.responseModePickerLast
                  }
                  value={normalizedRoute.model}
                  options={PROVIDER_MODELS[normalizedRoute.provider].map(
                    (model) => ({
                      value: model.id,
                      label: model.name,
                    }),
                  )}
                  onChange={(value) =>
                    onUpdateResponseModeRoute(
                      mode.id,
                      normalizeResponseModeRouteEffort({
                        ...normalizedRoute,
                        model: value,
                      }),
                    )
                  }
                />

                {showEffortPicker ? (
                  <Picker
                    label={t("effort")}
                    dropdownLabel={t("effort")}
                    hideLabel
                    containerStyle={styles.responseModePickerLast}
                    value={normalizedRoute.effort ?? ""}
                    options={effortOptions.map((option) => ({
                      value: option.id,
                      label: getModelEffortOptionLabel(option, language),
                    }))}
                    onChange={(value) =>
                      onUpdateResponseModeRoute(
                        mode.id,
                        normalizeResponseModeRouteEffort({
                          ...normalizedRoute,
                          effort: value,
                        }),
                      )
                    }
                  />
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
