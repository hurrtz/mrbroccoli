import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { ResponseModeToggle } from "../../components/ResponseModeToggle";
import { Colors } from "../../theme/colors";
import { ResponseMode, ResponseModeSelections } from "../../types";

import { TranslateFn } from "./shared";
import { styles } from "./styles";

interface MainScreenRouteCardProps {
  activeResponseMode: ResponseMode;
  availableResponseModes: ResponseMode[];
  colors: Colors;
  compact?: boolean;
  onOpenSetupGuide: () => void;
  onSelectResponseMode: (mode: ResponseMode) => void;
  responseModes: ResponseModeSelections;
  style?: StyleProp<ViewStyle>;
  t: TranslateFn;
}

export const MainScreenRouteCard = React.memo(function MainScreenRouteCard({
  activeResponseMode,
  availableResponseModes,
  colors,
  compact = false,
  onOpenSetupGuide,
  onSelectResponseMode,
  responseModes,
  style,
  t,
}: MainScreenRouteCardProps) {
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
      {availableResponseModes.length > 0 ? (
        <View testID="response-mode-row" style={styles.routeModeRow}>
          <ResponseModeToggle
            compact={compact}
            selected={activeResponseMode}
            onSelect={onSelectResponseMode}
            modes={responseModes}
            readyModes={availableResponseModes}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.providerEmptyState,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={onOpenSetupGuide}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={`${t("setupGuideConnectProviderTitle")}. ${t("setupGuideConnectProviderDescription")}`}
        >
          <View style={styles.providerEmptyHeader}>
            <View
              style={[
                styles.providerEmptyBadge,
                {
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="key" size={14} color={colors.text} />
            </View>
            <Feather name="arrow-up-right" size={16} color={colors.accent} />
          </View>
          <Text style={[styles.providerEmptyTitle, { color: colors.text }]}>
            {t("setupGuideConnectProviderTitle")}
          </Text>
          <Text
            style={[styles.providerEmptyText, { color: colors.textSecondary }]}
          >
            {t("setupGuideConnectProviderDescription")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
