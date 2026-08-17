import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import React from "react";
import { AccessibilityInfo, Text, TouchableOpacity, View } from "react-native";
import {
  fitOrbTransportSize,
  getOrbTransportLayout,
  OrbTransport,
} from "../../design-system/OrbTransport";
import { useOrbTurnProgress } from "./useOrbTurnProgress";
import { InputSurfacePages } from "./voiceTextInputPager/InputSurfacePages";
import { voiceTextInputPagerStyles as styles } from "./voiceTextInputPager/styles";
import { VoiceTextInputPagerProps } from "./voiceTextInputPager/types";
import { useInputSurfacePager } from "./voiceTextInputPager/useInputSurfacePager";

export type { InputSurface } from "./voiceTextInputPager/types";

export function VoiceTextInputPager({
  colors,
  compactPromptNotice = false,
  disabled,
  footer,
  initialSurface = "voice",
  initialTextInputFocused = false,
  initialTextMessage = "",
  inputMode,
  isActive,
  onInputSurfaceChange,
  onPress,
  onPressIn,
  onPressOut,
  onRestartReply,
  onSeekBack,
  onSeekForward,
  onStopPlayback,
  onResolvePromptBlock,
  onSubmitTextMessage,
  onTextInputFocusChange,
  onTextMessageChange,
  orbProgressOverride = null,
  playbackPaused,
  promptBlockedActionEnabled = false,
  promptBlockedActionLabel = null,
  promptBlockedMessage = null,
  readingProgress = null,
  readingProgressTiming = null,
  recordingMaxMs,
  recordingStartedAtMs,
  rtl = false,
  showTransportLabels = true,
  phaseTimingProgress,
  speechStartProgress,
  maxOrbSize,
  statusLabel,
  t,
  transportLabels,
  visualPhase,
  voiceInputUnavailableMessage = null,
}: VoiceTextInputPagerProps) {
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const pager = useInputSurfacePager({
    disabled,
    initialSurface,
    initialTextInputFocused,
    initialTextMessage,
    isActive,
    onInputSurfaceChange,
    onSubmitTextMessage,
    onTextInputFocusChange,
    onTextMessageChange,
    submissionDisabled: Boolean(promptBlockedMessage),
  });
  const maximumTransportLayout = getOrbTransportLayout(
    maxOrbSize,
    showTransportLabels,
  );
  const stageSize = fitOrbTransportSize({
    availableHeight: viewportHeight || maximumTransportLayout.height,
    availableWidth: pager.pageWidth || maximumTransportLayout.width,
    labels: showTransportLabels,
    maximum: maxOrbSize,
    minimum: Math.min(120, maxOrbSize),
  });
  const derivedProgress = useOrbTurnProgress({
    phaseTimingProgress: phaseTimingProgress ?? null,
    readingProgress,
    readingProgressTiming,
    recordingMaxMs,
    recordingStartedAtMs: recordingStartedAtMs ?? null,
    speechStartProgress: speechStartProgress ?? null,
    visualPhase,
  });
  const progress = orbProgressOverride ?? derivedProgress;
  const activeOrbLabel = statusLabel;
  const activeOrbInteractive =
    visualPhase === "recording" || visualPhase === "speaking";
  const showCompactPromptAction =
    compactPromptNotice &&
    Boolean(onResolvePromptBlock) &&
    promptBlockedActionEnabled;
  // Announce phase boundaries, not animation frames — the orb replaces the
  // bar that used to own this announcement.
  const previousVisualPhase = React.useRef(visualPhase);
  React.useEffect(() => {
    if (previousVisualPhase.current === visualPhase) {
      return;
    }
    previousVisualPhase.current = visualPhase;
    AccessibilityInfo.announceForAccessibility(statusLabel);
  }, [statusLabel, visualPhase]);

  const handleViewportLayout = (
    event: Parameters<typeof pager.handleLayout>[0],
  ) => {
    pager.handleLayout(event);
    const nextHeight = Math.round(event.nativeEvent.layout.height);
    if (!Number.isFinite(nextHeight) || nextHeight <= 0) {
      return;
    }
    setViewportHeight((currentHeight) =>
      Math.abs(currentHeight - nextHeight) >= 1 ? nextHeight : currentHeight,
    );
  };

  return (
    <View
      style={[styles.root, footer ? styles.rootWithFooter : null]}
      testID="voice-text-input-stage"
    >
      <View
        testID="voice-text-input-viewport"
        onLayout={handleViewportLayout}
        style={[
          styles.viewportFlexible,
          footer
            ? [
                styles.viewportWithFooter,
                {
                  flexBasis: maximumTransportLayout.height,
                  maxHeight: maximumTransportLayout.height,
                },
              ]
            : null,
        ]}
      >
        <InputSurfacePages
          activeSurface={pager.activeSurface}
          colors={colors}
          disabled={disabled}
          inputMode={inputMode}
          isActive={isActive}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onRestartReply={onRestartReply}
          onSeekBack={onSeekBack}
          onSeekForward={onSeekForward}
          onStopPlayback={onStopPlayback}
          onSelectSurface={pager.selectSurface}
          onSubmitTextMessage={pager.handleSubmitTextMessage}
          onTextFocusChange={pager.handleTextFocusChange}
          onTextMessageChange={pager.handleTextMessageChange}
          pageWidth={pager.pageWidth}
          panGesture={pager.panGesture}
          promptBlockedMessage={promptBlockedMessage}
          stageSize={stageSize}
          statusLabel={statusLabel}
          submissionDisabled={Boolean(promptBlockedMessage)}
          rtl={rtl}
          showTransportLabels={showTransportLabels}
          t={t}
          transportLabels={transportLabels}
          textFocused={pager.textFocused}
          textInputGesture={pager.textInputGesture}
          textInputRef={pager.textInputRef}
          textMessage={pager.textMessage}
          textPageStyle={pager.textPageStyle}
          textSubmitDisabled={pager.textSubmitDisabled}
          trackAnimatedStyle={pager.trackAnimatedStyle}
          voiceInputUnavailableMessage={voiceInputUnavailableMessage}
          voicePageStyle={pager.voicePageStyle}
        />
        {isActive ? (
          <View
            style={[styles.activeActionOverlay, styles.activeOrbOverlay]}
            testID={`voice-stage-${visualPhase}-orb`}
          >
            <OrbTransport
              labels={showTransportLabels}
              onBack={onSeekBack}
              onForward={onSeekForward}
              onRestart={onRestartReply}
              onStop={onStopPlayback}
              phase={visualPhase}
              testID="orb-transport-active"
              transportLabels={transportLabels}
              voiceOrb={{
                label: activeOrbLabel,
                onPress:
                  activeOrbInteractive && inputMode !== "push-to-talk"
                    ? onPress
                    : undefined,
                onPressIn:
                  activeOrbInteractive && inputMode === "push-to-talk"
                    ? onPressIn
                    : undefined,
                onPressOut:
                  activeOrbInteractive && inputMode === "push-to-talk"
                    ? onPressOut
                    : undefined,
                overtime: progress.overtime,
                overtimeTiming: progress.overtimeTiming,
                paused: playbackPaused,
                phase: visualPhase,
                phaseProgress: progress.phaseProgress,
                phaseProgressTiming: progress.phaseProgressTiming,
                rtl,
                size: stageSize,
                testID: "voice-orb-active",
                turnProgress: progress.turnProgress,
                turnProgressTiming: progress.turnProgressTiming,
              }}
            />
          </View>
        ) : null}
      </View>

      {promptBlockedMessage ? (
        <TouchableOpacity
          testID="prompt-blocked-notice"
          accessibilityLabel={
            onResolvePromptBlock && promptBlockedActionEnabled
              ? `${promptBlockedMessage} ${
                  promptBlockedActionLabel ?? t("openSpeakingSettings")
                }`
              : promptBlockedMessage
          }
          accessibilityRole={
            onResolvePromptBlock && promptBlockedActionEnabled
              ? "button"
              : "text"
          }
          activeOpacity={
            onResolvePromptBlock && promptBlockedActionEnabled ? 0.76 : 1
          }
          disabled={!onResolvePromptBlock || !promptBlockedActionEnabled}
          onPress={
            onResolvePromptBlock && promptBlockedActionEnabled
              ? onResolvePromptBlock
              : undefined
          }
          style={[
            styles.promptBlockedNotice,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
        >
          <PhosphorIcon
            name="exclamation-circle"
            size="compact"
            color={colors.danger}
          />
          <View style={styles.promptBlockedCopy}>
            <Text
              accessibilityLiveRegion="assertive"
              accessibilityRole="alert"
              style={[
                showCompactPromptAction
                  ? styles.promptBlockedAction
                  : styles.promptBlockedText,
                {
                  color: showCompactPromptAction
                    ? colors.accent
                    : colors.textSecondary,
                },
              ]}
            >
              {showCompactPromptAction
                ? (promptBlockedActionLabel ?? t("openSpeakingSettings"))
                : promptBlockedMessage}
            </Text>
            {!showCompactPromptAction &&
            onResolvePromptBlock &&
            promptBlockedActionEnabled ? (
              <Text
                style={[styles.promptBlockedAction, { color: colors.accent }]}
              >
                {promptBlockedActionLabel ?? t("openSpeakingSettings")}
              </Text>
            ) : null}
          </View>
          {onResolvePromptBlock && promptBlockedActionEnabled ? (
            <PhosphorIcon
              name="right"
              size="compact"
              color={colors.textSecondary}
            />
          ) : null}
        </TouchableOpacity>
      ) : null}

      {footer ? (
        <View style={styles.footer} testID="voice-text-input-footer">
          {footer}
        </View>
      ) : null}
    </View>
  );
}
