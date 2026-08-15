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
import type { OrbTurnProgress } from "./useOrbTurnProgress";

interface MainScreenVoiceStageProps {
  colors: Colors;
  compactPromptNotice?: boolean;
  disabled?: boolean;
  driveSilenceCountdownSeconds?: number | null;
  driveVoiceActive?: boolean;
  /** Controls centred with the orb/composer as one measured cluster. */
  footer?: React.ReactNode;
  initialInputSurface?: InputSurface;
  initialTextInputFocused?: boolean;
  initialTextMessage?: string;
  attachments?: MessageImageAttachment[];
  inputMode: InputMode;
  isActive: boolean;
  layout?: "portrait" | "landscape";
  /** Surface-specific orb ceiling; the measured pager still shrinks below it. */
  maxOrbSize: number;
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onRemoveImage?: (attachmentId: string) => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onInterruptPlayback?: () => void;
  onStopPlayback: () => void;
  onResolvePromptBlock?: () => void;
  onSubmitTextMessage: (text: string) => void;
  onTextInputFocusChange?: (focused: boolean) => void;
  onTextMessageChange?: (text: string) => void;
  orbProgressOverride?: OrbTurnProgress | null;
  playbackPaused?: boolean;
  promptBlockedActionEnabled?: boolean;
  promptBlockedActionLabel?: string | null;
  promptBlockedMessage?: string | null;
  readingProgress?: number | null;
  readingProgressTiming?: OrbTurnProgress["phaseProgressTiming"] | null;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  phaseTimingProgress?: VoiceTimingProgress | null;
  speechStartProgress?: VoiceTimingProgress | null;
  statusTitle: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
  voiceInputUnavailableMessage?: string | null;
}

export const MainScreenVoiceStage = React.memo(function MainScreenVoiceStage({
  attachments = [],
  colors,
  compactPromptNotice = false,
  disabled = false,
  driveSilenceCountdownSeconds = null,
  driveVoiceActive = false,
  footer,
  initialInputSurface,
  initialTextInputFocused,
  initialTextMessage,
  inputMode,
  isActive,
  layout = "portrait",
  maxOrbSize,
  onInputSurfaceChange,
  onRemoveImage,
  onPress,
  onPressIn,
  onPressOut,
  onInterruptPlayback,
  onStopPlayback,
  onResolvePromptBlock,
  onSubmitTextMessage,
  onTextInputFocusChange,
  onTextMessageChange,
  orbProgressOverride = null,
  playbackPaused = false,
  promptBlockedActionEnabled = false,
  promptBlockedActionLabel = null,
  promptBlockedMessage = null,
  readingProgress = null,
  readingProgressTiming = null,
  recordingMaxMs,
  recordingStartedAtMs = null,
  phaseTimingProgress = null,
  speechStartProgress = null,
  statusTitle,
  t,
  visualPhase,
  voiceInputUnavailableMessage = null,
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
          compactPromptNotice={compactPromptNotice}
          disabled={disabled}
          driveSilenceCountdownSeconds={driveSilenceCountdownSeconds}
          driveVoiceActive={driveVoiceActive}
          footer={footer}
          initialSurface={initialInputSurface}
          initialTextInputFocused={initialTextInputFocused}
          initialTextMessage={initialTextMessage}
          inputMode={inputMode}
          isActive={isActive}
          maxOrbSize={maxOrbSize}
          onInputSurfaceChange={onInputSurfaceChange}
          onRemoveImage={onRemoveImage}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onInterruptPlayback={onInterruptPlayback}
          onStopPlayback={onStopPlayback}
          onResolvePromptBlock={onResolvePromptBlock}
          onSubmitTextMessage={onSubmitTextMessage}
          onTextInputFocusChange={onTextInputFocusChange}
          onTextMessageChange={onTextMessageChange}
          orbProgressOverride={orbProgressOverride}
          playbackPaused={playbackPaused}
          promptBlockedActionEnabled={promptBlockedActionEnabled}
          promptBlockedActionLabel={promptBlockedActionLabel}
          promptBlockedMessage={promptBlockedMessage}
          readingProgress={readingProgress}
          readingProgressTiming={readingProgressTiming}
          recordingMaxMs={recordingMaxMs}
          recordingStartedAtMs={recordingStartedAtMs}
          phaseTimingProgress={phaseTimingProgress}
          speechStartProgress={speechStartProgress}
          statusLabel={statusTitle}
          t={t}
          visualPhase={visualPhase}
          voiceInputUnavailableMessage={voiceInputUnavailableMessage}
        />
      </View>
    </View>
  );
});
