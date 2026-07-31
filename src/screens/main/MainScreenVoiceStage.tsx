import React from "react";
import { View } from "react-native";

import { Colors } from "../../theme/colors";
import {
  InputMode,
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
  inputMode: InputMode;
  isActive: boolean;
  layout?: "portrait" | "landscape";
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onDriveContinue?: () => void | Promise<void>;
  onDriveRepeat?: () => void | Promise<void>;
  onDriveStop?: () => void | Promise<void>;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onResolvePromptBlock?: () => void;
  onSubmitTextMessage: (text: string) => void;
  onTextMessageChange?: (text: string) => void;
  playbackPaused?: boolean;
  promptBlockedMessage?: string | null;
  promptBlockedProgress?: number | null;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  speechStartProgress?: VoiceTimingProgress | null;
  statusTitle: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}

export const MainScreenVoiceStage = React.memo(function MainScreenVoiceStage({
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
  onDriveContinue,
  onDriveRepeat,
  onDriveStop,
  onPress,
  onPressIn,
  onPressOut,
  onResolvePromptBlock,
  onSubmitTextMessage,
  onTextMessageChange,
  playbackPaused = false,
  promptBlockedMessage = null,
  promptBlockedProgress = null,
  recordingMaxMs,
  recordingStartedAtMs = null,
  speechStartProgress = null,
  statusTitle,
  t,
  visualPhase,
}: MainScreenVoiceStageProps) {
  return (
    <View
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
          onDriveContinue={onDriveContinue}
          onDriveRepeat={onDriveRepeat}
          onDriveStop={onDriveStop}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onResolvePromptBlock={onResolvePromptBlock}
          onSubmitTextMessage={onSubmitTextMessage}
          onTextMessageChange={onTextMessageChange}
          playbackPaused={playbackPaused}
          promptBlockedMessage={promptBlockedMessage}
          promptBlockedProgress={promptBlockedProgress}
          recordingMaxMs={recordingMaxMs}
          recordingStartedAtMs={recordingStartedAtMs}
          speechStartProgress={speechStartProgress}
          statusLabel={statusTitle}
          t={t}
          visualPhase={visualPhase}
        />
      </View>
    </View>
  );
});
