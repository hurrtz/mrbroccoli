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

/**
 * The top edge of the transcript drawer, peeking above the bottom of the
 * workspace. It reads as the drawer it opens rather than as a button: a grip
 * and the single word "Transcript". The route byline already carries the
 * conversation and model context.
 *
 * Pin it flush to the bottom edge with no side padding, so it reads as a
 * drawer you can pull rather than a card floating above one. It rounds only
 * its top corners for the same reason.
 */
export function TranscriptHandle({
  label,
  accessibilityLabel,
  onPress,
  style,
  testID,
}: {
  /** The translated visible label, normally "Transcript". */
  label: string;
  /**
   * Accessible name. The caller includes the real message count even though
   * the visible label deliberately remains stable.
   */
  accessibilityLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.handle,
        {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.surfaceRaisedBorder,
        },
        style,
      ]}
      testID={testID ?? "transcript-handle"}
    >
      <View style={[styles.grip, { backgroundColor: colors.borderStrong }]} />
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  handle: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingBottom: 14,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  grip: {
    alignSelf: "center",
    borderRadius: 2,
    height: 4,
    marginBottom: 10,
    width: 38,
  },
  label: {
    fontFamily: fonts.headline,
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.2,
    lineHeight: 22,
    textAlign: "center",
  },
});
