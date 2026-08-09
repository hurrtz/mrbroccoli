import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";

import { RouteByline } from "../../components/RouteByline";
import { ResponseModeSheet } from "../../components/responseModeToggle/ResponseModeSheet";
import { Colors } from "../../theme/colors";
import { AppLanguage, ResponseMode, ResponseModeSelections } from "../../types";

import { getRouteBylineModel } from "./routeBylineModel";
import { TranslateFn } from "./shared";
import { styles } from "./styles";

interface MainScreenRouteCardProps {
  activeResponseMode: ResponseMode;
  availableResponseModes: ResponseMode[];
  colors: Colors;
  compact?: boolean;
  isPremium: boolean;
  /** Passed rather than read from context: this stays a memoized presentation
   * component, and it already takes its translate function the same way. */
  language: AppLanguage;
  offlineReady: boolean;
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
  isPremium,
  language,
  offlineReady,
  onOpenSetupGuide,
  onSelectResponseMode,
  responseModes,
  style,
  t,
}: MainScreenRouteCardProps) {
  const [routeSheetOpen, setRouteSheetOpen] = React.useState(false);
  const openRouteSheet = React.useCallback(() => setRouteSheetOpen(true), []);
  const closeRouteSheet = React.useCallback(() => setRouteSheetOpen(false), []);
  const activeMode =
    responseModes.find(({ id }) => id === activeResponseMode) ??
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
          {/* One line at every route count. The list of routes lives in the
              sheet the byline opens, not in the workspace. */}
          <RouteByline
            {...getRouteBylineModel(activeMode, language, t)}
            onPress={openRouteSheet}
            switchable={responseModes.length > 1}
          />
          {/* Mounted only while it is open. The sheet runs its own exit and
              calls back when the animation finishes, so it is still mounted
              for the whole of it. */}
          {routeSheetOpen ? (
            <ResponseModeSheet
              compact={compact}
              modes={responseModes}
              onClose={closeRouteSheet}
              onSelect={onSelectResponseMode}
              open
              readyModes={availableResponseModes}
              selected={activeResponseMode}
            />
          ) : null}
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
