import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";

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
          testID="provider-empty-state"
          style={[
            styles.providerEmptyState,
            compact ? styles.providerEmptyStateCompact : null,
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
              <PhosphorIcon name="key" size="inline" color={colors.text} />
            </View>
            <PhosphorIcon name="export" size="compact" color={colors.accent} />
          </View>
          <Text style={[styles.providerEmptyTitle, { color: colors.text }]}>
            {t("setupGuideConnectProviderTitle")}
          </Text>
          {!compact ? (
            <Text
              style={[styles.providerEmptyText, { color: colors.textSecondary }]}
            >
              {t("setupGuideConnectProviderDescription")}
            </Text>
          ) : null}
        </TouchableOpacity>
      )}
    </View>
  );
});
