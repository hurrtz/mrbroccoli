import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getLocalModel } from "../../constants/localModels";
import { getProviderModelName } from "../../constants/models";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { ProviderIcon } from "../../components/ProviderIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { ResponseModeConfig } from "../../types";
import {
  getModelEffortOptionLabel,
  getModelEffortOptions,
  getResponseModeRouteEffortLabel,
} from "../../utils/modelEffort";

/**
 * The route byline: who is answering the next turn, and at what effort.
 *
 * Deliberately not a button — no fill, no border, no card — so it cannot be
 * mistaken for the voice stage below it. The provider mark carries the
 * prominence; the closing hairline says the whole row is the target, not just
 * the caret. The dots are that model's own effort scale, so the count varies;
 * a model with no effort control reads its label with no dots.
 */
export function MainScreenRouteByline({
  mode,
  onPress,
  switchable,
}: {
  mode: ResponseModeConfig;
  onPress: () => void;
  /** false when only one model is configured — the row becomes a credit line. */
  switchable: boolean;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const route = mode.route;
  const local = route.runtime === "local" && Boolean(route.localModelId);
  const modelName = local
    ? getLocalModel(route.localModelId!).name
    : getProviderModelName(route.provider, route.model);
  const effortLabel = getResponseModeRouteEffortLabel(route, language);
  const effortOptions = local
    ? []
    : getModelEffortOptions(route.provider, route.model);
  const displayedEffortLabel =
    effortOptions.length === 0 ? t("normal") : (effortLabel ?? t("normal"));
  const effortLabels = effortOptions.map((option) =>
    getModelEffortOptionLabel(option, language),
  );
  const effortIndex = effortLabel ? effortLabels.indexOf(effortLabel) : -1;
  const showDots = effortLabels.length > 1 && effortIndex >= 0;

  return (
    <Pressable
      accessibilityLabel={
        `${modelName}. ${displayedEffortLabel}`
      }
      accessibilityRole={switchable ? "button" : undefined}
      disabled={!switchable}
      onPress={switchable ? onPress : undefined}
      style={[styles.row, { borderBottomColor: colors.border }]}
      testID="route-byline"
    >
      {local ? (
        <PhosphorIcon color={colors.text} name="cpu" size="feature" />
      ) : (
        <ProviderIcon
          color={colors.text}
          provider={route.provider}
          size="feature"
        />
      )}
      <Text
        numberOfLines={1}
        style={[styles.model, { color: colors.text }]}
        testID="route-byline-model"
      >
        {modelName}
      </Text>
      <View style={styles.trailing}>
        <Text
          numberOfLines={1}
          style={[styles.effort, { color: colors.textMuted }]}
          testID="route-byline-effort"
        >
          {displayedEffortLabel}
        </Text>
        {showDots ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.dots}
            testID="route-byline-effort-dots"
          >
            {effortLabels.map((level, position) => (
              <View
                key={level}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      position <= effortIndex
                        ? colors.accent
                        : colors.borderStrong,
                  },
                ]}
              />
            ))}
          </View>
        ) : null}
        {switchable ? (
          <View style={styles.caret}>
            <PhosphorIcon color={colors.textMuted} name="down" size="compact" />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingBottom: 8,
  },
  model: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    minWidth: 0,
  },
  trailing: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    gap: 8,
  },
  effort: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
  },
  dots: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  caret: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
  },
});
