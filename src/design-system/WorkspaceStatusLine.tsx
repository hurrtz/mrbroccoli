import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import type { VoiceVisualPhase } from "../types";
import type { Colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import { IconButton } from "./IconButton";
import { MIN_ICON_TOUCH_TARGET } from "./PhosphorIcon";

/** The dot repeats the orb's phase colour so the pair reads as one statement. */
function getPhaseDot(phase: VoiceVisualPhase, colors: Colors): string {
  switch (phase) {
    case "recording":
      return colors.phaseRecordingTrack;
    case "transcribing":
      return colors.phaseTranscribing;
    case "thinking-briefly":
      return colors.phaseThinkingBriefly;
    case "searching":
      return colors.phaseSearching;
    case "thinking":
      return colors.phaseThinking;
    case "synthesizing":
      return colors.phaseSynthesizing;
    case "speaking":
      return colors.phaseSpeaking;
    default:
      return colors.accent;
  }
}

/**
 * The line under the orb: a phase dot, what is happening, and what the
 * conversation is. The detail line carries the conversation name and its age
 * at rest, and the instruction for the current phase while a turn runs.
 */
export function WorkspaceStatusLine({
  title,
  detail,
  phase = "idle",
  info,
  style,
  testID,
}: {
  /** What is happening, in display type. Translated by the caller. */
  title: string;
  /** Conversation name and age at rest; the phase instruction during a turn. */
  detail?: string;
  /** Tints the dot. Defaults to idle. */
  phase?: VoiceVisualPhase;
  /** Omit to hide the info control entirely. */
  info?: { accessibilityLabel: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, style]} testID={testID}>
      <View
        style={[styles.dot, { backgroundColor: getPhaseDot(phase, colors) }]}
        testID="workspace-status-dot"
      />
      <View style={styles.textColumn}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: colors.text }]}
        >
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
      {info ? (
        <IconButton
          accessibilityLabel={info.accessibilityLabel}
          icon="info-circle"
          onPress={info.onPress}
          testID="workspace-status-info"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: MIN_ICON_TOUCH_TARGET,
  },
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21,
  },
  detail: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
  },
});
