import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  MIN_ICON_TOUCH_TARGET,
  PhosphorIcon,
} from "../design-system/PhosphorIcon";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import type { Provider } from "../types";
import { ProviderIcon } from "./ProviderIcon";

/**
 * Who answers the next turn, and at what effort.
 *
 * **Decision:** one treatment at every route count. `ResponseModeToggle` renders
 * four different layouts for one, two, three and four-plus models; this is one
 * line tall in both orientations whatever is configured, and the list of routes
 * moves into a sheet.
 *
 * **Decision:** deliberately not a button -- no fill, no border, no card -- so it
 * cannot be mistaken for the voice control below it. The closing hairline says
 * the whole row is the target rather than just the caret.
 */
export function RouteByline({
  accessibilityLabel,
  effort,
  effortLevels = [],
  local = false,
  modelName,
  onPress,
  provider,
  providerLabel,
  style,
  switchable = true,
  testID,
}: {
  /** Falls back to the model name and effort the row already shows. */
  accessibilityLabel?: string;
  /** Current effort. Omitted for a model that exposes no effort control. */
  effort?: string;
  /** This model's own effort scale, low to high. Fewer than two hides the dots. */
  effortLevels?: string[];
  /** An on-device route: shows the cpu glyph instead of a provider mark. */
  local?: boolean;
  modelName: string;
  onPress?: () => void;
  provider?: Provider;
  providerLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** false when only one route is configured: drops the caret and the target. */
  switchable?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const activeIndex = effort ? effortLevels.indexOf(effort) : -1;
  const showDots = effortLevels.length > 1 && activeIndex >= 0;

  return (
    <Pressable
      accessibilityLabel={
        switchable
          ? (accessibilityLabel ??
            (effort ? `${modelName}. ${effort}` : modelName))
          : undefined
      }
      accessibilityRole={switchable ? "button" : undefined}
      disabled={!switchable || !onPress}
      onPress={switchable ? onPress : undefined}
      style={({ pressed }) => [
        styles.byline,
        { borderBottomColor: colors.border, opacity: pressed ? 0.72 : 1 },
        style,
      ]}
      testID={testID ?? "route-byline"}
    >
      {local ? (
        <PhosphorIcon color={colors.text} name="cpu" size="feature" />
      ) : (
        <ProviderIcon
          color={colors.text}
          label={providerLabel}
          provider={provider as Provider}
          size="feature"
        />
      )}
      <Text numberOfLines={1} style={[styles.model, { color: colors.text }]}>
        {modelName}
      </Text>
      <View style={styles.effort}>
        {effort ? (
          <Text style={[styles.effortLabel, { color: colors.textMuted }]}>
            {effort}
          </Text>
        ) : null}
        {showDots ? (
          <View
            // The word beside them already states the effort; the dots are the
            // same fact drawn as a scale.
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.dots}
          >
            {effortLevels.map((level, position) => (
              <View
                key={level}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      position <= activeIndex
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
            <PhosphorIcon
              color={colors.textMuted}
              name="down"
              size="compact"
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  byline: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingBottom: 8,
  },
  caret: {
    alignItems: "center",
    justifyContent: "center",
    width: MIN_ICON_TOUCH_TARGET,
  },
  dot: { borderRadius: 3, height: 5, width: 5 },
  dots: { alignItems: "center", flexDirection: "row", gap: 4 },
  effort: { alignItems: "center", flexDirection: "row", gap: 8 },
  effortLabel: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 16 },
  model: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    minWidth: 0,
  },
});
