import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import { MIN_ICON_TOUCH_TARGET, PhosphorIcon } from "./PhosphorIcon";

/**
 * The conversation's settings stated as a sentence inside one row-sized
 * control. A line of muted text is quieter than any number of chips, and it
 * says everything at once.
 */
export function ConversationSettingsSummary({
  summary,
  onPress,
  accessibilityLabel,
  compact = false,
  disabled = false,
  style,
  testID,
}: {
  /** Effective values joined by middots, e.g. "Brief · Balanced · Heart". */
  summary: string;
  onPress: () => void;
  /** Accessible name for the control, translated by the caller. */
  accessibilityLabel: string;
  /** Icon-only form for a vertically constrained accessibility layout. */
  compact?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={[style, disabled ? styles.disabled : null]} testID={testID}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [
          styles.row,
          compact ? styles.rowCompact : null,
          pressed && !disabled ? { backgroundColor: colors.surfaceAlt } : null,
        ]}
        testID="conversation-settings-summary-control"
      >
        {compact ? null : (
          <Text
            numberOfLines={1}
            style={[styles.summary, { color: colors.textSecondary }]}
          >
            {summary}
          </Text>
        )}
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={styles.icon}
        >
          <PhosphorIcon
            color={colors.textSecondary}
            name="control"
            size="control"
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.38,
  },
  row: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    minHeight: MIN_ICON_TOUCH_TARGET,
  },
  rowCompact: {
    justifyContent: "flex-end",
  },
  summary: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    minWidth: 0,
    textAlign: "center",
  },
  icon: {
    alignItems: "center",
    height: MIN_ICON_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_ICON_TOUCH_TARGET,
  },
});
