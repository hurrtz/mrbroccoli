import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import React from "react";
import { AccessibilityInfo, Text, TouchableOpacity, View } from "react-native";
import { VoiceOrb } from "../../design-system/VoiceOrb";
import { MessageImageAttachments } from "../../components/MessageImageAttachments";
import { useOrbTurnProgress } from "./useOrbTurnProgress";
import { DriveSessionControls } from "./voiceTextInputPager/DriveSessionControls";
import { InputSurfaceIndicators } from "./voiceTextInputPager/InputSurfaceIndicators";
import { InputSurfacePages } from "./voiceTextInputPager/InputSurfacePages";
import { voiceTextInputPagerStyles as styles } from "./voiceTextInputPager/styles";
import {
  InputSurface,
  VoiceTextInputPagerProps,
} from "./voiceTextInputPager/types";
import { useInputSurfacePager } from "./voiceTextInputPager/useInputSurfacePager";

export type { InputSurface } from "./voiceTextInputPager/types";

export function VoiceTextInputPager({
  attachments = [],
  colors,
  disabled,
  driveAutoContinueEnabled = false,
  driveSilenceCountdownSeconds = null,
  driveSessionCanRepeat = false,
  driveVoiceActive = false,
  initialSurface = "voice",
  initialTextMessage = "",
  inputMode,
  isActive,
  layout,
  onInputSurfaceChange,
  onRemoveImage,
  onDriveContinue,
  onDriveRepeat,
  onDriveStop,
  onPress,
  onPressIn,
  onPressOut,
  onResolvePromptBlock,
  onSubmitTextMessage,
  onTextMessageChange,
  orbProgressOverride = null,
  playbackPaused,
  promptBlockedActionEnabled = false,
  promptBlockedActionLabel = null,
  promptBlockedMessage = null,
  promptBlockedProgress = null,
  recordingMaxMs,
  recordingStartedAtMs,
  speechStartProgress,
  maxOrbSize,
  statusLabel,
  t,
  visualPhase,
  voiceInputUnavailableMessage = null,
  voiceSurfaceUnusable = false,
}: VoiceTextInputPagerProps) {
  const [viewportHeight, setViewportHeight] = React.useState(0);
  // The orb takes the space the column actually leaves it, clamped to its
  // ceiling and a floor below which the rings stop being legible.
  const stageSize = Math.max(
    96,
    Math.min(maxOrbSize, viewportHeight || maxOrbSize),
  );
  const pager = useInputSurfacePager({
    disabled,
    initialSurface,
    initialTextMessage,
    isActive,
    onInputSurfaceChange,
    onSubmitTextMessage,
    onTextMessageChange,
    submissionDisabled: Boolean(promptBlockedMessage),
    voiceSurfaceUnusable,
  });
  const showSurfaceIndicators =
    layout !== "landscape" || inputMode !== "drive-session";
  const derivedProgress = useOrbTurnProgress({
    recordingMaxMs,
    recordingStartedAtMs: recordingStartedAtMs ?? null,
    speechStartProgress: speechStartProgress ?? null,
    visualPhase,
  });
  const progress = orbProgressOverride ?? derivedProgress;
  const showDriveCountdown =
    inputMode === "drive-session" &&
    visualPhase === "recording" &&
    !driveVoiceActive &&
    driveSilenceCountdownSeconds !== null;
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
    setViewportHeight((currentHeight) =>
      Math.abs(currentHeight - nextHeight) >= 1 ? nextHeight : currentHeight,
    );
  };

  return (
    <View style={styles.root}>
      <MessageImageAttachments
        attachments={attachments}
        colors={colors}
        compact
        onRemove={disabled || isActive ? undefined : onRemoveImage}
        t={t}
      />
      <View
        testID="voice-text-input-viewport"
        onLayout={handleViewportLayout}
        style={styles.viewportFlexible}
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
          onResolvePromptBlock={onResolvePromptBlock}
          onSubmitTextMessage={pager.handleSubmitTextMessage}
          onTextFocusChange={pager.setTextFocused}
          onTextMessageChange={pager.handleTextMessageChange}
          pageWidth={pager.pageWidth}
          panGesture={pager.panGesture}
          promptBlockedActionEnabled={promptBlockedActionEnabled}
          promptBlockedActionLabel={promptBlockedActionLabel}
          promptBlockedProgress={promptBlockedProgress}
          stageSize={stageSize}
          statusLabel={statusLabel}
          submissionDisabled={Boolean(promptBlockedMessage)}
          t={t}
          textFocused={pager.textFocused}
          textInputGesture={pager.textInputGesture}
          textInputRef={pager.textInputRef}
          textMessage={pager.textMessage}
          textSubmitDisabled={pager.textSubmitDisabled}
          trackAnimatedStyle={pager.trackAnimatedStyle}
          voiceInputUnavailableMessage={voiceInputUnavailableMessage}
        />
        {isActive ? (
          <View
            style={[styles.activeActionOverlay, styles.activeOrbOverlay]}
            testID={`voice-stage-${visualPhase}-orb`}
          >
            <VoiceOrb
              coreLabel={
                showDriveCountdown
                  ? String(driveSilenceCountdownSeconds)
                  : undefined
              }
              coreLabelColor={
                showDriveCountdown &&
                driveSilenceCountdownSeconds !== null &&
                driveSilenceCountdownSeconds <= 3
                  ? colors.danger
                  : undefined
              }
              label={statusLabel}
              onPress={inputMode === "push-to-talk" ? undefined : onPress}
              onPressIn={inputMode === "push-to-talk" ? onPressIn : undefined}
              onPressOut={inputMode === "push-to-talk" ? onPressOut : undefined}
              overtime={progress.overtime}
              phase={visualPhase}
              phaseProgress={
                visualPhase === "speaking" && playbackPaused
                  ? 0
                  : progress.phaseProgress
              }
              size={stageSize}
              testID="voice-orb-active"
              turnProgress={progress.turnProgress}
            />
          </View>
        ) : null}
      </View>

      {promptBlockedMessage && !promptBlockedActionLabel ? (
        <TouchableOpacity
          testID="prompt-blocked-notice"
          accessibilityLabel={`${promptBlockedMessage} ${t(
            "openSpeakingSettings",
          )}`}
          accessibilityRole={onResolvePromptBlock ? "button" : "text"}
          activeOpacity={onResolvePromptBlock ? 0.76 : 1}
          disabled={!onResolvePromptBlock}
          onPress={onResolvePromptBlock}
          style={[
            styles.promptBlockedNotice,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.danger,
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
                styles.promptBlockedText,
                { color: colors.textSecondary },
              ]}
            >
              {promptBlockedMessage}
            </Text>
            {onResolvePromptBlock ? (
              <Text
                style={[styles.promptBlockedAction, { color: colors.accent }]}
              >
                {t("openSpeakingSettings")}
              </Text>
            ) : null}
          </View>
          {onResolvePromptBlock ? (
            <PhosphorIcon
              name="right"
              size="compact"
              color={colors.textSecondary}
            />
          ) : null}
        </TouchableOpacity>
      ) : null}

      {inputMode === "drive-session" ? (
        <DriveSessionControls
          autoContinueEnabled={driveAutoContinueEnabled}
          canRepeat={driveSessionCanRepeat}
          colors={colors}
          disabled={disabled || Boolean(promptBlockedMessage)}
          onContinue={onDriveContinue}
          onRepeat={onDriveRepeat}
          onStop={onDriveStop}
          t={t}
        />
      ) : null}

      {showSurfaceIndicators ? (
        <View style={styles.composerToolbar}>
          <InputSurfaceIndicators
            activeSurface={pager.activeSurface}
            colors={colors}
            disabled={isActive}
            onSelect={(surface: InputSurface) => pager.selectSurface(surface)}
            t={t}
          />
        </View>
      ) : null}
    </View>
  );
}
