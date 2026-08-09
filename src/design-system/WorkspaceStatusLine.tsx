import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import { IconButton } from "./IconButton";
import type { VoiceVisualPhase } from "../types";
import { getPhaseColor } from "./voicePhase";

/**
 * The line under the orb: a phase dot, what is happening, and what the
 * conversation is.
 *
 * The dot repeats the orb's phase colour rather than replacing it, so the phase
 * is never carried by colour alone -- `title` states it in words.
 */
export function WorkspaceStatusLine({
  detail,
  infoAccessibilityLabel,
  onInfo,
  phase = "idle",
  style,
  title,
}: {
  /** Conversation name and age at rest; the phase instruction while a turn runs. */
  detail?: string;
  infoAccessibilityLabel?: string;
  /** Omit to hide the info control entirely. */
  onInfo?: () => void;
  phase?: VoiceVisualPhase;
  style?: StyleProp<ViewStyle>;
  /** What is happening, in display type. */
  title: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.line, style]}>
      <View
        style={[styles.dot, { backgroundColor: getPhaseColor(phase, colors) }]}
        testID="workspace-status-dot"
      />
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        {detail ? (
          <Text
            numberOfLines={1}
            style={[styles.detail, { color: colors.textMuted }]}
          >
            {detail}
          </Text>
        ) : null}
      </View>
      {onInfo && infoAccessibilityLabel ? (
        <IconButton
          accessibilityLabel={infoAccessibilityLabel}
          icon="info-circle"
          onPress={onInfo}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { flex: 1, minWidth: 0 },
  detail: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 16 },
  dot: { borderRadius: 4, height: 8, width: 8 },
  line: { alignItems: "center", flexDirection: "row", gap: 12, minHeight: 44 },
  title: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21,
  },
});
