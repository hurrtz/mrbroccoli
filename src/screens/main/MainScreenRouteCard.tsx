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
  councilReport?: {
    modelName: string;
    provider: ResponseModeSelections[number]["route"]["provider"];
    summary: string;
  };
  onOpenRoutePicker: () => void;
  responseModes: ResponseModeSelections;
  presentation?: "byline" | "workspace-header";
  running?: boolean;
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
  councilReport,
  onOpenRoutePicker,
  presentation = "byline",
  responseModes,
  running = false,
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
    const modelName =
      councilReport?.modelName ??
      getProviderModelName(route.provider, route.model);
    const effortLabel = getResponseModeRouteEffortLabel(route, language);
    const displayedEffortLabel =
      getModelEffortOptions(route.provider, route.model).length === 0
        ? t("normal")
        : (effortLabel ?? t("normal"));

    return (
      <View style={style}>
        <WorkspaceHeader
          council={Boolean(councilReport)}
          effort={displayedEffortLabel}
          modelAccessibilityLabel={`${modelName}. ${displayedEffortLabel}`}
          modelName={modelName}
          onOpenSettings={settingsSummary.onPress}
          onSwitchRoute={onOpenRoutePicker}
          provider={councilReport?.provider ?? route.provider}
          running={running}
          settingsAccessibilityLabel={settingsSummary.accessibilityLabel}
          summary={councilReport?.summary ?? settingsSummary.summary}
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
          disabled={running}
          mode={activeMode}
          onPress={onOpenRoutePicker}
          switchable={availableResponseModes.length > 1}
        />
      </View>
    </View>
  );
});
