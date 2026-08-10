import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";

import { Colors } from "../../theme/colors";
import { ResponseMode, ResponseModeSelections } from "../../types";

import { MainScreenRouteByline } from "./MainScreenRouteByline";
import { TranslateFn } from "./shared";
import { styles } from "./styles";

interface MainScreenRouteCardProps {
  activeResponseMode: ResponseMode;
  availableResponseModes: ResponseMode[];
  colors: Colors;
  compact?: boolean;
  isPremium: boolean;
  offlineReady: boolean;
  onOpenRoutePicker: () => void;
  onOpenSetupGuide: () => void;
  responseModes: ResponseModeSelections;
  style?: StyleProp<ViewStyle>;
  t: TranslateFn;
}

export const MainScreenRouteCard = React.memo(function MainScreenRouteCard({
  activeResponseMode,
  availableResponseModes,
  colors,
  compact = false,
  isPremium,
  offlineReady,
  onOpenRoutePicker,
  onOpenSetupGuide,
  responseModes,
  style,
  t,
}: MainScreenRouteCardProps) {
  const activeMode =
    responseModes.find((mode) => mode.id === activeResponseMode) ??
    responseModes[0];

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
      {!isPremium ? (
        <TouchableOpacity
          testID="free-edition-status"
          style={[
            styles.freeEditionStatus,
            compact ? styles.freeEditionStatusCompact : null,
          ]}
          onPress={onOpenSetupGuide}
          activeOpacity={0.72}
          accessibilityRole="button"
          accessibilityLabel={`${t("freeEdition")}. ${t(
            offlineReady ? "freeOfflineReady" : "freeOfflineIntro",
          )}`}
        >
          <PhosphorIcon
            name={offlineReady ? "check-circle" : "safety-certificate"}
            size="compact"
            color={offlineReady ? colors.success : colors.accent}
          />
          <Text style={[styles.freeEditionLabel, { color: colors.text }]}>
            {t("freeEdition")}
          </Text>
          <PhosphorIcon name="right" size="inline" color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
      {availableResponseModes.length > 0 && activeMode ? (
        <View testID="response-mode-row" style={styles.routeModeRow}>
          <MainScreenRouteByline
            mode={activeMode}
            onPress={onOpenRoutePicker}
            switchable={availableResponseModes.length > 1}
          />
        </View>
      ) : !isPremium ? null : (
        <TouchableOpacity
          testID="provider-empty-state"
          style={[
            styles.providerEmptyState,
            compact ? styles.providerEmptyStateCompact : null,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.surfaceRaisedBorder,
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
                  borderColor: colors.surfaceRaisedBorder,
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
              style={[
                styles.providerEmptyText,
                { color: colors.textSecondary },
              ]}
            >
              {t("setupGuideConnectProviderDescription")}
            </Text>
          ) : null}
        </TouchableOpacity>
      )}
    </View>
  );
});
