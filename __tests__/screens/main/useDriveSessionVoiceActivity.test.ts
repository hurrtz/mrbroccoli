import { act, renderHook } from "@testing-library/react-native";

import { recordDebugLogEvent } from "../../../src/services/debugLogCapture";
import { useDriveSessionVoiceActivity } from "../../../src/screens/main/voiceSession/useDriveSessionVoiceActivity";

jest.mock("../../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../../src/services/nativeWaveform", () => ({
  playNativeRecordingCue: jest.fn(async () => false),
}));

jest.mock("../../../src/services/playbackCues", () => ({
  getDriveCountdownCueAudioUri: jest.fn(async () => "file://cue.m4a"),
}));

describe("useDriveSessionVoiceActivity", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("auto-submits after repeated identical quiet microphone samples", async () => {
    const stopVoiceCapture = jest.fn(async () => undefined);
    const base = {
      ambientInputMetering: null,
      ambientInputMeteringSampleId: 0,
      ambientMonitoring: false,
      audioRoute: "built-in-mic",
      autoContinueEnabled: true,
      engaged: true,
      inputMetering: null as number | null,
      inputMeteringSampleId: 0,
      isBusy: false,
      isRecording: true,
      mainSurfaceVisible: true,
      playerIsPlaybackPaused: false,
      playerIsPlaying: false,
      replayPhase: "idle" as const,
      showToast: jest.fn(),
      stopVoiceCapture,
      t: jest.fn(() => "Could not process voice input") as any,
    };
    const view = renderHook(
      (props: typeof base) => useDriveSessionVoiceActivity(props),
      { initialProps: base },
    );

    const sample = (nowMs: number, metering: number, sampleId: number) => {
      act(() => {
        jest.setSystemTime(nowMs);
        view.rerender({
          ...base,
          inputMetering: metering,
          inputMeteringSampleId: sampleId,
        });
      });
    };

    sample(1_000, -20, 1);
    sample(1_150, -20, 2);
    expect(view.result.current.voiceActive).toBe(true);

    // React collapses repeated scalar state values. The sample ID proves that
    // each native microphone event still reaches the three-sample release.
    sample(1_300, -70, 3);
    sample(1_450, -70, 4);
    sample(1_600, -70, 5);
    expect(view.result.current.voiceActive).toBe(false);
    expect(view.result.current.silenceCountdownSeconds).toBe(10);

    await act(async () => {
      jest.advanceTimersByTime(9_600);
      await Promise.resolve();
    });

    expect(stopVoiceCapture).toHaveBeenCalledTimes(1);
  });

  it("learns from repeated identical ambient microphone samples", () => {
    const base = {
      ambientInputMetering: -30,
      ambientInputMeteringSampleId: 0,
      ambientMonitoring: true,
      audioRoute: "built-in-mic",
      autoContinueEnabled: true,
      engaged: true,
      inputMetering: null as number | null,
      inputMeteringSampleId: 0,
      isBusy: true,
      isRecording: false,
      mainSurfaceVisible: true,
      playerIsPlaybackPaused: false,
      playerIsPlaying: false,
      replayPhase: "idle" as const,
      showToast: jest.fn(),
      stopVoiceCapture: jest.fn(async () => undefined),
      t: jest.fn(() => "Could not process voice input") as any,
    };
    const view = renderHook(
      (props: typeof base) => useDriveSessionVoiceActivity(props),
      { initialProps: base },
    );

    for (const sampleId of [1, 2, 3]) {
      act(() => {
        jest.setSystemTime(sampleId * 150);
        view.rerender({
          ...base,
          ambientInputMeteringSampleId: sampleId,
        });
      });
    }

    expect(recordDebugLogEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "drive-session-acoustic-profile-updated",
        payload: expect.objectContaining({ ambientSampleCount: 3 }),
      }),
    );
  });
});
