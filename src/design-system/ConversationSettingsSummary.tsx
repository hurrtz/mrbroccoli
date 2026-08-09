import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { textStyles } from "../theme/typography";
import { IconButton } from "./IconButton";

/**
 * The conversation's settings stated as a sentence, with one control beside it.
 *
 * **Decision:** a line of muted text replaces a strip of chips. It is quieter
 * than any number of chips and says everything at once, which matters on a
 * screen whose single loud element is the orb below it.
 */
export function ConversationSettingsSummary({
  accessibilityLabel,
  onPress,
  style,
  summary,
  testID,
}: {
  accessibilityLabel: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Noun phrases joined by middots. No trailing stop. */
  summary: string;
  testID?: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, style]}>
      <Text
        numberOfLines={1}
        style={[styles.summary, { color: colors.textSecondary }]}
      >
        {summary}
      </Text>
      {onPress ? (
        <IconButton
          accessibilityLabel={accessibilityLabel}
          icon="control"
          onPress={onPress}
          testID={testID}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: 8, minHeight: 44 },
  summary: { ...textStyles.supporting, flex: 1, minWidth: 0 },
});
