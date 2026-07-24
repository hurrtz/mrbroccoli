import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  Colors,
  getAccessibleForeground,
} from "../../theme/colors";
import { fonts } from "../../theme/typography";
import {
  InputMode,
  VoicePhaseProgress,
  VoiceVisualPhase,
} from "../../types";
import { formatLatencyCountdown } from "../../utils/latencyDisplay";

import { TranslateFn } from "./shared";

interface PhaseAwareVoiceActionProps {
  colors: Colors;
  inputMode: InputMode;
  onOpenStatusDetails: () => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onStopPlayback?: () => void | Promise<void>;
  phaseLabel: string;
  phaseProgress?: VoicePhaseProgress | null;
  playbackActive?: boolean;
  playbackPaused?: boolean;
  recordingMaxMs: number;
  statusLabel: string;
  stopPlaybackLabel: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}

function formatClock(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes.toString().padStart(2, "0")}m`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getPhaseIcon(
  visualPhase: VoiceVisualPhase,
  playbackPaused: boolean,
): React.ComponentProps<typeof Feather>["name"] {
  switch (visualPhase) {
    case "recording":
      return "square";
    case "transcribing":
      return "file-text";
    case "thinking-briefly":
      return "zap";
    case "searching":
      return "globe";
    case "thinking":
      return "cpu";
    case "synthesizing":
      return "headphones";
    case "speaking":
      return playbackPaused ? "play" : "pause";
    default:
      return "mic";
  }
}

function getPhaseColor(visualPhase: VoiceVisualPhase, colors: Colors) {
  switch (visualPhase) {
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
      return colors.bubbleUser;
  }
}

function usePhaseTimeLabels(
  visualPhase: VoiceVisualPhase,
  recordingMaxMs: number,
  phaseProgress?: VoicePhaseProgress | null,
) {
  const [phaseStartedAt, setPhaseStartedAt] = React.useState(Date.now());
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const startedAt = phaseProgress?.startedAt ?? Date.now();
    setPhaseStartedAt(startedAt);
    setNow(Date.now());

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [phaseProgress?.startedAt, visualPhase]);

  if (visualPhase === "recording") {
    return {
      current: formatClock(recordingMaxMs - (now - phaseStartedAt)),
      overall: "—",
    };
  }

  if (phaseProgress) {
    const currentProgress =
      phaseProgress.phase === visualPhase || phaseProgress.phase === "turn"
        ? phaseProgress
        : null;
    const overallProgress =
      phaseProgress.overall ??
      (phaseProgress.phase === "turn" ? phaseProgress : null);

    return {
      current: currentProgress
        ? formatLatencyCountdown(
            now - currentProgress.startedAt,
            currentProgress.estimatedMs,
          ).text
        : "—",
      overall: overallProgress
        ? formatLatencyCountdown(
            now - overallProgress.startedAt,
            overallProgress.estimatedMs,
          ).text
        : "—",
    };
  }

  return {
    current: `+${formatClock(now - phaseStartedAt)}`,
    overall: "—",
  };
}

export function PhaseAwareVoiceAction({
  colors,
  inputMode,
  onOpenStatusDetails,
  onPress,
  onPressIn,
  onPressOut,
  onStopPlayback,
  phaseLabel,
  phaseProgress,
  playbackActive = false,
  playbackPaused = false,
  recordingMaxMs,
  statusLabel,
  stopPlaybackLabel,
  t,
  visualPhase,
}: PhaseAwareVoiceActionProps) {
  const reducedMotion = useReducedMotion();
  const recordingProgress = useSharedValue(0);
  const phaseColor = getPhaseColor(visualPhase, colors);
  const phaseForeground = getAccessibleForeground(phaseColor);
  const animatedPhaseColor = useSharedValue(phaseColor);
  const timeLabels = usePhaseTimeLabels(
    visualPhase,
    recordingMaxMs,
    phaseProgress,
  );

  React.useEffect(() => {
    cancelAnimation(animatedPhaseColor);
    animatedPhaseColor.value = reducedMotion
      ? phaseColor
      : withTiming(phaseColor, { duration: 280 });

    return () => cancelAnimation(animatedPhaseColor);
  }, [animatedPhaseColor, phaseColor, reducedMotion]);

  React.useEffect(() => {
    cancelAnimation(recordingProgress);
    recordingProgress.value = 0;

    if (visualPhase === "recording") {
      recordingProgress.value = withTiming(1, {
        duration: Math.max(1000, recordingMaxMs),
        easing: Easing.linear,
      });
    }

    return () => cancelAnimation(recordingProgress);
  }, [recordingMaxMs, recordingProgress, visualPhase]);

  const recordingFillStyle = useAnimatedStyle(() => ({
    width: `${recordingProgress.value * 100}%`,
  }));
  const surfaceColorStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedPhaseColor.value,
    borderColor: animatedPhaseColor.value,
  }));

  return (
    <Animated.View
      testID="voice-stage-action-surface"
      style={[styles.surface, surfaceColorStyle]}
    >
      {visualPhase === "recording" ? (
        <Animated.View
          testID="voice-stage-recording-fill"
          style={[
            styles.recordingFill,
            { backgroundColor: colors.phaseRecording },
            recordingFillStyle,
          ]}
        />
      ) : null}

      <TouchableOpacity
        testID="voice-stage-primary-action"
        accessibilityLabel={statusLabel}
        accessibilityRole="button"
        activeOpacity={0.84}
        onPress={inputMode === "toggle-to-talk" ? onPress : undefined}
        onPressIn={inputMode === "push-to-talk" ? onPressIn : undefined}
        onPressOut={inputMode === "push-to-talk" ? onPressOut : undefined}
        style={styles.primaryAction}
      >
        <View style={[styles.phaseIcon, { backgroundColor: phaseForeground }]}>
          <Feather
            name={getPhaseIcon(visualPhase, playbackPaused)}
            size={21}
            color={phaseColor}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        testID="voice-stage-status-details"
        accessibilityLabel={t("statusDetails")}
        accessibilityRole="button"
        activeOpacity={0.76}
        onPress={onOpenStatusDetails}
        style={styles.phaseLabelButton}
      >
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.84}
          numberOfLines={1}
          style={[styles.phaseLabel, { color: phaseForeground }]}
        >
          {phaseLabel}
        </Text>
      </TouchableOpacity>

      {playbackActive ? (
        <TouchableOpacity
          testID="voice-stage-stop-playback"
          accessibilityLabel={stopPlaybackLabel}
          accessibilityRole="button"
          activeOpacity={0.76}
          onPress={() => {
            void onStopPlayback?.();
          }}
          style={[
            styles.stopButton,
            {
              backgroundColor: `${phaseForeground}1F`,
              borderColor: `${phaseForeground}7A`,
            },
          ]}
        >
          <Feather name="square" size={13} color={phaseForeground} />
        </TouchableOpacity>
      ) : (
        <View
          testID="voice-stage-phase-time"
          style={styles.phaseTimes}
        >
          <Text
            numberOfLines={1}
            style={[styles.phaseTimeLine, { color: phaseForeground }]}
          >
            <Text style={styles.phaseTimeScope}>
              {t("phaseTimeRemaining")}
              {"  "}
            </Text>
            <Text
              testID="voice-stage-current-time"
              style={styles.phaseTimeValue}
            >
              {timeLabels.current}
            </Text>
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.phaseTimeLine, { color: phaseForeground }]}
          >
            <Text style={styles.phaseTimeScope}>
              {t("totalTimeRemaining")}
              {"  "}
            </Text>
            <Text
              testID="voice-stage-total-time"
              style={styles.phaseTimeValue}
            >
              {timeLabels.overall}
            </Text>
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  surface: {
    width: "100%",
    minHeight: 68,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  recordingFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  primaryAction: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseLabelButton: {
    position: "absolute",
    left: 8,
    top: 0,
    bottom: 0,
    width: "34%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  phaseLabel: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: fonts.body,
    fontWeight: "400",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  phaseTimes: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    width: "34%",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  phaseTimeLine: {
    width: "100%",
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: "400",
    textAlign: "center",
  },
  phaseTimeScope: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: "400",
    letterSpacing: 0.1,
    opacity: 0.82,
  },
  phaseTimeValue: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: "400",
    fontVariant: ["tabular-nums"],
  },
  stopButton: {
    position: "absolute",
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});
