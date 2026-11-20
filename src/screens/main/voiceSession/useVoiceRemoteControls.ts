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
  handsFreeEnabled: boolean;
  drivePaused: boolean;
  isRecording: boolean;
  onRepeat: () => Promise<void>;
  onStopRecording: () => Promise<void>;
  onPauseHandsFree: () => void;
  onResumeHandsFree: () => void;
  player: AudioPlayerController;
  t: TranslateFn;
}

export function useVoiceRemoteControls({
  canRepeat,
  drivePaused,
  handsFreeEnabled,
  isRecording,
  onRepeat,
  onStopRecording,
  onPauseHandsFree,
  onResumeHandsFree,
  player,
  t,
}: UseVoiceRemoteControlsParams) {
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
    if (handsFreeEnabled) return "drive-active";
    return drivePaused ? "drive-paused" : "inactive";
  }, [
    drivePaused,
    handsFreeEnabled,
    isRecording,
    player.isPlaybackPaused,
    player.isPlaying,
    player.usesNativeAudioQueue,
  ]);

  const callbacks = {
    canRepeat,
    mode,
    onPauseHandsFree,
    onResumeHandsFree,
    onRepeat,
    onStopRecording,
    player,
  };
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    setVoiceRemoteControlState({
      canRepeat,
      continueLabel: mode === "playback-paused" ? t("resume") : t("handsFree"),
      mode,
      pauseLabel: t("pause"),
      phaseLabel:
        mode === "recording"
          ? t("listening")
          : mode.startsWith("playback")
            ? t("speaking")
            : t("handsFree"),
      repeatLabel: t("repeatDriveReply"),
      stopLabel: t("stop"),
    });
  }, [canRepeat, mode, t]);

  useEffect(() => {
    const handleAction = (action: VoiceRemoteAction) => {
      const current = callbacksRef.current;

      switch (action) {
        case "repeat":
          if (current.canRepeat && current.mode !== "inactive")
            void current.onRepeat();
          break;
        case "stop":
          if (current.mode === "recording") void current.onStopRecording();
          break;
        case "pause":
          if (current.mode === "playback-active")
            void current.player.pausePlayback();
          if (current.mode === "drive-active") current.onPauseHandsFree();
          break;
        case "continue":
          if (current.mode === "playback-paused")
            void current.player.resumePlayback();
          if (current.mode === "drive-paused") current.onResumeHandsFree();
          break;
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
