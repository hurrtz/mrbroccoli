import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PhaseAwareVoiceAction } from "./PhaseAwareVoiceAction";
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
  onDriveContinue,
  onDriveRepeat,
  onDriveStop,
  onPress,
  onPressIn,
  onPressOut,
  onStopPlayback,
  onResolvePromptBlock,
  onSubmitTextMessage,
  onTextMessageChange,
  playbackPaused,
  promptBlockedActionLabel = null,
  promptBlockedMessage = null,
  promptBlockedProgress = null,
  recordingMaxMs,
  recordingStartedAtMs,
  speechStartProgress,
  statusLabel,
  t,
  visualPhase,
}: VoiceTextInputPagerProps) {
  const pager = useInputSurfacePager({
    disabled,
    initialSurface,
    initialTextMessage,
    isActive,
    onInputSurfaceChange,
    onSubmitTextMessage,
    onTextMessageChange,
    submissionDisabled: Boolean(promptBlockedMessage),
  });
  const showSurfaceIndicators =
    layout !== "landscape" || inputMode !== "drive-session";

  return (
    <View style={styles.root}>
      <View
        testID="voice-text-input-viewport"
        onLayout={pager.handleLayout}
        style={styles.viewport}
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
          onSubmitTextMessage={pager.handleSubmitTextMessage}
          onTextFocusChange={pager.setTextFocused}
          onTextMessageChange={pager.handleTextMessageChange}
          pageWidth={pager.pageWidth}
          panGesture={pager.panGesture}
          promptBlockedActionLabel={promptBlockedActionLabel}
          promptBlockedProgress={promptBlockedProgress}
          statusLabel={statusLabel}
          submissionDisabled={Boolean(promptBlockedMessage)}
          t={t}
          textFocused={pager.textFocused}
          textInputGesture={pager.textInputGesture}
          textInputRef={pager.textInputRef}
          textMessage={pager.textMessage}
          textSubmitDisabled={pager.textSubmitDisabled}
          trackAnimatedStyle={pager.trackAnimatedStyle}
        />
        {isActive ? (
          <View style={styles.activeActionOverlay}>
            <PhaseAwareVoiceAction
              colors={colors}
              driveSilenceCountdownSeconds={driveSilenceCountdownSeconds}
              driveVoiceActive={driveVoiceActive}
              inputMode={inputMode}
              layout={layout}
              onPress={onPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onStopPlayback={onStopPlayback}
              playbackPaused={playbackPaused}
              recordingMaxMs={recordingMaxMs}
              recordingStartedAtMs={recordingStartedAtMs}
              speechStartProgress={speechStartProgress}
              statusLabel={statusLabel}
              t={t}
              visualPhase={visualPhase}
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
        <InputSurfaceIndicators
          activeSurface={pager.activeSurface}
          colors={colors}
          disabled={isActive}
          onSelect={(surface: InputSurface) => pager.selectSurface(surface)}
          t={t}
        />
      ) : null}
    </View>
  );
}
