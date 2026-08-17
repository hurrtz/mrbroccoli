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
  isRecording: boolean;
  onRepeat: () => Promise<void>;
  onStopRecording: () => Promise<void>;
  onToggleHandsFree: () => void;
  player: AudioPlayerController;
  t: TranslateFn;
}

export function useVoiceRemoteControls({
  canRepeat,
  handsFreeEnabled,
  isRecording,
  onRepeat,
  onStopRecording,
  onToggleHandsFree,
  player,
  t,
}: UseVoiceRemoteControlsParams) {
  const callbacksRef = useRef({
    onRepeat,
    onStopRecording,
    onToggleHandsFree,
    player,
  });
  callbacksRef.current = {
    onRepeat,
    onStopRecording,
    onToggleHandsFree,
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
    return handsFreeEnabled ? "drive-active" : "drive-paused";
  }, [
    handsFreeEnabled,
    isRecording,
    player.isPlaybackPaused,
    player.isPlaying,
    player.usesNativeAudioQueue,
  ]);

  useEffect(() => {
    setVoiceRemoteControlState({
      canRepeat,
      continueLabel: t("handsFree"),
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

      if (action === "repeat") {
        void current.onRepeat();
        return;
      }
      if (action === "stop") {
        void current.onStopRecording();
        return;
      }
      if (action === "pause") {
        current.onToggleHandsFree();
        return;
      }
      current.onToggleHandsFree();
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
