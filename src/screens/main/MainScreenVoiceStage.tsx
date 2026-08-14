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
  /** Portrait controls centred with the orb/composer as one measured cluster. */
  footer?: React.ReactNode;
  initialInputSurface?: InputSurface;
  initialTextMessage?: string;
  attachments?: MessageImageAttachment[];
  inputMode: InputMode;
  isActive: boolean;
  layout?: "portrait" | "landscape";
  /** The orb's ceiling: 196 in portrait (156 under the intro banner), 150 in landscape. */
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
  onTextMessageChange?: (text: string) => void;
  orbProgressOverride?: OrbTurnProgress | null;
  playbackPaused?: boolean;
  promptBlockedActionEnabled?: boolean;
  promptBlockedActionLabel?: string | null;
  promptBlockedMessage?: string | null;
  readingProgress?: number | null;
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
  footer,
  initialInputSurface,
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
  onTextMessageChange,
  orbProgressOverride = null,
  playbackPaused = false,
  promptBlockedActionEnabled = false,
  promptBlockedActionLabel = null,
  promptBlockedMessage = null,
  readingProgress = null,
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
          footer={footer}
          initialSurface={initialInputSurface}
          initialTextMessage={initialTextMessage}
          inputMode={inputMode}
          isActive={isActive}
          layout={layout}
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
          onTextMessageChange={onTextMessageChange}
          orbProgressOverride={orbProgressOverride}
          playbackPaused={playbackPaused}
          promptBlockedActionEnabled={promptBlockedActionEnabled}
          promptBlockedActionLabel={promptBlockedActionLabel}
          promptBlockedMessage={promptBlockedMessage}
          readingProgress={readingProgress}
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
