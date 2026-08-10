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
 * workspace. It reads as the drawer it opens rather than as a button: a grip,
 * the last reply's provenance, and one line of the reply itself.
 *
 * Pin it flush to the bottom edge with no side padding, so it reads as a
 * drawer you can pull rather than a card floating above one. It rounds only
 * its top corners for the same reason.
 */
export function TranscriptHandle({
  messageCount = 0,
  meta,
  preview,
  emptyLabel,
  accessibilityLabel,
  onPress,
  style,
  testID,
}: {
  /** 0 shows the empty state and suppresses the preview. */
  messageCount?: number;
  /** Provenance of the last reply, e.g. "GPT-5 · 2 min ago". */
  meta?: string;
  /** One line of the last reply. Truncates; never wraps. */
  preview?: string;
  /** Shown centred when there are no messages. Translated by the caller. */
  emptyLabel: string;
  /**
   * Accessible name. Derive it from the same message count that decides the
   * empty state, so the visible state and the announced state cannot drift.
   */
  accessibilityLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();
  const empty = !messageCount;

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
      <View
        style={[styles.grip, { backgroundColor: colors.borderStrong }]}
      />
      {empty ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>
          {emptyLabel}
        </Text>
      ) : (
        <>
          {meta ? (
            <Text
              numberOfLines={1}
              style={[styles.meta, { color: colors.textMuted }]}
            >
              {meta}
            </Text>
          ) : null}
          <Text
            numberOfLines={1}
            style={[styles.preview, { color: colors.textSecondary }]}
          >
            {preview}
          </Text>
        </>
      )}
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
  empty: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.75,
    textAlign: "center",
    textTransform: "uppercase",
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.6,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  preview: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
});
