import { useEffect, useMemo, useRef } from "react";

import {
  clearVoiceRemoteControls,
  setVoiceRemoteControlState,
  subscribeToVoiceRemoteActions,
  type VoiceRemoteAction,
  type VoiceRemoteControlMode,
} from "../../../services/voiceRemoteControls";
import type { AudioPlayerController } from "./types";
import type { TranslateFn } from "../shared";

interface UseVoiceRemoteControlsParams {
  canRepeat: boolean;
  driveActive: boolean;
  driveEnabled: boolean;
  isRecording: boolean;
  onContinueDrive: () => void;
  onPauseDrive: () => void;
  onRepeat: () => Promise<void>;
  onStopRecording: () => Promise<void>;
  player: AudioPlayerController;
  t: TranslateFn;
}

export function useVoiceRemoteControls({
  canRepeat,
  driveActive,
  driveEnabled,
  isRecording,
  onContinueDrive,
  onPauseDrive,
  onRepeat,
  onStopRecording,
  player,
  t,
}: UseVoiceRemoteControlsParams) {
  const callbacksRef = useRef({
    onContinueDrive,
    onPauseDrive,
    onRepeat,
    onStopRecording,
    player,
  });
  callbacksRef.current = {
    onContinueDrive,
    onPauseDrive,
    onRepeat,
    onStopRecording,
    player,
  };

  const mode = useMemo<VoiceRemoteControlMode>(() => {
    if (isRecording) {
      return "recording";
    }
    if (player.isPlaybackPaused || player.isPlaying) {
      return player.usesNativeAudioQueue
        ? player.isPlaybackPaused
          ? "playback-paused"
          : "playback-active"
        : "inactive";
    }
    if (driveEnabled) {
      return driveActive ? "drive-active" : "drive-paused";
    }
    return "inactive";
  }, [
    driveActive,
    driveEnabled,
    isRecording,
    player.isPlaybackPaused,
    player.isPlaying,
    player.usesNativeAudioQueue,
  ]);

  useEffect(() => {
    setVoiceRemoteControlState({
      canRepeat,
      continueLabel: t("continueDriveSession"),
      mode,
      pauseLabel: t("pause"),
      phaseLabel:
        mode === "recording"
          ? t("listening")
          : mode.startsWith("playback")
            ? t("speaking")
            : t("driveSession"),
      repeatLabel: t("repeatDriveReply"),
      stopLabel: t("stop"),
    });
  }, [canRepeat, mode, t]);

  useEffect(() => {
    const handleAction = (action: VoiceRemoteAction) => {
      const current = callbacksRef.current;

      if (action === "repeat") {
        void current.onRepeat();
        return;
      }
      if (action === "stop") {
        void current.onStopRecording();
        return;
      }
      if (action === "pause") {
        if (current.player.isPlaying) {
          void current.player.pausePlayback();
        } else {
          current.onPauseDrive();
        }
        return;
      }
      if (current.player.isPlaybackPaused) {
        void current.player.resumePlayback();
      } else {
        current.onContinueDrive();
      }
    };

    return subscribeToVoiceRemoteActions(handleAction);
  }, []);

  useEffect(
    () => () => {
      clearVoiceRemoteControls();
    },
    [],
  );
}
