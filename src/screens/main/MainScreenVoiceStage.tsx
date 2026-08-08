import React from "react";
import { View } from "react-native";

import { Colors } from "../../theme/colors";
import {
  InputMode,
  MessageImageAttachment,
  VoiceTimingProgress,
  VoiceVisualPhase,
} from "../../types";

import { TranslateFn } from "./shared";
import { styles } from "./styles";
import { InputSurface, VoiceTextInputPager } from "./VoiceTextInputPager";

interface MainScreenVoiceStageProps {
  colors: Colors;
  disabled?: boolean;
  driveAutoContinueEnabled?: boolean;
  driveSilenceCountdownSeconds?: number | null;
  driveSessionCanRepeat?: boolean;
  driveVoiceActive?: boolean;
  initialInputSurface?: InputSurface;
  initialTextMessage?: string;
  attachments?: MessageImageAttachment[];
  inputMode: InputMode;
  isActive: boolean;
  layout?: "portrait" | "landscape";
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onRemoveImage?: (attachmentId: string) => void;
  onDriveContinue?: () => void | Promise<void>;
  onDriveRepeat?: () => void | Promise<void>;
  onDriveStop?: () => void | Promise<void>;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onInterruptPlayback?: () => void;
  onStopPlayback: () => void;
  onResolvePromptBlock?: () => void;
  onSubmitTextMessage: (text: string) => void;
  onTextMessageChange?: (text: string) => void;
  playbackPaused?: boolean;
  promptBlockedActionEnabled?: boolean;
  promptBlockedActionLabel?: string | null;
  promptBlockedMessage?: string | null;
  promptBlockedProgress?: number | null;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  speechStartProgress?: VoiceTimingProgress | null;
  statusTitle: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
  voiceInputUnavailableMessage?: string | null;
  voiceSurfaceUnusable?: boolean;
}

export const MainScreenVoiceStage = React.memo(function MainScreenVoiceStage({
  attachments = [],
  colors,
  disabled = false,
  driveAutoContinueEnabled = false,
  driveSilenceCountdownSeconds = null,
  driveSessionCanRepeat = false,
  driveVoiceActive = false,
  initialInputSurface,
  initialTextMessage,
  inputMode,
  isActive,
  layout = "portrait",
  onInputSurfaceChange,
  onRemoveImage,
  onDriveContinue,
  onDriveRepeat,
  onDriveStop,
  onPress,
  onPressIn,
  onPressOut,
  onInterruptPlayback,
  onStopPlayback,
  onResolvePromptBlock,
  onSubmitTextMessage,
  onTextMessageChange,
  playbackPaused = false,
  promptBlockedActionEnabled = false,
  promptBlockedActionLabel = null,
  promptBlockedMessage = null,
  promptBlockedProgress = null,
  recordingMaxMs,
  recordingStartedAtMs = null,
  speechStartProgress = null,
  statusTitle,
  t,
  visualPhase,
  voiceInputUnavailableMessage = null,
  voiceSurfaceUnusable = false,
}: MainScreenVoiceStageProps) {
  return (
    <View
      testID={`voice-stage-${visualPhase}`}
      style={[
        styles.stageBlock,
        layout === "landscape" ? styles.stageBlockLandscape : null,
      ]}
    >
      <View
        style={[
          styles.voiceDock,
          {
            backgroundColor: "transparent",
            borderColor: "transparent",
          },
        ]}
      >
        <VoiceTextInputPager
          attachments={attachments}
          colors={colors}
          disabled={disabled}
          driveAutoContinueEnabled={driveAutoContinueEnabled}
          driveSilenceCountdownSeconds={
            driveSilenceCountdownSeconds
          }
          driveSessionCanRepeat={driveSessionCanRepeat}
          driveVoiceActive={driveVoiceActive}
          initialSurface={initialInputSurface}
          initialTextMessage={initialTextMessage}
          inputMode={inputMode}
          isActive={isActive}
          layout={layout}
          onInputSurfaceChange={onInputSurfaceChange}
          onRemoveImage={onRemoveImage}
          onDriveContinue={onDriveContinue}
          onDriveRepeat={onDriveRepeat}
          onDriveStop={onDriveStop}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onInterruptPlayback={onInterruptPlayback}
          onStopPlayback={onStopPlayback}
          onResolvePromptBlock={onResolvePromptBlock}
          onSubmitTextMessage={onSubmitTextMessage}
          onTextMessageChange={onTextMessageChange}
          playbackPaused={playbackPaused}
          promptBlockedActionEnabled={promptBlockedActionEnabled}
          promptBlockedActionLabel={promptBlockedActionLabel}
          promptBlockedMessage={promptBlockedMessage}
          promptBlockedProgress={promptBlockedProgress}
          recordingMaxMs={recordingMaxMs}
          recordingStartedAtMs={recordingStartedAtMs}
          speechStartProgress={speechStartProgress}
          statusLabel={statusTitle}
          t={t}
          visualPhase={visualPhase}
          voiceInputUnavailableMessage={voiceInputUnavailableMessage}
          voiceSurfaceUnusable={voiceSurfaceUnusable}
        />
      </View>
    </View>
  );
});
