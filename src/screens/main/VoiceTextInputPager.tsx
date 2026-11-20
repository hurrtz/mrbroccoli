import React from "react";
import { AccessibilityInfo, Text, TouchableOpacity, View } from "react-native";

import { ProviderIcon } from "../../components/ProviderIcon";
import { PROVIDER_LABELS } from "../../constants/models";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
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

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}`
    : `${minutes}:${rest}`;
}

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
  handsFreeSilenceCountdownSeconds = null,
  handsFreeVoiceActive = false,
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
  processingProgress,
  maxOrbSize,
  statusLabel,
  activity,
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
    processingProgress: processingProgress ?? null,
    visualPhase,
  });
  const progress = orbProgressOverride ?? derivedProgress;
  const showHandsFreeCountdown =
    visualPhase === "recording" &&
    !handsFreeVoiceActive &&
    handsFreeSilenceCountdownSeconds !== null;
  const activeOrbLabel = showHandsFreeCountdown
    ? t("driveSendsIn", { seconds: handsFreeSilenceCountdownSeconds })
    : statusLabel;
  const activeOrbInteractive =
    visualPhase === "recording" || visualPhase === "speaking";
  const showCompactPromptAction =
    compactPromptNotice &&
    Boolean(onResolvePromptBlock) &&
    promptBlockedActionEnabled;
  const provider = activity?.provider;
  const readyToListen = !promptBlockedMessage && !voiceInputUnavailableMessage;
  const statusText =
    visualPhase === "idle" && !readyToListen ? null : activity?.label;
  const showActivity = Boolean(
    statusText && (isActive || pager.activeSurface === "voice"),
  );
  const balanceActivity = showActivity && Boolean(footer);
  // The transport keys extend below the orb. Mirror their footprint above it
  // when there is room, giving space back to the controls on short screens.
  const maximumViewportHeight =
    maximumTransportLayout.height +
    (balanceActivity ? maximumTransportLayout.height - maxOrbSize : 0);
  const transportHeight = getOrbTransportLayout(
    stageSize, showTransportLabels,
  ).height;
  const spaceAboveOrb = balanceActivity
    ? Math.min(
        transportHeight - stageSize,
        Math.max(0, (viewportHeight || maximumViewportHeight) - transportHeight),
      )
    : 0;
  const contentStyle = [styles.viewportContent, { top: spaceAboveOrb }];
  const providerName = provider === "device"
    ? t("onDeviceSpeech")
    : provider ? PROVIDER_LABELS[provider] : "";
  const spokenStatus = [providerName, statusText].filter(Boolean).join(" ");
  const previousStatus = React.useRef(spokenStatus || statusLabel);
  React.useEffect(() => {
    const announcement = spokenStatus || statusLabel;
    if (previousStatus.current !== announcement) {
      previousStatus.current = announcement;
      AccessibilityInfo.announceForAccessibility(announcement);
    }
  }, [spokenStatus, statusLabel]);
  const recordingTime = progress.recordingSecondsLeft;
  const timeLabel = recordingTime === undefined
    ? null
    : t("orbTimeRemaining", { time: formatCountdown(recordingTime) });
  const providerIcon = provider === "device" ? (
    <PhosphorIcon
      color={colors.textSecondary}
      name="cpu"
      size="compact"
      testID="orb-activity-device-icon"
    />
  ) : provider ? (
    <ProviderIcon provider={provider} color={colors.textSecondary} size="compact" />
  ) : null;

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
      {showActivity ? (
        <View
          accessible
          accessibilityLabel={spokenStatus}
          style={[styles.activity, { direction: rtl ? "rtl" : "ltr" }]}
          testID="orb-activity"
        >
          {providerIcon}
          <Text style={[styles.activityText, { color: colors.textSecondary }]}>
            {statusText}
          </Text>
        </View>
      ) : null}
      <View
        testID="voice-text-input-viewport"
        onLayout={handleViewportLayout}
        style={[
          styles.viewportFlexible,
          footer
            ? [
                styles.viewportWithFooter,
                {
                  flexBasis: maximumViewportHeight,
                  maxHeight: maximumViewportHeight,
                },
              ]
            : null,
        ]}
      >
        <InputSurfacePages
          activeSurface={pager.activeSurface}
          colors={colors}
          style={contentStyle}
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
          viewportHeight={Math.max(0, viewportHeight - spaceAboveOrb)}
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
            style={[contentStyle, styles.activeOrbOverlay]}
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
                accessibilityValue: timeLabel ? { text: timeLabel } : undefined,
                coreLabel: showHandsFreeCountdown
                  ? String(handsFreeSilenceCountdownSeconds)
                  : undefined,
                coreLabelColor:
                  showHandsFreeCountdown &&
                  handsFreeSilenceCountdownSeconds <= 3
                    ? colors.danger
                    : undefined,
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
