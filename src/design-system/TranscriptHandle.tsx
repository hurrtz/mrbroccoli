import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { fonts, textStyles } from "../theme/typography";

export interface TranscriptHandleCopy {
  /** Accessible name when there is at least one message. Already carries the
   * real count, which must be the same count passed as `messageCount`. */
  accessibilityLabel: string;
  /** Visible when there are no messages. */
  empty: string;
  /** Accessible name when there are no messages. */
  emptyAccessibilityLabel: string;
}

/**
 * The top edge of the transcript drawer, peeking above the bottom of the
 * workspace so a running conversation is visible without opening anything.
 *
 * It is flush to the bottom edge with no side padding and rounds only its top
 * corners, so it reads as a drawer to pull rather than a card floating above
 * one.
 *
 * **Decision:** one `empty` test chooses the visible text and the accessible
 * name together. Deriving them separately is what previously let a handle read
 * "no messages" while announcing twelve.
 */
export function TranscriptHandle({
  copy,
  messageCount = 0,
  meta,
  onPress,
  preview,
  style,
  testID,
}: {
  copy: TranscriptHandleCopy;
  /** 0 shows the empty state and suppresses the preview. */
  messageCount?: number;
  /** Provenance of the last reply. */
  meta?: string;
  onPress?: () => void;
  /** One line of the last reply. Truncates; never wraps. */
  preview?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();
  const empty = !messageCount;

  return (
    <Pressable
      accessibilityLabel={
        empty ? copy.emptyAccessibilityLabel : copy.accessibilityLabel
      }
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.handle,
        {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.surfaceRaisedBorder,
          opacity: pressed ? 0.72 : 1,
        },
        style,
      ]}
      testID={testID ?? "transcript-handle"}
    >
      <View style={[styles.grip, { backgroundColor: colors.borderStrong }]} />
      {empty ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>
          {copy.empty}
        </Text>
      ) : (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.75,
    textAlign: "center",
    textTransform: "uppercase",
  },
  grip: {
    alignSelf: "center",
    borderRadius: 2,
    height: 4,
    marginBottom: 10,
    width: 38,
  },
  handle: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingBottom: 14,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.6,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  preview: textStyles.supporting,
});
