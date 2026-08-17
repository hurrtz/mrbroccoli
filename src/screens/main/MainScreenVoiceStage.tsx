import React from "react";
import { View } from "react-native";

import { Colors } from "../../theme/colors";
import { InputMode, VoiceTimingProgress, VoiceVisualPhase } from "../../types";

import { TranslateFn } from "./shared";
import { styles } from "./styles";
import { InputSurface, VoiceTextInputPager } from "./VoiceTextInputPager";
import type { OrbTurnProgress } from "./useOrbTurnProgress";

interface MainScreenVoiceStageProps {
  colors: Colors;
  compactPromptNotice?: boolean;
  disabled?: boolean;
  /** Controls centred with the orb/composer as one measured cluster. */
  footer?: React.ReactNode;
  initialInputSurface?: InputSurface;
  initialTextInputFocused?: boolean;
  initialTextMessage?: string;
  inputMode: InputMode;
  isActive: boolean;
  handsFreeSilenceCountdownSeconds?: number | null;
  handsFreeVoiceActive?: boolean;
  layout?: "portrait" | "landscape";
  /** Surface-specific orb ceiling; the measured pager still shrinks below it. */
  maxOrbSize: number;
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onInterruptPlayback?: () => void;
  onRestartReply?: () => void;
  onSeekBack?: () => void;
  onSeekForward?: () => void;
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
  rtl?: boolean;
  visualPhase: VoiceVisualPhase;
  voiceInputUnavailableMessage?: string | null;
}

export const MainScreenVoiceStage = React.memo(function MainScreenVoiceStage({
  colors,
  compactPromptNotice = false,
  disabled = false,
  footer,
  initialInputSurface,
  initialTextInputFocused,
  initialTextMessage,
  inputMode,
  isActive,
  handsFreeSilenceCountdownSeconds = null,
  handsFreeVoiceActive = false,
  layout = "portrait",
  maxOrbSize,
  onInputSurfaceChange,
  onPress,
  onPressIn,
  onPressOut,
  onInterruptPlayback,
  onRestartReply,
  onSeekBack,
  onSeekForward,
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
  rtl = false,
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
          colors={colors}
          compactPromptNotice={compactPromptNotice}
          disabled={disabled}
          footer={footer}
          initialSurface={initialInputSurface}
          initialTextInputFocused={initialTextInputFocused}
          initialTextMessage={initialTextMessage}
          inputMode={inputMode}
          isActive={isActive}
          handsFreeSilenceCountdownSeconds={handsFreeSilenceCountdownSeconds}
          handsFreeVoiceActive={handsFreeVoiceActive}
          maxOrbSize={maxOrbSize}
          onInputSurfaceChange={onInputSurfaceChange}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onInterruptPlayback={onInterruptPlayback}
          onRestartReply={onRestartReply}
          onSeekBack={onSeekBack}
          onSeekForward={onSeekForward}
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
          rtl={rtl}
          showTransportLabels={layout !== "landscape"}
          transportLabels={{
            back: t("transportBack"),
            forward: t("transportForward"),
            restart: t("transportRestart"),
            stop: t("stop"),
          }}
          visualPhase={visualPhase}
          voiceInputUnavailableMessage={voiceInputUnavailableMessage}
        />
      </View>
    </View>
  );
});
