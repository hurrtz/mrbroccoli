import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { getProviderModelName } from "../../constants/models";
import { WorkspaceHeader } from "../../design-system/WorkspaceHeader";
import { useLocalization } from "../../i18n";
import { ResponseMode, ResponseModeSelections } from "../../types";
import {
  getModelEffortOptions,
  getResponseModeRouteEffortLabel,
} from "../../utils/modelEffort";

import { MainScreenRouteByline } from "./MainScreenRouteByline";
import { styles } from "./styles";

interface MainScreenRouteCardProps {
  activeResponseMode: ResponseMode;
  availableResponseModes: ResponseMode[];
  onOpenRoutePicker: () => void;
  responseModes: ResponseModeSelections;
  presentation?: "byline" | "workspace-header";
  settingsSummary?: {
    accessibilityLabel: string;
    onPress: () => void;
    summary: string;
  };
  style?: StyleProp<ViewStyle>;
}

export const MainScreenRouteCard = React.memo(function MainScreenRouteCard({
  activeResponseMode,
  availableResponseModes,
  onOpenRoutePicker,
  presentation = "byline",
  responseModes,
  settingsSummary,
  style,
}: MainScreenRouteCardProps) {
  const { language, t } = useLocalization();
  const activeMode =
    responseModes.find((mode) => mode.id === activeResponseMode) ??
    responseModes[0];

  if (availableResponseModes.length === 0 || !activeMode) {
    return null;
  }

  if (presentation === "workspace-header" && settingsSummary) {
    const route = activeMode.route;
    const modelName = getProviderModelName(route.provider, route.model);
    const effortLabel = getResponseModeRouteEffortLabel(route, language);
    const displayedEffortLabel =
      getModelEffortOptions(route.provider, route.model).length === 0
        ? t("normal")
        : (effortLabel ?? t("normal"));

    return (
      <View style={style}>
        <WorkspaceHeader
          effort={displayedEffortLabel}
          modelAccessibilityLabel={`${modelName}. ${displayedEffortLabel}`}
          modelName={modelName}
          onOpenSettings={settingsSummary.onPress}
          onSwitchRoute={onOpenRoutePicker}
          provider={route.provider}
          settingsAccessibilityLabel={settingsSummary.accessibilityLabel}
          summary={settingsSummary.summary}
          switchable={availableResponseModes.length > 1}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.heroCard,
        style,
        {
          backgroundColor: "transparent",
        },
      ]}
    >
      <View testID="response-mode-row" style={styles.routeModeRow}>
        <MainScreenRouteByline
          mode={activeMode}
          onPress={onOpenRoutePicker}
          switchable={availableResponseModes.length > 1}
        />
      </View>
    </View>
  );
});
