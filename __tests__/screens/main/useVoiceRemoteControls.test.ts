import { act, renderHook } from "@testing-library/react-native";

import { useVoiceRemoteControls } from "../../../src/screens/main/voiceSession/useVoiceRemoteControls";
import {
  setVoiceRemoteControlState,
  subscribeToVoiceRemoteActions,
} from "../../../src/services/voiceRemoteControls";

jest.mock("../../../src/services/voiceRemoteControls", () => ({
  clearVoiceRemoteControls: jest.fn(),
  setVoiceRemoteControlState: jest.fn(),
  subscribeToVoiceRemoteActions: jest.fn(() => jest.fn()),
}));

function params() {
  return {
    canRepeat: false,
    handsFreeEnabled: false,
    drivePaused: false,
    isRecording: false,
    onRepeat: jest.fn(async () => undefined),
    onStopRecording: jest.fn(async () => undefined),
    onPauseHandsFree: jest.fn(),
    onResumeHandsFree: jest.fn(),
    player: {
      isPlaybackPaused: false,
      isPlaying: false,
      usesNativeAudioQueue: true,
      enqueueAudio: jest.fn(),
      pausePlayback: jest.fn(async () => true),
      resumePlayback: jest.fn(async () => true),
      resetCancellation: jest.fn(),
      speakText: jest.fn(),
      stopPlayback: jest.fn(async () => undefined),
      waitForDrain: jest.fn(async () => undefined),
      waitForPlaybackRouteSettle: jest.fn(async () => undefined),
    },
    t: (key: string) => key,
  };
}

it("clears idle native controls and scopes remote commands to the active owner", () => {
  const props = params();
  const { rerender } = renderHook(
    (current: typeof props) => useVoiceRemoteControls(current),
    { initialProps: props },
  );
  const dispatch = jest.mocked(subscribeToVoiceRemoteActions).mock.calls[0][0];
  expect(setVoiceRemoteControlState).toHaveBeenLastCalledWith(
    expect.objectContaining({ mode: "inactive" }),
  );
  act(() => dispatch("continue"));
  expect(props.onResumeHandsFree).not.toHaveBeenCalled();

  rerender({
    ...props,
    handsFreeEnabled: true,
    player: { ...props.player, isPlaying: true },
  });
  act(() => {
    dispatch("pause");
    dispatch("pause");
    dispatch("stop");
  });
  expect(props.player.pausePlayback).toHaveBeenCalledTimes(2);
  expect(props.player.resumePlayback).not.toHaveBeenCalled();
  expect(props.onPauseHandsFree).not.toHaveBeenCalled();
  expect(props.onStopRecording).not.toHaveBeenCalled();
  rerender({ ...props, player: { ...props.player, isPlaybackPaused: true } });
  act(() => dispatch("continue"));
  expect(props.player.resumePlayback).toHaveBeenCalledTimes(1);

  rerender({ ...props, handsFreeEnabled: true });
  act(() => dispatch("pause"));
  expect(props.onPauseHandsFree).toHaveBeenCalledTimes(1);
  rerender({ ...props, drivePaused: true });
  expect(setVoiceRemoteControlState).toHaveBeenLastCalledWith(
    expect.objectContaining({ mode: "drive-paused" }),
  );
  act(() => dispatch("continue"));
  expect(props.onResumeHandsFree).toHaveBeenCalledTimes(1);
  rerender({ ...props, isRecording: true });
  act(() => dispatch("stop"));
  expect(props.onStopRecording).toHaveBeenCalledTimes(1);
});
