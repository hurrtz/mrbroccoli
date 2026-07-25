import React from "react";
import { View } from "react-native";

import { Colors } from "../../theme/colors";
import { InputMode, VoicePhaseProgress, VoiceVisualPhase } from "../../types";

import { TranslateFn } from "./shared";
import { styles } from "./styles";
import { InputSurface, VoiceTextInputPager } from "./VoiceTextInputPager";

interface MainScreenVoiceStageProps {
  colors: Colors;
  disabled?: boolean;
  driveSessionActive?: boolean;
  driveSessionCanContinue?: boolean;
  driveSessionCanRepeat?: boolean;
  initialInputSurface?: InputSurface;
  initialTextMessage?: string;
  inputMode: InputMode;
  isActive: boolean;
  layout?: "portrait" | "landscape";
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onDriveContinue?: () => void | Promise<void>;
  onDriveRepeat?: () => void | Promise<void>;
  onDriveStop?: () => void | Promise<void>;
  onOpenStatusDetails: () => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onStopPlayback?: () => void | Promise<void>;
  onSubmitTextMessage: (text: string) => void;
  onTextMessageChange?: (text: string) => void;
  phaseLabel: string;
  phaseProgress?: VoicePhaseProgress | null;
  playbackActive?: boolean;
  playbackPaused?: boolean;
  recordingMaxMs: number;
  statusTitle: string;
  stopPlaybackLabel?: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}

export const MainScreenVoiceStage = React.memo(function MainScreenVoiceStage({
  colors,
  disabled = false,
  driveSessionActive = false,
  driveSessionCanContinue = false,
  driveSessionCanRepeat = false,
  initialInputSurface,
  initialTextMessage,
  inputMode,
  isActive,
  layout = "portrait",
  onInputSurfaceChange,
  onDriveContinue,
  onDriveRepeat,
  onDriveStop,
  onOpenStatusDetails,
  onPress,
  onPressIn,
  onPressOut,
  onStopPlayback,
  onSubmitTextMessage,
  onTextMessageChange,
  phaseLabel,
  phaseProgress,
  playbackActive = false,
  playbackPaused = false,
  recordingMaxMs,
  statusTitle,
  stopPlaybackLabel = "Stop",
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
          driveSessionActive={driveSessionActive}
          driveSessionCanContinue={driveSessionCanContinue}
          driveSessionCanRepeat={driveSessionCanRepeat}
          initialSurface={initialInputSurface}
          initialTextMessage={initialTextMessage}
          inputMode={inputMode}
          isActive={isActive}
          onInputSurfaceChange={onInputSurfaceChange}
          onDriveContinue={onDriveContinue}
          onDriveRepeat={onDriveRepeat}
          onDriveStop={onDriveStop}
          onOpenStatusDetails={onOpenStatusDetails}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onStopPlayback={onStopPlayback}
          onSubmitTextMessage={onSubmitTextMessage}
          onTextMessageChange={onTextMessageChange}
          phaseLabel={phaseLabel}
          phaseProgress={phaseProgress}
          playbackActive={playbackActive}
          playbackPaused={playbackPaused}
          recordingMaxMs={recordingMaxMs}
          statusLabel={statusTitle}
          stopPlaybackLabel={stopPlaybackLabel}
          t={t}
          visualPhase={visualPhase}
        />
      </View>
    </View>
  );
});
