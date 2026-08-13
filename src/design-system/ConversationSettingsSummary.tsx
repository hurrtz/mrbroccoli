import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import { IconButton } from "./IconButton";
import { MIN_ICON_TOUCH_TARGET } from "./PhosphorIcon";

/**
 * The conversation's settings stated as a sentence, with one control beside
 * it. A line of muted text is quieter than any number of chips, and it says
 * everything at once. Noun phrases, separated by middots, no trailing stop.
 */
export function ConversationSettingsSummary({
  summary,
  onPress,
  accessibilityLabel,
  compact = false,
  style,
  testID,
}: {
  /** Noun phrases joined by middots, e.g. "Balanced · Brief · Heart". */
  summary: string;
  onPress: () => void;
  /** Accessible name for the control, translated by the caller. */
  accessibilityLabel: string;
  /** Icon-only form for a vertically constrained accessibility layout. */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.row, compact ? styles.rowCompact : null, style]}
      testID={testID}
    >
      {compact ? null : (
        <Text
          numberOfLines={1}
          style={[styles.summary, { color: colors.textSecondary }]}
        >
          {summary}
        </Text>
      )}
      <IconButton
        accessibilityLabel={accessibilityLabel}
        icon="control"
        onPress={onPress}
        testID="conversation-settings-summary-control"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
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
  },
});
