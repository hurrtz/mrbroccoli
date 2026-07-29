import React from "react";
import { View } from "react-native";
import { PhaseAwareVoiceAction } from "./PhaseAwareVoiceAction";
import { DriveSessionControls } from "./voiceTextInputPager/DriveSessionControls";
import { InputSurfaceIndicators } from "./voiceTextInputPager/InputSurfaceIndicators";
import { InputSurfacePages } from "./voiceTextInputPager/InputSurfacePages";
import {
  voiceTextInputPagerStyles as styles,
} from "./voiceTextInputPager/styles";
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
  onSubmitTextMessage,
  onTextMessageChange,
  playbackPaused,
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
  });

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
          statusLabel={statusLabel}
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
              driveSilenceCountdownSeconds={
                driveSilenceCountdownSeconds
              }
              driveVoiceActive={driveVoiceActive}
              inputMode={inputMode}
              layout={layout}
              onPress={onPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
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

      {inputMode === "drive-session" ? (
        <DriveSessionControls
          autoContinueEnabled={driveAutoContinueEnabled}
          canRepeat={driveSessionCanRepeat}
          colors={colors}
          disabled={disabled}
          onContinue={onDriveContinue}
          onRepeat={onDriveRepeat}
          onStop={onDriveStop}
          t={t}
        />
      ) : null}

      <InputSurfaceIndicators
        activeSurface={pager.activeSurface}
        colors={colors}
        disabled={isActive}
        onSelect={(surface: InputSurface) => pager.selectSurface(surface)}
        t={t}
      />
    </View>
  );
}
