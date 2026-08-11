import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { ResponseMode, ResponseModeSelections } from "../../types";

import { MainScreenRouteByline } from "./MainScreenRouteByline";
import { styles } from "./styles";

interface MainScreenRouteCardProps {
  activeResponseMode: ResponseMode;
  availableResponseModes: ResponseMode[];
  onOpenRoutePicker: () => void;
  responseModes: ResponseModeSelections;
  style?: StyleProp<ViewStyle>;
}

export const MainScreenRouteCard = React.memo(function MainScreenRouteCard({
  activeResponseMode,
  availableResponseModes,
  onOpenRoutePicker,
  responseModes,
  style,
}: MainScreenRouteCardProps) {
  const activeMode =
    responseModes.find((mode) => mode.id === activeResponseMode) ??
    responseModes[0];

  if (availableResponseModes.length === 0 || !activeMode) {
    return null;
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
